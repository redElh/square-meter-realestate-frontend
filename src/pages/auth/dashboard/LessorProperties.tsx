import React from 'react';
import {
  HomeIcon,
  MapPinIcon,
  PlusIcon,
  EyeIcon,
  ChartBarIcon,
  TrashIcon,
  DocumentTextIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { lessorRentalProperties } from './data';

interface LessorPropertiesProps {
  onViewProperty?: (id: number) => void;
}

const LessorProperties: React.FC<LessorPropertiesProps> = ({ onViewProperty }) => {
  const totalStats = [
    { label: 'Total', value: String(lessorRentalProperties.length), icon: HomeIcon },
    { label: 'En location', value: String(lessorRentalProperties.filter(p => p.status === 'En location').length), icon: HomeIcon },
    { label: 'En attente', value: '0', icon: HomeIcon },
    { label: 'Terminées', value: '0', icon: HomeIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HomeIcon className="w-6 h-6 text-emerald-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mes propriétés (location)</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez vos biens en location</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Statut de vos propriétés</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {totalStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="px-6 py-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <button className="w-full border-2 border-dashed border-gray-300 py-4 text-sm text-gray-500 hover:border-emerald-600 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
        <PlusIcon className="w-5 h-5" />
        Ajouter une propriété
      </button>

      <div className="space-y-4">
        {lessorRentalProperties.map((property) => (
          <div key={property.id} className="bg-white border border-gray-200 hover:border-emerald-600 transition-all">
            <div className="flex flex-col sm:flex-row gap-4 p-5">
              <div className="w-full sm:w-32 h-28 bg-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                Image
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{property.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      {property.location}
                    </div>
                  </div>
                  <span className={`flex-shrink-0 px-3 py-1 text-xs font-semibold bg-green-100 text-green-800`}>
                    {property.status}
                  </span>
                </div>
                <p className="text-emerald-700 font-bold text-sm">{property.rentAmount}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{property.surface}</span>
                  <span>·</span>
                  <span>{property.bedrooms} ch.</span>
                  <span>·</span>
                  <span>{property.bathrooms} sdb.</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                  <span>Réf : {property.reference}</span>
                  <span>Taux occupation : {property.occupancyRate}%</span>
                  <span>Mandat : {property.mandate}</span>
                  <span>{property.inquiries} demandes</span>
                  {property.tenant && <span>Locataire : {property.tenant}</span>}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => onViewProperty?.(property.id)}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <EyeIcon className="w-3.5 h-3.5" />
                    Voir
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium hover:border-gray-400 transition-colors">
                    Modifier
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium hover:border-emerald-600 transition-colors flex items-center gap-1">
                    <ChartBarIcon className="w-3.5 h-3.5" />
                    Stats
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium hover:border-emerald-600 transition-colors flex items-center gap-1">
                    <DocumentTextIcon className="w-3.5 h-3.5" />
                    Bail
                  </button>
                  <button className="px-3 py-1.5 border border-red-300 text-red-500 text-xs font-medium hover:border-red-500 transition-colors flex items-center gap-1">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessorProperties;
