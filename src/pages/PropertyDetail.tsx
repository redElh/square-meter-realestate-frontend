// src/pages/PropertyDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPinIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { apimoService, Property } from '../services/apimoService';
import PropertyCard from '../components/PropertyCard';
import { useCurrency } from '../hooks/useCurrency';

const PropertyDetail: React.FC = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { format: formatPrice } = useCurrency();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const isPlaying = true;

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch the specific property
        const propertyData = await apimoService.getPropertyById(Number(id), t, currentLanguage);
        setProperty(propertyData);

        // Fetch all properties to get similar ones
        const { properties: allProperties } = await apimoService.getProperties({ limit: 1000 }, t, currentLanguage);
        
        // Get similar properties (same type, different id, limit to 3)
        if (propertyData) {
          const similar = allProperties
            .filter(p => p.type === propertyData.type && p.id !== propertyData.id)
            .slice(0, 3);
          setSimilarProperties(similar);
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id, t, currentLanguage]);

  // Carousel autoplay effect
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isPlaying && property && property.images.length > 1) {
      slideInterval = setInterval(() => {
        setActiveImage(prev => (prev + 1) % property.images.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isPlaying, property]);

  const nextImage = () => {
    if (!property) return;
    setActiveImage(prev => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property) return;
    setActiveImage(prev => (prev - 1 + property.images.length) % property.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#023927]"></div>
          <p className="mt-4 text-gray-600">{t('common.loading') || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-inter text-gray-900 mb-4">Propriété non trouvée</h2>
          <Link to="/properties" className="text-[#023927] hover:underline">
            Retour aux propriétés
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Includes carousel and stats bar */}
      <div className="h-[70vh] sm:h-screen flex flex-col">
        {/* HERO CAROUSEL */}
        <section className="relative flex-1 overflow-hidden bg-white">
          {/* Background Carousel */}
          <div className="absolute inset-0 mt-24 md:mt-28 lg:mt-32">
          {property.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeImage === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Blurred background to fill empty space when main image is object-contain */}
              <div
                className="hidden sm:block absolute inset-0 bg-center bg-cover filter blur-xl scale-105 brightness-75 z-0"
                style={{ backgroundImage: `url(${image})` }}
              />

              {/* Main image centered on top */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src={image}
                  alt={`${property.title} - Vue ${index + 1}`}
                  className="w-full h-full object-cover sm:object-contain object-center"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20"></div>
            </div>
          ))}
        </div>

        {/* Carousel Controls - Consistent positioning across all sizes */}
        <div className="absolute bottom-[140px] md:bottom-[180px] lg:bottom-[200px] right-2 sm:right-4 md:right-6 lg:right-8 z-30 flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          <button
            onClick={prevImage}
            className="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronLeftIcon className="w-3 h-3 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextImage}
            className="w-6 h-6 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronRightIcon className="w-3 h-3 sm:w-5 sm:h-5" />
          </button>
          
          {/* Slide Indicators */}
          <div className="flex space-x-1 sm:space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-1 h-1 sm:w-2 sm:h-2 transition-all duration-300 ${
                  activeImage === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                style={{ borderRadius: '0' }}
              />
            ))}
          </div>
        </div>

        {/* Property Title Overlay - Consistent positioning across all sizes */}
        <div className="absolute bottom-[140px] md:bottom-[180px] lg:bottom-[140px] left-0 right-0 z-20 p-3 sm:p-8 lg:p-12 pr-20 md:pr-32 lg:pr-8">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="max-w-6xl">
              {/* Property Type Badge */}
              <div className="inline-block mb-1 sm:mb-4">
                <span className={`px-2 sm:px-4 py-1 sm:py-2 font-inter uppercase text-[10px] sm:text-xs font-medium tracking-wider ${
                  property.type === 'buy' 
                    ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                    : property.type === 'rent'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-purple-50 text-purple-800 border border-purple-200'
                }`}>
                  {property.type === 'buy' ? t('properties.listing.forSale') : property.type === 'rent' ? t('properties.listing.forRent') : t('properties.listing.forVacation')}
                </span>
              </div>

              <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-inter font-light text-white mb-1 sm:mb-4 leading-tight">
                {property.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-white">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <MapPinIcon className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span className="font-inter text-xs sm:text-base">{property.location}</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/30"></div>
                <div className="text-lg sm:text-2xl lg:text-3xl font-serif font-light text-white">
                  {formatPrice(property.price || 0, property.currency as any || 'EUR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar - Consistent transparent overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 py-2 sm:py-4 md:py-6">
          <div className="container mx-auto px-2 sm:px-4 md:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 md:gap-3 lg:gap-4 text-center items-center">
              {[
                { value: `${property.surface} m²`, label: t('propertyDetail.stats.surface') },
                { value: property.landSurface ? `${property.landSurface} m²` : '-', label: t('propertyDetail.stats.land') },
                { value: property.rooms || 0, label: t('propertyDetail.stats.rooms') },
                { value: property.floors || 0, label: t('propertyDetail.stats.floors') },
                { value: property.yearBuilt || '-', label: t('propertyDetail.stats.year') }
              ].map((stat, index) => (
                <div key={index} className="text-center border border-white/30 py-1.5 sm:py-2.5 md:py-3 lg:py-4 px-1 sm:px-2 hover:border-white transition-all duration-300">
                  <div className="text-xs sm:text-base md:text-lg lg:text-2xl font-inter font-medium text-white mb-0.5 sm:mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[8px] sm:text-[10px] md:text-xs text-white/80 uppercase tracking-wide md:tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Description & Contact - Redesigned compact layout */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Description - Full width */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-4 sm:mb-6 pb-3 border-b border-gray-200">
                {t('propertyDetail.sections.description')}
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Contact Section - Horizontal layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Contact Actions */}
              <div className="space-y-3 sm:space-y-4">
                <Link
                  to="/contact?type=visit&property=1"
                  className="block w-full bg-[#023927] text-white text-center py-4 font-inter hover:bg-[#023927]/90 transition-all duration-300 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{t('propertyDetail.actions.privateVisit')}</span>
                  </span>
                </Link>
                <Link
                  to="/contact?type=info&property=1"
                  className="block w-full border-2 border-[#023927] text-[#023927] text-center py-4 font-inter hover:bg-[#023927] hover:text-white transition-all duration-300 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>{t('propertyDetail.actions.completeFile')}</span>
                  </span>
                </Link>
              </div>

              {/* Agent Profile - Horizontal card */}
              {property.agent && (
                <div className="bg-gray-50 p-6 border-l-4 border-[#023927]">
                  <h4 className="font-inter text-gray-900 text-xs uppercase tracking-wider mb-4">
                    {t('propertyDetail.contact.advisor')}
                  </h4>
                  <div className="flex items-center gap-4">
                    {property.agent.image && (
                      <img
                        src={property.agent.image}
                        alt={property.agent.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-inter text-gray-900 text-lg mb-1">
                        {property.agent.name}
                      </div>
                      <div className="text-[#023927] text-sm mb-3">
                        {t('propertyDetail.contact.realEstateAdvisor') || 'Conseiller Immobilier'}
                      </div>
                      <div className="space-y-1.5">
                        {property.agent.phone && (
                          <a href={`tel:${property.agent.phone}`} className="flex items-center space-x-2 text-gray-700 hover:text-[#023927] transition-colors text-sm">
                            <PhoneIcon className="w-4 h-4" />
                            <span>{property.agent.phone}</span>
                          </a>
                        )}
                        {property.agent.mobile && (
                          <a href={`tel:${property.agent.mobile}`} className="flex items-center space-x-2 text-gray-700 hover:text-[#023927] transition-colors text-sm">
                            <PhoneIcon className="w-4 h-4" />
                            <span>{property.agent.mobile}</span>
                          </a>
                        )}
                        {property.agent.email && (
                          <a href={`mailto:${property.agent.email}`} className="flex items-center space-x-2 text-gray-700 hover:text-[#023927] transition-colors text-sm break-all">
                            <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{property.agent.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-8 sm:py-16 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-6 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-inter font-light text-gray-900 mb-2 sm:mb-4">
                {t('propertyDetail.similar.title')}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {t('propertyDetail.similar.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 items-stretch">
              {similarProperties.map(similar => (
                <div key={similar.id} className="w-full h-full">
                  <PropertyCard
                    id={similar.id}
                    title={similar.title}
                    description={similar.description || ''}
                    price={similar.price || 0}
                    location={similar.location || ''}
                    surface={similar.surface || 0}
                    bedrooms={similar.bedrooms || 0}
                    bathrooms={similar.bathrooms || 0}
                    rooms={similar.rooms}
                    floors={similar.floors}
                    images={similar.images && similar.images.length > 0 ? similar.images : ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800']}
                    type={(similar.type as 'buy' | 'rent') || 'buy'}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetail;