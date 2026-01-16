// src/pages/Agency.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  MapPinIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const Agency: React.FC = () => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTeamMember, setActiveTeamMember] = useState(0);

  // Cinematic hero slides - updated with premium real estate images
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: t('agency.hero.slide1')
    },
    {
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: t('agency.hero.slide2')
    },
    {
      image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: t('agency.hero.slide3')
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: t('agency.team.members.myriam.name'),
      role: t('agency.team.members.myriam.role'),
      image: '/member-1.jfif',
      specialty: t('agency.team.members.myriam.specialty'),
      languages: [t('languageNames.fr'), t('languageNames.ar'), t('languageNames.en')],
      quote: t('agency.team.members.myriam.quote')
    },
    {
      id: 2,
      name: t('agency.team.members.dimitri.name'),
      role: t('agency.team.members.dimitri.role'),
      image: null, // No photo for now
      specialty: t('agency.team.members.dimitri.specialty'),
      languages: [t('languageNames.fr'), t('languageNames.en')],
      quote: t('agency.team.members.dimitri.quote')
    },
    {
      id: 3,
      name: t('agency.team.members.virginie.name'),
      role: t('agency.team.members.virginie.role'),
      image: '/member-3.jfif',
      specialty: t('agency.team.members.virginie.specialty'),
      languages: [t('languageNames.fr'), t('languageNames.en'), t('languageNames.es')],
      quote: t('agency.team.members.virginie.quote')
    },
    {
      id: 4,
      name: t('agency.team.members.hayat.name'),
      role: t('agency.team.members.hayat.role'),
      image: '/member-4.jfif',
      specialty: t('agency.team.members.hayat.specialty'),
      languages: [t('languageNames.fr'), t('languageNames.ar'), t('languageNames.en')],
      quote: t('agency.team.members.hayat.quote')
    },
    {
      id: 5,
      name: t('agency.team.members.yasmine.name'),
      role: t('agency.team.members.yasmine.role'),
      image: '/member-5.jfif',
      specialty: t('agency.team.members.yasmine.specialty'),
      languages: [t('languageNames.fr'), t('languageNames.ar'), t('languageNames.en')],
      quote: t('agency.team.members.yasmine.quote')
    }
  ];

  const philosophyPrinciples = [
    {
      title: t('agency.philosophy.principles.discretion.title'),
      description: t('agency.philosophy.principles.discretion.description'),
      icon: ShieldCheckIcon
    },
    {
      title: t('agency.philosophy.principles.excellence.title'),
      description: t('agency.philosophy.principles.excellence.description'),
      icon: ChartBarIcon
    },
    {
      title: t('agency.philosophy.principles.service.title'),
      description: t('agency.philosophy.principles.service.description'),
      icon: UserGroupIcon
    },
    {
      title: t('agency.philosophy.principles.network.title'),
      description: t('agency.philosophy.principles.network.description'),
      icon: BuildingLibraryIcon
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    let slideInterval: NodeJS.Timeout;
    if (isPlaying) {
      slideInterval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
    }

    return () => clearInterval(slideInterval);
  }, [isPlaying, heroSlides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextTeamMember = () => {
    setActiveTeamMember((prev) => (prev + 1) % teamMembers.length);
  };

  const prevTeamMember = () => {
    setActiveTeamMember((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  // Auto-animate team carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTeamMember((prev) => (prev + 1) % teamMembers.length);
    }, 8000); // Change every 8 seconds
    return () => clearInterval(interval);
  }, [teamMembers.length]);

  return (
    <div className="min-h-screen bg-white font-inter text-base">
      {/* Hero Section - match Properties page height and spacing */}
      <section className="relative h-[70vh] sm:h-screen overflow-hidden bg-white -mt-24 sm:-mt-32">
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
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-3 right-3 sm:left-6 sm:right-6 transform -translate-y-1/2 flex justify-between z-20">
          <button
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
          >
            <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
          >
            <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-4 z-20">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 transition-all duration-300 ${
                  activeSlide === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Buttons Container - centered vertically */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto transform translate-y-[100px]">
            <Link 
              to="/careers" 
              className="bg-[#023927] text-white px-6 sm:px-12 py-3 sm:py-4 font-inter uppercase tracking-wider text-sm sm:text-base lg:text-lg hover:bg-white hover:text-[#023927] hover:border-2 hover:border-[#023927] transition-all duration-500 text-center"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{t('agency.hero.meetTeamButton')}</span>
                <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            <Link 
              to="/properties" 
              className="border-2 border-white text-white px-6 sm:px-12 py-3 sm:py-4 font-inter uppercase tracking-wider text-sm sm:text-base lg:text-lg hover:bg-white hover:text-[#023927] transition-all duration-500 text-center"
            >
              <span>{t('agency.hero.discoverPropertiesButton')}</span>
            </Link>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </section>

      {/* Team Section - Placed immediately after hero */}
      <section className="py-8 sm:py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-gray-900 mb-3 sm:mb-4 px-4">
              {t('agency.team.title')}
            </h2>
            <div className="h-px bg-gray-200 w-16 sm:w-24 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg px-4">
              {t('agency.team.subtitle')}
            </p>
          </div>

          {/* Team Carousel */}
          <div className="relative max-w-6xl mx-auto">
            {/* Main Team Member Display */}
            <div className="bg-white border-2 border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Team Member Image */}
                <div className="relative h-[280px] sm:h-[320px] md:h-[350px] lg:h-auto lg:max-h-[450px] bg-gray-50">
                  {teamMembers[activeTeamMember].image ? (
                    <img
                      src={teamMembers[activeTeamMember].image ?? undefined}
                      alt={teamMembers[activeTeamMember].name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <UserGroupIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-inter text-lg">{teamMembers[activeTeamMember].name}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevTeamMember}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#023927]/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#023927] transition-colors duration-300 border-2 border-white shadow-lg"
                  >
                    <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={nextTeamMember}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-[#023927]/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#023927] transition-colors duration-300 border-2 border-white shadow-lg"
                  >
                    <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Team Member Info */}
                <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-inter font-medium text-gray-900 mb-2">
                      {teamMembers[activeTeamMember].name}
                    </h3>
                    <span className="inline-block px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 font-inter uppercase text-xs tracking-wide mb-3 sm:mb-4 border border-gray-300">
                      {teamMembers[activeTeamMember].role}
                    </span>
                  </div>

                  {/* Specialty */}
                  <div className="mb-6 sm:mb-8">
                    <h4 className="font-inter uppercase text-gray-700 text-xs sm:text-sm mb-2 font-medium">{t('agency.team.specialty')}</h4>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {teamMembers[activeTeamMember].specialty}
                    </p>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    <span className="font-inter uppercase text-gray-700 text-xs sm:text-sm font-medium">{t('agency.team.languages')}:</span>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers[activeTeamMember].languages.map((lang, index) => (
                        <span key={index} className="px-2 sm:px-3 py-1 bg-[#023927] text-white text-xs sm:text-sm font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="pt-4 sm:pt-6 border-t border-gray-200">
                    <p className="text-gray-600 italic text-sm sm:text-base lg:text-lg leading-relaxed">
                      {teamMembers[activeTeamMember].quote}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member Indicators */}
            <div className="flex justify-center space-x-2 sm:space-x-3 mt-6 sm:mt-8">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTeamMember(index)}
                  className={`w-2 h-2 transition-all duration-300 ${
                    index === activeTeamMember 
                      ? 'bg-[#023927] scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-gray-900 mb-3 sm:mb-4 px-4">
              {t('agency.philosophy.title')}
            </h2>
            <div className="h-px bg-gray-200 w-16 sm:w-24 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 lg:mb-12 px-4">
              {t('agency.philosophy.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {philosophyPrinciples.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-4 sm:p-6 lg:p-8 border-2 border-gray-100 hover:border-[#023927] transition-all duration-500 group"
                >
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#023927]/10 flex items-center justify-center border border-[#023927]/20 group-hover:bg-[#023927] group-hover:text-white transition-all duration-500">
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-[#023927] group-hover:text-white transition-colors duration-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-inter text-base sm:text-lg lg:text-xl text-gray-900 mb-2 sm:mb-4 group-hover:text-[#023927] transition-colors duration-500">
                        {principle.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agency;