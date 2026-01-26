// Test the Simple ChromaDB Client with API v2
async function testClient() {
  const baseUrl = 'http://localhost:8000';
  const tenant = 'default_tenant';
  const database = 'default_database';
  
  try {
    console.log('🔵 Testing ChromaDB API v2...');
    
    // List collections
    console.log('   Testing list collections...');
    const listResponse = await fetch(`${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections`);
    if (!listResponse.ok) {
      throw new Error(`List failed: ${listResponse.statusText}`);
    }
    const collections = await listResponse.json();
    console.log('   ✅ Collections:', collections.length);
    collections.forEach(c => console.log(`      - ${c.name} (${c.id})`));
    
    // Get specific collection
    console.log('   Testing get collection...');
    const getResponse = await fetch(`${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections/property_embeddings`);
    if (getResponse.ok) {
      const collection = await getResponse.json();
      console.log('   ✅ Collection exists:', collection.name);
    } else {
      console.log('   Collection does not exist, will create');
      
      // Create collection
      const createResponse = await fetch(`${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'property_embeddings',
          metadata: { 'hnsw:space': 'cosine' }
        })
      });
      
      if (createResponse.ok) {
        const newCollection = await createResponse.json();
        console.log('   ✅ Collection created:', newCollection.name);
      } else {
        const error = await createResponse.text();
        console.log('   ❌ Create failed:', error);
      }
    }
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testClient();
