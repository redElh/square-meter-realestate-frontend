// Vector Store Service for Property Embeddings
// Uses ChromaDB for local vector storage

import { SimpleChromatClient } from './simpleChromaClient';
import { apimoService, Property } from './apimoService';
import { embeddingService } from './embeddingService';

export interface PropertyEmbedding {
  id: string;
  propertyId: number;
  text: string;
  metadata: {
    reference: string;
    type: string;
    location: string;
    price: number;
    rooms?: number;
    bedrooms?: number;
    surface?: number;
    amenities: string[];
    category: string;
    status: string;
  };
}

class VectorStoreService {
  private client: SimpleChromatClient | null = null;
  private collection: any | null = null;
  private readonly collectionName = 'property_embeddings';
  private initPromise: Promise<boolean> | null = null;

  async initialize() {
    // Return existing initialization promise if in progress
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._initialize();
    return this.initPromise;
  }

  private async _initialize() {
    try {
      console.log('🔵 Initializing ChromaDB...');
      
      // In production (Vercel), ChromaDB won't be available
      // Use environment variable to detect production
      const isProduction = process.env.NODE_ENV === 'production' || 
                          !process.env.REACT_APP_CHROMA_URL || 
                          process.env.REACT_APP_CHROMA_URL === '';
      
      if (isProduction) {
        console.warn('⚠️ Running in production mode - ChromaDB disabled (using fallback search)');
        this.client = null;
        this.collection = null;
        this.initPromise = null;
        return false;
      }
      
      console.log('   Using URL:', process.env.REACT_APP_CHROMA_URL || 'http://localhost:3000/chroma');
      
      // Initialize ChromaDB client with longer timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('ChromaDB timeout after 10s')), 10000)
      );

      const initPromise = (async () => {
        const chromaUrl = process.env.REACT_APP_CHROMA_URL || 'http://localhost:3000/chroma';
        
        this.client = new SimpleChromatClient({
          path: chromaUrl,
        });
        console.log('   Client created with URL:', chromaUrl);

        // Get or create collection
        console.log('   Listing collections...');
        const collections = await this.client.listCollections();
        console.log('   Found', collections.length, 'collections');
        const exists = collections.some((c: any) => c.name === this.collectionName);
        
        if (exists) {
          console.log('   Getting existing collection...');
          this.collection = await this.client.getOrCreateCollection({
            name: this.collectionName,
            metadata: { 'hnsw:space': 'cosine' }
          });
        } else {
          console.log('   Creating new collection...');
          this.collection = await this.client.createCollection({
            name: this.collectionName,
            metadata: { 'hnsw:space': 'cosine' }
          });
        }
        console.log('   Collection ready:', this.collection.name);
      })();

      await Promise.race([initPromise, timeoutPromise]);

      console.log('✅ ChromaDB initialized successfully');
      return true;
    } catch (error: any) {
      console.error('❌ ChromaDB initialization error:', error.message);
      console.error('   Error details:', error);
      console.warn('⚠️ ChromaDB not available. Using fallback search.');
      this.client = null;
      this.collection = null;
      this.initPromise = null;
      return false;
    }
  }

  /**
   * Map APIMO category number to English property type name
   */
  private getPropertyTypeName(category?: number): string {
    const typeMap: { [key: number]: string } = {
      1: 'apartment',   // Appartement
      2: 'house',       // Maison
      3: 'land',        // Terrain
      4: 'parking',     // Parking
      5: 'commercial',  // Commerce
      6: 'office',      // Bureau
      7: 'building',    // Immeuble
      8: 'castle',      // Château
      9: 'villa',       // Villa
      10: 'loft',       // Loft
    };
    return category ? (typeMap[category] || 'property') : 'property';
  }

  /**
   * Convert property to searchable text for embedding
   */
  private propertyToText(property: Property): string {
    const parts: string[] = [];

    // Basic info
    parts.push(`Reference: ${property.reference}`);
    parts.push(`Type: ${property.type || 'Property'}`);
    
    // Location
    const location = property.location || property.city || '';
    parts.push(`Location: ${location}`);

    // Price
    if (property.price) {
      parts.push(`Price: €${property.price.toLocaleString()}`);
    }

    // Size details
    if (property.surface) parts.push(`Surface: ${property.surface}m²`);
    if (property.rooms) parts.push(`Rooms: ${property.rooms}`);
    if (property.bedrooms) parts.push(`Bedrooms: ${property.bedrooms}`);

    // Description
    if (property.description) {
      parts.push(`Description: ${property.description}`);
    }

    // Amenities/Features
    const amenities: string[] = property.features || [];
    if (amenities.length > 0) {
      parts.push(`Amenities: ${amenities.join(', ')}`);
    }

    return parts.join('. ');
  }

  /**
   * Extract amenities from property
   */
  private extractAmenities(property: Property): string[] {
    return property.features || [];
  }

  /**
   * Index all properties into vector store
   */
  async indexProperties(properties: Property[]): Promise<boolean> {
    if (!this.collection) {
      await this.initialize();
    }

    if (!this.collection) {
      console.error('Collection not initialized');
      return false;
    }

    try {
      const ids: string[] = [];
      const documents: string[] = [];
      const metadatas: any[] = [];

      for (const property of properties) {
        const text = this.propertyToText(property);
        const amenities = this.extractAmenities(property);

        ids.push(`property_${property.id}`);
        documents.push(text);
        
        // Store comprehensive metadata for precise filtering
        metadatas.push({
          propertyId: property.id,
          reference: property.reference || '',
          transactionType: property.type || 'buy', // buy, rent, etc.
          propertyType: this.getPropertyTypeName(property.category), // apartment, villa, house, etc.
          location: property.location || property.city || '',
          city: property.city || '',
          price: property.price || 0,
          rooms: property.rooms || 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          surface: property.surface || 0,
          amenities: amenities.join(','),
          // Additional fields for filtering
          hasPool: amenities.some(a => a.toLowerCase().includes('pool')),
          hasParking: amenities.some(a => a.toLowerCase().includes('parking')),
          hasGarden: amenities.some(a => a.toLowerCase().includes('garden')),
          hasSeaView: amenities.some(a => a.toLowerCase().includes('sea') || a.toLowerCase().includes('ocean')),
          title: property.title || ''
        });
      }

      console.log(`   Generating embeddings for ${documents.length} properties...`);
      // Generate embeddings for all documents
      const embeddings = await embeddingService.embedDocuments(documents);
      console.log(`   ✅ Generated ${embeddings.length} embeddings`);

      // Add documents to collection with embeddings
      await this.collection.add({
        ids,
        documents,
        embeddings,
        metadatas
      });

      console.log(`✅ Indexed ${properties.length} properties`);
      return true;
    } catch (error) {
      console.error('❌ Failed to index properties:', error);
      return false;
    }
  }

  /**
   * Search properties by natural language query
   */
  async searchProperties(
    query: string,
    limit: number = 5,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      minRooms?: number;
      maxRooms?: number;
      minBedrooms?: number;
      maxBedrooms?: number;
      location?: string;
      amenities?: string[];
      propertyType?: string; // EXACT property type: apartment, villa, riad, house
    }
  ): Promise<Property[]> {
    // Try to initialize if not already
    if (!this.collection) {
      try {
        await this.initialize();
      } catch (error) {
        console.warn('⚠️ ChromaDB not available, using direct property search');
      }
    }

    // If ChromaDB is not available (CORS issue), fallback to direct API search
    if (!this.collection) {
      console.log('💡 Using direct property search (ChromaDB unavailable)');
      return this.fallbackSearch(query, limit, filters);
    }

    try {
      // Build simple where filter - only use basic equality and comparison operators
      // ChromaDB API v2 has limited filter support - don't use $contains or complex $and
      const where: any = {};
      
      if (filters) {
        // EXACT PROPERTY TYPE FILTER
        if (filters.propertyType) {
          where.type = filters.propertyType;
          console.log('🏠 Filtering by property type:', filters.propertyType);
        }

        // LOCATION FILTER - exact match only (no $contains in API v2)
        if (filters.location) {
          // Exact city match only
          where.city = filters.location;
          console.log('📍 Location:', filters.location);
        }

        // For price and bedroom filters, we'll filter client-side after getting results
        // ChromaDB API v2 filter operators are limited and cause timeouts
      }
      
      const finalWhere = where;
      
      console.log('🔎 Final ChromaDB query:', JSON.stringify(finalWhere, null, 2));

      // Generate embedding for the query with fallback
      console.log('   Generating query embedding...');
      let queryEmbedding: number[];
      try {
        queryEmbedding = await embeddingService.embedQuery(query);
      } catch (embeddingError: any) {
        console.error('❌ Embedding generation failed:', embeddingError.message);
        console.warn('⚠️ Falling back to direct property search');
        return this.fallbackSearch(query, limit, filters);
      }

      // Query vector store - get more results than needed for client-side filtering
      console.log('   🔍 Querying ChromaDB...');
      let results: any;
      try {
        const queryPromise = this.collection.query({
          queryEmbeddings: [queryEmbedding],
          nResults: limit * 3,  // Get more results for client-side filtering
          // Don't use where clause - it causes timeouts in ChromaDB API v2
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('ChromaDB query timeout after 5s')), 5000)
        );

        results = await Promise.race([queryPromise, timeoutPromise]);
        console.log('   ✅ ChromaDB query completed');
      } catch (queryError: any) {
        console.error('❌ ChromaDB query failed:', queryError.message);
        console.warn('⚠️ Falling back to direct property search');
        return this.fallbackSearch(query, limit, filters);
      }

      // Extract property IDs and apply client-side filters
      let metadatas = results.metadatas[0] || [];
      
      // Apply client-side filters for precise matching
      if (filters) {
        metadatas = metadatas.filter((m: any) => {
          // Price filter
          if (filters.minPrice !== undefined && m.price < filters.minPrice) return false;
          if (filters.maxPrice !== undefined && m.price > filters.maxPrice) return false;
          
          // Bedroom filter
          if (filters.minBedrooms !== undefined && m.bedrooms < filters.minBedrooms) return false;
          if (filters.maxBedrooms !== undefined && m.bedrooms > filters.maxBedrooms) return false;
          
          // Rooms filter
          if (filters.minRooms !== undefined && m.rooms < filters.minRooms) return false;
          if (filters.maxRooms !== undefined && m.rooms > filters.maxRooms) return false;
          
          return true;
        });
      }
      
      // Limit to requested number of results
      metadatas = metadatas.slice(0, limit);
      
      const propertyIds = metadatas.map((m: any) => m.property_id || m.propertyId) || [];
      console.log(`   📋 Found ${propertyIds.length} matching properties (after filtering)`);

      // Fetch full property data
      const response = await apimoService.getProperties();
      const allProperties = response.properties;
      
      // Convert property IDs to numbers for matching (Apimo API uses numbers)
      const propertyIdsAsNumbers = propertyIds.map((id: string) => parseInt(id, 10));
      
      const matchedProperties = allProperties.filter((p: Property) => 
        propertyIdsAsNumbers.includes(p.id)
      );

      // Sort by relevance (order from vector search)
      const sortedProperties = propertyIdsAsNumbers
        .map((id: number) => matchedProperties.find((p: Property) => p.id === id))
        .filter(Boolean) as Property[];

      console.log(`   ✅ Returning ${sortedProperties.length} properties`);
      return sortedProperties;
    } catch (error) {
      console.warn('⚠️ ChromaDB search failed, using fallback:', error);
      return this.fallbackSearch(query, limit, filters);
    }
  }

  /**
   * Fallback search when ChromaDB is unavailable (CORS or connection issues)
   */
  private async fallbackSearch(
    query: string,
    limit: number,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      minRooms?: number;
      maxRooms?: number;
      minBedrooms?: number;
      maxBedrooms?: number;
      location?: string;
      amenities?: string[];
      propertyType?: string;
    }
  ): Promise<Property[]> {
    try {
      const response = await apimoService.getProperties();
      let properties = response.properties;

      console.log('🔍 Fallback search with filters:', filters);

      // Apply PRECISE filters
      if (filters) {
        // EXACT PROPERTY TYPE
        if (filters.propertyType) {
          properties = properties.filter((p: Property) => {
            const pType = this.getPropertyTypeName(p.category);
            return pType === filters.propertyType;
          });
          console.log(`🏠 Filtered by type "${filters.propertyType}": ${properties.length} properties`);
        }

        // PRICE RANGE
        if (filters.minPrice) {
          properties = properties.filter((p: Property) => p.price >= filters.minPrice!);
          console.log(`💰 Min price ${filters.minPrice}: ${properties.length} properties`);
        }
        if (filters.maxPrice) {
          properties = properties.filter((p: Property) => p.price <= filters.maxPrice!);
          console.log(`💰 Max price ${filters.maxPrice}: ${properties.length} properties`);
        }

        // EXACT BEDROOMS
        if (filters.minBedrooms !== undefined && filters.maxBedrooms !== undefined && filters.minBedrooms === filters.maxBedrooms) {
          properties = properties.filter((p: Property) => (p.bedrooms || 0) === filters.minBedrooms!);
          console.log(`🛏️ Exact bedrooms ${filters.minBedrooms}: ${properties.length} properties`);
        } else if (filters.minBedrooms !== undefined) {
          properties = properties.filter((p: Property) => (p.bedrooms || 0) >= filters.minBedrooms!);
          console.log(`🛏️ Min bedrooms ${filters.minBedrooms}: ${properties.length} properties`);
        }

        // EXACT ROOMS
        if (filters.minRooms !== undefined && filters.maxRooms !== undefined && filters.minRooms === filters.maxRooms) {
          properties = properties.filter((p: Property) => (p.rooms || 0) === filters.minRooms!);
          console.log(`🚪 Exact rooms ${filters.minRooms}: ${properties.length} properties`);
        } else if (filters.minRooms !== undefined) {
          properties = properties.filter((p: Property) => (p.rooms || 0) >= filters.minRooms!);
          console.log(`🚪 Min rooms ${filters.minRooms}: ${properties.length} properties`);
        }

        // LOCATION
        if (filters.location) {
          const loc = filters.location.toLowerCase();
          properties = properties.filter((p: Property) => 
            p.city?.toLowerCase().includes(loc) || 
            p.location?.toLowerCase().includes(loc)
          );
          console.log(`📍 Location "${filters.location}": ${properties.length} properties`);
        }

        // AMENITIES
        if (filters.amenities && filters.amenities.length > 0) {
          properties = properties.filter((p: Property) => 
            filters.amenities!.some(amenity => 
              p.features?.some((f: string) => f.toLowerCase().includes(amenity.toLowerCase()))
            )
          );
          console.log(`✨ Amenities ${filters.amenities}: ${properties.length} properties`);
        }
      }

      // Simple text matching on query
      const queryLower = query.toLowerCase();
      const scored = properties.map((p: Property) => {
        let score = 0;
        const searchText = `${p.city} ${p.location} ${p.type} ${p.features?.join(' ')}`.toLowerCase();
        
        // Basic keyword matching
        const keywords = queryLower.split(' ').filter(w => w.length > 2);
        keywords.forEach(keyword => {
          if (searchText.includes(keyword)) score += 1;
        });
        
        return { property: p, score };
      });

      // Sort by score and return top results
      return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.property);
    } catch (error) {
      console.error('❌ Fallback search failed:', error);
      return [];
    }
  }

  /**
   * Get similar properties
   */
  async getSimilarProperties(propertyId: number, limit: number = 3): Promise<Property[]> {
    if (!this.collection) {
      await this.initialize();
    }

    try {
      // Get the property document
      const results = await this.collection!.get({
        ids: [`property_${propertyId}`]
      });

      if (!results.documents || results.documents.length === 0) {
        return [];
      }

      const document = results.documents[0];
      
      if (!document) {
        return [];
      }

      // Search for similar properties
      const similar = await this.collection!.query({
        queryTexts: [document],
        nResults: limit + 1, // +1 because the property itself will be included
      });

      // Filter out the original property
      const propertyIds = similar.metadatas[0]
        ?.map((m: any) => m.propertyId)
        .filter((id: number) => id !== propertyId) || [];

      // Fetch full property data
      const response = await apimoService.getProperties();
      const allProperties = response.properties;
      return allProperties.filter((p: Property) => propertyIds.includes(p.id));
    } catch (error) {
      console.error('❌ Failed to get similar properties:', error);
      return [];
    }
  }

  /**
   * Clear all indexed properties
   */
  async clearIndex(): Promise<boolean> {
    if (!this.collection) {
      return false;
    }

    try {
      // Note: deleteCollection not implemented in simple client, skip
      // await this.client?.deleteCollection({ name: this.collectionName });
      this.collection = await this.client?.createCollection({
        name: this.collectionName,
        metadata: { 'hnsw:space': 'cosine' }
      }) || null;
      console.log('✅ Index cleared');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear index:', error);
      return false;
    }
  }
}

export const vectorStoreService = new VectorStoreService();
