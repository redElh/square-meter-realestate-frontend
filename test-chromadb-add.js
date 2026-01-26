// Test ChromaDB API v2 Add Document Endpoint
async function testAddDocument() {
  const baseUrl = 'http://localhost:8000';
  const tenant = 'default_tenant';
  const database = 'default_database';
  const collectionName = 'property_embeddings';
  
  try {
    console.log('🔵 Testing ChromaDB Add Document...');
    
    // Get collection
    const getResponse = await fetch(`${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections/${collectionName}`);
    if (!getResponse.ok) {
      throw new Error('Collection not found');
    }
    
    const collection = await getResponse.json();
    console.log('✅ Collection ID:', collection.id);
    
    // Try to add a test document
    console.log('   Testing add document...');
    const addResponse = await fetch(
      `${baseUrl}/api/v2/tenants/${tenant}/databases/${database}/collections/${collection.id}/add`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: ['test-1'],
          documents: ['This is a test property in Essaouira'],
          metadatas: [{ price: 100000, location: 'Essaouira' }]
        })
      }
    );
    
    if (addResponse.ok) {
      console.log('✅ Add document works!');
      const result = await addResponse.json();
      console.log('   Result:', result);
    } else {
      const error = await addResponse.text();
      console.log('❌ Add failed:', addResponse.status, error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAddDocument();
