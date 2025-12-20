// Test script to verify property translations are correctly added
// Run this with: node testPropertyTranslations.js

const fs = require('fs');
const path = require('path');

const languages = ['en', 'fr', 'es', 'de', 'ar', 'ru'];
const propertyIds = ['86379445', '86380226'];

console.log('🧪 Testing Property Translations...\n');

let allTestsPassed = true;

languages.forEach(lang => {
  console.log(`\n📝 Testing ${lang.toUpperCase()} translations...`);
  
  const filePath = path.join(__dirname, 'src', 'i18n', 'locales', lang, 'translation.json');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    if (!translations.apiProperties) {
      console.error(`  ❌ Missing 'apiProperties' section`);
      allTestsPassed = false;
      return;
    }
    
    propertyIds.forEach(propertyId => {
      if (!translations.apiProperties[propertyId]) {
        console.error(`  ❌ Missing property ID: ${propertyId}`);
        allTestsPassed = false;
      } else {
        const property = translations.apiProperties[propertyId];
        
        if (!property.title) {
          console.error(`  ❌ Missing title for property ${propertyId}`);
          allTestsPassed = false;
        } else {
          console.log(`  ✅ Property ${propertyId} - Title: "${property.title.substring(0, 30)}..."`);
        }
        
        if (!property.description) {
          console.error(`  ❌ Missing description for property ${propertyId}`);
          allTestsPassed = false;
        } else {
          console.log(`  ✅ Property ${propertyId} - Description: ${property.description.length} characters`);
        }
      }
    });
    
  } catch (error) {
    console.error(`  ❌ Error reading/parsing ${lang} file:`, error.message);
    allTestsPassed = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('✅ All translation tests PASSED!');
  console.log('\nProperty translations are available in all 6 languages:');
  console.log('  - English (en)');
  console.log('  - French (fr)');
  console.log('  - Spanish (es)');
  console.log('  - German (de)');
  console.log('  - Arabic (ar)');
  console.log('  - Russian (ru)');
  process.exit(0);
} else {
  console.log('❌ Some translation tests FAILED!');
  process.exit(1);
}
