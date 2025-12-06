// src/pages/Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  HomeModernIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  HeartIcon,
  MapPinIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';

const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Premium property images from Pexels (luxury real estate)
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Villa Méditerranéenne",
      location: "Saint-Tropez, France",
      price: "2,500,000 €"
    },
    {
      image: "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Penthouse Moderne",
      location: "Paris 16ème, France",
      price: "3,200,000 €"
    },
    {
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Domaine Historique",
      location: "Provence, France",
      price: "4,800,000 €"
    }
  ];

  const featuredProperties = [
    {
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Villa Contemporaine",
      location: "Cannes",
      price: "3,500,000 €",
      beds: 5,
      baths: 4,
      area: "420 m²",
      exclusive: true
    },
    {
      image: "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Appartement Haussmannien",
      location: "Paris 8ème",
      price: "1,800,000 €",
      beds: 3,
      baths: 2,
      area: "180 m²",
      exclusive: false
    },
    {
      image: "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Château Renaissance",
      location: "Loire Valley",
      price: "6,200,000 €",
      beds: 8,
      baths: 6,
      area: "950 m²",
      exclusive: true
    }
  ];

  const services = [
    {
      icon: HomeModernIcon,
      title: "Achat & Vente",
      description: "Acquisition et cession de biens d'exception avec une expertise marché incomparable",
      features: ["Évaluation premium", "Négociation experte", "Réseau international"]
    },
    {
      icon: BuildingStorefrontIcon,
      title: "Gestion Patrimoniale",
      description: "Optimisation de vos investissements grâce à notre gestion locative premium",
      features: ["Gestion locative", "Optimisation fiscale", "Conseil en investissement"]
    },
    {
      icon: SparklesIcon,
      title: "Services Conciergerie",
      description: "Services sur mesure pour une expérience de vie et de séjour exceptionnelle",
      features: ["Conciergerie 24/7", "Services premium", "Réseau de prestataires"]
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    let slideInterval: NodeJS.Timeout;
    if (isPlaying) {
      slideInterval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }

    return () => clearInterval(slideInterval);
  }, [isPlaying, heroSlides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex items-center justify-center h-full text-ivory">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {/* Logo/Brand */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative group">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-gold to-amber-600 rounded-xl shadow-2xl transform group-hover:rotate-6 transition-transform duration-500 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="text-deep-green font-bold text-2xl relative z-10">M²</span>
                  </div>
                </div>
              </div>

              <h1 className="text-7xl md:text-9xl font-inter uppercase tracking-widest mb-6 text-center font-light">
                M²
              </h1>
              <p className="text-3xl md:text-4xl font-didot text-gold text-center mb-8 leading-relaxed">
                Square Meter — L'excellence immobilière réinventée
              </p>
              
              {/* Current Slide Info */}
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-inter uppercase mb-2">
                  {heroSlides[activeSlide].title}
                </h2>
                <div className="flex items-center justify-center space-x-4 text-lg">
                  <MapPinIcon className="w-5 h-5 text-gold" />
                  <span className="font-didot text-ivory/90">{heroSlides[activeSlide].location}</span>
                  <CurrencyEuroIcon className="w-5 h-5 text-gold ml-4" />
                  <span className="font-didot text-gold font-semibold">{heroSlides[activeSlide].price}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
                <Link 
                  to="/properties?type=buy" 
                  className="group relative bg-gold text-deep-green px-12 py-4 font-inter uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10">Acheter</span>
                </Link>
                <Link 
                  to="/properties?type=rent" 
                  className="group relative border-2 border-ivory text-ivory px-12 py-4 font-inter uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 group-hover:text-deep-green">Louer</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-6">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-ivory hover:text-gold transition-colors duration-300"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-gold scale-125' 
                    : 'bg-ivory/50 hover:bg-ivory'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="text-ivory hover:text-gold transition-colors duration-300"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="text-ivory hover:text-gold transition-colors duration-300"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Properties */}
      <section className="py-24 bg-gradient-to-br from-ivory to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-repeat" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50 L100 0 L100 100 Z' fill='%23B8860B'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-inter uppercase text-deep-green mb-6">
              Propriétés d'Exception
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-xl font-didot text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez une sélection de biens prestigieux soigneusement choisis pour leur caractère unique, 
              leur architecture remarquable et leur situation exclusive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {featuredProperties.map((property, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-3xl"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Property Image */}
                <div className="relative overflow-hidden h-80">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Exclusive Badge */}
                  {property.exclusive && (
                    <div className="absolute top-4 right-4 bg-gold text-deep-green px-4 py-2 font-inter uppercase text-sm font-semibold rounded-full shadow-lg">
                      EXCLUSIF
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold">
                    <HeartIcon className="w-5 h-5 text-ivory" />
                  </button>
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-inter uppercase text-deep-green text-xl font-semibold">
                      {property.title}
                    </h3>
                    <span className="font-didot text-gold text-lg font-semibold">
                      {property.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="font-didot">{property.location}</span>
                  </div>

                  {/* Property Features */}
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <div className="text-center">
                      <div className="font-inter text-deep-green font-semibold">{property.beds}</div>
                      <div className="font-didot text-gray-600 text-sm">Chambres</div>
                    </div>
                    <div className="text-center">
                      <div className="font-inter text-deep-green font-semibold">{property.baths}</div>
                      <div className="font-didot text-gray-600 text-sm">SDB</div>
                    </div>
                    <div className="text-center">
                      <div className="font-inter text-deep-green font-semibold">{property.area}</div>
                      <div className="font-didot text-gray-600 text-sm">Surface</div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full mt-4 bg-deep-green text-ivory py-3 rounded-lg font-inter uppercase tracking-wide hover:bg-gold hover:text-deep-green transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                    <span>Découvrir</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/properties" 
              className="inline-flex items-center space-x-3 border-2 border-deep-green text-deep-green px-8 py-4 font-inter uppercase tracking-wide hover:bg-deep-green hover:text-ivory transition-all duration-500 transform hover:scale-105 group"
            >
              <span>Explorer notre collection</span>
              <ArrowRightIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Confidential Selection */}
      <section className="py-24 bg-deep-green text-ivory relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-ivory/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <ShieldCheckIcon className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="text-5xl font-inter uppercase mb-8">
              Sélection Confidentielle
            </h2>
            <p className="text-2xl font-didot text-gold mb-8 leading-relaxed">
              L'excellence se partage dans l'intimité. Certaines de nos propriétés les plus exclusives 
              ne sont accessibles que sur demande, préservant ainsi la discrétion de nos clients les plus exigeants.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/confidential" 
                className="group relative bg-gold text-deep-green px-12 py-4 font-inter uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative z-10">Accéder à la sélection</span>
              </Link>
              <Link 
                to="/contact" 
                className="group relative border-2 border-gold text-gold px-12 py-4 font-inter uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative z-10 group-hover:text-deep-green">Devenir client</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-inter uppercase text-deep-green mb-6">
              Prestations Sur Mesure
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-xl font-didot text-gray-600 max-w-3xl mx-auto">
              Un accompagnement personnalisé pour chaque étape de votre projet immobilier
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group text-center p-8 hover:bg-gradient-to-br from-ivory to-white transition-all duration-500 rounded-3xl border border-gray-100 hover:border-gold/30 hover:shadow-2xl transform hover:-translate-y-4"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <service.icon className="w-10 h-10 text-deep-green" />
                  </div>
                  <div className="absolute inset-0 border-2 border-gold rounded-2xl transform rotate-6 scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <h3 className="font-inter uppercase text-deep-green text-xl mb-4 font-semibold">
                  {service.title}
                </h3>
                
                <p className="font-didot text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 text-left">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center font-didot text-gray-700">
                      <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-deep-green text-ivory">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "250+", label: "Propriétés exclusives" },
              { number: "15", label: "Années d'expertise" },
              { number: "98%", label: "Clients satisfaits" },
              { number: "12", label: "Pays desservis" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl lg:text-5xl font-inter text-gold font-light mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="font-didot text-ivory/80 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;