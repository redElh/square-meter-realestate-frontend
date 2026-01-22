// src/pages/support/Privacy.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  EyeSlashIcon,
  DocumentCheckIcon,
  UserCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Privacy: React.FC = () => {
  const { t } = useTranslation();

  const privacyPrinciples = [
    {
      icon: ShieldCheckIcon,
      title: t('privacy.principles.principle1.title'),
      description: t('privacy.principles.principle1.description')
    },
    {
      icon: EyeSlashIcon,
      title: t('privacy.principles.principle2.title'),
      description: t('privacy.principles.principle2.description')
    },
    {
      icon: LockClosedIcon,
      title: t('privacy.principles.principle3.title'),
      description: t('privacy.principles.principle3.description')
    },
    {
      icon: DocumentCheckIcon,
      title: t('privacy.principles.principle4.title'),
      description: t('privacy.principles.principle4.description')
    }
  ];

  const dataCategories = [
    {
      title: t('privacy.dataCategories.category1.title'),
      items: [t('privacy.dataCategories.category1.items.item1'), t('privacy.dataCategories.category1.items.item2'), t('privacy.dataCategories.category1.items.item3'), t('privacy.dataCategories.category1.items.item4')]
    },
    {
      title: t('privacy.dataCategories.category2.title'),
      items: [t('privacy.dataCategories.category2.items.item1'), t('privacy.dataCategories.category2.items.item2'), t('privacy.dataCategories.category2.items.item3')]
    },
    {
      title: t('privacy.dataCategories.category3.title'),
      items: [t('privacy.dataCategories.category3.items.item1'), t('privacy.dataCategories.category3.items.item2'), t('privacy.dataCategories.category3.items.item3'), t('privacy.dataCategories.category3.items.item4')]
    },
    {
      title: t('privacy.dataCategories.category4.title'),
      items: [t('privacy.dataCategories.category4.items.item1'), t('privacy.dataCategories.category4.items.item2'), t('privacy.dataCategories.category4.items.item3'), t('privacy.dataCategories.category4.items.item4')]
    }
  ];

  const yourRights = [
    { icon: UserCircleIcon, title: t('privacy.rights.right1.title'), description: t('privacy.rights.right1.description') },
    { icon: DocumentCheckIcon, title: t('privacy.rights.right2.title'), description: t('privacy.rights.right2.description') },
    { icon: EyeSlashIcon, title: t('privacy.rights.right3.title'), description: t('privacy.rights.right3.description') },
    { icon: LockClosedIcon, title: t('privacy.rights.right4.title'), description: t('privacy.rights.right4.description') },
    { icon: ShieldCheckIcon, title: t('privacy.rights.right5.title'), description: t('privacy.rights.right5.description') },
    { icon: ClockIcon, title: t('privacy.rights.right6.title'), description: t('privacy.rights.right6.description') }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark Gradient */}
      <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] py-16 sm:py-20 lg:py-24 -mt-24 sm:-mt-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center pt-24 sm:pt-32">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm border-2 border-white/30 mb-6 sm:mb-8">
              <ShieldCheckIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
              {t('privacy.title')}
            </h1>
            <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {t('privacy.subtitle')}
            </p>
            <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2 text-white/70 text-sm sm:text-base">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('privacy.lastUpdated')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Privacy Principles */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-gray-900 mb-4">
              {t('privacy.commitmentsTitle')}
            </h2>
            <div className="h-1 bg-[#023927] w-24 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {privacyPrinciples.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border-2 border-gray-200 p-6 sm:p-8 group hover:border-[#023927] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#023927] to-[#0a4d3a] flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-inter font-medium text-gray-900 text-lg sm:text-xl mb-2">
                        {principle.title}
                      </h3>
                      <p className="font-inter text-gray-600 text-sm sm:text-base leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Collection */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 sm:p-12 border-l-4 border-[#023927]">
            <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-8 sm:mb-12">
              {t('privacy.dataCollectionTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dataCategories.map((category, index) => (
                <div key={index} className="bg-white p-6 border-2 border-gray-200">
                  <h3 className="font-inter font-medium text-[#023927] text-lg mb-4 flex items-center">
                    <span className="w-8 h-8 bg-[#023927] text-white flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-gray-600 text-sm">
                        <span className="text-[#023927] mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Section */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-6">
                {t('privacy.dataUsageTitle')}
              </h2>
              <div className="space-y-4">
                {[
                  t('privacy.dataUsage.usage1'),
                  t('privacy.dataUsage.usage2'),
                  t('privacy.dataUsage.usage3'),
                  t('privacy.dataUsage.usage4'),
                  t('privacy.dataUsage.usage5')
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 border-l-2 border-[#023927]">
                    <ShieldCheckIcon className="w-5 h-5 text-[#023927] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm sm:text-base">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-6">
                {t('privacy.dataRetentionTitle')}
              </h2>
              <div className="bg-gradient-to-br from-[#023927] to-[#0a4d3a] p-8 text-white">
                <ClockIcon className="w-12 h-12 mb-6 opacity-80" />
                <p className="text-base sm:text-lg leading-relaxed mb-6">
                  {t('privacy.dataRetentionDescription')}
                </p>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-start space-x-3">
                    <span className="text-white/70">•</span>
                    <span className="text-white/90">{t('privacy.dataRetention.item1')}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-white/70">•</span>
                    <span className="text-white/90">{t('privacy.dataRetention.item2')}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-white/70">•</span>
                    <span className="text-white/90">{t('privacy.dataRetention.item3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-gray-900 mb-4">
              {t('privacy.yourRightsTitle')}
            </h2>
            <div className="h-1 bg-[#023927] w-24 mx-auto mb-6"></div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('privacy.yourRightsDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yourRights.map((right, index) => {
              const IconComponent = right.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border-2 border-gray-200 p-6 hover:border-[#023927] transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#023927] flex items-center justify-center mb-4 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-[#023927] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-inter font-medium text-gray-900 text-base sm:text-lg mb-2">
                    {right.title}
                  </h3>
                  <p className="font-inter text-gray-600 text-sm leading-relaxed">
                    {right.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#023927] to-[#0a4d3a] p-8 sm:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-inter font-light mb-4">
                {t('privacy.exerciseRightsTitle')}
              </h2>
              <p className="text-white/90 text-base sm:text-lg">
                {t('privacy.exerciseRightsDescription')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/10 backdrop-blur-sm p-6 border-2 border-white/30">
              <div className="text-center">
                <EnvelopeIcon className="w-8 h-8 mx-auto mb-3 text-white/80" />
                <div className="text-sm text-white/70 mb-1">{t('privacy.contact.email')}</div>
                <div className="text-base font-medium">redaelhiri9@gmail.com</div>
              </div>
              <div className="text-center border-l border-r border-white/20">
                <PhoneIcon className="w-8 h-8 mx-auto mb-3 text-white/80" />
                <div className="text-sm text-white/70 mb-1">{t('privacy.contact.phone')}</div>
                <div className="text-base font-medium">+212 6 23 09 42 46</div>
              </div>
              <div className="text-center">
                <MapPinIcon className="w-8 h-8 mx-auto mb-3 text-white/80" />
                <div className="text-sm text-white/70 mb-1">{t('privacy.contact.address')}</div>
                <div className="text-base font-medium">Rue Abou Moussa Al Achaari<br/>44000 Essaouira</div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-white/80">
              <p>{t('privacy.responseTime')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;