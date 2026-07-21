import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  ArrowRightIcon,
  ChartBarIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { lessorDashboardStats, lessorRentalProperties, appointmentsData, messages, receivedDemands } from './data';

interface LessorOverviewProps {
  onNavigate: (tab: string) => void;
}

const LessorOverview: React.FC<LessorOverviewProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Vue d'ensemble</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 divide-x divide-gray-100">
          {lessorDashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="px-4 py-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <HomeIcon className="w-5 h-5 text-emerald-600" />
              Mes propriétés
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {lessorRentalProperties.map((property) => (
              <div key={property.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
                    Image
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{property.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{property.location}</span>
                        </div>
                      </div>
                      <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                        {property.status}
                      </span>
                    </div>
                    <p className="text-emerald-700 font-bold text-sm mt-1">{property.rentAmount}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{property.mandate} · J-{property.mandateDaysLeft}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onNavigate('properties')}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Voir
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                        Modifier
                      </button>
                      <button onClick={() => onNavigate('stats')} className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                        Stats
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100">
            <button
              onClick={() => onNavigate('properties')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              Voir toutes mes propriétés
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-emerald-600" />
              Performances
            </h3>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Taux d'occupation</h4>
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <ChartBarIcon className="w-3 h-3" />
                +5% vs mois dernier · 8 visites · 3 demandes
              </p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Revenus mensuels</h4>
              <p className="text-2xl font-bold text-gray-900">2 200 €</p>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <BanknotesIcon className="w-3 h-3" />
                +12% vs mois dernier
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ChatBubbleLeftIcon className="w-5 h-5 text-emerald-600" />
            Demandes reçues (récentes)
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {receivedDemands.slice(0, 2).map((demand) => (
            <div key={demand.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500">
                    {demand.type} - <span className="font-medium text-gray-900">{demand.property}</span>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">{demand.demandeur}</span> · {demand.date}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">"{demand.message}"</p>
                </div>
                <span className={`flex-shrink-0 px-2 py-1 text-xs font-semibold ${
                  demand.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {demand.status}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                  Répondre
                </button>
                <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                  Voir détails
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-gray-100">
          <button
            onClick={() => onNavigate('inquiries')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            Voir toutes les demandes
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-emerald-600" />
            Alertes baux
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="p-4 bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Bail à renouveler - Appartement Centre Ville
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Date d'échéance : 01/01/2026 (J-30)
                </p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs text-amber-700 hover:text-amber-800 font-medium underline">
                    Voir le bail
                  </button>
                  <button className="text-xs text-amber-700 hover:text-amber-800 font-medium underline">
                    Contacter l'agent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 border-t border-gray-100">
          <button
            onClick={() => onNavigate('leases')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            Voir tous les baux
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-emerald-600" />
            Derniers messages
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {messages.slice(0, 2).map((message) => (
            <div key={message.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                {message.unread && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                    <span className="text-xs text-gray-400">{message.role}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-1 mt-0.5">{message.content}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">il y a {message.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-gray-100">
          <button
            onClick={() => onNavigate('messages')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            Voir tous les messages
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessorOverview;
