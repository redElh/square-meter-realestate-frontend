import React from 'react';
import {
  MapPinIcon,
  HeartIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
  CurrencyEuroIcon,
  HomeIcon,
  ArrowLeftIcon,
  CheckIcon,
  SparklesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Property } from './types';

interface PropertyDetailViewProps {
  property: Property;
  onBack: () => void;
}

const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property, onBack }) => {
  const financialInfo = [
    { label: 'Prix', value: property.price },
    { label: 'Frais de notaire (est.)', value: '175 000 €' },
    { label: 'Honoraires', value: 'Inclus' },
  ];

  const characteristics = [
    { label: 'Surface', value: property.surface },
    { label: 'Pièces', value: String(property.bedrooms + 1) },
    { label: 'Chambres', value: String(property.bedrooms) },
    { label: 'Salles de bain', value: String(property.bathrooms) },
    { label: 'Terrain', value: property.landSize || '-' },
    { label: 'Construction', value: String(property.yearBuilt || '-') },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Retour à la liste
      </button>

      {/* Header */}
      <div className="bg-white border border-gray-200 shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{property.title}</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <MapPinIcon className="w-4 h-4 text-emerald-600" />
              {property.location}
            </div>
          </div>
          {property.score && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 flex-shrink-0">
              <SparklesIcon className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">{property.score}% de correspondance</span>
            </div>
          )}
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Photos</h3>
          <button className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">Voir tout</button>
        </div>
        <div className="px-6 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['Vue extérieure', 'Salon', 'Cuisine', 'Jardin', 'Piscine'].map((label, i) => (
              <div key={i} className="w-44 h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium flex-shrink-0 border border-gray-200">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Info */}
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <CurrencyEuroIcon className="w-4 h-4 text-emerald-600" />
              Informations financières
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-1">
              {financialInfo.map((info, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{info.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{info.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5 transition-colors">
              <HomeIcon className="w-4 h-4" />
              Simuler un prêt
            </button>
          </div>
        </div>

        {/* Characteristics */}
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4 text-emerald-600" />
              Caractéristiques
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {characteristics.map((char, i) => (
                <div key={i} className="py-1">
                  <span className="text-[11px] text-gray-500 block uppercase tracking-wider">{char.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{char.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <InformationCircleIcon className="w-4 h-4 text-emerald-600" />
            Description
          </h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            {property.description || 'Superbe villa méditerranéenne située à Nice, offrant une vue panoramique sur la mer. Cette propriété d\'exception dispose de 6 chambres, 5 salles de bain, un jardin paysager et une piscine à débordement.'}
          </p>
        </div>
      </div>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Prestations et critères</h3>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  <CheckIcon className="w-3.5 h-3.5" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-emerald-600" />
            Localisation sur la carte
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="h-48 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
            <MapPinIcon className="w-6 h-6 mr-2" />
            Carte interactive
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2">
              <HeartIcon className="w-4 h-4" />
              Ajouter aux favoris
            </button>
            <button className="px-5 py-2.5 border border-emerald-600 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Demander une visite
            </button>
            <button className="px-5 py-2.5 border border-emerald-600 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              Contacter l'agent
            </button>
            <button className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 transition-all flex items-center gap-2">
              <InformationCircleIcon className="w-4 h-4" />
              Plus d'informations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
