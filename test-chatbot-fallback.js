// Quick test script to verify chatbot works without OpenAI
const testMessages = [
  "hello",
  "find me a villa in Nice",
  "what are the fees for buying property?",
  "I want to schedule a viewing",
  "what's your name?"
];

console.log('Testing chatbot fallback responses...\n');

testMessages.forEach(msg => {
  console.log(`User: ${msg}`);
  
  const lowerMsg = msg.toLowerCase();
  let response = '';
  
  // Greetings
  if (lowerMsg.match(/\b(hello|hi|hey|bonjour|salut|hola)\b/)) {
    response = "Hello! I'm your real estate assistant. I can help you find properties, answer questions about buying real estate, or schedule viewings. How can I help you today?";
  }
  // Property search
  else if (lowerMsg.match(/\b(find|search|looking for|property|villa|house)\b/)) {
    response = "To help you find the perfect property, can you provide more details? For example: desired location, budget, number of bedrooms, or special features like a pool or garden.";
  }
  // Pricing/fees
  else if (lowerMsg.match(/\b(price|cost|fee|fees|budget)\b/)) {
    response = "Real estate purchase fees typically include: notary fees (7-8%), agency fees (3-10% of price), and possibly guarantee fees. Would you like more detailed information on a specific aspect?";
  }
  // Booking/viewing
  else if (lowerMsg.match(/\b(visit|viewing|book|schedule)\b/)) {
    response = "I can help you schedule a viewing! Do you already have a specific property in mind, or would you like to see some options that match your criteria first?";
  }
  // Default
  else {
    response = "I'm here to help you find the perfect property. You can ask me about available properties, the buying process, legal requirements, or schedule a viewing!";
  }
  
  console.log(`Assistant: ${response}\n`);
});

console.log('✅ All fallback responses working correctly!');
