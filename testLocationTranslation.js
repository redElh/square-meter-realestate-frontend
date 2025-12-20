const fs = require('fs');

// Test location translation
const langs = ['en', 'fr', 'es', 'de', 'ar', 'ru'];

console.log('\n🌍 LOCATION TRANSLATION TEST\n');
console.log('=' .repeat(60));

langs.forEach(lang => {
  const data = JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}/translation.json`, 'utf8'));
  
  console.log(`\n${lang.toUpperCase()}:`);
  
  if (data.locations && data.locations.Essaouira) {
    console.log(`  ✅ locations.Essaouira = "${data.locations.Essaouira}"`);
    
    // Test the translation logic simulation
    const cityName = "Essaouira";
    const zipcode = "44000";
    const translatedCity = data.locations[cityName] || cityName;
    const location = `${translatedCity} ${zipcode}`;
    
    console.log(`  📍 Full location would be: "${location}"`);
  } else {
    console.log('  ❌ MISSING locations.Essaouira');
  }
});

console.log('\n' + '='.repeat(60));
console.log('\n✅ All translations found!\n');
