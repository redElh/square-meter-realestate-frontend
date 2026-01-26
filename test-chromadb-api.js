// Test ChromaDB Client API Version
const { ChromaClient } = require('chromadb');

async function testAPI() {
  try {
    console.log('Testing ChromaDB client...');
    
    const client = new ChromaClient({
      path: 'http://localhost:8000'
    });
    
    console.log('Client created:', client.constructor.name);
    console.log('Client config:', client);
    
    // Try to call heartbeat
    try {
      const heartbeat = await client.heartbeat();
      console.log('✅ Heartbeat successful:', heartbeat);
    } catch (e) {
      console.log('❌ Heartbeat error:', e.message);
    }
    
    // Try to list collections
    try {
      const collections = await client.listCollections();
      console.log('✅ List collections successful:', collections.length);
    } catch (e) {
      console.log('❌ List collections error:', e.message);
      console.log('   Full error:', e);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  }
}

testAPI();
