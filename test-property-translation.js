/**
 * Test script for property translation API
 */

const testPropertyNames = [
  { id: 86601609, text: "Near Essaouira - House + Studio - Heated swimming pool" },
  { id: 86504714, text: "VILLA SEMI FINI - ZONE URBAINE - TITRE:" },
  { id: 86612415, text: "SEMI-FINISHED CAMPAIGN" },
  { id: 86379414, text: "The Authentic Riad" },
  { id: 86380146, text: "Villa Semi-finished" },
  { id: 86379454, text: "Riad Pastel" },
  { id: 86379445, text: "Cosy Riad" },
  { id: 86611745, text: "Charming Village House with Luxury Amenities in Essaouira" }
];

async function testTranslation(targetLang) {
  console.log(`\n\n🌐 Testing translation to ${targetLang}...`);
  console.log('='.repeat(60));
  
  try {
    const response = await fetch('http://localhost:3000/api/translate-property', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: testPropertyNames.slice(0, 3), // Test first 3
        targetLang: targetLang,
        sourceLang: 'auto'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Translation successful!`);
      console.log(`📊 Cache size: ${data.cacheSize}`);
      console.log(`\n📋 Results:`);
      data.results.forEach((result, index) => {
        console.log(`\n${index + 1}. [ID: ${result.id}]`);
        console.log(`   Original:   "${result.original}"`);
        console.log(`   Translated: "${result.translated}"`);
      });
    } else {
      console.error('❌ Translation failed:', data);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Property Translation API Test');
  console.log('='.repeat(60));
  
  // Test different languages
  await testTranslation('es'); // Spanish
  await testTranslation('de'); // German
  await testTranslation('ar'); // Arabic
  await testTranslation('ru'); // Russian
  
  console.log('\n\n✨ All tests complete!');
}

// Run tests
runTests();
