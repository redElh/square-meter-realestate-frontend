const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const CHROMA_URL = 'http://localhost:8000';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function embedQuery(text) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function testQuery() {
  try {
    console.log('\n=== Testing ChromaDB Query Flow ===\n');
    
    // Get collection ID
    console.log('Getting collection...');
    const collectionRes = await axios.get(
      `${CHROMA_URL}/api/v2/tenants/default_tenant/databases/default_database/collections/property_embeddings`
    );
    const collectionId = collectionRes.data.id;
    console.log(`✅ Collection ID: ${collectionId}`);
    
    // Test query
    const queryText = 'Find me a 3-bedroom villa in Essaouira';
    console.log(`\nQuery: "${queryText}"`);
    
    // Generate embedding
    console.log('\nGenerating query embedding...');
    const startEmbed = Date.now();
    const queryEmbedding = await embedQuery(queryText);
    const endEmbed = Date.now();
    console.log(`✅ Embedding generated in ${endEmbed - startEmbed}ms`);
    console.log(`   Dimension: ${queryEmbedding.length}`);
    
    // Query ChromaDB
    console.log('\nQuerying ChromaDB...');
    const startQuery = Date.now();
    const response = await axios.post(
      `${CHROMA_URL}/api/v2/tenants/default_tenant/databases/default_database/collections/${collectionId}/query`,
      {
        query_embeddings: [queryEmbedding],
        n_results: 5
        // No where clause for now - test basic query first
      },
      { timeout: 10000 }
    );
    const endQuery = Date.now();
    
    console.log(`✅ Query completed in ${endQuery - startQuery}ms`);
    console.log(`\nResults (${response.data.ids[0].length} properties):`);
    
    response.data.ids[0].forEach((id, idx) => {
      console.log(`\n${idx + 1}. Property ${id}`);
      console.log(`   Distance: ${response.data.distances[0][idx].toFixed(4)}`);
      console.log(`   Metadata:`, response.data.metadatas[0][idx]);
      console.log(`   Document:`, response.data.documents[0][idx].substring(0, 100) + '...');
    });
    
    console.log(`\n✅ Total time: ${endQuery - startEmbed}ms`);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('   Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testQuery();
