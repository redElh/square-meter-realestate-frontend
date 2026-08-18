// i18n Configuration for react-i18next
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationAR from './locales/ar/translation.json';
import translationES from './locales/es/translation.json';
import translationDE from './locales/de/translation.json';
import translationRU from './locales/ru/translation.json';

export const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  ar: { translation: translationAR },
  es: { translation: translationES },
  de: { translation: translationDE },
  ru: { translation: translationRU },
} as const;

const supportedLngs = ['fr', 'en', 'ar', 'es', 'de', 'ru'];

const storedLng = localStorage.getItem('appLanguage');
const validLng = storedLng && supportedLngs.includes(storedLng) ? storedLng : 'fr';
if (storedLng && !supportedLngs.includes(storedLng)) {
  localStorage.removeItem('appLanguage');
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    lng: validLng,
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    supportedLngs: ['fr', 'en', 'ar', 'es', 'de', 'ru'],
    nonExplicitSupportedLngs: true,

    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'appLanguage',
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
