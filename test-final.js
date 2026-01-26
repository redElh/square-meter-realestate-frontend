const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyC42wqPiC9ZmLXpGCgyVLYywyNLr2MWhnc';
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel() {
  console.log('🧪 Testing gemini-2.5-flash...\n');
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Hello, I am looking for a villa in Nice');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! AI Response:');
    console.log('-'.repeat(60));
    console.log(text);
    console.log('-'.repeat(60));
    console.log('\n🎉 Gemini 2.5 Flash is working perfectly!');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

testModel();
