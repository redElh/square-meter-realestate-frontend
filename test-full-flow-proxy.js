const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function testFullFlow() {
  try {
    console.log('\n🧪 Testing Complete Flow Through Proxy\n');
    
    // Step 1: Get collection via proxy
    console.log('1️⃣ Getting collection via proxy...');
    const collRes = await axios.get('http://localhost:3000/chroma/api/v2/tenants/default_tenant/databases/default_database/collections/property_embeddings');
    console.log(`✅ Collection: ${collRes.data.name} (${collRes.data.dimension}D, count: ${collRes.data.log_position})`);
    
    // Step 2: Generate query embedding
    console.log('\n2️⃣ Generating query embedding...');
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const start = Date.now();
    const result = await model.embedContent('Find me a 3-bedroom villa in Essaouira');
    const embedding = result.embedding.values;
    console.log(`✅ Embedding generated in ${Date.now() - start}ms (${embedding.length}D)`);
    
    // Step 3: Query via proxy
    console.log('\n3️⃣ Querying ChromaDB via proxy...');
    const queryStart = Date.now();
    const queryRes = await axios.post(
      `http://localhost:3000/chroma/api/v2/tenants/default_tenant/databases/default_database/collections/${collRes.data.id}/query`,
      {
        query_embeddings: [embedding],
        n_results: 5
      },
      { timeout: 10000 }
    );
    const queryTime = Date.now() - queryStart;
    
    console.log(`✅ Query completed in ${queryTime}ms`);
    console.log(`📊 Results: ${queryRes.data.ids[0].length} properties found`);
    
    // Show top result
    if (queryRes.data.ids[0].length > 0) {
      console.log('\n🏆 Top Result:');
      console.log(`   ID: ${queryRes.data.ids[0][0]}`);
      console.log(`   Distance: ${queryRes.data.distances[0][0].toFixed(4)}`);
      console.log(`   Metadata:`, queryRes.data.metadatas[0][0]);
    }
    
    console.log(`\n⚡ TOTAL TIME: ${Date.now() - start}ms`);
    console.log('✅ ALL SYSTEMS OPERATIONAL!\n');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testFullFlow();
