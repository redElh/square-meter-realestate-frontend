// src/pages/Properties.tsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../contexts/LocalizationContext';
import { 
  HeartIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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

const Properties: React.FC = () => {
  const { t } = useTranslation();
  const { format: formatCurrencyPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<string>(searchParams.get('type') || 'all');
  const [locationFilter, setLocationFilter] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPlaying] = useState(true);
  
  // Get current language from i18n
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Exclusive properties hero images
  const heroProperties = [
    {
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "Villa Azure",
      location: "Côte d'Azur, France",
      price: "4,200,000 €",
      type: "buy"
    },
    {
      image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "Château de la Renaissance",
      location: "Loire Valley, France",
      price: "8,500,000 €",
      type: "buy"
    },
    {
      image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "Penthouse Skyline",
      location: "Paris 16ème, France",
      price: "12,500 €/mois",
      type: "rent"
    }
  ];

  // Hero carousel controls
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isHeroPlaying) {
      slideInterval = setInterval(() => {
        setActiveHeroSlide((prev) => (prev + 1) % heroProperties.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isHeroPlaying, heroProperties.length]);

  const nextHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev + 1) % heroProperties.length);
  };

  const prevHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev - 1 + heroProperties.length) % heroProperties.length);
  };



  useEffect(() => {
    const fetchProperties = async () => {
      console.log('🔍 Starting to fetch properties...');
      setLoading(true);
      try {
        // Fetch properties from Apimo CRM API
        console.log('📡 Calling apimoService.getProperties...');
        const { properties: apimoProperties } = await apimoService.getProperties({
          limit: 1000, // Get all properties
        }, t, currentLanguage);
        
        console.log('✅ Successfully loaded properties from Apimo CRM:', apimoProperties.length, apimoProperties);
        setProperties(apimoProperties);
      } catch (error) {
        console.error('❌ Error loading properties from Apimo:', error);
        // Set empty array to show "no properties" message
        setProperties([]);
      } finally {
        setLoading(false);
        console.log('🏁 Finished loading properties');
      }
    };

    fetchProperties();
  }, [t, currentLanguage]);

  const filteredProperties = properties.filter(property => {
    const typeMatch = filter === 'all' || property.type === filter;
    const locationMatch = !locationFilter || 
      property.location.toLowerCase().includes(locationFilter.toLowerCase());
    const bedroomsMatch = !bedroomsFilter || property.bedrooms >= bedroomsFilter;
    const searchMatch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && locationMatch && bedroomsMatch && searchMatch;
  });

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const propertyTypes = [
    { key: 'buy', label: t('properties.filters.buy'), count: properties.filter(p => p.type === 'buy').length },
    { key: 'rent', label: t('properties.filters.rent'), count: properties.filter(p => p.type === 'rent').length },
    { key: 'seasonal', label: t('properties.filters.vacation'), count: properties.filter(p => p.type === 'seasonal').length },
  ];

  const locations = Array.from(new Set(properties.map(p => p.location)));
  const bedroomOptions = [1, 2, 3, 4, 5, 6];

  const resetFilters = () => {
    setFilter('all');
    setLocationFilter('');
    setBedroomsFilter(null);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    filter !== 'all',
    locationFilter !== '',
    bedroomsFilter !== null,
    searchQuery !== '',
  ].filter(Boolean).length;

  

  const formatPropertyPrice = (price: number, type: 'buy' | 'rent' | 'seasonal') => {
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
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search Only - Updated with margin */}
      <section className="relative h-[70vh] sm:h-screen overflow-hidden bg-white">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroProperties.map((slide, index) => (
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

        {/* Centered Search Bar - Moved down 40px */}
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6 mt-40">
          <div className="w-full max-w-4xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('properties.search.placeholder')}
                className="w-full px-4 sm:px-8 py-4 sm:py-6 pl-12 sm:pl-16 bg-white/95 backdrop-blur-sm border-2 border-white/50 text-gray-900 placeholder-gray-600 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/30 shadow-2xl text-sm sm:text-lg font-light transition-all duration-300"
                style={{ borderRadius: '0' }}
              />
              <div className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#023927]" />
              </div>
              <div className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-xs sm:text-sm text-gray-500 font-medium px-2 sm:px-3 py-1 bg-white/80">
                  {filteredProperties.length} {t('properties.search.results')}
                </span>
              </div>
            </div>
            
            {/* Search Suggestions - Updated hover effects */}
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 justify-center">
              <span className="text-white/90 text-xs sm:text-sm hidden sm:inline">{t('properties.search.suggestions')} :</span>
              <button 
                onClick={() => setLocationFilter('Paris')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm hover:text-[#023927] hover:bg-white transition-all duration-500"
                style={{ borderRadius: '0' }}
              >
                {t('properties.search.paris')}
              </button>
              <button 
                onClick={() => setBedroomsFilter(3)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm hover:text-[#023927] hover:bg-white transition-all duration-500"
                style={{ borderRadius: '0' }}
              >
                {t('properties.search.bedrooms3Plus')}
              </button>
              <button 
                onClick={() => setFilter('buy')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm hover:text-[#023927] hover:bg-white transition-all duration-500"
                style={{ borderRadius: '0' }}
              >
                {t('properties.search.toBuy')}
              </button>
              <button 
                onClick={() => setFilter('seasonal')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm hover:text-[#023927] hover:bg-white"
                style={{ borderRadius: '0' }}
              >
                {t('properties.search.vacation')}
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Controls - Minimal */}
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
          <div className="flex space-x-1.5 sm:space-x-2">
            {heroProperties.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroSlide(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 transition-all duration-300 ${
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

      {/* Enhanced Filters Section - Cleaner */}
      <section className="py-4 sm:py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white p-4 sm:p-6 shadow-sm">
            {/* Filters Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-inter font-light text-gray-900 mb-1 sm:mb-2">
                  {t('properties.search.tailoredExploration')}
                </h2>
                <p className="text-gray-500 text-sm sm:text-base">
                  {t('properties.filters.title')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-4 lg:mt-0">
                {activeFiltersCount > 0 && (
                  <span className="bg-[#023927] text-white px-3 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base font-medium">
                    {activeFiltersCount} {t('properties.filters.activeFilters')}
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-gray-600 hover:text-[#023927] hover:bg-white transition-all duration-500 text-sm sm:text-base border-2 border-gray-300 px-3 sm:px-5 py-1.5 sm:py-2.5 hover:border-[#023927]"
                >
                  {t('properties.filters.resetAll')}
                </button>
              </div>
            </div>

            {/* Property Type Tabs - Larger, no icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
              {propertyTypes.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`w-full p-3 sm:p-5 border-2 text-sm sm:text-base font-medium ${
                    filter === key
                      ? 'border-[#023927] bg-white text-[#023927]'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-[#023927] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{label}</span>
                    <span className={`text-xs sm:text-sm px-1.5 sm:px-2.5 py-0.5 sm:py-1 ${
                      filter === key 
                        ? 'bg-[#023927]/10 text-[#023927]' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Advanced Filters Grid - Larger */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block font-medium text-gray-900 text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  {t('properties.filters.location')}
                </label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 sm:px-5 py-2.5 sm:py-3.5 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023927] focus:border-transparent bg-white text-sm sm:text-base"
                  style={{ borderRadius: '0' }}
                >
                  <option value="">{t('properties.filters.allLocations')}</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block font-medium text-gray-900 text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                  {t('properties.filters.bedrooms')}
                </label>
                <select 
                  value={bedroomsFilter || ''}
                  onChange={(e) => setBedroomsFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 sm:px-5 py-2.5 sm:py-3.5 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023927] focus:border-transparent bg-white text-sm sm:text-base"
                  style={{ borderRadius: '0' }}
                >
                  <option value="">{t('properties.filters.allBedrooms')}</option>
                  {bedroomOptions.map(beds => (
                    <option key={beds} value={beds}>{beds}+ {t('properties.filters.bedroomsLabel')}</option>
                  ))}
                </select>
              </div>

              {/* (Budget min/max removed per request) */}

              {/* Apply Button - Updated hover */}
              <div className="flex items-end">
                <button className="w-full border-2 border-gray-900 text-gray-900 py-2.5 sm:py-3.5 text-sm sm:text-base font-medium hover:text-[#023927] hover:bg-white transition-all duration-500 hover:border-[#023927]">
                  {t('properties.filters.apply')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Cards Section - REVOLUTIONARY NEW LAYOUT */}
      <section className="py-6 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Results Header */}
          <div className="mb-6 sm:mb-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-gray-900 mb-3 sm:mb-4 lg:mb-0">
                {filteredProperties.length} {t('properties.listing.available')}
              </h3>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-gray-500 text-sm sm:text-base">{t('properties.listing.sortBy')}</span>
                <select className="border-2 border-gray-300 px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base focus:outline-none focus:border-[#023927]">
                  <option>{t('properties.listing.relevance')}</option>
                  <option>{t('properties.listing.priceAsc')}</option>
                  <option>{t('properties.listing.priceDesc')}</option>
                  <option>{t('properties.listing.surface')}</option>
                  <option>{t('properties.listing.newest')}</option>
                </select>
              </div>
            </div>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>

          {/* Properties Grid - ELEGANT HORIZONTAL LAYOUT */}
          {loading ? (
            <div className="flex justify-center items-center py-20 sm:py-40">
              <div className="relative">
                <div className="animate-spin h-16 w-16 sm:h-24 sm:w-24 border-2 border-[#023927] border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#023927] font-light text-sm sm:text-lg">{t('properties.listing.loading')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-8 max-w-6xl mx-auto">
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="bg-white border-2 border-gray-100 group transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-gray-200"
                >
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
                              {t('properties.listing.exclusive')}
                            </span>
                          )}
                          {property.confidential && (
                            <span className="bg-black/90 text-white px-2 sm:px-4 py-1 sm:py-2 font-inter uppercase text-[10px] sm:text-xs font-medium tracking-wider max-w-max">
                              {t('properties.listing.confidential')}
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
                          <span className="text-xs sm:text-sm">{property.images.length} {t('properties.listing.photos')}</span>
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
                          }`}>{property.type === 'buy' ? t('properties.listing.forSale') : property.type === 'rent' ? t('properties.listing.forRent') : t('properties.listing.forVacation')}</span>

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
                        <div className="font-serif text-[#023927] font-bold text-base sm:text-lg whitespace-nowrap">{formatPropertyPrice(property.price, property.type)}</div>
                        <Link
                          to={`/properties/${property.id}`}
                          className="bg-white border-2 border-[#023927] text-[#023927] px-4 sm:px-3 py-2 text-xs sm:text-sm uppercase font-medium hover:bg-[#023927] hover:text-white transition-all duration-300"
                        >
                          {t('properties.listing.view')}
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-16 sm:py-32 bg-gray-50 border-2 border-gray-200 max-w-4xl mx-auto">
              <div className="text-5xl sm:text-8xl mb-6 sm:mb-10 opacity-20">🏠</div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-inter text-gray-900 mb-4 sm:mb-8 font-light px-4">
                {t('properties.empty.title')}
              </h3>
              <p className="text-gray-600 mb-8 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
                {t('properties.empty.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
                <button
                  onClick={resetFilters}
                  className="border-2 border-gray-900 text-gray-900 px-6 sm:px-10 py-3 sm:py-4 font-inter uppercase tracking-wider text-sm sm:text-lg hover:text-[#023927] hover:bg-white hover:border-[#023927] transition-all duration-500"
                >
                  {t('properties.empty.expandSearch')}
                </button>
                <Link
                  to="/contact"
                  className="bg-[#023927] text-white px-6 sm:px-10 py-3 sm:py-4 font-inter uppercase tracking-wider text-sm sm:text-lg hover:bg-white hover:text-[#023927] hover:border-2 hover:border-[#023927] transition-all duration-500"
                >
                  {t('properties.empty.contactUs')}
                </Link>
              </div>
            </div>
          )}

          {/* Load More */}
          {filteredProperties.length > 0 && (
            <div className="text-center mt-8 sm:mt-16">
              <button className="border-2 border-gray-900 text-gray-900 px-8 sm:px-14 py-3 sm:py-5 font-inter uppercase tracking-wider text-sm sm:text-lg hover:text-[#023927] hover:bg-white hover:border-[#023927] transition-all duration-500 focus:outline-none">
                <span>{t('properties.listing.loadMore')}</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;