import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization, SupportedLanguage, SupportedCurrency } from '../../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GlobeAltIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  SparklesIcon,
  LanguageIcon,
  BanknotesIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
} from '@heroicons/react/24/solid';

type ActiveTab = 'language' | 'currency';

const LanguageCurrency: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, currency, setLanguage, setCurrency, languages, currencies } = useLocalization();

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(currency);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('language');

  const hasChanges = selectedLanguage !== language || selectedCurrency !== currency;

  const selectedLangInfo = useMemo(() => languages.find((l) => l.code === selectedLanguage), [languages, selectedLanguage]);
  const selectedCurrInfo = useMemo(() => currencies.find((c) => c.code === selectedCurrency), [currencies, selectedCurrency]);
  const currentLangInfo = useMemo(() => languages.find((l) => l.code === language), [languages, language]);
  const currentCurrInfo = useMemo(() => currencies.find((c) => c.code === currency), [currencies, currency]);

  // Live preview conversion: 2.5M MAD example
  const previewAmountMAD = 2500000;
  const previewConverted = useMemo(() => {
    if (!selectedCurrInfo) return '';
    const converted = previewAmountMAD * selectedCurrInfo.rate;
    try {
      return new Intl.NumberFormat(selectedLanguage, {
        style: 'currency',
        currency: selectedCurrency,
        maximumFractionDigits: 0,
      }).format(Math.round(converted));
    } catch {
      return `${selectedCurrInfo.symbol} ${Math.round(converted).toLocaleString()}`;
    }
  }, [selectedCurrInfo, selectedCurrency, selectedLanguage]);

  const applySettings = async () => {
    if (!hasChanges) return;
    setIsApplying(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLanguage(selectedLanguage);
    setCurrency(selectedCurrency);
    setShowSuccess(true);
    setIsApplying(false);
    setTimeout(() => navigate(-1), 1400);
  };

  const cancelSettings = () => navigate(-1);

  return (
    <div className="min-h-screen bg-white selection:bg-[#023927] selection:text-white">
      {/* Success Toast — premium glass */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-[0_20px_60px_-16px_rgba(2,57,39,0.35)] border border-[#023927]/10 overflow-hidden pointer-events-auto">
              <div className="h-[3px] bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927]" />
              <div className="px-5 py-4 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#023927] flex items-center justify-center flex-shrink-0">
                  <CheckCircleIconSolid className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-inter font-medium text-[14px] text-[#023927] leading-none">{t('settings.success')}</p>
                  <p className="font-inter text-[12px] text-[#023927]/60 mt-1">{t('settings.toastDetail', { lang: selectedLangInfo?.nativeName, curr: selectedCurrInfo?.code })}</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#0a4d3a] animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — premium exclusive */}
      <div className="relative overflow-hidden bg-[#023927]">
        {/* decorative layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#023927] via-[#0a4d3a] to-[#023927]" />
          <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-white/[0.06] blur-[90px]" />
          <div className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full bg-white/[0.04] blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1380px] mx-auto pt-14 pb-8 sm:pt-16 lg:pt-20 sm:pb-10 lg:pb-12 mt-2 sm:mt-3">
              {/* top bar */}
              <div className="flex items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button
                  onClick={cancelSettings}
                  className="group inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md px-3.5 py-2 text-white/90 hover:text-white transition-all duration-300"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                  <span className="font-inter text-[13px] font-medium tracking-wide">{t('common.back') || 'Back'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-2 text-white/50 font-inter text-xs tracking-widest uppercase">
                  <span>Square Meter</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-white/90">{t('settings.heroRegionalPreferences')}</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
                  <span className="font-inter text-xs text-white/90">{t('settings.heroLivePreview')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_380px] gap-6 sm:gap-8 lg:gap-10 items-start lg:items-end">
                {/* Title */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur px-3 py-1.5 mb-4">
                    <SparklesIcon className="w-3.5 h-3.5 text-white/90" />
                    <span className="font-inter text-[11px] tracking-[0.14em] uppercase text-white/90 font-medium">{t('settings.heroBadgeExclusive')}</span>
                    <span className="w-px h-3 bg-white/20 mx-1" />
                    <span className="font-inter text-[11px] text-white/70">{t('settings.heroBadgeSecure')}</span>
                  </div>

                  <h1 className="font-didont font-light text-white leading-[0.95] tracking-tight">
                    <span className="block text-[28px] sm:text-[36px] lg:text-[44px]">{t('settings.heroTitle1')}</span>
                    <span className="block text-[28px] sm:text-[36px] lg:text-[44px] font-inter font-extralight italic text-white/90 -mt-1">
                      {t('settings.heroTitle2')}
                    </span>
                  </h1>
                  <div className="mt-4 h-px w-24 bg-gradient-to-r from-white/30 to-transparent" />
                  <p className="mt-4 font-inter text-[15px] leading-6 text-white/75 max-w-xl">
                    {t('settings.subtitle')} {t('settings.heroRefined')}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white text-[#023927] px-3.5 py-2 font-inter font-medium shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-[#023927]/10 flex items-center justify-center text-[11px]">{currentLangInfo?.flag}</span>
                      {currentLangInfo?.nativeName}
                      <span className="w-px h-3 bg-[#023927]/15 mx-1" />
                      <span className="tracking-widest">{currentCurrInfo?.code}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 px-3 py-2 backdrop-blur">
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-white/90" />
                      {t('settings.heroStoredEncrypted')}
                    </span>
                  </div>
                </div>

                {/* Live preview glass card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-[24px] bg-white/[0.08] backdrop-blur-xl border border-white/15 overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
                >
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <EyeIcon className="w-4 h-4 text-[#023927]" />
                        </div>
                        <div>
                          <p className="font-inter text-[11px] tracking-[0.12em] uppercase text-white/60 font-medium leading-none">{t('settings.previewLive')}</p>
                          <p className="font-inter text-xs text-white/90 mt-1">{t('settings.previewHowPrices')}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium border backdrop-blur ${hasChanges ? 'bg-amber-400 text-[#023927] border-amber-300' : 'bg-white/15 text-white border-white/15'}`}>
                        {hasChanges ? t('settings.previewUnsaved') : t('settings.previewUpToDate')}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-inter text-[11px] tracking-widest uppercase text-[#023927]/50">{t('settings.previewVilla')}</p>
                          <p className="font-didont text-[18px] leading-none text-[#023927] mt-1">2 500 000 MAD</p>
                          <p className="font-inter text-xs text-[#023927]/60 mt-1">≈ {previewConverted} • {selectedLangInfo?.nativeName}</p>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#023927] text-white px-2.5 py-1">
                            <span className="text-sm leading-none">{selectedLangInfo?.flag}</span>
                            <span className="font-inter text-xs font-medium">{selectedCurrInfo?.code}</span>
                          </div>
                          <p className="font-inter text-[11px] text-[#023927]/50 mt-1.5">{selectedCurrInfo?.symbol} • {selectedCurrInfo ? t(`settings.currencyNames.${selectedCurrInfo.code}`, { defaultValue: selectedCurrInfo.name }) : ''}</p>
                        </div>
                      </div>
                      <div className="mt-3 h-px bg-[#023927]/10" />
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-inter text-xs text-[#023927]/60">{t('settings.previewAppliedEverywhere')}</span>
                        <span className="font-inter text-xs font-medium text-[#023927] flex items-center gap-1">
                          <GlobeAltIcon className="w-3.5 h-3.5" /> {selectedLanguage.toUpperCase()} · {selectedCurrency}
                        </span>
                      </div>
                    </div>

                    <p className="font-inter text-[11px] leading-4 text-white/60 mt-3">
                      {t('settings.previewHint')}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="max-w-[1380px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 sm:gap-6 lg:gap-8 items-start">
          {/* Left — selectors */}
          <div className="min-w-0">
            {/* Segmented control */}
            <div className="flex sm:inline-flex w-full sm:w-auto p-1 rounded-full bg-[#023927]/5 border border-[#023927]/10 backdrop-blur overflow-x-auto no-scrollbar">
              {(['language', 'currency'] as ActiveTab[]).map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative flex-1 sm:flex-none rounded-full px-4 sm:px-5 py-2.5 font-inter text-[13px] font-medium transition-colors duration-300 whitespace-nowrap ${
                      active ? 'text-white' : 'text-[#023927]/60 hover:text-[#023927]'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-full bg-[#023927] shadow-[0_8px_20px_rgba(2,57,39,0.25)]"
                        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {tab === 'language' ? <LanguageIcon className="w-4 h-4" /> : <BanknotesIcon className="w-4 h-4" />}
                      {tab === 'language' ? t('settings.language') : t('settings.currency')}
                      <span className={`ml-1 hidden sm:inline-flex items-center justify-center min-w-5 h-5 rounded-full text-[11px] px-1.5 ${active ? 'bg-white/15 text-white' : 'bg-[#023927]/10 text-[#023927]/70'}`}>
                        {tab === 'language' ? languages.length : currencies.length}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content card */}
            <div className="mt-5 rounded-[24px] sm:rounded-[28px] bg-white border border-[#023927]/10 shadow-[0_20px_60px_-20px_rgba(2,57,39,0.12)] overflow-hidden">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#023927]/10 to-transparent" />

              <AnimatePresence mode="wait">
                {activeTab === 'language' ? (
                  <motion.div
                    key="language"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="p-4 sm:p-6 lg:p-8"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div className="flex gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#023927] to-[#0a4d3a] flex items-center justify-center shadow-[0_10px_24px_rgba(2,57,39,0.25)]">
                          <GlobeAltIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-didont text-[22px] leading-none text-[#023927]">{t('settings.language')}</h2>
                          <p className="font-inter text-[13px] text-[#023927]/60 mt-1.5 max-w-md">{t('settings.languageDesc')} {t('settings.languageSuffix')}</p>
                        </div>
                      </div>
                      <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gray-50 border border-[#023927]/10 px-3 py-2">
                        <span className="w-2 h-2 rounded-full bg-[#023927]" />
                        <span className="font-inter text-xs text-[#023927]/70">{t('settings.selected', { name: selectedLangInfo?.nativeName })}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {languages.map((lang, idx) => {
                        const isSelected = selectedLanguage === lang.code;
                        const isCurrent = language === lang.code;
                        return (
                          <motion.button
                            key={lang.code}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setSelectedLanguage(lang.code)}
                            className={`group relative text-left rounded-[20px] p-[1.5px] transition-all duration-300 ${
                              isSelected ? 'bg-gradient-to-br from-[#023927] via-[#0a4d3a] to-[#023927] shadow-[0_14px_30px_rgba(2,57,39,0.18)]' : 'bg-[#023927]/10 hover:bg-[#023927]/15'
                            }`}
                          >
                            <div className={`relative rounded-[18.5px] p-4 h-full ${isSelected ? 'bg-gradient-to-br from-[#023927] to-[#0a4d3a] text-white' : 'bg-white hover:bg-gray-50 text-[#023927]'}`}>
                              {isCurrent && !isSelected && (
                                <span className="absolute -top-2 -right-2 rounded-full bg-[#023927] text-white text-[10px] font-bold tracking-widest px-2 py-1 shadow">{t('settings.current')}</span>
                              )}
                              <div className="flex items-start gap-3">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border shadow-sm ${isSelected ? 'bg-white text-[#023927] border-white/20' : 'bg-gray-50 border-[#023927]/10'}`}>
                                  <span>{lang.flag}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className={`font-inter font-semibold text-[14px] leading-none truncate ${isSelected ? 'text-white' : 'text-[#023927]'}`}>{lang.nativeName}</div>
                                  <div className={`font-inter text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-[#023927]/50'}`}>{t(`settings.languageNames.${lang.code}`, { defaultValue: lang.name })}</div>
                                  <div className="mt-2 inline-flex items-center gap-1.5">
                                    <span className={`text-[11px] tracking-widest font-medium rounded-full px-2 py-1 border ${isSelected ? 'bg-white/15 border-white/20 text-white' : 'bg-[#023927]/5 border-[#023927]/10 text-[#023927]/60'}`}>
                                      {lang.code.toUpperCase()}
                                    </span>
                                    {lang.rtl && (
                                      <span className={`text-[11px] rounded-full px-2 py-1 font-medium ${isSelected ? 'bg-white text-[#023927]' : 'bg-gray-50 text-[#023927] border border-[#023927]/15'}`}>RTL</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${isSelected ? 'bg-white border-white scale-100' : 'bg-white border-[#023927]/10 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'}`}>
                                <CheckIcon className={`w-4 h-4 ${isSelected ? 'text-[#023927]' : 'text-white'}`} strokeWidth={isSelected ? 2.5 : 2} />
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="mt-6 rounded-2xl bg-[#023927]/5 border border-[#023927]/10 p-4 flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#023927]/10 flex items-center justify-center flex-shrink-0">
                        <SparklesIcon className="w-4 h-4 text-[#023927]" />
                      </div>
                      <p className="font-inter text-xs leading-5 text-[#023927]/70">
                        {t('settings.tipRtl')}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="currency"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="p-4 sm:p-6 lg:p-8"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div className="flex gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#023927] to-[#0a4d3a] flex items-center justify-center shadow-[0_10px_24px_rgba(2,57,39,0.25)]">
                          <CurrencyDollarIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-didont text-[22px] leading-none text-[#023927]">{t('settings.currency')}</h2>
                          <p className="font-inter text-[13px] text-[#023927]/60 mt-1.5 max-w-md">{t('settings.currencyDesc')} {t('settings.currencySuffix')}</p>
                        </div>
                      </div>
                      <div className="rounded-full bg-[#023927] text-white px-3.5 py-2 font-inter text-xs flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-xs">{selectedCurrInfo?.symbol}</span>
                        {selectedCurrInfo?.code} • {Math.round(previewAmountMAD * (selectedCurrInfo?.rate || 1)).toLocaleString()} preview
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {currencies.map((curr, idx) => {
                        const isSelected = selectedCurrency === curr.code;
                        const isCurrent = currency === curr.code;
                        const sample = Math.round(previewAmountMAD * curr.rate).toLocaleString(selectedLanguage);
                        return (
                          <motion.button
                            key={curr.code}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setSelectedCurrency(curr.code)}
                            className={`group relative text-left rounded-[20px] p-[1.5px] transition-all duration-300 ${
                              isSelected ? 'bg-gradient-to-br from-[#023927] via-[#0a4d3a] to-[#023927] shadow-[0_14px_30px_rgba(2,57,39,0.18)]' : 'bg-[#023927]/10 hover:bg-[#023927]/15'
                            }`}
                          >
                            <div className={`relative rounded-[18.5px] p-4 h-full ${isSelected ? 'bg-gradient-to-br from-[#023927] to-[#0a4d3a] text-white' : 'bg-white hover:bg-gray-50 text-[#023927]'}`}>
                              {isCurrent && !isSelected && (
                                <span className="absolute -top-2 -right-2 rounded-full bg-[#023927] text-white text-[10px] font-bold tracking-widest px-2 py-1 shadow">{t('settings.current')}</span>
                              )}
                              <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-inter font-bold text-[16px] flex-shrink-0 border shadow-sm ${isSelected ? 'bg-white text-[#023927] border-white' : 'bg-gray-50 border-[#023927]/10 text-[#023927]'}`}>
                                  {curr.symbol}
                                </div>
                                <div className="min-w-0">
                                  <div className={`font-inter font-semibold text-[14px] leading-none ${isSelected ? 'text-white' : 'text-[#023927]'}`}>{curr.code}</div>
                                  <div className={`font-inter text-xs mt-1 truncate ${isSelected ? 'text-white/70' : 'text-[#023927]/50'}`}>{t(`settings.currencyNames.${curr.code}`, { defaultValue: curr.name })}</div>
                                </div>
                              </div>
                              <div className={`mt-3 rounded-xl px-3 py-2 border font-inter text-xs flex items-center justify-between ${isSelected ? 'bg-white/10 border-white/15 text-white' : 'bg-gray-50 border-[#023927]/10 text-[#023927]/60'}`}>
                                <span>2.5M MAD ≈</span>
                                <span className={`font-semibold ${isSelected ? 'text-white' : 'text-[#023927]'}`}>{curr.symbol} {sample}</span>
                              </div>

                              <div className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${isSelected ? 'bg-white border-white scale-100' : 'bg-white border-[#023927]/10 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'}`}>
                                <CheckIcon className={`w-4 h-4 ${isSelected ? 'text-[#023927]' : 'text-white'}`} strokeWidth={isSelected ? 2.5 : 2} />
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="mt-6 rounded-2xl bg-gray-50 border border-[#023927]/10 p-4 flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-[#023927]/10 flex items-center justify-center flex-shrink-0">
                        <BanknotesIcon className="w-4 h-4 text-[#023927]" />
                      </div>
                      <p className="font-inter text-xs leading-5 text-[#023927]/70">
                        {t('settings.ratesHint')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* bottom bar inside card */}
              <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gray-50 border-t border-[#023927]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 font-inter text-xs text-[#023927]/60">
                  <span className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                  {hasChanges ? t('settings.statusUnsaved') : t('settings.statusSaved')}
                  {hasChanges && <span className="hidden sm:inline text-[#023927]/40">{t('settings.statusWillApply')}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveTab(activeTab === 'language' ? 'currency' : 'language')} className="hidden sm:inline-flex font-inter text-xs font-medium text-[#023927] hover:text-[#0a4d3a] px-3 py-2 rounded-full hover:bg-white border border-transparent hover:border-[#023927]/10 transition">
                    {activeTab === 'language' ? t('settings.nextCurrency') : t('settings.backLanguage')}
                  </button>
                </div>
              </div>
            </div>

            {/* Need assistance? — now inside left column, below preferences */}
            <div className="mt-6 rounded-[24px] bg-white border border-[#023927]/10 p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h4 className="font-inter font-semibold text-[#023927] text-[15px]">{t('settings.assistanceTitle')}</h4>
                <span className="hidden sm:inline-flex items-center gap-2 font-inter text-xs text-[#023927]/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('settings.assistanceConcierge')}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="group flex items-center gap-3 rounded-2xl border border-[#023927]/10 bg-gray-50 p-3.5 sm:p-4 hover:border-[#023927]/15 hover:bg-white transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#023927] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"><GlobeAltIcon className="w-5 h-5 text-white" /></div>
                  <div className="min-w-0">
                    <p className="font-inter text-sm font-medium text-[#023927]">{t('settings.assistanceMultilingualTitle')}</p>
                    <p className="font-inter text-xs text-[#023927]/60 leading-4">{t('settings.assistanceMultilingualDesc')}</p>
                  </div>
                </div>
                <div className="group flex items-center gap-3 rounded-2xl border border-[#023927]/10 bg-gray-50 p-3.5 sm:p-4 hover:border-[#023927]/15 hover:bg-white transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#023927] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"><CurrencyDollarIcon className="w-5 h-5 text-white" /></div>
                  <div className="min-w-0">
                    <p className="font-inter text-sm font-medium text-[#023927]">{t('settings.assistanceRatesTitle')}</p>
                    <p className="font-inter text-xs text-[#023927]/60 leading-4">{t('settings.assistanceRatesDesc')}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex sm:hidden items-center gap-2 font-inter text-xs text-[#023927]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {t('settings.assistanceConcierge')}
              </div>
            </div>

          </div>

          {/* Right — sticky summary & actions */}
          <div className="space-y-5 sm:space-y-6 lg:sticky lg:top-24 self-start">
            {/* Selection summary — premium */}
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#023927] via-[#0a4d3a] to-[#023927] p-[1px] shadow-[0_20px_50px_rgba(2,57,39,0.25)]">
              <div className="rounded-[27px] bg-gradient-to-br from-[#023927] to-[#0a4d3a] overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
                <div className="relative p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
                      <ShieldCheckIconSolid className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-white text-[15px] leading-none">{t('settings.summaryTitle')}</h3>
                      <p className="font-inter text-xs text-white/60 mt-1">{t('settings.summarySubtitle')}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-3.5 flex items-center justify-between">
                      <span className="font-inter text-xs tracking-widest uppercase text-white/60">{t('settings.summaryLanguage')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{selectedLangInfo?.flag}</span>
                        <span className="font-inter font-medium text-white text-sm">{selectedLangInfo?.nativeName}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-3.5 flex items-center justify-between">
                      <span className="font-inter text-xs tracking-widest uppercase text-white/60">{t('settings.summaryCurrency')}</span>
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-white text-[#023927] flex items-center justify-center text-xs font-bold">{selectedCurrInfo?.symbol}</span>
                        <span className="font-inter font-medium text-white text-sm">{selectedCurrInfo?.code}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-inter text-xs text-[#023927]/50">{t('settings.previewExample')}</span>
                      <span className="font-inter text-[11px] tracking-widest uppercase bg-[#023927]/5 text-[#023927]/60 px-2 py-1 rounded-full">{t('settings.previewLiveBadge')}</span>
                    </div>
                    <p className="font-didont text-lg text-[#023927] mt-1 leading-none">{previewConverted}</p>
                    <p className="font-inter text-xs text-[#023927]/50 mt-1">{t('settings.previewForProperty')}</p>
                  </div>

                  <p className="font-inter text-[11px] leading-4 text-white/50 mt-4 text-center">
                    {t('settings.summaryHint')}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions — premium */}
            <div className="rounded-[28px] bg-white border border-[#023927]/10 shadow-[0_16px_40px_rgba(2,57,39,0.08)] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927]" />
              <div className="p-6">
                <div className="space-y-3">
                  <motion.button
                    whileHover={hasChanges && !isApplying ? { scale: 1.01 } : {}}
                    whileTap={hasChanges && !isApplying ? { scale: 0.99 } : {}}
                    onClick={applySettings}
                    disabled={!hasChanges || isApplying}
                    className={`group relative w-full overflow-hidden rounded-full py-4 font-inter font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                      !hasChanges || isApplying
                        ? 'bg-[#023927]/10 text-[#023927]/40 cursor-not-allowed border border-[#023927]/10'
                        : 'bg-[#023927] text-white shadow-[0_12px_24px_rgba(2,57,39,0.25)] hover:bg-[#0a4d3a] hover:shadow-[0_16px_30px_rgba(2,57,39,0.3)]'
                    }`}
                  >
                    {hasChanges && !isApplying && <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />}
                    {isApplying ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-[#023927]/20 border-t-[#023927] animate-spin" />
                        <span>{t('settings.applying')}</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className={`w-4 h-4 ${hasChanges ? 'group-hover:scale-110' : ''} transition-transform`} strokeWidth={2.5} />
                        <span>{t('settings.apply')}</span>
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={cancelSettings}
                    className="w-full rounded-full border border-[#023927]/15 bg-white text-[#023927] py-4 font-inter font-medium text-sm hover:bg-gray-50 hover:border-[#023927]/20 transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <XMarkIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span>{t('settings.cancel')}</span>
                  </button>
                </div>

                {!hasChanges && (
                  <p className="font-inter text-xs text-center text-[#023927]/40 mt-3">{t('settings.noChanges')}</p>
                )}

                <div className="mt-6 pt-6 border-t border-[#023927]/10">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#023927]/5 border border-[#023927]/10 flex items-center justify-center">
                      <ShieldCheckIconSolid className="w-3.5 h-3.5 text-[#023927]" />
                    </div>
                    <span className="font-inter font-semibold text-sm text-[#023927]">{t('settings.secureTitle')}</span>
                  </div>
                  <p className="font-inter text-xs leading-5 text-[#023927]/60">
                    {t('settings.secureDesc')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .font-didont { font-family: 'Didot', serif; }
      `}</style>
    </div>
  );
};

export default LanguageCurrency;
