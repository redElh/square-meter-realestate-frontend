// src/pages/PropertyDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  ArrowsPointingOutIcon, 
  HomeModernIcon, 
  HeartIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  MapPinIcon as MapPinIconSolid,
  HomeModernIcon as HomeModernIconSolid
} from '@heroicons/react/24/solid';

const PropertyDetail: React.FC = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-br from-ivory to-white">
      {/* Cinematic Hero Gallery */}
      <section className="relative h-screen overflow-hidden">
        {/* Main Image */}
        <div className="absolute inset-0">
          {property.images.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`${property.title} - Vue ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                activeImage === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-6 right-6 transform -translate-y-1/2 flex justify-between z-20">
          <button
            onClick={prevImage}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-ivory hover:bg-gold hover:text-deep-green transition-all duration-300 transform hover:scale-110"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-ivory hover:bg-gold hover:text-deep-green transition-all duration-300 transform hover:scale-110"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
          {property.images.length > 1 && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-ivory hover:text-gold transition-colors duration-300"
            >
              {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
          )}
          <div className="flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeImage === index 
                    ? 'bg-gold scale-125' 
                    : 'bg-ivory/50 hover:bg-ivory'
                }`}
              />
            ))}
          </div>
          <span className="text-ivory/70 font-didot text-sm">
            {activeImage + 1} / {property.images.length}
          </span>
        </div>

        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 z-10">
          <div className="container mx-auto">
            <div className="max-w-6xl">
              {/* Status Badge */}
              <div className="inline-flex items-center bg-gold text-deep-green px-6 py-3 rounded-full font-inter uppercase text-sm tracking-wide mb-6 shadow-lg">
                <div className="w-2 h-2 bg-deep-green rounded-full mr-2 animate-pulse"></div>
                {property.status}
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-inter uppercase text-ivory mb-6 leading-tight font-light">
                {property.title}
              </h1>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-6 text-ivory">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5 text-gold" />
                    <span className="font-didot text-xl">{property.location}</span>
                  </div>
                  <div className="w-px h-6 bg-ivory/30"></div>
                  <div className="flex items-center space-x-2">
                    <ArrowsPointingOutIcon className="w-5 h-5 text-gold" />
                    <span className="font-didot text-xl">{property.surface} m²</span>
                  </div>
                  <div className="w-px h-6 bg-ivory/30"></div>
                  <div className="flex items-center space-x-2">
                    <HomeModernIcon className="w-5 h-5 text-gold" />
                    <span className="font-didot text-xl">{property.bedrooms} chambres</span>
                  </div>
                </div>

                <div className="text-4xl lg:text-5xl font-didot text-gold font-light">
                  {property.price.toLocaleString('fr-FR')} €
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/contact?type=visit&property=1"
                  className="group relative bg-gold text-deep-green px-8 py-4 font-inter uppercase tracking-wide transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span>Visite Privée</span>
                  </span>
                </Link>
                <Link
                  to="/contact?type=info&property=1"
                  className="group relative border-2 border-ivory text-ivory px-8 py-4 font-inter uppercase tracking-wide transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 flex items-center space-x-2 group-hover:text-deep-green">
                    <DocumentTextIcon className="w-5 h-5" />
                    <span>Documentation Complète</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="group relative border-2 border-ivory text-ivory w-14 h-14 flex items-center justify-center transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  {isFavorite ? (
                    <HeartIconSolid className="w-6 h-6 relative z-10 text-red-500 group-hover:text-red-600" />
                  ) : (
                    <HeartIcon className="w-6 h-6 relative z-10 group-hover:text-deep-green" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quick Stats Bar */}
      <section className="bg-deep-green text-ivory py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            {[
              { icon: ArrowsPointingOutIcon, value: `${property.surface} m²`, label: 'Surface habitable' },
              { icon: MapPinIcon, value: `${property.land} m²`, label: 'Terrain' },
              { icon: HomeModernIcon, value: property.bedrooms, label: 'Chambres' },
              { icon: '🛁', value: property.bathrooms, label: 'Salles de bain' },
              { icon: '🏛️', value: property.yearBuilt, label: 'Construction' }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="flex justify-center mb-3">
                  {typeof stat.icon === 'string' ? (
                    <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                  ) : (
                    <stat.icon className="w-8 h-8 text-gold transform group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
                <div className="text-2xl lg:text-3xl font-inter text-ivory mb-1 transform group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="font-didot text-gold text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Description & Details */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-5xl font-inter uppercase text-deep-green mb-8 relative">
                  <span className="relative z-10">Présentation Exclusive</span>
                  <div className="absolute bottom-0 left-0 w-24 h-1 bg-gold"></div>
                </h2>
                
                <div className="prose prose-lg max-w-none mb-12">
                  <p className="font-didot text-gray-700 text-xl leading-relaxed mb-8">
                    {property.description}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="mb-12">
                  <h3 className="text-3xl font-inter uppercase text-deep-green mb-8">
                    Équipements & Prestations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center group p-3 rounded-xl hover:bg-ivory transition-all duration-300">
                        <div className="w-3 h-3 bg-gold rounded-full mr-4 transform group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="font-didot text-gray-700 text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {property.features.length > 8 && (
                    <button
                      onClick={() => setShowAllFeatures(!showAllFeatures)}
                      className="mt-6 text-gold hover:text-deep-green font-inter uppercase text-sm tracking-wide transition-colors duration-300"
                    >
                      {showAllFeatures ? 'Voir moins' : `Voir les ${property.features.length - 8} équipements supplémentaires`}
                    </button>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-3xl font-inter uppercase text-deep-green mb-6">
                    Environnement & Prestations
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((amenity, index) => (
                      <span key={index} className="bg-ivory text-deep-green px-4 py-2 rounded-full font-didot text-sm border border-gold/30">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Contact Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-ivory to-white rounded-3xl p-8 sticky top-8 shadow-2xl border border-gold/20 backdrop-blur-sm">
                  <h3 className="font-inter uppercase text-deep-green text-2xl mb-6 text-center">
                    Visite Exclusive
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <Link
                      to="/contact?type=visit&property=1"
                      className="block w-full bg-deep-green text-ivory text-center py-4 font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-all duration-500 transform hover:scale-105 rounded-xl group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <CalendarIcon className="w-5 h-5" />
                        <span>Visite Privée</span>
                      </span>
                    </Link>
                    <Link
                      to="/contact?type=info&property=1"
                      className="block w-full border-2 border-deep-green text-deep-green text-center py-4 font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-all duration-500 transform hover:scale-105 rounded-xl group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-deep-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <span className="relative z-10 flex items-center justify-center space-x-2 group-hover:text-ivory">
                        <DocumentTextIcon className="w-5 h-5" />
                        <span>Dossier Complet</span>
                      </span>
                    </Link>
                  </div>

                  {/* Agent Profile */}
                  <div className="border-t border-gold/30 pt-6">
                    <h4 className="font-inter uppercase text-deep-green text-sm mb-4 text-center">
                      Votre Conseiller Dédié
                    </h4>
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <img
                          src={property.agent.image}
                          alt={property.agent.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-gold shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full border-2 border-white"></div>
                      </div>
                      <div className="font-inter uppercase text-deep-green text-lg mb-1">
                        {property.agent.name}
                      </div>
                      <div className="font-didot text-gold text-sm mb-3">
                        {property.agent.title}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1 mb-4">
                        <div>{property.agent.experience} d'expérience</div>
                        <div>{property.agent.properties} propriétés vendues</div>
                      </div>
                      <div className="space-y-2">
                        <a href={`tel:${property.agent.phone}`} className="flex items-center justify-center space-x-2 text-deep-green hover:text-gold transition-colors duration-300">
                          <PhoneIcon className="w-4 h-4" />
                          <span className="font-didot">{property.agent.phone}</span>
                        </a>
                        <a href={`mailto:${property.agent.email}`} className="flex items-center justify-center space-x-2 text-deep-green hover:text-gold transition-colors duration-300">
                          <EnvelopeIcon className="w-4 h-4" />
                          <span className="font-didot text-sm">{property.agent.email}</span>
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

      {/* Enhanced Similar Properties */}
      <section className="py-20 bg-gradient-to-br from-ivory to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-inter uppercase text-deep-green mb-6">
              Propriétés Similaires
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-xl font-didot text-gray-600 max-w-2xl mx-auto">
              Découvrez d'autres propriétés d'exception qui pourraient vous séduire
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProperties.map((similar, index) => (
              <Link
                key={similar.id}
                to={`/properties/${similar.id}`}
                className="group bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={similar.image}
                    alt={similar.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gold text-deep-green px-3 py-1 font-inter uppercase text-xs tracking-wide rounded-full">
                      EXCLUSIF
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-inter uppercase text-deep-green text-xl mb-3 group-hover:text-gold transition-colors duration-300">
                    {similar.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <span className="font-didot">{similar.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-didot text-gold font-semibold">
                      {similar.price.toLocaleString('fr-FR')} €
                    </span>
                    <span className="font-didot text-gray-600">
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