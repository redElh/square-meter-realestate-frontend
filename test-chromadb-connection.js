// Test ChromaDB Connection
const { ChromaClient } = require('chromadb');

async function testChromaDB() {
  try {
    console.log('🔵 Testing ChromaDB connection...');
    
    const client = new ChromaClient({
      path: 'http://localhost:8000'
    });
    
    console.log('✅ Client created');
    
    // Test heartbeat
    const heartbeat = await client.heartbeat();
    console.log('✅ Heartbeat:', heartbeat);
    
    // List collections
    const collections = await client.listCollections();
    console.log('✅ Collections:', collections.length);
    collections.forEach(c => console.log(`   - ${c.name}`));
    
    // Try to get or create the property_embeddings collection
    const collection = await client.getOrCreateCollection({
      name: 'property_embeddings',
      metadata: { 'hnsw:space': 'cosine' }
    });
    
    console.log('✅ Collection retrieved:', collection.name);
    
    // Count items in collection
    const count = await collection.count();
    console.log('✅ Items in collection:', count);
    
    console.log('\n🎉 ChromaDB is working correctly!');
    
  } catch (error) {
    console.error('❌ ChromaDB Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
    }
    process.exit(1);
  }
}

testChromaDB();
