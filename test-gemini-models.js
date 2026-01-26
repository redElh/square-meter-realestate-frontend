const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyC42wqPiC9ZmLXpGCgyVLYywyNLr2MWhnc';
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  console.log('🔍 Testing which Gemini models work with your API key...\n');
  
  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-8b',
    'gemini-1.0-pro',
  ];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hello');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} WORKS! Response: "${text.substring(0, 50)}..."\n`);
      return modelName; // Return first working model
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}\n`);
    }
  }
  
  console.log('❌ No models worked!');
  return null;
}

listModels().then(workingModel => {
  if (workingModel) {
    console.log(`\n🎉 USE THIS MODEL: "${workingModel}"`);
  }
}).catch(console.error);
