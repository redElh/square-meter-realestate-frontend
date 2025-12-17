# Internationalization (i18n) Implementation Guide

## Overview

This application now supports **6 languages** and **5 currencies** with complete internationalization:

### Supported Languages
- **English (en)** - Default
- **French (fr)**
- **Arabic (ar)** - RTL support
- **Spanish (es)**
- **German (de)**
- **Russian (ru)**

### Supported Currencies
- **Dirham Marocain (MAD)** - Default/Base currency
- **Dirham Emirati (AED)**
- **Euro (EUR)**
- **US Dollar (USD)**
- **British Pound (GBP)**

## Key Features

✅ **Complete Translation System** - All UI text translatable
✅ **RTL Support** - Full right-to-left support for Arabic
✅ **Currency Conversion** - Automatic price conversion with live exchange rates
✅ **Persistent Settings** - Language and currency saved to localStorage
✅ **React Context API** - Global state management
✅ **Type-Safe** - Full TypeScript support
✅ **react-i18next** - Industry-standard i18n library

## Quick Start

### 1. Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('home.hero.title')}</p>
    </div>
  );
};
```

### 2. Using Currency Formatting

```tsx
import { useCurrency } from '../hooks/useCurrency';

const PropertyCard = ({ price }) => {
  const { format } = useCurrency();
  
  return (
    <div>
      <span>{format(price)}</span> {/* Automatically converts and formats */}
    </div>
  );
};
```

### 3. Using Localization Context

```tsx
import { useLocalization } from '../contexts/LocalizationContext';

const SettingsPanel = () => {
  const { 
    language, 
    currency, 
    setLanguage, 
    setCurrency, 
    isRTL,
    languages,
    currencies 
  } = useLocalization();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Your content */}
    </div>
  );
};
```

## Translation File Structure

Translation files are located in `src/i18n/locales/{language}/translation.json`

```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading...",
    "save": "Save"
  },
  "navigation": {
    "home": "Home",
    "properties": "Properties"
  },
  "home": {
    "hero": {
      "title": "Exceptional Real Estate",
      "subtitle": "Discover the world's most prestigious properties"
    }
  }
}
```

## API Reference

### `useLocalization()` Hook

Returns:
- `language: SupportedLanguage` - Current language
- `currency: SupportedCurrency` - Current currency
- `setLanguage(lang)` - Change language
- `setCurrency(curr)` - Change currency
- `formatPrice(amount, showSymbol?)` - Format price with conversion
- `convertPrice(amount, fromCurrency?)` - Convert price between currencies
- `isRTL: boolean` - Whether current language is RTL
- `languages: LanguageInfo[]` - All available languages
- `currencies: CurrencyInfo[]` - All available currencies

### `useCurrency()` Hook

Returns:
- `format(amount, showSymbol?)` - Format and convert price
- `convertPrice(amount, fromCurrency?)` - Convert price
- `getSymbol()` - Get current currency symbol
- `getCode()` - Get current currency code
- `currency` - Current currency code
- `currencies` - All available currencies

### `useTranslation()` Hook (from react-i18next)

Returns:
- `t(key, options?)` - Translate a key
- `i18n` - i18n instance for advanced operations

## Price Conversion

All prices are stored in **MAD (Dirham Marocain)** as the base currency.

**Example:**
```tsx
// Property price stored as 3,500,000 MAD
const price = 3500000;

// When EUR is selected (rate: 0.092)
format(price) // Returns: "€ 322,000"

// When USD is selected (rate: 0.10)
format(price) // Returns: "$ 350,000"

// When AED is selected (rate: 0.37)
format(price) // Returns: "1,295,000 د.إ"
```

## Adding New Translations

### Step 1: Add to all translation files

Add your new key to all 6 language files:
- `src/i18n/locales/en/translation.json`
- `src/i18n/locales/fr/translation.json`
- `src/i18n/locales/ar/translation.json`
- `src/i18n/locales/es/translation.json`
- `src/i18n/locales/de/translation.json`
- `src/i18n/locales/ru/translation.json`

### Step 2: Use in your component

```tsx
const { t } = useTranslation();
<h1>{t('your.new.key')}</h1>
```

## RTL (Right-to-Left) Support

Arabic language automatically enables RTL mode:

```tsx
const { isRTL } = useLocalization();

<div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'text-right' : ''}>
  {/* Content */}
</div>
```

## Updating Currency Exchange Rates

Exchange rates are defined in `src/contexts/LocalizationContext.tsx`:

```typescript
const CURRENCIES: CurrencyInfo[] = [
  { code: 'MAD', symbol: 'DH', name: 'Dirham Marocain', rate: 1 },
  { code: 'AED', symbol: 'د.إ', name: 'Dirham Emirati', rate: 0.37 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.092 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.10 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.078 },
];
```

Update these rates periodically to reflect current exchange rates.

## Best Practices

### 1. Always use translation keys
❌ Don't: `<h1>Welcome</h1>`
✅ Do: `<h1>{t('common.welcome')}</h1>`

### 2. Use semantic translation keys
❌ Don't: `t('text1')`, `t('string2')`
✅ Do: `t('home.hero.title')`, `t('properties.filters.type')`

### 3. Format all prices consistently
❌ Don't: `{price.toLocaleString()} €`
✅ Do: `{format(price)}`

### 4. Handle RTL layouts
```tsx
const { isRTL } = useLocalization();

// Spacing
<div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''}`}>

// Text alignment
<p className={isRTL ? 'text-right' : 'text-left'}>

// Icons
<Icon className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
```

### 5. Provide context for translators
Use descriptive keys and group related translations:

```json
{
  "properties": {
    "filters": {
      "type": "Property Type",
      "location": "Location",
      "priceRange": "Price Range"
    },
    "details": {
      "bedrooms": "Bedrooms",
      "bathrooms": "Bathrooms"
    }
  }
}
```

## Examples

### Complete Component Example

```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../contexts/LocalizationContext';
import { useCurrency } from '../hooks/useCurrency';

const PropertyCard = ({ property }) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();
  const { format } = useCurrency();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="property-card">
      <img src={property.image} alt={property.title} />
      
      <h3 className={isRTL ? 'text-right' : ''}>{property.title}</h3>
      
      <div className="details">
        <span>{t('properties.details.bedrooms')}: {property.bedrooms}</span>
        <span>{t('properties.details.bathrooms')}: {property.bathrooms}</span>
      </div>
      
      <div className="price">
        {format(property.price)}
      </div>
      
      <button className="btn-primary">
        {t('common.view')} {t('common.details')}
      </button>
    </div>
  );
};

export default PropertyCard;
```

## Testing Different Languages

1. Go to `/settings`
2. Select a language
3. Select a currency
4. Click "Apply Settings"
5. The entire app will update instantly!

## Troubleshooting

### Translations not showing
- Check that the key exists in all language files
- Verify the translation file is imported in `src/i18n/config.ts`
- Make sure the component is wrapped in `Suspense` (already done in App.tsx)

### Currency not converting
- Ensure prices are stored as numbers in MAD
- Check that exchange rates are set correctly in LocalizationContext
- Verify you're using `format()` from `useCurrency` hook

### RTL layout issues
- Apply `dir="rtl"` to container elements
- Use conditional classes: `${isRTL ? 'rtl-class' : 'ltr-class'}`
- Test with Arabic language selected

## Future Enhancements

- [ ] Dynamic currency exchange rate API integration
- [ ] Lazy loading for translation files
- [ ] Translation management system
- [ ] A/B testing for translations
- [ ] Analytics for language preferences

## Support

For questions or issues with the i18n system, consult:
- [react-i18next documentation](https://react.i18next.com/)
- LocalizationContext source code
- Team lead or senior developer

---

**Remember:** Every user-facing string should be translatable! 🌍
