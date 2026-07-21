import React from 'react';
import {
  HomeIcon,
  CalendarIcon,
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  Squares2X2Icon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { tenantDashboardStats, tenantProperties, appointmentsData, messages, tenantDemands } from './data';

interface TenantOverviewProps {
  onNavigate: (tab: string) => void;
}

const TenantOverview: React.FC<TenantOverviewProps> = ({ onNavigate }) => {
  const activeDemands = tenantDemands.filter(d => d.status === 'Active');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {tenantDashboardStats.map((stat, i) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            emerald: 'from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600 border-emerald-200',
            blue: 'from-blue-500 to-blue-600 bg-blue-50 text-blue-600 border-blue-200',
            amber: 'from-amber-500 to-amber-600 bg-amber-50 text-amber-600 border-amber-200',
            purple: 'from-purple-500 to-purple-600 bg-purple-50 text-purple-600 border-purple-200',
            rose: 'from-rose-500 to-rose-600 bg-rose-50 text-rose-600 border-rose-200',
            red: 'from-red-500 to-red-600 bg-red-50 text-red-600 border-red-200',
          };
          const c = colorMap[stat.color || 'emerald'];
          return (
            <div key={i} className="bg-white border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-default">
              <div className="p-4">
                <div className={`w-9 h-9 flex items-center justify-center border ${c.split(' ').slice(2).join(' ')} mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <HomeIcon className="w-4 h-4 text-emerald-600" />
              Derniers biens proposés
            </h3>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1">
              {tenantProperties.filter(p => p.isNew).length} nouveaux
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {tenantProperties.slice(0, 2).map((p) => (
              <div key={p.id} className="px-5 py-4 hover:bg-gray-50/80 transition-colors group">
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    {p.isNew && (
                      <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">{p.title}</h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold border ${
                        (p.score || 0) >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                        (p.score || 0) >= 80 ? 'text-blue-600 bg-blue-50 border-blue-200' :
                        'text-amber-600 bg-amber-50 border-amber-200'
                      }`}>
                        <SparklesIcon className="w-3 h-3" />
                        {p.score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{p.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-emerald-700 font-bold text-sm">{p.price}</p>
                      <p className="text-[11px] text-gray-400">{p.surface} · {p.bedrooms} ch.</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5">
                        Correspondance : {p.score}%
                      </span>
                    </div>
                    <div className="flex gap-3 mt-1.5">
                      <button
                        onClick={() => onNavigate('properties')}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                      >
                        Voir
                      </button>
                      <button className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1">
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => onNavigate('properties')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 group"
            >
              Voir tous les biens proposés
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              Prochains rendez-vous
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              {appointmentsData.filter(a => a.status === 'Confirmé').length} confirmés
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {appointmentsData.map((appt) => (
              <div key={appt.id} className="px-5 py-4 hover:bg-gray-50/80 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center text-xs font-bold border flex-shrink-0 mt-0.5 ${
                      appt.status === 'Confirmé'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <div className="text-center leading-tight">
                        <div className="text-[11px]">{appt.date.split('/')[0]}</div>
                        <div className="text-[9px] opacity-70">{appt.date.split('/')[1]}</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{appt.time} - {appt.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{appt.location}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{appt.advisor}</p>
                      <div className="flex gap-2 mt-1.5">
                        {appt.status === 'Confirmé' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckIcon className="w-3 h-3" />
                            Confirmé
                          </span>
                        ) : (
                          <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                            Confirmer
                          </button>
                        )}
                        <button className="text-xs text-gray-400 hover:text-gray-600 font-medium">
                          Modifier
                        </button>
                        <button className="text-xs text-red-400 hover:text-red-600 font-medium">
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    appt.status === 'Confirmé'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => onNavigate('appointments')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 group"
            >
              Voir tous les rendez-vous
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Squares2X2Icon className="w-4 h-4 text-emerald-600" />
            Demandes actives
          </h3>
          <button
            onClick={() => onNavigate('demands')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Gérer mes demandes
          </button>
        </div>
        <div className="px-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeDemands.map((demand) => (
              <div key={demand.id} className="border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{demand.title}</h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{demand.priceRange}</p>
                <p className="text-xs text-gray-600">{demand.details}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    <span className="font-bold text-emerald-600">{demand.propositions}</span> biens proposés
                  </span>
                  <button className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                    Voir les biens
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <ChatBubbleLeftIcon className="w-4 h-4 text-emerald-600" />
            Derniers messages
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            {messages.filter(m => m.unread).length} non lus
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {messages.slice(0, 2).map((msg) => (
            <div key={msg.id} className="px-5 py-4 hover:bg-gray-50/80 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 flex items-center justify-center text-xs font-bold border flex-shrink-0 ${
                  msg.unread ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}>
                  {msg.sender.split(' ').map(s => s[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm ${msg.unread ? 'font-bold' : 'font-medium'} text-gray-900`}>
                      {msg.sender}
                    </h4>
                    {msg.unread && (
                      <span className="bg-emerald-500 text-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        Nouveau
                      </span>
                    )}
                    <span className="ml-auto text-xs text-gray-400 flex-shrink-0">il y a {msg.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{msg.role}</p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-1">{msg.content}</p>
                  <button className="mt-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                    Répondre
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => onNavigate('messages')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 group"
          >
            Voir tous les messages
            <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 shadow-sm px-5 py-4">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-800">Rappel important</h4>
            <p className="text-xs text-amber-700 mt-1">Document manquant : Justificatif de revenus (3 dernières fiches de paie)</p>
            <button className="mt-2 px-4 py-1.5 bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-all shadow-sm">
              Ajouter maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantOverview;
