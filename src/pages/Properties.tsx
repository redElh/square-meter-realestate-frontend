// src/pages/Properties.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  ChevronUpIcon
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
  const { format: formatCurrencyPrice, convertPrice } = useCurrency();
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
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPlaying] = useState(true);
  const [showMoreFilters, setShowMoreFilters] = useState(
    Boolean(searchParams.get('bedrooms') || searchParams.get('propertyType') || searchParams.get('location'))
  );
  const propertiesListRef = useRef<HTMLDivElement>(null);
  const firstPropertyCardRef = useRef<HTMLDivElement>(null);
  const hasInitializedFiltersRef = useRef(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const suppressScrollTopRef = useRef(false);
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
        const title = property.title?.toLowerCase() || '';
        if (options.propertyType === 'apartment') return title.includes('appartement') || title.includes('apartment');
        if (options.propertyType === 'villa') return title.includes('villa');
        if (options.propertyType === 'land') return title.includes('terrain') || title.includes('land');
        if (options.propertyType === 'riad') return title.includes('riad');
        if (options.propertyType === 'other') return !title.includes('appartement') && !title.includes('apartment') && !title.includes('villa') && !title.includes('terrain') && !title.includes('land') && !title.includes('riad');
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

      return typeMatch && roomsMatch && propertyTypeMatch && searchMatch && locationMatch;
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
  }, [filter, query, bedroomsFilter, propertyTypeFilter, locationFilter, sortBy, loading, properties.length]);

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
  }, [filter, query, bedroomsFilter, propertyTypeFilter, locationFilter, sortBy, currentPage, searchParams, setSearchParams]);

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
    { key: 'buy', label: t('properties.filters.buy') },
    { key: 'rent', label: t('properties.filters.rent') },
    { key: 'seasonal', label: t('properties.filters.vacation') },
  ];

  const bedroomOptions = [1, 2, 3, 4, 5, 6];
  const propertyTypeOptions = [
    { value: 'apartment', label: t('properties.propertyTypes.apartment') },
    { value: 'villa', label: t('properties.propertyTypes.villa') },
    { value: 'land', label: t('properties.propertyTypes.land') },
    { value: 'riad', label: t('properties.propertyTypes.riad') },
    { value: 'other', label: t('properties.propertyTypes.other') }
  ];
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
    setSortBy('newest');
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    filter !== 'all',
    query !== '',
    bedroomsFilter !== null,
    propertyTypeFilter !== '',
    locationFilter !== '',
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

  const renderPropertyCard = (property: Property, pageContext?: number) => (
    <div
      key={property.id}
      id={`property-card-${property.id}`}
      className="bg-white border-2 border-gray-100 group transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] hover:border-gray-200"
    >
      {/* MAIN CARD CONTAINER - Horizontal Layout */}
      <div className="flex flex-col">
        {/* IMAGE SECTION - Left side with primary + secondary images */}
        <div className="w-full flex flex-col md:flex-row h-[300px] sm:h-[400px] lg:h-[500px]">
          {/* Primary Image - Larger on left */}
          <div
            className="md:w-2/3 h-2/3 md:h-full relative overflow-hidden cursor-pointer"
            onClick={() => openGallery(property.images, property.title, 0)}
          >
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
            />

            {/* Overlay Badges */}
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 flex flex-col gap-1.5 sm:gap-2">
              {isExclusiveProperty(property) && (
                <span className="bg-[#023927] text-white px-2 sm:px-4 py-1 sm:py-2 font-inter uppercase text-[10px] sm:text-xs font-medium tracking-wider max-w-max">
                  {t('properties.listing.exclusive')}
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              className="absolute top-3 sm:top-6 right-3 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group/fav"
            >
              {favorites.includes(property.id) ? (
                <HeartIconSolid className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover/fav:text-red-500 transition-colors" />
              )}
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 bg-black/80 text-white px-2 sm:px-4 py-1.5 sm:py-2 flex items-center space-x-1.5 sm:space-x-2 backdrop-blur-sm">
              <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{property.images.length} {t('properties.listing.photos')}</span>
            </div>
          </div>

          {/* Secondary Images - Stacked vertically on right */}
          <div className="md:w-1/3 h-1/3 md:h-full flex flex-row md:flex-col gap-1 sm:gap-2 p-1 sm:p-2">
            {property.images.slice(1, 3).map((img, imgIndex) => (
              <div
                key={imgIndex}
                className="flex-1 relative overflow-hidden group/secondary cursor-pointer"
                onClick={() => openGallery(property.images, property.title, imgIndex + 1)}
              >
                <img
                  src={img}
                  alt={`${property.title} ${imgIndex + 2}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/secondary:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/secondary:opacity-100 transition-opacity duration-300"></div>
                {/* View More Overlay for last image */}
                {imgIndex === 1 && property.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/secondary:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-center p-2 sm:p-4">
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                      <span className="text-[10px] sm:text-xs font-medium">+{property.images.length - 3} photos</span>
                    </div>
                  </div>
                )}

                {imgIndex === 1 && (
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/75 text-white px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-medium tracking-wide uppercase backdrop-blur-sm flex items-center gap-1.5 pointer-events-none">
                    <ArrowTopRightOnSquareIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{t('properties.listing.view')} {t('properties.listing.photos')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS SECTION - compact single-line summary */}
        <div className="w-full p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className={`px-2 py-1 text-[10px] sm:text-xs font-medium tracking-wider self-start ${
                isSoldStatus(property.status)
                  ? 'bg-gray-100 text-gray-700 border border-gray-300'
                  : property.type === 'buy'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : property.type === 'rent'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-purple-50 text-purple-800 border border-purple-200'
              }`}>{isSoldStatus(property.status) ? (property.type === 'buy' ? t('properties.listing.sold') : t('properties.listing.rented')) : property.type === 'buy' ? t('properties.listing.forSale') : property.type === 'rent' ? t('properties.listing.forRent') : t('properties.listing.forVacation')}</span>

              <h3 className="text-base sm:text-lg font-inter font-medium text-gray-900 truncate">{property.title}</h3>

              <span className="text-gray-500 text-xs sm:text-sm truncate">• {property.location}</span>
              {property.reference && (
                <span className="text-gray-400 text-xs sm:text-xs ml-2 sm:ml-3">• {t('contact.form.propertyReference')}: {property.reference}</span>
              )}
            </div>
          </div>

          <div className="flex sm:hidden items-center text-xs text-gray-600 space-x-3 w-full">
            <div className="flex items-center gap-1"><HomeIcon className="w-3 h-3" /> <span className="ml-0.5">{property.rooms || 0}</span></div>
            <div className="flex items-center gap-1"><CheckIcon className="w-3 h-3" /> <span className="ml-0.5">{property.floors || 0}</span></div>
            <div className="flex items-center gap-1"><Square2StackIcon className="w-3 h-3" /> <span className="ml-0.5">{property.surface.toFixed(0)} m²</span></div>
          </div>

          <div className="hidden sm:flex items-center text-sm text-gray-600 space-x-4 whitespace-nowrap">
            <div className="flex items-center gap-1"><HomeIcon className="w-4 h-4" /> <span className="ml-1">{property.rooms || 0}</span></div>
            <div className="flex items-center gap-1"><CheckIcon className="w-4 h-4" /> <span className="ml-1">{property.floors || 0}</span></div>
            <div className="flex items-center gap-1"><Square2StackIcon className="w-4 h-4" /> <span className="ml-1">{property.surface.toFixed(0)} m²</span></div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="font-serif text-[#023927] font-bold text-base sm:text-lg whitespace-nowrap">
              {formatPropertyPrice(property.price, property.type, property.currency, property.pricePeriod)}
            </div>
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
              className="bg-white border-2 border-[#023927] text-[#023927] px-4 sm:px-3 py-2 text-xs sm:text-sm uppercase font-medium hover:bg-[#023927] hover:text-white transition-all duration-300"
            >
              {t('properties.listing.view')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

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

  const renderTypeButton = (key: string, label: string) => (
    <button
      key={key}
      onClick={() => setFilter(filter === key ? 'all' : key)}
      className={`w-full p-3 sm:p-5 border-2 text-sm sm:text-base font-medium backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
        filter === key
          ? 'border-white bg-white/95 text-[#023927]'
          : 'border-white/50 bg-white/20 text-white hover:border-white hover:bg-white/40'
      }`}
      style={{ borderRadius: '0' }}
    >
      {label}
    </button>
  );

  const searchInput = (
    <div className="relative group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('properties.search.placeholder')}
        className="peer w-full pl-12 pr-10 py-3 sm:py-4 border-2 border-white/60 bg-white/95 backdrop-blur-sm text-gray-900 text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-white focus:shadow-[0_10px_35px_rgba(255,255,255,0.35)] transition-all duration-300"
        style={{ borderRadius: '0' }}
      />
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label={t('common.clear', { defaultValue: 'Clear' })}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
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
        <div className="absolute bottom-24 sm:bottom-20 left-0 right-0 z-20">
          <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
            {/* Primary Filter Buttons: Buy, Rent, Vacation + Search */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
              {propertyTypes.map(({ key, label }) => {
                if (filter !== 'all' && filter !== key) return null;
                return renderTypeButton(key, label);
              })}

              {filter !== 'all' && (
                <div className="col-span-2">
                  {searchInput}
                </div>
              )}
            </div>

            {filter === 'all' && (
              <div className="mb-4">
                {searchInput}
              </div>
            )}

            {/* Property Type Checkboxes - when a transaction type is selected */}
            {filter !== 'all' && (
              <div className="flex flex-col items-center gap-2 sm:gap-3 mb-4">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {propertyTypeOptions.map(({ value, label }) => {
                    const isSelected = propertyTypeFilter === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPropertyTypeFilter(isSelected ? '' : value)}
                        aria-pressed={isSelected}
                        className={`group flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 border-2 backdrop-blur-sm transition-all duration-300 ${
                          isSelected
                            ? 'border-white bg-white/95 text-[#023927] scale-105'
                            : 'border-white/50 bg-white/20 text-white hover:border-white hover:bg-white/40'
                        }`}
                        style={{ borderRadius: '0' }}
                      >
                        <span
                          className={`flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 border-2 transition-all duration-300 ${
                            isSelected
                              ? 'bg-[#023927] border-[#023927]'
                              : 'border-white/70 bg-transparent group-hover:border-white'
                          }`}
                        >
                          <CheckIcon
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-white transition-all duration-300 ${
                              isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                            }`}
                          />
                        </span>
                        <span className="text-xs sm:text-sm font-medium uppercase tracking-wide">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* More Filters Toggle & Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center mb-4">
              <button
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="group relative flex-1 border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-4 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center text-sm sm:text-base"
              >
                <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-500">
                  {showMoreFilters ? `− ${t('properties.filters.lessFilters')}` : `+ ${t('properties.filters.moreFilters')}`}
                </span>
              </button>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="group relative border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-4 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center text-sm sm:text-base whitespace-nowrap"
                >
                  <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-500">
                    {t('properties.filters.resetAll')} ({activeFiltersCount})
                  </span>
                </button>
              )}
              
              <button
                onClick={() => {
                  scrollToPropertiesList();
                }}
                className="group relative bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-4 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center text-sm sm:text-base whitespace-nowrap"
              >
                <div className="absolute inset-0 bg-[#023927] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                  {t('properties.filters.apply')}
                </span>
              </button>
            </div>

            {/* Collapsible Bedrooms & Property Type Filters */}
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showMoreFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                {/* Bedrooms Filter */}
                <div>
                  <FilterDropdown
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
                </div>

                {/* Location Filter */}
                <div>
                  <FilterDropdown
                    label={t('properties.filters.location')}
                    value={locationFilter}
                    placeholder={t('properties.filters.allLocations')}
                    onChange={setLocationFilter}
                    options={[
                      { value: '', label: t('properties.filters.allLocations') },
                      ...locationOptions,
                    ]}
                  />
                </div>
              </div>
            </div>
            
            {/* Results count indicator */}
            <div className="text-center mt-4">
              <span className="text-xs sm:text-sm text-white/90 font-medium px-3 py-1.5 bg-black/30 backdrop-blur-sm inline-block">
                {filteredAndSortedProperties.length} {t('properties.search.results')}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Controls - Minimal */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-30 flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={prevHeroSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextHeroSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Slide Indicators */}
          <div className="flex space-x-1.5 sm:space-x-2">
            {heroProperties.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroSlide(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 transition-all duration-300 ${
                  index === activeHeroSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                style={{ borderRadius: '0' }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </section>



      {/* Property Cards Section - REVOLUTIONARY NEW LAYOUT */}
      <section ref={propertiesListRef} className="py-6 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20 sm:py-40">
              <div className="relative">
                <div className="animate-spin h-16 w-16 sm:h-24 sm:w-24 border-2 border-[#023927] border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#023927] font-light text-sm sm:text-lg">{t('properties.listing.loading')}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 sm:mb-12">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-gray-900 mb-3 sm:mb-4 lg:mb-0">
                    {filteredAndSortedProperties.length} {t('properties.search.results')}
                  </h3>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-gray-500 text-sm sm:text-base">{t('properties.listing.sortBy')}</span>
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
                <div className="h-px bg-gray-200 w-full"></div>
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
                  <div className="space-y-4 sm:space-y-8 max-w-6xl mx-auto">
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
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-16 flex-wrap">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center justify-center w-10 h-10 border-2 border-gray-300 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#023927] hover:text-[#023927] transition-colors duration-300"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 border-2 text-sm font-medium transition-colors duration-300 ${
                            currentPage === page
                              ? 'border-[#023927] bg-[#023927] text-white'
                              : 'border-gray-300 text-gray-700 hover:border-[#023927] hover:text-[#023927]'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center justify-center w-10 h-10 border-2 border-gray-300 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#023927] hover:text-[#023927] transition-colors duration-300"
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>

                      <div className="w-full text-center text-sm text-gray-500 mt-2">
                        {t('common.page') || 'Page'} {currentPage} / {totalPages}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

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