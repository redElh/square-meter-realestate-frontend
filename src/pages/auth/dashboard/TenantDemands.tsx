import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  HomeIcon,
  CheckIcon,
  SparklesIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { tenantDemands } from './data';

interface TenantDemandsProps {
  onNavigate: (tab: string) => void;
}

const TenantDemands: React.FC<TenantDemandsProps> = ({ onNavigate }) => {
  const [showNewDemand, setShowNewDemand] = useState(false);

  const demandStats = [
    { label: 'Total', value: tenantDemands.length, color: 'text-gray-900 bg-gray-50 border-gray-200' },
    { label: 'Actives', value: tenantDemands.filter(d => d.status === 'Active').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'En attente', value: tenantDemands.filter(d => d.status === 'En attente').length, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Terminées', value: tenantDemands.filter(d => d.status === 'Terminée').length, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  ];

  if (showNewDemand) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowNewDemand(false)}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            &larr; Retour
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Nouvelle demande de location</h2>
            <p className="text-sm text-gray-500">Définissez vos critères de recherche</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-emerald-600" />
                Localisation
              </h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ville / Région</label>
                  <select className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all">
                    <option>Lyon, Presqu'île</option>
                    <option>Villeurbanne</option>
                    <option>Paris, Île-de-France</option>
                    <option>Nice, Côte d'Azur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Secteur / Quartier</label>
                  <input type="text" placeholder="Centre, Bellecour, Brotteaux..." className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-emerald-600" />
                Type de bien
              </h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type de bien</label>
                <select className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all">
                  <option>Appartement</option>
                  <option>Maison</option>
                  <option>Studio</option>
                  <option>Loft</option>
                </select>
              </div>
              <div className="flex gap-4">
                {['Meublé', 'Non-meublé'].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="furnished" defaultChecked={t === 'Meublé'} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Caractéristiques</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Loyer min</label>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="800" className="flex-1 border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                    <span className="text-sm text-gray-500">€/mois</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Loyer max</label>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="1 200" className="flex-1 border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                    <span className="text-sm text-gray-500">€/mois</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Surface min</label>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="60" className="flex-1 border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                    <span className="text-sm text-gray-500">m²</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Surface max</label>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="80" className="flex-1 border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                    <span className="text-sm text-gray-500">m²</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pièces</label>
                  <input type="text" placeholder="3" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Chambres</label>
                  <input type="text" placeholder="2" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Salles de bain</label>
                  <input type="text" placeholder="1" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Étage</label>
                <div className="flex items-center gap-2">
                  <select className="border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all">
                    <option>&ge;</option>
                    <option>&le;</option>
                    <option>=</option>
                  </select>
                  <input type="text" placeholder="2" className="w-20 border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Critères spécifiques</h3>
            </div>
            <div className="px-5 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {['Ascenseur', 'Balcon', 'Cave', 'Parking', 'Terrasse', 'Jardin', 'Air conditionné', 'Cheminée', 'Fibre optique', 'Animaux acceptés'].map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer p-2 border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                    <input type="checkbox" className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-xs text-gray-700 font-medium">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                Disponibilité
              </h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date d'emménagement souhaitée</label>
                  <input type="date" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Urgence</label>
                  <select className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all">
                    <option>Immédiate</option>
                    <option>1 mois</option>
                    <option>3 mois</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Durée de location souhaitée</label>
                <select className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all">
                  <option>1 an</option>
                  <option>2 ans</option>
                  <option>3 ans</option>
                  <option>Indéterminée</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white border border-gray-200 shadow-sm px-5 py-4">
            <button
              onClick={() => setShowNewDemand(false)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              Enregistrer la demande
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Mes recherches (Demandes)</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gérez vos critères de recherche et suivez les propositions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {demandStats.map((stat, i) => (
          <div key={i} className={`bg-white border ${stat.color.split(' ').slice(2).join(' ')} shadow-sm`}>
            <div className="p-4">
              <div className={`text-2xl font-bold ${stat.color.split(' ')[0]}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowNewDemand(true)}
        className="w-full border-2 border-dashed border-gray-300 py-3.5 text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 font-medium"
      >
        <PlusIcon className="w-5 h-5" />
        Nouvelle demande
      </button>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">#</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Demande</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Biens proposés</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Statut</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenantDemands.map((demand) => (
                <tr key={demand.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-5">
                    <span className="text-xs font-bold text-gray-300">#{demand.id}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-semibold text-gray-900 text-sm">{demand.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{demand.priceRange}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{demand.details}</div>
                  </td>
                  <td className="py-4 px-5">
                    {demand.propositions > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        <SparklesIcon className="w-3 h-3" />
                        {demand.propositions} biens
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                      demand.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : demand.status === 'En attente'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        demand.status === 'Active' ? 'bg-emerald-500' : demand.status === 'En attente' ? 'bg-amber-500' : 'bg-gray-400'
                      }`} />
                      {demand.status}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="Voir">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Modifier">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Supprimer">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantDemands;
