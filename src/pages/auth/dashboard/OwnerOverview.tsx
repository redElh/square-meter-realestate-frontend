import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  HeartIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { ownerProperties, ownerStats, appointmentsData, messages, receivedDemands } from './data';

interface OwnerOverviewProps {
  onNavigate: (tab: string) => void;
}

const OwnerOverview: React.FC<OwnerOverviewProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Vue d'ensemble</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {ownerStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="px-6 py-5">
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

      {/* My Properties + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Properties */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <HomeIcon className="w-5 h-5 text-emerald-600" />
              Mes propriétés
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {ownerProperties.map((property) => (
              <div key={property.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-20 h-20 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{property.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{property.location}</span>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-semibold ${
                        property.status === 'En vente' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    <p className="text-emerald-700 font-bold text-sm mt-1">{property.price}</p>
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
                      <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                        Statistiques
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

        {/* Performance */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600" />
                Performances
              </h3>
            </div>
            <div className="px-6 py-5">
              <div className="p-4 bg-gray-50 border border-gray-100 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Visites ce mois</h4>
                <p className="text-2xl font-bold text-gray-900">8 visites · 3 demandes</p>
                <p className="text-xs text-gray-500 mt-1">Taux de conversion : 37%</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Revenus mensuels</h4>
                <p className="text-2xl font-bold text-gray-900">2 200 €</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowTrendingUpIcon className="w-3 h-3" />
                  +12% vs mois dernier
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Demands */}
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

      {/* Upcoming Appointments */}
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            Prochains rendez-vous
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {appointmentsData.map((appt) => (
            <div key={appt.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {appt.date} {appt.time} - {appt.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{appt.location}</p>
                  <p className="text-xs text-gray-500">{appt.advisor}</p>
                </div>
                <span className={`flex-shrink-0 px-2 py-1 text-xs font-semibold ${
                  appt.status === 'Confirmé'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appt.status}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                {appt.status === 'Confirmé' ? (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckIcon className="w-3 h-3" />
                    Confirmé
                  </span>
                ) : (
                  <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                    Confirmer
                  </button>
                )}
                <button className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1">
                  <PencilIcon className="w-3 h-3" />
                  Modifier
                </button>
                <button className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                  <XMarkIcon className="w-3 h-3" />
                  Annuler
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-gray-100">
          <button
            onClick={() => onNavigate('appointments')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            Voir tous les rendez-vous
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Unread Messages */}
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-emerald-600" />
            Messages non lus
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {messages.filter(m => m.unread).slice(0, 2).map((message) => (
            <div key={message.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                  <p className="text-sm text-gray-700 line-clamp-1">{message.content}</p>
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

export default OwnerOverview;
