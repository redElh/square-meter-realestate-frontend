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
      }
    ],
    clients: [
      {
        path: '/confidential',
        label: 'Sélection confidentielle',
        Icon: ShieldCheckIcon,
        category: 'clients',
        description: 'Propriétés discrètes et prestigieuses'
      },
      {
        path: '/traveler',
        label: 'Espace Voyageurs',
        Icon: PaperAirplaneIcon,
        category: 'clients',
        description: 'Locations de prestige pour vos voyages'
      },
      {
        path: '/auth',
        label: 'Connexion',
        Icon: UserIcon,
        category: 'clients',
        description: 'Accédez à votre espace personnel'
      },
      {
        path: '/dashboard',
        label: 'Acquéreurs',
        Icon: CogIcon,
        category: 'clients',
        description: 'Gérez vos interactions et achats'
      }
    ],
    company: [
      {
        path: '/agency',
        label: 'Notre histoire',
        Icon: BuildingOfficeIcon,
        category: 'company',
        description: 'Découvrez notre histoire et expertise'
      },
      {
        path: '/services',
        label: 'Nos services',
        Icon: StarIcon,
        category: 'company',
        description: 'Services et offres pour nos clients, y compris conciergerie'
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
      },
      {
        path: '/mag',
        label: 'Le Mag',
        Icon: NewspaperIcon,
        category: 'company',
        description: 'Actualités et tendances immobilières'
      }
    ],
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const topAlpha = 0.82258841 + (1 - 0.82258841) * scrollAlpha;
  const midAlpha = 0.72454919 + (1 - 0.72454919) * scrollAlpha;
  const bottomAlpha = scrollAlpha;
  const headerBackground = `linear-gradient(180deg, rgba(255,255,255, ${topAlpha}) 0%, rgba(255,255,255, ${midAlpha}) 52%, rgba(255,255,255, ${bottomAlpha}) 100%)`;

  return (
    <>
      {/* Main Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
        style={{
          willChange: 'transform, height, background-color, box-shadow',
          background: headerBackground,
          boxShadow: isScrolled ? '0 8px 30px rgba(0,0,0,0.08)' : '0 2px 12px rgba(0,0,0,0.04)',
          backdropFilter: 'saturate(120%) blur(8px)',
          transition: 'background-color 260ms ease, backdrop-filter 260ms ease, background-image 260ms ease, box-shadow 260ms ease'
        }}
      >
        <div className="container mx-auto px-2 sm:px-6 relative">
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-5'}`}>

            {/* Left Corner - Language Selector */}
            <div className="w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center">
              <Link to="/settings" className="relative group p-1.5 sm:p-3 rounded-lg sm:rounded-2xl bg-transparent hover:bg-white/10 transition-all duration-200 border border-gray-200" onClick={() => setActiveHover('lang')} onMouseEnter={() => setActiveHover('lang')} onMouseLeave={() => setActiveHover(null)}>
                <GlobeAltIcon className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800 relative z-10 transition-colors duration-200" />
              </Link>
            </div>

            {/* Left Navigation - Propriétés */}
            <div className="flex-1 flex justify-start sm:justify-center">
              {navigation.primary[0] && (
                <Link
                  to={navigation.primary[0].path}
                  className="group relative"
                  onMouseEnter={() => setActiveHover('buy')}
                  onMouseLeave={() => setActiveHover(null)}
                  onFocus={(e) => (e.currentTarget as HTMLAnchorElement).blur()}
                >
                  <div className="px-2 py-1.5 sm:px-6 sm:py-3 mx-0.5 sm:mx-2 rounded-lg sm:rounded-2xl transition-all duration-200 hover:bg-white/10 cursor-pointer">
                    <span className="text-gray-800 text-xs sm:text-lg font-medium tracking-wide transition-colors duration-200">
                      {navigation.primary[0].label}
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {/* Centered Logo - Mobile Optimized */}
            <Link
              to="/"
              className="group flex-shrink-0"
              onMouseEnter={() => setActiveHover('logo')}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="flex flex-col items-center">
                <div className={`relative transform group-hover:scale-105 transition-all duration-400 ${isScrolled ? 'scale-90 sm:scale-95' : 'scale-95 sm:scale-100'}`}>
                  <div className={`relative ${
                    isScrolled ? 'w-10 h-10 sm:w-14 sm:h-14' : 'w-12 h-12 sm:w-20 sm:h-20'
                  } bg-white/60 rounded-lg sm:rounded-2xl shadow-md transform group-hover:rotate-1 transition-all duration-300 flex items-center justify-center overflow-hidden border border-gray-200 backdrop-blur-sm`}>
                    <img 
                      src="/logo-m2.jpg" 
                      alt="Square Meter logo" 
                      className="w-full h-full object-contain p-0.5 sm:p-0" 
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Brand Text - Hidden on small mobile, shown on larger mobile/tablet */}
                <div className={`mt-1.5 sm:mt-3 text-center transition-all duration-500 hidden xs:block ${isScrolled ? 'scale-75 -translate-y-0.5 opacity-90' : 'scale-90 sm:scale-100 opacity-100'}`}>
                  <div className="flex flex-col items-center space-y-0 sm:space-y-1">
                    <span className={`text-[10px] sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.3em] uppercase transition-all duration-500 ${
                      activeHover === 'logo'
                        ? 'text-gray-900'
                        : 'text-gray-700'
                    }`}>
                      SQUARE METER
                    </span>
                    <span className="text-[9px] sm:text-xs text-gray-500 tracking-[0.1em] sm:tracking-[0.2em] transition-all duration-500 font-medium">
                      IMMOBILIER
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Right Navigation - Propriétaires */}
            <div className="flex-1 flex justify-end sm:justify-center">
              {navigation.primary[1] && (
                <Link
                  to={navigation.primary[1].path}
                  className="group relative"
                  onMouseEnter={() => setActiveHover('rent')}
                  onMouseLeave={() => setActiveHover(null)}
                  onFocus={(e) => (e.currentTarget as HTMLAnchorElement).blur()}
                >
                  <div className="px-2 py-1.5 sm:px-6 sm:py-3 mx-0.5 sm:mx-2 rounded-lg sm:rounded-2xl transition-all duration-200 hover:bg-white/10 cursor-pointer">
                    <span className="text-gray-800 text-xs sm:text-lg font-medium tracking-wide transition-colors duration-200">
                      {navigation.primary[1].label}
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {/* Enhanced Menu Button - Mobile Optimized */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
              aria-label="Menu principal"
              className="relative w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center group bg-transparent hover:bg-white/10 rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm transition-all duration-200"
            >
              <div className="absolute inset-0 rounded-lg sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Transform between hamburger and close icon */}
              <div className="relative w-4 h-4 sm:w-6 sm:h-6">
                {!isMenuOpen ? (
                  // Hamburger icon
                  <>
                    <div className="absolute top-0.5 left-0 w-full h-0.5 bg-gray-800 transform transition-all duration-200" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5 bg-gray-800 transform transition-all duration-200" />
                    <div className="absolute bottom-0.5 left-0 w-full h-0.5 bg-gray-800 transform transition-all duration-200" />
                  </>
                ) : (
                  // Close icon (X)
                  <>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 transform -rotate-45 transition-all duration-200" />
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 transform rotate-45 transition-all duration-200" />
                  </>
                )}
              </div>

              <div className="absolute inset-0 rounded-lg sm:rounded-2xl border border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to offset the fixed header on non-hero pages */}
      {(() => {
        const heroRoots = ['/', '/properties', '/owners'];
        const isHero = heroRoots.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));
        if (isHero) return null;
        const h = headerHeight || (isScrolled ? 64 : 96);
        return (
          <div aria-hidden="true" style={{ height: `${h}px` }} className="w-full" />
        );
      })()}

      {/* Floating Menu Panel (full-width on mobile) */}
      <div className={`fixed inset-0 z-40 transition-all duration-700 pointer-events-none ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 transition-all duration-700 ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute right-0 w-full sm:max-w-2xl transform transition-transform duration-500 pointer-events-auto ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            top: headerHeight ? `${headerHeight}px` : 0,
            height: headerHeight ? `calc(100vh - ${headerHeight}px)` : 'calc(100vh - 96px)',
            background: isScrolled
              ? 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,255,0.99) 100%)'
              : `rgba(255,255,255, ${0.02 + scrollAlpha * 0.6})`,
            backdropFilter: 'saturate(120%) blur(8px)',
            borderLeft: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.06)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
          }}
        >
          <div className="h-full">
            <div className="p-4 sm:p-8 space-y-8 sm:space-y-12">
              {/* Company Section */}
              <div>
                <h3 className="text-gray-800 text-lg sm:text-xl font-bold tracking-widest uppercase mb-6 sm:mb-8">
                  Agence
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {navigation.company.map((item, index) => {
                    const Icon = item.Icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-500 border-2 ${
                          isActivePath(item.path)
                            ? 'bg-gray-50 border-gray-200 shadow-sm'
                            : 'bg-white/60 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-500 ${
                            isActivePath(item.path)
                              ? 'bg-gray-100 text-gray-900 shadow-sm'
                              : 'bg-white/60 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900'
                          }`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="flex-1 min-w-0"> {/* Added min-w-0 for text truncation */}
                            <span className={`text-base sm:text-lg font-semibold transition-all duration-500 truncate ${
                              isActivePath(item.path)
                                ? 'text-gray-900'
                                : 'text-gray-800'
                            }`}>
                              {item.label}
                            </span>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 transition-colors duration-300 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-t-2 border-gray-400 transform rotate-45" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Clients Section */}
              <div>
                <h3 className="text-gray-800 text-lg sm:text-xl font-bold tracking-widest uppercase mb-6 sm:mb-8">
                  Espace Clients
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {navigation.clients.map((item, index) => {
                    const Icon = item.Icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-500 border-2 ${
                          isActivePath(item.path)
                            ? 'bg-gray-50 border-gray-200 shadow-sm'
                            : 'bg-white/60 border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
                        }`}
                        style={{ transitionDelay: `${index * 100 + 200}ms` }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-500 ${
                            isActivePath(item.path)
                              ? 'bg-gray-100 text-gray-900 shadow-sm'
                              : 'bg-white/60 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900'
                          }`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-base sm:text-lg font-semibold transition-all duration-500 truncate ${
                              isActivePath(item.path)
                                ? 'text-gray-900'
                                : 'text-gray-800'
                            }`}>
                              {item.label}
                            </span>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 transition-colors duration-300 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 border-r-2 border-t-2 border-gray-400 transform rotate-45" />
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

      {/* Mobile Navigation Bar (Bottom Navigation for primary actions) */}
      {!isMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 py-1.5 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex justify-around items-center">
            {navigation.primary.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'text-gray-900 bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
            <Link
              to="/auth"
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-all duration-200 ${
                isActivePath('/auth')
                  ? 'text-gray-900 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <UserIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Connexion</span>
            </Link>
            <Link
              to="/contact"
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-all duration-200 ${
                isActivePath('/contact')
                  ? 'text-gray-900 bg-gray-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <PhoneIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">Contact</span>
            </Link>
          </div>
        </div>
      )}

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
        /* Mobile responsive utilities */
        @media (min-width: 475px) {
          .xs\\:block {
            display: block !important;
          }
        }
        /* Line clamp for description text */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Header;