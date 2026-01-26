// Test ChromaDB Query Endpoint
async function testQuery() {
  const baseUrl = 'http://localhost:8000';
  const tenant = 'default_tenant';
  const database = 'default_database';
  const collectionName = 'property_embeddings';
  
  try {
    console.log('🔍 Testing ChromaDB Query...\n');
    
    // Get collection
    const getResponse = await fetch(`${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections/${collectionName}`);
    const collection = await getResponse.json();
    console.log('✅ Collection ID:', collection.id);
    
    // Create a fake embedding (768 dimensions)
    const fakeEmbedding = Array(768).fill(0).map(() => Math.random());
    
    console.log('\n📤 Sending query request...');
    const startTime = Date.now();
    
    const queryResponse = await fetch(
      `${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections/${collection.id}/query`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query_embeddings: [fakeEmbedding],
          n_results: 5,
          where: {
            propertyType: 'villa',
            bedrooms: 3,
            city: { $contains: 'essaouira' }
          }
        })
      }
    );
    
    const endTime = Date.now();
    console.log(`⏱️  Request took ${endTime - startTime}ms`);
    
    if (queryResponse.ok) {
      const result = await queryResponse.json();
      console.log('\n✅ Query successful!');
      console.log('Results:', {
        ids: result.ids?.[0]?.length || 0,
        distances: result.distances?.[0]?.length || 0,
        metadatas: result.metadatas?.[0]?.length || 0
      });
      
      if (result.metadatas?.[0]?.length > 0) {
        console.log('\nFirst result:', result.metadatas[0][0]);
      }
    } else {
      const error = await queryResponse.text();
      console.log('❌ Query failed:', queryResponse.status);
      console.log('Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testQuery();
