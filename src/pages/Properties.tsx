// src/pages/Properties.tsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MapPinIcon, 
  ArrowsPointingOutIcon, 
  HeartIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  CheckIcon,
  Square2StackIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon
} from '@heroicons/react/24/solid';

interface Property {
  id: number;
  title: string;
  description: string;
  type: 'buy' | 'rent' | 'seasonal';
  price: number;
  location: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  confidential?: boolean;
  featured?: boolean;
  yearBuilt?: number;
  features?: string[];
  reference?: string;
}

const Properties: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<string>(searchParams.get('type') || 'all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [locationFilter, setLocationFilter] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);

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
  }, [isHeroPlaying]);

  const nextHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev + 1) % heroProperties.length);
  };

  const prevHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev - 1 + heroProperties.length) % heroProperties.length);
  };

  // Premium property images from Pexels
  const propertyImages = [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800"
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      // Enhanced mock data with real images - Updated to match reference
      const mockProperties: Property[] = [
        {
          id: 1,
          title: 'Appartement Haussmannien',
          description: 'Exceptionnel appartement haussmannien rénové avec soin, parquet Versailles, moulures d\'origine et terrasse privative avec vue sur la Tour Eiffel.',
          type: 'buy',
          price: 3595000,
          location: 'Paris 16ème',
          surface: 216.96,
          bedrooms: 5,
          bathrooms: 4,
          images: [propertyImages[4], propertyImages[5], propertyImages[6]],
          featured: true,
          yearBuilt: 1850,
          features: ['Terrasse privative', 'Vue Tour Eiffel', 'Parquet Versailles', 'Hauteur sous plafond', 'Cheminée d\'origine', 'Ascenseur privatif'],
          reference: '86198435'
        },
        {
          id: 2,
          title: 'Villa Méditerranéenne Exceptionnelle',
          description: 'Magnifique villa contemporaine avec vue panoramique sur la Méditerranée, piscine à débordement et jardin paysager conçu par un architecte renommé.',
          type: 'buy',
          price: 3850000,
          location: 'Saint-Tropez',
          surface: 420,
          bedrooms: 6,
          bathrooms: 5,
          images: [propertyImages[0], propertyImages[1], propertyImages[2]],
          featured: true,
          yearBuilt: 2020,
          features: ['Piscine à débordement', 'Vue mer', 'Jardin paysager', 'Salle de sport', 'Home cinéma', 'Cave à vin'],
          reference: '86198436'
        },
        {
          id: 3,
          title: 'Penthouse Prestige',
          description: 'Exceptionnel penthouse haussmannien rénové avec soin, parquet Versailles, moulures d\'origine et terrasse privative avec vue sur la Tour Eiffel.',
          type: 'rent',
          price: 28000,
          location: 'Paris 8ème',
          surface: 220,
          bedrooms: 4,
          bathrooms: 3,
          images: [propertyImages[3], propertyImages[4], propertyImages[5]],
          yearBuilt: 1850,
          features: ['Terrasse privative', 'Vue Tour Eiffel', 'Parquet Versailles', 'Sécurité 24/7', 'Conciergerie', 'Parking privé'],
          reference: '86198437'
        },
        {
          id: 4,
          title: 'Domaine Provençal Historique',
          description: 'Authentique mas provençal du 18ème siècle entièrement rénové avec piscine chauffée, oliveraie centenaire et dépendances.',
          type: 'buy',
          price: 5200000,
          location: 'Gordes',
          surface: 650,
          bedrooms: 8,
          bathrooms: 6,
          images: [propertyImages[6], propertyImages[7], propertyImages[0]],
          confidential: true,
          yearBuilt: 1780,
          features: ['Oliveraie centenaire', 'Piscine chauffée', 'Dépendances', 'Vignoble', 'Écuries', 'Court de tennis'],
          reference: '86198438'
        },
        {
          id: 5,
          title: 'Villa Contemporaine Côte d\'Azur',
          description: 'Architecture contemporaine signée, vue mer imprenable, piscine infinity et accès plage privée.',
          type: 'seasonal',
          price: 45000,
          location: 'Saint-Jean-Cap-Ferrat',
          surface: 380,
          bedrooms: 5,
          bathrooms: 4,
          images: [propertyImages[1], propertyImages[2], propertyImages[3]],
          featured: true,
          yearBuilt: 2018,
          features: ['Piscine infinity', 'Accès plage privée', 'Architecture contemporaine', 'Spa', 'Héliport', 'Marina privée'],
          reference: '86198439'
        },
        {
          id: 6,
          title: 'Appartement Design Marais',
          description: 'Loft design dans le Marais, hauteur sous plafond exceptionnelle, verrière et équipements haut de gamme.',
          type: 'rent',
          price: 12500,
          location: 'Paris 4ème',
          surface: 95,
          bedrooms: 2,
          bathrooms: 2,
          images: [propertyImages[4], propertyImages[5], propertyImages[6]],
          yearBuilt: 2015,
          features: ['Hauteur sous plafond', 'Verrière', 'Design contemporain', 'Terrasse', 'Cuisine équipée', 'Mezzanine'],
          reference: '86198440'
        }
      ];
      
      setTimeout(() => {
        setProperties(mockProperties);
        setLoading(false);
      }, 1500);
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property => {
    const typeMatch = filter === 'all' || property.type === filter;
    const priceMatch = property.price >= minPrice && property.price <= maxPrice;
    const locationMatch = !locationFilter || 
      property.location.toLowerCase().includes(locationFilter.toLowerCase());
    const bedroomsMatch = !bedroomsFilter || property.bedrooms >= bedroomsFilter;
    const searchMatch = !searchQuery || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && priceMatch && locationMatch && bedroomsMatch && searchMatch;
  });

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const propertyTypes = [
    { key: 'all', label: 'Tous les biens', count: properties.length },
    { key: 'buy', label: 'À acheter', count: properties.filter(p => p.type === 'buy').length },
    { key: 'rent', label: 'À louer', count: properties.filter(p => p.type === 'rent').length },
    { key: 'seasonal', label: 'Saisonnière', count: properties.filter(p => p.type === 'seasonal').length },
  ];

  const locations = Array.from(new Set(properties.map(p => p.location)));
  const bedroomOptions = [1, 2, 3, 4, 5, 6];

  const resetFilters = () => {
    setFilter('all');
    setMinPrice(0);
    setMaxPrice(10000000);
    setLocationFilter('');
    setBedroomsFilter(null);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    filter !== 'all',
    minPrice > 0 || maxPrice < 10000000,
    locationFilter !== '',
    bedroomsFilter !== null,
    searchQuery !== '',
  ].filter(Boolean).length;

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    if (type === 'min') {
      setMinPrice(Math.max(0, numValue));
    } else {
      setMaxPrice(Math.max(0, numValue));
    }
  };

  const formatPrice = (price: number, type?: string) => {
    if (type === 'rent') {
      return `${price.toLocaleString('fr-FR')} €/mois`;
    }
    if (type === 'seasonal') {
      return `${price.toLocaleString('fr-FR')} €/semaine`;
    }
    return `${price.toLocaleString('fr-FR')} €`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search Only - Updated with margin */}
      <section className="relative h-[60vh] overflow-hidden bg-white">
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
        <div className="absolute inset-0 flex items-start justify-center z-20 px-6 pt-40">
          <div className="w-full max-w-4xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une propriété, une localisation, un bien spécifique..."
                className="w-full mt-10 px-8 py-6 pl-16 bg-white/95 backdrop-blur-sm border-2 border-white/50 text-gray-900 placeholder-gray-600 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/30 shadow-2xl text-lg font-light transition-all duration-300"
                style={{ borderRadius: '0' }}
              />
              <div className="absolute mt-5 left-8 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon className="w-6 h-6 text-[#023927]" />
              </div>
              <div className="absolute right-4 mt-5 top-1/2 transform -translate-y-1/2">
                <span className="text-sm text-gray-500 font-medium px-3 py-1 bg-white/80">
                  {filteredProperties.length} résultats
                </span>
              </div>
            </div>
            
            {/* Search Suggestions - Updated hover effects */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <span className="text-white/90 text-sm">Suggestions :</span>
              <button 
                onClick={() => setLocationFilter('Paris')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm hover:text-[#023927] hover:bg-white transition-all duration-500"
                style={{ borderRadius: '0' }}
              >
                Paris
              </button>
              <button 
                onClick={() => setBedroomsFilter(3)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm hover:text-[#023927] hover:bg-white transition-all duration-500"
                style={{ borderRadius: '0' }}
              >
                3+ chambres
              </button>
              <button 
                onClick={() => setFilter('buy')}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm hover:text-[#023927] hover:bg-white transition-all duration-500"
                style={{ borderRadius: '0' }}
              >
                À acheter
              </button>
              <button 
                onClick={() => setMaxPrice(5000000)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm hover:text-[#023927] hover:bg-white transition-all duration-500"
                style={{ borderRadius: '0' }}
              >
                Budget &lt; 5M€
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Controls - Minimal */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center space-x-4">
          <button
            onClick={prevHeroSlide}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextHeroSlide}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          
          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroProperties.map((_, index) => (
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

      {/* Enhanced Filters Section - Cleaner */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="bg-white p-6 shadow-sm">
            {/* Filters Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h2 className="text-3xl font-inter font-light text-gray-900 mb-2">
                  Exploration Sur Mesure
                </h2>
                <p className="text-gray-500 text-base">
                  Affinez votre recherche avec nos filtres intelligents
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                {activeFiltersCount > 0 && (
                  <span className="bg-[#023927] text-white px-5 py-2.5 text-base font-medium">
                    {activeFiltersCount} filtre(s) actif(s)
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-gray-600 hover:text-[#023927] hover:bg-white transition-all duration-500 text-base border-2 border-gray-300 px-5 py-2.5 hover:border-[#023927]"
                >
                  Tout réinitialiser
                </button>
              </div>
            </div>

            {/* Property Type Tabs - Larger, no icons */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {propertyTypes.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`p-5 border-2 transition-all duration-500 text-base font-medium ${
                    filter === key
                      ? 'border-[#023927] bg-white text-[#023927]'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-[#023927] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{label}</span>
                    <span className={`text-sm px-2.5 py-1 ${
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Location */}
              <div>
                <label className="block font-medium text-gray-900 text-lg mb-3">
                  Localisation
                </label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-5 py-3.5 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023927] focus:border-transparent bg-white text-base hover:border-gray-900 transition-colors duration-300"
                  style={{ borderRadius: '0' }}
                >
                  <option value="">Toutes les localisations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block font-medium text-gray-900 text-lg mb-3">
                  Chambres
                </label>
                <select 
                  value={bedroomsFilter || ''}
                  onChange={(e) => setBedroomsFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-5 py-3.5 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023927] focus:border-transparent bg-white text-base hover:border-gray-900 transition-colors duration-300"
                  style={{ borderRadius: '0' }}
                >
                  <option value="">Toutes</option>
                  {bedroomOptions.map(beds => (
                    <option key={beds} value={beds}>{beds}+ chambres</option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block font-medium text-gray-900 text-lg mb-3">
                  Budget min
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={minPrice === 0 ? '' : minPrice}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-5 py-3.5 pl-12 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023927] focus:border-transparent bg-white text-base hover:border-gray-900 transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                  <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">€</span>
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="block font-medium text-gray-900 text-lg mb-3">
                  Budget max
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxPrice === 10000000 ? '' : maxPrice}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    placeholder="10,000,000"
                    min="0"
                    className="w-full px-5 py-3.5 pl-12 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023927] focus:border-transparent bg-white text-base hover:border-gray-900 transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                  <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">€</span>
                </div>
              </div>

              {/* Apply Button - Updated hover */}
              <div className="flex items-end">
                <button className="w-full border-2 border-gray-900 text-gray-900 py-3.5 text-base font-medium hover:text-[#023927] hover:bg-white transition-all duration-500 hover:border-[#023927]">
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Cards Section - REVOLUTIONARY NEW LAYOUT */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          {/* Results Header */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
              <h3 className="text-4xl font-inter font-light text-gray-900 mb-4 lg:mb-0">
                {filteredProperties.length} Biens disponibles
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 text-base">Trier par :</span>
                <select className="border-2 border-gray-300 px-4 py-2 text-base focus:outline-none focus:border-[#023927]">
                  <option>Pertinence</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                  <option>Surface</option>
                  <option>Plus récents</option>
                </select>
              </div>
            </div>
            <div className="h-px bg-gray-200 w-full"></div>
          </div>

          {/* Properties Grid - ELEGANT HORIZONTAL LAYOUT */}
          {loading ? (
            <div className="flex justify-center items-center py-40">
              <div className="relative">
                <div className="animate-spin h-24 w-24 border-2 border-[#023927] border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#023927] font-light text-lg">Chargement...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 max-w-6xl mx-auto">
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="bg-white border-2 border-gray-100 group transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-gray-200"
                >
                  {/* MAIN CARD CONTAINER - Horizontal Layout */}
                  <div className="flex flex-col">
                    {/* IMAGE SECTION - Left side with primary + secondary images */}
                    <div className="w-full flex flex-col md:flex-row h-[500px]">
                      {/* Primary Image - Larger on left */}
                      <div className="md:w-2/3 h-full relative overflow-hidden">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                        />
                        
                        {/* Overlay Badges */}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                          {property.featured && (
                            <span className="bg-[#023927] text-white px-4 py-2 font-inter uppercase text-xs font-medium tracking-wider max-w-max">
                              EXCLUSIF
                            </span>
                          )}
                          {property.confidential && (
                            <span className="bg-black/90 text-white px-4 py-2 font-inter uppercase text-xs font-medium tracking-wider max-w-max">
                              CONFIDENTIEL
                            </span>
                          )}
                        </div>
                        
                        {/* Favorite Button */}
                        <button 
                          onClick={() => toggleFavorite(property.id)}
                          className="absolute top-6 right-6 w-12 h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group/fav"
                        >
                          {favorites.includes(property.id) ? (
                            <HeartIconSolid className="w-6 h-6 text-red-500" />
                          ) : (
                            <HeartIcon className="w-6 h-6 text-gray-600 group-hover/fav:text-red-500 transition-colors" />
                          )}
                        </button>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-6 left-6 bg-black/80 text-white px-4 py-2 flex items-center space-x-2 backdrop-blur-sm">
                          <CameraIcon className="w-4 h-4" />
                          <span className="text-sm">{property.images.length} photos</span>
                        </div>
                      </div>
                      
                      {/* Secondary Images - Stacked vertically on right */}
                      <div className="md:w-1/3 h-full flex flex-col gap-2 p-2">
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
                                <div className="text-white text-center p-4">
                                  <ArrowTopRightOnSquareIcon className="w-6 h-6 mx-auto mb-2" />
                                  <span className="text-xs font-medium">+{property.images.length - 3} photos</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* DETAILS SECTION - compact single-line summary */}
                    <div className="w-full p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 text-xs font-medium tracking-wider ${
                            property.type === 'buy' 
                              ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                              : property.type === 'rent'
                              ? 'bg-green-50 text-green-800 border border-green-200'
                              : 'bg-purple-50 text-purple-800 border border-purple-200'
                          }`}>{property.type === 'buy' ? 'À VENDRE' : property.type === 'rent' ? 'À LOUER' : 'SAISONNIER'}</span>

                          <h3 className="text-lg font-inter font-medium text-gray-900 truncate">{property.title}</h3>

                          <span className="text-gray-500 text-sm truncate">• {property.location}</span>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center text-sm text-gray-600 space-x-4 whitespace-nowrap">
                        <div className="flex items-center gap-1"><HomeIcon className="w-4 h-4" /> <span className="ml-1">{property.bedrooms}</span></div>
                        <div className="flex items-center gap-1"><CheckIcon className="w-4 h-4" /> <span className="ml-1">{property.bathrooms}</span></div>
                        <div className="flex items-center gap-1"><Square2StackIcon className="w-4 h-4" /> <span className="ml-1">{property.surface.toFixed(0)} m²</span></div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="font-serif text-[#023927] font-bold text-lg whitespace-nowrap">{formatPrice(property.price, property.type)}</div>
                        <Link
                          to={`/properties/${property.id}`}
                          className="bg-white border-2 border-[#023927] text-[#023927] px-3 py-2 text-sm uppercase font-medium hover:bg-[#023927] hover:text-white transition-all duration-300"
                        >
                          Voir
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property ID Badge - Subtle */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white border border-gray-200 px-4 py-1 text-gray-400 text-xs font-mono">
                      ID: {property.id.toString().padStart(4, '0')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-32 bg-gray-50 border-2 border-gray-200 max-w-4xl mx-auto">
              <div className="text-8xl mb-10 opacity-20">🏠</div>
              <h3 className="text-3xl font-inter text-gray-900 mb-8 font-light">
                Aucune propriété ne correspond à votre recherche
              </h3>
              <p className="text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
                Notre collection évolue constamment. Élargissez vos critères de recherche 
                ou contactez-nous pour une recherche personnalisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={resetFilters}
                  className="border-2 border-gray-900 text-gray-900 px-10 py-4 font-inter uppercase tracking-wider text-lg hover:text-[#023927] hover:bg-white hover:border-[#023927] transition-all duration-500"
                >
                  Élargir la recherche
                </button>
                <Link
                  to="/contact"
                  className="bg-[#023927] text-white px-10 py-4 font-inter uppercase tracking-wider text-lg hover:bg-white hover:text-[#023927] hover:border-2 hover:border-[#023927] transition-all duration-500"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          )}

          {/* Load More */}
          {filteredProperties.length > 0 && (
            <div className="text-center mt-16">
              <button className="border-2 border-gray-900 text-gray-900 px-14 py-5 font-inter uppercase tracking-wider text-lg hover:text-[#023927] hover:bg-white hover:border-[#023927] transition-all duration-500 focus:outline-none">
                <span>Voir plus de biens</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;