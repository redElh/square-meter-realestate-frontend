// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [userType, setUserType] = useState<'buyer' | 'owner'>('buyer'); // Toggle between buyer and owner
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  
  // Buyer-specific data
  const buyerSavedProperties = [
    { 
      id: 1, 
      title: 'Villa Les Oliviers', 
      location: 'Saint-Tropez', 
      price: '2,500,000 €',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600',
      surface: '420 m²',
      bedrooms: 6,
      bathrooms: 5
    },
    { 
      id: 2, 
      title: 'Appartement Haussmannien', 
      location: 'Paris 8ème', 
      price: '15,000 €/mois',
      image: 'https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=600',
      surface: '180 m²',
      bedrooms: 3,
      bathrooms: 2
    }
  ];

  const buyerSearches = [
    { id: 1, criteria: 'Villa, 300-500m², Saint-Tropez, Budget 2-3M€', results: 12, date: '2024-12-10' },
    { id: 2, criteria: 'Appartement, Paris 8ème, Location, 3+ chambres', results: 8, date: '2024-12-08' }
  ];

  // Owner-specific data
  const ownerProperties = [
    {
      id: 1,
      title: 'Ma Villa Méditerranéenne',
      location: 'Nice',
      status: 'En vente',
      price: '1,850,000 €',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: 245,
      favorites: 18,
      inquiries: 7
    },
    {
      id: 2,
      title: 'Appartement Centre Ville',
      location: 'Lyon',
      status: 'En location',
      price: '2,200 €/mois',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      views: 132,
      favorites: 9,
      inquiries: 4
    }
  ];

  const ownerStats = [
    { label: 'Propriétés actives', value: '2', icon: HomeIcon },
    { label: 'Visites ce mois', value: '8', icon: CalendarIcon },
    { label: 'Demandes reçues', value: '11', icon: EnvelopeIcon },
    { label: 'Revenus mensuels', value: '2,200 €', icon: BanknotesIcon }
  ];

  const buyerStats = [
    { label: 'Biens sauvegardés', value: '12', icon: HeartIcon },
    { label: 'Visites programmées', value: '3', icon: CalendarIcon },
    { label: 'Messages', value: '5', icon: EnvelopeIcon },
    { label: 'Recherches actives', value: '2', icon: MagnifyingGlassIcon }
  ];

  const appointmentsData = [
    {
      id: 1,
      title: 'Visite - Villa Les Oliviers',
      date: '2025-12-15',
      time: '14:00',
      location: 'Saint-Tropez',
      status: 'Confirmé',
      advisor: 'Sophie Laurent'
    },
    {
      id: 2,
      title: 'Visite - Appartement Haussmannien',
      date: '2025-12-18',
      time: '11:00',
      location: 'Paris 8ème',
      status: 'En attente',
      advisor: 'Thomas Moreau'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sophie Laurent',
      role: 'Conseillère immobilière',
      content: 'Bonjour, je vous recontacte concernant votre visite...',
      time: '2h',
      unread: true
    },
    {
      id: 2,
      sender: 'Thomas Moreau',
      role: 'Agent commercial',
      content: 'Votre demande a bien été prise en compte...',
      time: '1j',
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
          <p className="mt-4 text-emerald-800 text-lg font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  const currentStats = userType === 'buyer' ? buyerStats : ownerStats;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-emerald-800 mb-2">
                {userType === 'buyer' ? 'Espace Acheteur' : 'Espace Propriétaire'}
              </h1>
              <p className="text-gray-600">
                {userType === 'buyer' 
                  ? 'Gérez vos recherches et favoris immobiliers' 
                  : 'Gérez vos propriétés et suivez vos performances'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* User Type Toggle */}
              <div className="flex bg-gray-100 p-1">
                <button
                  onClick={() => { setUserType('buyer'); setActiveTab('overview'); }}
                  className={`px-6 py-2 font-medium transition-all ${
                    userType === 'buyer'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  Acheteur
                </button>
                <button
                  onClick={() => { setUserType('owner'); setActiveTab('overview'); }}
                  className={`px-6 py-2 font-medium transition-all ${
                    userType === 'owner'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  Propriétaire
                </button>
              </div>

              <button className="relative p-3 bg-white border border-gray-200 hover:border-emerald-600 transition-all">
                <BellIcon className="w-6 h-6 text-gray-700" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              <Link
                to="/contact"
                className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Nouvelle demande</span>
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-6">
              <nav className="space-y-2">
                {userType === 'buyer' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'overview'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChartBarIcon className="w-5 h-5" />
                      <span>Vue d'ensemble</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('saved')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'saved'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <HeartIcon className="w-5 h-5" />
                      <span>Biens sauvegardés</span>
                      <span className="ml-auto bg-emerald-100 text-emerald-800 px-2 py-1 text-xs font-semibold">
                        {buyerSavedProperties.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('searches')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'searches'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      <span>Mes recherches</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('appointments')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'appointments'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <CalendarIcon className="w-5 h-5" />
                      <span>Rendez-vous</span>
                      <span className="ml-auto bg-emerald-100 text-emerald-800 px-2 py-1 text-xs font-semibold">
                        {appointmentsData.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'messages'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <EnvelopeIcon className="w-5 h-5" />
                      <span>Messages</span>
                      <span className="ml-auto bg-red-500 text-white px-2 py-1 text-xs font-semibold">
                        {messages.filter(m => m.unread).length}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'overview'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChartBarIcon className="w-5 h-5" />
                      <span>Vue d'ensemble</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('properties')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'properties'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <HomeIcon className="w-5 h-5" />
                      <span>Mes propriétés</span>
                      <span className="ml-auto bg-emerald-100 text-emerald-800 px-2 py-1 text-xs font-semibold">
                        {ownerProperties.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'analytics'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChartPieIcon className="w-5 h-5" />
                      <span>Statistiques</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'inquiries'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <EnvelopeIcon className="w-5 h-5" />
                      <span>Demandes reçues</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                        activeTab === 'documents'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FolderOpenIcon className="w-5 h-5" />
                      <span>Documents</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleNavigationClick('profile')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 font-medium transition-all ${
                    activeTab === 'profile'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span>Profil</span>
                </button>
                <button
                  className="w-full text-left flex items-center gap-3 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <CogIcon className="w-5 h-5" />
                  <span>Paramètres</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {currentStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div 
                        key={index}
                        className="bg-white border border-gray-200 p-6 hover:border-emerald-600 transition-all"
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
                        <h3 className="text-xl font-bold text-gray-900">Biens sauvegardés récents</h3>
                        <button 
                          onClick={() => setActiveTab('saved')}
                          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                        >
                          Voir tout
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {buyerSavedProperties.map((property) => (
                          <div key={property.id} className="border border-gray-200 hover:border-emerald-600 transition-all group">
                            <div className="relative h-48 overflow-hidden">
                              <img 
                                src={property.image} 
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <button className="absolute top-4 right-4 w-10 h-10 bg-white flex items-center justify-center hover:bg-emerald-600 transition-all">
                                <HeartIconSolid className="w-5 h-5 text-red-500" />
                              </button>
                            </div>
                            <div className="p-4">
                              <h4 className="text-lg font-bold text-gray-900 mb-2">
                                {property.title}
                              </h4>
                              <div className="flex items-center text-gray-600 mb-3 gap-1">
                                <MapPinIcon className="w-4 h-4" />
                                <span className="text-sm">{property.location}</span>
                              </div>
                              <div className="text-2xl font-bold text-emerald-600 mb-4">
                                {property.price}
                              </div>
                              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                <span>{property.surface}</span>
                                <span>•</span>
                                <span>{property.bedrooms} ch.</span>
                                <span>•</span>
                                <span>{property.bathrooms} sdb</span>
                              </div>
                              <Link
                                to={`/properties/${property.id}`}
                                className="block w-full bg-emerald-600 text-white py-3 text-center font-medium hover:bg-emerald-700 transition-all"
                              >
                                Voir les détails
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
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Rechercher un bien</h4>
                        <p className="text-gray-600 text-sm">Parcourir notre catalogue de propriétés exclusives</p>
                      </Link>
                      <Link
                        to="/contact"
                        className="bg-white border border-gray-200 p-6 hover:border-emerald-600 transition-all group"
                      >
                        <ChatBubbleLeftIcon className="w-10 h-10 text-emerald-600 mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Contacter un conseiller</h4>
                        <p className="text-gray-600 text-sm">Un expert à votre écoute pour vous accompagner</p>
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
                        <h3 className="text-xl font-bold text-gray-900">Performances de vos biens</h3>
                        <button 
                          onClick={() => setActiveTab('properties')}
                          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
                        >
                          Gérer
                          <ArrowRightIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {ownerProperties.map((property) => (
                          <div key={property.id} className="border border-gray-200 p-4 hover:border-emerald-600 transition-all">
                            <div className="flex gap-4">
                              <img 
                                src={property.image} 
                                alt={property.title}
                                className="w-32 h-32 object-cover"
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
                                    <div className="text-sm text-gray-600">Vues</div>
                                    <div className="text-lg font-bold text-gray-900">{property.views}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">Favoris</div>
                                    <div className="text-lg font-bold text-gray-900">{property.favorites}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-600">Demandes</div>
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
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Ajouter une propriété</h4>
                        <p className="text-gray-600 text-sm">Mettre un nouveau bien en vente ou location</p>
                      </Link>
                      <Link
                        to="/contact"
                        className="bg-white border border-gray-200 p-6 hover:border-emerald-600 transition-all"
                      >
                        <DocumentChartBarIcon className="w-10 h-10 text-emerald-600 mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Demander une estimation</h4>
                        <p className="text-gray-600 text-sm">Obtenez une évaluation professionnelle gratuite</p>
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Biens sauvegardés</h3>
                    <p className="text-gray-600">{buyerSavedProperties.length} propriétés</p>
                  </div>
                  <select className="px-4 py-2 border border-gray-200 bg-white text-gray-700">
                    <option>Trier par date</option>
                    <option>Prix croissant</option>
                    <option>Prix décroissant</option>
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
                          <span>{property.bedrooms} chambres</span>
                          <span>•</span>
                          <span>{property.bathrooms} sdb</span>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            to={`/properties/${property.id}`}
                            className="flex-1 bg-emerald-600 text-white py-3 text-center font-medium hover:bg-emerald-700 transition-all"
                          >
                            Voir détails
                          </Link>
                          <Link
                            to="/contact"
                            className="flex-1 border border-emerald-600 text-emerald-600 py-3 text-center font-medium hover:bg-emerald-50 transition-all"
                          >
                            Contacter
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Mes recherches</h3>
                    <p className="text-gray-600">Gérez vos critères de recherche</p>
                  </div>
                  <Link
                    to="/properties"
                    className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all"
                  >
                    Nouvelle recherche
                  </Link>
                </div>

                <div className="space-y-4">
                  {buyerSearches.map((search) => (
                    <div key={search.id} className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{search.criteria}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{search.results} résultats</span>
                            <span>•</span>
                            <span>Créée le {search.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button className="px-4 py-2 border border-emerald-600 text-emerald-600 font-medium hover:bg-emerald-50 transition-all">
                            Modifier
                          </button>
                          <button className="px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all">
                            Voir résultats
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Mes propriétés</h3>
                    <p className="text-gray-600">{ownerProperties.length} biens actifs</p>
                  </div>
                  <Link
                    to="/selling"
                    className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un bien
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
                              <div className="text-sm text-gray-600 mb-1">Vues totales</div>
                              <div className="text-2xl font-bold text-gray-900">{property.views}</div>
                            </div>
                            <div className="bg-gray-50 p-4">
                              <div className="text-sm text-gray-600 mb-1">Mis en favoris</div>
                              <div className="text-2xl font-bold text-gray-900">{property.favorites}</div>
                            </div>
                            <div className="bg-gray-50 p-4">
                              <div className="text-sm text-gray-600 mb-1">Demandes reçues</div>
                              <div className="text-2xl font-bold text-gray-900">{property.inquiries}</div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button className="px-6 py-3 border border-emerald-600 text-emerald-600 font-medium hover:bg-emerald-50 transition-all">
                              Modifier
                            </button>
                            <button className="px-6 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all">
                              Voir statistiques
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Statistiques détaillées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Vues mensuelles</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">377</div>
                    <p className="text-gray-600 text-sm">+23% vs mois précédent</p>
                  </div>
                  <div className="border border-gray-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Taux de conversion</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">4.2%</div>
                    <p className="text-gray-600 text-sm">Visites → Demandes</p>
                  </div>
                  <div className="border border-gray-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Temps moyen</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">3m 42s</div>
                    <p className="text-gray-600 text-sm">Durée de consultation</p>
                  </div>
                  <div className="border border-gray-200 p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Position moyenne</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">#12</div>
                    <p className="text-gray-600 text-sm">Dans les résultats de recherche</p>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab (Both user types) */}
            {activeTab === 'appointments' && (
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Rendez-vous</h3>
                    <p className="text-gray-600">{appointmentsData.length} rendez-vous à venir</p>
                  </div>
                  <Link
                    to="/contact"
                    className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all"
                  >
                    Planifier un rendez-vous
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
                              {appt.date} à {appt.time}
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
                            appt.status === 'Confirmé' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appt.status}
                          </span>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:border-emerald-600 hover:text-emerald-600 transition-all">
                              Modifier
                            </button>
                            <button className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 transition-all">
                              Annuler
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Messages</h3>
                    <p className="text-gray-600">{messages.filter(m => m.unread).length} messages non lus</p>
                  </div>
                  <button className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <EnvelopeIcon className="w-5 h-5" />
                    Nouveau message
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
                                NOUVEAU
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{message.role}</p>
                          <p className="text-gray-700">{message.content}</p>
                        </div>
                        <span className="text-sm text-gray-500">Il y a {message.time}</span>
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Demandes reçues</h3>
                    <p className="text-gray-600">Gérez les demandes d'information sur vos biens</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">Demande de visite</h4>
                        <p className="text-sm text-gray-600">Ma Villa Méditerranéenne - Nice</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 text-sm font-semibold">
                        Nouvelle
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">Client intéressé pour une visite ce weekend. Disponibilité samedi matin?</p>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all">
                        Répondre
                      </button>
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-emerald-600 transition-all">
                        Voir détails
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">Question sur le bien</h4>
                        <p className="text-sm text-gray-600">Appartement Centre Ville - Lyon</p>
                      </div>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 text-sm font-semibold">
                        Traitée
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">Le parking est-il inclus dans le loyer?</p>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:border-emerald-600 transition-all">
                        Voir la réponse
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Documents</h3>
                    <p className="text-gray-600">Gérez vos documents administratifs</p>
                  </div>
                  <button className="bg-emerald-600 text-white px-6 py-3 font-medium hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <PlusIcon className="w-5 h-5" />
                    Ajouter un document
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <DocumentTextIcon className="w-12 h-12 text-emerald-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">Diagnostics</h4>
                    <p className="text-sm text-gray-600 mb-4">DPE, Amiante, Plomb...</p>
                    <button className="w-full bg-emerald-600 text-white py-2 hover:bg-emerald-700 transition-all">
                      Voir (3)
                    </button>
                  </div>
                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <DocumentTextIcon className="w-12 h-12 text-emerald-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">Contrats</h4>
                    <p className="text-sm text-gray-600 mb-4">Baux, Mandats...</p>
                    <button className="w-full bg-emerald-600 text-white py-2 hover:bg-emerald-700 transition-all">
                      Voir (2)
                    </button>
                  </div>
                  <div className="border border-gray-200 p-6 hover:border-emerald-600 transition-all">
                    <DocumentTextIcon className="w-12 h-12 text-emerald-600 mb-4" />
                    <h4 className="font-bold text-gray-900 mb-2">Titres de propriété</h4>
                    <p className="text-sm text-gray-600 mb-4">Actes notariés...</p>
                    <button className="w-full bg-emerald-600 text-white py-2 hover:bg-emerald-700 transition-all">
                      Voir (1)
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