import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization, SupportedLanguage, SupportedCurrency } from '../../contexts/LocalizationContext';
import { 
  GlobeAltIcon, 
  CurrencyDollarIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';

const LanguageCurrency: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, currency, setLanguage, setCurrency, languages, currencies, isRTL } = useLocalization();
  
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(currency);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const applySettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setIsApplying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLanguage(selectedLanguage);
    setCurrency(selectedCurrency);
    setShowSuccess(true);
    setIsApplying(false);
    
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);
  };

  const cancelSettings = () => {
    navigate(-1);
  };

  // Format currency for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: selectedCurrency
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Success Toast - Green Theme */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in px-4 max-w-full">
          <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white px-6 py-4 flex items-center space-x-3 border-2 border-white shadow-2xl">
            <CheckCircleIconSolid className="w-6 h-6 flex-shrink-0" />
            <span className="font-inter font-medium text-lg">{t('settings.success')}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={cancelSettings}
              className="flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-inter text-sm">{t('settings.back')}</span>
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 flex items-center justify-center border border-white/30">
                    <GlobeAltIcon className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-inter font-light text-white tracking-tight">
                    {t('settings.title')}
                  </h1>
                </div>
                <p className="text-white/90 font-inter text-lg max-w-2xl">
                  {t('settings.subtitle')}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <div className="bg-white/10 p-4 border border-white/20">
                  <div className="text-white font-inter text-sm mb-2">Current Selection</div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{languages.find(l => l.code === language)?.flag}</span>
                      <span className="font-inter text-white text-sm">
                        {languages.find(l => l.code === language)?.nativeName}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-white/30"></div>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="w-4 h-4 text-white" />
                      <span className="font-inter text-white text-sm">
                        {currencies.find(c => c.code === currency)?.code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Language Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* Language Section */}
              <div className="border-2 border-gray-200 p-6 sm:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-[#023927] flex items-center justify-center">
                    <GlobeAltIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-inter font-light text-gray-900 mb-1">
                      {t('settings.language')}
                    </h2>
                    <p className="text-gray-600 font-inter text-sm">
                      {t('settings.languageDesc')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`
                        relative p-4 border-2 transition-all duration-300 hover:bg-gray-50
                        ${selectedLanguage === lang.code 
                          ? 'border-[#023927] bg-[#023927]/5' 
                          : 'border-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="text-left">
                          <div className="font-inter font-medium text-gray-900 text-sm">
                            {lang.nativeName}
                          </div>
                          <div className="font-inter text-gray-500 text-xs">
                            {lang.name}
                          </div>
                        </div>
                      </div>
                      {selectedLanguage === lang.code && (
                        <div className="absolute top-2 right-2">
                          <CheckIcon className="w-5 h-5 text-[#023927]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Section */}
              <div className="border-2 border-gray-200 p-6 sm:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-[#023927] flex items-center justify-center">
                    <CurrencyDollarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-inter font-light text-gray-900 mb-1">
                      {t('settings.currency')}
                    </h2>
                    <p className="text-gray-600 font-inter text-sm">
                      {t('settings.currencyDesc')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setSelectedCurrency(curr.code)}
                      className={`
                        relative p-4 border-2 transition-all duration-300 hover:bg-gray-50
                        ${selectedCurrency === curr.code 
                          ? 'border-[#023927] bg-[#023927]/5' 
                          : 'border-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-900 font-inter font-medium text-sm">
                          {curr.symbol}
                        </div>
                        <div className="text-left">
                          <div className="font-inter font-medium text-gray-900 text-sm">
                            {curr.code}
                          </div>
                          <div className="font-inter text-gray-500 text-xs">
                            {curr.name}
                          </div>
                        </div>
                      </div>
                      {selectedCurrency === curr.code && (
                        <div className="absolute top-2 right-2">
                          <CheckIcon className="w-5 h-5 text-[#023927]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Currency Preview */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-inter font-medium text-gray-900 mb-4 text-sm">
                    Price Preview
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[2500000, 5000000, 10000000].map((price, index) => (
                      <div 
                        key={index}
                        className="border-2 border-gray-200 p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="text-gray-500 font-inter text-xs mb-2">
                          {['Luxury Apartment', 'Villa', 'Estate'][index]}
                        </div>
                        <div className="font-inter font-medium text-gray-900 text-lg">
                          {formatPrice(price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Preview & Actions */}
            <div className="space-y-8">
              {/* Selection Summary */}
              <div className="bg-gradient-to-br from-[#023927] to-[#0a4d3a] p-6 text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <ShieldCheckIconSolid className="w-6 h-6" />
                  <h3 className="font-inter font-medium text-lg">
                    Selection Summary
                  </h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 border border-white/30">
                    <span className="font-inter text-sm">Language</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                      <span className="font-inter font-medium">
                        {languages.find(l => l.code === selectedLanguage)?.nativeName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-white/30">
                    <span className="font-inter text-sm">Currency</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 flex items-center justify-center bg-white/20">
                        <CurrencyDollarIcon className="w-3 h-3" />
                      </div>
                      <span className="font-inter font-medium">
                        {currencies.find(c => c.code === selectedCurrency)?.code}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-white/80 font-inter text-xs leading-relaxed">
                  Changes will be applied across all property listings and pricing.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-2 border-gray-200 p-6">
                <div className="space-y-4">
                  <button
                    onClick={applySettings}
                    disabled={isApplying}
                    className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-4 font-inter font-medium hover:from-[#0a4d3a] hover:to-[#023927] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                  >
                    {isApplying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        <span>{t('settings.applying')}</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                        <span>{t('settings.apply')}</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={cancelSettings}
                    className="w-full border-2 border-gray-300 text-gray-700 py-4 font-inter font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2 group"
                  >
                    <XMarkIcon className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                    <span>{t('settings.cancel')}</span>
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <ShieldCheckIconSolid className="w-5 h-5 text-[#023927]" />
                    <span className="font-inter font-medium text-gray-900 text-sm">
                      Secure & Confidential
                    </span>
                  </div>
                  <p className="font-inter text-gray-600 text-xs leading-relaxed">
                    Your preferences are securely stored and will be used exclusively to enhance your browsing experience.
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="border-2 border-gray-200 p-6">
                <h4 className="font-inter font-medium text-gray-900 mb-4 text-sm">
                  Need Assistance?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border-2 border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="w-8 h-8 bg-[#023927] flex items-center justify-center">
                      <GlobeAltIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-inter text-gray-900 text-sm">Multi-language Support</div>
                      <div className="font-inter text-gray-500 text-xs">24/7 assistance in your preferred language</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border-2 border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="w-8 h-8 bg-[#023927] flex items-center justify-center">
                      <CurrencyDollarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-inter text-gray-900 text-sm">Real-time Exchange Rates</div>
                      <div className="font-inter text-gray-500 text-xs">Updated live market rates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageCurrency;