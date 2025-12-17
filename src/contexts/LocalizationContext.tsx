// Localization Context for Language and Currency Management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'es' | 'de' | 'ru';
export type SupportedCurrency = 'MAD' | 'AED' | 'EUR' | 'USD' | 'GBP';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rate: number; // Exchange rate to MAD (base currency)
}

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

interface LocalizationContextType {
  language: SupportedLanguage;
  currency: SupportedCurrency;
  setLanguage: (lang: SupportedLanguage) => void;
  setCurrency: (curr: SupportedCurrency) => void;
  formatPrice: (amount: number, showSymbol?: boolean) => string;
  convertPrice: (amount: number, fromCurrency?: SupportedCurrency) => number;
  currencies: CurrencyInfo[];
  languages: LanguageInfo[];
  isRTL: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Currency exchange rates (base: MAD)
const CURRENCIES: CurrencyInfo[] = [
  { code: 'MAD', symbol: 'DH', name: 'Dirham Marocain', rate: 1 },
  { code: 'AED', symbol: 'د.إ', name: 'Dirham Emirati', rate: 0.37 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.092 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.10 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.078 },
];

// Language configurations
const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
];

const LANG_KEY = 'appLanguage';
const CURRENCY_KEY = 'appCurrency';

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const stored = localStorage.getItem(LANG_KEY);
    return (stored as SupportedLanguage) || 'en';
  });
  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    const stored = localStorage.getItem(CURRENCY_KEY);
    return (stored as SupportedCurrency) || 'MAD';
  });

  const currentLangInfo = LANGUAGES.find(l => l.code === language);
  const isRTL = currentLangInfo?.rtl || false;

  useEffect(() => {
    // Set document direction for RTL support
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(LANG_KEY, lang);
    i18n.changeLanguage(lang);
    
    // Dispatch custom event for any listeners
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  };

  const setCurrency = (curr: SupportedCurrency) => {
    setCurrencyState(curr);
    localStorage.setItem(CURRENCY_KEY, curr);
    
    // Dispatch custom event for any listeners
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: curr } }));
  };

  const getCurrencyInfo = (code: SupportedCurrency): CurrencyInfo => {
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  };

  const convertPrice = (amount: number, fromCurrency: SupportedCurrency = 'MAD'): number => {
    const fromRate = getCurrencyInfo(fromCurrency).rate;
    const toRate = getCurrencyInfo(currency).rate;
    
    // Convert to MAD first, then to target currency
    const amountInMAD = amount / fromRate;
    return amountInMAD * toRate;
  };

  const formatPrice = (amount: number, showSymbol: boolean = true): string => {
    const currencyInfo = getCurrencyInfo(currency);
    const convertedAmount = convertPrice(amount, 'MAD');
    
    // Format with proper locale
    const formatter = new Intl.NumberFormat(language, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    const formattedNumber = formatter.format(Math.round(convertedAmount));
    
    if (!showSymbol) {
      return formattedNumber;
    }
    
    // Handle RTL currencies (Arabic)
    if (isRTL) {
      return `${formattedNumber} ${currencyInfo.symbol}`;
    }
    
    return `${currencyInfo.symbol} ${formattedNumber}`;
  };

  const value: LocalizationContextType = {
    language,
    currency,
    setLanguage,
    setCurrency,
    formatPrice,
    convertPrice,
    currencies: CURRENCIES,
    languages: LANGUAGES,
    isRTL,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export default LocalizationContext;
