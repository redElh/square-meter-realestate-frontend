// src/components/Layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../../contexts/LocalizationContext';
import { useCurrency } from '../../hooks/useCurrency';
import {
  HomeModernIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  UserIcon,
  CogIcon,
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
  const { t, i18n } = useTranslation();
  useLocalization();
  const { getSymbol } = useCurrency();

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

  // Check if we're on property detail page
  const isPropertyDetailPage = location.pathname.includes('/properties/');
  // Force scrolled state on property detail page
  const effectiveIsScrolled = isPropertyDetailPage || isScrolled;

  const upper = (s: string) => (s ? s.toLocaleUpperCase(i18n.language) : s);

  const navigation = {
    primary: [
      {
        path: '/properties',
        label: upper(t('navigation.properties')),
        Icon: HomeModernIcon,
        description: t('header.exclusiveProperties')
      },
      {
        path: '/owners',
        label: upper(t('navigation.owners')),
        Icon: UserGroupIcon,
        description: t('header.prestigeRentals')
      }
    ],
    properties: [
      {
        path: '/properties',
        label: t('header.allProperties'),
        Icon: HomeModernIcon,
        category: 'properties',
        description: t('header.discoverCollection')
      }
    ],
    clients: [
      {
        path: '/traveler',
        label: t('header.travelerSpace'),
        Icon: PaperAirplaneIcon,
        category: 'clients',
        description: t('header.prestigeForTravel')
      },
      {
        path: '/auth',
        label: t('navigation.login'),
        Icon: UserIcon,
        category: 'clients',
        description: t('header.loginDescription')
      },
      {
        path: '/dashboard',
        label: t('navigation.dashboard'),
        Icon: CogIcon,
        category: 'clients',
        description: t('header.dashboardDescription')
      }
    ],
    company: [
      {
        path: '/agency',
        label: t('navigation.agency'),
        Icon: BuildingOfficeIcon,
        category: 'company'
      },
      {
        path: '/services',
        label: t('navigation.services'),
        Icon: StarIcon,
        category: 'company'
      },
      {
        path: '/contact',
        label: t('navigation.contact'),
        Icon: PhoneIcon,
        category: 'company'
      }
      ,
      {
        path: '/mag',
        label: t('navigation.magazine'),
        Icon: NewspaperIcon,
        category: 'company'
      }
      // Magazine temporarily hidden
      // {
      //   path: '/mag',
      //   label: t('navigation.magazine'),
      //   Icon: NewspaperIcon,
      //   category: 'company'
      // }
    ],
  };

  // Feature flag to hide the Clients (Espace Clients) secondary menu section
  const showClientSection = false;

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
        <div className="container mx-auto px-1.5 sm:px-6 relative">
          <div className={`flex items-center justify-between gap-1 sm:gap-4 transition-all duration-500 ${effectiveIsScrolled ? 'py-1.5 sm:py-3' : 'py-2 sm:py-5'}`}>

            {/* Left Corner - Language & Currency Selector */}
            <div className="flex items-center justify-center flex-shrink-0">
              <Link 
                to="/settings" 
                className="relative group px-1 py-1 sm:px-4 sm:py-2.5 rounded-md sm:rounded-xl bg-white/80 hover:bg-white border border-gray-200 sm:border-2 hover:border-[#023927] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-0.5 sm:gap-2" 
                onClick={() => setActiveHover('lang')} 
                onMouseEnter={() => setActiveHover('lang')} 
                onMouseLeave={() => setActiveHover(null)}
              >
                <GlobeAltIcon className="w-3 h-3 sm:w-5 sm:h-5 text-gray-700 group-hover:text-[#023927] transition-colors duration-200" />
                <span className="text-[10px] sm:text-sm font-semibold text-gray-800 group-hover:text-[#023927] uppercase transition-colors duration-200">
                  {i18n.language.split('-')[0]}
                </span>
                <div className="hidden sm:block w-px h-4 bg-gray-300 group-hover:bg-[#023927]/30 transition-colors duration-200"></div>
                <span className="hidden sm:inline text-xs font-medium text-gray-600 group-hover:text-[#023927] transition-colors duration-200">
                  {getSymbol()}
                </span>
              </Link>
            </div>

            {/* Left Navigation - Propriétés */}
            <div className="flex-1 min-w-0 flex justify-start sm:justify-center items-center pl-2 sm:pl-0">
              {navigation.primary[0] && (
                <Link
                  to={navigation.primary[0].path}
                  className="group relative"
                  onMouseEnter={() => setActiveHover('buy')}
                  onMouseLeave={() => setActiveHover(null)}
                  onFocus={(e) => (e.currentTarget as HTMLAnchorElement).blur()}
                >
                    <div className="px-2 py-1 sm:px-6 sm:py-3 mx-0 sm:mx-2 rounded-md sm:rounded-2xl transition-all duration-200 hover:bg-white/10 cursor-pointer">
                    <span className="text-gray-800 text-[11px] sm:text-lg font-medium tracking-tight sm:tracking-wide transition-colors duration-200 max-w-[7rem] sm:max-w-none truncate">
                      {navigation.primary[0].label}
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {/* Centered Logo - Mobile Optimized */}
            <Link
              to="/"
              className="group flex-shrink-0 mx-0 sm:mx-2 lg:mr-14"
              onMouseEnter={() => setActiveHover('logo')}
              onMouseLeave={() => setActiveHover(null)}
            >
              <div className="flex flex-col items-center justify-center">
                <div className={`relative transform group-hover:scale-105 transition-all duration-400 flex items-center justify-center ${effectiveIsScrolled ? 'scale-90 sm:scale-95' : 'scale-100 sm:scale-100'}`}>
                  <div className={`relative ${
                    effectiveIsScrolled ? 'w-14 h-14 sm:w-20 sm:h-20' : 'w-16 h-16 sm:w-32 sm:h-32'
                  } bg-transparent rounded-lg sm:rounded-2xl transform group-hover:rotate-1 transition-all duration-300 flex items-center justify-center overflow-hidden mx-auto`}>
                    <img 
                      src="/logo-m2.png" 
                      alt="Square Meter logo" 
                      className="w-full h-full object-contain p-0 bg-transparent" 
                      style={{ background: 'transparent' }}
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Brand Text - Always visible */}
                <div className={`mt-0.5 sm:-mt-2 text-center transition-all duration-500 w-full flex items-center justify-center ${effectiveIsScrolled ? 'scale-75 -translate-y-0.5 opacity-90' : 'scale-100 sm:scale-100 opacity-100'}`}>
                  <div className="flex flex-col items-center justify-center space-y-0 sm:space-y-1">
                    <span className={`text-[9px] sm:text-sm font-semibold tracking-[0.1em] sm:tracking-[0.3em] uppercase transition-all duration-500 whitespace-nowrap ${
                      activeHover === 'logo'
                        ? 'text-gray-900'
                        : 'text-gray-700'
                    }`}>
                      SQUARE METER
                    </span>
                    <span className="text-[8px] sm:text-xs text-gray-500 tracking-[0.08em] sm:tracking-[0.2em] transition-all duration-500 font-medium whitespace-nowrap">
                      {t('brand.subtitle')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Right Navigation - Propriétaires */}
            <div className="flex-1 min-w-0 flex justify-end sm:justify-center items-center pr-2 sm:pr-0">
              {navigation.primary[1] && (
                <Link
                  to={navigation.primary[1].path}
                  className="group relative"
                  onMouseEnter={() => setActiveHover('rent')}
                  onMouseLeave={() => setActiveHover(null)}
                  onFocus={(e) => (e.currentTarget as HTMLAnchorElement).blur()}
                >
                    <div className="px-2 py-1 sm:px-6 sm:py-3 mx-0 sm:mx-2 rounded-md sm:rounded-2xl transition-all duration-200 hover:bg-white/10 cursor-pointer">
                    <span className="text-gray-800 text-[11px] sm:text-lg font-medium tracking-tight sm:tracking-wide transition-colors duration-200 max-w-[7rem] sm:max-w-none truncate">
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
              className="relative w-7 h-7 sm:w-14 sm:h-14 flex items-center justify-center group bg-transparent hover:bg-white/10 rounded-md sm:rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 flex-shrink-0"
            >
              <div className="absolute inset-0 rounded-md sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Transform between hamburger and close icon */}
              <div className="relative w-3.5 h-3.5 sm:w-6 sm:h-6">
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
      <div className={`fixed inset-0 z-60 transition-all duration-700 pointer-events-none ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`} style={{ zIndex: 99999 }}>
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 transition-all duration-700 ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`fixed right-0 w-full sm:max-w-2xl transform transition-all duration-500 pointer-events-auto ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            top: headerHeight ? `${headerHeight}px` : '96px',
            height: headerHeight ? `calc(100vh - ${headerHeight}px)` : 'calc(100vh - 96px)',
            background: isScrolled
              ? 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,255,0.99) 100%)'
              : `rgba(255,255,255, ${0.02 + scrollAlpha * 0.6})`,
            backdropFilter: 'saturate(120%) blur(8px)',
            borderLeft: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.06)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
            transition: 'top 500ms ease, height 500ms ease, background-color 260ms ease, backdrop-filter 260ms ease, background-image 260ms ease',
            zIndex: 100000
          }}
        >
          <div className="h-full">
            <div className="p-4 sm:p-8 space-y-8 sm:space-y-12">
              {/* Company Section */}
              <div>
                <h3 className="text-gray-800 text-lg sm:text-xl font-bold tracking-widest uppercase mb-6 sm:mb-8">
                  {t('header.companyMenuTitle')}
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
                        <div className="flex items-center space-x-3 sm:space-x-4">
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
              {showClientSection && (
                <div>
                  <h3 className="text-gray-800 text-lg sm:text-xl font-bold tracking-widest uppercase mb-6 sm:mb-8">
                    {t('navigation.clientSpace')}
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
              )}
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