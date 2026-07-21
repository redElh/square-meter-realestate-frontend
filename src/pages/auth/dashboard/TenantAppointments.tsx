import React, { useState } from 'react';
import {
  CalendarIcon,
  PlusIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { appointmentsData } from './data';

const TenantAppointments: React.FC = () => {
  const [showNewForm, setShowNewForm] = useState(false);

  const apptStats = [
    { label: 'Total rendez-vous', value: String(appointmentsData.length), icon: CalendarIcon, color: 'text-gray-900 bg-gray-50 border-gray-200' },
    { label: 'Confirmés', value: String(appointmentsData.filter(a => a.status === 'Confirmé').length), icon: CheckIcon, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'En attente', value: String(appointmentsData.filter(a => a.status === 'En attente').length), icon: ClockIcon, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  ];

  if (showNewForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setShowNewForm(false)} className="text-sm text-gray-500 hover:text-gray-700 font-medium">&larr; Retour</button>
          <h2 className="text-lg font-bold text-gray-900">Nouveau rendez-vous</h2>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Objet</label>
            <input type="text" placeholder="Ex: Visite appartement" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
              <input type="date" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Heure</label>
              <input type="time" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowNewForm(false)} className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all">Annuler</button>
            <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm">Confirmer le rendez-vous</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Mes rendez-vous</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gérez vos visites et rendez-vous</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {apptStats.map((stat, i) => {
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

      <button
        onClick={() => setShowNewForm(true)}
        className="w-full border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 font-medium"
      >
        <PlusIcon className="w-5 h-5" />
        Nouveau rendez-vous
      </button>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Date</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Type</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Bien / Sujet</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Agent</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Statut</th>
                <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsData.map((appt) => (
                <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="font-semibold text-gray-900 text-sm">{appt.date}</div>
                    <div className="text-xs text-gray-500">{appt.time}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1">{appt.type}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="text-sm text-gray-900 font-medium">{appt.propertyName || appt.title}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPinIcon className="w-3 h-3" />
                      {appt.location}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-sm text-gray-700">{appt.advisor}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                      appt.status === 'Confirmé'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {appt.status === 'Confirmé' ? <CheckIcon className="w-3 h-3" /> : <ClockIcon className="w-3 h-3" />}
                      {appt.status}
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
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Annuler">
                        <XMarkIcon className="w-4 h-4" />
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

export default TenantAppointments;
