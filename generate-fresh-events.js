const fs = require('fs/promises');
const path = require('path');

async function generateEvents() {
  const dataDir = path.join(process.cwd(), 'data');
  await fs.mkdir(dataDir, { recursive: true });
  
  const now = Date.now();
  const events = [];
  
  // Create 20 views spread across today (from 24 hours ago to now)
  for (let i = 0; i < 20; i++) {
    events.push({
      propertyId: '86681101',
      statType: 'views',
      value: 1,
      timestamp: now - 86400000 + (i * 4000)
    });
  }
  
  // Create 13 clicks
  for (let i = 0; i < 13; i++) {
    events.push({
      propertyId: '86681101',
      statType: 'clicks',
      value: 1,
      timestamp: now - 86400000 + (i * 5000)
    });
  }
  
  const filePath = path.join(dataDir, 'stat-events.json');
  await fs.writeFile(filePath, JSON.stringify(events, null, 2));
  
  console.log('✅ Generated events:');
  console.log(`- 20 views`);
  console.log(`- 13 clicks`);
  console.log(`- All from last 24 hours`);
  console.log(`- Saved to: ${filePath}`);
}

generateEvents().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
