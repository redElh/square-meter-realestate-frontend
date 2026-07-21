import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  HeartIcon,
  MapPinIcon,
  FunnelIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { buyerSavedProperties } from './data';

interface BuyerPropertiesProps {
  onViewProperty: (id: number) => void;
}

const BuyerProperties: React.FC<BuyerPropertiesProps> = ({ onViewProperty }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('saved');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    type: 'Appartement',
    transaction: 'Vente',
    priceMin: '',
    priceMax: '',
    surfaceMin: '',
    surfaceMax: '',
    pieces: '',
    chambres: '',
    amenities: [] as string[],
  });

  const amenities = ['Jardin', 'Piscine', 'Garage', 'Balcon', 'Terrasse'];

  const toggleAmenity = (amenity: string) => {
    setSearchFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 w-fit">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-5 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'search'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MagnifyingGlassIcon className="w-4 h-4 inline mr-2" />
          Recherche
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-5 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'saved'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <HeartIcon className="w-4 h-4 inline mr-2" />
          Sauvegardés ({buyerSavedProperties.length})
        </button>
      </div>

      {/* Search Panel */}
      {activeTab === 'search' && (
        <>
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-emerald-600" />
                Recherche avancée
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <input
                    type="text"
                    placeholder="Ville, quartier ou code postal..."
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors bg-white"
                    value={searchFilters.type}
                    onChange={(e) => setSearchFilters({ ...searchFilters, type: e.target.value })}
                  >
                    <option>Appartement</option>
                    <option>Maison</option>
                    <option>Villa</option>
                    <option>Chalet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction</label>
                  <select
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors bg-white"
                    value={searchFilters.transaction}
                    onChange={(e) => setSearchFilters({ ...searchFilters, transaction: e.target.value })}
                  >
                    <option>Vente</option>
                    <option>Location</option>
                    <option>Location saisonnière</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix min</label>
                  <input
                    type="text"
                    placeholder="Prix minimum"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                    value={searchFilters.priceMin}
                    onChange={(e) => setSearchFilters({ ...searchFilters, priceMin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix max</label>
                  <input
                    type="text"
                    placeholder="Prix maximum"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                    value={searchFilters.priceMax}
                    onChange={(e) => setSearchFilters({ ...searchFilters, priceMax: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surface</label>
                  <input
                    type="text"
                    placeholder="Surface (m²)"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                    value={searchFilters.surfaceMin}
                    onChange={(e) => setSearchFilters({ ...searchFilters, surfaceMin: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pièces</label>
                  <input
                    type="text"
                    placeholder="Nombre de pièces"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                    value={searchFilters.pieces}
                    onChange={(e) => setSearchFilters({ ...searchFilters, pieces: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                  <input
                    type="text"
                    placeholder="Nombre de chambres"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                    value={searchFilters.chambres}
                    onChange={(e) => setSearchFilters({ ...searchFilters, chambres: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Équipements</label>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchFilters.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  Rechercher
                </button>
                <button className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 transition-colors">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          {/* Results placeholder */}
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Résultats de recherche (12 biens)
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {buyerSavedProperties.map((property) => (
                <div key={property.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-32 h-24 bg-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                      Image
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{property.title}</h4>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                            <MapPinIcon className="w-3.5 h-3.5" />
                            {property.location}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {property.bedrooms} ch. · {property.bathrooms} sdb.
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-emerald-700 font-bold">{property.price}</p>
                          <p className="text-sm text-gray-500">{property.surface}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => onViewProperty(property.id)}
                          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Voir les détails
                        </button>
                        <button className="text-sm text-gray-400 hover:text-red-500 font-medium flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          Ajouter aux favoris
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Affichage 1-3 sur 12 biens</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-emerald-600 text-white text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">3</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Saved Properties */}
      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyerSavedProperties.map((property) => (
            <div key={property.id} className="bg-white border border-gray-200 overflow-hidden hover:border-emerald-600 transition-all">
              <div className="relative">
                <img src={property.image} alt={property.title} className="w-full h-44 object-cover" />
                <button className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white transition-colors">
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-700 font-bold">{property.price}</span>
                  <span className="text-sm text-gray-500">{property.surface}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {property.bedrooms} ch. · {property.bathrooms} sdb.
                </p>
                <button
                  onClick={() => onViewProperty(property.id)}
                  className="w-full border border-emerald-600 text-emerald-600 py-2 text-sm font-medium hover:bg-emerald-50 transition-colors"
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerProperties;
