import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarIcon,
  PlusIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { appointmentsData } from './data';

const SellerAppointments: React.FC = () => {
  const { t } = useTranslation();

  const apptStats = [
    { label: 'Total rendez-vous', value: String(appointmentsData.length), icon: CalendarIcon, color: 'text-gray-900' },
    { label: 'Confirmés', value: String(appointmentsData.filter(a => a.status === 'Confirmé').length), icon: CheckIcon, color: 'text-emerald-600' },
    { label: 'En attente', value: String(appointmentsData.filter(a => a.status === 'En attente').length), icon: ClockIcon, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{t('dashboard.appointments.title', '📅 Mes rendez-vous')}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{t('dashboard.appointments.subtitle', 'Gérez vos rendez-vous liés à vos propriétés')}</p>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t('dashboard.appointments.stats', '📊 Statistiques')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {apptStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-gray-200 shadow-sm">
                <div className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('dashboard.appointments.list', '📋 Liste des rendez-vous')}</h3>
          <button className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-2 hover:bg-emerald-700 transition-all shadow-sm">
            <PlusIcon className="w-4 h-4" />
            {t('dashboard.appointments.new', '+ Nouveau')}
          </button>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">{t('dashboard.appointments.colDate', 'Date')}</th>
                  <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">{t('dashboard.appointments.colType', 'Type')}</th>
                  <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">{t('dashboard.appointments.colProperty', 'Propriété')}</th>
                  <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">{t('dashboard.appointments.colAgent', 'Agent')}</th>
                  <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">{t('dashboard.appointments.colStatus', 'Statut')}</th>
                  <th className="text-left py-3.5 px-5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">{t('dashboard.appointments.colActions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsData.map((appt) => (
                  <tr key={appt.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 text-sm">{appt.date}</div>
                      <div className="text-xs text-gray-500">{appt.time}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1">{appt.type}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-sm text-gray-900 font-medium">{appt.propertyName || appt.title}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-sm text-gray-700">{appt.advisor}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                        appt.status === 'Confirmé'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appt.status === 'Confirmé' ? <CheckIcon className="w-3 h-3" /> : <ClockIcon className="w-3 h-3" />}
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 transition-all" title="Voir">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:bg-gray-100 transition-all" title="Modifier">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-400 hover:bg-red-50 transition-all" title="Annuler">
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
    </div>
  );
};

export default SellerAppointments;
