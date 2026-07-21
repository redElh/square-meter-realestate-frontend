import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { ownerDocuments } from './data';

const OwnerDocuments: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Toutes les catégories');
  const [filterProperty, setFilterProperty] = useState('Toutes les propriétés');
  const [filterDate, setFilterDate] = useState('Toutes les dates');

  const docStats = [
    { label: 'Total documents', value: '6', icon: DocumentTextIcon },
    { label: 'Diagnostics', value: '3', icon: DocumentTextIcon },
    { label: 'Contrats', value: '2', icon: DocumentTextIcon },
    { label: 'Titres de propriété', value: '1', icon: DocumentTextIcon },
  ];

  const filteredDocs = ownerDocuments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Documents</h2>
        <p className="text-sm text-gray-500 mt-1">Gérez vos documents administratifs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {docStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 px-5 py-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50">
                  <Icon className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
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
                placeholder="Rechercher par nom de document..."
                className="w-full border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-600 bg-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option>Toutes les catégories</option>
              <option>Diagnostic</option>
              <option>Contrat</option>
              <option>Titre de propriété</option>
            </select>
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
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option>Toutes les dates</option>
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

      {/* Documents List */}
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Liste des documents</h3>
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Ajouter un document
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Nom</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Catégorie</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Propriété</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 font-medium">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{doc.property}</td>
                  <td className="py-4 px-4 text-gray-700">{doc.date}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors">
                        <ArrowUpTrayIcon className="w-4 h-4" />
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

export default OwnerDocuments;
