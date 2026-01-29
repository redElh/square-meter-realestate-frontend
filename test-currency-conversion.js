// Test script for currency conversion verification
// Run with: node test-currency-conversion.js

console.log('🧪 Currency Conversion Test\n');
console.log('=' .repeat(60));

// Currency exchange rates (base: MAD)
const CURRENCIES = {
  MAD: { symbol: 'DH', rate: 1 },
  AED: { symbol: 'د.إ', rate: 0.368 }, // 1 MAD = 0.368 AED, or 1 AED = 2.72 MAD
  EUR: { symbol: '€', rate: 0.091 }, // 1 MAD = 0.091 EUR, or 1 EUR = 10.99 MAD
  USD: { symbol: '$', rate: 0.100 }, // 1 MAD = 0.100 USD, or 1 USD = 10.00 MAD
  GBP: { symbol: '£', rate: 0.077 }, // 1 MAD = 0.077 GBP, or 1 GBP = 12.99 MAD
};

/**
 * Convert price from one currency to another
 */
function convertPrice(amount, fromCurrency, toCurrency) {
  const fromRate = CURRENCIES[fromCurrency].rate;
  const toRate = CURRENCIES[toCurrency].rate;
  
  // Convert to MAD first, then to target currency
  const amountInMAD = amount / fromRate;
  const converted = amountInMAD * toRate;
  
  return Math.round(converted);
}

/**
 * Format currency amount
 */
function formatCurrency(amount, currency) {
  const symbol = CURRENCIES[currency].symbol;
  return `${symbol} ${amount.toLocaleString('en')}`;
}

// Test cases
const testCases = [
  { amount: 1000000, from: 'EUR', to: 'MAD', description: 'Property in France (EUR) → MAD' },
  { amount: 1000000, from: 'EUR', to: 'USD', description: 'Property in France (EUR) → USD' },
  { amount: 1000000, from: 'EUR', to: 'AED', description: 'Property in France (EUR) → AED' },
  { amount: 500000, from: 'AED', to: 'MAD', description: 'Property in UAE (AED) → MAD' },
  { amount: 500000, from: 'AED', to: 'EUR', description: 'Property in UAE (AED) → EUR' },
  { amount: 2000000, from: 'MAD', to: 'EUR', description: 'Property in Morocco (MAD) → EUR' },
  { amount: 2000000, from: 'MAD', to: 'USD', description: 'Property in Morocco (MAD) → USD' },
  { amount: 750000, from: 'USD', to: 'MAD', description: 'Property in USA (USD) → MAD' },
  { amount: 750000, from: 'USD', to: 'EUR', description: 'Property in USA (USD) → EUR' },
];

console.log('\n📊 Test Results:\n');

testCases.forEach((test, index) => {
  const converted = convertPrice(test.amount, test.from, test.to);
  console.log(`${index + 1}. ${test.description}`);
  console.log(`   ${formatCurrency(test.amount, test.from)} → ${formatCurrency(converted, test.to)}`);
  console.log('');
});

// Verify reverse conversions
console.log('=' .repeat(60));
console.log('\n🔄 Reverse Conversion Verification:\n');

function testReverseConversion(amount, currency1, currency2) {
  const forward = convertPrice(amount, currency1, currency2);
  const reverse = convertPrice(forward, currency2, currency1);
  const difference = Math.abs(amount - reverse);
  const percentDiff = (difference / amount * 100).toFixed(2);
  
  console.log(`${formatCurrency(amount, currency1)} → ${formatCurrency(forward, currency2)} → ${formatCurrency(reverse, currency1)}`);
  console.log(`   Difference: ${difference} (${percentDiff}%) ${difference <= 1 ? '✅' : '⚠️'}`);
  console.log('');
}

testReverseConversion(1000000, 'EUR', 'MAD');
testReverseConversion(500000, 'AED', 'USD');
testReverseConversion(2000000, 'MAD', 'EUR');

// Test property examples
console.log('=' .repeat(60));
console.log('\n🏠 Real Property Examples:\n');

const properties = [
  { name: 'Villa in Essaouira', price: 3500000, currency: 'MAD' },
  { name: 'Apartment in Paris', price: 850000, currency: 'EUR' },
  { name: 'Penthouse in Dubai', price: 2500000, currency: 'AED' },
  { name: 'House in London', price: 950000, currency: 'GBP' },
];

const targetCurrency = 'EUR'; // User selected currency

console.log(`User's selected currency: ${targetCurrency}\n`);

properties.forEach(prop => {
  const converted = convertPrice(prop.price, prop.currency, targetCurrency);
  console.log(`📍 ${prop.name}`);
  console.log(`   Original: ${formatCurrency(prop.price, prop.currency)}`);
  console.log(`   Displayed: ${formatCurrency(converted, targetCurrency)}`);
  if (prop.currency !== targetCurrency) {
    console.log(`   ⚠️  Currency converted from ${prop.currency} to ${targetCurrency}`);
  } else {
    console.log(`   ✅ No conversion needed`);
  }
  console.log('');
});

console.log('=' .repeat(60));
console.log('\n✅ Currency conversion test completed!\n');
