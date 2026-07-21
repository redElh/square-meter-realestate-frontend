import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  EyeIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { receivedDemands } from './data';

const LessorDemands: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState('Toutes les propriétés');
  const [filterStatus, setFilterStatus] = useState('Tous les statuts');
  const [filterDate, setFilterDate] = useState('Toutes les dates');

  const filteredDemands = receivedDemands.filter(d =>
    d.demandeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Demandes reçues</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez les demandes de location sur vos biens</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-emerald-600" />
            Recherche et filtres
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par demandeur, bien..."
                className="w-full border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 bg-white"
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
            >
              <option>Toutes les propriétés</option>
              <option>Ma Villa Méditerranéenne</option>
              <option>Appartement Centre Ville</option>
            </select>
            <select
              className="border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>Tous les statuts</option>
              <option>En attente</option>
              <option>Traité</option>
            </select>
            <select
              className="border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 bg-white"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option>Toutes les dates</option>
              <option>Aujourd'hui</option>
              <option>Cette semaine</option>
              <option>Ce mois</option>
            </select>
            <button className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
              Appliquer
            </button>
            <button className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 transition-colors">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Liste des demandes</h3>
          <button className="text-sm text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">#</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Demandeur</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Bien</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Statut</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemands.map((demand) => (
                <tr key={demand.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-900 font-medium">{demand.id}</td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{demand.demandeur}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-1">"{demand.message}"</div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{demand.property}</td>
                  <td className="py-4 px-4 text-gray-700">{demand.type}</td>
                  <td className="py-4 px-4 text-gray-700">{demand.date}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium ${
                      demand.status === 'En attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {demand.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-xs font-medium">
                        <EnvelopeIcon className="w-3.5 h-3.5" />
                        Répondre
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-xs font-medium">
                        <EyeIcon className="w-3.5 h-3.5" />
                        Voir
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

export default LessorDemands;
