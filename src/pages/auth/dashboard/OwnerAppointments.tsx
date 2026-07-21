import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarIcon,
  PlusIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { appointmentsData } from './data';

const OwnerAppointments: React.FC = () => {
  const { t } = useTranslation();

  const apptStats = [
    { label: 'Total rendez-vous', value: '5', icon: CalendarIcon },
    { label: 'Confirmés', value: '3', icon: CheckIcon },
    { label: 'En attente', value: '2', icon: ClockIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Rendez-vous</h2>
        <p className="text-sm text-gray-500 mt-1">Gérez vos rendez-vous liés à vos propriétés</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {apptStats.map((stat, i) => {
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

      {/* Appointments List */}
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Liste des rendez-vous</h3>
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Nouveau rendez-vous
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Propriété</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Agent</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Statut</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsData.map((appt) => (
                <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{appt.date}</div>
                    <div className="text-xs text-gray-500">{appt.time}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{appt.type || appt.title.split(' - ')[0]}</td>
                  <td className="py-4 px-4 text-gray-700">
                    {appt.title.includes('Cannes') ? 'Villa moderne à Cannes' : 'Agence Square Meter'}
                  </td>
                  <td className="py-4 px-4 text-gray-700">{appt.advisor}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${
                      appt.status === 'Confirmé'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appt.status === 'Confirmé' ? (
                        <CheckIcon className="w-3 h-3" />
                      ) : (
                        <ClockIcon className="w-3 h-3" />
                      )}
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors" title="Modifier">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Annuler">
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

export default OwnerAppointments;
