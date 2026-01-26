// Test ChromaDB with embeddings or embedding function
async function testAddWithEmbeddings() {
  const baseUrl = 'http://localhost:8000';
  const tenant = 'default_tenant';
  const database = 'default_database';
  const collectionName = 'property_embeddings';
  
  try {
    console.log('🔵 Testing ChromaDB Add with Embeddings...');
    
    // Get collection
    const getResponse = await fetch(`${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections/${collectionName}`);
    if (!getResponse.ok) {
      throw new Error('Collection not found');
    }
    
    const collection = await getResponse.json();
    console.log('✅ Collection ID:', collection.id);
    console.log('   Config:', JSON.stringify(collection.configuration_json, null, 2));
    
    // Try to add a test document WITH embeddings (fake simple embedding)
    console.log('   Testing add document with embeddings...');
    const testEmbedding = Array(384).fill(0).map(() => Math.random()); // 384-dim vector
    
    const addResponse = await fetch(
      `${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections/${collection.id}/add`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: ['test-1'],
          documents: ['This is a test property in Essaouira'],
          embeddings: [testEmbedding],
          metadatas: [{ price: 100000, location: 'Essaouira' }]
        })
      }
    );
    
    if (addResponse.ok) {
      console.log('✅ Add document with embeddings works!');
      const result = await addResponse.json();
      console.log('   Result:', result);
    } else {
      const error = await addResponse.text();
      console.log('❌ Add failed:', addResponse.status);
      console.log('   Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAddWithEmbeddings();
