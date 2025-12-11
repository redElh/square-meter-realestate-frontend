// src/pages/Services.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);

  // Hero slides for services
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "Excellence Immobilière",
      subtitle: "Des services sur mesure pour vos projets d'exception"
    },
    {
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "Gestion Prestige",
      subtitle: "Une approche exclusive pour une clientèle exigeante"
    },
    {
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "Conseil Personnalisé",
      subtitle: "Expertise et discrétion au service de vos ambitions"
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
      title: 'Achat & Vente',
      description: 'Acquisition et cession de biens d\'exception avec une expertise marché incomparable',
      features: ['Évaluation précise', 'Mise en valeur premium', 'Réseau d\'acquéreurs internationaux', 'Négociation experte'],
      link: '/properties?type=buy',
      color: 'border-blue-200 bg-blue-50 text-blue-800'
    },
    {
      icon: BuildingStorefrontIcon,
      title: 'Location Prestige',
      description: 'Location saisonnière et longue durée de propriétés d\'exception',
      features: ['Gestion complète', 'Sélection locataire rigoureuse', 'Services conciergerie', 'Optimisation des revenus'],
      link: '/properties?type=rent',
      color: 'border-green-200 bg-green-50 text-green-800'
    },
    {
      icon: CurrencyEuroIcon,
      title: 'Gestion de Patrimoine',
      description: 'Optimisation et gestion de votre patrimoine immobilier de prestige',
      features: ['Audit patrimonial', 'Stratégie d\'investissement', 'Gestion locative', 'Conseil fiscal'],
      link: '/owners',
      color: 'border-purple-200 bg-purple-50 text-purple-800'
    }
  ];

  const additionalServices = [
    {
      icon: ShieldCheckIcon,
      title: 'Services Conciergerie',
      description: 'Services sur mesure pour une expérience de vie et de séjour exceptionnelle'
    },
    {
      icon: ChartBarIcon,
      title: 'Étude de Marché',
      description: 'Analyses approfondies des marchés immobiliers de prestige'
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Rénovation & Décoration',
      description: 'Accompagnement dans la rénovation et la décoration de votre propriété'
    },
    {
      icon: GlobeAltIcon,
      title: 'Recherche Internationale',
      description: 'Recherche de biens exclusifs à l\'international'
    }
  ];

  const processSteps = [
    {
      step: '01',
      title: 'Consultation',
      description: 'Analyse de vos besoins et objectifs'
    },
    {
      step: '02',
      title: 'Recherche',
      description: 'Sélection de biens correspondant à vos critères'
    },
    {
      step: '03',
      title: 'Présentation',
      description: 'Visites et analyses détaillées'
    },
    {
      step: '04',
      title: 'Finalisation',
      description: 'Accompagnement jusqu\'à la signature'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Properties/Mag Page Style */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden bg-white">
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
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6">
          <div className="w-full max-w-4xl text-center">
            <div className="mb-4 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
                Nos Prestations
              </h1>
              <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-4 sm:mb-8"></div>
              <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
                L'expertise immobilière de prestige, des services sur mesure pour vos projets d'exception
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                to="/contact" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/95 backdrop-blur-sm text-[#023927] border-2 border-white hover:bg-[#023927] hover:text-white hover:border-[#023927] transition-all duration-500 font-inter font-medium text-sm sm:text-base lg:text-lg"
                style={{ borderRadius: '0' }}
              >
                Prendre rendez-vous
              </Link>
              <Link 
                to="/agency" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-[#023927] transition-all duration-500 font-inter font-medium text-sm sm:text-base lg:text-lg"
                style={{ borderRadius: '0' }}
              >
                Rencontrer l'équipe
              </Link>
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
            Services Principaux
          </h2>
          <p className="font-inter text-gray-600 text-sm sm:text-base px-4">
            Découvrez l'étendue de notre expertise et nos services sur mesure, conçus pour
            répondre aux attentes les plus exigeantes du marché immobilier de prestige.
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
                    <h4 className="font-inter font-medium text-gray-900 text-xs sm:text-sm mb-2 sm:mb-3">NOTRE APPROCHE</h4>
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
                    <span>Découvrir</span>
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
              Services Complémentaires
            </h2>
            <p className="font-inter text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Une gamme de services supplémentaires pour répondre à toutes vos attentes
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
              Notre Processus d'Accompagnement
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