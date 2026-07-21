import React, { useState } from 'react';
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  EyeIcon,
  SparklesIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { tenantProperties, tenantDemands } from './data';

interface TenantCrossingsProps {
  onViewProperty: (id: number) => void;
}

const TenantCrossings: React.FC<TenantCrossingsProps> = ({ onViewProperty }) => {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [activeDemandFilter, setActiveDemandFilter] = useState('Tous');
  const [savedIds, setSavedIds] = useState<number[]>([1]);
  const [currentPage, setCurrentPage] = useState(1);

  const filters = ['Tous', 'Nouveaux', 'Score', 'Loyer', 'Surface'];
  const demandOptions = ['Tous', ...Array.from(new Set(tenantProperties.map(p => p.demandLabel).filter(Boolean)))];

  const toggleSaved = (id: number) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Biens proposés</h2>
        <p className="text-sm text-gray-500 mt-0.5">Biens correspondant à vos critères de recherche</p>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-emerald-600" />
            Recherche et filtres
          </h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium mr-1">Filtres rapides :</span>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  activeFilter === f
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <select
              className="border border-gray-200 px-3 py-1.5 text-xs bg-white text-gray-600 focus:outline-none focus:border-emerald-500"
              value={activeDemandFilter}
              onChange={(e) => setActiveDemandFilter(e.target.value)}
            >
              {demandOptions.map((opt) => (
                <option key={opt} value={opt}>{opt === 'Tous' ? 'Toutes les demandes' : opt}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1.5">
              <MagnifyingGlassIcon className="w-3.5 h-3.5" />
              Appliquer les filtres
            </button>
            <button className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-medium hover:border-gray-300 transition-all">
              Réinitialiser
            </button>
            <span className="text-xs text-gray-400 ml-auto">{tenantProperties.length} biens proposés</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tenantProperties.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex">
              <div className="w-12 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-100 py-3">
                <div className={`flex items-center gap-1 px-2 py-1 text-xs font-bold ${
                  (p.score || 0) >= 90
                    ? 'bg-emerald-500 text-white'
                    : (p.score || 0) >= 80
                    ? 'bg-blue-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  <SparklesIcon className="w-3 h-3" />
                  {p.score}%
                </div>
                <span className="text-[10px] text-gray-400 mt-1 font-medium uppercase">Score</span>
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">{p.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{p.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSaved(p.id)}
                    className={`flex-shrink-0 p-1.5 transition-all ${
                      savedIds.includes(p.id)
                        ? 'text-red-500 bg-red-50'
                        : 'text-gray-300 hover:text-red-400 hover:bg-red-50/50'
                    }`}
                  >
                    {savedIds.includes(p.id) ? (
                      <HeartIconSolid className="w-4 h-4" />
                    ) : (
                      <HeartIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-emerald-700 font-bold text-sm">{p.price}</p>
                  <p className="text-xs text-gray-500">{p.surface}</p>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{p.bedrooms} ch. · {p.bathrooms} sdb.</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5">
                    Correspondance : {p.score}%
                  </span>
                  {p.isNew && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 uppercase tracking-wider">
                      Nouveau
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => onViewProperty(p.id)}
                    className="flex-1 px-3 py-1.5 border border-emerald-600 text-emerald-600 text-xs font-semibold hover:bg-emerald-50 transition-all flex items-center justify-center gap-1"
                  >
                    <EyeIcon className="w-3.5 h-3.5" />
                    Voir détails
                  </button>
                  <button className="flex-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-1 shadow-sm">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    Visite
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between bg-white border border-gray-200 shadow-sm px-5 py-3">
        <span className="text-xs text-gray-500">Affichage 1-{tenantProperties.length} sur {tenantProperties.length} biens</span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          {[1, 2].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 text-xs font-medium transition-all ${
                currentPage === page
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-1.5 border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantCrossings;
