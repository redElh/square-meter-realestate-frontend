// Test embedding service in isolation
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testEmbeddingService() {
  console.log('🧪 Testing Embedding Service...\n');
  
  const apiKey = 'AIzaSyC42wqPiC9ZmLXpGCgyVLYywyNLr2MWhnc';
  
  try {
    console.log('1. Initializing GoogleGenerativeAI...');
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('   ✅ GoogleGenerativeAI created');
    
    console.log('\n2. Getting embedding model...');
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    console.log('   ✅ Model obtained');
    
    console.log('\n3. Testing single embedding...');
    const startTime = Date.now();
    const result = await model.embedContent('Find me a 3-bedroom villa in Essaouira');
    const endTime = Date.now();
    console.log(`   ✅ Embedding generated in ${endTime - startTime}ms`);
    console.log(`   📊 Dimension: ${result.embedding.values.length}`);
    console.log(`   📝 First 5 values: [${result.embedding.values.slice(0, 5).join(', ')}...]`);
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Error details:', error);
  }
}

testEmbeddingService();
