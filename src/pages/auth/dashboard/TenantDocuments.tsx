import React from 'react';
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { tenantDocuments } from './data';

const TenantDocuments: React.FC = () => {
  const docStats = [
    { label: 'Vérifiés', value: tenantDocuments.filter(d => d.statusType === 'verified' || d.statusType === 'signed').length, icon: CheckCircleIcon, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'En attente', value: tenantDocuments.filter(d => d.statusType === 'pending').length, icon: ClockIcon, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Manquants', value: tenantDocuments.filter(d => d.statusType === 'missing').length, icon: ExclamationCircleIcon, color: 'text-red-600 bg-red-50 border-red-200' },
  ];

  const statusConfig: Record<string, { icon: React.ReactNode; class: string }> = {
    verified: {
      icon: <CheckCircleIcon className="w-4 h-4" />,
      class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    signed: {
      icon: <CheckCircleIcon className="w-4 h-4" />,
      class: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    pending: {
      icon: <ClockIcon className="w-4 h-4" />,
      class: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    missing: {
      icon: <ExclamationCircleIcon className="w-4 h-4" />,
      class: 'bg-red-50 text-red-700 border-red-200',
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Mes documents</h2>
        <p className="text-sm text-gray-500 mt-0.5">Gérez vos documents personnels et administratifs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {docStats.map((stat, i) => {
          const Icon = stat.icon;
          const colorClass = stat.color;
          return (
            <div key={i} className={`bg-white border ${colorClass.split(' ').slice(2).join(' ')} shadow-sm`}>
              <div className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center ${colorClass.split(' ').slice(1, 3).join(' ')}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Liste des documents</h3>
          <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1.5">
            <ArrowUpTrayIcon className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {tenantDocuments.map((doc) => {
            const config = statusConfig[doc.statusType];
            return (
              <div key={doc.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900">{doc.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{doc.date}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border ${config.class}`}>
                      {config.icon}
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="Voir">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all" title="Télécharger">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    {doc.statusType === 'missing' && (
                      <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 transition-all" title="Ajouter">
                        <ArrowUpTrayIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TenantDocuments;
