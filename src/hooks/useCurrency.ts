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
