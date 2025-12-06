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
  ShieldCheckIcon,
  StarIcon,
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
  CheckBadgeIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  CheckBadgeIcon as CheckBadgeIconSolid,
  EyeIcon as EyeIconSolid
} from '@heroicons/react/24/solid';
import UserProfile from '../../components/UserProfile';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  
  // Sample appointments and requests data
  const appointmentsData = [
    {
      id: 1,
      title: 'Visite - Villa Les Oliviers',
      date: '2025-11-10',
      time: '14:00',
      location: 'Saint-Tropez',
      status: 'Confirmed',
      advisor: 'Sophie Laurent'
    },
    {
      id: 2,
      title: 'Visite - Appartement Haussmannien',
      date: '2025-11-15',
      time: '11:00',
      location: 'Paris 8ème',
      status: 'Pending',
      advisor: 'Thomas Moreau'
    }
  ];

  const requestsData = [
    {
      id: 'REQ-001',
      type: 'Estimation',
      created: '2025-10-02',
      status: 'En cours',
      summary: 'Demande d\'estimation pour appartement Paris 8ème'
    },
    {
      id: 'REQ-002',
      type: 'Visite privée',
      created: '2025-09-28',
      status: 'Traitée',
      summary: 'Organisation d\'une visite privée pour une villa'
    }
  ];

  // Mock data with premium images
  const savedProperties = [
    { 
      id: 1, 
      title: 'Villa Les Oliviers', 
      location: 'Saint-Tropez', 
      price: '2,500,000 €',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600',
      type: 'buy',
      surface: '420 m²',
      bedrooms: 6,
      bathrooms: 5,
      featured: true,
      lastViewed: '2 hours ago'
    },
    { 
      id: 2, 
      title: 'Appartement Haussmannien', 
      location: 'Paris 8ème', 
      price: '15,000 €/mois',
      image: 'https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=600',
      type: 'rent',
      surface: '180 m²',
      bedrooms: 3,
      bathrooms: 2,
      featured: false,
      lastViewed: '1 day ago'
    },
    { 
      id: 3, 
      title: 'Domaine Provençal Historique', 
      location: 'Gordes', 
      price: '4,800,000 €',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600',
      type: 'buy',
      surface: '650 m²',
      bedrooms: 8,
      bathrooms: 6,
      featured: true,
      lastViewed: '3 days ago'
    }
  ];

  const recentActivity = [
    { 
      type: 'view', 
      property: 'Villa Les Oliviers', 
      date: '2024-01-15', 
      time: '14:30',
      icon: EyeIcon,
      color: 'text-blue-500'
    },
    { 
      type: 'saved', 
      property: 'Appartement Haussmannien', 
      date: '2024-01-14', 
      time: '11:15',
      icon: HeartIcon,
      color: 'text-red-500'
    },
    { 
      type: 'contact', 
      property: 'Domaine Provençal', 
      date: '2024-01-12', 
      time: '09:45',
      icon: ChatBubbleLeftIcon,
      color: 'text-green-500'
    },
    { 
      type: 'appointment', 
      property: 'Villa Baie des Anges', 
      date: '2024-01-10', 
      time: '16:20',
      icon: CalendarIcon,
      color: 'text-purple-500'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sophie Laurent',
      role: 'Directrice des Ventes',
      content: 'Bonjour, je vous recontacte concernant votre visite de la Villa Les Oliviers...',
      time: '2 hours ago',
      unread: true,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      sender: 'Thomas Moreau',
      role: 'Responsable Conciergerie',
      content: 'Votre demande de services conciergerie a bien été prise en compte...',
      time: '1 day ago',
      unread: false,
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const stats = [
    { 
      label: 'Biens Sauvegardés', 
      value: '12', 
      change: '+2', 
      icon: HeartIcon,
      color: 'from-red-500 to-pink-600',
      trend: 'up'
    },
    { 
      label: 'Visites Programméees', 
      value: '3', 
      change: '+1', 
      icon: CalendarIcon,
      color: 'from-purple-500 to-indigo-600',
      trend: 'up'
    },
    { 
      label: 'Messages Non Lus', 
      value: '5', 
      change: '-2', 
      icon: EnvelopeIcon,
      color: 'from-blue-500 to-cyan-600',
      trend: 'down'
    },
    { 
      label: 'Favoris Experts', 
      value: '8', 
      change: '+3', 
      icon: StarIcon,
      color: 'from-amber-500 to-orange-600',
      trend: 'up'
    }
  ];

  const userProfile = {
    name: 'Jean Dupont',
    membership: 'Premium Client',
    since: '2023',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    completion: 85,
    nextAppointment: '2024-01-20 à 14:00',
    advisor: 'Sophie Laurent'
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Function to handle opening UserProfile
  const handleOpenUserProfile = () => {
    setIsUserProfileOpen(true);
  };

  // Function to handle closing UserProfile
  const handleCloseUserProfile = () => {
    setIsUserProfileOpen(false);
    // When profile closed, switch back to overview tab
    setActiveTab('overview');
  };

  // Handle navigation item clicks
  const handleNavigationClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'profile') {
      handleOpenUserProfile();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gold"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-t-2 border-deep-green rounded-full animate-spin reverse"></div>
            </div>
          </div>
          <p className="mt-4 font-didot text-deep-green text-lg">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-amber-50 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-inter uppercase text-deep-green mb-4">
              Mon Espace Privé
            </h1>
            <p className="text-xl font-didot text-gray-600 max-w-2xl">
              Bienvenue dans votre espace personnel Square Meter, {userProfile.name}
            </p>
          </div>
          
          {/* Notifications & Quick Actions */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button className="relative p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gold/20 hover:shadow-xl transition-all duration-300 group">
              <BellIcon className="w-6 h-6 text-deep-green group-hover:text-gold transition-colors duration-300" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-ivory text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-6 py-3 rounded-2xl font-inter uppercase tracking-wide hover:from-amber-500 hover:to-gold transition-all duration-500 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Nouvelle Demande</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sticky top-8 border border-gold/20">
              {/* User Profile Card */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-gold shadow-lg mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckBadgeIconSolid className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-inter uppercase text-deep-green text-xl mb-1">{userProfile.name}</h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ShieldCheckIcon className="w-4 h-4 text-gold" />
                  <p className="font-didot text-gold text-sm">{userProfile.membership}</p>
                </div>
                <p className="font-didot text-gray-600 text-sm">Membre depuis {userProfile.since}</p>
                
                {/* Profile Completion */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Profil complété</span>
                    <span>{userProfile.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-gold to-amber-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${userProfile.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon, badge: null },
                  { id: 'properties', label: 'Biens sauvegardés', icon: HeartIcon, badge: savedProperties.length },
                  { id: 'requests', label: 'Mes demandes', icon: DocumentTextIcon, badge: '3' },
                  { id: 'messages', label: 'Messages', icon: EnvelopeIcon, badge: messages.filter(m => m.unread).length },
                  { id: 'appointments', label: 'Rendez-vous', icon: CalendarIcon, badge: '2' },
                  { id: 'profile', label: 'Profil', icon: UserCircleIcon, badge: null },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigationClick(item.id)}
                      className={`w-full text-left flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-deep-green to-emerald-800 text-ivory shadow-lg transform scale-105'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-gold/10 hover:to-transparent hover:border hover:border-gold/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-5 h-5 ${activeTab === item.id ? 'text-ivory' : 'text-gold'} transition-colors duration-300`} />
                        <span className="font-didot">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-1 rounded-full text-xs font-inter ${
                          activeTab === item.id 
                            ? 'bg-ivory text-deep-green' 
                            : 'bg-gold text-deep-green'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Next Appointment */}
              <div className="mt-8 pt-6 border-t border-gold/30">
                <div className="text-center">
                  <p className="font-didot text-gray-600 text-sm mb-2">Prochain rendez-vous</p>
                  <p className="font-inter text-deep-green text-sm mb-1">{userProfile.nextAppointment}</p>
                  <p className="font-didot text-gold text-xs">avec {userProfile.advisor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div 
                        key={index}
                        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gold/20 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className={`flex items-center space-x-1 text-sm font-inter ${
                            stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            <ArrowTrendingUpIcon className={`w-4 h-4 ${stat.trend === 'down' ? 'transform rotate-180' : ''}`} />
                            <span>{stat.change}</span>
                          </div>
                        </div>
                        <div className="text-3xl font-inter text-deep-green font-light mb-1">
                          {stat.value}
                        </div>
                        <div className="font-didot text-gray-600 text-sm">
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gold/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-inter uppercase text-deep-green text-xl">Activité Récente</h3>
                      <Link to="/activity" className="text-gold hover:text-deep-green font-inter uppercase text-sm transition-colors duration-300">
                        Voir tout
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => {
                        const IconComponent = activity.icon;
                        return (
                          <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-300 group">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                <IconComponent className={`w-5 h-5 ${activity.color}`} />
                              </div>
                              <div>
                                <div className="font-didot text-gray-700">{activity.property}</div>
                                <div className="font-didot text-gray-500 text-sm capitalize">
                                  {activity.type === 'view' && 'Consulté'}
                                  {activity.type === 'saved' && 'Sauvegardé'}
                                  {activity.type === 'contact' && 'Contacté'}
                                  {activity.type === 'appointment' && 'Rendez-vous programmé'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-didot text-gray-500 text-sm">{activity.date}</div>
                              <div className="font-didot text-gray-400 text-xs">{activity.time}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gold/20">
                    <h3 className="font-inter uppercase text-deep-green text-xl mb-6">Actions Rapides</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <Link
                        to="/properties"
                        className="flex items-center space-x-4 p-4 rounded-2xl border-2 border-gold/30 hover:border-gold hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-500 transform hover:scale-105 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <MagnifyingGlassIcon className="w-6 h-6 text-deep-green" />
                        </div>
                        <div className="flex-1">
                          <div className="font-inter uppercase text-deep-green group-hover:text-gold transition-colors duration-300">
                            Rechercher un bien
                          </div>
                          <div className="font-didot text-gray-600 text-sm">Parcourir nos propriétés exclusives</div>
                        </div>
                        <ArrowTrendingUpIcon className="w-5 h-5 text-gold transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                      
                      <Link
                        to="/contact"
                        className="flex items-center space-x-4 p-4 rounded-2xl border-2 border-gold/30 hover:border-gold hover:bg-gradient-to-r hover:from-gold/5 hover:to-transparent transition-all duration-500 transform hover:scale-105 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <ChatBubbleLeftIcon className="w-6 h-6 text-deep-green" />
                        </div>
                        <div className="flex-1">
                          <div className="font-inter uppercase text-deep-green group-hover:text-gold transition-colors duration-300">
                            Contacter un conseiller
                          </div>
                          <div className="font-didot text-gray-600 text-sm">Expertise personnalisée</div>
                        </div>
                        <ArrowTrendingUpIcon className="w-5 h-5 text-gold transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Featured Saved Properties */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gold/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-inter uppercase text-deep-green text-xl">Vos Biens Favoris</h3>
                    <Link to="/dashboard?tab=properties" className="text-gold hover:text-deep-green font-inter uppercase text-sm transition-colors duration-300">
                      Voir tous ({savedProperties.length})
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedProperties.slice(0, 2).map((property) => (
                      <div key={property.id} className="group bg-gradient-to-br from-white to-ivory rounded-2xl shadow-lg overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gold/20">
                        <div className="relative overflow-hidden h-48">
                          <img 
                            src={property.image} 
                            alt={property.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex space-x-2">
                            {property.featured && (
                              <span className="bg-gold text-deep-green px-3 py-1 font-inter uppercase text-xs tracking-wide rounded-full shadow-lg">
                                EXCLUSIF
                              </span>
                            )}
                            <span className={`px-3 py-1 font-inter uppercase text-xs tracking-wide rounded-full shadow-lg ${
                              property.type === 'buy' 
                                ? 'bg-blue-500 text-ivory' 
                                : 'bg-green-500 text-ivory'
                            }`}>
                              {property.type === 'buy' ? 'À VENDRE' : 'À LOUER'}
                            </span>
                          </div>

                          {/* Favorite Button */}
                          <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold">
                            <HeartIconSolid className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                        
                        <div className="p-6">
                          <h4 className="font-inter uppercase text-deep-green text-lg mb-2 group-hover:text-gold transition-colors duration-300">
                            {property.title}
                          </h4>
                          <div className="flex items-center text-gray-600 mb-3">
                            <MapPinIcon className="w-4 h-4 mr-2" />
                            <span className="font-didot">{property.location}</span>
                          </div>
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-didot text-gold font-semibold">
                              {property.price}
                            </span>
                            <span className="font-didot text-gray-600 text-sm">
                              {property.surface} • {property.bedrooms} ch.
                            </span>
                          </div>

                          <div className="flex space-x-2">
                            <Link
                              to={`/properties/${property.id}`}
                              className="flex-1 bg-deep-green text-ivory py-3 rounded-xl font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-all duration-300 transform hover:scale-105 text-center text-sm"
                            >
                              Voir détail
                            </Link>
                            <button className="px-4 py-3 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 transform hover:scale-105">
                              <XMarkIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gold/20">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-inter uppercase text-deep-green text-2xl mb-2">Vos Biens Sauvegardés</h3>
                    <p className="font-didot text-gray-600">{savedProperties.length} propriétés sauvegardées</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select className="px-4 py-3 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot bg-white/50 backdrop-blur-sm">
                      <option>Trier par</option>
                      <option>Récents</option>
                      <option>Prix croissant</option>
                      <option>Prix décroissant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {savedProperties.map((property) => (
                    <div key={property.id} className="group bg-gradient-to-br from-white to-ivory rounded-2xl shadow-lg overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gold/20">
                      <div className="relative overflow-hidden h-64">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex space-x-2">
                          {property.featured && (
                            <span className="bg-gold text-deep-green px-3 py-1 font-inter uppercase text-xs tracking-wide rounded-full shadow-lg">
                              EXCLUSIF
                            </span>
                          )}
                          <span className={`px-3 py-1 font-inter uppercase text-xs tracking-wide rounded-full shadow-lg ${
                            property.type === 'buy' 
                              ? 'bg-blue-500 text-ivory' 
                              : 'bg-green-500 text-ivory'
                          }`}>
                            {property.type === 'buy' ? 'À VENDRE' : 'À LOUER'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gold transition-colors duration-300">
                            <EyeIcon className="w-5 h-5 text-ivory" />
                          </button>
                          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors duration-300">
                            <XMarkIcon className="w-5 h-5 text-ivory" />
                          </button>
                        </div>

                        {/* Last Viewed */}
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-black/50 text-ivory px-3 py-1 rounded-full font-didot text-xs backdrop-blur-sm">
                            Vu {property.lastViewed}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h4 className="font-inter uppercase text-deep-green text-xl mb-3 group-hover:text-gold transition-colors duration-300">
                          {property.title}
                        </h4>
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          <span className="font-didot">{property.location}</span>
                        </div>
                        
                        {/* Property Features */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-ivory rounded-xl">
                            <BuildingStorefrontIcon className="w-6 h-6 text-gold mx-auto mb-1" />
                            <div className="font-inter text-deep-green font-semibold">{property.surface}</div>
                            <div className="font-didot text-gray-600 text-xs">Surface</div>
                          </div>
                          <div className="text-center p-3 bg-ivory rounded-xl">
                            <div className="w-6 h-6 text-gold mx-auto mb-1">🛏️</div>
                            <div className="font-inter text-deep-green font-semibold">{property.bedrooms}</div>
                            <div className="font-didot text-gray-600 text-xs">Chambres</div>
                          </div>
                          <div className="text-center p-3 bg-ivory rounded-xl">
                            <div className="w-6 h-6 text-gold mx-auto mb-1">🛁</div>
                            <div className="font-inter text-deep-green font-semibold">{property.bathrooms}</div>
                            <div className="font-didot text-gray-600 text-xs">SDB</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-didot text-gold font-semibold">
                            {property.price}
                          </span>
                          <div className="flex space-x-2">
                            <Link
                              to={`/properties/${property.id}`}
                              className="bg-deep-green text-ivory px-6 py-3 rounded-xl font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-all duration-300 transform hover:scale-105 text-sm"
                            >
                              Découvrir
                            </Link>
                            <Link
                              to="/contact"
                              className="border-2 border-deep-green text-deep-green px-6 py-3 rounded-xl font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-all duration-300 transform hover:scale-105 text-sm"
                            >
                              Contacter
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gold/20">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-inter uppercase text-deep-green text-2xl mb-2">Messages</h3>
                    <p className="font-didot text-gray-600">{messages.filter(m => m.unread).length} messages non lus</p>
                  </div>
                  <button className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-6 py-3 rounded-2xl font-inter uppercase tracking-wide hover:from-amber-500 hover:to-gold transition-all duration-500 transform hover:scale-105 flex items-center space-x-2">
                    <EnvelopeIcon className="w-5 h-5" />
                    <span>Nouveau message</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex items-start space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      message.unread 
                        ? 'border-gold bg-gradient-to-r from-gold/5 to-transparent shadow-lg' 
                        : 'border-gold/30 hover:border-gold'
                    }`}>
                      <img
                        src={message.avatar}
                        alt={message.sender}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-gold"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-inter uppercase text-deep-green">{message.sender}</h4>
                            {message.unread && (
                              <span className="bg-red-500 text-ivory px-2 py-1 rounded-full text-xs font-inter animate-pulse">
                                NOUVEAU
                              </span>
                            )}
                          </div>
                          <span className="font-didot text-gray-500 text-sm">{message.time}</span>
                        </div>
                        <p className="font-didot text-gray-600 text-sm mb-1">{message.role}</p>
                        <p className="font-didot text-gray-700">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requests Tab - Mes demandes */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-inter uppercase text-deep-green text-2xl mb-1">Mes demandes</h3>
                    <p className="font-didot text-gray-600">Suivez l'avancement de toutes vos demandes auprès de notre équipe</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-4 py-2 rounded-2xl font-inter uppercase text-sm shadow-lg">Nouvelle demande</button>
                    <select className="px-3 py-2 border-2 border-gold/30 rounded-2xl bg-white/50">
                      <option>Toutes</option>
                      <option>En cours</option>
                      <option>Traitée</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/80 rounded-3xl p-6 shadow-2xl border border-gold/20">
                    <h4 className="font-inter uppercase text-deep-green text-lg mb-4">Résumé</h4>
                    <div className="space-y-3">
                      {requestsData.map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl border border-gold/20">
                          <div>
                            <div className="font-inter font-semibold text-deep-green">{req.type} • {req.id}</div>
                            <div className="font-didot text-gray-600 text-sm">{req.summary}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm ${req.status === 'En cours' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{req.status}</span>
                            <button className="px-3 py-2 bg-deep-green text-ivory rounded-xl text-sm">Détails</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-3xl p-6 shadow-2xl border border-gold/20">
                    <h4 className="font-inter uppercase text-deep-green text-lg mb-4">Historique & Notes</h4>
                    <p className="font-didot text-gray-600 mb-4">Commentaires récents de votre conseiller et statut des actions requises.</p>
                    <div className="space-y-3">
                      <div className="p-4 bg-ivory rounded-2xl border border-gold/20">Réponse de Sophie: Nous avons bien reçu votre demande, un conseiller vous contacte sous 24h.</div>
                      <div className="p-4 bg-ivory rounded-2xl border border-gold/20">Note interne: Vérifier documents de financement.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab - Rendez-vous */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-inter uppercase text-deep-green text-2xl mb-1">Rendez-vous</h3>
                    <p className="font-didot text-gray-600">Gérez vos visites et rendez-vous — confirmez, replanifiez ou annulez en un clic.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-4 py-2 rounded-2xl font-inter uppercase text-sm shadow-lg">Planifier un rendez-vous</button>
                    <select className="px-3 py-2 border-2 border-gold/30 rounded-2xl bg-white/50">
                      <option>A venir</option>
                      <option>Passés</option>
                      <option>Tous</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {appointmentsData.map((appt) => (
                      <div key={appt.id} className="bg-white/80 rounded-3xl p-6 shadow-2xl border border-gold/20 flex items-center justify-between">
                        <div>
                          <div className="text-lg font-inter font-semibold text-deep-green">{appt.title}</div>
                          <div className="text-sm font-didot text-gray-600">{appt.date} • {appt.time} • {appt.location}</div>
                          <div className="text-sm font-didot text-gray-500 mt-2">Conseiller: {appt.advisor}</div>
                        </div>
                        <div className="flex flex-col items-end space-y-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{appt.status}</span>
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 border border-gold text-gold rounded-xl">Replanifier</button>
                            <button className="px-4 py-2 bg-red-500 text-ivory rounded-xl">Annuler</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/80 rounded-3xl p-6 shadow-2xl border border-gold/20">
                    <h4 className="font-inter uppercase text-deep-green text-lg mb-4">Calendrier</h4>
                    <p className="font-didot text-gray-600 mb-4">Prochaine disponibilité: 2025-11-20</p>
                    <div className="bg-ivory rounded-2xl p-4 text-center text-sm text-gray-700">Mini calendrier (placeholder) — intégré au calendrier principal bientôt</div>
                  </div>
                </div>
              </div>
            )}
            {/* Add other tabs similarly with the same premium design */}
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