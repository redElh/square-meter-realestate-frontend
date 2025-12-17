// src/pages/TravelerSpace.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  DocumentTextIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowDownTrayIcon,
  HomeIcon,
  WrenchIcon,
  CameraIcon,
  ArrowRightIcon,
  GiftIcon,
  MapIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const TravelerSpace: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCodes, setShowCodes] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState('');
  const [showCheckoutFeedback, setShowCheckoutFeedback] = useState(false);

  // Mock booking data
  const booking = {
    property: "Villa Les Oliviers",
    location: "Saint-Tropez, Côte d'Azur",
    checkIn: "2024-06-15",
    checkOut: "2024-06-22",
    guests: 4,
    confirmation: "SM240615XZ",
    contact: "+33 6 12 34 56 78",
    deposit: "€3,000"
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
    { id: 'dashboard', label: t('travelerSpace.tabs.dashboard'), icon: HomeIcon },
    { id: 'arrival', label: t('travelerSpace.tabs.arrival'), icon: CalendarIcon },
    { id: 'stay', label: t('travelerSpace.tabs.stay'), icon: StarIcon },
    { id: 'privilege', label: t('travelerSpace.tabs.privilege'), icon: GiftIcon },
    { id: 'activities', label: t('travelerSpace.tabs.activities'), icon: MapIcon },
    { id: 'departure', label: t('travelerSpace.tabs.departure'), icon: ArrowRightIcon },
    { id: 'documents', label: t('travelerSpace.tabs.documents'), icon: DocumentTextIcon }
  ];

  const arrivalInfo = {
    location: "12 Avenue des Oliviers, 83990 Saint-Tropez",
    parking: "Parking privé pour 2 véhicules (code: 4455)",
    directions: "Prendre sortie Saint-Tropez Centre, suivre indications 'Port'",
    checkInTime: "16:00 - 20:00",
    checkOutTime: "08:00 - 11:00",
    depositProcedure: "Caution de €3,000 bloquée sur carte, restituée sous 72h après check-out"
  };

  const accessCodes = [
    { name: t('travelerSpace.accessCodeTypes.keyBox'), code: '1234#', qrCode: true },
    { name: t('travelerSpace.accessCodeTypes.mainGate'), code: '4455', qrCode: true },
    { name: t('travelerSpace.accessCodeTypes.apartment'), code: '5678*', qrCode: true },
    { name: t('travelerSpace.accessCodeTypes.parking'), code: '4455', qrCode: false }
  ];

  const checkinSteps = [
    { step: 1, title: t('travelerSpace.stay.step1Title'), description: t('travelerSpace.stay.step1Desc'), completed: false },
    { step: 2, title: t('travelerSpace.stay.step2Title'), description: t('travelerSpace.stay.step2Desc'), completed: false },
    { step: 3, title: t('travelerSpace.stay.step3Title'), description: t('travelerSpace.stay.step3Desc'), completed: false },
    { step: 4, title: t('travelerSpace.stay.step4Title'), description: t('travelerSpace.stay.step4Desc'), completed: false }
  ];

  const wifiInfo = {
    network: 'SquareMeter_Premium',
    password: 'Luxe2024!',
    qrCode: true
  };

  const houseRules = [
    t('travelerSpace.houseRules.noParties'),
    t('travelerSpace.houseRules.noPets'),
    t('travelerSpace.houseRules.noSmoking'),
    t('travelerSpace.houseRules.energySaving')
  ];

  const activities = [
    { title: t('travelerSpace.sampleActivities.seaExcursion'), price: '€450', duration: '4h', available: true },
    { title: t('travelerSpace.sampleActivities.cookingClass'), price: '€280', duration: '3h', available: true },
    { title: t('travelerSpace.sampleActivities.vineyardTour'), price: '€320', duration: '5h', available: true },
    { title: t('travelerSpace.sampleActivities.spaMessage'), price: '€180', duration: '1h30', available: true }
  ];

  const checkoutChecklist = [
    t('travelerSpace.departure.checklistItem1'),
    t('travelerSpace.departure.checklistItem2'),
    t('travelerSpace.departure.checklistItem3'),
    t('travelerSpace.departure.checklistItem4'),
    t('travelerSpace.departure.checklistItem5'),
    t('travelerSpace.departure.checklistItem6')
  ];

  const privilegePartners = [
    { name: 'Restaurant Le Petit Nice', discount: '15%', category: t('travelerSpace.partnerCategories.gastronomy') },
    { name: 'Spa Les Bains de Marrakech', discount: '20%', category: t('travelerSpace.partnerCategories.wellness') },
    { name: 'Location Yacht Prestige', discount: '10%', category: t('travelerSpace.partnerCategories.nautical') },
    { name: 'Boutique Hermès', discount: '15%', category: t('travelerSpace.partnerCategories.shopping') },
    { name: 'Golf de Saint-Tropez', discount: '25%', category: t('travelerSpace.partnerCategories.sport') },
    { name: 'Transferts VIP Azur', discount: '30%', category: t('travelerSpace.partnerCategories.transport') }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-8 pt-24">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-inter uppercase text-[#023927] mb-4">
              {t('travelerSpace.auth.title')}
            </h1>
            <div className="h-1 w-24 bg-[#023927] mx-auto mb-6"></div>
            <p className="font-inter text-gray-600 text-lg max-w-3xl mx-auto">
              {t('travelerSpace.auth.subtitle')}
            </p>
          </div>

          {/* Authentication Section */}
          <div className="max-w-md mx-auto">
            <div className="bg-white border-2 border-gray-200 p-8">
              <div className="text-center mb-8">
                <KeyIcon className="w-12 h-12 text-[#023927] mx-auto mb-4" />
                <h2 className="text-2xl font-inter uppercase text-[#023927] mb-4">
                  {t('travelerSpace.auth.accessTitle')}
                </h2>
                <p className="font-inter text-gray-600">
                  {t('travelerSpace.auth.accessSubtitle')}
                </p>
              </div>

              <form onSubmit={handleMagicLink} className="space-y-6">
                <div>
                  <label className="block font-inter uppercase text-[#023927] text-sm mb-2">
                    {t('travelerSpace.auth.emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vip@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-inter bg-white"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#023927] text-white py-4 font-inter uppercase tracking-wide hover:bg-[#01261c] transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>{t('travelerSpace.auth.sendingLink')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('travelerSpace.auth.receiveLinkButton')}</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <CheckCircleIcon className="w-5 h-5 text-[#023927]" />
                  <span className="font-inter text-sm">{t('travelerSpace.auth.secureConnection')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header with Booking Info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-inter uppercase text-[#023927] mb-4">
            {t('travelerSpace.auth.title')}
          </h1>
          
          {/* Booking Summary */}
          <div className="bg-white border-2 border-gray-200 p-6 max-w-4xl mx-auto mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="text-center md:text-left">
                <div className="text-xl font-inter text-[#023927] font-semibold">{booking.property}</div>
                <div className="font-inter text-gray-600 flex items-center justify-center md:justify-start mt-1">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  {booking.location}
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-inter uppercase text-[#023927] text-sm mb-1">{t('travelerSpace.booking.checkIn')}</div>
                <div className="font-inter text-[#023927] text-lg">{booking.checkIn}</div>
                <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.booking.fromTime')}</div>
              </div>
              
              <div className="text-center">
                <div className="font-inter uppercase text-[#023927] text-sm mb-1">{t('travelerSpace.booking.checkOut')}</div>
                <div className="font-inter text-[#023927] text-lg">{booking.checkOut}</div>
                <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.booking.beforeTime')}</div>
              </div>
              
              <div className="text-center">
                <div className="font-inter uppercase text-[#023927] text-sm mb-1">{t('travelerSpace.booking.confirmationNumber')}</div>
                <div className="font-inter text-[#023927] text-sm">{booking.confirmation}</div>
                <div className="font-inter text-gray-600 text-sm">{booking.guests} {t('travelerSpace.booking.travelers')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-2 border-gray-200 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 py-4 font-inter uppercase text-sm transition-all duration-300 flex items-center justify-center space-x-2 border-r-2 border-gray-200 last:border-r-0 ${
                    isActive 
                      ? 'bg-[#023927] text-white' 
                      : 'text-gray-600 hover:text-[#023927] hover:bg-gray-50'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-[#023927] text-white p-6">
                  <h2 className="text-2xl font-inter uppercase mb-4">{t('travelerSpace.dashboard.welcome')} {booking.property}</h2>
                  <p className="font-inter mb-4">
                    {t('travelerSpace.dashboard.welcomeMessage')}
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="text-3xl font-inter">
                      {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="w-px h-12 bg-white/30"></div>
                    <div>
                      <div className="font-inter">{currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                      <div className="font-inter text-white/80">{t('travelerSpace.dashboard.stayInProgress')}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab('arrival')}
                    className="bg-white border-2 border-gray-200 p-4 hover:border-[#023927] transition-all duration-300 group"
                  >
                    <MapPinIcon className="w-8 h-8 text-[#023927] mb-2" />
                    <h3 className="font-inter uppercase text-[#023927] mb-1">{t('travelerSpace.dashboard.location')}</h3>
                    <p className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.locationDesc')}</p>
                  </button>

                  <button 
                    onClick={() => setActiveTab('stay')}
                    className="bg-white border-2 border-gray-200 p-4 hover:border-[#023927] transition-all duration-300 group"
                  >
                    <KeyIcon className="w-8 h-8 text-[#023927] mb-2" />
                    <h3 className="font-inter uppercase text-[#023927] mb-1">{t('travelerSpace.dashboard.accessCodes')}</h3>
                    <p className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.accessCodesDesc')}</p>
                  </button>

                  <a 
                    href={`https://wa.me/${booking.contact.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border-2 border-gray-200 p-4 hover:border-[#023927] transition-all duration-300 group"
                  >
                    <PhoneIcon className="w-8 h-8 text-[#023927] mb-2" />
                    <h3 className="font-inter uppercase text-[#023927] mb-1">{t('travelerSpace.dashboard.assistance')}</h3>
                    <p className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.assistanceDesc')}</p>
                  </a>

                  <button 
                    onClick={() => setActiveTab('departure')}
                    className="bg-white border-2 border-gray-200 p-4 hover:border-[#023927] transition-all duration-300 group"
                  >
                    <ArrowRightIcon className="w-8 h-8 text-[#023927] mb-2" />
                    <h3 className="font-inter uppercase text-[#023927] mb-1">{t('travelerSpace.dashboard.checkout')}</h3>
                    <p className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.checkoutDesc')}</p>
                  </button>
                </div>

                {/* Essential Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Access Codes */}
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-inter uppercase text-[#023927] text-lg flex items-center space-x-2">
                        <KeyIcon className="w-5 h-5" />
                        <span>{t('travelerSpace.dashboard.accessCodes')}</span>
                      </h3>
                      <button 
                        onClick={() => setShowCodes(!showCodes)}
                        className="text-[#023927] hover:text-[#01261c] transition-colors duration-300 flex items-center space-x-1"
                      >
                        {showCodes ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        <span className="text-sm">{showCodes ? t('travelerSpace.dashboard.hide') : t('travelerSpace.dashboard.show')}</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {accessCodes.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200">
                          <div>
                            <div className="font-inter font-medium text-gray-900">{item.name}</div>
                            <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.code')}: {showCodes ? item.code : '••••'}</div>
                          </div>
                          {item.qrCode && (
                            <button className="text-[#023927] hover:text-[#01261c]">
                              <QrCodeIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WiFi Information */}
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                      <WifiIcon className="w-5 h-5" />
                      <span>{t('travelerSpace.dashboard.wifiConnection')}</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 border border-gray-200">
                        <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.network')}</div>
                        <div className="font-inter text-[#023927] font-medium">{wifiInfo.network}</div>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-200">
                        <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.password')}</div>
                        <div className="font-inter text-[#023927] font-mono font-medium">{wifiInfo.password}</div>
                      </div>
                    </div>
                    {wifiInfo.qrCode && (
                      <button className="mt-4 flex items-center justify-center space-x-2 text-[#023927] hover:text-[#01261c] w-full py-2 border-2 border-[#023927]">
                        <QrCodeIcon className="w-4 h-4" />
                        <span className="font-inter uppercase text-sm">{t('travelerSpace.dashboard.scanQrCode')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Arrival Tab */}
            {activeTab === 'arrival' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-inter uppercase text-[#023927] mb-6">{t('travelerSpace.arrival.title')}</h2>

                {/* Location & Directions */}
                <div className="bg-white border-2 border-gray-200 p-6">
                  <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{t('travelerSpace.arrival.locationTitle')}</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="font-inter text-gray-600 text-sm mb-1">{t('travelerSpace.arrival.address')}</div>
                      <div className="font-inter text-gray-900">{arrivalInfo.location}</div>
                    </div>
                    <div>
                      <div className="font-inter text-gray-600 text-sm mb-1">{t('travelerSpace.arrival.parking')}</div>
                      <div className="font-inter text-gray-900">{arrivalInfo.parking}</div>
                    </div>
                    <div>
                      <div className="font-inter text-gray-600 text-sm mb-1">{t('travelerSpace.arrival.directions')}</div>
                      <div className="font-inter text-gray-900">{arrivalInfo.directions}</div>
                    </div>
                    <button className="mt-4 bg-[#023927] text-white py-3 px-6 font-inter uppercase text-sm hover:bg-[#01261c] transition-all duration-300 flex items-center justify-center space-x-2">
                      <MapIcon className="w-4 h-4" />
                      <span>{t('travelerSpace.arrival.openInMaps')}</span>
                    </button>
                  </div>
                </div>

                {/* Schedule & Deposit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                      <ClockIcon className="w-5 h-5" />
                      <span>{t('travelerSpace.arrival.schedule')}</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="font-inter text-gray-600 text-sm mb-1">{t('travelerSpace.arrival.arrivalTime')}</div>
                        <div className="font-inter text-gray-900">{t('travelerSpace.arrival.fromHour')} {arrivalInfo.checkInTime}</div>
                      </div>
                      <div>
                        <div className="font-inter text-gray-600 text-sm mb-1">{t('travelerSpace.arrival.departureTime')}</div>
                        <div className="font-inter text-gray-900">{t('travelerSpace.arrival.beforeHour')} {arrivalInfo.checkOutTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                      <DocumentTextIcon className="w-5 h-5" />
                      <span>{t('travelerSpace.arrival.depositTitle')}</span>
                    </h3>
                    <div className="space-y-2">
                      <div className="font-inter text-gray-900">{t('travelerSpace.arrival.depositAmount')} {booking.deposit}</div>
                      <div className="font-inter text-gray-600 text-sm">{arrivalInfo.depositProcedure}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stay Tab */}
            {activeTab === 'stay' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-inter uppercase text-[#023927] mb-6">{t('travelerSpace.stay.title')}</h2>

                {/* Guided Check-in */}
                <div className="bg-white border-2 border-gray-200 p-6">
                  <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{t('travelerSpace.stay.guidedCheckinTitle')}</span>
                  </h3>
                  <div className="space-y-4">
                    {checkinSteps.map((step) => (
                      <div key={step.step} className="flex items-start space-x-4 p-3 border border-gray-200">
                        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 ${
                          step.completed 
                            ? 'border-[#023927] bg-[#023927] text-white' 
                            : 'border-gray-300 text-gray-400'
                        }`}>
                          {step.step}
                        </div>
                        <div>
                          <div className="font-inter text-gray-900 font-medium mb-1">{step.title}</div>
                          <div className="font-inter text-gray-600 text-sm">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WiFi */}
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                      <WifiIcon className="w-5 h-5" />
                      <span>{t('travelerSpace.stay.wifiTitle')}</span>
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.network')}</div>
                        <div className="font-inter text-[#023927] font-medium">{wifiInfo.network}</div>
                      </div>
                      <div>
                        <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.password')}</div>
                        <div className="font-inter text-[#023927] font-mono font-medium">{wifiInfo.password}</div>
                      </div>
                    </div>
                    <button className="mt-4 w-full border-2 border-[#023927] text-[#023927] py-3 font-inter uppercase text-sm hover:bg-[#023927] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                      <QrCodeIcon className="w-4 h-4" />
                      <span>{t('travelerSpace.stay.qrCodeConnection')}</span>
                    </button>
                  </div>

                  {/* House Rules */}
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                      <DocumentTextIcon className="w-5 h-5" />
                      <span>{t('travelerSpace.stay.houseRulesTitle')}</span>
                    </h3>
                    <ul className="space-y-2">
                      {houseRules.map((rule, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckIcon className="w-4 h-4 text-[#023927] mt-0.5 flex-shrink-0" />
                          <span className="font-inter text-gray-600 text-sm">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Assistance & Incident Reporting */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Assistance */}
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                      <PhoneIcon className="w-5 h-5" />
                      <span>{t('travelerSpace.stay.assistanceTitle')}</span>
                    </h3>
                    <div className="space-y-4">
                      <p className="font-inter text-gray-600">
                        {t('travelerSpace.stay.assistanceMessage')}
                      </p>
                      <a 
                        href={`https://wa.me/${booking.contact.replace(/\s/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-green-600 text-white py-3 font-inter uppercase text-sm hover:bg-green-700 transition-all duration-300 text-center"
                      >
                        {t('travelerSpace.stay.urgentWhatsapp')}
                      </a>
                      <button className="block w-full border-2 border-[#023927] text-[#023927] py-3 font-inter uppercase text-sm hover:bg-[#023927] hover:text-white transition-all duration-300 text-center">
                        {t('travelerSpace.stay.directCall')} {booking.contact}
                      </button>
                    </div>
                  </div>

                  {/* Incident Reporting */}
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      <span>{t('travelerSpace.stay.incidentTitle')}</span>
                    </h3>
                    {!showIncidentForm ? (
                      <div className="space-y-4">
                        <p className="font-inter text-gray-600">
                          {t('travelerSpace.stay.incidentMessage')}
                        </p>
                        <button 
                          onClick={() => setShowIncidentForm(true)}
                          className="w-full border-2 border-red-600 text-red-600 py-3 font-inter uppercase text-sm hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          {t('travelerSpace.stay.reportIncident')}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block font-inter text-gray-600 text-sm mb-2">{t('travelerSpace.stay.description')}</label>
                          <textarea 
                            value={incidentDescription}
                            onChange={(e) => setIncidentDescription(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-inter"
                            rows={4}
                            placeholder={t('travelerSpace.stay.descPlaceholder')}
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button className="flex-1 border-2 border-gray-600 text-gray-600 py-2 font-inter uppercase text-sm hover:bg-gray-600 hover:text-white transition-all duration-300">
                            <CameraIcon className="w-4 h-4 inline mr-2" />
                            {t('travelerSpace.stay.photo')}
                          </button>
                          <button 
                            onClick={() => setShowIncidentForm(false)}
                            className="flex-1 border-2 border-red-600 text-red-600 py-2 font-inter uppercase text-sm hover:bg-red-600 hover:text-white transition-all duration-300"
                          >
                            {t('travelerSpace.stay.sendAlert')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activities Teaser */}
                <div className="bg-[#023927] text-white p-6">
                  <h3 className="font-inter uppercase text-lg mb-4 flex items-center space-x-2">
                    <SparklesIcon className="w-5 h-5" />
                    <span>{t('travelerSpace.stay.activitiesTeaser')}</span>
                  </h3>
                  <p className="font-inter mb-4">
                    {t('travelerSpace.stay.activitiesMessage')}
                  </p>
                  <button 
                    onClick={() => setActiveTab('activities')}
                    className="bg-white text-[#023927] py-3 px-6 font-inter uppercase text-sm hover:bg-gray-100 transition-all duration-300"
                  >
                    {t('travelerSpace.stay.seeActivities')}
                  </button>
                </div>
              </div>
            )}

            {/* Privilege Card Tab */}
            {activeTab === 'privilege' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-inter uppercase text-[#023927] mb-4">
                    {t('travelerSpace.privilege.title')}
                  </h2>
                  <p className="font-inter text-gray-600">
                    {t('travelerSpace.privilege.subtitle')}
                  </p>
                </div>

                {/* Privilege Card */}
                <div className="bg-[#023927] text-white p-6 max-w-2xl mx-auto">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="font-inter uppercase text-sm opacity-80">{t('travelerSpace.privilege.cardLabel')}</div>
                      <div className="font-inter text-2xl font-light">VIP {booking.confirmation}</div>
                      <div className="font-inter text-sm opacity-80 mt-1">{booking.property}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-inter uppercase text-sm opacity-80">{t('travelerSpace.privilege.validUntil')}</div>
                      <div className="font-inter text-lg">{booking.checkOut}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 p-4 mb-6">
                    <div className="font-inter uppercase text-sm mb-2">{t('travelerSpace.privilege.exclusiveBenefits')}</div>
                    <div className="font-inter">{t('travelerSpace.privilege.benefitsText')}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-inter text-sm">{t('travelerSpace.privilege.experienceLabel')}</div>
                    <button className="bg-white text-[#023927] px-4 py-2 font-inter uppercase text-sm hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      <span>{t('travelerSpace.privilege.downloadCard')}</span>
                    </button>
                  </div>
                </div>

                {/* Partners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {privilegePartners.map((partner, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 p-4 hover:border-[#023927] transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-[#023927] text-white px-3 py-1 font-inter uppercase text-xs">
                          {partner.category}
                        </span>
                        <span className="bg-[#023927]/10 text-[#023927] px-3 py-1 rounded font-inter uppercase text-xs">
                          -{partner.discount}
                        </span>
                      </div>
                      <h3 className="font-inter uppercase text-[#023927] text-sm mb-2">{partner.name}</h3>
                      <p className="font-inter text-gray-600 text-xs mb-3">
                        {t('travelerSpace.privilege.presentCard')}
                      </p>
                      <button className="w-full border-2 border-[#023927] text-[#023927] py-2 font-inter uppercase text-xs hover:bg-[#023927] hover:text-white transition-all duration-300">
                        {t('travelerSpace.privilege.seeDetails')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-inter uppercase text-[#023927] mb-4">
                    {t('travelerSpace.activities.title')}
                  </h2>
                  <p className="font-inter text-gray-600 max-w-2xl mx-auto">
                    {t('travelerSpace.activities.subtitle')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activities.map((activity, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 p-6 hover:border-[#023927] transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-inter uppercase text-[#023927] text-lg">{activity.title}</h3>
                        <div className="bg-[#023927] text-white px-3 py-1 font-inter uppercase text-sm">
                          {activity.price}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <ClockIcon className="w-4 h-4" />
                          <span className="font-inter text-sm">{activity.duration}</span>
                        </div>
                        <div className={`px-3 py-1 font-inter uppercase text-xs ${
                          activity.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.available ? t('travelerSpace.activities.available') : t('travelerSpace.activities.full')}
                        </div>
                      </div>
                      <p className="font-inter text-gray-600 text-sm mb-6">
                        {t('travelerSpace.activities.experienceMessage')}
                      </p>
                      <a 
                        href={`https://wa.me/${booking.contact.replace(/\s/g, '')}?text=${encodeURIComponent(t('travelerSpace.whatsappMessages.bookActivity'))} ${encodeURIComponent(activity.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#023927] text-white py-3 font-inter uppercase text-sm hover:bg-[#01261c] transition-all duration-300 text-center"
                      >
                        {t('travelerSpace.activities.bookViaWhatsapp')}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Departure Tab */}
            {activeTab === 'departure' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-inter uppercase text-[#023927] mb-6">{t('travelerSpace.departure.title')}</h2>

                {/* Checkout Checklist */}
                <div className="bg-white border-2 border-gray-200 p-6">
                  <h3 className="font-inter uppercase text-[#023927] text-lg mb-4 flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{t('travelerSpace.departure.checklistTitle')}</span>
                  </h3>
                  <div className="space-y-3">
                    {checkoutChecklist.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200">
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center border-2 border-gray-300">
                          {index + 1}
                        </div>
                        <span className="font-inter text-gray-900">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 bg-green-50 border-2 border-green-200 p-4">
                    <div className="font-inter text-green-800 text-sm">
                      <strong>{t('travelerSpace.departure.importantNote')}</strong> {t('travelerSpace.departure.confirmMessage')} {booking.contact}
                    </div>
                  </div>
                </div>

                {/* Feedback & Loyalty */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Feedback */}
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4">{t('travelerSpace.departure.feedbackTitle')}</h3>
                    {!showCheckoutFeedback ? (
                      <div className="space-y-4">
                        <p className="font-inter text-gray-600">
                          {t('travelerSpace.departure.feedbackMessage')}
                        </p>
                        <button 
                          onClick={() => setShowCheckoutFeedback(true)}
                          className="w-full bg-[#023927] text-white py-3 font-inter uppercase text-sm hover:bg-[#01261c] transition-all duration-300"
                        >
                          {t('travelerSpace.departure.giveReview')}
                        </button>
                        <a 
                          href="https://g.page/r/CYOURGOOGLEPAGELINK"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full border-2 border-[#023927] text-[#023927] py-3 font-inter uppercase text-sm hover:bg-[#023927] hover:text-white transition-all duration-300 text-center"
                        >
                          {t('travelerSpace.departure.googleReview')}
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block font-inter text-gray-600 text-sm mb-2">{t('travelerSpace.departure.yourReview')}</label>
                          <textarea 
                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-inter"
                            rows={4}
                            placeholder={t('travelerSpace.departure.reviewPlaceholder')}
                          />
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} className="text-gray-400 hover:text-[#023927]">
                              <StarIconSolid className="w-6 h-6" />
                            </button>
                          ))}
                        </div>
                        <button className="w-full bg-[#023927] text-white py-3 font-inter uppercase text-sm hover:bg-[#01261c] transition-all duration-300">
                          {t('travelerSpace.departure.sendReview')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Loyalty & Upsell */}
                  <div className="bg-[#023927] text-white p-6">
                    <h3 className="font-inter uppercase text-lg mb-4">{t('travelerSpace.departure.loyaltyTitle')}</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="font-inter uppercase text-sm opacity-80 mb-2">{t('travelerSpace.departure.extendStayTitle')}</div>
                        <p className="font-inter mb-4">
                          {t('travelerSpace.departure.extendMessage')}
                        </p>
                        <a 
                          href={`https://wa.me/${booking.contact.replace(/\s/g, '')}?text=${encodeURIComponent(t('travelerSpace.whatsappMessages.extendStay'))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-white text-[#023927] py-3 font-inter uppercase text-sm hover:bg-gray-100 transition-all duration-300 text-center"
                        >
                          {t('travelerSpace.departure.requestExtension')}
                        </a>
                      </div>
                      <div className="pt-6 border-t border-white/20">
                        <div className="font-inter uppercase text-sm opacity-80 mb-2">{t('travelerSpace.departure.loyaltyOfferTitle')}</div>
                        <p className="font-inter mb-4">
                          {t('travelerSpace.departure.loyaltyMessage')}
                        </p>
                        <button className="block w-full border-2 border-white text-white py-3 font-inter uppercase text-sm hover:bg-white hover:text-[#023927] transition-all duration-300 text-center">
                          {t('travelerSpace.departure.getPromoCode')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-inter uppercase text-[#023927] mb-6">{t('travelerSpace.documents.title')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4">{t('travelerSpace.documents.stayDocuments')}</h3>
                    <div className="space-y-3">
                      {[
                        { name: t('travelerSpace.documents.rentalContract'), date: '2024-06-10', size: '1.2 MB' },
                        { name: t('travelerSpace.documents.houseRules'), date: '2024-06-10', size: '0.8 MB' },
                        { name: t('travelerSpace.documents.propertyPlan'), date: '2024-06-10', size: '2.1 MB' },
                        { name: t('travelerSpace.documents.insurance'), date: '2024-06-10', size: '1.5 MB' }
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200">
                          <div>
                            <div className="font-inter text-gray-900">{doc.name}</div>
                            <div className="font-inter text-gray-600 text-sm">{doc.date} • {doc.size}</div>
                          </div>
                          <button className="text-[#023927] hover:text-[#01261c]">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 p-6">
                    <h3 className="font-inter uppercase text-[#023927] text-lg mb-4">{t('travelerSpace.documents.invoices')}</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Facture N° SM2024-0615', amount: '€4,200', status: t('travelerSpace.documents.invoicePaid') },
                        { name: 'Facture Caution', amount: '€3,000', status: t('travelerSpace.documents.invoiceBlocked') },
                        { name: 'Facture Services', amount: '€480', status: t('travelerSpace.documents.invoiceToSettle') }
                      ].map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200">
                          <div>
                            <div className="font-inter text-gray-900">{invoice.name}</div>
                            <div className="font-inter text-gray-600 text-sm">{invoice.amount}</div>
                          </div>
                          <span className={`px-3 py-1 font-inter uppercase text-xs ${
                            invoice.status === t('travelerSpace.documents.invoicePaid') 
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === t('travelerSpace.documents.invoiceBlocked')
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-6 border-2 border-[#023927] text-[#023927] py-3 font-inter uppercase text-sm hover:bg-[#023927] hover:text-white transition-all duration-300">
                      {t('travelerSpace.documents.downloadAll')}
                    </button>
                  </div>
                </div>

                {/* Stay History */}
                <div className="bg-white border-2 border-gray-200 p-6">
                  <h3 className="font-inter uppercase text-[#023927] text-lg mb-4">{t('travelerSpace.documents.pastStays')}</h3>
                  <div className="space-y-3">
                    {[
                      { property: 'Villa Saint-Tropez', dates: '15-22 Juin 2024', status: t('travelerSpace.documents.stayInProgress') },
                      { property: 'Appartement Paris 16e', dates: '10-15 Mars 2024', status: t('travelerSpace.documents.stayCompleted') },
                      { property: 'Chalet Courchevel', dates: '20-27 Février 2024', status: t('travelerSpace.documents.stayCompleted') }
                    ].map((stay, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200">
                        <div>
                          <div className="font-inter text-gray-900">{stay.property}</div>
                          <div className="font-inter text-gray-600 text-sm">{stay.dates}</div>
                        </div>
                        <span className={`px-3 py-1 font-inter uppercase text-xs ${
                          stay.status === t('travelerSpace.documents.stayInProgress') 
                            ? 'bg-[#023927] text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {stay.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerSpace;