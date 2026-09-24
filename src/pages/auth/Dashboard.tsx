import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AUTH_USER_CHANGED_EVENT } from '../../utils/auth';
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ArrowTrendingUpIcon,
  KeyIcon,
  GlobeAltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import BuyerOverview from './dashboard/BuyerOverview';
import BuyerCrossings from './dashboard/BuyerCrossings';
import BuyerDemands from './dashboard/BuyerDemands';
import BuyerAppointments from './dashboard/BuyerAppointments';
import BuyerMessages from './dashboard/BuyerMessages';
import BuyerDocuments from './dashboard/BuyerDocuments';
import BuyerProfile from './dashboard/BuyerProfile';
import PropertyDetailView from './dashboard/PropertyDetailView';
import SellerOverview from './dashboard/SellerOverview';
import SellerProperties from './dashboard/SellerProperties';
import SellerPropertyDetail from './dashboard/SellerPropertyDetail';
import SellerStats from './dashboard/SellerStats';
import SellerDemands from './dashboard/SellerDemands';
import SellerAppointments from './dashboard/SellerAppointments';
import SellerMessages from './dashboard/SellerMessages';
import SellerDocuments from './dashboard/SellerDocuments';
import SellerProfile from './dashboard/SellerProfile';
import TenantOverview from './dashboard/TenantOverview';
import TenantDemands from './dashboard/TenantDemands';
import TenantCrossings from './dashboard/TenantCrossings';
import TenantAppointments from './dashboard/TenantAppointments';
import TenantMessages from './dashboard/TenantMessages';
import TenantDocuments from './dashboard/TenantDocuments';
import TenantProfile from './dashboard/TenantProfile';
import LessorOverview from './dashboard/LessorOverview';
import LessorProperties from './dashboard/LessorProperties';
import LessorStats from './dashboard/LessorStats';
import LessorDemands from './dashboard/LessorDemands';
import LessorLeases from './dashboard/LessorLeases';
import LessorAppointments from './dashboard/LessorAppointments';
import LessorMessages from './dashboard/LessorMessages';
import LessorDocuments from './dashboard/LessorDocuments';
import LessorProfile from './dashboard/LessorProfile';
import {
  buyerSavedProperties,
  ownerProperties,
  buyerDashboardStats,
  sellerDashboardStats,
  tenantDashboardStats,
  lessorDashboardStats,
} from './dashboard/data';
import { Property } from './dashboard/types';
import UserProfile from '../../components/UserProfile';
import MySpacesCard from './dashboard/MySpacesCard';

type UserRole = 'buyer' | 'seller' | 'lessor' | 'tenant' | 'traveler';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role: urlRole, id: urlId } = useParams<{ role: string; id: string }>();

  const validRole = urlRole === 'buyer' || urlRole === 'owner' || urlRole === 'seller' || urlRole === 'lessor' || urlRole === 'tenant' || urlRole === 'traveler';
  const effectiveRole = urlRole === 'owner' || urlRole === 'lessor' ? 'seller' : urlRole === 'tenant' ? 'buyer' : urlRole;

  const [userType, setUserType] = useState<UserRole>(
    validRole ? (urlRole === 'owner' ? 'seller' : urlRole as UserRole) : 'buyer'
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState(3);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(urlRole === 'user');
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [isRoleSubmitting, setIsRoleSubmitting] = useState(false);
  const [roleSubmitError, setRoleSubmitError] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [linkedSpaces, setLinkedSpaces] = useState<string[]>([]);
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
    if (validRole && urlId) {
      const cached = localStorage.getItem('auth_user');
      let existingData: any = {};
      if (cached) {
        try { existingData = JSON.parse(cached); } catch { /* ignore */ }
      }
      localStorage.setItem('auth_user', JSON.stringify({
        id: urlId,
        role: urlRole,
        email: existingData.email || '',
        originalRole: existingData.originalRole || '',
        linkedSpaces: existingData.linkedSpaces || [],
      }));
      window.dispatchEvent(new Event(AUTH_USER_CHANGED_EVENT));
    }
  }, [urlRole, urlId, validRole]);

  // Fetch user data (linkedSpaces) from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cached = localStorage.getItem('auth_user');
        if (cached) {
          const cachedUser = JSON.parse(cached);
          if (cachedUser.linkedSpaces && cachedUser.linkedSpaces.length > 0) {
            setLinkedSpaces(cachedUser.linkedSpaces);
            setOriginalRole(cachedUser.originalRole || cachedUser.role);
            return;
          }
        }
        const res = await fetch('/auth/check', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            const spaces = data.user.linked_spaces || [];
            const origRole = data.user.original_role || data.user.role;
            setLinkedSpaces(spaces);
            setOriginalRole(origRole);
            const existing = localStorage.getItem('auth_user');
            if (existing) {
              const ex = JSON.parse(existing);
              ex.linkedSpaces = spaces;
              ex.originalRole = origRole;
              localStorage.setItem('auth_user', JSON.stringify(ex));
              window.dispatchEvent(new Event(AUTH_USER_CHANGED_EVENT));
            }
          }
        }
      } catch { /* ignore */ }
    };
    fetchUserData();
  }, [urlRole]);

  // Update userType when URL role changes (space switching)
  useEffect(() => {
    if (validRole && urlRole) {
      setUserType(urlRole === 'owner' ? 'seller' : urlRole as UserRole);
      setActiveTab('overview');
    }
  }, [urlRole, validRole]);

  if (effectiveRole === 'traveler') {
    return <Navigate to="/voyageur" replace />;
  }

  if (!urlRole || !urlId) {
    const cached = localStorage.getItem('auth_user');
    if (cached) {
      try {
        const cachedUser = JSON.parse(cached);
        if (cachedUser.role && cachedUser.id) {
          return <Navigate to={`/dashboard/${cachedUser.role}/${cachedUser.id}`} replace />;
        }
      } catch { /* ignore */ }
    }
    const cookieMatch = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
    if (cookieMatch) {
      try {
        const payload = JSON.parse(atob(cookieMatch[1].split('.')[1]));
        if (payload.userId) {
          return <Navigate to={`/dashboard/user/${payload.userId}`} replace />;
        }
      } catch { /* fall through to /auth */ }
    }
    return <Navigate to="/auth" replace />;
  }

  const handleRoleSubmit = async () => {
    if (!pendingRole || isRoleSubmitting) return;
    if (!urlId) return;
    try {
      setRoleSubmitError(null);
      setIsRoleSubmitting(true);
      const response = await fetch('http://localhost:4000/auth/select-role', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: pendingRole }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to set role');
      }
      setUserType(pendingRole);
      setRoleModalOpen(false);
      const cached = localStorage.getItem('auth_user');
      const existingData = cached ? JSON.parse(cached) : {};
      localStorage.setItem('auth_user', JSON.stringify({
        id: urlId,
        role: pendingRole,
        email: existingData.email || '',
        originalRole: existingData.originalRole || pendingRole,
        linkedSpaces: existingData.linkedSpaces || [pendingRole],
      }));
      window.dispatchEvent(new Event(AUTH_USER_CHANGED_EVENT));
      setLinkedSpaces(existingData.linkedSpaces || [pendingRole]);
      setOriginalRole(existingData.originalRole || pendingRole);
      setActiveTab('overview');
      if (pendingRole === 'traveler') {
        navigate('/voyageur', { replace: true });
      } else {
        navigate(`/dashboard/${pendingRole}/${urlId}`, { replace: true });
      }
    } catch (error) {
      setRoleSubmitError(error instanceof Error ? error.message : 'Unable to set role');
    } finally {
      setIsRoleSubmitting(false);
    }
  };

  const handleCancelRole = () => {
    navigate('/auth', { replace: true });
  };

  const handleCloseUserProfile = () => {
    setIsUserProfileOpen(false);
  };

  const handleSpacesChanged = (newLinkedSpaces: string[]) => {
    setLinkedSpaces(newLinkedSpaces);
  };

  const handleNavigationClick = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedPropertyId(null);
  };

  const handleViewProperty = (id: number) => {
    setSelectedPropertyId(id);
  };

  const selectedProperty: Property | undefined = selectedPropertyId
    ? ((userType === 'buyer' || userType === 'tenant') ? buyerSavedProperties : ownerProperties).find(p => p.id === selectedPropertyId)
    : undefined;

  const buyerNavItems = [
    { id: 'overview', label: 'Tableau de bord', icon: ChartBarIcon },
    { id: 'demands', label: 'Mes recherches', icon: MagnifyingGlassIcon },
    { id: 'properties', label: 'Biens proposés', icon: HomeIcon, count: buyerSavedProperties.length },
    { id: 'appointments', label: 'Rendez-vous', icon: CalendarIcon },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftIcon },
    { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
    { id: 'profile', label: 'Profil', icon: UserCircleIcon },
    { id: 'logout', label: 'Déconnexion', icon: ArrowRightOnRectangleIcon, isDanger: true },
  ];

  const sellerNavItems = [
    { id: 'overview', label: 'Tableau de bord', icon: ChartBarIcon },
    { id: 'properties', label: 'Mes propriétés', icon: HomeIcon },
    { id: 'stats', label: 'Statistiques', icon: ArrowTrendingUpIcon },
    { id: 'inquiries', label: 'Demandes reçues', icon: ChatBubbleLeftIcon },
    { id: 'appointments', label: 'Rendez-vous', icon: CalendarIcon },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftIcon },
    { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
    { id: 'profile', label: 'Profil', icon: UserCircleIcon },
    { id: 'logout', label: 'Déconnexion', icon: ArrowRightOnRectangleIcon, isDanger: true },
  ];

  const tenantNavItems = [
    { id: 'overview', label: 'Tableau de bord', icon: ChartBarIcon },
    { id: 'demands', label: 'Mes recherches', icon: MagnifyingGlassIcon },
    { id: 'properties', label: 'Biens proposés', icon: HomeIcon },
    { id: 'appointments', label: 'Rendez-vous', icon: CalendarIcon },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftIcon },
    { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
    { id: 'profile', label: 'Profil', icon: UserCircleIcon },
    { id: 'logout', label: 'Déconnexion', icon: ArrowRightOnRectangleIcon, isDanger: true },
  ];

  const lessorNavItems = [
    { id: 'overview', label: 'Tableau de bord', icon: ChartBarIcon },
    { id: 'properties', label: 'Mes propriétés', icon: HomeIcon },
    { id: 'stats', label: 'Statistiques et revenus', icon: ArrowTrendingUpIcon },
    { id: 'inquiries', label: 'Demandes reçues', icon: ChatBubbleLeftIcon },
    { id: 'leases', label: 'Baux et contrats', icon: DocumentTextIcon },
    { id: 'appointments', label: 'Rendez-vous', icon: CalendarIcon },
    { id: 'messages', label: 'Messages', icon: ChatBubbleLeftIcon },
    { id: 'documents', label: 'Documents', icon: DocumentTextIcon },
    { id: 'profile', label: 'Profil', icon: UserCircleIcon },
    { id: 'logout', label: 'Déconnexion', icon: ArrowRightOnRectangleIcon, isDanger: true },
  ];

  const navItems = userType === 'buyer' ? buyerNavItems : userType === 'tenant' ? tenantNavItems : userType === 'lessor' ? lessorNavItems : sellerNavItems;

  const renderContent = () => {
    if (selectedProperty) {
      if (userType === 'seller') {
        return (
          <SellerPropertyDetail
            property={selectedProperty}
            onBack={() => setSelectedPropertyId(null)}
          />
        );
      }
      return (
        <PropertyDetailView
          property={selectedProperty}
          onBack={() => setSelectedPropertyId(null)}
        />
      );
    }

    if (userType === 'buyer') {
      switch (activeTab) {
        case 'overview':
          return <BuyerOverview onNavigate={handleNavigationClick} />;
        case 'demands':
          return <BuyerDemands onNavigate={handleNavigationClick} />;
        case 'properties':
          return <BuyerCrossings onViewProperty={handleViewProperty} />;
        case 'appointments':
          return <BuyerAppointments />;
        case 'messages':
          return <BuyerMessages />;
        case 'documents':
          return <BuyerDocuments />;
        case 'profile':
          return <BuyerProfile />;
        case 'logout':
          return (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <ArrowRightOnRectangleIcon className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">Déconnexion...</p>
              </div>
            </div>
          );
        default:
          return <BuyerOverview onNavigate={handleNavigationClick} />;
      }
    }

    if (userType === 'tenant') {
      switch (activeTab) {
        case 'overview':
          return <TenantOverview onNavigate={handleNavigationClick} />;
        case 'demands':
          return <TenantDemands onNavigate={handleNavigationClick} />;
        case 'properties':
          return <TenantCrossings onViewProperty={handleViewProperty} />;
        case 'appointments':
          return <TenantAppointments />;
        case 'messages':
          return <TenantMessages />;
        case 'documents':
          return <TenantDocuments />;
        case 'profile':
          return <TenantProfile />;
        case 'logout':
          return (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <ArrowRightOnRectangleIcon className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">Déconnexion...</p>
              </div>
            </div>
          );
        default:
          return <TenantOverview onNavigate={handleNavigationClick} />;
      }
    }

    if (userType === 'lessor') {
      switch (activeTab) {
        case 'overview':
          return <LessorOverview onNavigate={handleNavigationClick} />;
        case 'properties':
          return <LessorProperties onViewProperty={handleViewProperty} />;
        case 'stats':
          return <LessorStats />;
        case 'inquiries':
          return <LessorDemands />;
        case 'leases':
          return <LessorLeases />;
        case 'appointments':
          return <LessorAppointments />;
        case 'messages':
          return <LessorMessages />;
        case 'documents':
          return <LessorDocuments />;
        case 'profile':
          return <LessorProfile />;
        case 'logout':
          return (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <ArrowRightOnRectangleIcon className="w-12 h-12 mx-auto mb-3" />
                <p className="text-sm">Déconnexion...</p>
              </div>
            </div>
          );
        default:
          return <LessorOverview onNavigate={handleNavigationClick} />;
      }
    }

    switch (activeTab) {
      case 'overview':
        return <SellerOverview onNavigate={handleNavigationClick} />;
      case 'properties':
        return <SellerProperties onViewProperty={handleViewProperty} />;
      case 'stats':
        return <SellerStats />;
      case 'inquiries':
        return <SellerDemands />;
      case 'appointments':
        return <SellerAppointments />;
      case 'messages':
        return <SellerMessages />;
      case 'documents':
        return <SellerDocuments />;
      case 'profile':
        return <SellerProfile />;
      case 'logout':
        return (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <ArrowRightOnRectangleIcon className="w-12 h-12 mx-auto mb-3" />
              <p className="text-sm">Déconnexion...</p>
            </div>
          </div>
        );
      default:
        return <SellerOverview onNavigate={handleNavigationClick} />;
    }
  };

  const roleConfig = (() => {
    switch (userType) {
      case 'buyer':
        return {
          title: 'Espace Acheteur',
          greeting: "Bonjour, Jean Dupont ! Voici l'activité de votre projet immobilier",
          badge: 'Acheteur',
          icon: UserIcon,
          stats: buyerDashboardStats,
        };
      case 'tenant':
        return {
          title: 'Espace Locataire',
          greeting: "Bonjour ! Voici l'activité de votre recherche locative",
          badge: 'Locataire',
          icon: UserIcon,
          stats: tenantDashboardStats,
        };
      case 'lessor':
        return {
          title: 'Espace Bailleur',
          greeting: "Bonjour, Monsieur Benali ! Voici l'activité de vos biens en location",
          badge: 'Bailleur',
          icon: KeyIcon,
          stats: lessorDashboardStats,
        };
      default:
        return {
          title: 'Espace Vendeur',
          greeting: "Bonjour, Madame El Fassi ! Voici l'activité de vos biens",
          badge: 'Vendeur',
          icon: HomeIcon,
          stats: sellerDashboardStats,
        };
    }
  })();
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Role Selection Modal */}
      {roleModalOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          onKeyDown={(e) => { if (e.key === 'Escape') e.preventDefault(); }}
          tabIndex={-1}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927] px-8 py-6">
              <h2 className="text-white text-2xl font-inter font-light tracking-tight">
                {t('dashboard.roleModal.title', { defaultValue: 'Bienvenue sur Square Meter' })}
              </h2>
              <p className="text-white/80 text-sm mt-1 font-inter">
                {t('dashboard.roleModal.subtitle', { defaultValue: 'Choisissez votre profil pour personnaliser votre expérience.' })}
              </p>
            </div>
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPendingRole('buyer')}
                  className={`relative border-2 p-5 text-left transition-all duration-200 focus:outline-none group ${
                    pendingRole === 'buyer'
                      ? 'border-[#023927] bg-[#023927]/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center mb-3 transition-colors ${
                    pendingRole === 'buyer' ? 'text-[#023927]' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    <UserIcon className="w-8 h-8" />
                  </div>
                  <span className={`block font-inter font-semibold text-sm mb-1 ${
                    pendingRole === 'buyer' ? 'text-[#023927]' : 'text-gray-800'
                  }`}>
                    {t('auth.signup.buyer', { defaultValue: 'Acheteur' })}
                  </span>
                  <span className="block text-xs text-gray-500 font-inter leading-snug">
                    {t('dashboard.roleModal.buyerDescription', { defaultValue: 'Rechercher et sauvegarder des biens immobiliers.' })}
                  </span>
                  {pendingRole === 'buyer' && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-[#023927] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingRole('seller')}
                  className={`relative border-2 p-5 text-left transition-all duration-200 focus:outline-none group ${
                    pendingRole === 'seller'
                      ? 'border-[#023927] bg-[#023927]/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center mb-3 transition-colors ${
                    pendingRole === 'seller' ? 'text-[#023927]' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    <ShieldCheckIcon className="w-8 h-8" />
                  </div>
                  <span className={`block font-inter font-semibold text-sm mb-1 ${
                    pendingRole === 'seller' ? 'text-[#023927]' : 'text-gray-800'
                  }`}>
                    {t('auth.signup.seller', { defaultValue: 'Vendeur' })}
                  </span>
                  <span className="block text-xs text-gray-500 font-inter leading-snug">
                    {t('dashboard.roleModal.sellerDescription', { defaultValue: 'Publier et gérer vos annonces immobilières.' })}
                  </span>
                  {pendingRole === 'seller' && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-[#023927] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingRole('lessor')}
                  className={`relative border-2 p-5 text-left transition-all duration-200 focus:outline-none group ${
                    pendingRole === 'lessor'
                      ? 'border-[#023927] bg-[#023927]/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center mb-3 transition-colors ${
                    pendingRole === 'lessor' ? 'text-[#023927]' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    <HomeIcon className="w-8 h-8" />
                  </div>
                  <span className={`block font-inter font-semibold text-sm mb-1 ${
                    pendingRole === 'lessor' ? 'text-[#023927]' : 'text-gray-800'
                  }`}>
                    {t('auth.signup.lessor', { defaultValue: 'Bailleur' })}
                  </span>
                  <span className="block text-xs text-gray-500 font-inter leading-snug">
                    {t('dashboard.roleModal.lessorDescription', { defaultValue: 'Mettre en location et gérer vos biens.' })}
                  </span>
                  {pendingRole === 'lessor' && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-[#023927] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingRole('tenant')}
                  className={`relative border-2 p-5 text-left transition-all duration-200 focus:outline-none group ${
                    pendingRole === 'tenant'
                      ? 'border-[#023927] bg-[#023927]/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center mb-3 transition-colors ${
                    pendingRole === 'tenant' ? 'text-[#023927]' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    <KeyIcon className="w-8 h-8" />
                  </div>
                  <span className={`block font-inter font-semibold text-sm mb-1 ${
                    pendingRole === 'tenant' ? 'text-[#023927]' : 'text-gray-800'
                  }`}>
                    {t('auth.signup.tenant', { defaultValue: 'Locataire' })}
                  </span>
                  <span className="block text-xs text-gray-500 font-inter leading-snug">
                    {t('dashboard.roleModal.tenantDescription', { defaultValue: 'Trouver et gérer vos locations.' })}
                  </span>
                  {pendingRole === 'tenant' && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-[#023927] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingRole('traveler')}
                  className={`relative border-2 p-5 text-left transition-all duration-200 focus:outline-none group ${
                    pendingRole === 'traveler'
                      ? 'border-[#023927] bg-[#023927]/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center mb-3 transition-colors ${
                    pendingRole === 'traveler' ? 'text-[#023927]' : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    <GlobeAltIcon className="w-8 h-8" />
                  </div>
                  <span className={`block font-inter font-semibold text-sm mb-1 ${
                    pendingRole === 'traveler' ? 'text-[#023927]' : 'text-gray-800'
                  }`}>
                    {t('auth.signup.traveler', { defaultValue: 'Voyageur' })}
                  </span>
                  <span className="block text-xs text-gray-500 font-inter leading-snug">
                    {t('dashboard.roleModal.travelerDescription', { defaultValue: 'Accéder à votre espace voyageur.' })}
                  </span>
                  {pendingRole === 'traveler' && (
                    <span className="absolute top-3 right-3 w-5 h-5 bg-[#023927] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 font-inter mb-5 text-center">
                {t('dashboard.roleModal.permanentNote', { defaultValue: 'Ce choix est définitif et ne pourra pas être modifié ultérieurement.' })}
              </p>
              {roleSubmitError && (
                <p className="text-red-500 text-sm font-inter text-center mb-4">{roleSubmitError}</p>
              )}
              <button
                type="button"
                onClick={handleRoleSubmit}
                disabled={!pendingRole || isRoleSubmitting}
                className="w-full bg-gradient-to-r from-[#023927] to-[#0a4d3a] text-white py-3.5 font-inter font-medium tracking-wide transition-all duration-300 hover:from-[#0a4d3a] hover:to-[#023927] disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase"
              >
                {isRoleSubmitting
                  ? t('dashboard.roleModal.submitting', { defaultValue: 'Enregistrement…' })
                  : t('dashboard.roleModal.confirm', { defaultValue: 'Confirmer mon profil' })}
              </button>
              <button
                type="button"
                onClick={handleCancelRole}
                className="w-full mt-3 border-2 border-gray-200 text-gray-600 py-3 font-inter font-medium transition-all duration-300 hover:border-gray-300 hover:text-gray-800 text-sm uppercase"
              >
                {t('dashboard.roleModal.cancel', { defaultValue: 'Annuler' })}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <roleConfig.icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold">{roleConfig.title}</h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold uppercase tracking-wide">
                      {roleConfig.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm sm:text-base text-emerald-100/90">{roleConfig.greeting}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-emerald-100 capitalize">{today}</p>
                  <p className="text-xs text-emerald-200/80">Square Meter — Gestion client</p>
                </div>
                <button className="relative p-2.5 bg-white/10 border border-white/20 hover:bg-white/20 transition-all rounded-lg">
                  <BellIcon className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {roleConfig.stats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white/10 border border-white/15 rounded-lg px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <StatIcon className="w-4 h-4 text-emerald-100" />
                      <span className="text-lg sm:text-xl font-bold">{stat.value}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-emerald-100/80 leading-tight">{stat.label}</p>
                  </div>
                );
              })}
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
                    const isActive = activeTab === item.id && !selectedProperty;
                    const isDanger = (item as any).isDanger;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'logout') {
                            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            localStorage.removeItem('auth_user');
                            navigate('/auth');
                            return;
                          }
                          handleNavigationClick(item.id);
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
                        {'count' in item && item.count !== undefined && (
                          <span className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
                            isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white/10 text-white/80'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-4">
                <MySpacesCard
                  currentRole={urlRole || ''}
                  currentUserId={urlId || ''}
                  linkedSpaces={linkedSpaces}
                  originalRole={originalRole}
                  onSpacesChanged={handleSpacesChanged}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 py-4 sm:py-8 lg:pl-8">
          {renderContent()}
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
