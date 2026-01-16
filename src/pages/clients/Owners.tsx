// src/pages/Owners.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CameraIcon,
  RocketLaunchIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  SparklesIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const Owners: React.FC = () => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Premium owner-focused hero images - same style as Properties
  const heroSlidesData = t('owners.hero.slides', { returnObjects: true }) as Array<{title: string; subtitle: string}>;
  
  const heroSlides = [
    {
      image: "/photo-4.jfif",
      title: heroSlidesData[0].title,
      subtitle: heroSlidesData[0].subtitle
    },
    {
      image: "/photo-5.jfif",
      title: heroSlidesData[1].title,
      subtitle: heroSlidesData[1].subtitle
    },
    {
      image: "/photo-6.jfif",
      title: heroSlidesData[2].title,
      subtitle: heroSlidesData[2].subtitle
    }
  ];

  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isPlaying) {
      slideInterval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isPlaying]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const managementServicesData = t('owners.management.services', { returnObjects: true }) as Array<{title: string; description: string; features: string[]; price: string}>;
  
  const managementServices = managementServicesData.map(service => ({
    title: service.title,
    description: service.description,
    features: service.features,
    price: service.price
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Properties Page Style */}
      <section className="relative h-[70vh] sm:h-screen overflow-hidden bg-white">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              {/* Title Overlay - Bottom Left */}
              <div className="absolute bottom-8 sm:bottom-16 left-4 sm:left-12 text-white max-w-2xl px-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-2 sm:mb-4">{slide.title}</h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light opacity-90">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons - Centered */}
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4 mt-40">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <Link 
              to="/selling-multistep?step=1"
              className="bg-white text-[#023927] px-6 sm:px-12 py-3 sm:py-5 font-medium uppercase tracking-wider text-sm sm:text-base lg:text-lg hover:bg-[#023927] hover:text-white transition-all duration-500 border-2 border-white text-center"
            >
              {t('owners.hero.estimateButton')}
            </Link>
            <Link 
              to="/contact?type=management"
              className="bg-[#023927] text-white px-6 sm:px-12 py-3 sm:py-5 font-medium uppercase tracking-wider text-sm sm:text-base lg:text-lg hover:bg-white hover:text-[#023927] transition-all duration-500 border-2 border-[#023927] text-center"
            >
              {t('owners.hero.manageButton')}
            </Link>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-30 flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={prevSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextSlide}
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
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 transition-all duration-300 ${
                  index === activeSlide 
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

      {/* Benefits Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4 px-2">{t('owners.benefits.title')}</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto px-4">
              {t('owners.benefits.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
            {(t('owners.benefits.items', { returnObjects: true }) as Array<{title: string; description: string; stats: string}>).map((benefit, index) => {
              const Icon = [ShieldCheckIcon, UserGroupIcon, CameraIcon, RocketLaunchIcon][index];
              return (
                <div key={index} className="border-2 border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-[#023927] transition-all duration-500">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#023927] mb-3 sm:mb-4 lg:mb-6" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">{benefit.description}</p>
                  <div className="bg-[#023927]/10 text-[#023927] px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-xs sm:text-sm inline-block">
                    {benefit.stats}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16 p-4 sm:p-6 lg:p-8 bg-[#023927] text-white">
            {(t('owners.stats', { returnObjects: true }) as Array<{number: string; label: string}>).map((stat, index) => (
              <div key={index} className="text-center py-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-1 sm:mb-2">{stat.number}</div>
                <div className="font-medium text-white/90 text-xs sm:text-sm lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Management Services */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-6 sm:mb-8 lg:mb-12 text-center px-4">{t('owners.management.title')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {managementServices.map((service, index) => (
                <div key={index} className="border-2 border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-[#023927] transition-all duration-500">
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4">{service.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{service.description}</p>
                  
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700 text-sm sm:text-base">
                        <div className="w-2 h-2 bg-[#023927] mr-2 sm:mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="text-xl sm:text-2xl font-medium text-[#023927] mb-4 sm:mb-6">{service.price}</div>
                  
                  <Link
                    to="/contact?type=manage"
                    className="block w-full bg-[#023927] text-white text-center py-3 sm:py-4 font-medium uppercase tracking-wider text-sm sm:text-base hover:bg-white hover:text-[#023927] transition-all duration-500 border-2 border-[#023927]"
                  >
                    {t('owners.management.quoteButton')}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-[#023927] p-6 sm:p-8 lg:p-12 text-white">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-6 sm:mb-8 text-center px-4">{t('owners.additionalServices.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {(t('owners.additionalServices.items', { returnObjects: true }) as Array<{title: string; description: string}>).map((service, index) => (
                <div key={index} className="border border-white/20 p-4 sm:p-6 hover:border-white transition-all duration-300">
                  <div className="font-medium uppercase text-white text-base sm:text-lg mb-2 sm:mb-3">{service.title}</div>
                  <div className="font-light text-white/80 text-sm sm:text-base">{service.description}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8 sm:mt-12">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-white text-[#023927] px-6 sm:px-12 py-3 sm:py-5 font-medium uppercase tracking-wider text-sm sm:text-base hover:bg-transparent hover:text-white transition-all duration-500 border-2 border-white w-full sm:w-auto"
              >
                <span>{t('owners.additionalServices.contactButton')}</span>
                <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Owners;