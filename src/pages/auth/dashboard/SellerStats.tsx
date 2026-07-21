import React from 'react';
import { ChartBarIcon, EyeIcon, EnvelopeIcon, BanknotesIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { statsPerProperty, ownerProperties } from './data';
import type { SellerStat, StatsPerProperty } from './types';

const globalStats: (SellerStat & { trend?: string; trendUp?: boolean })[] = [
  { label: 'Visites totales', value: '45', icon: EyeIcon, trend: '+15%', trendUp: true },
  { label: 'Demandes totales', value: '18', icon: EnvelopeIcon, trend: '+12%', trendUp: true },
  { label: 'Taux de conversion', value: '40%', icon: ChartBarIcon, trend: '+5%', trendUp: true },
  { label: 'Revenus mensuels', value: '2 200 €', icon: BanknotesIcon, trend: '+12%', trendUp: true },
];

const visitEvolution = [
  { month: 'Jan', value: 4 },
  { month: 'Fév', value: 6 },
  { month: 'Mar', value: 8 },
  { month: 'Avr', value: 10 },
  { month: 'Mai', value: 7 },
  { month: 'Juin', value: 12 },
];

const maxVisitValue = Math.max(...visitEvolution.map(v => v.value));

const SellerStats: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ChartBarIcon className="w-6 h-6 text-emerald-600" />
          Statistiques
        </h2>
        <p className="text-sm text-gray-500 mt-1">Analysez la performance de vos biens</p>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-emerald-600" />
            Performance globale
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="px-6 py-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-50">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
                {stat.trend && (
                  <div className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${stat.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                    <ArrowTrendingUpIcon className={`w-3 h-3 ${stat.trendUp ? '' : 'rotate-180'}`} />
                    {stat.trend}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-emerald-600" />
            Évolution des visites (6 derniers mois)
          </h3>
        </div>
        <div className="px-6 py-5 space-y-3">
          {visitEvolution.map((item) => (
            <div key={item.month} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 w-8">{item.month}</span>
              <div className="flex-1 bg-gray-100 h-6">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                  style={{ width: `${(item.value / maxVisitValue) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8 text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-emerald-600" />
            Performance par propriété
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Propriété</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visites</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Demandes</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Taux conv.</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {statsPerProperty.map((prop, index) => (
                <tr key={prop.name} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{prop.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prop.visits}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prop.demands}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prop.conversion}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{prop.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerStats;
