const axios = require('axios');

async function check() {
  const credentials = '4567:d07da6e744bb033d1299469f1f6f7334531ec05c';
  const base64 = Buffer.from(credentials).toString('base64');
  
  const res = await axios.get('https://api.apimo.pro/agencies/25311/properties?limit=1', {
    headers: {
      'Authorization': `Basic ${base64}`,
      'Accept': 'application/json'
    }
  });
  
  const property = res.data.properties[0];
  
  console.log('Sample property keys:', Object.keys(property));
  console.log('\nProperty type:', property.type);
  console.log('Property subtype:', property.subtype);
  console.log('Property category:', property.category);
  console.log('Property subcategory:', property.subcategory);
  console.log('\nLocation (city):', property.city);
  console.log('\nBedrooms:', property.bedrooms);
  console.log('Rooms:', property.rooms);
  console.log('\nPrice:', property.price);
  console.log('Area:', property.area);
  
  console.log('\nFull property:');
  console.log(JSON.stringify(property, null, 2).substring(0, 2000));
}

check().catch(console.error);
