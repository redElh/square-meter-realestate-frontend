import React, { useState } from 'react';
import {
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { lessorLeases } from './data';

const LessorLeases: React.FC = () => {
  const leaseStats = [
    { label: 'Total baux', value: String(lessorLeases.length), icon: DocumentTextIcon },
    { label: 'Actifs', value: String(lessorLeases.filter(l => l.status === 'Actif').length), icon: DocumentTextIcon },
    { label: 'À renouveler', value: String(lessorLeases.filter(l => l.status === 'À renouveler').length), icon: ExclamationTriangleIcon },
    { label: 'Terminés', value: String(lessorLeases.filter(l => l.status === 'Terminé').length), icon: DocumentTextIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Baux et contrats</h2>
        <p className="text-sm text-gray-500 mt-1">Gérez vos baux et contrats de location</p>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4 text-emerald-600" />
            Statut de vos baux
          </h3>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {leaseStats.map((stat, i) => {
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
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Liste des baux</h3>
        <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3.5 px-5 text-xs text-gray-500 font-bold uppercase tracking-wider">Bien</th>
                <th className="text-left py-3.5 px-5 text-xs text-gray-500 font-bold uppercase tracking-wider">Locataire</th>
                <th className="text-left py-3.5 px-5 text-xs text-gray-500 font-bold uppercase tracking-wider">Début</th>
                <th className="text-left py-3.5 px-5 text-xs text-gray-500 font-bold uppercase tracking-wider">Fin</th>
                <th className="text-left py-3.5 px-5 text-xs text-gray-500 font-bold uppercase tracking-wider">Loyer</th>
                <th className="text-left py-3.5 px-5 text-xs text-gray-500 font-bold uppercase tracking-wider">Statut</th>
                <th className="text-left py-3.5 px-5 text-xs text-gray-500 font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessorLeases.map((lease) => (
                <tr key={lease.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-medium text-gray-900">{lease.property}</div>
                  </td>
                  <td className="py-4 px-5 text-gray-700">{lease.tenant}</td>
                  <td className="py-4 px-5 text-gray-700">{lease.startDate}</td>
                  <td className="py-4 px-5 text-gray-700">{lease.endDate}</td>
                  <td className="py-4 px-5 text-gray-700">{lease.rent}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                      lease.status === 'Actif'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lease.status === 'À renouveler'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lease.status === 'À renouveler' && <ExclamationTriangleIcon className="w-3 h-3" />}
                      {lease.status}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors" title="Voir">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors" title="Télécharger">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Modifier">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Supprimer">
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

export default LessorLeases;
