// Custom hook for price formatting with currency conversion
import { useLocalization, SupportedCurrency } from '../contexts/LocalizationContext';

export const useCurrency = () => {
  const { formatPrice, convertPrice, currency, currencies } = useLocalization();
  
  return {
    formatPrice,
    convertPrice,
    currency,
    currencies,
    /**
     * Format a price with currency symbol
     * @param amount - The amount to format
     * @param sourceCurrency - The currency of the input amount (default: 'MAD')
     * @param showSymbol - Whether to show currency symbol (default: true)
     */
    format: (amount: number, sourceCurrency: SupportedCurrency = 'MAD', showSymbol = true) => {
      // Validate source currency
      const validCurrencies: SupportedCurrency[] = ['MAD', 'AED', 'EUR', 'USD', 'GBP'];
      const isValidCurrency = validCurrencies.includes(sourceCurrency);
      
      if (!isValidCurrency) {
        console.warn(`⚠️ Invalid source currency "${sourceCurrency}" in useCurrency.format(). Defaulting to MAD.`);
        console.warn(`   Valid currencies: ${validCurrencies.join(', ')}`);
        sourceCurrency = 'MAD';
      }
      
      // Log conversion for debugging (only in development)
      if (process.env.NODE_ENV === 'development' && sourceCurrency !== currency) {
        console.log(`💱 Converting: ${amount} ${sourceCurrency} → ${currency}`);
      }
      
      // Convert from source currency to selected currency
      const converted = convertPrice(amount, sourceCurrency);
      const currencyInfo = currencies.find(c => c.code === currency);
      
      // Format with proper locale
      const formatter = new Intl.NumberFormat('en', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      
      const formattedNumber = formatter.format(Math.round(converted));
      
      if (!showSymbol) {
        return formattedNumber;
      }
      
      return `${currencyInfo?.symbol || ''} ${formattedNumber}`;
    },
    
    /**
     * Get currency symbol for current currency
     */
    getSymbol: () => currencies.find(c => c.code === currency)?.symbol || '',
    
    /**
     * Get currency code
     */
    getCode: () => currency,
  };
};

export default useCurrency;
