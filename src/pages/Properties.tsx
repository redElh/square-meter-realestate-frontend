// src/pages/Properties.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { 
  HeartIcon,
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  CheckIcon,
  Square2StackIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronUpIcon,
  ArrowsPointingOutIcon,
  BanknotesIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import { apimoService, Property, isSoldStatus } from '../services/apimoService';
import { useCurrency } from '../hooks/useCurrency';
import SEO from '../components/SEO/SEO';
import ImageGalleryModal from '../components/ImageGalleryModal';
import FilterDropdown from '../components/FilterDropdown';

const normalizeForSearch = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/m²|m\s*2/g, ' m2 ')
    .replace(/\s+/g, ' ')
    .trim();

const TYPE_SEARCH_KEYWORDS: Record<string, string> = {
  buy: 'vente achat acheter a-vendre sale',
  rent: 'location louer a-louer rent rental',
  seasonal: 'vacances saison week-end weekend holiday',
};

const Properties: React.FC = () => {
  const { t } = useTranslation();
  const { format: formatCurrencyPrice, convertPrice, getSymbol } = useCurrency();
  const PROPERTIES_PER_PAGE = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromQuery = Number(searchParams.get('page')) || 0;
  const storedLastViewedId = sessionStorage.getItem('properties:lastViewedId');
  const storedLastViewedPage = Number(sessionStorage.getItem('properties:lastViewedPage')) || 0;
  const initialPage = Math.max(
    1,
    pageFromQuery || (storedLastViewedId ? storedLastViewedPage : 1)
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<string>(searchParams.get('type') || 'all');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [bedroomsFilter, setBedroomsFilter] = useState<number | null>(() => {
    const value = searchParams.get('bedrooms');
    const parsed = Number(value);
    return value !== null && !Number.isNaN(parsed) ? parsed : null;
  });
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(searchParams.get('propertyType') || '');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [surfaceMin, setSurfaceMin] = useState<number | null>(() => {
    const value = searchParams.get('surfaceMin');
    const parsed = Number(value);
    return value !== null && !Number.isNaN(parsed) ? parsed : null;
  });
  const [surfaceMax, setSurfaceMax] = useState<number | null>(() => {
    const value = searchParams.get('surfaceMax');
    const parsed = Number(value);
    return value !== null && !Number.isNaN(parsed) ? parsed : null;
  });
  const [budgetMin, setBudgetMin] = useState<number | null>(() => {
    const value = searchParams.get('budgetMin');
    const parsed = Number(value);
    return value !== null && !Number.isNaN(parsed) ? parsed : null;
  });
  const [budgetMax, setBudgetMax] = useState<number | null>(() => {
    const value = searchParams.get('budgetMax');
    const parsed = Number(value);
    return value !== null && !Number.isNaN(parsed) ? parsed : null;
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPlaying] = useState(true);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const propertiesListRef = useRef<HTMLDivElement>(null);
  const firstPropertyCardRef = useRef<HTMLDivElement>(null);
  const hasInitializedFiltersRef = useRef(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const suppressScrollTopRef = useRef(false);
  const propertyTypeCarouselRef = useRef<HTMLDivElement>(null);
  const propertyTypeTrackRef = useRef<HTMLDivElement>(null);
  const carouselStepRef = useRef(0);
  const [propertyTypeCarouselHover, setPropertyTypeCarouselHover] = useState(false);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [carouselSliding, setCarouselSliding] = useState(false);
  const [carouselRotation, setCarouselRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const location = useLocation();
  
  // Gallery modal state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  
  
  // Get current language from i18n
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Exclusive properties hero images
  const heroProperties = [
    {
      image: "/photo-13.jpeg",
      title: "Villa Azure",
      location: "Côte d'Azur, France",
      price: "4,200,000 €",
      type: "buy"
    },
    {
      image: "/photo-14.jpeg",
      title: "Château de la Renaissance",
      location: "Loire Valley, France",
      price: "8,500,000 €",
      type: "buy"
    },
    {
      image: "/photo-15.jpeg",
      title: "Penthouse Skyline",
      location: "Paris 16ème, France",
      price: "12,500 €/mois",
      type: "rent"
    },
    {
      image: "/photo-16.jpeg",
      title: "Domaine de la Mer",
      location: "Saint-Tropez, France",
      price: "6,800,000 €",
      type: "buy"
    },
    {
      image: "/photo-17.jpeg",
      title: "Loft Industriel",
      location: "Marseille, France",
      price: "3,200 €/mois",
      type: "rent"
    },
    {
      image: "/photo-18.jpeg",
      title: "Manoir des Vignes",
      location: "Bordeaux, France",
      price: "5,400,000 €",
      type: "buy"
    },
    {
      image: "/photo-19.jpeg",
      title: "Appartement Haussmannien",
      location: "Lyon, France",
      price: "4,100 €/mois",
      type: "rent"
    },
    {
      image: "/photo-20.jpeg",
      title: "Villa Contemporaine",
      location: "Nice, France",
      price: "7,200,000 €",
      type: "buy"
    },
    {
      image: "/photo-21.jpeg",
      title: "Studio Design",
      location: "Paris 3ème, France",
      price: "1,800 €/mois",
      type: "rent"
    }
  ];

  // Hero carousel controls
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isHeroPlaying) {
      slideInterval = setInterval(() => {
        setActiveHeroSlide((prev) => (prev + 1) % heroProperties.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isHeroPlaying, heroProperties.length]);

  const nextHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev + 1) % heroProperties.length);
  };

  const prevHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev - 1 + heroProperties.length) % heroProperties.length);
  };

  // Open gallery modal
  const openGallery = (images: string[], title: string, initialIndex: number = 0) => {
    setGalleryImages(images);
    setGalleryTitle(title);
    setGalleryInitialIndex(initialIndex);
    setGalleryOpen(true);
  };



  useEffect(() => {
    const fetchProperties = async () => {
      console.log('\n\n🔄 ===============================================');
      console.log('🔄 LANGUAGE CHANGED - RELOADING PROPERTIES');
      console.log('🔄 ===============================================');
      console.log(`🌍 Current Language: ${currentLanguage}`);
      console.log('🔍 Starting to fetch properties...');
      setLoading(true);
      try {
        // Fetch properties from Apimo CRM API
        console.log('📡 Calling apimoService.getProperties...');
        const { properties: apimoProperties } = await apimoService.getProperties({
          limit: 1000, // Get all properties
          translateDescriptions: false,
        }, t, currentLanguage);
        
        console.log('\n✅ Successfully loaded properties from Apimo CRM:', apimoProperties.length);
        console.log('\n📋 ALL PROPERTY NAMES LOADED:');
        apimoProperties.forEach((prop, index) => {
          console.log(`  ${index + 1}. [ID: ${prop.id}] "${prop.title}"`);
        });
        
        // Filter out incomplete properties (missing essential data) and unwanted properties
        const validProperties = apimoProperties.filter(prop => 
          prop.title && 
          prop.location && 
          prop.price > 0 && 
          prop.surface > 0 &&
          prop.images.length > 0 &&
          !prop.title.includes('VILLA POOL') &&
          !prop.title.includes('8 TRAVELERS') &&
          !prop.title.includes('PANORAMIC')
        );
        
        console.log(`\n🔍 Filtered ${apimoProperties.length - validProperties.length} incomplete properties`);
        console.log('\n📋 FINAL VALID PROPERTY NAMES:');
        validProperties.forEach((prop, index) => {
          console.log(`  ${index + 1}. [ID: ${prop.id}] "${prop.title}"`);
        });
        
        // Log currency distribution for debugging
        const currencyDistribution = validProperties.reduce((acc, prop) => {
          const curr = prop.currency || 'UNKNOWN';
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        console.log('\n💱 Currency distribution in properties:', currencyDistribution);
        console.log('💡 Properties will be converted to your selected currency automatically');
        console.log('⚠️  Make sure each property\'s original currency is correctly identified for accurate conversion');
        
        console.log('\n');
        setProperties(validProperties);
      } catch (error) {
        console.error('❌ Error loading properties from Apimo:', error);
        // Set empty array to show "no properties" message
        setProperties([]);
      } finally {
        setLoading(false);
        console.log('🏁 Finished loading properties');
      }
    };

    fetchProperties();
  }, [t, currentLanguage]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!showMoreFilters) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMoreFilters(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMoreFilters]);

  useEffect(() => {
    if (!isMobile || carouselPaused || propertyTypeCarouselHover) return;

    let slideTimeoutId: number | undefined;

    const intervalId = window.setInterval(() => {
      const track = propertyTypeTrackRef.current;
      const first = track?.children[0] as HTMLElement | undefined;
      const second = track?.children[1] as HTMLElement | undefined;
      const step = second
        ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
        : first?.getBoundingClientRect().width || 0;
      if (step <= 0) return;
      carouselStepRef.current = step;
      setCarouselSliding(true);
      slideTimeoutId = window.setTimeout(() => {
        setCarouselRotation((r) => r + 1);
        setCarouselSliding(false);
      }, 520);
    }, 2600);

    return () => {
      window.clearInterval(intervalId);
      if (slideTimeoutId) window.clearTimeout(slideTimeoutId);
    };
  }, [isMobile, carouselPaused, propertyTypeCarouselHover]);

  const isExclusiveProperty = (property: Property): boolean => Number(property.agreementType) === 3;
  const activeSourceProperties = properties;

  const filterAndSortProperties = (
    sourceProperties: Property[],
    options: {
      typeFilter: string;
      query: string;
      bedrooms: number | null;
      propertyType: string;
      location: string;
      surfaceMin: number | null;
      surfaceMax: number | null;
      budgetMin: number | null;
      budgetMax: number | null;
      sort: string;
    }
  ): Property[] => {
    const supportedCurrencies = ['EUR', 'USD', 'GBP', 'AED', 'MAD'] as const;
    const getSortablePrice = (property: Property): number => {
      const sourceCurrency = (property.currency || 'EUR').toUpperCase();
      const normalizedCurrency = supportedCurrencies.includes(sourceCurrency as any)
        ? sourceCurrency
        : 'EUR';

      return convertPrice(property.price, normalizedCurrency as any);
    };

    const filtered = sourceProperties.filter((property) => {
      const typeMatch = options.typeFilter === 'all' || property.type === options.typeFilter;
      const roomsMatch = !options.bedrooms || ((Number(property.rooms) || 0) >= options.bedrooms);
      const propertyTypeMatch = !options.propertyType || (() => {
        const cat = property.category;
        const sub = property.subtype;
        if (options.propertyType === 'apartment') return cat === 1;
        if (options.propertyType === 'villa') return (cat === 2 || cat === 9) && sub !== 58;
        if (options.propertyType === 'land') return cat === 3;
        if (options.propertyType === 'riad') return (cat === 2 || cat === 9) && sub === 58;
        if (options.propertyType === 'other') return ![1, 2, 3, 9].includes(cat || 0);
        return true;
      })();

      const searchMatch = !options.query || (() => {
        const query = normalizeForSearch(options.query);

        const rooms = Number(property.rooms) > 0 ? Number(property.rooms) : (Number(property.bedrooms) > 0 ? Number(property.bedrooms) : 0);
        const bathrooms = Number(property.bathrooms) > 0 ? Number(property.bathrooms) : 0;
        const floors = Number(property.floors) > 0 ? Number(property.floors) : 0;
        const surface = Number(property.surface) > 0 ? Number(property.surface) : 0;

        const rawFields: string[] = [
          property.title,
          String(property.reference ?? ''),
          property.location,
          property.city,
          String(property.zipcode ?? ''),
          property.description,
          property.country,
          property.type,
        ];

        if (rooms > 0) {
          rawFields.push(
            String(rooms),
            `${rooms} pieces`,
            `${rooms} chambres`,
            `${rooms} rooms`,
            `${rooms} bedrooms`
          );
        }

        if (bathrooms > 0) {
          rawFields.push(
            String(bathrooms),
            `${bathrooms} salle de bain`,
            `${bathrooms} bain`,
            `${bathrooms} sdb`,
            `${bathrooms} bathroom`
          );
        }

        if (floors > 0) {
          rawFields.push(
            String(floors),
            `${floors} etage`,
            `${floors} etages`,
            `${floors} floor`
          );
        }

        if (surface > 0) {
          rawFields.push(String(surface), `${surface} m2`, `${surface} metres carres`);
        }

        rawFields.push(TYPE_SEARCH_KEYWORDS[property.type] || '');

        const searchFields = normalizeForSearch(rawFields.join(' '));
        const queryWords = query.split(/\s+/).map(word => word.replace(/\+$/, '')).filter(word => word.length > 0);

        return queryWords.every(word => searchFields.includes(word));
      })();

      const locationMatch = !options.location || (() => {
        const searchable = normalizeForSearch(
          [property.location, property.city, property.zipcode].filter(Boolean).join(' ')
        );
        return searchable.includes(normalizeForSearch(options.location));
      })();

      const surfaceMatch = (options.surfaceMin == null || property.surface >= options.surfaceMin)
        && (options.surfaceMax == null || property.surface <= options.surfaceMax);

      const budgetMatch = (() => {
        const convertedPrice = getSortablePrice(property);
        if (options.budgetMin != null && convertedPrice < options.budgetMin) return false;
        if (options.budgetMax != null && convertedPrice > options.budgetMax) return false;
        return true;
      })();

      return typeMatch && roomsMatch && propertyTypeMatch && searchMatch && locationMatch && surfaceMatch && budgetMatch;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      // Exclusive properties always shown on top
      const aIsExclusive = isExclusiveProperty(a);
      const bIsExclusive = isExclusiveProperty(b);

      if (aIsExclusive && !bIsExclusive) return -1;
      if (!aIsExclusive && bIsExclusive) return 1;

      // Apply requested sort
      switch (options.sort) {
        case 'priceAsc':
          return getSortablePrice(a) - getSortablePrice(b);
        case 'priceDesc':
          return getSortablePrice(b) - getSortablePrice(a);
        case 'surface':
          return b.surface - a.surface;
        case 'newest':
        default:
          return b.id - a.id;
      }
    });

    return sorted;
  };

  const filteredAndSortedProperties = filterAndSortProperties(activeSourceProperties, {
    typeFilter: filter,
    query,
    bedrooms: bedroomsFilter,
    propertyType: propertyTypeFilter,
    location: locationFilter,
    surfaceMin,
    surfaceMax,
    budgetMin,
    budgetMax,
    sort: sortBy,
  });

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProperties.length / PROPERTIES_PER_PAGE));
  const paginatedProperties = filteredAndSortedProperties.slice(
    (currentPage - 1) * PROPERTIES_PER_PAGE,
    currentPage * PROPERTIES_PER_PAGE
  );

  const scrollToPropertiesList = () => {
    propertiesListRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleScrollTopClick = () => {
    suppressScrollTopRef.current = true;
    setShowScrollTop(false);
    scrollToPropertiesList();
  };

  useEffect(() => {
    const onScroll = () => {
      const rect = firstPropertyCardRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (rect.top >= 0) {
        suppressScrollTopRef.current = false;
        if (showScrollTop) setShowScrollTop(false);
        return;
      }

      if (!suppressScrollTopRef.current && !showScrollTop) {
        setShowScrollTop(true);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showScrollTop]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToPropertiesList();
  };

  useEffect(() => {
    if (!hasInitializedFiltersRef.current) {
      if (!loading && properties.length > 0) {
        hasInitializedFiltersRef.current = true;
      }
      return;
    }

    setCurrentPage(1);
  }, [filter, query, bedroomsFilter, propertyTypeFilter, locationFilter, surfaceMin, surfaceMax, budgetMin, budgetMax, sortBy, loading, properties.length]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (filter && filter !== 'all') {
      nextParams.set('type', filter);
    } else {
      nextParams.delete('type');
    }

    if (query) {
      nextParams.set('q', query);
    } else {
      nextParams.delete('q');
    }

    if (bedroomsFilter !== null) {
      nextParams.set('bedrooms', String(bedroomsFilter));
    } else {
      nextParams.delete('bedrooms');
    }

    if (propertyTypeFilter) {
      nextParams.set('propertyType', propertyTypeFilter);
    } else {
      nextParams.delete('propertyType');
    }

    if (locationFilter) {
      nextParams.set('location', locationFilter);
    } else {
      nextParams.delete('location');
    }

    if (surfaceMin !== null) {
      nextParams.set('surfaceMin', String(surfaceMin));
    } else {
      nextParams.delete('surfaceMin');
    }

    if (surfaceMax !== null) {
      nextParams.set('surfaceMax', String(surfaceMax));
    } else {
      nextParams.delete('surfaceMax');
    }

    if (budgetMin !== null) {
      nextParams.set('budgetMin', String(budgetMin));
    } else {
      nextParams.delete('budgetMin');
    }

    if (budgetMax !== null) {
      nextParams.set('budgetMax', String(budgetMax));
    } else {
      nextParams.delete('budgetMax');
    }

    if (sortBy && sortBy !== 'newest') {
      nextParams.set('sort', sortBy);
    } else {
      nextParams.delete('sort');
    }

    if (currentPage > 1) {
      nextParams.set('page', String(currentPage));
    } else {
      nextParams.delete('page');
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [filter, query, bedroomsFilter, propertyTypeFilter, locationFilter, surfaceMin, surfaceMax, budgetMin, budgetMax, sortBy, currentPage, searchParams, setSearchParams]);

  useEffect(() => {
    if (loading || totalPages === 0) return;

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, loading]);

  useEffect(() => {
    if (loading) return;

    const lastViewedId = sessionStorage.getItem('properties:lastViewedId');
    const lastViewedPage = sessionStorage.getItem('properties:lastViewedPage');

    if (!lastViewedId || lastViewedPage !== String(currentPage)) return;

    const card = document.getElementById(`property-card-${lastViewedId}`);
    if (card) {
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }

    // Clear return context after attempting restore to avoid stale jumps later.
    sessionStorage.removeItem('properties:lastViewedId');
    sessionStorage.removeItem('properties:lastViewedPage');
  }, [loading, currentPage, paginatedProperties]);

  const toggleFavorite = (propertyId: number) => {
    setFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const propertyTypes = [
    { key: 'buy', label: t('properties.filters.toBuy') },
    { key: 'rent', label: t('properties.filters.rent') },
    { key: 'seasonal', label: t('properties.filters.vacation') },
  ];

  const bedroomOptions = [1, 2, 3, 4, 5, 6];
  const propertyTypeOptions = useMemo(
    () => [
      { value: 'apartment', label: t('properties.propertyTypes.apartment') },
      { value: 'villa', label: t('properties.propertyTypes.villa') },
      { value: 'land', label: t('properties.propertyTypes.land') },
      { value: 'riad', label: t('properties.propertyTypes.riad') },
      { value: 'other', label: t('properties.propertyTypes.other') },
    ],
    [t]
  );

  const rotatedPropertyTypes = useMemo(() => {
    const options = filter === 'seasonal'
      ? propertyTypeOptions.filter(option => option.value !== 'land')
      : propertyTypeOptions;
    const n = options.length;
    if (n === 0) return [];
    const offset = ((carouselRotation % n) + n) % n;
    return [...options.slice(offset), ...options.slice(0, offset)];
  }, [propertyTypeOptions, carouselRotation, filter]);
  const locationOptions = [
    { value: 'Arbaa Ida Ougourd 44005', label: 'Arbaa Ida Ougourd 44005' },
    { value: 'Essaouira 44000', label: 'Essaouira 44000' },
    { value: 'Marrakech 40000', label: 'Marrakech 40000' },
    { value: 'Ounagha 44133', label: 'Ounagha 44133' },
    { value: 'Sidi Ahmed Essayeh 44082', label: 'Sidi Ahmed Essayeh 44082' },
    { value: 'Sidi Kaouki 44125', label: 'Sidi Kaouki 44125' },
    { value: 'Tidzi 44075', label: 'Tidzi 44075' },
  ];

  const resetFilters = () => {
    setFilter('all');
    setQuery('');
    setBedroomsFilter(null);
    setPropertyTypeFilter('');
    setLocationFilter('');
    setSurfaceMin(null);
    setSurfaceMax(null);
    setBudgetMin(null);
    setBudgetMax(null);
    setSortBy('newest');
    setCurrentPage(1);
    setCarouselPaused(false);
  };

  const activeFiltersCount = [
    filter !== 'all',
    query !== '',
    bedroomsFilter !== null,
    propertyTypeFilter !== '',
    locationFilter !== '',
    surfaceMin !== null,
    surfaceMax !== null,
    budgetMin !== null,
    budgetMax !== null,
  ].filter(Boolean).length;

  

  const formatPropertyPrice = (price: number, type: 'buy' | 'rent' | 'seasonal', sourceCurrency: string = 'MAD', pricePeriod?: number) => {
    // List of supported currencies
    const supportedCurrencies = ['EUR', 'USD', 'GBP', 'AED', 'MAD'];
    
    // Validate and normalize the source currency
    const normalizedCurrency = sourceCurrency?.toUpperCase() || 'MAD';
    
    // Check if currency is supported
    const isCurrencySupported = supportedCurrencies.includes(normalizedCurrency);
    
    // Use the source currency if supported, otherwise log warning and default to EUR (common for properties)
    let finalCurrency = normalizedCurrency;
    if (!isCurrencySupported) {
      console.warn(`⚠️ Unsupported currency "${sourceCurrency}" for property price ${price}. Defaulting to EUR.`);
      console.warn('   Supported currencies:', supportedCurrencies.join(', '));
      finalCurrency = 'EUR'; // Most properties use EUR if not MAD
    }
    
    // Log currency conversion for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`💱 Price conversion: ${price} ${finalCurrency} → formatted in selected currency`);
    }
    
    const formattedPrice = formatCurrencyPrice(price, finalCurrency as any);
    
    // Use period from API if available: 1=Jour, 2=Semaine, 3=Quinzaine, 4=Mois, 5=Trimestre, 6=Bimensuel, 7=Semestre, 8=An
    if (pricePeriod) {
      switch (pricePeriod) {
        case 1: // Jour
          return `${t('properties.listing.fromPerDay', { price: formattedPrice })}`;
        case 2: // Semaine
          return `${formattedPrice}/${t('common.week') || 'week'}`;
        case 4: // Mois
          return `${formattedPrice}/${t('common.month') || 'month'}`;
        case 8: // An
          return `${formattedPrice}/${t('common.year') || 'year'}`;
        default:
          // For other periods (Quinzaine, Trimestre, Bimensuel, Semestre), show price as is
          return formattedPrice;
      }
    }
    
    // Fallback to type-based formatting if no period specified
    if (type === 'rent') {
      return `${formattedPrice}/${t('common.month') || 'month'}`;
    }
    if (type === 'seasonal') {
      return `${t('properties.listing.fromPerDay', { price: formattedPrice })}`;
    }
    return formattedPrice;
  };

  const renderPropertyCard = (property: Property, pageContext?: number) => {
    const sold = isSoldStatus(property.status);
    const statusLabel = sold
      ? (property.type === 'buy' ? t('properties.listing.sold') : t('properties.listing.rented'))
      : property.type === 'buy' ? t('properties.listing.forSale') : property.type === 'rent' ? t('properties.listing.forRent') : t('properties.listing.forVacation');
    return (
    <Link
      to={`/properties/${property.id}`}
      onClick={() => {
        if (typeof pageContext === 'number') {
          sessionStorage.setItem('properties:lastViewedId', String(property.id));
          sessionStorage.setItem('properties:lastViewedPage', String(pageContext));
        } else {
          sessionStorage.removeItem('properties:lastViewedId');
          sessionStorage.removeItem('properties:lastViewedPage');
        }
      }}
      className="group relative block bg-white border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-[0_24px_64px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-700"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A97E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="p-[2px] sm:p-[3px] bg-gray-100/60">
        <div className="flex flex-col md:flex-row gap-[2px] sm:gap-[3px] bg-gray-100 h-[360px] sm:h-[340px] lg:h-[380px] overflow-hidden">
          <div className="md:w-[68%] h-[58%] md:h-full relative overflow-hidden bg-gray-50 cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openGallery(property.images, property.title, 0); }}>
            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent"></div>
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-14 flex items-center gap-2 flex-wrap">
              {isExclusiveProperty(property) && (
                <span className="inline-flex items-center gap-1.5 bg-white/92 backdrop-blur-xl border border-[#C8A97E]/25 px-2.5 sm:px-3 py-1 text-[10px] tracking-[0.18em] uppercase font-semibold text-[#023927] shadow-sm">
                  <span className="w-1 h-1 rounded-full bg-[#C8A97E]"></span>
                  {t('properties.listing.exclusive')}
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase font-medium backdrop-blur-xl border shadow-sm ${sold ? 'bg-gray-900 text-white border-gray-800' : 'bg-white/90 text-gray-700 border-white/60'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sold ? 'bg-gray-400' : 'bg-emerald-500'}`}></span>
                {statusLabel}
              </span>
            </div>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(property.id); }} className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 group/fav">
              {favorites.includes(property.id) ? <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> : <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover/fav:text-red-500 transition-colors" />}
            </button>
            <div className="absolute bottom-0 left-0 p-3 sm:p-4">
              <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/15 text-white px-2.5 py-1 text-[11px] tracking-wide shadow-sm">
                <CameraIcon className="w-3.5 h-3.5 opacity-80" />
                <span>{property.images.length} {t('properties.listing.photos')}</span>
              </div>
            </div>
          </div>
          <div className="md:w-[32%] h-[42%] md:h-full flex flex-row md:flex-col gap-[2px] sm:gap-[3px]">
            {(property.images.slice(1, 3).length ? property.images.slice(1, 3) : [property.images[0], property.images[0]]).map((img, imgIndex) => (
              <div key={imgIndex} className="flex-1 relative overflow-hidden bg-gray-50 group/thumb cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openGallery(property.images, property.title, imgIndex + 1); }}>
                <img src={img} alt={`${property.title} ${imgIndex + 2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-[1.04]" />
                <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors duration-300"></div>
                {imgIndex === 1 && property.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex flex-col items-center justify-center text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
                    <ArrowTopRightOnSquareIcon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium tracking-wide">+{property.images.length - 3}</span>
                  </div>
                )}
                {imgIndex === 1 && (
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xl border border-white/50 text-gray-900 px-2 py-1 text-[10px] tracking-[0.14em] uppercase font-semibold flex items-center gap-1 shadow-sm">
                    <Square2StackIcon className="w-3 h-3 text-gray-500" />
                    Galerie
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-5 sm:px-7 lg:px-8 pt-6 sm:pt-7 pb-6 sm:pb-7">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 lg:gap-8">
          <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="hidden sm:block w-px self-stretch bg-gradient-to-b from-[#C8A97E] via-[#C8A97E]/30 to-transparent shrink-0"></div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[19px] sm:text-[21px] lg:text-[23px] leading-[1.02] tracking-[-0.025em] font-light text-gray-900 truncate group-hover:text-[#023927] transition-colors duration-500">{property.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] sm:text-[13px] text-gray-500">
                <span className="truncate font-light">— {property.location}</span>
                {property.reference && <span className="hidden sm:inline text-gray-300">•</span>}
                {property.reference && <span className="hidden sm:inline text-[11px] tracking-wide text-gray-400 font-mono">Réf. {property.reference}</span>}
              </div>
              <div className="mt-3.5 flex items-center gap-2.5 sm:gap-3.5 text-[11px] tracking-[0.16em] uppercase font-medium text-gray-500">
                <span className="inline-flex items-center gap-1.5"><HomeIcon className="w-3.5 h-3.5 text-gray-400" /> {property.rooms || 0} ch.</span>
                <span className="w-px h-3.5 bg-gray-200"></span>
                <span className="inline-flex items-center gap-1.5"><Square2StackIcon className="w-3.5 h-3.5 text-gray-400" /> {property.surface.toFixed(0)} m²</span>
                <span className="w-px h-3.5 bg-gray-200 hidden sm:block"></span>
                <span className="hidden sm:inline-flex items-center gap-1.5"><CheckIcon className="w-3.5 h-3.5 text-gray-400" /> {property.floors || 0} ét.</span>
              </div>
            </div>
          </div>
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:text-right shrink-0 lg:min-w-[190px] border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
            <div>
              <div className="font-serif text-[21px] sm:text-[23px] lg:text-[25px] leading-none tracking-[-0.02em] font-light text-[#023927]">{formatPropertyPrice(property.price, property.type, property.currency, property.pricePeriod)}</div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mt-1.5 font-medium">{property.type === 'buy' ? 'Prix net vendeur' : property.type === 'rent' ? 'Par mois' : 'Saisonnier'}</div>
            </div>
            <span className="group/cta inline-flex items-center gap-2.5 sm:gap-3 shrink-0">
              <span className="relative text-[11px] sm:text-xs tracking-[0.18em] uppercase font-semibold text-[#023927]">Voir
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#023927] group-hover:w-full transition-all duration-500 ease-out"></span>
              </span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#023927]/15 bg-white flex items-center justify-center text-[#023927] group-hover:bg-[#023927] group-hover:text-white group-hover:border-[#023927] group-hover:scale-105 transition-all duration-300 shadow-sm">
                <span className="text-[14px] leading-none">→</span>
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 border border-transparent group-hover:border-[#C8A97E]/10 transition-colors duration-700 hidden lg:block"></div>
    </Link>
    );
  };

  const getSEOData = () => {
    const filterType = filter === 'buy' ? 'Vente' : filter === 'rent' ? 'Location' : filter === 'seasonal' ? 'Location Saisonnière' : '';
    const visibleCount = filteredAndSortedProperties.length;
    const title = filterType ? `${filterType} - Biens Immobiliers Essaouira` : 'Tous nos Biens Immobiliers à Essaouira';
    const description = filterType 
      ? `Découvrez nos biens en ${filterType.toLowerCase()} à Essaouira. ${visibleCount} propriétés disponibles. Villas, appartements et biens d'exception.`
      : `Explorez notre catalogue complet de ${properties.length} biens immobiliers à Essaouira. Vente, location et location saisonnière de propriétés d'exception.`;
    
    return { title, description };
  };

  const seoData = getSEOData();

  const handlePropertyTypeCarouselMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = propertyTypeCarouselRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) return;
    const rect = container.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    container.scrollLeft = fraction * maxScroll;
  };

  const handlePropertyTypeCarouselLeave = () => {
    setPropertyTypeCarouselHover(false);
    if (propertyTypeCarouselRef.current) {
      propertyTypeCarouselRef.current.scrollLeft = 0;
    }
  };

  const searchInput = (
    <div className="relative group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('properties.search.placeholder')}
        className="peer w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-100 bg-gray-50/60 hover:bg-white focus:bg-white text-gray-900 text-[13px] sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#023927]/20 focus:shadow-[0_8px_24px_rgba(2,57,39,0.06)] transition-all duration-300"
        style={{ borderRadius: '0' }}
      />
      <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#023927]/60 transition-colors pointer-events-none" />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label={t('common.clear', { defaultValue: 'Clear' })}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all duration-200"
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords="immobilier Essaouira, vente villa Essaouira, location appartement Essaouira, biens immobiliers Maroc, propriétés Essaouira, real estate Morocco, maisons Essaouira, appartements de luxe"
        url={`${location.pathname}${location.search}`}
      />
      {/* Hero Section with Search Only - Updated with margin */}
      <section className="relative h-[70vh] sm:h-screen overflow-visible bg-white">
        {/* Background Carousel */}
        <div className="absolute inset-0 overflow-hidden">
          {heroProperties.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeHeroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Centered Filter Controls */}
        <div className="absolute bottom-32 sm:bottom-28 left-0 right-0 z-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
            {/* Filter Controls Row */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-3 lg:gap-4 items-stretch sm:items-end mb-4 ${activeFiltersCount === 0 ? 'sm:justify-center' : ''}`}>
              <div className="w-full sm:w-44 lg:w-52 flex-shrink-0">
                <FilterDropdown
                  variant="hero"
                  value={filter}
                  onChange={setFilter}
                  placeholder={t('properties.filters.allTypes')}
                  options={[
                    { value: 'all', label: t('properties.filters.allTypes') },
                    ...propertyTypes.map(({ key, label }) => ({ value: key, label })),
                  ]}
                />
              </div>
              <div className="w-full sm:w-44 lg:w-52 flex-shrink-0">
                <label className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-wider text-white/80 mb-1.5 font-inter pointer-events-none">
                  <ArrowsPointingOutIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('properties.filters.surfaceMin')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={surfaceMin ?? ''}
                    onChange={(e) => setSurfaceMin(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder={t('properties.filters.minPlaceholder')}
                    className="w-full border-2 border-white/60 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ borderRadius: '0' }}
                  />
                  <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">m²</span>
                </div>
              </div>
              <div className="w-full sm:w-44 lg:w-52 flex-shrink-0">
                <label className="flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-wider text-white/80 mb-1.5 font-inter pointer-events-none">
                  <BanknotesIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('properties.filters.budgetMax')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={budgetMax ?? ''}
                    onChange={(e) => setBudgetMax(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder={t('properties.filters.maxPlaceholder')}
                    className="w-full border-2 border-white/60 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-white transition-colors duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ borderRadius: '0' }}
                  />
                  <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">{getSymbol()}</span>
                </div>
              </div>

              {/* More Filters & Reset — inline on desktop */}
              <div className="hidden sm:flex w-full sm:w-44 lg:w-52 flex-shrink-0 items-end">
                <button
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className="group relative w-full border-2 border-white text-white px-4 py-2.5 sm:py-3 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center text-sm sm:text-base"
                >
                  <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-500">
                    {showMoreFilters ? `− ${t('properties.filters.lessFilters')}` : `+ ${t('properties.filters.moreFilters')}`}
                  </span>
                </button>
              </div>
              {activeFiltersCount > 0 && (
                <div className="hidden sm:flex w-full sm:w-44 lg:w-52 flex-shrink-0 items-end">
                  <button
                    onClick={resetFilters}
                    className="group relative w-full border-2 border-white text-white px-4 py-3 sm:py-4 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center text-[10px] sm:text-xs whitespace-nowrap"
                  >
                    <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-500">
                      {t('properties.filters.resetAll')} ({activeFiltersCount})
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* More Filters Toggle & Action Buttons — mobile only */}
            <div className="flex flex-col gap-3 items-stretch mb-4 w-full sm:hidden">
              <button
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="group relative flex-1 border-2 border-white text-white px-6 py-2.5 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center text-sm"
              >
                <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-500">
                  {showMoreFilters ? `− ${t('properties.filters.lessFilters')}` : `+ ${t('properties.filters.moreFilters')}`}
                </span>
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="group relative flex-1 border-2 border-white text-white px-2 py-2 font-inter uppercase tracking-normal transition-all duration-500 overflow-hidden text-center text-[10px] leading-tight whitespace-normal"
                >
                  <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-500">
                    {t('properties.filters.resetAll')} ({activeFiltersCount})
                  </span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Carousel Controls — unified premium pill (matches Home hero) */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-black/20 backdrop-blur-xl rounded-full px-3 sm:px-5 py-2 sm:py-2.5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.24)]">
          <button
            onClick={prevHeroSlide}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white backdrop-blur-sm flex items-center justify-center text-white hover:text-gray-900 border border-white/20 hover:border-white transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextHeroSlide}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white backdrop-blur-sm flex items-center justify-center text-white hover:text-gray-900 border border-white/20 hover:border-white transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="w-px h-5 sm:h-6 bg-white/20 mx-1 hidden sm:block"></div>
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-0">
            {heroProperties.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-500 ${
                  index === activeHeroSlide
                    ? 'bg-white w-6 sm:w-8 h-1.5 sm:h-1.5 shadow-[0_0_10px_rgba(255,255,255,0.6)]'
                    : 'bg-white/50 hover:bg-white/80 w-1.5 h-1.5 sm:w-2 sm:h-2'
                }`}
              />
            ))}
          </div>
        </div>

      </section>



      {/* Property Cards Section - REVOLUTIONARY NEW LAYOUT */}
      <section ref={propertiesListRef} className="py-6 sm:py-12 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-40">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                <div
                  className="absolute inset-0 rounded-full border-4 border-[#023927]/15 border-t-[#023927] animate-spin"
                  style={{ animationDuration: '1.2s', animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
                ></div>
                <div
                  className="absolute inset-2 rounded-full border-2 border-[#c8a97e]/30 border-b-[#c8a97e] animate-spin"
                  style={{ animationDuration: '2s', animationDirection: 'reverse', animationTimingFunction: 'linear' }}
                ></div>
                <div className="absolute inset-3 rounded-full overflow-hidden bg-white shadow-xl ring-1 ring-gray-100">
                  <img src="/logo-m2-circle.png" alt="Square Meter" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="mt-6 text-[#023927] font-light tracking-wide text-sm sm:text-lg">
                {t('properties.listing.loading')}
              </span>
            </div>
          ) : (
            <>
              <div className="relative bg-white border border-gray-100 overflow-hidden mb-6 sm:mb-10 group/header hover:border-gray-200 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-700">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A97E]/25 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity duration-700"></div>
                <div className="px-4 sm:px-6 lg:px-7 py-5 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
                  {/* Left — editorial count */}
                  <div className="flex gap-3 sm:gap-4 min-w-0 shrink-0">
                    <div className="hidden sm:block w-px self-stretch bg-gradient-to-b from-[#C8A97E] via-[#C8A97E]/30 to-transparent shrink-0"></div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2.5 sm:gap-3">
                        <span className="font-serif text-[30px] sm:text-[34px] lg:text-[36px] leading-none tracking-[-0.03em] font-light text-[#023927]">{filteredAndSortedProperties.length}</span>
                        <span className="text-[11px] sm:text-xs tracking-[0.18em] uppercase font-semibold text-gray-500">{t('properties.listing.results')}</span>
                        <span className="hidden sm:inline-flex items-center gap-1.5 ml-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]"></span>
                          <span className="text-[11px] tracking-[0.12em] uppercase text-gray-400 font-medium hidden lg:inline">{t('properties.listing.availableShort')}</span>
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] tracking-wide text-gray-400 font-light hidden sm:block">
                        {t('properties.listing.subtitle')}
                      </div>
                    </div>
                  </div>
                  {/* Center — search */}
                  <div className="flex-1 w-full lg:max-w-[420px] lg:mx-6">
                    {searchInput}
                  </div>
                  {/* Right — sort */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t lg:border-t-0 border-gray-100 pt-3 sm:pt-4 lg:pt-0">
                    <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-semibold text-gray-400 whitespace-nowrap hidden sm:inline">{t('properties.listing.sortBy')}</span>
                    <span className="text-[10px] tracking-[0.16em] uppercase font-semibold text-gray-400 sm:hidden">{t('properties.listing.sortByShort')}</span>
                    <span className="hidden sm:block w-px h-4 bg-gray-200"></span>
                    <FilterDropdown
                      variant="light"
                      compact
                      value={sortBy}
                      onChange={setSortBy}
                      placeholder={t('properties.listing.newest')}
                      options={[
                        { value: 'newest', label: t('properties.listing.newest') },
                        { value: 'priceAsc', label: t('properties.listing.priceAsc') },
                        { value: 'priceDesc', label: t('properties.listing.priceDesc') },
                        { value: 'surface', label: t('properties.listing.surface') },
                      ]}
                    />
                  </div>
                </div>
                <div className="h-px w-full bg-gray-100"></div>
              </div>

              {filteredAndSortedProperties.length === 0 ? (
                <div className="text-center py-16 sm:py-32 bg-gray-50 border-2 border-gray-200 max-w-4xl mx-auto">
                  <div className="text-5xl sm:text-8xl mb-6 sm:mb-10 opacity-20">🏠</div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-inter text-gray-900 mb-4 sm:mb-8 font-light px-4">
                    {t('properties.empty.title')}
                  </h3>
                  <p className="text-gray-600 mb-8 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
                    {t('properties.empty.description')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
                    <button
                      onClick={resetFilters}
                      className="border-2 border-gray-900 text-gray-900 px-6 sm:px-10 py-3 sm:py-4 font-inter uppercase tracking-wider text-sm sm:text-lg hover:text-[#023927] hover:bg-white hover:border-[#023927] transition-all duration-500"
                    >
                      {t('properties.empty.expandSearch')}
                    </button>
                    <Link
                      to="/contact"
                      className="bg-[#023927] text-white px-6 sm:px-10 py-3 sm:py-4 font-inter uppercase tracking-wider text-sm sm:text-lg hover:bg-white hover:text-[#023927] hover:border-2 hover:border-[#023927] transition-all duration-500"
                    >
                      {t('properties.empty.contactUs')}
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
                    {paginatedProperties.map((property, index) => (
                      <div
                        key={property.id}
                        ref={index === 0 ? firstPropertyCardRef : undefined}
                      >
                        {renderPropertyCard(property, currentPage)}
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex flex-col items-center gap-4 mt-10 sm:mt-14">
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-white border border-gray-100 rounded-full px-1.5 sm:px-2 py-1.5 sm:py-2 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          aria-label={t('properties.listing.goToPage') || 'Previous page'}
                          className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-100 bg-white text-gray-600 hover:bg-[#023927] hover:text-white hover:border-[#023927] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-100 transition-all duration-300"
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </button>

                        <div className="hidden sm:block w-px h-6 bg-gray-100 mx-1"></div>

                        <div className="flex items-center gap-1 sm:gap-1.5">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              aria-label={`${t('properties.listing.goToPage') || 'Go to page'} ${page}`}
                              aria-current={currentPage === page ? 'page' : undefined}
                              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-medium border transition-all duration-300 hover:scale-105 active:scale-95 ${
                                currentPage === page
                                  ? 'bg-[#023927] text-white border-[#023927] shadow-[0_4px_16px_rgba(2,57,39,0.25)] scale-105'
                                  : 'bg-white text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <div className="hidden sm:block w-px h-6 bg-gray-100 mx-1"></div>

                        <button
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          aria-label={t('properties.listing.goToPage') || 'Next page'}
                          className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-100 bg-white text-gray-600 hover:bg-[#023927] hover:text-white hover:border-[#023927] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-100 transition-all duration-300"
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] tracking-[0.14em] uppercase font-medium text-gray-400">
                        <span className="w-1 h-1 rounded-full bg-[#C8A97E] hidden sm:inline-block"></span>
                        <span>{t('common.page') || 'Page'} <span className="text-[#023927] font-semibold">{currentPage}</span> {t('properties.listing.of')} {totalPages}</span>
                        <span className="w-px h-3 bg-gray-200 hidden sm:block"></span>
                        <span className="hidden sm:inline">{t('properties.listing.showing')} {(currentPage - 1) * PROPERTIES_PER_PAGE + 1}–{Math.min(currentPage * PROPERTIES_PER_PAGE, filteredAndSortedProperties.length)} {t('properties.listing.of')} {filteredAndSortedProperties.length} {t('properties.listing.properties')}</span>
                        <span className="sm:hidden text-gray-300">•</span>
                        <span className="sm:hidden">{filteredAndSortedProperties.length} {t('properties.listing.properties')}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* More Filters Modal */}
      {showMoreFilters && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowMoreFilters(false)}
          ></div>

          <div className="relative w-full max-w-2xl bg-white shadow-2xl animate-modal-in flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 bg-[#023927] text-white flex-shrink-0">
              <h3 className="font-inter uppercase tracking-wider text-base sm:text-xl font-medium">
                {t('properties.filters.title')}
              </h3>
              <button
                type="button"
                onClick={() => setShowMoreFilters(false)}
                aria-label={t('common.close', { defaultValue: 'Close' })}
                className="p-1 hover:opacity-70 transition-opacity duration-200"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {filter !== 'all' && (
                <FilterDropdown
                  variant="light"
                  label={t('properties.filters.type')}
                  value={propertyTypeFilter}
                  placeholder={t('properties.filters.allTypes')}
                  onChange={setPropertyTypeFilter}
                  options={[
                    { value: '', label: t('properties.filters.allTypes') },
                    ...propertyTypeOptions,
                  ]}
                />
              )}

              <FilterDropdown
                variant="light"
                label={t('properties.filters.bedrooms')}
                value={bedroomsFilter !== null ? String(bedroomsFilter) : ''}
                placeholder={t('properties.filters.allBedrooms')}
                onChange={(v) => setBedroomsFilter(v === '' ? null : parseInt(v, 10))}
                options={[
                  { value: '', label: t('properties.filters.allBedrooms') },
                  ...bedroomOptions.map(beds => ({
                    value: String(beds),
                    label: `${beds}+ ${t('properties.filters.bedroomsLabel')}`,
                  })),
                ]}
              />

              <FilterDropdown
                variant="light"
                label={t('properties.filters.location')}
                value={locationFilter}
                placeholder={t('properties.filters.allLocations')}
                onChange={setLocationFilter}
                options={[
                  { value: '', label: t('properties.filters.allLocations') },
                  ...locationOptions,
                ]}
              />

              <div>
                <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('properties.filters.surfaceMin')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={surfaceMin ?? ''}
                  onChange={(e) => setSurfaceMin(e.target.value === '' ? null : Number(e.target.value))}
                  placeholder={t('properties.filters.minPlaceholder')}
                  className="w-full border-2 border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#023927] transition-colors duration-300"
                  style={{ borderRadius: '0' }}
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('properties.filters.surfaceMax')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={surfaceMax ?? ''}
                  onChange={(e) => setSurfaceMax(e.target.value === '' ? null : Number(e.target.value))}
                  placeholder={t('properties.filters.maxPlaceholder')}
                  className="w-full border-2 border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#023927] transition-colors duration-300"
                  style={{ borderRadius: '0' }}
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('properties.filters.budgetMin')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base pointer-events-none">
                    {getSymbol()}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={budgetMin ?? ''}
                    onChange={(e) => setBudgetMin(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder={t('properties.filters.minPlaceholder')}
                    className="w-full border-2 border-gray-300 bg-white pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#023927] transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('properties.filters.budgetMax')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base pointer-events-none">
                    {getSymbol()}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={budgetMax ?? ''}
                    onChange={(e) => setBudgetMax(e.target.value === '' ? null : Number(e.target.value))}
                    placeholder={t('properties.filters.maxPlaceholder')}
                    className="w-full border-2 border-gray-300 bg-white pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#023927] transition-colors duration-300"
                    style={{ borderRadius: '0' }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
              <button
                type="button"
                onClick={resetFilters}
                className="group relative border-2 border-[#023927] text-[#023927] px-5 sm:px-8 py-2 sm:py-3 font-inter uppercase tracking-wider text-xs sm:text-sm transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-[#023927] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                  {t('properties.filters.resetAll')} ({activeFiltersCount})
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoreFilters(false);
                  setTimeout(() => scrollToPropertiesList(), 150);
                }}
                className="bg-[#023927] text-white px-5 sm:px-8 py-2 sm:py-3 font-inter uppercase tracking-wider text-xs sm:text-sm hover:bg-white hover:text-[#023927] hover:border-2 hover:border-[#023927] transition-all duration-500"
              >
                {t('properties.filters.viewResults')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={galleryImages}
        propertyTitle={galleryTitle}
        initialIndex={galleryInitialIndex}
      />

      {showScrollTop && (
        <button
          onClick={handleScrollTopClick}
          aria-label="Back to top"
          className="fixed bottom-28 right-8 w-11 h-11 bg-[#023927] text-white flex items-center justify-center shadow-lg hover:bg-[#023927]/90 transition-all duration-300 z-40"
        >
          <ChevronUpIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Properties;