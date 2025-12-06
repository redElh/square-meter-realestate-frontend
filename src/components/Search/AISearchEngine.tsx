import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  MapPinIcon,
  HomeIcon,
  CurrencyEuroIcon,
  Square3Stack3DIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface SearchFilters {
  query: string;
  location: string;
  priceMin: string;
  priceMax: string;
  propertyType: string;
  bedrooms: string;
  surface: string;
  amenities: string[];
}

interface PropertyResult {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  surface: number;
  image: string;
  features: string[];
  matchScore: number;
}

const AISearchEngine: React.FC = () => {
  const [naturalQuery, setNaturalQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    priceMin: '',
    priceMax: '',
    propertyType: '',
    bedrooms: '',
    surface: '',
    amenities: []
  });
  const [searchResults, setSearchResults] = useState<PropertyResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const amenitiesList = [
    '🏊 Piscine',
    '🌊 Vue mer',
    '🅿️ Parking',
    '🏡 Jardin',
    '🌅 Terrasse',
    '🛗 Ascenseur',
    '🔒 Sécurité',
    '♿ Accessible',
    '🐕 Animaux OK'
  ];

  // AI-powered search suggestions
  useEffect(() => {
    if (naturalQuery.length > 3) {
      const timer = setTimeout(() => {
        generateAISuggestions(naturalQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [naturalQuery]);

  const generateAISuggestions = (query: string) => {
    const lower = query.toLowerCase();
    const suggestions: string[] = [];

    if (lower.includes('famille')) {
      suggestions.push('Maison 4 chambres avec jardin');
      suggestions.push('Quartier familial avec écoles');
    }
    if (lower.includes('investissement')) {
      suggestions.push('Studio bien situé rendement 5%');
      suggestions.push('T2 centre-ville forte demande');
    }
    if (lower.includes('mer') || lower.includes('plage')) {
      suggestions.push('Vue mer panoramique');
      suggestions.push('À 5 min à pied de la plage');
    }
    if (lower.includes('luxe') || lower.includes('prestige')) {
      suggestions.push('Villa d\'exception avec piscine');
      suggestions.push('Penthouse dernier étage');
    }

    setAiSuggestions(suggestions);
  };

  const parseNaturalLanguage = (query: string): Partial<SearchFilters> => {
    const parsed: Partial<SearchFilters> = {};
    const lower = query.toLowerCase();

    // Extract location
    const cities = ['paris', 'nice', 'lyon', 'marseille', 'bordeaux', 'cannes', 'monaco'];
    cities.forEach(city => {
      if (lower.includes(city)) {
        parsed.location = city.charAt(0).toUpperCase() + city.slice(1);
      }
    });

    // Extract property type
    if (lower.includes('appartement') || lower.includes('appart')) {
      parsed.propertyType = 'appartement';
    } else if (lower.includes('maison') || lower.includes('villa')) {
      parsed.propertyType = 'maison';
    } else if (lower.includes('studio')) {
      parsed.propertyType = 'studio';
    }

    // Extract bedrooms
    const bedroomMatch = lower.match(/(\d+)\s*(?:chambre|pièce|bedroom)/);
    if (bedroomMatch) {
      parsed.bedrooms = bedroomMatch[1];
    }

    // Extract budget
    const budgetMatch = lower.match(/(\d+)\s*(?:k|mille|000)/);
    if (budgetMatch) {
      const amount = budgetMatch[1];
      parsed.priceMax = amount.includes('k') ? amount : `${amount}000`;
    }

    // Extract amenities
    const detectedAmenities: string[] = [];
    if (lower.includes('piscine')) detectedAmenities.push('🏊 Piscine');
    if (lower.includes('vue mer') || lower.includes('mer')) detectedAmenities.push('🌊 Vue mer');
    if (lower.includes('parking') || lower.includes('garage')) detectedAmenities.push('🅿️ Parking');
    if (lower.includes('jardin')) detectedAmenities.push('🏡 Jardin');
    if (lower.includes('terrasse') || lower.includes('balcon')) detectedAmenities.push('🌅 Terrasse');
    
    if (detectedAmenities.length > 0) {
      parsed.amenities = detectedAmenities;
    }

    return parsed;
  };

  const handleNaturalSearch = () => {
    const parsed = parseNaturalLanguage(naturalQuery);
    setFilters(prev => ({ ...prev, ...parsed, query: naturalQuery }));
    performSearch({ ...filters, ...parsed, query: naturalQuery });
  };

  const performSearch = async (searchFilters: SearchFilters) => {
    setIsSearching(true);
    
    // Simulate AI search
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock results with match scores
    const mockResults: PropertyResult[] = [
      {
        id: '1',
        title: 'Magnifique Appartement Vue Mer',
        location: 'Nice, Promenade des Anglais',
        price: '750 000 €',
        bedrooms: 3,
        surface: 120,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        features: ['🌊 Vue mer', '🅿️ Parking', '🌅 Terrasse'],
        matchScore: 95
      },
      {
        id: '2',
        title: 'Villa Moderne avec Piscine',
        location: 'Cannes, Californie',
        price: '1 200 000 €',
        bedrooms: 4,
        surface: 180,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
        features: ['🏊 Piscine', '🏡 Jardin', '🔒 Sécurité'],
        matchScore: 88
      },
      {
        id: '3',
        title: 'Penthouse Luxueux Centre-Ville',
        location: 'Monaco, Monte-Carlo',
        price: '2 500 000 €',
        bedrooms: 3,
        surface: 150,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
        features: ['🌊 Vue mer', '🛗 Ascenseur', '🌅 Terrasse'],
        matchScore: 82
      },
      {
        id: '4',
        title: 'Charmant T3 Quartier Prisé',
        location: 'Nice, Carré d\'Or',
        price: '450 000 €',
        bedrooms: 2,
        surface: 85,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        features: ['🅿️ Parking', '♿ Accessible', '🛗 Ascenseur'],
        matchScore: 76
      }
    ];

    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="w-full">
      {/* AI Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 mb-6 border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recherche Intelligente IA</h2>
            <p className="text-sm text-gray-600">Décris ce que tu cherches en langage naturel</p>
          </div>
        </div>

        {/* Natural Language Search */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNaturalSearch()}
                placeholder="Ex: Appartement 3 chambres Nice vue mer budget 500k avec piscine..."
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNaturalSearch}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg flex items-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              Chercher
            </motion.button>
          </div>

          {/* AI Suggestions Dropdown */}
          <AnimatePresence>
            {aiSuggestions.length > 0 && naturalQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10"
              >
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-3 py-2">💡 Suggestions IA</p>
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setNaturalQuery(suggestion);
                        setAiSuggestions([]);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-amber-50 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Advanced Filters */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-4 text-amber-600 text-sm font-medium flex items-center gap-2 hover:text-amber-700 transition-colors"
        >
          <FunnelIcon className="w-4 h-4" />
          {showAdvanced ? 'Masquer' : 'Afficher'} les filtres avancés
        </button>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="w-4 h-4 inline mr-1" />
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    placeholder="Ville, quartier..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <HomeIcon className="w-4 h-4 inline mr-1" />
                    Type de bien
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Tous types</option>
                    <option value="appartement">Appartement</option>
                    <option value="maison">Maison / Villa</option>
                    <option value="studio">Studio</option>
                    <option value="loft">Loft</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CurrencyEuroIcon className="w-4 h-4 inline mr-1" />
                    Prix minimum
                  </label>
                  <input
                    type="text"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                    placeholder="200 000 €"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CurrencyEuroIcon className="w-4 h-4 inline mr-1" />
                    Prix maximum
                  </label>
                  <input
                    type="text"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                    placeholder="500 000 €"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chambres
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Indifférent</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Surface */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Square3Stack3DIcon className="w-4 h-4 inline mr-1" />
                    Surface minimum (m²)
                  </label>
                  <input
                    type="text"
                    value={filters.surface}
                    onChange={(e) => setFilters({ ...filters, surface: e.target.value })}
                    placeholder="80 m²"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Équipements & Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filters.amenities.includes(amenity)
                          ? 'bg-amber-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {amenity}
                      {filters.amenities.includes(amenity) && (
                        <CheckIcon className="w-4 h-4 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => performSearch(filters)}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
              >
                Appliquer les filtres
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {isSearching && (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="inline-block"
            >
              <SparklesIcon className="w-12 h-12 text-amber-600" />
            </motion.div>
            <p className="mt-4 text-gray-600">L'IA analyse des milliers de propriétés...</p>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {searchResults.length} résultats trouvés
              </h3>
              <span className="text-sm text-gray-600">
                Triés par pertinence IA
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100 group"
                >
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3" />
                      {property.matchScore}% Match
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">{property.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <span>{property.bedrooms} chambres</span>
                      <span>•</span>
                      <span>{property.surface} m²</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-2xl font-bold text-amber-600">{property.price}</span>
                      <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                        Voir détails
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AISearchEngine;
