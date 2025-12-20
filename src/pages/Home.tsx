// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../contexts/LocalizationContext';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  HeartIcon,
  CameraIcon,
  HomeIcon,
  CheckIcon,
  Square2StackIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import { apimoService, Property } from '../services/apimoService';
import { useCurrency } from '../hooks/useCurrency';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { format: formatCurrencyPrice } = useCurrency();
  
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredAutoPlay, setFeaturedAutoPlay] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: t('home.hero.slides.villa.title'),
      location: t('home.hero.slides.villa.location'),
      price: 2500000
    },
    {
      image: "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: t('home.hero.slides.penthouse.title'),
      location: t('home.hero.slides.penthouse.location'),
      price: 3200000
    },
    {
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: t('home.hero.slides.estate.title'),
      location: t('home.hero.slides.estate.location'),
      price: 4800000
    }
  ];

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoadingProperties(true);
      try {
        const { properties: apiProperties } = await apimoService.getProperties({
          limit: 1000,
        }, t, currentLanguage);
        
        // Use all available properties for featured section
        setFeaturedProperties(apiProperties);
      } catch (error) {
        console.error('Error loading featured properties:', error);
        setFeaturedProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchFeaturedProperties();
  }, [t, currentLanguage]);

  const clientTestimonials = [
    {
      name: t('home.testimonials.clients.aicha.name'),
      text: t('home.testimonials.clients.aicha.text'),
    },
    {
      name: t('home.testimonials.clients.marc.name'),
      text: t('home.testimonials.clients.marc.text'),
    },
    {
      name: t('home.testimonials.clients.thomas.name'),
      text: t('home.testimonials.clients.thomas.text'),
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    let slideInterval: NodeJS.Timeout;
    if (isPlaying) {
      slideInterval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }

    return () => clearInterval(slideInterval);
  }, [isPlaying, heroSlides.length]);

  useEffect(() => {
    let featuredInterval: NodeJS.Timeout;
    if (featuredAutoPlay) {
      featuredInterval = setInterval(() => {
        setFeaturedIndex((prev) => (prev + 1) % featuredProperties.length);
      }, 6000);
    }

    return () => clearInterval(featuredInterval);
  }, [featuredAutoPlay, featuredProperties.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredProperties.length);
  };

  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredProperties.length) % featuredProperties.length);
  };

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatPrice = (price: number, type?: string) => {
    const formattedPrice = formatCurrencyPrice(price);
    if (type === 'rent') {
      return `${formattedPrice}/${t('common.month') || 'month'}`;
    }
    if (type === 'seasonal') {
      return `${formattedPrice}/${t('common.week') || 'week'}`;
    }
    return formattedPrice;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Épurée */}
      <section className="relative h-[70vh] sm:h-screen overflow-hidden">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Logo Minimaliste en haut à gauche */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#023927] flex items-center justify-center">
              <span className="text-white font-bold text-xl">M²</span>
            </div>
            <div className="text-white">
              <div className="font-inter uppercase tracking-widest text-sm">SQUARE METER</div>
              <div className="font-serif text-xs text-gray-300">Excellence immobilière</div>
            </div>
          </div>
        </div>

        {/* Contenu Hero - Positionné en bas */}
        <div className="absolute bottom-12 sm:bottom-20 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              
              {/* Boutons d'action - Nouveau design */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link 
                  to="/properties?type=buy" 
                  className="group relative bg-white text-gray-900 px-6 sm:px-10 py-3 sm:py-4 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center"
                >
                  <div className="absolute inset-0 bg-[#023927] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                    {t('home.hero.buyButton')}
                  </span>
                </Link>
                
                <Link 
                  to="/properties?type=rent" 
                  className="group relative border-2 border-white text-white px-6 sm:px-10 py-3 sm:py-4 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center"
                >
                  <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-500">
                    {t('home.hero.rentButton')}
                  </span>
                </Link>
              </div>

              {/* Info de la slide actuelle - Discrète */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-4 sm:space-x-6 bg-black/40 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3">
                  <div className="text-white">
                    <div className="font-inter uppercase tracking-widest text-sm">{heroSlides[activeSlide].title}</div>
                    <div className="font-serif text-xs sm:text-xs text-gray-300">{heroSlides[activeSlide].location}</div>
                  </div>
                  <div className="w-px h-6 bg-white/30"></div>
                  <div className="font-serif text-white text-sm sm:text-sm font-medium">
                    {formatCurrencyPrice(heroSlides[activeSlide].price)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contrôles Carousel - Positionné en bas à droite */}
        <div className="absolute bottom-8 right-4 z-30 hidden sm:flex items-center space-x-4">
          {/* Navigation Arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-300"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-300"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-6 sm:w-8 h-1 transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-[#023927]' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-300"
          >
            {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
        </div>

        {/* Indicateur de scroll */}
        <div className="hidden sm:block absolute bottom-8 left-4 sm:left-8 animate-pulse">
          <div className="text-white text-xs font-inter uppercase tracking-widest rotate-[-90deg] origin-left">
            {t('home.hero.scroll')}
          </div>
        </div>
      </section>

      {/* Notre Essence Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-inter uppercase mb-6 text-gray-900 text-center">
              {t('home.essence.title')}
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-8"></div>
            
            <p className="text-lg md:text-xl font-serif text-gray-700 mb-6 leading-relaxed">
              {t('home.essence.tagline')}
            </p>
            
            <div className="space-y-4 text-gray-600 mb-8">
              <p>
                {t('home.essence.paragraph1')}
              </p>
              <p>
                {t('home.essence.paragraph2')}
                <span className="text-[#023927] font-medium"> {t('home.essence.conviction')}</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/properties" 
                className="bg-[#023927] text-white px-8 py-3 font-inter uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-[#023927] hover:border hover:border-[#023927] hover:scale-105 text-center"
              >
                {t('home.essence.ctaDiscover')}
              </Link>
              <Link 
                to="/valuation" 
                className="border border-[#023927] text-[#023927] px-8 py-3 font-inter uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-[#023927] hover:border-[#023927] hover:scale-105 text-center"
              >
                {t('home.essence.ctaValuation')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-inter uppercase text-gray-900 mb-4">
              {t('home.mission.title')}
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('home.mission.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-3 font-medium">
                {t('home.mission.transaction.title')}
              </h3>
              <p className="text-gray-600 group-hover:text-[#023927]">
                {t('home.mission.transaction.description')}
              </p>
            </div>
            
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-3 font-medium">
                {t('home.mission.longTerm.title')}
              </h3>
              <p className="text-gray-600 group-hover:text-[#023927]">
                {t('home.mission.longTerm.description')}
              </p>
            </div>
            
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-3 font-medium">
                {t('home.mission.seasonal.title')}
              </h3>
              <p className="text-gray-600 group-hover:text-[#023927]">
                {t('home.mission.seasonal.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties - Elegant Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-inter uppercase text-gray-900 mb-4">
              {t('home.featured.title')}
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('home.featured.subtitle')}
            </p>
          </div>
          
          {/* Carousel Container */}
          <div 
            className="relative max-w-6xl mx-auto mb-12"
            onMouseEnter={() => setFeaturedAutoPlay(false)}
            onMouseLeave={() => setFeaturedAutoPlay(true)}
          >
            <div className="overflow-hidden">
              <div 
                className="flex transition-all duration-700 ease-in-out" 
                style={{ transform: `translateX(-${featuredIndex * 100}%)` }}
              >
                {featuredProperties.map((property) => (
                  <div key={property.id} className="w-full flex-shrink-0 px-2">
                    <div className="bg-white border-2 border-gray-100 group transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-gray-200">
                      {/* MAIN CARD CONTAINER - Horizontal Layout */}
                      <div className="flex flex-col">
                        {/* IMAGE SECTION - Left side with primary + secondary images */}
                        <div className="w-full flex flex-col md:flex-row h-[300px] sm:h-[400px] lg:h-[500px]">
                          {/* Primary Image - Larger on left */}
                          <div className="md:w-2/3 h-2/3 md:h-full relative overflow-hidden">
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                            />
                            
                            {/* Overlay Badges */}
                            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 flex flex-col gap-1.5 sm:gap-2">
                              {property.featured && (
                                <span className="bg-[#023927] text-white px-2 sm:px-4 py-1 sm:py-2 font-inter uppercase text-[10px] sm:text-xs font-medium tracking-wider max-w-max">
                                  {t('home.featured.exclusive')}
                                </span>
                              )}
                              {property.confidential && (
                                <span className="bg-black/90 text-white px-2 sm:px-4 py-1 sm:py-2 font-inter uppercase text-[10px] sm:text-xs font-medium tracking-wider max-w-max">
                                  {t('home.featured.confidential')}
                                </span>
                              )}
                            </div>
                            
                            {/* Favorite Button */}
                            <button 
                              onClick={() => toggleFavorite(property.id)}
                              className="absolute top-3 sm:top-6 right-3 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group/fav"
                            >
                              {favorites.includes(property.id) ? (
                                <HeartIconSolid className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                              ) : (
                                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover/fav:text-red-500 transition-colors" />
                              )}
                            </button>
                            
                            {/* Image Counter */}
                            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 bg-black/80 text-white px-2 sm:px-4 py-1.5 sm:py-2 flex items-center space-x-1.5 sm:space-x-2 backdrop-blur-sm">
                              <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm">{property.images.length} {t('home.featured.photos')}</span>
                            </div>
                          </div>
                          
                          {/* Secondary Images - Stacked vertically on right */}
                          <div className="md:w-1/3 h-1/3 md:h-full flex flex-row md:flex-col gap-1 sm:gap-2 p-1 sm:p-2">
                            {property.images.slice(1, 3).map((img, imgIndex) => (
                              <div 
                                key={imgIndex} 
                                className="flex-1 relative overflow-hidden group/secondary"
                              >
                                <img
                                  src={img}
                                  alt={`${property.title} ${imgIndex + 2}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover/secondary:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/secondary:opacity-100 transition-opacity duration-300"></div>
                                {/* View More Overlay for last image */}
                                {imgIndex === 1 && property.images.length > 3 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/secondary:opacity-100 transition-opacity duration-300">
                                    <div className="text-white text-center p-2 sm:p-4">
                                      <ArrowTopRightOnSquareIcon className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                                      <span className="text-[10px] sm:text-xs font-medium">+{property.images.length - 3} photos</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* DETAILS SECTION - compact single-line summary */}
                        <div className="w-full p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0 w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <span className={`px-2 py-1 text-[10px] sm:text-xs font-medium tracking-wider self-start ${
                                property.type === 'buy' 
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                                  : property.type === 'rent'
                                  ? 'bg-green-50 text-green-800 border border-green-200'
                                  : 'bg-purple-50 text-purple-800 border border-purple-200'
                              }`}>{property.type === 'buy' ? t('home.featured.forSale') : property.type === 'rent' ? t('home.featured.forRent') : t('home.featured.vacation')}</span>

                              <h3 className="text-base sm:text-lg font-inter font-medium text-gray-900 truncate">{property.title}</h3>

                              <span className="text-gray-500 text-xs sm:text-sm truncate">• {property.location}</span>
                            </div>
                          </div>

                          <div className="flex sm:hidden items-center text-xs text-gray-600 space-x-3 w-full">
                            <div className="flex items-center gap-1"><HomeIcon className="w-3 h-3" /> <span className="ml-0.5">{property.rooms || 0}</span></div>
                            <div className="flex items-center gap-1"><CheckIcon className="w-3 h-3" /> <span className="ml-0.5">{property.floors || 0}</span></div>
                            <div className="flex items-center gap-1"><Square2StackIcon className="w-3 h-3" /> <span className="ml-0.5">{property.surface.toFixed(0)} m²</span></div>
                          </div>

                          <div className="hidden sm:flex items-center text-sm text-gray-600 space-x-4 whitespace-nowrap">
                            <div className="flex items-center gap-1"><HomeIcon className="w-4 h-4" /> <span className="ml-1">{property.rooms || 0}</span></div>
                            <div className="flex items-center gap-1"><CheckIcon className="w-4 h-4" /> <span className="ml-1">{property.floors || 0}</span></div>
                            <div className="flex items-center gap-1"><Square2StackIcon className="w-4 h-4" /> <span className="ml-1">{property.surface.toFixed(0)} m²</span></div>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="font-serif text-[#023927] font-bold text-base sm:text-lg whitespace-nowrap">{formatPrice(property.price, property.type)}</div>
                            <Link
                              to={`/properties/${property.id}`}
                              className="bg-white border-2 border-[#023927] text-[#023927] px-4 sm:px-3 py-2 text-xs sm:text-sm uppercase font-medium hover:bg-[#023927] hover:text-white transition-all duration-300"
                            >
                              {t('home.featured.viewButton')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Elegant Navigation Buttons */}
            <button 
              onClick={prevFeatured} 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white border-2 border-gray-200 flex items-center justify-center text-gray-800 hover:border-[#023927] hover:bg-[#023927] hover:text-white transition-all duration-300 shadow-lg z-10"
              aria-label="Previous property"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={nextFeatured} 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white border-2 border-gray-200 flex items-center justify-center text-gray-800 hover:border-[#023927] hover:bg-[#023927] hover:text-white transition-all duration-300 shadow-lg z-10"
              aria-label="Next property"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Elegant Slide Indicators */}
            <div className="mt-8 flex justify-center items-center space-x-3">
              {featuredProperties.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setFeaturedIndex(i)} 
                  className={`transition-all duration-300 ${
                    i === featuredIndex 
                      ? 'w-12 h-1.5 bg-[#023927]' 
                      : 'w-8 h-1 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to property ${i + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              to="/properties" 
              className="inline-flex items-center space-x-2 border-2 border-gray-900 text-gray-900 px-10 py-4 font-inter uppercase tracking-wide hover:bg-[#023927] hover:text-white hover:border-[#023927] transition-all duration-500"
            >
              <span>{t('home.featured.exploreCollection')}</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              {t('home.testimonials.title')}
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-gray-600">{t('home.testimonials.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {clientTestimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-[#023927] text-4xl md:text-5xl mb-4">"</div>
                <p className="text-gray-600 italic mb-6 leading-relaxed text-base md:text-lg">
                  {testimonial.text}
                </p>
                <p className="font-inter text-gray-900 font-medium border-t border-gray-100 pt-4">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              {t('home.values.title')}
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium">
                  {t('home.values.excellence.title')}
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927]">
                  {t('home.values.excellence.description')}
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium">
                  {t('home.values.humanity.title')}
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927]">
                  {t('home.values.humanity.description')}
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium">
                  {t('home.values.innovation.title')}
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927]">
                  {t('home.values.innovation.description')}
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium">
                  {t('home.values.responsibility.title')}
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927]">
                  {t('home.values.responsibility.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              {t('home.contact.title')}
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('home.contact.subtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-inter uppercase text-gray-900 mb-6">
                  {t('home.contact.agency')}
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-inter text-gray-900 font-medium mb-1">{t('home.contact.address')}</h4>
                    <p className="text-gray-600">{t('home.contact.addressValue')}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-inter text-gray-900 font-medium mb-1">{t('home.contact.hours')}</h4>
                    <p className="text-gray-600">{t('home.contact.hoursValue')}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-inter text-gray-900 font-medium mb-1">{t('home.contact.email')}</h4>
                    <p className="text-gray-600">{t('home.contact.emailValue')}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-inter text-gray-900 font-medium mb-1">{t('home.contact.phone')}</h4>
                    <p className="text-gray-600">{t('home.contact.phoneValue')}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-2xl font-inter uppercase text-gray-900 mb-2">
                    {t('home.contact.brandTitle')}
                  </h3>
                  <p className="text-[#023927] italic">
                    {t('home.contact.tagline')}
                  </p>
                </div>
                
                <Link 
                  to="/contact" 
                  className="bg-[#023927] text-white py-3 md:py-4 font-inter uppercase tracking-wide hover:bg-white hover:text-[#023927] hover:border hover:border-[#023927] transition-all duration-300 transform hover:scale-[1.02] text-center text-base md:text-lg"
                >
                  {t('home.contact.ctaButton')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "250+", label: t('home.stats.exclusiveProperties') },
              { number: "15", label: t('home.stats.yearsExperience') },
              { number: "98%", label: t('home.stats.satisfiedClients') },
              { number: "12", label: t('home.stats.countriesServed') }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl md:text-4xl font-inter text-[#023927] font-light mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;