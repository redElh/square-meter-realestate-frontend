// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserCircleIcon,
  CogIcon,
  BellIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  HomeIcon,
  KeyIcon,
  BanknotesIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
  FolderOpenIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import UserProfile from '../../components/UserProfile';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const [userType, setUserType] = useState<'buyer' | 'owner'>('buyer'); // Toggle between buyer and owner
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  
  // Buyer-specific data
  const buyerSavedProperties = [
    { 
      id: 1, 
      title: t('dashboard.sampleData.properties.property1.title'), 
      location: t('dashboard.sampleData.properties.property1.location'), 
      price: '2,500,000 €',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600',
      surface: '420 m²',
      bedrooms: 6,
      bathrooms: 5
    },
    { 
      id: 2, 
      title: t('dashboard.sampleData.properties.property2.title'), 
      location: t('dashboard.sampleData.properties.property2.location'), 
      price: '15,000 €/mois',
      image: 'https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=600',
      surface: '180 m²',
      bedrooms: 3,
      bathrooms: 2
    }
  ];

  const buyerSearches = [
    { id: 1, criteria: t('dashboard.sampleData.searches.search1'), results: 12, date: '2024-12-10' },
    { id: 2, criteria: t('dashboard.sampleData.searches.search2'), results: 8, date: '2024-12-08' }
  ];

  // Owner-specific data
  const ownerProperties = [
    {
      id: 1,
      title: t('dashboard.sampleData.properties.property1.title'),
      location: t('dashboard.sampleData.properties.property1.location'),
      status: 'En vente',
      price: '1,850,000 €',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: 245,
      favorites: 18,
      inquiries: 7
    },
    {
      id: 2,
      title: t('dashboard.sampleData.properties.property2.title'),
      location: t('dashboard.sampleData.properties.property2.location'),
      status: 'En location',
      price: '2,200 €/mois',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: 132,
      favorites: 9,
      inquiries: 4
    }
  ];

  const ownerStats = [
    { label: t('dashboard.stats.owner.activeProperties'), value: '2', icon: HomeIcon },
    { label: t('dashboard.stats.owner.visitsThisMonth'), value: '8', icon: CalendarIcon },
    { label: t('dashboard.stats.owner.requestsReceived'), value: '11', icon: EnvelopeIcon },
    { label: t('dashboard.stats.owner.monthlyRevenue'), value: '2,200 €', icon: BanknotesIcon }
  ];

  const buyerStats = [
    { label: t('dashboard.stats.buyer.savedProperties'), value: '12', icon: HeartIcon },
    { label: t('dashboard.stats.buyer.scheduledVisits'), value: '3', icon: CalendarIcon },
    { label: t('dashboard.stats.buyer.messages'), value: '5', icon: EnvelopeIcon },
    { label: t('dashboard.stats.buyer.activeSearches'), value: '2', icon: MagnifyingGlassIcon }
  ];

  const appointmentsData = [
    {
      id: 1,
      title: t('dashboard.sampleData.appointments.appointment1.title'),
      date: '2025-12-15',
      time: t('dashboard.sampleData.appointments.appointment1.time'),
      location: t('dashboard.sampleData.appointments.appointment1.location'),
      status: t('dashboard.appointments.confirmed'),
      advisor: t('dashboard.sampleData.appointments.appointment1.advisor')
    },
    {
      id: 2,
      title: t('dashboard.sampleData.appointments.appointment2.title'),
      date: '2025-12-18',
      time: t('dashboard.sampleData.appointments.appointment2.time'),
      location: t('dashboard.sampleData.appointments.appointment2.location'),
      status: t('dashboard.appointments.pending'),
      advisor: t('dashboard.sampleData.appointments.appointment2.advisor')
    }
  ];

  const messages = [
    {
      id: 1,
      sender: t('dashboard.sampleData.messages.message1.sender'),
      role: t('dashboard.sampleData.messages.message1.role'),
      content: t('dashboard.sampleData.messages.message1.content'),
      time: t('dashboard.sampleData.messages.message1.time'),
      unread: true
    },
    {
      id: 2,
      sender: t('dashboard.sampleData.messages.message2.sender'),
      role: t('dashboard.sampleData.messages.message2.role'),
      content: t('dashboard.sampleData.messages.message2.content'),
      time: t('dashboard.sampleData.messages.message2.time'),
      unread: false
    }
  ];


  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const handleOpenUserProfile = () => {
    setIsUserProfileOpen(true);
  };

  const handleCloseUserProfile = () => {
    setIsUserProfileOpen(false);
    setActiveTab('overview');
  };

  const handleNavigationClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'profile') {
      handleOpenUserProfile();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-emerald-800 text-lg font-medium">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  const currentStats = userType === 'buyer' ? buyerStats : ownerStats;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-800 mb-1 sm:mb-2">
                {userType === 'buyer' ? t('dashboard.header.buyerTitle') : t('dashboard.header.ownerTitle')}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {userType === 'buyer' 
                  ? t('dashboard.header.buyerSubtitle')
                  : t('dashboard.header.ownerSubtitle')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* User Type Toggle */}
              <div className="flex bg-gray-100 p-1 flex-1 sm:flex-initial">
                <button
                  onClick={() => { setUserType('buyer'); setActiveTab('overview'); }}
                  className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 text-sm sm:text-base font-medium transition-all ${
                    userType === 'buyer'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  {t('dashboard.header.buyerToggle')}
                </button>
                <button
                  onClick={() => { setUserType('owner'); setActiveTab('overview'); }}
                  className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 text-sm sm:text-base font-medium transition-all ${
                    userType === 'owner'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  {t('dashboard.header.ownerToggle')}
                </button>
              </div>

              <div className="flex gap-3">
                <button className="relative p-2 sm:p-3 bg-white border border-gray-200 hover:border-emerald-600 transition-all">
                  <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
                
                <Link
                  to="/contact"
                  className="flex-1 sm:flex-initial bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{t('dashboard.header.newRequest')}</span>
                  <span className="sm:hidden">{t('dashboard.header.newRequest')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-3 sm:p-6 lg:sticky lg:top-6">
              <nav className="space-y-1 sm:space-y-2">
                {userType === 'buyer' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'overview'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t('dashboard.navigation.overview')}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('saved')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'saved'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">{t('dashboard.navigation.savedProperties')}</span>
                      <span className="ml-auto bg-emerald-100 text-emerald-800 px-2 py-1 text-xs font-semibold whitespace-nowrap">
                        {buyerSavedProperties.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('searches')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'searches'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t('dashboard.navigation.mySearches')}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'appointments'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">{t('dashboard.navigation.appointments')}</span>
                      <span className="ml-auto bg-emerald-100 text-emerald-800 px-2 py-1 text-xs font-semibold whitespace-nowrap">
                        {appointmentsData.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'messages'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">{t('dashboard.navigation.messages')}</span>
                      <span className="ml-auto bg-red-500 text-white px-2 py-1 text-xs font-semibold whitespace-nowrap">
                        {messages.filter(m => m.unread).length}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'overview'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t('dashboard.navigation.overview')}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('properties')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'properties'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">{t('dashboard.navigation.myProperties')}</span>
                      <span className="ml-auto bg-emerald-100 text-emerald-800 px-2 py-1 text-xs font-semibold whitespace-nowrap">
                        {ownerProperties.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'analytics'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChartPieIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t('dashboard.navigation.statistics')}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'inquiries'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">{t('dashboard.navigation.inquiriesReceived')}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                        activeTab === 'documents'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FolderOpenIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t('dashboard.navigation.documents')}</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleNavigationClick('profile')}
                  className={`w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium transition-all ${
                    activeTab === 'profile'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('dashboard.navigation.profile')}</span>
                </button>
                <button
                  className="w-full text-left flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <CogIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{t('dashboard.navigation.settings')}</span>
                </button>
              </nav>
            </div>
          </div>


          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                  {currentStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div 
                        key={index}
                        className="bg-white border border-gray-200 p-4 sm:p-6 hover:border-emerald-600 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <IconComponent className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Buyer Overview */}
                {userType === 'buyer' && (
                  <>
                    {/* Saved Properties Preview */}
                    <div className="bg-white border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">{t('dashboard.overview.recentSaved')}</h3>
                        <button 
                          onClick={() => setActiveTab('saved')}
                          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                        >
                          {t('dashboard.overview.viewAll')}
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {buyerSavedProperties.map((property) => (
                          <div key={property.id} className="border border-gray-200 hover:border-emerald-600 transition-all group">
                            <div className="relative h-40 sm:h-48 overflow-hidden">
                              <img 
                                src={property.image} 
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <button className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white flex items-center justify-center hover:bg-emerald-600 transition-all">
                                <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                              </button>
                            </div>
                            <div className="p-3 sm:p-4">
                              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                {property.title}
                              </h4>
                              <div className="flex items-center text-gray-600 mb-2 sm:mb-3 gap-1">
                                <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm">{property.location}</span>
                              </div>
                              <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-3 sm:mb-4">
                                {property.price}
                              </div>
                              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                                <span>{property.surface}</span>
                                <span>•</span>
                                <span>{property.bedrooms} {t('dashboard.savedProperties.bedrooms')}</span>
                                <span>•</span>
                                <span>{property.bathrooms} {t('dashboard.savedProperties.bathrooms')}</span>
                              </div>
                              <Link
                                to={`/properties/${property.id}`}
                                className="block w-full bg-emerald-600 text-white py-2 sm:py-3 text-sm sm:text-base text-center font-medium hover:bg-emerald-700 transition-all"
                              >
                                {t('dashboard.overview.propertyDetails')}
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link
                        to="/properties"
                        className="bg-white border border-gray-200 p-6 hover:border-emerald-600 transition-all group"
                      >
                        <MagnifyingGlassIcon className="w-10 h-10 text-emerald-600 mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.overview.quickActions.searchProperty')}</h4>
                        <p className="text-gray-600 text-sm">{t('dashboard.overview.quickActions.searchDescription')}</p>
                      </Link>
                      <Link
                        to="/contact"
                        className="bg-white border border-gray-200 p-6 hover:border-emerald-600 transition-all group"
                      >
                        <ChatBubbleLeftIcon className="w-10 h-10 text-emerald-600 mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.overview.quickActions.contactAdvisor')}</h4>
                        <p className="text-gray-600 text-sm">{t('dashboard.overview.quickActions.contactDescription')}</p>
                      </Link>
                    </div>
                  </>
                )}

                {/* Owner Overview */}
                {userType === 'owner' && (
                  <>
                    {/* Properties Performance */}
                    <div className="bg-white border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">{t('dashboard.overview.propertyPerformance')}</h3>
                        <button 
                          onClick={() => setActiveTab('properties')}
                          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                        >
                          {t('dashboard.overview.manage')}
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {ownerProperties.map((property) => (
                          <div key={property.id} className="border border-gray-200 p-3 sm:p-4 hover:border-emerald-600 transition-all">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                              <img 
                                src={property.image} 
                                alt={property.title}
                                className="w-full sm:w-32 h-40 sm:h-32 object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="text-lg font-bold text-gray-900">{property.title}</h4>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <MapPinIcon className="w-4 h-4" />
                                      {property.location}
                                    </p>
                                  </div>
                                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 text-sm font-semibold">
                                    {property.status}
                                  </span>
                                </div>
                                <div className="text-2xl font-bold text-emerald-600 mb-3">
                                  {property.price}
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <div className="text-sm text-gray-600">{t('dashboard.overview.views')}</div>
                                    <div className="text-lg font-bold text-gray-900">{property.views}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">{t('dashboard.overview.favorites')}</div>
                                    <div className="text-lg font-bold text-gray-900">{property.favorites}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">{t('dashboard.overview.inquiries')}</div>
                                    <div className="text-lg font-bold text-gray-900">{property.inquiries}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions for Owners */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link
                        to="/selling"
                        className="bg-white border border-gray-200 p-6 hover:border-emerald-600 transition-all"
                      >
                        <PlusIcon className="w-10 h-10 text-emerald-600 mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.overview.quickActions.addProperty')}</h4>
                        <p className="text-gray-600 text-sm">{t('dashboard.overview.quickActions.addDescription')}</p>
                      </Link>
                      <Link
                        to="/contact"
                        className="bg-white border border-gray-200 p-6 hover:border-emerald-600 transition-all"
                      >
                        <DocumentChartBarIcon className="w-10 h-10 text-emerald-600 mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.overview.quickActions.requestEstimation')}</h4>
                        <p className="text-gray-600 text-sm">{t('dashboard.overview.quickActions.estimationDescription')}</p>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}


            {/* Buyer: Saved Properties Tab */}
            {activeTab === 'saved' && userType === 'buyer' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.savedProperties.title')}</h3>
                    <p className="text-gray-600">{buyerSavedProperties.length} {t('dashboard.savedProperties.propertiesCount')}</p>
                  </div>
                  <select className="px-4 py-2 border border-gray-200 bg-white text-gray-700">
                    <option>{t('dashboard.savedProperties.sortByDate')}</option>
                    <option>{t('dashboard.savedProperties.priceLowToHigh')}</option>
                    <option>{t('dashboard.savedProperties.priceHighToLow')}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {buyerSavedProperties.map((property) => (
                    <div key={property.id} className="border border-gray-200 hover:border-emerald-600 transition-all group">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center hover:bg-red-50 transition-all">
                          <HeartIconSolid className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {property.title}
                        </h4>
                        <div className="flex items-center text-gray-600 mb-4 gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                        <div className="text-3xl font-bold text-emerald-600 mb-4">
                          {property.price}
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                          <span>{property.surface}</span>
                          <span>•</span>
                          <span>{property.bedrooms} {t('dashboard.savedProperties.bedrooms')}</span>
                          <span>•</span>
                          <span>{property.bathrooms} {t('dashboard.savedProperties.bathrooms')}</span>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            to={`/properties/${property.id}`}
                            className="flex-1 bg-emerald-600 text-white py-3 text-center font-medium hover:bg-emerald-700 transition-all"
                          >
                            {t('dashboard.savedProperties.viewDetails')}
                          </Link>
                          <Link
                            to="/contact"
                            className="flex-1 border border-emerald-600 text-emerald-600 py-3 text-center font-medium hover:bg-emerald-50 transition-all"
                          >
                            {t('dashboard.savedProperties.contact')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buyer: Searches Tab */}
            {activeTab === 'searches' && userType === 'buyer' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.searches.title')}</h3>
                    <p className="text-gray-600">{t('dashboard.searches.subtitle')}</p>
                  </div>
                  <Link
                    to="/properties"
                    className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all"
                  >
                    {t('dashboard.searches.newSearch')}
                  </Link>
                </div>

                <div className="space-y-4">
                  {buyerSearches.map((search) => (
                    <div key={search.id} className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{search.criteria}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{search.results} {t('dashboard.searches.results')}</span>
                            <span>•</span>
                            <span>{t('dashboard.searches.createdOn')} {search.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button className="px-4 py-2 border border-emerald-600 text-emerald-600 font-medium hover:bg-emerald-50 transition-all">
                            {t('dashboard.searches.edit')}
                          </button>
                          <button className="px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all">
                            {t('dashboard.searches.viewResults')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner: Properties Tab */}
            {activeTab === 'properties' && userType === 'owner' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.properties.title')}</h3>
                    <p className="text-gray-600">{ownerProperties.length} {t('dashboard.properties.activeProperties')}</p>
                  </div>
                  <Link
                    to="/selling"
                    className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    {t('dashboard.properties.addProperty')}
                  </Link>
                </div>

                <div className="space-y-6">
                  {ownerProperties.map((property) => (
                    <div key={property.id} className="border border-gray-200 hover:border-emerald-600 transition-all">
                      <div className="flex gap-6 p-6">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-48 h-48 object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h4>
                              <p className="text-gray-600 flex items-center gap-1">
                                <MapPinIcon className="w-4 h-4" />
                                {property.location}
                              </p>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 px-4 py-2 font-semibold">
                              {property.status}
                            </span>
                          </div>
                          <div className="text-3xl font-bold text-emerald-600 mb-6">
                            {property.price}
                          </div>
                          <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="bg-gray-50 p-4">
                              <div className="text-sm text-gray-600 mb-1">{t('dashboard.properties.totalViews')}</div>
                              <div className="text-2xl font-bold text-gray-900">{property.views}</div>
                            </div>
                            <div className="bg-gray-50 p-4">
                              <div className="text-sm text-gray-600 mb-1">{t('dashboard.properties.addedToFavorites')}</div>
                              <div className="text-2xl font-bold text-gray-900">{property.favorites}</div>
                            </div>
                            <div className="bg-gray-50 p-4">
                              <div className="text-sm text-gray-600 mb-1">{t('dashboard.properties.requestsReceived')}</div>
                              <div className="text-2xl font-bold text-gray-900">{property.inquiries}</div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button className="px-6 py-3 border border-emerald-600 text-emerald-600 font-medium hover:bg-emerald-50 transition-all">
                              {t('dashboard.properties.edit')}
                            </button>
                            <button className="px-6 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all">
                              {t('dashboard.properties.viewStatistics')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner: Analytics Tab */}
            {activeTab === 'analytics' && userType === 'owner' && (
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.analytics.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.analytics.monthlyViews')}</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">377</div>
                    <p className="text-gray-600 text-sm">{t('dashboard.analytics.vsLastMonth')}</p>
                  </div>
                  <div className="border border-gray-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.analytics.conversionRate')}</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">4.2%</div>
                    <p className="text-gray-600 text-sm">{t('dashboard.analytics.visitsToRequests')}</p>
                  </div>
                  <div className="border border-gray-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.analytics.averageTime')}</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">3m 42s</div>
                    <p className="text-gray-600 text-sm">{t('dashboard.analytics.viewingDuration')}</p>
                  </div>
                  <div className="border border-gray-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{t('dashboard.analytics.averagePosition')}</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">#12</div>
                    <p className="text-gray-600 text-sm">{t('dashboard.analytics.inSearchResults')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab (Both user types) */}
            {activeTab === 'appointments' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.appointments.title')}</h3>
                    <p className="text-gray-600">{appointmentsData.length} {t('dashboard.appointments.upcomingAppointments')}</p>
                  </div>
                  <Link
                    to="/contact"
                    className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all"
                  >
                    {t('dashboard.appointments.scheduleAppointment')}
                  </Link>
                </div>

                <div className="space-y-4">
                  {appointmentsData.map((appt) => (
                    <div key={appt.id} className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{appt.title}</h4>
                          <div className="space-y-1 text-sm text-gray-600 mb-4">
                            <p className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              {appt.date} {t('dashboard.appointments.at')} {appt.time}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPinIcon className="w-4 h-4" />
                              {appt.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <UserCircleIcon className="w-4 h-4" />
                              {appt.advisor}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <span className={`px-4 py-2 font-semibold ${
                            appt.status === t('dashboard.appointments.confirmed')
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appt.status}
                          </span>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:border-emerald-600 hover:text-emerald-600 transition-all">
                              {t('dashboard.appointments.edit')}
                            </button>
                            <button className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 transition-all">
                              {t('dashboard.appointments.cancel')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab (Both user types) */}
            {activeTab === 'messages' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.messages.title')}</h3>
                    <p className="text-gray-600">{messages.filter(m => m.unread).length} {t('dashboard.messages.unreadMessages')}</p>
                  </div>
                  <button className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <EnvelopeIcon className="w-5 h-5" />
                    {t('dashboard.messages.newMessage')}
                  </button>
                </div>

                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`border p-6 transition-all ${
                        message.unread 
                          ? 'border-emerald-600 bg-emerald-50' 
                          : 'border-gray-200 hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{message.sender}</h4>
                            {message.unread && (
                              <span className="bg-red-500 text-white px-3 py-1 text-xs font-semibold">
                                {t('dashboard.messages.new')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{message.role}</p>
                          <p className="text-gray-700">{message.content}</p>
                        </div>
                        <span className="text-sm text-gray-500">{t('dashboard.messages.ago', { time: message.time })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner: Inquiries Tab */}
            {activeTab === 'inquiries' && userType === 'owner' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.inquiries.title')}</h3>
                    <p className="text-gray-600">{t('dashboard.inquiries.subtitle')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{t('dashboard.inquiries.visitRequest')}</h4>
                        <p className="text-sm text-gray-600">{t('dashboard.sampleData.properties.property1.title')} - Nice</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 text-sm font-semibold">
                        {t('dashboard.inquiries.new')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{t('dashboard.inquiries.sampleContent1')}</p>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all">
                        {t('dashboard.inquiries.reply')}
                      </button>
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-emerald-600 transition-all">
                        {t('dashboard.inquiries.viewDetails')}
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{t('dashboard.inquiries.propertyQuestion')}</h4>
                        <p className="text-sm text-gray-600">{t('dashboard.sampleData.properties.property2.title')} - Lyon</p>
                      </div>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 text-sm font-semibold">
                        {t('dashboard.inquiries.processed')}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{t('dashboard.inquiries.sampleContent2')}</p>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-emerald-600 transition-all">
                        {t('dashboard.inquiries.viewResponse')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Owner: Documents Tab */}
            {activeTab === 'documents' && userType === 'owner' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('dashboard.documents.title')}</h3>
                    <p className="text-gray-600">{t('dashboard.documents.subtitle')}</p>
                  </div>
                  <button className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    {t('dashboard.documents.addDocument')}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <DocumentTextIcon className="w-12 h-12 text-emerald-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">{t('dashboard.documents.diagnostics')}</h4>
                    <p className="text-sm text-gray-600 mb-4">{t('dashboard.documents.diagnosticsDescription')}</p>
                    <button className="w-full bg-emerald-600 text-white py-2 hover:bg-emerald-700 transition-all">
                      {t('dashboard.documents.view')} (3)
                    </button>
                  </div>
                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <DocumentTextIcon className="w-12 h-12 text-emerald-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">{t('dashboard.documents.contracts')}</h4>
                    <p className="text-sm text-gray-600 mb-4">{t('dashboard.documents.contractsDescription')}</p>
                    <button className="w-full bg-emerald-600 text-white py-2 hover:bg-emerald-700 transition-all">
                      {t('dashboard.documents.view')} (2)
                    </button>
                  </div>
                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <DocumentTextIcon className="w-12 h-12 text-emerald-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">{t('dashboard.documents.propertyTitles')}</h4>
                    <p className="text-sm text-gray-600 mb-4">{t('dashboard.documents.propertyTitlesDescription')}</p>
                    <button className="w-full bg-emerald-600 text-white py-2 hover:bg-emerald-700 transition-all">
                      {t('dashboard.documents.view')} (1)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UserProfile Modal */}
      <UserProfile 
        isOpen={isUserProfileOpen} 
        onClose={handleCloseUserProfile} 
      />
    </div>
  );
};

export default Dashboard;