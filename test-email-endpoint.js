// Test script for email endpoint
const fetch = require('node-fetch');

async function testEmailEndpoint() {
  console.log('🧪 Testing email endpoint...\n');
  
  const testData = {
    subject: 'Test Property Inquiry',
    content: 'This is a test email content to verify the endpoint is working.',
    formData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      message: 'I am interested in this property.'
    },
    currentLanguage: 'en'
  };
  
  try {
    console.log('📤 Sending request with data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/send-property-inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('\n📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('\n📥 Response body:', responseText);
    
    if (response.ok) {
      console.log('\n✅ Test PASSED! Email endpoint is working correctly.');
    } else {
      console.log('\n❌ Test FAILED! Status:', response.status);
    }
  } catch (error) {
    console.error('\n❌ Test ERROR:', error.message);
    console.error('Full error:', error);
  }
}

testEmailEndpoint();
