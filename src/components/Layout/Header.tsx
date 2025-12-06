// src/components/Layout/Header.tsx
// src/components/Layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeModernIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserIcon,
  CogIcon,
  BriefcaseIcon,
  StarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  // mouse position tracking removed (no longer used for header gradient)
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [scrollAlpha, setScrollAlpha] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      setIsScrolled(y > 50);
      const alpha = Math.min(1, y / 120);
      setScrollAlpha(alpha);
    };

    const handleResize = () => {
      const h = headerRef.current?.offsetHeight ?? 96;
      setHeaderHeight(h);
    };

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Keep headerHeight updated when scrolled state changes
  useEffect(() => {
    const h = headerRef.current?.offsetHeight ?? (isScrolled ? 64 : 96);
    setHeaderHeight(h);
  }, [isScrolled]);

  const navigation = {
    primary: [
      {
        path: '/properties',
        label: 'Propriétés',
        Icon: HomeModernIcon,
        description: 'Propriétés exclusives'
      },
      {
        path: '/owners',
        label: 'Propriétaires',
        Icon: UserGroupIcon,
        description: 'Locations prestige'
      }
    ],
    properties: [
      {
        path: '/properties',
        label: 'Toutes les propriétés',
        Icon: HomeModernIcon,
        category: 'properties',
        description: 'Découvrez notre collection exclusive'
      },
      {
        path: '/confidential',
        label: 'Sélection confidentielle',
        Icon: ShieldCheckIcon,
        category: 'properties',
        description: 'Propriétés discrètes et prestigieuses'
      },
      {
        path: '/investment',
        label: 'Investissement',
        Icon: ChartBarIcon,
        category: 'properties',
        description: "Opportunités d'investissement lucratives"
      }
    ],
    clients: [
      {
        path: '/owners',
        label: 'Propriétaires',
        Icon: UserGroupIcon,
        category: 'clients',
        description: 'Solutions sur mesure pour propriétaires'
      },
      {
        path: '/selling-multistep',
        label: 'Vendre votre bien',
        Icon: HomeModernIcon,
        category: 'clients',
        description: 'Estimation et accompagnement personnalisé'
      },
      {
        path: '/traveler',
        label: 'Espace Voyageurs',
        Icon: PaperAirplaneIcon,
        category: 'clients',
        description: 'Locations de prestige pour vos voyages'
      },
      {
        path: '/concierge',
        label: 'Services Conciergerie',
        Icon: StarIcon,
        category: 'clients',
        description: 'Services haut de gamme sur mesure'
      }
    ],
    company: [
      {
        path: '/agency',
        label: "L'agence",
        Icon: BuildingOfficeIcon,
        category: 'company',
        description: 'Découvrez notre histoire et expertise'
      },
      {
        path: '/mag',
        label: 'Le Mag',
        Icon: NewspaperIcon,
        category: 'company',
        description: 'Actualités et tendances immobilières'
      },
      {
        path: '/careers',
        label: 'Carrières',
        Icon: BriefcaseIcon,
        category: 'company',
        description: "Rejoignez notre équipe d'experts"
      },
      {
        path: '/contact',
        label: 'Contact',
        Icon: PhoneIcon,
        category: 'company',
        description: 'Échangeons sur vos projets'
      }
    ],
    account: [
      {
        path: '/auth',
        label: 'Connexion',
        Icon: UserIcon,
        category: 'account',
        description: 'Accédez à votre espace personnel'
      },
      {
        path: '/dashboard',
        label: 'Tableau de bord',
        Icon: CogIcon,
        category: 'account',
        description: 'Gérez vos propriétés et services'
      },
      {
        path: '/services',
        label: 'Mes services',
        Icon: StarIcon,
        category: 'account',
        description: 'Vos services personnalisés'
      }
    ]
  };

  // Localize primary icons (available via navigation if needed)

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Compute blended gradient stops so header whitens progressively on scroll
  const topAlpha = 0.82258841 + (1 - 0.82258841) * scrollAlpha; // blends to 1.0
  const midAlpha = 0.72454919 + (1 - 0.72454919) * scrollAlpha; // blends to 1.0
  const bottomAlpha = scrollAlpha; // goes from 0 -> 1 (transparent -> white)
  const headerBackground = `linear-gradient(180deg, rgba(255,255,255, ${topAlpha}) 0%, rgba(255,255,255, ${midAlpha}) 52%, rgba(255,255,255, ${bottomAlpha}) 100%)`;

  // mouse position is tracked for potential effects (kept for future use)

  return (
    <>
      {/* Main Header - overlays content (no spacer) */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
        style={{
          willChange: 'transform, height, background-color, box-shadow',
          // Use a blended gradient that whitens with scroll
          background: headerBackground,
          // subtle shadow at top, stronger when scrolled
          boxShadow: isScrolled ? '0 8px 30px rgba(0,0,0,0.08)' : '0 2px 12px rgba(0,0,0,0.04)',
          backdropFilter: 'saturate(120%) blur(8px)',
          transition: 'background-color 260ms ease, backdrop-filter 260ms ease, background-image 260ms ease, box-shadow 260ms ease'
        }}
      >
        {/* neutral overlay - removed decorative gold particles and grid */}

        <div className="container mx-auto px-6 relative">
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>

            {/* Left Corner - Language Selector (keep globe, neutral colors) */}
            <div className="w-14 h-14 flex items-center justify-center">
              <Link to="/settings" className="relative group p-3 rounded-2xl bg-transparent hover:bg-white/10 transition-all duration-200 border border-gray-200" onClick={() => setActiveHover('lang')} onMouseEnter={() => setActiveHover('lang')} onMouseLeave={() => setActiveHover(null)}>
                <GlobeAltIcon className="w-6 h-6 text-gray-800 relative z-10 transition-colors duration-200" />
              </Link>
            </div>

            {/* Left Navigation - Acheter (text only, pointer cursor, no focus ring) */}
            <div className="flex-1 flex justify-center">
              {navigation.primary[0] && (
                <Link
                  to={navigation.primary[0].path}
                  className="group relative"
                  onMouseEnter={() => setActiveHover('buy')}
                  onMouseLeave={() => setActiveHover(null)}
                  onFocus={(e) => (e.currentTarget as HTMLAnchorElement).blur()}
                >
                  <div className="px-6 py-3 mx-2 rounded-2xl transition-all duration-200 hover:bg-white/10 cursor-pointer">
                    <span className="text-gray-800 text-lg font-medium tracking-wide transition-colors duration-200">
                      {navigation.primary[0].label}
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {/* Centered Logo */}
            <Link
              to="/"
              className="relative group flex-shrink-0"
              onMouseEnter={() => setActiveHover('logo')}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="flex flex-col items-center">
                <div className={`relative transform group-hover:scale-105 transition-all duration-400 ${isScrolled ? 'scale-95' : 'scale-100'}`}>
                  {/* Logo Main - neutral styling */}
                  <div className={`relative ${
                    isScrolled ? 'w-14 h-14' : 'w-20 h-20'
                  } bg-white/60 rounded-2xl shadow-md transform group-hover:rotate-1 transition-all duration-300 flex items-center justify-center overflow-hidden border border-gray-200 backdrop-blur-sm`}>
                    <div className="relative z-10 flex flex-col items-center">
                      <span className={`text-gray-900 font-bold ${
                        isScrolled ? 'text-2xl' : 'text-3xl'
                      } tracking-tighter leading-none`}>
                        M²
                      </span>
                      <div className={`${
                        isScrolled ? 'w-5' : 'w-6'
                      } h-0.5 bg-gray-300 mt-1 rounded-full transition-all duration-300`} />
                    </div>
                  </div>
                </div>

                {/* Brand Text */}
                <div className={`mt-3 text-center transition-all duration-500 ${isScrolled ? 'scale-80 -translate-y-1 opacity-90' : 'scale-100 opacity-100'}`}>
                  <div className="flex flex-col items-center space-y-1">
                    <span className={`text-sm font-semibold tracking-[0.3em] uppercase transition-all duration-500 ${
                      activeHover === 'logo'
                        ? 'text-gray-900'
                        : 'text-gray-700'
                    }`}>
                      SQUARE METER
                    </span>
                    <span className="text-xs text-gray-500 tracking-[0.2em] transition-all duration-500 font-medium">
                      IMMOBILIER
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Right Navigation - Louer (text only) */}
            <div className="flex-1 flex justify-center">
              {navigation.primary[1] && (
                <Link
                  to={navigation.primary[1].path}
                  className="group relative"
                  onMouseEnter={() => setActiveHover('rent')}
                  onMouseLeave={() => setActiveHover(null)}
                  onFocus={(e) => (e.currentTarget as HTMLAnchorElement).blur()}
                >
                  <div className="px-6 py-3 mx-2 rounded-2xl transition-all duration-200 hover:bg-white/10 cursor-pointer">
                    <span className="text-gray-800 text-lg font-medium tracking-wide transition-colors duration-200">
                      {navigation.primary[1].label}
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {/* Enhanced Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-14 h-14 flex items-center justify-center group bg-transparent hover:bg-white/10 rounded-2xl border border-gray-200 shadow-sm transition-all duration-200"
            >
              {/* subtle animated background removed gold tint */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Transform between hamburger and close icon */}
              <div className="relative w-6 h-6">
                {!isMenuOpen ? (
                  // Hamburger icon
                  <>
                    <div className="absolute top-1 left-0 w-6 h-0.5 bg-gray-800 transform transition-all duration-200" />
                    <div className="absolute top-3 left-0 w-6 h-0.5 bg-gray-800 transform transition-all duration-200" />
                    <div className="absolute top-5 left-0 w-6 h-0.5 bg-gray-800 transform transition-all duration-200" />
                  </>
                ) : (
                  // Close icon (X)
                  <>
                    <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-gray-800 transform -rotate-45 transition-all duration-200" />
                    <div className="absolute top-1/2 left-0 w-6 h-0.5 bg-gray-800 transform rotate-45 transition-all duration-200" />
                  </>
                )}
              </div>

              <div className="absolute inset-0 rounded-2xl border border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Menu Panel (right-side) */}
      <div className={`fixed inset-0 z-40 transition-all duration-700 pointer-events-none ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-transparent transition-all duration-700 ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute right-0 w-full max-w-2xl transform transition-transform duration-500 pointer-events-auto ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            top: headerHeight ? `${headerHeight}px` : 0,
            height: headerHeight ? `calc(100vh - ${headerHeight}px)` : 'calc(100vh - 96px)',
            background: isScrolled
              ? 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,255,0.99) 100%)'
              : `rgba(255,255,255, ${0.02 + scrollAlpha * 0.6})`,
            backdropFilter: 'saturate(120%)',
            borderLeft: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.06)',
            overflowY: 'auto'
          }}
        >
          <div className="h-full">
            <div className="p-8 space-y-12">

              {/* Properties Section */}
              <div>
                <h3 className="text-gray-800 text-xl font-bold tracking-widest uppercase mb-8">
                  Propriétés Exclusives
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {navigation.properties.map((item, index) => {
                    const Icon = item.Icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative p-6 rounded-2xl transition-all duration-500 border-2 ${
                          isActivePath(item.path)
                            ? 'bg-gray-50 border-gray-200 shadow-sm'
                            : 'bg-white/60 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl transition-all duration-500 ${
                            isActivePath(item.path)
                              ? 'bg-gray-100 text-gray-900 shadow-sm'
                              : 'bg-white/60 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <span className={`text-lg font-semibold transition-all duration-500 ${
                              isActivePath(item.path)
                                ? 'text-gray-900'
                                : 'text-gray-800'
                            }`}>
                              {item.label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1 transition-colors duration-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                          <div className="w-3 h-3 border-r-2 border-t-2 border-gray-400 transform rotate-45" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Clients Section */}
              <div>
                <h3 className="text-gray-800 text-xl font-bold tracking-widest uppercase mb-8">
                  Espace Clients
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {navigation.clients.map((item, index) => {
                    const Icon = item.Icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative p-6 rounded-2xl transition-all duration-500 border-2 ${
                          isActivePath(item.path)
                            ? 'bg-gray-50 border-gray-200 shadow-sm'
                            : 'bg-white/60 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
                        }`}
                        style={{ transitionDelay: `${index * 100 + 200}ms` }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl transition-all duration-500 ${
                            isActivePath(item.path)
                              ? 'bg-gray-100 text-gray-900 shadow-sm'
                              : 'bg-white/60 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <span className={`text-lg font-semibold transition-all duration-500 ${
                              isActivePath(item.path)
                                ? 'text-gray-900'
                                : 'text-gray-800'
                            }`}>
                              {item.label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1 transition-colors duration-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                          <div className="w-3 h-3 border-r-2 border-t-2 border-gray-400 transform rotate-45" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Company Section */}
              <div>
                <h3 className="text-gray-800 text-xl font-bold tracking-widest uppercase mb-8">
                  L'Entreprise
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {navigation.company.map((item, index) => {
                    const Icon = item.Icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative p-6 rounded-2xl transition-all duration-500 border-2 ${
                          isActivePath(item.path)
                            ? 'bg-gray-50 border-gray-200 shadow-sm'
                            : 'bg-white/60 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
                        }`}
                        style={{ transitionDelay: `${index * 100 + 400}ms` }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl transition-all duration-500 ${
                            isActivePath(item.path)
                              ? 'bg-gray-100 text-gray-900 shadow-sm'
                              : 'bg-white/60 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <span className={`text-lg font-semibold transition-all duration-500 ${
                              isActivePath(item.path)
                                ? 'text-gray-900'
                                : 'text-gray-800'
                            }`}>
                              {item.label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1 transition-colors duration-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                          <div className="w-3 h-3 border-r-2 border-t-2 border-gray-400 transform rotate-45" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Account Section */}
              <div>
                <h3 className="text-gray-800 text-xl font-bold tracking-widest uppercase mb-8">
                  Mon Compte
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {navigation.account.map((item, index) => {
                    const Icon = item.Icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative p-6 rounded-2xl transition-all duration-500 border-2 ${
                          isActivePath(item.path)
                            ? 'bg-gray-50 border-gray-200 shadow-sm'
                            : 'bg-white/60 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
                        }`}
                        style={{ transitionDelay: `${index * 100 + 600}ms` }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl transition-all duration-500 ${
                            isActivePath(item.path)
                              ? 'bg-gray-100 text-gray-900 shadow-sm'
                              : 'bg-white/60 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <span className={`text-lg font-semibold transition-all duration-500 ${
                              isActivePath(item.path)
                                ? 'text-gray-900'
                                : 'text-gray-800'
                            }`}>
                              {item.label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1 transition-colors duration-300">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                          <div className="w-3 h-3 border-r-2 border-t-2 border-gray-400 transform rotate-45" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations to your global CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Header;
