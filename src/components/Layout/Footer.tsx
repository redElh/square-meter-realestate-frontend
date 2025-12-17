// src/components/Layout/Footer.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  BuildingLibraryIcon,
  HeartIcon,
  StarIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Consider footer "scrolled" when near bottom of page
      // (no longer tracking isScrolled in footer)
      
      // Show footer content with fade-in effect
      if (scrollPosition > documentHeight - windowHeight - 200) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = {
    properties: [
      { path: '/properties', label: t('footer.navigation.allProperties'), Icon: BuildingStorefrontIcon },
      { path: '/confidential', label: t('footer.navigation.confidentialSelection'), Icon: ShieldCheckIcon },
      { path: '/investment', label: t('footer.navigation.investment'), Icon: ChartBarIcon }
    ],
    clients: [
      { path: '/owners', label: t('footer.navigation.owners'), Icon: UserGroupIcon },
      { path: '/selling-multistep', label: t('footer.navigation.sellYourProperty'), Icon: BuildingStorefrontIcon },
      { path: '/traveler', label: t('footer.navigation.travelerSpace'), Icon: PaperAirplaneIcon },
      
    ],
    company: [
      { path: '/agency', label: t('footer.navigation.agency'), Icon: BuildingOfficeIcon },
      { path: '/mag', label: t('footer.navigation.magazine'), Icon: NewspaperIcon },
      { path: '/careers', label: t('footer.navigation.careers'), Icon: UserGroupIcon },
      { path: '/contact', label: t('footer.navigation.contact'), Icon: PhoneIcon }
    ]
  };

  const socialLinks = [
    { 
      name: 'Facebook', 
      href: '#', 
      Icon: ChatBubbleLeftRightIcon,
      label: t('footer.social.facebook')
    },
    { 
      name: 'Instagram', 
      href: '#', 
      Icon: CameraIcon,
      label: t('footer.social.instagram')
    },
    { 
      name: 'LinkedIn', 
      href: '#', 
      Icon: BuildingLibraryIcon,
      label: t('footer.social.linkedin')
    },
    { 
      name: 'Pinterest', 
      href: '#', 
      Icon: HeartIcon,
      label: t('footer.social.pinterest')
    }
  ];

  return (
    <footer className="bg-white relative overflow-hidden border-t border-gray-200">
      {/* Subtle background texture matching header */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white opacity-70" />
      
      {/* Minimal grid pattern - matching header sophistication */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 98%, #374151 100%),
                           linear-gradient(0deg, transparent 98%, #374151 100%)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main Footer Content */}
      <div className="container mx-auto px-3 sm:px-6 py-8 sm:py-16 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* Brand Section - Matching header logo treatment */}
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="inline-block group mb-4 sm:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Logo matching header */}
                <div className="relative transform group-hover:scale-105 transition-all duration-400">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-white/80 rounded-xl sm:rounded-2xl shadow-sm transform group-hover:rotate-1 transition-all duration-300 flex items-center justify-center overflow-hidden border border-gray-200 backdrop-blur-sm">
                    {/* Subtle shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500" />
                    
                    {/* Logo Content (use same image as header) */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <img src="/logo-m2.jpg" alt="Square Meter logo" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-900">
                    SQUARE METER
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 tracking-[0.15em] sm:tracking-[0.2em] transition-transform duration-300 font-medium">
                    IMMOBILIER
                  </span>
                </div>
              </div>
            </Link>
            
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-8 max-w-md leading-relaxed font-light">
              {t('footer.brand.description')}
            </p>
            
            {/* Social Links - Minimal design */}
            <div className="space-y-3 sm:space-y-4">
              <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-wide">
                {t('footer.social.title')}
              </p>
              <div className="flex space-x-2 sm:space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="relative group"
                    title={social.label}
                  >
                    <div className="relative p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-gray-50 group-hover:scale-110 group-hover:-translate-y-0.5">
                      <div className="relative">
                        <social.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transform transition-all duration-300 group-hover:text-gray-900" />
                      </div>
                      
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20">
                        {social.label}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links - Matching header structure */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h4 className="text-gray-800 text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 sm:mb-6 flex items-center space-x-2">
                <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg border border-gray-200">
                  <BuildingStorefrontIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
                <span>{t('footer.sections.properties')}</span>
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {navigation.properties.map((item, index) => {
                  return (
                    <li key={item.path}>
                      <Link 
                        to={item.path} 
                        className="group flex items-center space-x-2 sm:space-x-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:translate-x-1 font-medium text-xs sm:text-sm"
                      >
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-125"></div>
                        <span className="group-hover:font-semibold transition-all duration-300">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h4 className="text-gray-800 text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 sm:mb-6 flex items-center space-x-2">
                <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg border border-gray-200">
                  <UserGroupIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
                <span>{t('footer.sections.clients')}</span>
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {navigation.clients.map((item, index) => {
                  return (
                    <li key={item.path}>
                      <Link 
                        to={item.path} 
                        className="group flex items-center space-x-2 sm:space-x-3 py-1.5 sm:py-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:translate-x-1 font-medium text-xs sm:text-sm"
                      >
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-125"></div>
                        <span className="group-hover:font-semibold transition-all duration-300">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Enhanced Contact Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h4 className="text-gray-800 text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 sm:mb-6 flex items-center space-x-2">
                <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg border border-gray-200">
                  <PaperAirplaneIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
                <span>{t('footer.sections.contact')}</span>
              </h4>
              <address className="not-italic space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3 group">
                  <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg border border-gray-200 mt-0.5">
                    <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm">
                    <p className="font-medium">{t('footer.contactInfo.address')}</p>
                    <p className="text-gray-500">{t('footer.contactInfo.city')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 group">
                  <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg border border-gray-200">
                    <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </div>
                  <a href={`tel:${t('footer.contactInfo.phone')}`} className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium text-xs sm:text-sm">
                    {t('footer.contactInfo.phone')}
                  </a>
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 group">
                  <div className="p-1 sm:p-1.5 bg-gray-100 rounded-lg border border-gray-200">
                    <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </div>
                  <a href={`mailto:${t('footer.contactInfo.email')}`} className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium text-xs sm:text-sm">
                    {t('footer.contactInfo.email')}
                  </a>
                </div>
              </address>
            </div>

            {/* Newsletter - Minimal design */}
            <div className="pt-3 sm:pt-4">
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <StarIcon className="w-3 h-3 text-gray-500" />
                <p className="text-[10px] sm:text-xs text-gray-600 font-semibold tracking-wide">{t('footer.newsletter.title')}</p>
              </div>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder={t('footer.newsletter.placeholder')}
                  className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300 transition-all duration-300"
                />
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 flex items-center space-x-1 text-xs sm:text-sm">
                  <span>{t('footer.newsletter.subscribe')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Bar - Matching header sophistication */}
        <div className={`border-t border-gray-200 pt-6 sm:pt-8 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 relative transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <p className="text-gray-600 flex items-center space-x-2 text-xs sm:text-sm font-medium">
              <div className="p-0.5 sm:p-1 bg-gray-100 rounded border border-gray-200">
                <ShieldCheckIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600" />
              </div>
              <span>{t('footer.bottom.copyright', { year: currentYear })}</span>
            </p>
            
            <div className="flex space-x-3 sm:space-x-4">
              <Link 
                to="/privacy" 
                className="text-gray-500 hover:text-gray-800 transition-all duration-300 flex items-center space-x-1 group text-xs sm:text-sm font-medium"
              >
                <DocumentTextIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>{t('footer.bottom.privacy')}</span>
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-500 hover:text-gray-800 transition-all duration-300 flex items-center space-x-1 group text-xs sm:text-sm font-medium"
              >
                <DocumentTextIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>{t('footer.bottom.terms')}</span>
              </Link>
            </div>
          </div>
          
          {/* Language selector matching header */}
          <div className="mt-0">
            <button className="relative group flex items-center space-x-2 p-1.5 sm:p-2 rounded-lg bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-all duration-200">
              <GlobeAltIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
              <span className="text-xs sm:text-sm text-gray-700 font-medium">FR</span>
            </button>
          </div>
        </div>

        {/* Subtle brand element */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 opacity-5">
          <div className="text-3xl sm:text-5xl font-bold text-gray-900">M²</div>
        </div>
      </div>

      {/* Progress-inspired subtle border */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent transform scale-x-100"></div>
    </footer>
  );
};

export default Footer;