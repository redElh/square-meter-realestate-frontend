// src/components/UserProfile.tsx
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  BellIcon,
  LockClosedIcon,
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
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
      lastLogin: '2024-12-13 14:30'
    }
  });

  const [formData, setFormData] = useState(userData);
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const activityStats = [
    { label: t('userProfile.personal.views'), value: 47 },
    { label: t('userProfile.personal.favorites'), value: 12 },
    { label: t('userProfile.personal.contacts'), value: 8 },
    { label: t('userProfile.personal.appointments'), value: 6 }
  ];

  const documents = [
    { name: t('userProfile.documents.sampleDocs.id'), type: t('userProfile.documents.types.verification'), date: '2024-01-10', status: t('userProfile.documents.statuses.verified') },
    { name: t('userProfile.documents.sampleDocs.proofOfAddress'), type: t('userProfile.documents.types.administrative'), date: '2024-01-08', status: t('userProfile.documents.statuses.pending') },
    { name: t('userProfile.documents.sampleDocs.salesAgreement'), type: t('userProfile.documents.types.contract'), date: '2024-01-05', status: t('userProfile.documents.statuses.signed') }
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-2 sm:px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal Panel */}
        <div className="relative z-50 inline-block w-full max-w-6xl my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl">
          {/* Close Button */}
          <button
            aria-label={t('userProfile.closeButton')}
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-60 w-10 h-10 sm:w-12 sm:h-12 bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-4 h-auto lg:max-h-[90vh] bg-white overflow-hidden border border-gray-200 shadow-2xl">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 overflow-y-auto bg-emerald-600 text-white p-4 sm:p-6 lg:p-8 relative lg:max-h-[90vh]">
              <div className="relative z-10">
                {/* User Avatar & Basic Info */}
                <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                  <div className="relative inline-block mb-3 sm:mb-4 group">
                    <div className="relative">
                      <img
                        src={formData.personal.avatar}
                        alt={`${formData.personal.firstName} ${formData.personal.lastName}`}
                        className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover border-4 border-white shadow-lg mx-auto"
                      />
                      {isEditing && (
                        <button
                          onClick={triggerFileInput}
                          className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 bg-white flex items-center justify-center hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                          <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
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
                  </div>
                  
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
                    {formData.personal.firstName} {formData.personal.lastName}
                  </h2>
                  <p className="text-emerald-100 text-xs sm:text-sm truncate px-2">
                    {formData.personal.email}
                  </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 sm:space-y-2">
                  {[
                    { id: 'personal', label: t('userProfile.tabs.personal'), icon: UserCircleIcon },
                    { id: 'professional', label: t('userProfile.tabs.professional'), icon: BuildingLibraryIcon },
                    { id: 'preferences', label: t('userProfile.tabs.preferences'), icon: BellIcon },
                    { id: 'security', label: t('userProfile.tabs.security'), icon: LockClosedIcon },
                    { id: 'documents', label: t('userProfile.tabs.documents'), icon: DocumentTextIcon },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                          activeTab === item.id
                            ? 'bg-white text-emerald-600'
                            : 'text-white hover:bg-emerald-700'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Profile Completion */}
                <div className="mt-4 sm:mt-6 lg:mt-8 p-3 sm:p-4 bg-emerald-700 border border-emerald-500">
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span>{t('userProfile.profileCompletion')}</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-emerald-800 h-2">
                    <div 
                      className="bg-white h-2 transition-all duration-1000"
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>


            {/* Main Content */}
            <div className="lg:col-span-3 bg-gray-50 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {activeTab === 'personal' && t('userProfile.headers.personal')}
                    {activeTab === 'professional' && t('userProfile.headers.professional')}
                    {activeTab === 'preferences' && t('userProfile.headers.preferences')}
                    {activeTab === 'security' && t('userProfile.headers.security')}
                    {activeTab === 'documents' && t('userProfile.headers.documents')}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    {activeTab === 'personal' && t('userProfile.headers.personalSubtitle')}
                    {activeTab === 'professional' && t('userProfile.headers.professionalSubtitle')}
                    {activeTab === 'preferences' && t('userProfile.headers.preferencesSubtitle')}
                    {activeTab === 'security' && t('userProfile.headers.securitySubtitle')}
                    {activeTab === 'documents' && t('userProfile.headers.documentsSubtitle')}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{t('userProfile.buttons.save')}</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="border border-red-500 text-red-500 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{t('userProfile.buttons.cancel')}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t('userProfile.buttons.edit')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 max-h-[60vh] lg:max-h-[calc(90vh-180px)]">

              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">{t('userProfile.personal.contactDetails')}</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block font-medium text-gray-700 text-xs sm:text-sm mb-2">{t('userProfile.personal.firstName')}</label>
                            <input
                              type="text"
                              value={formData.personal.firstName}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: { ...prev.personal, firstName: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block font-medium text-gray-700 text-xs sm:text-sm mb-2">{t('userProfile.personal.lastName')}</label>
                            <input
                              type="text"
                              value={formData.personal.lastName}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: { ...prev.personal, lastName: e.target.value }
                              }))}
                              disabled={!isEditing}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="font-medium text-gray-700 text-xs sm:text-sm mb-2 flex items-center gap-2">
                            <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                            {t('userProfile.personal.email')}
                          </label>
                          <input
                            type="email"
                            value={formData.personal.email}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, email: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-gray-700 text-xs sm:text-sm mb-2 flex items-center gap-2">
                            <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                            {t('userProfile.personal.phone')}
                          </label>
                          <input
                            type="tel"
                            value={formData.personal.phone}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, phone: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('userProfile.personal.additionalInfo')}</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-emerald-600" />
                            {t('userProfile.personal.birthDate')}
                          </label>
                          <input
                            type="date"
                            value={formData.personal.birthDate}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, birthDate: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.personal.nationality')}</label>
                          <select
                            value={formData.personal.nationality}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, nationality: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option>{t('userProfile.personal.nationalities.french')}</option>
                            <option>{t('userProfile.personal.nationalities.belgian')}</option>
                            <option>{t('userProfile.personal.nationalities.swiss')}</option>
                            <option>{t('userProfile.personal.nationalities.other')}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.personal.language')}</label>
                          <select
                            value={formData.personal.language}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              personal: { ...prev.personal, language: e.target.value }
                            }))}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option>{t('userProfile.personal.languages.french')}</option>
                            <option>{t('userProfile.personal.languages.english')}</option>
                            <option>{t('userProfile.personal.languages.german')}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Activity Stats */}
                    <div className="bg-white border border-gray-200 p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">{t('userProfile.personal.yourActivity')}</h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {activityStats.map((stat, index) => (
                          <div key={index} className="text-center p-3 sm:p-4 bg-gray-50 border border-gray-200">
                            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab (legacy removed) */}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('userProfile.security.changePassword')}</h3>
                    <div className="space-y-4 max-w-md">
                      <div className="relative">
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.security.currentPassword')}</label>
                        <input
                          type={passwordVisible.current ? "text" : "password"}
                          value={formData.security.currentPassword}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            security: { ...prev.security, currentPassword: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          {passwordVisible.current ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.security.newPassword')}</label>
                        <input
                          type={passwordVisible.new ? "text" : "password"}
                          value={formData.security.newPassword}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            security: { ...prev.security, newPassword: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          {passwordVisible.new ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.security.confirmPassword')}</label>
                        <input
                          type={passwordVisible.confirm ? "text" : "password"}
                          value={formData.security.confirmPassword}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            security: { ...prev.security, confirmPassword: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                          {passwordVisible.confirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>

                      <button className="bg-emerald-600 text-white px-8 py-4 font-medium hover:bg-emerald-700 transition-all">
                        {t('userProfile.buttons.updatePassword')}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('userProfile.security.accountSecurity')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 hover:border-emerald-600 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center">
                            <LockClosedIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{t('userProfile.security.twoFactor')}</div>
                            <div className="text-sm text-gray-600">{t('userProfile.security.twoFactorDesc')}</div>
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
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-600 flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{t('userProfile.security.lastLogin')}</div>
                            <div className="text-sm text-gray-600">{formData.security.lastLogin}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Tab */}
              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('userProfile.professional.title')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.professional.company')}</label>
                        <input
                          type="text"
                          value={formData.professional.company}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            professional: { ...prev.professional, company: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.professional.position')}</label>
                        <input
                          type="text"
                          value={formData.professional.position}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            professional: { ...prev.professional, position: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.professional.industry')}</label>
                        <input
                          type="text"
                          value={formData.professional.industry}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            professional: { ...prev.professional, industry: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.professional.website')}</label>
                        <input
                          type="text"
                          value={formData.professional.website}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            professional: { ...prev.professional, website: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.professional.linkedin')}</label>
                        <input
                          type="text"
                          value={formData.professional.linkedin}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            professional: { ...prev.professional, linkedin: e.target.value }
                          }))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('userProfile.preferences.notifications')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 hover:border-emerald-600 transition-all">
                        <div>
                          <div className="font-semibold text-gray-900">{t('userProfile.preferences.newsletter')}</div>
                          <div className="text-sm text-gray-600">{t('userProfile.preferences.newsletterDesc')}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.preferences.newsletter}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, newsletter: e.target.checked }
                            }))}
                            className="sr-only peer" 
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 hover:border-emerald-600 transition-all">
                        <div>
                          <div className="font-semibold text-gray-900">{t('userProfile.preferences.smsNotifications')}</div>
                          <div className="text-sm text-gray-600">{t('userProfile.preferences.smsDesc')}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.preferences.smsNotifications}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, smsNotifications: e.target.checked }
                            }))}
                            className="sr-only peer" 
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 hover:border-emerald-600 transition-all">
                        <div>
                          <div className="font-semibold text-gray-900">{t('userProfile.preferences.emailAlerts')}</div>
                          <div className="text-sm text-gray-600">{t('userProfile.preferences.emailAlertsDesc')}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.preferences.emailAlerts}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, emailAlerts: e.target.checked }
                            }))}
                            className="sr-only peer" 
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t('userProfile.preferences.regionalSettings')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.preferences.language')}</label>
                        <select
                          value={formData.preferences.language}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, language: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 text-sm mb-2">{t('userProfile.preferences.currency')}</label>
                        <select
                          value={formData.preferences.currency}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, currency: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                        >
                          <option value="EUR">EUR (€)</option>
                          <option value="USD">USD ($)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 flex items-center justify-center flex-shrink-0">
                        <DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">{t('userProfile.documents.title')}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{t('userProfile.documents.subtitle')}</p>
                      </div>
                    </div>

                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border-l-4 border-emerald-600">
                      <p className="text-xs sm:text-sm text-gray-700">{t('userProfile.documents.securityNote')}</p>
                    </div>

                    <div className="space-y-3">
                      {documents.map((doc, idx) => (
                        <div key={idx} className="group p-3 sm:p-5 border border-gray-200 hover:border-emerald-600 transition-all duration-300 bg-white hover:shadow-md">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                            <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors flex-shrink-0">
                                <DocumentIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{doc.name}</div>
                                <div className="text-xs sm:text-sm text-gray-500">{doc.type} • {doc.date}</div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                              <span className={`px-3 sm:px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-center ${
                                doc.status === 'Vérifié' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                doc.status === 'En attente' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                                'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                                {doc.status}
                              </span>
                              <button className="px-3 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 text-white text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                <EyeIcon className="w-4 h-4" />
                                {t('userProfile.buttons.view')}
                              </button>
                              <button className="px-3 sm:px-5 py-2 sm:py-2.5 border-2 border-emerald-600 text-emerald-600 text-xs sm:text-sm font-medium hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                {t('userProfile.buttons.download')}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                      <button className="w-full py-3 sm:py-4 border-2 border-dashed border-gray-300 text-gray-600 text-sm sm:text-base font-medium hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                        <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        {t('userProfile.buttons.addDocument')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;