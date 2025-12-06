// src/components/UserProfile.tsx
import React, { useState, useRef } from 'react';
import { 
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  StarIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BellIcon,
  LockClosedIcon,
  GlobeAltIcon,
  UserCircleIcon,
  PhotoIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  CheckBadgeIcon as CheckBadgeIconSolid
} from '@heroicons/react/24/solid';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState({
    personal: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33 1 23 45 67 89',
      birthDate: '1985-06-15',
      nationality: 'Française',
      language: 'Français',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    professional: {
      company: 'Dupont Industries',
      position: 'CEO',
      industry: 'Technologie',
      website: 'www.dupont-industries.com',
      linkedin: 'linkedin.com/in/jeandupont'
    },
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailAlerts: true,
      language: 'fr',
      currency: 'EUR',
      timezone: 'Europe/Paris'
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactor: true,
      lastLogin: '2024-01-15 14:30'
    }
  });

  const [formData, setFormData] = useState(userData);
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const membershipTiers = [
    {
      level: 'Premium',
      icon: StarIconSolid,
      color: 'from-amber-500 to-orange-600',
      benefits: ['Accès exclusif', 'Conseiller dédié', 'Visites privées', 'Market reports'],
      since: '2023',
      expires: '2025'
    }
  ];

  const activityStats = [
    { label: 'Properties Viewed', value: 47, trend: '+12%' },
    { label: 'Saved Properties', value: 12, trend: '+5%' },
    { label: 'Contacts Made', value: 8, trend: '+3%' },
    { label: 'Appointments', value: 6, trend: '+8%' }
  ];

  const documents = [
    { name: 'ID Document', type: 'Verification', date: '2024-01-10', status: 'Verified' },
    { name: 'Proof of Funds', type: 'Financial', date: '2024-01-08', status: 'Pending' },
    { name: 'Purchase Agreement', type: 'Contract', date: '2024-01-05', status: 'Signed' }
  ];

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
    // Here you would typically make an API call to save the data
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            avatar: e.target?.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const togglePasswordVisibility = (field: keyof typeof passwordVisible) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto ">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

  {/* Modal Panel */}
  <div className="relative z-50 inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-3xl">
          {/* Close Button */}
          <button
            aria-label="Fermer le profil"
            onClick={onClose}
            className="absolute top-4 right-4 z-60 w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6 text-deep-green" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 max-h-[90vh] bg-gradient-to-br from-ivory via-white to-amber-50 rounded-3xl overflow-hidden border-2 border-gold/30 shadow-2xl">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 overflow-x-hidden bg-gradient-to-b from-deep-green to-emerald-900 text-ivory p-8 relative max-h-[90vh] pr-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-16 translate-x-16 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-ivory/10 rounded-full translate-y-12 -translate-x-12 pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* User Avatar & Basic Info */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4 group">
                    <div className="relative">
                      <img
                        src={formData.personal.avatar}
                        alt={`${formData.personal.firstName} ${formData.personal.lastName}`}
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-gold shadow-2xl mx-auto"
                      />
                      {isEditing && (
                        <button
                          onClick={triggerFileInput}
                          className="absolute bottom-2 right-2 w-10 h-10 bg-gold rounded-full flex items-center justify-center hover:bg-amber-500 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                          <CameraIcon className="w-5 h-5 text-deep-green" />
                        </button>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckBadgeIconSolid className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-inter uppercase mb-1">
                    {formData.personal.firstName} {formData.personal.lastName}
                  </h2>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <ShieldCheckIconSolid className="w-4 h-4 text-gold" />
                    <p className="font-didot text-gold">Premium Client</p>
                  </div>
                  <p className="font-didot text-ivory/80 text-sm">
                    Membre depuis {membershipTiers[0].since}
                  </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {[
                    { id: 'personal', label: 'Informations Personnelles', icon: UserCircleIcon },
                    { id: 'professional', label: 'Profil Professionnel', icon: BuildingLibraryIcon },
                    { id: 'preferences', label: 'Préférences', icon: BellIcon },
                    { id: 'security', label: 'Sécurité', icon: LockClosedIcon },
                    { id: 'membership', label: 'Abonnement', icon: StarIcon },
                    { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 group ${
                          activeTab === item.id
                            ? 'bg-gold text-deep-green shadow-lg transform scale-105'
                            : 'text-ivory/80 hover:bg-gold/20 hover:text-ivory'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-didot text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Profile Completion */}
                <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-didot">Profil complété</span>
                    <span className="font-inter">85%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-gold to-amber-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-4xl font-inter uppercase text-deep-green mb-2">
                    {activeTab === 'personal' && 'Informations Personnelles'}
                    {activeTab === 'professional' && 'Profil Professionnel'}
                    {activeTab === 'preferences' && 'Préférences'}
                    {activeTab === 'security' && 'Sécurité'}
                    {activeTab === 'membership' && 'Votre Abonnement'}
                    {activeTab === 'documents' && 'Documents'}
                  </h1>
                  <p className="font-didot text-gray-600">
                    {activeTab === 'personal' && 'Gérez vos informations personnelles et coordonnées'}
                    {activeTab === 'professional' && 'Informations sur votre situation professionnelle'}
                    {activeTab === 'preferences' && 'Personnalisez votre expérience'}
                    {activeTab === 'security' && 'Sécurisez votre compte'}
                    {activeTab === 'membership' && 'Votre statut Premium et avantages'}
                    {activeTab === 'documents' && 'Vos documents et vérifications'}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-ivory px-6 py-3 rounded-2xl font-inter uppercase tracking-wide hover:bg-green-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                      >
                        <CheckIcon className="w-5 h-5" />
                        <span>Sauvegarder</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="border-2 border-red-500 text-red-500 px-6 py-3 rounded-2xl font-inter uppercase tracking-wide hover:bg-red-500 hover:text-ivory transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <XMarkIcon className="w-5 h-5" />
                        <span>Annuler</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-6 py-3 rounded-2xl font-inter uppercase tracking-wide hover:from-amber-500 hover:to-gold transition-all duration-500 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                    >
                      <PencilIcon className="w-5 h-5" />
                      <span>Modifier</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gold/20">
                      <h3 className="font-inter uppercase text-deep-green text-xl mb-6">Coordonnées</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-inter uppercase text-deep-green text-sm mb-2">Prénom</label>
                            <input
                              type="text"
                              value={formData.personal.firstName}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: { ...prev.personal, firstName: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block font-inter uppercase text-deep-green text-sm mb-2">Nom</label>
                            <input
                              type="text"
                              value={formData.personal.lastName}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: { ...prev.personal, lastName: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="font-inter uppercase text-deep-green text-sm mb-2 flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.personal.email}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, email: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="font-inter uppercase text-deep-green text-sm mb-2 flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            value={formData.personal.phone}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, phone: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gold/20">
                      <h3 className="font-inter uppercase text-deep-green text-xl mb-6">Informations Supplémentaires</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="font-inter uppercase text-deep-green text-sm mb-2 flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Date de naissance
                          </label>
                          <input
                            type="date"
                            value={formData.personal.birthDate}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, birthDate: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block font-inter uppercase text-deep-green text-sm mb-2">Nationalité</label>
                          <select
                            value={formData.personal.nationality}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, nationality: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option>Française</option>
                            <option>Belge</option>
                            <option>Suisse</option>
                            <option>Autre</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-inter uppercase text-deep-green text-sm mb-2">Langue</label>
                          <select
                            value={formData.personal.language}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, language: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option>Français</option>
                            <option>English</option>
                            <option>Deutsch</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Activity Stats */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gold/20">
                      <h3 className="font-inter uppercase text-deep-green text-xl mb-6">Votre Activité</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {activityStats.map((stat, index) => (
                          <div key={index} className="text-center p-4 bg-ivory rounded-2xl border border-gold/20">
                            <div className="text-2xl font-inter text-deep-green font-light mb-1">{stat.value}</div>
                            <div className="font-didot text-gray-600 text-sm mb-1">{stat.label}</div>
                            <div className="text-green-500 font-inter text-xs">{stat.trend}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div className="bg-white/80 rounded-3xl p-6 shadow-2xl border border-gold/20">
                    <h3 className="font-inter uppercase text-deep-green text-xl mb-4">Vos Documents</h3>
                    <p className="font-didot text-gray-600 mb-4">Gérez vos documents importants. Tous les fichiers peuvent être téléchargés ou prévisualisés.</p>
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                      {documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-gold/20">
                          <div>
                            <div className="font-inter text-deep-green font-semibold">{doc.name}</div>
                            <div className="font-didot text-gray-600 text-sm">{doc.type} • {doc.date}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm ${doc.status === 'Verified' ? 'bg-green-100 text-green-700' : doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                              {doc.status}
                            </span>
                            <button className="px-4 py-2 bg-deep-green text-ivory rounded-xl text-sm">Voir</button>
                            <button className="px-4 py-2 border border-gold text-gold rounded-xl text-sm">Télécharger</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gold/20">
                    <h3 className="font-inter uppercase text-deep-green text-xl mb-6">Changer le Mot de Passe</h3>
                    <div className="space-y-4 max-w-md">
                      <div className="relative">
                        <label className="block font-inter uppercase text-deep-green text-sm mb-2">Mot de passe actuel</label>
                        <input
                          type={passwordVisible.current ? "text" : "password"}
                          value={formData.security.currentPassword}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            security: { ...prev.security, currentPassword: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gold transition-colors duration-300"
                        >
                          {passwordVisible.current ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block font-inter uppercase text-deep-green text-sm mb-2">Nouveau mot de passe</label>
                        <input
                          type={passwordVisible.new ? "text" : "password"}
                          value={formData.security.newPassword}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            security: { ...prev.security, newPassword: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gold transition-colors duration-300"
                        >
                          {passwordVisible.new ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block font-inter uppercase text-deep-green text-sm mb-2">Confirmer le mot de passe</label>
                        <input
                          type={passwordVisible.confirm ? "text" : "password"}
                          value={formData.security.confirmPassword}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            security: { ...prev.security, confirmPassword: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gold transition-colors duration-300"
                        >
                          {passwordVisible.confirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>

                      <button className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-8 py-4 rounded-2xl font-inter uppercase tracking-wide hover:from-amber-500 hover:to-gold transition-all duration-500 transform hover:scale-105 shadow-lg">
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gold/20">
                    <h3 className="font-inter uppercase text-deep-green text-xl mb-6">Sécurité du Compte</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border-2 border-gold/30 rounded-2xl hover:border-gold transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                            <LockClosedIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-inter uppercase text-deep-green">Authentification à deux facteurs</div>
                            <div className="font-didot text-gray-600 text-sm">Protégez votre compte avec 2FA</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.security.twoFactor}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              security: { ...prev.security, twoFactor: e.target.checked }
                            }))}
                            className="sr-only peer" 
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border-2 border-gold/30 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-inter uppercase text-deep-green">Dernière connexion</div>
                            <div className="font-didot text-gray-600 text-sm">{formData.security.lastLogin}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Membership Tab */}
              {activeTab === 'membership' && (
                <div className="space-y-6">
                  {membershipTiers.map((tier, index) => {
                    const IconComponent = tier.icon;
                    return (
                      <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gold/20">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                              <IconComponent className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-inter uppercase text-deep-green">{tier.level} Membership</h3>
                              <p className="font-didot text-gray-600">Actif depuis {tier.since} • Expire le {tier.expires}</p>
                            </div>
                          </div>
                          <span className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-6 py-3 rounded-2xl font-inter uppercase tracking-wide shadow-lg">
                            Actif
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {tier.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center space-x-3 p-4 bg-ivory rounded-2xl border border-gold/20">
                              <CheckBadgeIconSolid className="w-5 h-5 text-green-500" />
                              <span className="font-didot text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex space-x-4">
                          <button className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-8 py-4 rounded-2xl font-inter uppercase tracking-wide hover:from-amber-500 hover:to-gold transition-all duration-500 transform hover:scale-105 shadow-lg">
                            Mettre à niveau
                          </button>
                          <button className="border-2 border-deep-green text-deep-green px-8 py-4 rounded-2xl font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-all duration-300">
                            Voir les détails
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add other tabs with similar premium design... */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;