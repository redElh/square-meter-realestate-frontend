// src/pages/PropertyDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const PropertyDetail: React.FC = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Premium property images from Pexels
  const propertyImages = [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=1920"
  ];

  const property = {
    id: 1,
    title: 'Villa Les Oliviers',
    description: `Exceptionnelle villa contemporaine nichée au cœur d'un domaine privé de 2 hectares, 
                  offrant une vue panoramique imprenable sur la Méditerranée. Cette propriété d'exception 
                  allie élégance architecturale et technologies de pointe dans un écrin de verdure préservé.
                  
                  Conçue par l'architecte renommé Jean-Michel Durand, cette villa de 250 m² déploie ses 
                  volumes épurés autour d'un patio central arboré. Les matériaux nobles - pierre de Bourgogne, 
                  chêne massif, laiton vieilli - dialoguent avec les larges baies vitrées qui ouvrent 
                  l'espace sur le jardin paysager et la piscine à débordement.`,
    price: 3850000,
    location: 'Saint-Tropez, Côte d\'Azur',
    surface: 420,
    land: 20000,
    bedrooms: 6,
    bathrooms: 5,
    yearBuilt: 2020,
    type: 'Villa Contemporaine',
    status: 'Exclusivité',
    features: [
      'Piscine à débordement chauffée',
      'Jardin paysager avec oliveraie',
      'Parking sécurisé 6 voitures',
      'Domaine clos et sécurisé',
      'Vue mer panoramique 180°',
      'Cheminée contemporaine',
      'Cuisine Bulthaup équipée',
      'Salle de sport privative',
      'Home cinéma Dolby Atmos',
      'Domotique complète',
      'Chauffage au sol',
      'Ventilation double flux',
      'Panneaux solaires',
      'Cave à vin climatisée',
      'Garage 3 voitures'
    ],
    amenities: [
      'Plage privée à 5 min',
      'Golf 18 trous à 10 min',
      'Marina de prestige',
      'Restaurants étoilés',
      'Helipad à proximité'
    ],
    images: propertyImages,
    agent: {
      name: 'Sophie Laurent',
      title: 'Directrice des Ventes',
      phone: '+33 1 23 45 67 89',
      email: 's.laurent@squaremeter.com',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      experience: '15 ans',
      properties: '120+'
    }
  };

  const similarProperties = [
    {
      id: 2,
      title: 'Villa Baie des Anges',
      location: 'Nice',
      price: 3200000,
      surface: 380,
      bedrooms: 5,
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 3,
      title: 'Domaine Provençal',
      location: 'Gordes',
      price: 4500000,
      surface: 550,
      bedrooms: 7,
      image: 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: 4,
      title: 'Penthouse Monte-Carlo',
      location: 'Monaco',
      price: 5200000,
      surface: 280,
      bedrooms: 4,
      image: 'https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  // Carousel autoplay effect
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isPlaying && property.images.length > 1) {
      slideInterval = setInterval(() => {
        setActiveImage(prev => (prev + 1) % property.images.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isPlaying, property.images.length]);

  const nextImage = () => {
    setActiveImage(prev => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setActiveImage(prev => (prev - 1 + property.images.length) % property.images.length);
  };

  const visibleFeatures = showAllFeatures ? property.features : property.features.slice(0, 8);

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
                  EXCLUSIF
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
                  {property.price.toLocaleString('fr-FR')} €
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
              { value: `${property.surface} m²`, label: 'Surface' },
              { value: `${property.land} m²`, label: 'Terrain' },
              { value: property.bedrooms, label: 'Chambres' },
              { value: property.bathrooms, label: 'Salles de bain' },
              { value: property.yearBuilt, label: 'Année' }
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
                  Description Exclusive
                </h2>
                
                <div className="mb-8 sm:mb-12">
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-8">
                    {property.description}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="mb-8 sm:mb-12">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-inter font-light text-gray-900 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
                    Équipements & Prestations
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
                      {showAllFeatures ? 'Voir moins' : `Voir les ${property.features.length - 8} équipements supplémentaires`}
                    </button>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-inter font-light text-gray-900 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
                    Environnement & Prestations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 sm:px-4 py-1.5 sm:py-2 font-inter text-xs sm:text-sm border border-gray-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Sidebar - Clean green & white theme */}
              <div className="lg:col-span-1">
                <div className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8">
                  <h3 className="font-inter text-gray-900 text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 text-center pb-2 sm:pb-3 border-b border-gray-200">
                    Visite Exclusive
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <Link
                      to="/contact?type=visit&property=1"
                      className="block w-full bg-[#023927] text-white text-center py-3 sm:py-4 font-inter hover:bg-[#023927]/90 transition-all duration-300 border-2 border-[#023927] text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Visite Privée</span>
                      </span>
                    </Link>
                    <Link
                      to="/contact?type=info&property=1"
                      className="block w-full border-2 border-[#023927] text-[#023927] text-center py-3 sm:py-4 font-inter hover:bg-[#023927] hover:text-white transition-all duration-300 text-sm sm:text-base"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Dossier Complet</span>
                      </span>
                    </Link>
                  </div>

                  {/* Agent Profile */}
                  <div className="border-t border-gray-200 pt-4 sm:pt-6">
                    <h4 className="font-inter text-gray-900 text-xs sm:text-sm mb-3 sm:mb-4 text-center uppercase tracking-wider">
                      Votre Conseiller Dédié
                    </h4>
                    <div className="text-center">
                      <div className="mb-3 sm:mb-4">
                        <img
                          src={property.agent.image}
                          alt={property.agent.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover mx-auto border-2 border-gray-300"
                        />
                      </div>
                      <div className="font-inter text-gray-900 text-base sm:text-lg mb-1">
                        {property.agent.name}
                      </div>
                      <div className="text-[#023927] text-xs sm:text-sm mb-2 sm:mb-3">
                        {property.agent.title}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600 space-y-1 mb-3 sm:mb-4">
                        <div>{property.agent.experience} d'expérience</div>
                        <div>{property.agent.properties} propriétés vendues</div>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <a href={`tel:${property.agent.phone}`} className="flex items-center justify-center space-x-2 text-gray-700 hover:text-[#023927] transition-colors duration-300 text-xs sm:text-sm">
                          <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{property.agent.phone}</span>
                        </a>
                        <a href={`mailto:${property.agent.email}`} className="flex items-center justify-center space-x-2 text-gray-700 hover:text-[#023927] transition-colors duration-300 text-xs sm:text-sm break-all">
                          <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-[10px] sm:text-sm">{property.agent.email}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-8 sm:py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-inter font-light text-gray-900 mb-2 sm:mb-4">
              Propriétés Similaires
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Découvrez d'autres propriétés d'exception qui pourraient vous séduire
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {similarProperties.map((similar) => (
              <Link
                key={similar.id}
                to={`/properties/${similar.id}`}
                className="group bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
              >
                <div className="relative overflow-hidden h-40 sm:h-48">
                  <img
                    src={similar.image}
                    alt={similar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                    <span className="bg-[#023927] text-white px-2 sm:px-3 py-1 font-inter uppercase text-[10px] sm:text-xs tracking-wide">
                      EXCLUSIF
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="font-inter text-gray-900 text-base sm:text-lg mb-2 group-hover:text-[#023927] transition-colors duration-300">
                    {similar.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3 text-sm sm:text-base">
                    <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span>{similar.location}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-lg sm:text-xl font-serif text-[#023927] font-semibold">
                      {similar.price.toLocaleString('fr-FR')} €
                    </span>
                    <span className="text-gray-600 text-xs sm:text-sm">
                      {similar.surface} m² • {similar.bedrooms} ch.
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetail;