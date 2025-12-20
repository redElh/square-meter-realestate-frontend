// Test script for Apimo API integration
// Run this with: node testApimoAPI.js

const APIMO_CONFIG = {
  baseUrl: 'https://api.apimo.pro',
  agencyId: '25311',
  providerId: '4567',
  token: 'd07da6e744bb033d1299469f1f6f7334531ec05c',
};

function getAuthHeader() {
  const credentials = `${APIMO_CONFIG.providerId}:${APIMO_CONFIG.token}`;
  return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

async function testApimoConnection() {
  console.log('🔍 Testing Apimo API Connection...\n');
  console.log('Configuration:');
  console.log('- Base URL:', APIMO_CONFIG.baseUrl);
  console.log('- Agency ID:', APIMO_CONFIG.agencyId);
  console.log('- Provider ID:', APIMO_CONFIG.providerId);
  console.log('- Token:', APIMO_CONFIG.token.substring(0, 10) + '...\n');

  const url = `${APIMO_CONFIG.baseUrl}/agencies/${APIMO_CONFIG.agencyId}/properties`;
  
  try {
    console.log('📡 Making request to:', url);
    console.log('Authorization:', getAuthHeader().substring(0, 20) + '...\n');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Response Status:', response.status, response.statusText);
    console.log('Response Headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log('');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:');
      console.error(errorText);
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ Success! API Response:');
    console.log('- Total Items:', data.total_items);
    console.log('- Timestamp:', data.timestamp);
    console.log('- Properties Count:', data.properties?.length || 0);
    console.log('');

    if (data.properties && data.properties.length > 0) {
      console.log('📋 First Property Sample:');
      const firstProperty = data.properties[0];
      console.log('  ID:', firstProperty.id);
      console.log('  Reference:', firstProperty.reference);
      console.log('  Type:', firstProperty.type);
      console.log('  Category:', firstProperty.category);
      console.log('  Price:', firstProperty.price?.value, firstProperty.price?.currency);
      console.log('  Location:', firstProperty.city?.name, firstProperty.city?.zipcode);
      console.log('  Surface:', firstProperty.area?.value, 'm²');
      console.log('  Rooms:', firstProperty.rooms);
      console.log('  Bedrooms:', firstProperty.bedrooms);
      console.log('  Sleeps:', firstProperty.sleeps);
      console.log('  Pictures:', firstProperty.pictures?.length || 0);
      console.log('  Comments:', firstProperty.comments?.length || 0);
      console.log('  Floor:', JSON.stringify(firstProperty.floor));
      console.log('  Construction:', JSON.stringify(firstProperty.construction));
      console.log('  Condition:', firstProperty.condition);
      console.log('  Standing:', firstProperty.standing);
      console.log('  Areas:', firstProperty.areas?.length || 0);
      
      if (firstProperty.areas && firstProperty.areas.length > 0) {
        console.log('\n  Areas breakdown:');
        firstProperty.areas.forEach(area => {
          console.log(`    - Type: ${area.type}, Number: ${area.number}, Area: ${area.area}, Flooring: ${area.flooring}`);
        });
      }
      
      if (firstProperty.comments && firstProperty.comments.length > 0) {
        console.log('\n  Title:', firstProperty.comments[0].title);
      }
      console.log('');
      
      console.log('\n📋 Full First Property JSON:');
      console.log(JSON.stringify(firstProperty, null, 2));
    }

    console.log('🎉 API Integration Test PASSED!');
    return data;
    
  } catch (error) {
    console.error('❌ API Integration Test FAILED!');
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    throw error;
  }
}

// Run the test
testApimoConnection()
  .then(() => {
    console.log('\n✨ All tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed with error:', error.message);
    process.exit(1);
  });
