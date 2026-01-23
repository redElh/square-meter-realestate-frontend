// src/pages/Services.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  HomeModernIcon, 
  BuildingStorefrontIcon, 
  CurrencyEuroIcon, 
  ChartBarIcon, 
  WrenchScrewdriverIcon, 
  GlobeAltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Services: React.FC = () => {
  const { t } = useTranslation();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);

  // Hero slides for services
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: t('services.hero.slide1'),
      subtitle: t('services.hero.subtitle1')
    },
    {
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: t('services.hero.slide2'),
      subtitle: t('services.hero.subtitle2')
    },
    {
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: t('services.hero.slide3'),
      subtitle: t('services.hero.subtitle3')
    }
  ];

  // Hero carousel controls
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isHeroPlaying) {
      slideInterval = setInterval(() => {
        setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isHeroPlaying]);

  const nextHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const mainServices = [
    {
      icon: HomeModernIcon,
      title: t('services.main.buyingSelling.title'),
      description: t('services.main.buyingSelling.description'),
      features: [t('services.main.buyingSelling.feature1'), t('services.main.buyingSelling.feature2'), t('services.main.buyingSelling.feature3'), t('services.main.buyingSelling.feature4')],
      link: '/properties?type=buy',
      color: 'border-blue-200 bg-blue-50 text-blue-800'
    },
    {
      icon: BuildingStorefrontIcon,
      title: t('services.main.prestigeRental.title'),
      description: t('services.main.prestigeRental.description'),
      features: [t('services.main.prestigeRental.feature1'), t('services.main.prestigeRental.feature2'), t('services.main.prestigeRental.feature3'), t('services.main.prestigeRental.feature4')],
      link: '/properties?type=rent',
      color: 'border-green-200 bg-green-50 text-green-800'
    },
    {
      icon: CurrencyEuroIcon,
      title: t('services.main.wealthManagement.title'),
      description: t('services.main.wealthManagement.description'),
      features: [t('services.main.wealthManagement.feature1'), t('services.main.wealthManagement.feature2'), t('services.main.wealthManagement.feature3'), t('services.main.wealthManagement.feature4')],
      link: '/owners',
      color: 'border-purple-200 bg-purple-50 text-purple-800'
    }
  ];

  const additionalServices = [
    {
      icon: ShieldCheckIcon,
      title: t('services.additional.concierge.title'),
      description: t('services.additional.concierge.description')
    },
    {
      icon: ChartBarIcon,
      title: t('services.additional.marketStudy.title'),
      description: t('services.additional.marketStudy.description')
    },
    {
      icon: WrenchScrewdriverIcon,
      title: t('services.additional.renovation.title'),
      description: t('services.additional.renovation.description')
    },
    {
      icon: GlobeAltIcon,
      title: t('services.additional.international.title'),
      description: t('services.additional.international.description')
    }
  ];

  const processSteps = [
    {
      step: t('services.process.step1.number'),
      title: t('services.process.step1.title'),
      description: t('services.process.step1.description')
    },
    {
      step: t('services.process.step2.number'),
      title: t('services.process.step2.title'),
      description: t('services.process.step2.description')
    },
    {
      step: t('services.process.step3.number'),
      title: t('services.process.step3.title'),
      description: t('services.process.step3.description')
    },
    {
      step: t('services.process.step4.number'),
      title: t('services.process.step4.title'),
      description: t('services.process.step4.description')
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Properties/Mag Page Style */}
      <section className="relative h-[70vh] sm:h-screen overflow-hidden bg-white -mt-24 sm:-mt-32">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Centered Content */}
        <div className="absolute bottom-24 sm:bottom-20 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="transform transition-all duration-1000 delay-300 translate-y-0 opacity-100">
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Link 
                to="/contact" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/95 backdrop-blur-sm text-[#023927] border-2 border-white hover:bg-[#023927] hover:text-white hover:border-[#023927] transition-all duration-500 font-inter font-medium text-sm sm:text-base lg:text-lg"
                style={{ borderRadius: '0' }}
              >
                {t('services.hero.ctaAppointment')}
              </Link>
              <Link 
                to="/agency" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[#023927] transition-all duration-500 font-inter font-medium text-sm sm:text-base lg:text-lg"
                style={{ borderRadius: '0' }}
              >
                {t('services.hero.ctaMeetTeam')}
              </Link>
            </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-30 flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={prevHeroSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextHeroSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroSlide(index)}
                className={`w-2 h-2 transition-all duration-300 ${
                  index === activeHeroSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                style={{ borderRadius: '0' }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Services Header */}
        <div className="mb-8 sm:mb-12 lg:mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-3 sm:mb-4 px-4">
            {t('services.main.title')}
          </h2>
          <p className="font-inter text-gray-600 text-sm sm:text-base px-4">
            {t('services.main.subtitle')}
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {mainServices.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border-2 border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
              >
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-start gap-3 sm:gap-4 lg:gap-5 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center border-2 border-gray-200 flex-shrink-0">
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#023927]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg lg:text-xl font-inter font-medium text-gray-900 mb-2">{service.title}</h3>
                      <p className="font-inter text-gray-600 text-xs sm:text-sm">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6 sm:mb-8">
                    <h4 className="font-inter font-medium text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3">{t('services.main.approach')}</h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#023927] mt-1.5 sm:mt-2 flex-shrink-0"></div>
                          <span className="font-inter text-gray-700 text-xs sm:text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link 
                    to={service.link} 
                    className="inline-flex items-center gap-2 text-[#023927] hover:text-gray-900 font-inter uppercase text-xs sm:text-sm tracking-wide transition-colors duration-300"
                  >
                    <span>{t('services.main.discover')}</span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-3 sm:mb-4 px-4">
              {t('services.additional.title')}
            </h2>
            <p className="font-inter text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              {t('services.additional.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {additionalServices.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={i} 
                  className="bg-white border-2 border-gray-200 p-4 sm:p-6 text-center transition-all duration-300 hover:border-[#023927] group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border-2 border-gray-200 mx-auto mb-3 sm:mb-4 group-hover:border-[#023927] transition-colors duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover:text-[#023927] transition-colors duration-300" />
                  </div>
                  <h3 className="font-inter font-medium text-gray-900 text-xs sm:text-sm mb-2">{service.title}</h3>
                  <p className="font-inter text-gray-600 text-xs">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-[#023927] p-6 sm:p-8 lg:p-12 mb-12 sm:mb-16 lg:mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-inter font-light text-white text-center mb-8 sm:mb-12 px-4">
              {t('services.process.title')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {processSteps.map((step, k) => (
                <div key={k} className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white text-[#023927] flex items-center justify-center mx-auto mb-3 sm:mb-4 font-inter text-xl sm:text-2xl font-medium border-2 border-white">
                    {step.step}
                  </div>
                  <h3 className="font-inter font-medium text-white mb-2 text-xs sm:text-sm">{step.title}</h3>
                  <p className="font-inter text-white/80 text-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact section removed per request */}
      </div>
    </div>
  );
};

export default Services;