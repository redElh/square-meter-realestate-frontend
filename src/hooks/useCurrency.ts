// Custom hook for price formatting with currency conversion
import { useLocalization } from '../contexts/LocalizationContext';

export const useCurrency = () => {
  const { formatPrice, convertPrice, currency, currencies } = useLocalization();
  
  return {
    formatPrice,
    convertPrice,
    currency,
    currencies,
    /**
     * Format a price with currency symbol
     * @param amount - The amount in MAD (base currency)
     * @param showSymbol - Whether to show currency symbol (default: true)
     */
    format: (amount: number, showSymbol = true) => formatPrice(amount, showSymbol),
    
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
