// src/pages/TravelerSpace.tsx
import React, { useState, useEffect } from 'react';
import { 
  KeyIcon,
  WifiIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  StarIcon,
  GiftIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  SparklesIcon as SparklesIconSolid,
  TruckIcon
} from '@heroicons/react/24/solid';

const TravelerSpace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCodes, setShowCodes] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 22, condition: 'Ensoleillé' });

  // Mock booking data
  const booking = {
    property: "Villa Les Oliviers",
    location: "Saint-Tropez, Côte d'Azur",
    checkIn: "2024-06-15",
    checkOut: "2024-06-22",
    guests: 4,
    confirmation: "SM240615XZ"
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsAuthenticated(true);
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: SparklesIcon },
    { id: 'checkin', label: 'Check-in/out', icon: CalendarIcon },
    { id: 'privilege', label: 'Carte Privilège', icon: StarIcon },
    { id: 'conciergerie', label: 'Conciergerie', icon: UserGroupIcon },
    { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
    { id: 'local', label: 'Guide Local', icon: MapPinIcon }
  ];

  
  const privilegePartners = [
    { name: 'Restaurant Étoilé', discount: '15%', category: 'RESTAURANT', icon: SparklesIconSolid },
    { name: 'Spa Prestige', discount: '20%', category: 'BIEN-ÊTRE', icon: SparklesIcon },
    { name: 'Location Yacht', discount: '10%', category: 'NAUTIQUE', icon: TruckIcon },
    { name: 'Boutique Luxe', discount: '15%', category: 'SHOPPING', icon: ShoppingBagIcon },
    { name: 'Golf Privé', discount: '25%', category: 'SPORT', icon: MapPinIcon },
    { name: 'Transfer VIP', discount: '30%', category: 'TRANSPORT', icon: TruckIcon }
  ];

  const conciergeServices = [
    { name: 'Restaurant', icon: SparklesIconSolid, available: true },
    { name: 'Transport', icon: TruckIcon, available: true },
    { name: 'Spa & Bien-être', icon: SparklesIcon, available: true },
    { name: 'Activités', icon: MapPinIcon, available: true },
    { name: 'Shopping', icon: ShoppingBagIcon, available: true },
    { name: 'Événements', icon: CalendarIcon, available: false }
  ];
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-amber-50 py-8">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Enhanced Header */}
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="text-9xl font-didot">M²</div>
            </div>
            <h1 className="text-6xl md:text-7xl font-inter uppercase text-deep-green mb-6 relative">
              Espace Voyageurs
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-amber-600 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl font-didot text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Accédez à votre séjour d'exception et découvrez tous les services Square Meter à votre disposition
            </p>
          </div>

          {/* Enhanced Authentication Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-gold/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-deep-green"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl"></div>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <KeyIcon className="w-10 h-10 text-deep-green" />
                </div>
                <h2 className="text-4xl font-inter uppercase text-deep-green mb-4">
                  Accès à Votre Séjour
                </h2>
                <p className="font-didot text-gray-600 text-lg">
                  Entrez votre email pour recevoir votre lien d'accès sécurisé
                </p>
              </div>

              <form onSubmit={handleMagicLink} className="space-y-6">
                <div className="group">
                  <label className="block font-inter uppercase text-deep-green text-sm mb-3">
                    Votre email de réservation
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vip@example.com"
                    className="w-full px-6 py-5 border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot text-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gold"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gold to-amber-600 text-deep-green py-5 font-inter uppercase tracking-wide hover:from-amber-500 hover:to-gold transition-all duration-500 transform hover:scale-105 rounded-2xl text-lg font-semibold relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-deep-green"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIconSolid className="w-6 h-6" />
                        <span>Recevoir mon lien magique</span>
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Security Assurance */}
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-gold" />
                  <span className="font-didot text-sm">Connexion 100% sécurisée • Données cryptées</span>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { icon: KeyIcon, title: 'Accès Immédiat', description: 'Codes et instructions dès connexion' },
                { icon: StarIcon, title: 'Avantages Exclusifs', description: 'Offres partenaires privilégiées' },
                { icon: UserGroupIcon, title: 'Conciergerie 24/7', description: 'Assistance personnalisée' }
              ].map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <feature.icon className="w-8 h-8 text-deep-green" />
                  </div>
                  <h3 className="font-inter uppercase text-deep-green text-sm mb-2">{feature.title}</h3>
                  <p className="font-didot text-gray-600 text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-amber-50 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Enhanced Header with Booking Info */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-9xl font-didot">M²</div>
          </div>
          <h1 className="text-6xl md:text-7xl font-inter uppercase text-deep-green mb-6 relative">
            Espace Voyageurs
          </h1>
          
          {/* Booking Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gold/20 max-w-4xl mx-auto shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-didot text-deep-green font-semibold">{booking.property}</div>
                <div className="font-didot text-gray-600 flex items-center justify-center lg:justify-start mt-1">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {booking.location}
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-inter uppercase text-deep-green text-sm mb-1">CHECK-IN</div>
                <div className="font-didot text-gold text-lg font-semibold">{booking.checkIn}</div>
                <div className="font-didot text-gray-600 text-sm">À partir de 16h</div>
              </div>
              
              <div className="text-center">
                <div className="font-inter uppercase text-deep-green text-sm mb-1">CHECK-OUT</div>
                <div className="font-didot text-gold text-lg font-semibold">{booking.checkOut}</div>
                <div className="font-didot text-gray-600 text-sm">Avant 11h</div>
              </div>
              
              <div className="text-center">
                <div className="font-inter uppercase text-deep-green text-sm mb-1">CONFIRMATION</div>
                <div className="font-didot text-gray-700 text-sm">{booking.confirmation}</div>
                <div className="font-didot text-gray-600 text-sm">{booking.guests} voyageur(s)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl mb-12 border border-gold/20">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 py-6 font-inter uppercase transition-all duration-500 flex items-center justify-center space-x-3 group relative ${
                    isActive 
                      ? 'text-deep-green' 
                      : 'text-gray-500 hover:text-gold'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-gold scale-125' : 'bg-transparent group-hover:bg-gold/50'
                  }`}></div>
                  <TabIcon className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="text-sm whitespace-nowrap">{tab.label}</span>
                  
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-gold to-amber-600 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8 lg:p-12">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Welcome & Time */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-gradient-to-br from-deep-green to-forest-green rounded-2xl p-8 text-ivory relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <h2 className="text-3xl font-inter uppercase mb-4">Bienvenue à {booking.property}</h2>
                    <p className="font-didot text-ivory/80 text-lg mb-6">
                      Votre séjour d'exception commence maintenant. Profitez de chaque instant.
                    </p>
                    <div className="flex items-center space-x-6">
                      <div className="text-4xl font-light font-didot">
                        {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="w-px h-12 bg-ivory/30"></div>
                      <div>
                        <div className="font-didot">{currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                        <div className="font-didot text-gold">{weather.temp}°C • {weather.condition}</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <button className="w-full bg-gradient-to-r from-gold to-amber-600 text-deep-green py-4 rounded-xl font-inter uppercase tracking-wide hover:from-amber-500 hover:to-gold transition-all duration-500 transform hover:scale-105 flex items-center justify-center space-x-3">
                      <PhoneIcon className="w-5 h-5" />
                      <span>Assistance Immédiate</span>
                    </button>
                    <button className="w-full border-2 border-deep-green text-deep-green py-4 rounded-xl font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-all duration-500 transform hover:scale-105 flex items-center justify-center space-x-3">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      <span>Signaler un Incident</span>
                    </button>
                  </div>
                </div>

                {/* Essential Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Access Codes */}
                  <div className="bg-gradient-to-br from-ivory to-white rounded-2xl p-6 border border-gold/20 hover:border-gold transition-all duration-500 transform hover:-translate-y-2 group">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-inter uppercase text-deep-green flex items-center space-x-3">
                        <KeyIcon className="w-6 h-6 text-gold" />
                        <span>Codes d'Accès</span>
                      </h3>
                      <button 
                        onClick={() => setShowCodes(!showCodes)}
                        className="text-gold hover:text-deep-green transition-colors duration-300"
                      >
                        {showCodes ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gold/30">
                        <span className="font-didot text-gray-600">Portail Principal</span>
                        <span className="font-inter text-deep-green font-mono text-lg">
                          {showCodes ? '1234' : '••••'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gold/30">
                        <span className="font-didot text-gray-600">Appartement</span>
                        <span className="font-inter text-deep-green font-mono text-lg">
                          {showCodes ? '5678' : '••••'}
                        </span>
                      </div>
                    </div>
                    <button className="w-full mt-4 flex items-center justify-center space-x-2 text-gold hover:text-deep-green transition-colors duration-300 group/btn">
                      <QrCodeIcon className="w-5 h-5" />
                      <span className="font-inter uppercase text-sm">Afficher QR Codes</span>
                    </button>
                  </div>

                  {/* WiFi */}
                  <div className="bg-gradient-to-br from-ivory to-white rounded-2xl p-6 border border-gold/20 hover:border-gold transition-all duration-500 transform hover:-translate-y-2 group">
                    <h3 className="font-inter uppercase text-deep-green mb-4 flex items-center space-x-3">
                      <WifiIcon className="w-6 h-6 text-gold" />
                      <span>Connexion WiFi</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-gold/30">
                        <div className="font-didot text-gray-600 text-sm">Réseau</div>
                        <div className="font-inter text-deep-green">SquareMeter_Premium</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gold/30">
                        <div className="font-didot text-gray-600 text-sm">Mot de passe</div>
                        <div className="font-inter text-deep-green font-mono">Luxe2024!</div>
                      </div>
                    </div>
                    <button className="w-full mt-4 flex items-center justify-center space-x-2 text-gold hover:text-deep-green transition-colors duration-300">
                      <QrCodeIcon className="w-5 h-5" />
                      <span className="font-inter uppercase text-sm">Connexion QR Code</span>
                    </button>
                  </div>

                  {/* Check-in Progress */}
                  <div className="bg-gradient-to-br from-ivory to-white rounded-2xl p-6 border border-gold/20 hover:border-gold transition-all duration-500 transform hover:-translate-y-2 group">
                    <h3 className="font-inter uppercase text-deep-green mb-4 flex items-center space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-gold" />
                      <span>Check-in Digital</span>
                    </h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, label: 'Profil Complété', completed: true },
                        { step: 2, label: 'Paiement Validé', completed: true },
                        { step: 3, label: 'Documents Signés', completed: true },
                        { step: 4, label: 'Prêt à Arriver', completed: false }
                      ].map((item) => (
                        <div key={item.step} className="flex items-center space-x-3">
                          {item.completed ? (
                            <CheckCircleIconSolid className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          )}
                          <span className={`font-didot ${item.completed ? 'text-gray-700' : 'text-gray-400'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 bg-deep-green text-ivory py-3 rounded-xl font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-all duration-300 transform hover:scale-105">
                      Finaliser Check-in
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privilege Card Tab */}
            {activeTab === 'privilege' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-inter uppercase text-deep-green mb-4">
                    Carte Privilège Square Meter
                  </h2>
                  <p className="font-didot text-gray-600 text-xl max-w-2xl mx-auto">
                    Découvrez nos partenaires d'exception et bénéficiez d'avantages exclusifs durant votre séjour
                  </p>
                </div>

                {/* Privilege Card */}
                <div className="bg-gradient-to-br from-gold to-amber-600 rounded-3xl p-8 text-deep-green max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="font-inter uppercase text-sm opacity-80">CARTE PRIVILÈGE</div>
                        <div className="font-didot text-2xl font-semibold">VIP {booking.confirmation}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-inter uppercase text-sm opacity-80">VALIDE JUSQU'AU</div>
                        <div className="font-didot text-lg">{booking.checkOut}</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                      <div className="font-inter uppercase text-sm mb-2">AVANTAGES EXCLUSIFS</div>
                      <div className="font-didot text-lg">Accès aux partenaires premium • Remises exceptionnelles • Services VIP</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="font-didot text-sm">Square Meter Experience</div>
                      <StarIconSolid className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* Partners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                  {privilegePartners.map((partner, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 border border-gold/20 hover:border-gold transition-all duration-500 transform hover:-translate-y-2 group">
                      <div className="flex items-center justify-between mb-4">
                        <partner.icon className="w-8 h-8 text-gold" />
                        <span className="bg-gold/10 text-gold px-3 py-1 rounded-full font-inter uppercase text-xs">
                          {partner.discount} OFF
                        </span>
                      </div>
                      <h3 className="font-inter uppercase text-deep-green text-lg mb-2">{partner.name}</h3>
                      <div className="bg-ivory text-deep-green px-3 py-1 rounded-full font-inter uppercase text-xs inline-block mb-4">
                        {partner.category}
                      </div>
                      <p className="font-didot text-gray-600 text-sm mb-4">
                        Présentez votre carte privilège pour bénéficier de votre remise exclusive
                      </p>
                      <button className="w-full border-2 border-deep-green text-deep-green py-2 rounded-xl font-inter uppercase text-sm tracking-wide hover:bg-deep-green hover:text-ivory transition-all duration-300 transform hover:scale-105">
                        Voir les détails
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conciergerie Tab */}
            {activeTab === 'conciergerie' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-inter uppercase text-deep-green mb-4">
                    Conciergerie 24/7
                  </h2>
                  <p className="font-didot text-gray-600 text-xl max-w-2xl mx-auto">
                    Notre équipe dédiée est à votre disposition pour rendre votre séjour inoubliable
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Services Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {conciergeServices.map((service, index) => {
                      const ServiceIcon = service.icon;
                      return (
                        <button
                          key={index}
                          className={`p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center space-y-3 ${
                            service.available
                              ? 'border-gold/30 hover:border-gold bg-gradient-to-br from-ivory to-white'
                              : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <ServiceIcon className={`w-8 h-8 ${service.available ? 'text-gold' : 'text-gray-400'}`} />
                          <span className={`font-inter uppercase text-sm ${service.available ? 'text-deep-green' : 'text-gray-500'}`}>
                            {service.name}
                          </span>
                          {!service.available && (
                            <span className="font-didot text-gray-400 text-xs">Bientôt</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-ivory to-white rounded-2xl p-6 border border-gold/20">
                      <h3 className="font-inter uppercase text-deep-green mb-4">Contact Immédiat</h3>
                      <div className="space-y-4">
                        <button className="w-full bg-green-600 text-white py-4 rounded-xl font-inter uppercase tracking-wide hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3">
                          <PhoneIcon className="w-5 h-5" />
                          <span>WhatsApp Urgent</span>
                        </button>
                        <button className="w-full border-2 border-deep-green text-deep-green py-4 rounded-xl font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3">
                          <PhoneIcon className="w-5 h-5" />
                          <span>Appel Direct</span>
                        </button>
                        <button className="w-full border-2 border-red-500 text-red-500 py-4 rounded-xl font-inter uppercase tracking-wide hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3">
                          <ExclamationTriangleIcon className="w-5 h-5" />
                          <span>Signaler un Incident</span>
                        </button>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-deep-green text-ivory rounded-2xl p-6 text-center">
                      <ClockIcon className="w-8 h-8 text-gold mx-auto mb-3" />
                      <div className="font-inter uppercase text-sm mb-2">TEMPS DE RÉPONSE MOYEN</div>
                      <div className="text-3xl font-didot text-gold font-light">8 minutes</div>
                      <div className="font-didot text-ivory/80 text-sm mt-2">Notre équipe est disponible 24h/24</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional tabs would follow similar enhanced patterns */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerSpace;