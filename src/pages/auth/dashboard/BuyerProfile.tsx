import React, { useState } from 'react';
import {
  UserIcon,
  CogIcon,
  ShieldCheckIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  BellIcon,
  KeyIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

type ProfileTab = 'personal' | 'preferences' | 'security';

const BuyerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [profile, setProfile] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 1 23 45 67 89',
    birthDate: '15/06/1985',
    newsletter: true,
    emailAlerts: true,
    smsNotifications: true,
    twoFactor: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'personal' as ProfileTab, label: 'Informations personnelles', icon: UserIcon },
    { id: 'preferences' as ProfileTab, label: 'Préférences', icon: CogIcon },
    { id: 'security' as ProfileTab, label: 'Sécurité', icon: ShieldCheckIcon },
  ];

  const renderPersonal = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-16 h-16 bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Photo de profil</h4>
          <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-1 inline-block">Changer la photo</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Prénom</label>
          <input type="text" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nom</label>
          <input type="text" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          <EnvelopeIcon className="w-3.5 h-3.5 inline mr-1" />
          Email
        </label>
        <input type="email" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          <PhoneIcon className="w-3.5 h-3.5 inline mr-1" />
          Téléphone
        </label>
        <input type="tel" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          <CalendarIcon className="w-3.5 h-3.5 inline mr-1" />
          Date de naissance
        </label>
        <input type="text" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={profile.birthDate} onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })} />
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-4">
      <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
        <input type="checkbox" checked={profile.newsletter} onChange={() => setProfile({ ...profile, newsletter: !profile.newsletter })} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
        <div>
          <span className="text-sm font-medium text-gray-900">Newsletter</span>
          <p className="text-xs text-gray-500">Recevez nos actualités et offres exclusives</p>
        </div>
      </label>
      <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
        <input type="checkbox" checked={profile.emailAlerts} onChange={() => setProfile({ ...profile, emailAlerts: !profile.emailAlerts })} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
        <div>
          <span className="text-sm font-medium text-gray-900">Alertes Email</span>
          <p className="text-xs text-gray-500">Nouveaux biens correspondant à vos critères</p>
        </div>
      </label>
      <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
        <input type="checkbox" checked={profile.smsNotifications} onChange={() => setProfile({ ...profile, smsNotifications: !profile.smsNotifications })} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
        <div>
          <span className="text-sm font-medium text-gray-900">Notifications SMS</span>
          <p className="text-xs text-gray-500">Alertes pour les rendez-vous</p>
        </div>
      </label>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <KeyIcon className="w-4 h-4 text-emerald-600" />
          Changer le mot de passe
        </h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mot de passe actuel</label>
            <input type="password" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={profile.currentPassword} onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nouveau mot de passe</label>
              <input type="password" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={profile.newPassword} onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Confirmer</label>
              <input type="password" className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" value={profile.confirmPassword} onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
        <input type="checkbox" checked={profile.twoFactor} onChange={() => setProfile({ ...profile, twoFactor: !profile.twoFactor })} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
        <div>
          <span className="text-sm font-medium text-gray-900">Authentification à deux facteurs (2FA)</span>
          <p className="text-xs text-gray-500">Sécurisez votre compte avec une vérification en deux étapes</p>
        </div>
      </label>
      <div className="bg-gray-50 border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
          Dernière connexion : 13/06/2026 à 14h30
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Mon profil</h2>
        <p className="text-sm text-gray-500 mt-0.5">Gérez vos informations personnelles et préférences</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-6 py-5">
          {activeTab === 'personal' && renderPersonal()}
          {activeTab === 'preferences' && renderPreferences()}
          {activeTab === 'security' && renderSecurity()}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all">
          Annuler
        </button>
        <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};

export default BuyerProfile;
