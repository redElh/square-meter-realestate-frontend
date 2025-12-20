// src/pages/PropertyDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPinIcon, 
  ArrowsPointingOutIcon, 
  HomeIcon, 
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckIcon,
  Square2StackIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  MapPinIcon as MapPinIconSolid
} from '@heroicons/react/24/solid';
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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

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
  }, [id]);

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

  const visibleFeatures = showAllFeatures ? (property.features || []) : (property.features || []).slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO CAROUSEL - Updated to match Properties page style */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[80vh] overflow-hidden bg-white">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {property.images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeImage === index ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`${property.title} - Vue ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Carousel Controls - Positioned like Properties page */}
        <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-30 flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={prevImage}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={nextImage}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
            style={{ borderRadius: '0' }}
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Slide Indicators */}
          <div className="flex space-x-1.5 sm:space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 transition-all duration-300 ${
                  activeImage === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                style={{ borderRadius: '0' }}
              />
            ))}
          </div>
        </div>

        {/* Property Title Overlay - Simplified */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-8 lg:p-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl">
              {/* Status Badge - Green theme */}
              <div className="inline-block mb-2 sm:mb-4">
                <span className="bg-[#023927] text-white px-2 sm:px-4 py-1 sm:py-2 font-inter uppercase text-[10px] sm:text-xs font-medium tracking-wider">
                  {t('propertyDetail.exclusive')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-2 sm:mb-4 leading-tight">
                {property.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-white">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-inter text-sm sm:text-base">{property.location}</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-white/30"></div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-serif font-light text-white">
                  {formatPrice(property.price || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </section>

      {/* Quick Stats Bar - Green theme */}
      <section className="bg-[#023927] text-white py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 text-center items-center">
            {[
              { value: `${property.surface} m²`, label: t('propertyDetail.stats.surface') },
              { value: property.landSurface ? `${property.landSurface} m²` : '-', label: t('propertyDetail.stats.land') },
              { value: property.rooms || 0, label: t('propertyDetail.stats.rooms') },
              { value: property.floors || 0, label: t('propertyDetail.stats.floors') },
              { value: property.yearBuilt || '-', label: t('propertyDetail.stats.year') }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-base sm:text-lg lg:text-xl font-inter font-medium mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/80 tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Description & Details */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-inter font-light text-gray-900 mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-gray-200">
                  {t('propertyDetail.sections.description')}
                </h2>
                
                <div className="mb-8 sm:mb-12">
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-8">
                    {property.description}
                  </p>
                </div>

                {/* Features Grid */}
                {property.features && property.features.length > 0 && (
                  <div className="mb-8 sm:mb-12">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-inter font-light text-gray-900 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
                      {t('propertyDetail.sections.features')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                      {visibleFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center p-2 sm:p-3 border border-gray-100 hover:bg-gray-50 transition-colors duration-300">
                          <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#023927] mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>
                    {property.features.length > 8 && (
                      <button
                        onClick={() => setShowAllFeatures(!showAllFeatures)}
                        className="mt-4 sm:mt-6 text-[#023927] hover:text-[#023927]/80 font-inter text-xs sm:text-sm transition-colors duration-300 border-b border-[#023927] pb-1"
                      >
                        {showAllFeatures ? t('propertyDetail.actions.showLess') : t('propertyDetail.actions.showMore', { count: property.features.length - 8 })}
                      </button>
                    )}
                  </div>
                )}

                {/* Areas/Rooms from Apimo */}
                {property.areas && property.areas.length > 0 && (
                  <div className="mb-8 sm:mb-12">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-inter font-light text-gray-900 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
                      {t('propertyDetail.sections.rooms') || 'Pièces'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {property.areas.map((area, index) => (
                        <div key={index} className="p-3 border border-gray-200 bg-gray-50">
                          <div className="font-medium text-gray-900">{area.type} {area.number && area.number > 1 ? `(${area.number})` : ''}</div>
                          {area.area && <div className="text-sm text-gray-600">{area.area} m²</div>}
                          {area.description && <div className="text-xs text-gray-500 mt-1">{area.description}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Sidebar - Clean green & white theme */}
              <div className="lg:col-span-1">
                <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8">
                  <h3 className="font-inter text-gray-900 text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 text-center pb-2 sm:pb-3 border-b border-gray-200">
                    {t('propertyDetail.contact.title')}
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <Link
                      to="/contact?type=visit&property=1"
                      className="block w-full bg-[#023927] text-white text-center py-3 sm:py-4 font-inter hover:bg-[#023927]/90 transition-all duration-300 border-2 border-[#023927] text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{t('propertyDetail.actions.privateVisit')}</span>
                      </span>
                    </Link>
                    <Link
                      to="/contact?type=info&property=1"
                      className="block w-full border-2 border-[#023927] text-[#023927] text-center py-3 sm:py-4 font-inter hover:bg-[#023927] hover:text-white transition-all duration-300 text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{t('propertyDetail.actions.completeFile')}</span>
                      </span>
                    </Link>
                  </div>

                  {/* Agent Profile */}
                  {property.agent && (
                    <div className="border-t border-gray-200 pt-4 sm:pt-6">
                      <h4 className="font-inter text-gray-900 text-xs sm:text-sm mb-3 sm:mb-4 text-center uppercase tracking-wider">
                        {t('propertyDetail.contact.advisor')}
                      </h4>
                      <div className="text-center">
                        {property.agent.image && (
                          <div className="mb-3 sm:mb-4">
                            <img
                              src={property.agent.image}
                              alt={property.agent.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover mx-auto border-2 border-gray-300"
                            />
                          </div>
                        )}
                        <div className="font-inter text-gray-900 text-base sm:text-lg mb-1">
                          {property.agent.name}
                        </div>
                        <div className="text-[#023927] text-xs sm:text-sm mb-2 sm:mb-3">
                          {t('propertyDetail.contact.realEstateAdvisor') || 'Conseiller Immobilier'}
                        </div>
                        <div className="space-y-1.5 sm:space-y-2">
                          {property.agent.phone && (
                            <a href={`tel:${property.agent.phone}`} className="flex items-center justify-center space-x-2 text-gray-700 hover:text-[#023927] transition-colors duration-300 text-xs sm:text-sm">
                              <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{property.agent.phone}</span>
                            </a>
                          )}
                          {property.agent.mobile && (
                            <a href={`tel:${property.agent.mobile}`} className="flex items-center justify-center space-x-2 text-gray-700 hover:text-[#023927] transition-colors duration-300 text-xs sm:text-sm">
                              <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{property.agent.mobile}</span>
                            </a>
                          )}
                          {property.agent.email && (
                            <a href={`mailto:${property.agent.email}`} className="flex items-center justify-center space-x-2 text-gray-700 hover:text-[#023927] transition-colors duration-300 text-xs sm:text-sm break-all">
                              <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="text-[10px] sm:text-sm">{property.agent.email}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {similarProperties.map(similar => (
                <div key={similar.id} className="w-full">
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