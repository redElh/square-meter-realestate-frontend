import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LANG_KEY = 'appLanguage';
const CURRENCY_KEY = 'appCurrency';

const languages = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' }
];

const currencies = [
  { code: 'EUR', label: '€ - EUR' },
  { code: 'USD', label: '$ - USD' }
];

const LanguageCurrency: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<string>(languages[0].code);
  const [currency, setCurrency] = useState<string>(currencies[0].code);

  useEffect(() => {
    const storedLang = localStorage.getItem(LANG_KEY);
    const storedCurr = localStorage.getItem(CURRENCY_KEY);
    if (storedLang) setLanguage(storedLang);
    if (storedCurr) setCurrency(storedCurr);
  }, []);

  useEffect(() => {
    // reflect language in document element for a11y and potential i18n libs
    if (language) document.documentElement.lang = language;
  }, [language]);

  const applySettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem(LANG_KEY, language);
    localStorage.setItem(CURRENCY_KEY, currency);

    // Notify the app about the change so other parts can react
    try {
      window.dispatchEvent(new CustomEvent('appSettingsChanged', { detail: { language, currency } }));
    } catch (err) {
      // older browsers
      const ev = document.createEvent('Event');
      ev.initEvent('appSettingsChanged', true, true);
      (ev as any).detail = { language, currency };
      window.dispatchEvent(ev);
    }

    // Redirect back to home (or previous page) after applying
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-16">
      <form onSubmit={applySettings} className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Paramètres du site</h2>
        <p className="text-sm text-gray-600 mb-6">Choisissez la langue et la devise utilisées pour afficher le site.</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none">
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none">
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-md border border-gray-300">Annuler</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-gray-900 text-white">Appliquer</button>
        </div>
      </form>
    </div>
  );
};

export default LanguageCurrency;
