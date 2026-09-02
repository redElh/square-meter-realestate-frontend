// src/pages/Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
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
import { apimoService, Property, isSoldStatus } from '../services/apimoService';
import { useCurrency } from '../hooks/useCurrency';
import { useReviews } from '../contexts/ReviewsContext';
import SEO from '../components/SEO/SEO';
import ImageGalleryModal from '../components/ImageGalleryModal';
import ReviewForm from '../components/ReviewForm';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { format: formatCurrencyPrice } = useCurrency();
  const { reviews: googleReviews, loading: loadingReviews } = useReviews();
  
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredAutoPlay, setFeaturedAutoPlay] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [countersStarted, setCountersStarted] = useState(false);
  const [yearsCount, setYearsCount] = useState(0);
  const [countriesCount, setCountriesCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Gallery modal state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // Homepage hero images
  const heroImages = [
    '/photo-11.jpeg',
    '/photo-12.jpeg',
    '/photo-7.jpeg',
    '/photo-8.jpeg',
    '/photo-9.jpeg',
    '/photo-10.jpeg'
  ];

  // Homepage hero carousel auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Open gallery modal
  const openGallery = (images: string[], title: string, initialIndex: number = 0) => {
    setGalleryImages(images);
    setGalleryTitle(title);
    setGalleryInitialIndex(initialIndex);
    setGalleryOpen(true);
  };

  // Animated counters with Intersection Observer
  useEffect(() => {
    const currentStatsRef = statsRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            setCountersStarted(true);
            
            // Animate years counter (0 to 10)
            let yearsStart = 0;
            const yearsEnd = 10;
            const yearsDuration = 2000;
            const yearsIncrement = yearsEnd / (yearsDuration / 50);
            
            const yearsTimer = setInterval(() => {
              yearsStart += yearsIncrement;
              if (yearsStart >= yearsEnd) {
                setYearsCount(yearsEnd);
                clearInterval(yearsTimer);
              } else {
                setYearsCount(Math.floor(yearsStart));
              }
            }, 50);
            
            // Animate countries counter (0 to 1)
            let countriesStart = 0;
            const countriesEnd = 1;
            const countriesDuration = 1500;
            const countriesIncrement = countriesEnd / (countriesDuration / 100);
            
            const countriesTimer = setInterval(() => {
              countriesStart += countriesIncrement;
              if (countriesStart >= countriesEnd) {
                setCountriesCount(countriesEnd);
                clearInterval(countriesTimer);
              } else {
                setCountriesCount(Math.floor(countriesStart));
              }
            }, 100);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (currentStatsRef) {
      observer.observe(currentStatsRef);
    }

    return () => {
      if (currentStatsRef) {
        observer.unobserve(currentStatsRef);
      }
    };
  }, [countersStarted]);

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const { properties: apiProperties } = await apimoService.getProperties({
          limit: 1000,
              translateDescriptions: false,
        }, t, currentLanguage);
        
        // Coup de Coeur section: show all properties with agreement type 3
        const coupDeCoeurProperties = apiProperties.filter(prop => Number(prop.agreementType) === 3);
        setFeaturedProperties(coupDeCoeurProperties);
      } catch (error) {
        console.error('Error loading featured properties:', error);
        setFeaturedProperties([]);
      }
    };

    fetchFeaturedProperties();
  }, [t, currentLanguage]);

  useEffect(() => {
    if (!featuredAutoPlay || featuredProperties.length <= 1) {
      return;
    }

    const featuredInterval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredProperties.length);
    }, 6000);

    return () => clearInterval(featuredInterval);
  }, [featuredAutoPlay, featuredProperties.length]);

  useEffect(() => {
    if (featuredProperties.length === 0) {
      if (featuredIndex !== 0) {
        setFeaturedIndex(0);
      }
      return;
    }

    if (!Number.isFinite(featuredIndex) || featuredIndex < 0 || featuredIndex >= featuredProperties.length) {
      setFeaturedIndex(0);
    }
  }, [featuredIndex, featuredProperties.length]);

  const nextFeatured = () => {
    if (featuredProperties.length <= 1) return;
    setFeaturedIndex((prev) => (prev + 1) % featuredProperties.length);
  };

  const prevFeatured = () => {
    if (featuredProperties.length <= 1) return;
    setFeaturedIndex((prev) => (prev - 1 + featuredProperties.length) % featuredProperties.length);
  };

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const formatPrice = (price: number, type: 'buy' | 'rent' | 'seasonal', sourceCurrency: string = 'MAD', pricePeriod?: number) => {
    // List of supported currencies
    const supportedCurrencies = ['EUR', 'USD', 'GBP', 'AED', 'MAD'];
    
    // Validate and normalize the source currency
    const normalizedCurrency = sourceCurrency?.toUpperCase() || 'MAD';
    
    // Check if currency is supported
    const isCurrencySupported = supportedCurrencies.includes(normalizedCurrency);
    
    // Use the source currency if supported, otherwise log warning and default to EUR (common for properties)
    let finalCurrency = normalizedCurrency;
    if (!isCurrencySupported) {
      console.warn(`⚠️ Unsupported currency "${sourceCurrency}" for property price ${price}. Defaulting to EUR.`);
      console.warn('   Supported currencies:', supportedCurrencies.join(', '));
      finalCurrency = 'EUR'; // Most properties use EUR if not MAD
    }
    
    // Log currency conversion for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`💱 Price conversion: ${price} ${finalCurrency} → formatted in selected currency`);
    }
    
    const formattedPrice = formatCurrencyPrice(price, finalCurrency as any);
    
    // Use period from API if available: 1=Jour, 2=Semaine, 3=Quinzaine, 4=Mois, 5=Trimestre, 6=Bimensuel, 7=Semestre, 8=An
    if (pricePeriod) {
      switch (pricePeriod) {
        case 1: // Jour
          return `${t('properties.listing.fromPerDay', { price: formattedPrice })}`;
        case 2: // Semaine
          return `${formattedPrice}/${t('common.week') || 'week'}`;
        case 4: // Mois
          return `${formattedPrice}/${t('common.month') || 'month'}`;
        case 8: // An
          return `${formattedPrice}/${t('common.year') || 'year'}`;
        default:
          // For other periods (Quinzaine, Trimestre, Bimensuel, Semestre), show price as is
          return formattedPrice;
      }
    }
    
    // Fallback to type-based formatting if no period specified
    if (type === 'rent') {
      return `${formattedPrice}/${t('common.month') || 'month'}`;
    }
    if (type === 'seasonal') {
      return `${t('properties.listing.fromPerDay', { price: formattedPrice })}`;
    }
    return formattedPrice;
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title={t('home.hero.title') || 'Agence Immobilière de Prestige à Essaouira'}
        description="Découvrez notre sélection exclusive de villas, appartements et biens d'exception à Essaouira. Vente, location longue durée, location saisonnière, gestion locative et conciergerie haut de gamme."
        keywords="immobilier Essaouira, agence immobilière Essaouira, vente villa Essaouira, location appartement Essaouira, immobilier de prestige Maroc, gestion locative Essaouira, conciergerie Essaouira, location saisonnière Essaouira, real estate Essaouira, property Morocco"
        url={`${location.pathname}${location.search}`}
      />
      {/* Hero Section - Épurée */}
      <section className="relative h-[70vh] sm:h-screen overflow-hidden">
        {/* Image Carousel Background (replaces video) */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === heroSlideIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.85)' }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
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
        <div className="absolute bottom-24 sm:bottom-20 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="transform transition-all duration-1000 delay-300 translate-y-0 opacity-100">
              
              {/* Boutons d'action - Nouveau design */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link
                  to="/properties?type=buy"
                  className="border-2 border-white/50 bg-white/20 text-white backdrop-blur-sm px-8 sm:px-10 py-2.5 sm:py-4 font-inter uppercase tracking-wider text-center text-sm sm:text-base hover:border-white hover:bg-white/40 transition-all duration-300"
                >
                  {t('home.hero.buyButton')}
                </Link>

                <Link
                  to="/properties?type=rent"
                  className="border-2 border-white/50 bg-white/20 text-white backdrop-blur-sm px-8 sm:px-10 py-2.5 sm:py-4 font-inter uppercase tracking-wider text-center text-sm sm:text-base hover:border-white hover:bg-white/40 transition-all duration-300"
                >
                  {t('home.hero.rentButton')}
                </Link>
              </div>

              
            </div>
          </div>
        </div>

        {/* Carousel Navigation — modern centered pill (like properties page) */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-black/20 backdrop-blur-xl rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
          <button
            onClick={() => setHeroSlideIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white backdrop-blur-sm flex items-center justify-center text-white hover:text-gray-900 border border-white/20 hover:border-white transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setHeroSlideIndex((prev) => (prev + 1) % heroImages.length)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white backdrop-blur-sm flex items-center justify-center text-white hover:text-gray-900 border border-white/20 hover:border-white transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-5 sm:h-6 bg-white/20 mx-1 hidden sm:block"></div>
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-0">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setHeroSlideIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-500 ${
                  index === heroSlideIndex ? 'bg-white w-6 sm:w-8 h-1.5 sm:h-1.5 shadow-[0_0_10px_rgba(255,255,255,0.6)]' : 'bg-white/50 hover:bg-white/80 w-1.5 h-1.5 sm:w-2 sm:h-2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="hidden sm:block absolute bottom-8 left-4 sm:left-8 animate-pulse z-30">
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
              </p>
              <p>
                {t('home.essence.paragraph3')}
              </p>
              <p className="font-medium text-[#023927]">
                {t('home.essence.paragraph4')}
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
                {featuredProperties.map((property) => {
                  const sold = isSoldStatus(property.status);
                  const statusLabel = sold
                    ? (property.type === 'buy' ? t('home.featured.sold') : t('home.featured.rented'))
                    : property.type === 'buy' ? t('home.featured.forSale') : property.type === 'rent' ? t('home.featured.forRent') : t('home.featured.vacation');
                  return (
                  <div key={property.id} className="w-full flex-shrink-0 px-2 sm:px-3">
                    <div className="group relative bg-white border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-[0_24px_64px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-700">
                      {/* hairline gold accent top */}
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A97E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="p-[2px] sm:p-[3px] bg-gray-100/60">
                        {/* IMAGE MOSAIC */}
                        <div className="flex flex-col md:flex-row gap-[2px] sm:gap-[3px] bg-gray-100 h-[360px] sm:h-[440px] lg:h-[420px] overflow-hidden">
                          {/* Primary */}
                          <div className="md:w-[68%] h-[58%] md:h-full relative overflow-hidden bg-gray-50 cursor-pointer" onClick={() => openGallery(property.images, property.title, 0)}>
                            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent"></div>
                            {/* top bar */}
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-14 flex items-center gap-2 flex-wrap">
                              {property.featured && (
                                <span className="inline-flex items-center gap-1.5 bg-white/92 backdrop-blur-xl border border-[#C8A97E]/25 px-2.5 sm:px-3 py-1 text-[10px] tracking-[0.18em] uppercase font-semibold text-[#023927] shadow-sm">
                                  <span className="w-1 h-1 rounded-full bg-[#C8A97E]"></span>
                                  {t('home.featured.exclusive')}
                                </span>
                              )}
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase font-medium backdrop-blur-xl border shadow-sm ${sold ? 'bg-gray-900 text-white border-gray-800' : 'bg-white/90 text-gray-700 border-white/60'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sold ? 'bg-gray-400' : 'bg-emerald-500'}`}></span>
                                {statusLabel}
                              </span>
                            </div>
                            {/* fav */}
                            <button onClick={(e) => { e.stopPropagation(); toggleFavorite(property.id); }} className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 group/fav">
                              {favorites.includes(property.id) ? <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> : <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover/fav:text-red-500 transition-colors" />}
                            </button>
                            {/* bottom — single refined counter */}
                            <div className="absolute bottom-0 left-0 p-3 sm:p-4">
                              <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/15 text-white px-2.5 py-1 text-[11px] tracking-wide shadow-sm">
                                <CameraIcon className="w-3.5 h-3.5 opacity-80" />
                                <span>{property.images.length} {t('home.featured.photos')}</span>
                              </div>
                            </div>
                          </div>
                          {/* Secondary thumbs */}
                          <div className="md:w-[32%] h-[42%] md:h-full flex flex-row md:flex-col gap-[2px] sm:gap-[3px]">
                            {(property.images.slice(1, 3).length ? property.images.slice(1, 3) : [property.images[0], property.images[0]]).map((img, imgIndex) => (
                              <div key={imgIndex} className="flex-1 relative overflow-hidden bg-gray-50 group/thumb cursor-pointer" onClick={() => openGallery(property.images, property.title, imgIndex + 1)}>
                                <img src={img} alt={`${property.title} ${imgIndex + 2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-[1.04]" />
                                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors duration-300"></div>
                                {imgIndex === 1 && property.images.length > 3 && (
                                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex flex-col items-center justify-center text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
                                    <ArrowTopRightOnSquareIcon className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-medium tracking-wide">+{property.images.length - 3}</span>
                                  </div>
                                )}
                                {imgIndex === 1 && (
                                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xl border border-white/50 text-gray-900 px-2 py-1 text-[10px] tracking-[0.14em] uppercase font-semibold flex items-center gap-1 shadow-sm">
                                    <Square2StackIcon className="w-3 h-3 text-gray-500" />
                                    Galerie
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* DETAILS — editorial, airy without footer */}
                      <div className="px-5 sm:px-7 lg:px-8 pt-6 sm:pt-7 pb-6 sm:pb-7">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 lg:gap-8">
                          {/* left */}
                          <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
                            <div className="hidden sm:block w-px self-stretch bg-gradient-to-b from-[#C8A97E] via-[#C8A97E]/30 to-transparent shrink-0"></div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-serif text-[19px] sm:text-[21px] lg:text-[23px] leading-[1.02] tracking-[-0.025em] font-light text-gray-900 truncate group-hover:text-[#023927] transition-colors duration-500">{property.title}</h3>
                              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px] text-gray-500">
                                <span className="truncate font-light">— {property.location}</span>
                                {property.reference && <span className="inline text-gray-300">•</span>}
                                {property.reference && <span className="inline text-[11px] tracking-wide text-gray-400 font-mono">Réf. {property.reference}</span>}
                              </div>
                              <div className="mt-3.5 flex items-center gap-2.5 sm:gap-3.5 text-[11px] tracking-[0.16em] uppercase font-medium text-gray-500">
                                <span className="inline-flex items-center gap-1.5"><HomeIcon className="w-3.5 h-3.5 text-gray-400" /> {property.rooms || 0} ch.</span>
                                <span className="w-px h-3.5 bg-gray-200"></span>
                                <span className="inline-flex items-center gap-1.5"><Square2StackIcon className="w-3.5 h-3.5 text-gray-400" /> {property.surface.toFixed(0)} m²</span>
                                <span className="w-px h-3.5 bg-gray-200 hidden sm:block"></span>
                                <span className="hidden sm:inline-flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-gray-400" /> {property.floors || 0} ét.</span>
                              </div>
                            </div>
                          </div>
                          {/* right price */}
                          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:text-right shrink-0 lg:min-w-[190px] border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
                            <div>
                              <div className="font-serif text-[21px] sm:text-[23px] lg:text-[25px] leading-none tracking-[-0.02em] font-light text-[#023927]">{formatPrice(property.price, property.type, property.currency, property.pricePeriod)}</div>
                              <div className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mt-1.5 font-medium">{property.type === 'buy' ? 'Prix' : property.type === 'rent' ? 'Par mois' : 'Saisonnier'}</div>
                            </div>
                            <Link to={`/properties/${property.id}`} className="group/cta inline-flex items-center gap-2.5 sm:gap-3 shrink-0">
                              <span className="relative text-[11px] sm:text-xs tracking-[0.18em] uppercase font-semibold text-[#023927]">Découvrir
                                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#023927] group-hover/cta:w-full transition-all duration-500 ease-out"></span>
                              </span>
                              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#023927]/15 bg-white flex items-center justify-center text-[#023927] group-hover/cta:bg-[#023927] group-hover/cta:text-white group-hover/cta:border-[#023927] group-hover/cta:scale-105 transition-all duration-300 shadow-sm">
                                <ArrowRightIcon className="w-3.5 h-3.5" />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* hover outer hairline */}
                      <div className="pointer-events-none absolute inset-0 border border-transparent group-hover:border-[#C8A97E]/0 lg:group-hover:border-[#C8A97E]/10 transition-colors duration-700"></div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Modern Centered Navigation — floating glass, vertically centered */}
            <button 
              onClick={prevFeatured} 
              disabled={featuredProperties.length <= 1}
              className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-5 w-11 h-11 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-xl rounded-full border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#023927] hover:border-[#023927] hover:text-white hover:shadow-[0_12px_40px_rgba(2,57,39,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-30 pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              aria-label="Previous property"
            >
              <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={nextFeatured} 
              disabled={featuredProperties.length <= 1}
              className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-5 w-11 h-11 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-xl rounded-full border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-[#023927] hover:border-[#023927] hover:text-white hover:shadow-[0_12px_40px_rgba(2,57,39,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-30 pointer-events-auto disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              aria-label="Next property"
            >
              <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
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

      {/* Client Testimonials - REAL Google Maps Reviews */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              {t('home.testimonials.title')}
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-gray-600">{t('home.testimonials.subtitle')}</p>
          </div>
          
          {loadingReviews ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#023927]"></div>
              <p className="mt-4 text-gray-600">Chargement des avis Google Maps...</p>
            </div>
          ) : googleReviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {googleReviews.slice(0, 6).map((review, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Author profile */}
                  <div className="flex items-center mb-4">
                    <img 
                      src={review.profile_photo_url} 
                      alt={review.author_name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-inter text-gray-900 font-medium">{review.author_name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-green-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Review text */}
                  <p className="text-gray-600 italic mb-4 leading-relaxed text-base">
                    "{review.text}"
                  </p>
                  
                  {/* Time */}
                  <p className="text-sm text-gray-500 border-t border-gray-100 pt-3">
                    {review.relative_time_description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun avis disponible pour le moment.</p>
            </div>
          )}
          
          {/* Google Maps Link */}
          <div className="text-center mt-12">
            <a 
              href="https://www.google.com/maps/place/M%C2%B2+Square+Meter/@31.4938096,-9.7575766,17z/data=!4m8!3m7!1s0x6b0f78fc73018673:0x9f971ab9cce20129!8m2!3d31.4938051!4d-9.7550017!9m1!1b1!16s%2Fg%2F11wth7gqpg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-[#023927] hover:text-[#035937] font-medium transition-colors"
            >
              <span>Voir tous les avis sur Google Maps</span>
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Review Form */}
          <ReviewForm />
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
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group h-full flex flex-col">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium text-center">
                  {t('home.values.excellence.title')}
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927] text-center mt-2 flex-1">
                  {t('home.values.excellence.description')}
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group h-full flex flex-col">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium text-center">
                  {t('home.values.humanity.title')}
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927] text-center mt-2 flex-1">
                  {t('home.values.humanity.description')}
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group h-full flex flex-col">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium text-center">
                  {t('home.values.innovation.title')}
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927] text-center mt-2 flex-1">
                  {t('home.values.innovation.description')}
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group h-full flex flex-col">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium text-center">
                  {t('home.values.responsibility.title')}
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927] text-center mt-2 flex-1">
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
      <section ref={statsRef} className="py-16 bg-[#023927] text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: yearsCount.toString(), label: t('home.stats.yearsExperience'), animated: true },
              { number: "98%", label: t('home.stats.satisfiedClients'), animated: false },
              { number: countriesCount.toString(), label: t('home.stats.countriesServed'), animated: true }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-3xl md:text-4xl font-inter text-white font-light mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-white/90 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={galleryImages}
        propertyTitle={galleryTitle}
        initialIndex={galleryInitialIndex}
      />
    </div>
  );
};

export default Home;