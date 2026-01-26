const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const APIMO_API_URL = 'https://api.apimo.pro/agencies/25311/properties';
const APIMO_PROVIDER = '4567';
const APIMO_TOKEN = 'd07da6e744bb033d1299469f1f6f7334531ec05c';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const CHROMA_URL = 'http://localhost:8000';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function embedDocuments(texts) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const embeddings = [];
  
  console.log(`Generating embeddings for ${texts.length} documents...`);
  
  for (let i = 0; i < texts.length; i += 5) {
    const batch = texts.slice(i, i + 5);
    for (const text of batch) {
      const result = await model.embedContent(text);
      embeddings.push(result.embedding.values);
    }
    if (i + 5 < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return embeddings;
}

async function fetchProperties() {
  console.log('Fetching properties from Apimo...');
  const credentials = `${APIMO_PROVIDER}:${APIMO_TOKEN}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');
  
  const response = await axios.get(APIMO_API_URL, {
    headers: {
      'Authorization': `Basic ${base64Credentials}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  
  const properties = response.data.properties || [];
  console.log(`Fetched ${properties.length} properties`);
  return properties;
}

async function indexProperties() {
  try {
    console.log('\n=== Starting Property Indexing ===\n');
    
    // Fetch properties
    const properties = await fetchProperties();
    
    if (properties.length === 0) {
      console.log('No properties to index');
      return;
    }
    
    // Prepare documents
    const documents = [];
    const metadatas = [];
    const ids = [];
    
    properties.forEach(property => {
      const id = `property_${property.id}`;
      
      // Extract values from nested objects
      const cityName = property.city?.name || 'unknown';
      const countryCode = property.country || 'unknown';
      const priceValue = property.price?.value || 0;
      const areaValue = property.area?.value || 0;
      const bedrooms = property.bedrooms || 0;
      const rooms = property.rooms || 0;
      
      // Get property type name (simplified)
      const typeMap = {
        1: 'apartment',
        2: 'house',
        9: 'villa',
        3: 'land',
        4: 'parking',
        5: 'business',
        6: 'building'
      };
      const typeName = typeMap[property.category] || 'property';
      
      const text = `
        ${typeName} in ${cityName}, ${countryCode}.
        ${rooms} rooms, ${bedrooms} bedrooms.
        Price: ${priceValue} MAD.
        Area: ${areaValue} sqm.
      `.trim();
      
      documents.push(text);
      ids.push(id);
      
      // Ensure all metadata values are strings, numbers, or booleans (no null/undefined)
      metadatas.push({
        property_id: String(property.id),
        type: typeName,
        city: cityName,
        country: countryCode,
        price: priceValue,
        bedrooms: bedrooms,
        rooms: rooms,
        area: areaValue
      });
    });
    
    console.log(`Prepared ${documents.length} documents for indexing`);
    
    // Generate embeddings
    console.log('\nGenerating embeddings...');
    const startTime = Date.now();
    const embeddings = await embedDocuments(documents);
    const endTime = Date.now();
    console.log(`✅ Generated ${embeddings.length} embeddings in ${endTime - startTime}ms`);
    console.log(`   First embedding dimension: ${embeddings[0].length}`);
    
    // Get collection ID
    console.log('\nGetting collection ID...');
    const collectionRes = await axios.get(
      `${CHROMA_URL}/api/v2/tenants/default_tenant/databases/default_database/collections/property_embeddings`
    );
    const collectionId = collectionRes.data.id;
    console.log(`   Collection ID: ${collectionId}`);
    
    // Add to ChromaDB
    console.log('\nAdding to ChromaDB...');
    const response = await axios.post(
      `${CHROMA_URL}/api/v2/tenants/default_tenant/databases/default_database/collections/${collectionId}/add`,
      {
        ids,
        embeddings,
        metadatas,
        documents
      },
      { timeout: 30000 }
    );
    
    console.log('✅ Successfully indexed properties to ChromaDB');
    console.log('   Response:', JSON.stringify(response.data, null, 2));
    
    // Verify count (GET request, not POST)
    const countRes = await axios.get(
      `${CHROMA_URL}/api/v2/tenants/default_tenant/databases/default_database/collections/${collectionId}/count`
    );
    console.log(`\n✅ Total documents in collection: ${countRes.data}`);
    
  } catch (error) {
    console.error('❌ Error during indexing:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('   Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

indexProperties();
