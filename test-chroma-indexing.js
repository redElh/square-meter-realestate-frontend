/**
 * Quick test to verify ChromaDB property indexing
 */

async function testIndexing() {
  console.log('\n🔍 Testing ChromaDB Property Indexing\n');

  try {
    // Give the app some time to index
    console.log('Waiting 3 seconds for auto-indexing...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check collections
    const response = await fetch('http://localhost:3000/chroma/api/v2/collections');
    
    if (!response.ok) {
      console.error('❌ Failed to fetch collections:', response.statusText);
      return;
    }

    const text = await response.text();
    console.log('Raw response:', text.substring(0, 200));

    if (!text) {
      console.log('⚠️  Empty response from collections endpoint');
      return;
    }

    const collections = JSON.parse(text);
    console.log(`\n✅ Found ${collections.length} collections`);
    
    if (collections.length > 0) {
      collections.forEach(c => {
        console.log(`  - ${c.name} (ID: ${c.id})`);
      });

      const propertyCollection = collections.find(c => c.name === 'property_embeddings');
      if (propertyCollection) {
        console.log('\n✅ property_embeddings collection found!');
        console.log('   Collection ID:', propertyCollection.id);
        
        // Try to get the count
        const countUrl = `http://localhost:3000/chroma/api/v2/collections/${propertyCollection.id}/count`;
        console.log('\n📊 Fetching property count from:', countUrl);
        
        const countResponse = await fetch(countUrl);
        const countText = await countResponse.text();
        console.log('Count response:', countText);
        
        try {
          const count = parseInt(countText);
          if (count > 0) {
            console.log(`\n🎉 SUCCESS! ${count} properties are indexed in ChromaDB!`);
            console.log('   Your RAG chatbot is ready to search real properties!');
          } else {
            console.log('\n⚠️  Collection exists but no properties indexed yet');
            console.log('   Check browser console for auto-indexing logs');
          }
        } catch (e) {
          console.log('⚠️  Could not parse count:', countText);
        }
      } else {
        console.log('\n⚠️  property_embeddings collection not found yet');
        console.log('   Auto-indexing may still be running');
        console.log('   Open http://localhost:3000 and check the browser console');
      }
    } else {
      console.log('\n⚠️  No collections found in ChromaDB');
      console.log('   The auto-indexing might not have run yet');
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }

  console.log('\n' + '='.repeat(60));
  console.log('NEXT STEPS:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Press F12 to open Developer Tools');
  console.log('3. Go to the Console tab');
  console.log('4. Look for messages like:');
  console.log('   "📊 Found X properties from APIMO"');
  console.log('   "✅ Successfully indexed X properties into ChromaDB!"');
  console.log('5. If you see those messages, click the chat button');
  console.log('6. Ask: "Find me a villa in Essaouira"');
  console.log('7. The AI should search the indexed properties!');
  console.log('='.repeat(60) + '\n');
}

testIndexing().catch(console.error);
