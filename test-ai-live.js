// Test the AI Chatbot directly
const testChatbot = async () => {
  console.log('🧪 Testing AI Chatbot...\n');
  
  const testMessage = "Hello, I'm looking for a villa";
  
  try {
    const response = await fetch('http://localhost:3000/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'chat',
        message: testMessage,
        language: 'en'
      })
    });
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response:', text);
      return;
    }
    
    const data = await response.json();
    
    console.log('✅ Test Message:', testMessage);
    console.log('🤖 AI Response:', data.response?.content || data.message);
    console.log('\n📊 Full Response:', JSON.stringify(data, null, 2));
    
    if (data.response?.content) {
      console.log('\n🎉 SUCCESS! AI Assistant is working correctly!');
    } else {
      console.log('\n⚠️ Unexpected response format');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testChatbot();
