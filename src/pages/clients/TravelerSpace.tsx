// src/pages/clients/TravelerSpace.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MySpacesCard from '../auth/dashboard/MySpacesCard';
import PrivilegePartners from '../../components/PrivilegePartners';
import ActivityConcierge from '../../components/ActivityConcierge';
import { getCookie, refreshAccessToken } from '../../utils/auth';
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
  SparklesIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowDownTrayIcon,
  HomeIcon,
  CameraIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  GiftIcon,
  MapIcon,
  CheckIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const TRAVELER_SESSION_KEY = 'traveler_space_authenticated';

const TravelerSpace: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCodes, setShowCodes] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState('');
  const [showCheckoutFeedback, setShowCheckoutFeedback] = useState(false);
  const [linkedSpaces, setLinkedSpaces] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [originalRole, setOriginalRole] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isArrowHidden, setIsArrowHidden] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateArrowVisibility = () => {
      if (window.innerWidth < 1024) {
        setIsArrowHidden(false);
        return;
      }
      const el = headerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const arrowY = (window.innerHeight + 112) / 2;
      setIsArrowHidden(rect.top <= arrowY + 20 && rect.bottom >= arrowY - 20);
    };
    updateArrowVisibility();
    window.addEventListener('scroll', updateArrowVisibility, { passive: true });
    window.addEventListener('resize', updateArrowVisibility);
    return () => {
      window.removeEventListener('scroll', updateArrowVisibility);
      window.removeEventListener('resize', updateArrowVisibility);
    };
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem('auth_user');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setLinkedSpaces(data.linkedSpaces || []);
        setUserId(data.id || '');
        setOriginalRole(data.originalRole || data.role || '');
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (getCookie('accessToken')) {
        if (!cancelled) {
          setAuthStatus('authenticated');
        }
        return;
      }

      if (getCookie('refreshToken')) {
        const refreshed = await refreshAccessToken();
        if (!cancelled) {
          setAuthStatus(refreshed ? 'authenticated' : 'unauthenticated');
        }
        return;
      }

      const sessionAuthed = sessionStorage.getItem(TRAVELER_SESSION_KEY) === 'true';
      if (!cancelled) {
        setAuthStatus(sessionAuthed ? 'authenticated' : 'unauthenticated');
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load user data from backend when authenticated via main auth cookies
  useEffect(() => {
    if (authStatus !== 'authenticated') return;
    let cancelled = false;

    const fetchUserData = async () => {
      try {
        const res = await fetch('/auth/check', { credentials: 'include' });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            const spaces = data.user.linked_spaces || [];
            const origRole = data.user.original_role || data.user.role;
            setLinkedSpaces(spaces);
            setOriginalRole(origRole);
            setUserId(data.user.id || '');
          }
        }
      } catch { /* ignore */ }
    };

    fetchUserData();

    return () => {
      cancelled = true;
    };
  }, [authStatus]);

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
    setAuthError('');
    setIsLoading(true);
    try {
      const res = await fetch('/auth/traveler-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const user = data.user || {};
        setUserId(user.id || '');
        setLinkedSpaces(user.linked_spaces || []);
        setOriginalRole(user.original_role || '');
        sessionStorage.setItem(TRAVELER_SESSION_KEY, 'true');
        setAuthStatus('authenticated');
      } else {
        setAuthError(data.error || t('travelerSpace.auth.invalidEmail'));
      }
    } catch {
      setAuthError(t('travelerSpace.auth.invalidEmail'));
    } finally {
      setIsLoading(false);
    }
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

  const navItems = [
    ...tabs,
    { id: 'rendezvous', label: t('dashboard.navigation.appointments'), icon: ChatBubbleLeftIcon },
    { id: 'messages', label: t('dashboard.navigation.messages'), icon: ChatBubbleLeftIcon },
    { id: 'profile', label: t('dashboard.navigation.profile'), icon: UserCircleIcon },
    { id: 'logout', label: t('logout'), icon: ArrowRightOnRectangleIcon, isDanger: true }
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

  const checkoutChecklist = [
    t('travelerSpace.departure.checklistItem1'),
    t('travelerSpace.departure.checklistItem2'),
    t('travelerSpace.departure.checklistItem3'),
    t('travelerSpace.departure.checklistItem4'),
    t('travelerSpace.departure.checklistItem5'),
    t('travelerSpace.departure.checklistItem6')
  ];

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#023927] mx-auto mb-4"></div>
          <p className="font-inter text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
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
                    onChange={(e) => { setEmail(e.target.value); if (authError) setAuthError(''); }}
                    placeholder="vip@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-[#023927] font-inter bg-white"
                    required
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-red-50 border-2 border-red-200">
                    <p className="font-inter text-red-700 text-sm text-center">{authError}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#023927] text-white py-4 font-inter uppercase tracking-wide hover:bg-[#01261c] transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>{t('travelerSpace.auth.verifying')}</span>
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

  const renderContent = () => {
    return (
      <>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-emerald-700 text-white p-6 shadow-sm">
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
                className="bg-white border border-gray-200 shadow-sm p-4 hover:border-emerald-600 transition-all duration-300 group"
              >
                <MapPinIcon className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-inter uppercase text-emerald-800 mb-1">{t('travelerSpace.dashboard.location')}</h3>
                <p className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.locationDesc')}</p>
              </button>

              <button 
                onClick={() => setActiveTab('stay')}
                className="bg-white border border-gray-200 shadow-sm p-4 hover:border-emerald-600 transition-all duration-300 group"
              >
                <KeyIcon className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-inter uppercase text-emerald-800 mb-1">{t('travelerSpace.dashboard.accessCodes')}</h3>
                <p className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.accessCodesDesc')}</p>
              </button>

              <a 
                href={`https://wa.me/${booking.contact.replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-gray-200 shadow-sm p-4 hover:border-emerald-600 transition-all duration-300 group"
              >
                <PhoneIcon className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-inter uppercase text-emerald-800 mb-1">{t('travelerSpace.dashboard.assistance')}</h3>
                <p className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.assistanceDesc')}</p>
              </a>

              <button 
                onClick={() => setActiveTab('departure')}
                className="bg-white border border-gray-200 shadow-sm p-4 hover:border-emerald-600 transition-all duration-300 group"
              >
                <ArrowRightIcon className="w-8 h-8 text-emerald-600 mb-2" />
                <h3 className="font-inter uppercase text-emerald-800 mb-1">{t('travelerSpace.dashboard.checkout')}</h3>
                <p className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.checkoutDesc')}</p>
              </button>
            </div>

            {/* Essential Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Access Codes */}
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-inter uppercase text-emerald-800 text-lg flex items-center space-x-2">
                    <KeyIcon className="w-5 h-5" />
                    <span>{t('travelerSpace.dashboard.accessCodes')}</span>
                  </h3>
                  <button 
                    onClick={() => setShowCodes(!showCodes)}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 flex items-center space-x-1"
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
                        <button className="text-emerald-600 hover:text-emerald-700">
                          <QrCodeIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* WiFi Information */}
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
                  <WifiIcon className="w-5 h-5" />
                  <span>{t('travelerSpace.dashboard.wifiConnection')}</span>
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.network')}</div>
                    <div className="font-inter text-emerald-700 font-medium">{wifiInfo.network}</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200">
                    <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.password')}</div>
                    <div className="font-inter text-emerald-700 font-mono font-medium">{wifiInfo.password}</div>
                  </div>
                </div>
                {wifiInfo.qrCode && (
                  <button className="mt-4 flex items-center justify-center space-x-2 text-emerald-600 hover:text-emerald-700 w-full py-2 border-2 border-emerald-600">
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
            <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-6">{t('travelerSpace.arrival.title')}</h2>

            {/* Location & Directions */}
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
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
                <button className="mt-4 bg-emerald-600 text-white py-3 px-6 font-inter uppercase text-sm hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2">
                  <MapIcon className="w-4 h-4" />
                  <span>{t('travelerSpace.arrival.openInMaps')}</span>
                </button>
              </div>
            </div>

            {/* Schedule & Deposit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
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

              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
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
            <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-6">{t('travelerSpace.stay.title')}</h2>

            {/* Guided Check-in */}
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5" />
                <span>{t('travelerSpace.stay.guidedCheckinTitle')}</span>
              </h3>
              <div className="space-y-4">
                {checkinSteps.map((step) => (
                  <div key={step.step} className="flex items-start space-x-4 p-3 border border-gray-200">
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 ${
                      step.completed 
                        ? 'border-emerald-600 bg-emerald-600 text-white' 
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
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
                  <WifiIcon className="w-5 h-5" />
                  <span>{t('travelerSpace.stay.wifiTitle')}</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.network')}</div>
                    <div className="font-inter text-emerald-700 font-medium">{wifiInfo.network}</div>
                  </div>
                  <div>
                    <div className="font-inter text-gray-600 text-sm">{t('travelerSpace.dashboard.password')}</div>
                    <div className="font-inter text-emerald-700 font-mono font-medium">{wifiInfo.password}</div>
                  </div>
                </div>
                <button className="mt-4 w-full border-2 border-emerald-600 text-emerald-600 py-3 font-inter uppercase text-sm hover:bg-emerald-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2">
                  <QrCodeIcon className="w-4 h-4" />
                  <span>{t('travelerSpace.stay.qrCodeConnection')}</span>
                </button>
              </div>

              {/* House Rules */}
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>{t('travelerSpace.stay.houseRulesTitle')}</span>
                </h3>
                <ul className="space-y-2">
                  {houseRules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckIcon className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="font-inter text-gray-600 text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Assistance & Incident Reporting */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Assistance */}
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
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
                  <button className="block w-full border-2 border-emerald-600 text-emerald-600 py-3 font-inter uppercase text-sm hover:bg-emerald-600 hover:text-white transition-all duration-300 text-center">
                    {t('travelerSpace.stay.directCall')} {booking.contact}
                  </button>
                </div>
              </div>

              {/* Incident Reporting */}
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
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
                        className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-emerald-500 font-inter"
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
            <div className="bg-emerald-700 text-white p-6 shadow-sm">
              <h3 className="font-inter uppercase text-lg mb-4 flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5" />
                <span>{t('travelerSpace.stay.activitiesTeaser')}</span>
              </h3>
              <p className="font-inter mb-4">
                {t('travelerSpace.stay.activitiesMessage')}
              </p>
              <button 
                onClick={() => setActiveTab('activities')}
                className="bg-white text-emerald-700 py-3 px-6 font-inter uppercase text-sm hover:bg-gray-100 transition-all duration-300"
              >
                {t('travelerSpace.stay.seeActivities')}
              </button>
            </div>
          </div>
        )}

        {/* Privilege Card Tab */}
        {activeTab === 'privilege' && <PrivilegePartners />}

        {/* Activities Tab */}
        {activeTab === 'activities' && <ActivityConcierge />}

        {/* Departure Tab */}
        {activeTab === 'departure' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-6">{t('travelerSpace.departure.title')}</h2>

            {/* Checkout Checklist */}
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4 flex items-center space-x-2">
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
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4">{t('travelerSpace.departure.feedbackTitle')}</h3>
                {!showCheckoutFeedback ? (
                  <div className="space-y-4">
                    <p className="font-inter text-gray-600">
                      {t('travelerSpace.departure.feedbackMessage')}
                    </p>
                    <button 
                      onClick={() => setShowCheckoutFeedback(true)}
                      className="w-full bg-emerald-600 text-white py-3 font-inter uppercase text-sm hover:bg-emerald-700 transition-all duration-300"
                    >
                      {t('travelerSpace.departure.giveReview')}
                    </button>
                    <a 
                      href="https://g.page/r/CYOURGOOGLEPAGELINK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full border-2 border-emerald-600 text-emerald-600 py-3 font-inter uppercase text-sm hover:bg-emerald-600 hover:text-white transition-all duration-300 text-center"
                    >
                      {t('travelerSpace.departure.googleReview')}
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-inter text-gray-600 text-sm mb-2">{t('travelerSpace.departure.yourReview')}</label>
                      <textarea 
                        className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-emerald-500 font-inter"
                        rows={4}
                        placeholder={t('travelerSpace.departure.reviewPlaceholder')}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} className="text-gray-400 hover:text-emerald-600">
                          <StarIconSolid className="w-6 h-6" />
                        </button>
                      ))}
                    </div>
                    <button className="w-full bg-emerald-600 text-white py-3 font-inter uppercase text-sm hover:bg-emerald-700 transition-all duration-300">
                      {t('travelerSpace.departure.sendReview')}
                    </button>
                  </div>
                )}
              </div>

              {/* Loyalty & Upsell */}
              <div className="bg-emerald-700 text-white p-6 shadow-sm">
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
                      className="block w-full bg-white text-emerald-700 py-3 font-inter uppercase text-sm hover:bg-gray-100 transition-all duration-300 text-center"
                    >
                      {t('travelerSpace.departure.requestExtension')}
                    </a>
                  </div>
                  <div className="pt-6 border-t border-white/20">
                    <div className="font-inter uppercase text-sm opacity-80 mb-2">{t('travelerSpace.departure.loyaltyOfferTitle')}</div>
                    <p className="font-inter mb-4">
                      {t('travelerSpace.departure.loyaltyMessage')}
                    </p>
                    <button className="block w-full border-2 border-white text-white py-3 font-inter uppercase text-sm hover:bg-white hover:text-emerald-700 transition-all duration-300 text-center">
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
            <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-6">{t('travelerSpace.documents.title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4">{t('travelerSpace.documents.stayDocuments')}</h3>
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
                      <button className="text-emerald-600 hover:text-emerald-700">
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm p-6">
                <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4">{t('travelerSpace.documents.invoices')}</h3>
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
                <button className="w-full mt-6 border-2 border-emerald-600 text-emerald-600 py-3 font-inter uppercase text-sm hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  {t('travelerSpace.documents.downloadAll')}
                </button>
              </div>
            </div>

            {/* Stay History */}
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <h3 className="font-inter uppercase text-emerald-800 text-lg mb-4">{t('travelerSpace.documents.pastStays')}</h3>
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
                        ? 'bg-emerald-600 text-white'
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

        {/* Rendez-vous Tab */}
        {activeTab === 'rendezvous' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-6">{t('dashboard.navigation.appointments')}</h2>
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-inter text-gray-900 text-lg mb-2">Aucun rendez-vous programmé</h3>
                <p className="font-inter text-gray-600 text-sm">Vos rendez-vous liés à votre séjour apparaîtront ici.</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-6">{t('dashboard.navigation.messages')}</h2>
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <div className="text-center py-12">
                <ChatBubbleLeftIcon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-inter text-gray-900 text-lg mb-2">Aucun message</h3>
                <p className="font-inter text-gray-600 text-sm">Vos échanges avec notre équipe apparaîtront ici.</p>
              </div>
            </div>
          </div>
        )}

        {/* Profil Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-6">{t('dashboard.navigation.profile')}</h2>
            <div className="bg-white border border-gray-200 shadow-sm p-6">
              <div className="text-center py-12">
                <UserCircleIcon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-inter text-gray-900 text-lg mb-2">Votre profil</h3>
                <p className="font-inter text-gray-600 text-sm">Les informations de votre profil seront disponibles ici.</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Tab */}
        {activeTab === 'logout' && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <ArrowRightOnRectangleIcon className="w-12 h-12 mx-auto mb-3" />
              <p className="text-sm">Déconnexion...</p>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Header */}
      <div ref={headerRef} className="relative overflow-hidden bg-gradient-to-r from-[#023927] via-emerald-800 to-[#023927] text-white shadow-lg">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-2xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl"></div>

        <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col gap-6">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-14 h-14 rounded-xl bg-white/10 border border-white/20 items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold">Espace Voyageur</h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold uppercase tracking-wide">
                      Voyageur
                    </span>
                  </div>
                  <p className="mt-1 text-sm sm:text-base text-emerald-100/90">
                    {t('travelerSpace.auth.subtitle')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-emerald-100 capitalize">
                    {new Date().toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-emerald-200/80">Square Meter — Séjour & réservation</p>
                </div>
                <button className="relative p-2.5 bg-white/10 border border-white/20 hover:bg-white/20 transition-all rounded-lg">
                  <BellIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white/10 border border-white/15 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-emerald-100">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Propriété</span>
                </div>
                <p className="mt-1 font-inter font-semibold">{booking.property}</p>
                <p className="text-emerald-100/80 text-sm">{booking.location}</p>
              </div>

              <div className="bg-white/10 border border-white/15 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-emerald-100">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">{t('travelerSpace.booking.checkIn')}</span>
                </div>
                <p className="mt-1 font-inter font-semibold">{booking.checkIn}</p>
                <p className="text-emerald-100/80 text-sm">{t('travelerSpace.booking.fromTime')}</p>
              </div>

              <div className="bg-white/10 border border-white/15 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-emerald-100">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">{t('travelerSpace.booking.checkOut')}</span>
                </div>
                <p className="mt-1 font-inter font-semibold">{booking.checkOut}</p>
                <p className="text-emerald-100/80 text-sm">{t('travelerSpace.booking.beforeTime')}</p>
              </div>

              <div className="bg-white/10 border border-white/15 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-emerald-100">
                  <QrCodeIcon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">{t('travelerSpace.booking.confirmationNumber')}</span>
                </div>
                <p className="mt-1 font-inter font-semibold">{booking.confirmation}</p>
                <p className="text-emerald-100/80 text-sm">{booking.guests} {t('travelerSpace.booking.travelers')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:flex lg:items-start lg:min-h-screen">
        {/* Sidebar Navigation */}
        <div className="relative lg:sticky lg:top-28 lg:self-start">
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            title="Replier le menu"
            aria-label="Replier le menu"
            className={`group absolute right-3 top-3 lg:fixed lg:right-auto lg:top-[calc((100vh+7rem)/2)] lg:-translate-y-1/2 lg:left-[272px] z-30 w-8 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-[#023927] text-white border border-emerald-300/50 shadow-lg shadow-emerald-900/40 flex items-center justify-center transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-emerald-500/50 active:scale-95 ${isSidebarCollapsed || isArrowHidden ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
          >
            <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
          </button>

          <button
            onClick={() => setIsSidebarCollapsed(false)}
            title="Ouvrir le menu"
            aria-label="Ouvrir le menu"
            className={`group fixed left-2 top-3 lg:top-[calc((100vh+7rem)/2)] lg:-translate-y-1/2 z-30 w-8 h-8 rounded-full bg-gradient-to-b from-emerald-500 to-[#023927] text-white border border-emerald-300/50 shadow-lg shadow-emerald-900/40 flex items-center justify-center transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-emerald-500/50 active:scale-95 ${!isSidebarCollapsed || isArrowHidden ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
          >
            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>

          <div className={`relative overflow-x-hidden lg:max-h-[calc(100vh-7rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-[width] duration-500 ease-in-out ${isSidebarCollapsed ? 'lg:w-0 lg:overflow-hidden' : 'lg:w-72 lg:overflow-y-auto'}`}>
            <div className={`relative transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'h-0 overflow-hidden opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <div className="relative overflow-hidden bg-gradient-to-b from-[#023927] via-emerald-900 to-[#023927] text-white shadow-sm mt-6">
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/5 blur-xl"></div>
                <div className="absolute -bottom-16 -left-10 w-36 h-36 rounded-full bg-emerald-400/10 blur-2xl"></div>

                <nav className="relative p-3 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isDanger = (item as any).isDanger;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'logout') {
                            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            localStorage.removeItem('auth_user');
                            sessionStorage.removeItem(TRAVELER_SESSION_KEY);
                            navigate('/auth');
                            return;
                          }
                          setActiveTab(item.id);
                        }}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                          isDanger
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/15 mt-2 border-t border-white/10 pt-3'
                            : isActive
                            ? 'bg-white text-emerald-900 shadow-md'
                            : 'text-white/75 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isDanger ? '' : isActive ? 'text-emerald-700' : 'text-white/60'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-4">
                <MySpacesCard
                  currentRole="traveler"
                  currentUserId={userId}
                  linkedSpaces={linkedSpaces}
                  originalRole={originalRole}
                  onSpacesChanged={(newLinked) => {
                    setLinkedSpaces(newLinked);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 py-4 sm:py-8 lg:pl-8">
          <div className="space-y-6">
            {/* Tab Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerSpace;
