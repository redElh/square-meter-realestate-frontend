// src/pages/support/Terms.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  BuildingOffice2Icon,
  ScaleIcon,
  LockClosedIcon,
  BellAlertIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Terms: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    t('terms.services.service1'),
    t('terms.services.service2'),
    t('terms.services.service3'),
    t('terms.services.service4'),
    t('terms.services.service5')
  ];

  const confidentialityCommitments = [
    t('terms.confidentiality.item1'),
    t('terms.confidentiality.item2'),
    t('terms.confidentiality.item3'),
    t('terms.confidentiality.item4')
  ];

  const keyArticles = [
    {
      icon: DocumentTextIcon,
      article: t('terms.keyArticles.article1.number'),
      title: t('terms.keyArticles.article1.title'),
      description: t('terms.keyArticles.article1.description')
    },
    {
      icon: BuildingOffice2Icon,
      article: t('terms.keyArticles.article2.number'),
      title: t('terms.keyArticles.article2.title'),
      description: t('terms.keyArticles.article2.description')
    },
    {
      icon: LockClosedIcon,
      article: t('terms.keyArticles.article3.number'),
      title: t('terms.keyArticles.article3.title'),
      description: t('terms.keyArticles.article3.description')
    },
    {
      icon: UserCircleIcon,
      article: t('terms.keyArticles.article4.number'),
      title: t('terms.keyArticles.article4.title'),
      description: t('terms.keyArticles.article4.description')
    },
    {
      icon: ShieldCheckIcon,
      article: t('terms.keyArticles.article5.number'),
      title: t('terms.keyArticles.article5.title'),
      description: t('terms.keyArticles.article5.description')
    },
    {
      icon: ScaleIcon,
      article: t('terms.keyArticles.article9.number'),
      title: t('terms.keyArticles.article9.title'),
      description: t('terms.keyArticles.article9.description')
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark Gradient */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-16 sm:py-20 lg:py-24 -mt-24 sm:-mt-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center pt-24 sm:pt-32">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm border-2 border-white/30 mb-6 sm:mb-8">
              <DocumentTextIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              {t('terms.title')}
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {t('terms.subtitle')}
            </p>
            <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2 text-white/70 text-sm sm:text-base">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('terms.lastUpdated')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Key Articles Grid */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-gray-900 mb-4">
              {t('terms.keyArticlesTitle')}
            </h2>
            <div className="h-1 bg-[#023927] w-24 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {keyArticles.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border-2 border-gray-200 p-6 group hover:border-[#023927] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#023927] to-[#0a4d3a] flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-[#023927] font-medium uppercase tracking-wider mb-1">
                        {item.article}
                      </div>
                      <h3 className="font-inter font-medium text-gray-900 text-lg">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="font-inter text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-gradient-to-br from-[#023927] to-[#0a4d3a] p-8 sm:p-10 text-white">
              <BuildingOffice2Icon className="w-12 h-12 mb-6 opacity-80" />
              <h2 className="text-2xl sm:text-3xl font-inter font-light mb-6">
                {t('terms.servicesTitle')}
              </h2>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="text-white/70 text-lg mt-1">•</span>
                    <p className="text-white/90 text-sm sm:text-base">{service}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 sm:p-10 border-l-4 border-[#023927]">
              <LockClosedIcon className="w-12 h-12 text-[#023927] mb-6" />
              <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-6">
                {t('terms.confidentialityTitle')}
              </h2>
              <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                {t('terms.confidentialityDescription')}
              </p>
              <div className="space-y-3">
                {confidentialityCommitments.map((commitment, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white border-l-2 border-[#023927]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#023927] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{commitment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Responsibilities */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="bg-white border-2 border-gray-200 p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-8 flex items-center">
              <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#023927] mr-4" />
              {t('terms.responsibilitiesTitle')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-inter font-medium text-[#023927] text-lg mb-4">
                  {t('terms.companyResponsibilitiesTitle')}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {t('terms.companyResponsibilitiesText')}
                </p>
              </div>
              
              <div>
                <h3 className="font-inter font-medium text-[#023927] text-lg mb-4">
                  {t('terms.userResponsibilitiesTitle')}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {t('terms.userResponsibilitiesText')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Terms */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 hover:border-[#023927] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center text-white font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <h3 className="font-inter font-medium text-gray-900 text-lg mb-3">
                    {t('terms.keyArticles.article6.number')} - {t('terms.keyArticles.article6.title')}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {t('terms.keyArticles.article6.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 hover:border-[#023927] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center text-white font-bold flex-shrink-0">
                  7
                </div>
                <div>
                  <h3 className="font-inter font-medium text-gray-900 text-lg mb-3">
                    {t('terms.keyArticles.article7.number')} - {t('terms.keyArticles.article7.title')}
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {t('terms.keyArticles.article7.description')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 p-6 sm:p-8 hover:border-[#023927] transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#023927] flex items-center justify-center text-white font-bold flex-shrink-0">
                  8
                </div>
                <div>
                  <h3 className="font-inter font-medium text-gray-900 text-lg mb-3 flex items-center">
                    {t('terms.keyArticles.article8.number')} - {t('terms.keyArticles.article8.title')}
                    <BellAlertIcon className="w-5 h-5 ml-2 text-[#023927]" />
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {t('terms.keyArticles.article8.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-8 sm:p-12 text-white text-center">
            <ScaleIcon className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl sm:text-3xl font-inter font-light mb-4">
              {t('terms.questionsTitle')}
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              {t('terms.questionsDescription')}
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 border-2 border-white/30 inline-block">
              <p className="text-sm text-white/70 mb-2">{t('terms.contactLegal')}</p>
              <p className="text-lg font-medium">Essaouira@m2squaremeter.com</p>
              <p className="text-base mt-2">+212 7 00 00 06 44</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;