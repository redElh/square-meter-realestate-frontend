import React from 'react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  MapPinIcon,
  PencilIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
  CalendarIcon,
  EnvelopeIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BoltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Property } from './types';

interface SellerPropertyDetailProps {
  property: Property;
  onBack: () => void;
}

const SellerPropertyDetail: React.FC<SellerPropertyDetailProps> = ({ property, onBack }) => {
  const conversionRate = property.visitsThisMonth && property.visitsThisMonth > 0
    ? Math.round(((property.inquiries || 0) / property.visitsThisMonth) * 100)
    : 0;

  const infoRows = [
    { label: 'Référence', value: property.reference || 'N/A' },
    { label: 'Statut', value: property.status || 'N/A' },
    { label: 'Prix', value: property.price },
    { label: 'Mandat', value: property.mandate || 'N/A' },
    { label: 'Date mise en vente', value: '01/03/2026' },
    { label: 'Date expiration', value: '01/03/2027' },
  ];

  const detailsRows = [
    { label: 'Type', value: property.type === 'buy' ? 'Vente' : property.type === 'rent' ? 'Location' : property.type === 'seasonal' ? 'Saisonnier' : property.type === 'program' ? 'Programme' : 'N/A' },
    { label: 'Surface', value: property.surface },
    { label: 'Pièces', value: String((property.bedrooms || 0) + 1) },
    { label: 'Chambres', value: String(property.bedrooms || 0) },
    { label: 'SDB', value: String(property.bathrooms) },
    { label: 'Terrain', value: property.landSize || '-' },
    { label: 'Construction', value: property.yearBuilt ? String(property.yearBuilt) : '-' },
    { label: 'État', value: 'Excellent' },
    { label: 'DPE', value: 'A' },
    { label: 'Exposition', value: 'Sud' },
  ];

  const actions = [
    { label: 'Modifier le bien', icon: PencilIcon, primary: true },
    { label: 'Voir les statistiques', icon: ChartBarIcon, primary: false },
    { label: 'Publier sur les portails', icon: ArrowUpTrayIcon, primary: false },
    { label: 'Gérer les rendez-vous', icon: CalendarIcon, primary: false },
    { label: 'Voir les demandes', icon: EnvelopeIcon, primary: false },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Retour à la liste
      </button>

      <div className="bg-white border border-gray-200 shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              <HomeIcon className="w-5 h-5 inline mr-2 text-emerald-600" />
              {property.title}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <MapPinIcon className="w-4 h-4 text-emerald-600" />
              {property.location}
            </div>
          </div>
          <span className={`flex-shrink-0 px-3 py-1 text-xs font-semibold ${
            property.status === 'En vente' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {property.status}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <DocumentTextIcon className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Informations générales</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
            {infoRows.map((row, i) => (
              <div key={i}>
                <span className="text-[11px] text-gray-500 block uppercase tracking-wider">{row.label}</span>
                <span className="text-sm font-semibold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <ChartBarIcon className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Statistiques du bien</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
              <span className="text-[11px] text-gray-500 block uppercase tracking-wider mb-1">Visites ce mois</span>
              <span className="text-2xl font-bold text-emerald-700">{property.visitsThisMonth || 0}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
              <span className="text-[11px] text-gray-500 block uppercase tracking-wider mb-1">Demandes reçues</span>
              <span className="text-2xl font-bold text-emerald-700">{property.inquiries || 0}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 text-center">
              <span className="text-[11px] text-gray-500 block uppercase tracking-wider mb-1">Taux conversion</span>
              <span className="text-2xl font-bold text-emerald-700">{conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <BuildingOfficeIcon className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Détails du bien</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
            {detailsRows.map((row, i) => (
              <div key={i}>
                <span className="text-[11px] text-gray-500 block uppercase tracking-wider">{row.label}</span>
                <span className="text-sm font-semibold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {property.features && property.features.length > 0 && (
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Prestations et équipements</h3>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <BoltIcon className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Actions</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-3">
            {actions.map((action, i) => {
              const Icon = action.icon;
              return action.primary ? (
                <button key={i} className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              ) : (
                <button key={i} className="px-5 py-2.5 border border-emerald-600 text-emerald-600 text-sm font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPropertyDetail;
