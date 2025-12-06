// src/pages/Properties.tsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MapPinIcon, 
  ArrowsPointingOutIcon, 
  HomeModernIcon, 
  HeartIcon,
  EyeIcon,
  CurrencyEuroIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  SparklesIcon
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

  // Exclusive properties hero images
  const heroProperties = [
    {
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Villa Azure",
      location: "Côte d'Azur, France",
      price: "4,200,000 €",
      type: "buy",
      features: ["Vue mer", "Piscine à débordement", "Architecture contemporaine"]
    },
    {
      image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Château de la Renaissance",
      location: "Loire Valley, France",
      price: "8,500,000 €",
      type: "buy",
      features: ["Monument historique", "Parc de 15 hectares", "Vignoble"]
    },
    {
      image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Penthouse Skyline",
      location: "Paris 16ème, France",
      price: "12,500 €/mois",
      type: "rent",
      features: ["Terrasse panoramique", "Vue Tour Eiffel", "Services hôteliers"]
    }
  ];

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
      // Enhanced mock data with real images
      const mockProperties: Property[] = [
        {
          id: 1,
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
          features: ['Piscine à débordement', 'Vue mer', 'Jardin paysager', 'Cuisine équipée']
        },
        {
          id: 2,
          title: 'Penthouse Haussmannien Prestige',
          description: 'Exceptionnel appartement haussmannien rénové avec soin, parquet Versailles, moulures d\'origine et terrasse privative avec vue sur la Tour Eiffel.',
          type: 'rent',
          price: 28000,
          location: 'Paris 8ème',
          surface: 220,
          bedrooms: 4,
          bathrooms: 3,
          images: [propertyImages[3], propertyImages[4], propertyImages[5]],
          yearBuilt: 1850,
          features: ['Terrasse privative', 'Vue Tour Eiffel', 'Parquet Versailles', 'Moulures d\'origine']
        },
        {
          id: 3,
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
          features: ['Oliveraie centenaire', 'Piscine chauffée', 'Dépendances', 'Mas authentique']
        },
        {
          id: 4,
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
          features: ['Piscine infinity', 'Accès plage privée', 'Architecture contemporaine', 'Vue mer']
        },
        {
          id: 5,
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
          features: ['Hauteur sous plafond', 'Verrière', 'Design contemporain', 'Marais historique']
        },
        {
          id: 6,
          title: 'Château Renaissance Val de Loire',
          description: 'Château historique classé monument historique, parc arboré de 12 hectares, dépendances et vignoble.',
          type: 'buy',
          price: 8500000,
          location: 'Touraine',
          surface: 1200,
          bedrooms: 12,
          bathrooms: 8,
          images: [propertyImages[7], propertyImages[0], propertyImages[1]],
          confidential: true,
          yearBuilt: 1560,
          features: ['Monument historique', 'Parc 12 hectares', 'Vignoble', 'Dépendances']
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
    { key: 'all', label: 'Tous les biens', count: properties.length, icon: BuildingStorefrontIcon },
    { key: 'buy', label: 'À acheter', count: properties.filter(p => p.type === 'buy').length, icon: HomeModernIcon },
    { key: 'rent', label: 'À louer', count: properties.filter(p => p.type === 'rent').length, icon: SparklesIcon },
    { key: 'seasonal', label: 'Saisonnière', count: properties.filter(p => p.type === 'seasonal').length, icon: StarIcon },
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
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M €`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K €`;
    }
    return `${price.toLocaleString('fr-FR')} €`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Unique Hero Section for Properties */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-deep-green to-gray-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-ivory/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Floating Property Cards */}
        <div className="absolute inset-0 overflow-hidden">
          {heroProperties.map((property, index) => (
            <div
              key={index}
              className="absolute w-64 h-80 rounded-2xl overflow-hidden transform transition-all duration-1000 hover:scale-110 hover:z-20"
              style={{
                top: `${20 + index * 25}%`,
                left: `${10 + index * 30}%`,
                rotate: `${-5 + index * 5}deg`,
                animation: `float${index + 1} 8s ease-in-out infinite`
              }}
            >
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                <p className="text-gold text-sm">{property.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Hero Content */}
        <div className="relative z-20 flex items-center justify-center h-full text-white">
          <div className="max-w-6xl mx-auto px-6 w-full text-center">
            <div className="transform transition-all duration-1000">
              {/* Animated Logo/Brand */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative group">
                  <div className="relative w-20 h-20 bg-gradient-to-br from-gold to-amber-600 rounded-2xl shadow-2xl transform group-hover:rotate-6 transition-transform duration-500 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <BuildingStorefrontIcon className="w-10 h-10 text-deep-green relative z-10" />
                  </div>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-light uppercase mb-6 tracking-wider">
                Collection
              </h1>
              <p className="text-2xl md:text-3xl text-gold mb-8 leading-relaxed font-serif max-w-4xl mx-auto">
                Découvrez notre portefeuille exclusif de propriétés d'exception, 
                soigneusement sélectionnées pour leur caractère unique et leur excellence architecturale.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une propriété, une localisation, un bien spécifique..."
                    className="w-full px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                  />
                  <MagnifyingGlassIcon className="w-6 h-6 text-gold absolute right-8 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                {[
                  { number: '50+', label: 'Propriétés Premium' },
                  { number: '12', label: 'Destinations' },
                  { number: '98%', label: 'Satisfaction Client' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-3xl font-light text-gold mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-sm font-light">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {/* Filters Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h2 className="text-3xl font-light uppercase text-gray-900 mb-2">
                  Exploration Sur Mesure
                </h2>
                <p className="text-gray-600 text-lg">
                  Affinez votre recherche avec nos filtres intelligents
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                {activeFiltersCount > 0 && (
                  <span className="bg-gold text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {activeFiltersCount} filtre(s) actif(s)
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300 text-sm border border-gray-300 px-4 py-2 rounded-lg hover:border-gray-400"
                >
                  Tout réinitialiser
                </button>
              </div>
            </div>

            {/* Property Type Tabs with Icons */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {propertyTypes.map(({ key, label, count, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 group ${
                    filter === key
                      ? 'border-gray-900 bg-gray-900 text-white shadow-2xl'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gold hover:shadow-lg'
                  }`}
                >
                  <div className="text-left">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg transition-colors duration-300 ${
                        filter === key ? 'bg-gold text-gray-900' : 'bg-gray-100 text-gray-600 group-hover:bg-gold group-hover:text-gray-900'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="font-medium text-sm">{label}</div>
                    </div>
                    <div className="text-2xl font-light">{count}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Advanced Filters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
              {/* Location */}
              <div className="relative">
                <label className="block font-medium text-gray-900 text-sm mb-3">
                  <MapPinIcon className="w-4 h-4 inline mr-2" />
                  Localisation
                </label>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                >
                  <option value="">Toutes les localisations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block font-medium text-gray-900 text-sm mb-3">
                  <HomeModernIcon className="w-4 h-4 inline mr-2" />
                  Chambres
                </label>
                <select 
                  value={bedroomsFilter || ''}
                  onChange={(e) => setBedroomsFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                >
                  <option value="">Toutes</option>
                  {bedroomOptions.map(beds => (
                    <option key={beds} value={beds}>{beds}+ chambres</option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block font-medium text-gray-900 text-sm mb-3">
                  <CurrencyEuroIcon className="w-4 h-4 inline mr-2" />
                  Budget min
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={minPrice === 0 ? '' : minPrice}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                  />
                  <span className="absolute left-3 top-3 text-gray-500">€</span>
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="block font-medium text-gray-900 text-sm mb-3">
                  <CurrencyEuroIcon className="w-4 h-4 inline mr-2" />
                  Budget max
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={maxPrice === 10000000 ? '' : maxPrice}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    placeholder="10,000,000"
                    min="0"
                    className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white transition-all duration-300 hover:border-gray-400"
                  />
                  <span className="absolute left-3 top-3 text-gray-500">€</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gold hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                >
                  Appliquer
                </button>
              </div>
            </div>

            {/* Price Range Visualizer */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gold/5 rounded-2xl border border-gold/20">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span className="font-semibold">Échelle de budget:</span>
                <span className="font-bold text-gray-900 text-lg">
                  {minPrice.toLocaleString('fr-FR')} € - {maxPrice.toLocaleString('fr-FR')} €
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 relative">
                <div 
                  className="bg-gradient-to-r from-gold to-amber-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.max(2, ((maxPrice - minPrice) / 10000000) * 100)}%`,
                    marginLeft: `${(minPrice / 10000000) * 100}%`
                  }}
                ></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0 €</span>
                <span>10M €</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-4xl font-light uppercase text-gray-900 mb-3">
                {filteredProperties.length} Trésor{filteredProperties.length > 1 ? 's' : ''} Immobilier{filteredProperties.length > 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600 text-lg">
                {filter !== 'all' && `Filtré par : ${propertyTypes.find(t => t.key === filter)?.label}`}
                {(minPrice > 0 || maxPrice < 10000000) && ` • Budget: ${minPrice.toLocaleString('fr-FR')}€ - ${maxPrice.toLocaleString('fr-FR')}€`}
                {searchQuery && ` • Recherche: "${searchQuery}"`}
              </p>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-t-2 border-gold rounded-full animate-spin reverse"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="group bg-white border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden rounded-3xl transform hover:scale-[1.02]"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.8s ease-out forwards'
                  }}
                >
                  <div className="flex flex-col lg:flex-row h-full">
                    {/* Image Section */}
                    <div className="lg:w-2/5 flex h-96 lg:h-auto">
                      <div className="w-2/3 h-full relative overflow-hidden">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-6 left-6 flex flex-col space-y-2">
                          {property.confidential && (
                            <span className="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 font-medium uppercase text-xs tracking-wide shadow-2xl rounded-full">
                              🔒 CONFIDENTIEL
                            </span>
                          )}
                          {property.featured && (
                            <span className="bg-gold text-gray-900 px-4 py-2 font-medium uppercase text-xs tracking-wide shadow-2xl rounded-full">
                              ⭐ EXCLUSIVITÉ
                            </span>
                          )}
                        </div>

                        {/* Image Count */}
                        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm flex items-center space-x-2">
                          <CameraIcon className="w-4 h-4" />
                          <span>{property.images.length}</span>
                        </div>

                        {/* Quick View */}
                        <button className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 hover:bg-gold hover:text-gray-900">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Secondary Images */}
                      <div className="w-1/3 flex flex-col h-full">
                        <div className="h-1/2 relative overflow-hidden border-l-2 border-white">
                          <img
                            src={property.images[1]}
                            alt={property.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="h-1/2 relative overflow-hidden border-l-2 border-white border-t-2 border-white">
                          <img
                            src={property.images[2]}
                            alt={property.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-3/5 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <h3 className="text-3xl font-light text-gray-900 mb-3 group-hover:text-gold transition-colors duration-300">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-4">
                              <MapPinIcon className="w-5 h-5 mr-2 text-gold" />
                              <span className="text-lg font-serif">{property.location}</span>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <div className="text-4xl font-light text-gray-900 mb-2">
                              {formatPrice(property.price, property.type)}
                            </div>
                            <div className="text-sm text-gray-500 font-serif">
                              {property.type === 'buy' && 'Acquisition libre'}
                              {property.type === 'rent' && 'Location longue durée'}
                              {property.type === 'seasonal' && 'Location de prestige'}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg font-serif line-clamp-2">
                          {property.description}
                        </p>

                        {/* Property Features */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 group-hover:border-gold/30 transition-all duration-300">
                            <ArrowsPointingOutIcon className="w-8 h-8 text-gold mx-auto mb-3" />
                            <div className="font-semibold text-gray-900 text-xl">{property.surface} m²</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Surface</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 group-hover:border-gold/30 transition-all duration-300">
                            <HomeModernIcon className="w-8 h-8 text-gold mx-auto mb-3" />
                            <div className="font-semibold text-gray-900 text-xl">{property.bedrooms}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Chambres</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 group-hover:border-gold/30 transition-all duration-300">
                            <div className="w-8 h-8 text-gold mx-auto mb-3">🛁</div>
                            <div className="font-semibold text-gray-900 text-xl">{property.bathrooms}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">SDB</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 group-hover:border-gold/30 transition-all duration-300">
                            <div className="w-8 h-8 text-gold mx-auto mb-3">📅</div>
                            <div className="font-semibold text-gray-900 text-xl">{property.yearBuilt}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Construction</div>
                          </div>
                        </div>

                        {/* Key Features */}
                        {property.features && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {property.features.slice(0, 4).map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gold/10 text-gold rounded-full text-sm font-medium border border-gold/20"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                        <div className="flex items-center space-x-6">
                          <button 
                            onClick={() => toggleFavorite(property.id)}
                            className="flex items-center space-x-3 text-gray-600 hover:text-red-500 transition-all duration-300 group/fav"
                          >
                            <div className="p-2 rounded-full bg-gray-100 group-hover/fav:bg-red-50 transition-colors duration-300">
                              {favorites.includes(property.id) ? (
                                <HeartIconSolid className="w-6 h-6 text-red-500" />
                              ) : (
                                <HeartIcon className="w-6 h-6 group-hover/fav:text-red-500" />
                              )}
                            </div>
                            <span className="font-medium">Favoris</span>
                          </button>
                          
                          <span className={`px-4 py-2 text-sm font-semibold rounded-full border-2 ${
                            property.type === 'buy' 
                              ? 'bg-blue-50 text-blue-800 border-blue-200' 
                              : property.type === 'rent'
                              ? 'bg-green-50 text-green-800 border-green-200'
                              : 'bg-purple-50 text-purple-800 border-purple-200'
                          }`}>
                            {property.type === 'buy' && 'À VENDRE'}
                            {property.type === 'rent' && 'À LOUER'}
                            {property.type === 'seasonal' && 'SAISONNIER'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium border border-gray-300 px-6 py-3 rounded-lg hover:border-gray-400">
                            Plan de visite
                          </button>
                          <Link
                            to={`/properties/${property.id}`}
                            className="bg-gradient-to-r from-gray-900 to-deep-green text-white px-8 py-3 font-semibold hover:from-gold hover:to-amber-600 hover:text-gray-900 transition-all duration-500 transform hover:scale-105 flex items-center space-x-3 rounded-2xl shadow-lg hover:shadow-2xl"
                          >
                            <span>Explorer ce bien</span>
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200">
              <div className="text-9xl mb-8 opacity-10">🔍</div>
              <h3 className="text-4xl font-light text-gray-900 mb-6">
                Aucune propriété ne correspond à votre recherche
              </h3>
              <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
                Notre collection évolue constamment. Élargissez vos critères de recherche, 
                consultez notre sélection confidentielle ou contactez-nous pour une recherche personnalisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={resetFilters}
                  className="bg-gradient-to-r from-gray-900 to-deep-green text-white px-10 py-4 font-semibold hover:from-gold hover:to-amber-600 hover:text-gray-900 transition-all duration-500 transform hover:scale-105 rounded-2xl shadow-lg"
                >
                  Élargir la recherche
                </button>
                <Link
                  to="/confidential"
                  className="border-2 border-gray-900 text-gray-900 px-10 py-4 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-500 transform hover:scale-105 rounded-2xl"
                >
                  Accéder aux biens confidentiels
                </Link>
              </div>
            </div>
          )}

          {/* Load More */}
          {filteredProperties.length > 0 && (
            <div className="text-center mt-16">
              <button className="border-2 border-gray-900 text-gray-900 px-14 py-5 font-semibold hover:bg-gray-900 hover:text-white transition-all duration-500 transform hover:scale-105 group rounded-2xl text-lg">
                <span className="flex items-center space-x-4">
                  <span>Découvrir plus de trésors</span>
                  <span className="transform group-hover:translate-y-1 transition-transform duration-300 text-2xl">↓</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Add custom styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(-5deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(0deg); }
        }

        @keyframes float3 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Properties;