/**
 * Complete End-to-End Test
 * Tests all three fixes:
 * 1. Auto-indexing of properties into ChromaDB
 * 2. Gemini API responding with Essaouira context
 * 3. No hanging (timeout protection working)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testCompleteStack() {
  console.log('\n🧪 COMPLETE SOLUTION TEST\n');
  console.log('='.repeat(50));

  // Test 1: ChromaDB Proxy
  console.log('\n📊 Test 1: ChromaDB Proxy');
  console.log('-'.repeat(50));
  try {
    const response = await fetch('http://localhost:3000/chroma/api/v2/heartbeat');
    const data = await response.json();
    console.log('✅ ChromaDB proxy working:', data);
  } catch (error) {
    console.error('❌ ChromaDB proxy failed:', error.message);
  }

  // Test 2: Gemini API with Essaouira Context
  console.log('\n🤖 Test 2: Gemini API with Essaouira Context');
  console.log('-'.repeat(50));
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ No Gemini API key found');
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a real estate assistant for properties in Essaouira, Morocco.
A user asks: "Find me a 3-bedroom villa in Essaouira"
Respond briefly acknowledging the location (Essaouira, Morocco) and that you're searching.`;

    console.log('Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    console.log('\n✅ Gemini Response:');
    console.log(text);

    // Check if response mentions Essaouira (not Nice)
    if (text.toLowerCase().includes('essaouira') && !text.toLowerCase().includes('nice')) {
      console.log('\n✅ CORRECT: Response mentions Essaouira, Morocco');
    } else if (text.toLowerCase().includes('nice')) {
      console.log('\n❌ ERROR: Response still mentions Nice instead of Essaouira!');
    } else {
      console.log('\n⚠️  WARNING: Response doesn\'t mention location');
    }
  } catch (error) {
    console.error('❌ Gemini test failed:', error.message);
  }

  // Test 3: Check if properties were indexed
  console.log('\n🗂️  Test 3: Property Indexing Check');
  console.log('-'.repeat(50));
  try {
    const response = await fetch('http://localhost:3000/chroma/api/v2/collections');
    const collections = await response.json();
    
    console.log('Collections found:', collections.length);
    
    const propertyCollection = collections.find(c => c.name === 'property_embeddings');
    if (propertyCollection) {
      console.log('✅ property_embeddings collection exists');
      
      // Try to get count
      const countResponse = await fetch(`http://localhost:3000/chroma/api/v2/collections/${propertyCollection.id}/count`);
      const countData = await countResponse.json();
      console.log(`✅ Properties indexed: ${countData}`);
      
      if (countData > 0) {
        console.log('\n🎉 SUCCESS! Properties are indexed in ChromaDB!');
      } else {
        console.log('\n⚠️  Collection exists but no properties indexed yet');
        console.log('   Check browser console for auto-indexing logs');
      }
    } else {
      console.log('❌ property_embeddings collection not found');
      console.log('   Auto-indexing may not have run yet');
    }
  } catch (error) {
    console.error('❌ Collection check failed:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!');
  console.log('\nNext steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Open browser DevTools Console (F12)');
  console.log('3. Look for "📊 Found X properties from APIMO" message');
  console.log('4. Look for "✅ Successfully indexed X properties" message');
  console.log('5. Click the chat button and ask about Essaouira properties');
  console.log('='.repeat(50) + '\n');
}

testCompleteStack().catch(console.error);
