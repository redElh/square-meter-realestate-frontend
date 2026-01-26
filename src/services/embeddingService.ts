// Embedding Service using Google Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

class EmbeddingService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  async initialize() {
    if (this.model) return true;

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ Gemini API key not found');
        return false;
      }

      console.log('🔑 Initializing Gemini with API key:', apiKey.substring(0, 10) + '...');
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
      
      console.log('✅ Embedding service initialized');
      return true;
    } catch (error: any) {
      console.error('❌ Failed to initialize embedding service:', error.message);
      console.error('   Full error:', error);
      return false;
    }
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    if (!this.model) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Embedding service not initialized');
      }
    }

    try {
      const embeddings: number[][] = [];
      
      console.log(`   Processing ${texts.length} documents...`);
      
      // Process in batches to avoid rate limits
      const batchSize = 5; // Reduced batch size
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        console.log(`   Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
        
        for (const text of batch) {
          try {
            const result = await this.model.embedContent(text);
            embeddings.push(result.embedding.values);
          } catch (error: any) {
            console.error(`   ❌ Failed to embed document: ${error.message}`);
            // Use a zero vector as fallback
            embeddings.push(new Array(768).fill(0));
          }
        }
        
        // Delay between batches to respect rate limits
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay
        }
      }
      
      return embeddings;
    } catch (error: any) {
      console.error('❌ Failed to generate embeddings:', error.message);
      console.error('   Full error:', error);
      throw error;
    }
  }

  async embedQuery(query: string): Promise<number[]> {
    if (!this.model) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new Error('Embedding service not initialized');
      }
    }

    try {
      console.log('   📝 Query text:', query.substring(0, 100));
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Embedding timeout after 10s')), 10000)
      );

      const embeddingPromise = this.model.embedContent(query);
      
      const result = await Promise.race([embeddingPromise, timeoutPromise]);
      console.log('   ✅ Query embedding generated');
      return result.embedding.values;
    } catch (error: any) {
      console.error('❌ Failed to generate query embedding:', error.message);
      console.error('   Error details:', error);
      throw error;
    }
  }
}

export const embeddingService = new EmbeddingService();
