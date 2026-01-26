const https = require('https');

const apiKey = 'AIzaSyC42wqPiC9ZmLXpGCgyVLYywyNLr2MWhnc';

// Try to list models with direct API call
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('🔍 Checking API key and listing available models...\n');
console.log('URL:', url.replace(apiKey, 'API_KEY_HIDDEN'), '\n');

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.models) {
          console.log('\n✅ Available models:');
          parsed.models.forEach(model => {
            console.log(`  - ${model.name}`);
          });
        }
      } catch (e) {
        console.log('Parse error:', e.message);
      }
    } else {
      console.log('\n❌ API Key might be invalid or restricted');
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
