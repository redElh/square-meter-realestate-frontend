// src/pages/Owners.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeModernIcon, 
  BuildingStorefrontIcon, 
  SparklesIcon,
  ShieldCheckIcon,
  CameraIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import {
  HomeModernIcon as HomeModernIconSolid,
  BuildingStorefrontIcon as BuildingStorefrontIconSolid,
  SparklesIcon as SparklesIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';

const Owners: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSection, setActiveSection] = useState<'sell' | 'manage'>('sell');
  const [city, setCity] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);

  // Premium owner-focused hero images
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Valorisation d'Exception",
      subtitle: "Maximisez la valeur de votre patrimoine immobilier",
      description: "Notre expertise exclusive dans le marché du luxe garantit la meilleure valorisation de votre propriété"
    },
    {
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Gestion Prestige",
      subtitle: "Confiez-nous la gestion de votre bien d'exception",
      description: "Services sur mesure pour propriétaires exigeants, de la location saisonnière à la gestion patrimoniale"
    },
    {
      image: "https://images.pexels.com/photos/7031612/pexels-photo-7031612.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Réseau International",
      subtitle: "Accédez à une clientèle internationale sélectionnée",
      description: "Notre réseau de clients haut de gamme assure des transactions rapides et discrètes"
    }
  ];

  useEffect(() => {
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

  const handleSellRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      setIsEstimating(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsEstimating(false);
      window.location.href = `/selling-multistep?address=${encodeURIComponent(city)}&step=1`;
    }
  };

  const benefits = [
    {
      icon: ShieldCheckIcon,
      solidIcon: ShieldCheckIconSolid,
      title: 'Expertise Prestige',
      description: 'Notre réseau de clients haut de gamme et notre connaissance du marché du luxe assurent la meilleure valorisation.',
      stats: '+25% de valorisation moyenne'
    },
    {
      icon: UserGroupIcon,
      solidIcon: UserGroupIcon,
      title: 'Discrétion Absolue',
      description: 'Vente confidentielle pour préserver votre intimité et celle de votre propriété.',
      stats: '100% des ventes confidentielles'
    },
    {
      icon: CameraIcon,
      solidIcon: CameraIcon,
      title: 'Présentation Exclusive',
      description: 'Photographie professionnelle et visites immersives pour mettre en valeur votre propriété.',
      stats: 'Visites 3D incluses'
    },
    {
      icon: RocketLaunchIcon,
      solidIcon: RocketLaunchIcon,
      title: 'Process Optimisé',
      description: 'Accompagnement personnalisé de la mise en vente jusqu\'à la signature finale.',
      stats: 'Délai moyen : 45 jours'
    }
  ];

  const managementServices = [
    {
      icon: HomeModernIcon,
      solidIcon: HomeModernIconSolid,
      title: 'Gestion Locative',
      description: 'Gestion complète de votre bien locatif avec sélection rigoureuse des locataires.',
      features: ['Sélection locataire', 'Gestion des loyers', 'Entretien préventif'],
      price: '8% du loyer'
    },
    {
      icon: CalendarIcon,
      solidIcon: CalendarIcon,
      title: 'Location Saisonnière',
      description: 'Optimisation de vos revenus grâce à notre gestion professionnelle des locations saisonnières.',
      features: ['Réservation premium', 'Check-in/out', 'Ménage professionnel'],
      price: '20% des revenus'
    },
    {
      icon: SparklesIcon,
      solidIcon: SparklesIconSolid,
      title: 'Service Conciergerie',
      description: 'Entretien, ménage et services sur mesure pour préserver l\'excellence de votre propriété.',
      features: ['Entretien régulier', 'Services VIP', 'Maintenance 24/7'],
      price: 'Sur devis'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
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
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/50 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex items-center justify-center h-full text-white">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className="transform transition-all duration-1000 delay-300">
              {/* Elegant Typography */}
              <div className="text-center mb-8">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20">
                  <span className="text-sm uppercase tracking-widest font-light">Propriétaires d'Exception</span>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-light uppercase mb-6 text-center tracking-tight">
                Votre Patrimoine
              </h1>
              
              {/* Current Slide Info */}
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight">
                  {heroSlides[activeSlide].title}
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 mb-6 font-light">
                  {heroSlides[activeSlide].subtitle}
                </p>
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  {heroSlides[activeSlide].description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
                <Link 
                  to="/selling-multistep?step=1" 
                  className="group relative bg-white text-gray-900 px-12 py-4 font-light uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden text-center"
                >
                  <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10">Estimer mon bien</span>
                </Link>
                <Link 
                  to="/contact?type=management" 
                  className="group relative border-2 border-white text-white px-12 py-4 font-light uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden text-center"
                >
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 group-hover:text-gray-900">Expertise sur mesure</span>
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
            className="text-white hover:text-gray-300 transition-colors duration-300"
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
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="text-white hover:text-gray-300 transition-colors duration-300"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="text-white hover:text-gray-300 transition-colors duration-300"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
      </section>

      {/* Rest of the existing content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Enhanced Navigation Tabs */}
          <div className="flex justify-center mb-16 -mt-8 relative z-10">
            <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-gray-200">
              <button
                onClick={() => setActiveSection('sell')}
                className={`px-12 py-6 font-light uppercase text-lg tracking-wide transition-all duration-500 rounded-xl flex items-center space-x-3 ${
                  activeSection === 'sell'
                    ? 'bg-gray-900 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <BuildingStorefrontIcon className="w-6 h-6" />
                <span>Vendre</span>
              </button>
              <button
                onClick={() => setActiveSection('manage')}
                className={`px-12 py-6 font-light uppercase text-lg tracking-wide transition-all duration-500 rounded-xl flex items-center space-x-3 ${
                  activeSection === 'manage'
                    ? 'bg-gray-900 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <HomeModernIcon className="w-6 h-6" />
                <span>Faire Gérer</span>
              </button>
            </div>
          </div>

          {/* Enhanced Sell Section */}
          {activeSection === 'sell' && (
            <div className="max-w-6xl mx-auto">
              {/* Quick City Form - Enhanced */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-16 border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-900 to-gray-700"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-900/5 rounded-full blur-3xl"></div>
                
                <h2 className="text-4xl font-light uppercase text-gray-900 mb-8 text-center">
                  Estimation Immédiate & Gratuite
                </h2>
                <p className="text-xl font-light text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                  Découvrez la valeur réelle de votre propriété sur le marché du luxe
                </p>
                
                <form onSubmit={handleSellRedirect} className="max-w-2xl mx-auto">
                  <div className="mb-8">
                    <label htmlFor="city" className="block font-light uppercase text-gray-900 text-sm mb-4">
                      <MapPinIcon className="w-5 h-5 inline mr-2" />
                      Où se situe votre propriété d'exception ?
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Saint-Tropez, Paris 16ème, Courchevel..."
                      className="w-full p-6 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 font-light text-lg bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isEstimating}
                    className="w-full bg-gray-900 text-white py-6 font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 rounded-2xl text-lg font-normal relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <span className="relative z-10 flex items-center justify-center space-x-3 text-white transition-colors duration-300 group-hover:text-gray-900">
                      {isEstimating ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                          <span>Analyse en cours...</span>
                        </>
                      ) : (
                        <>
                          <CurrencyEuroIcon className="w-6 h-6 text-current" />
                          <span>Obtenir mon estimation prestige</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>

              {/* Why Sell With Us - Enhanced */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-gray-200">
                <h2 className="text-5xl font-light uppercase text-gray-900 mb-12 text-center relative">
                  <span className="relative z-10">L'Excellence Square Meter</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-900"></div>
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-gray-400 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl"
                    >
                      <div className="flex items-start space-x-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                            <benefit.icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute inset-0 border-2 border-gray-400 rounded-2xl transform rotate-6 scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-light uppercase text-gray-900 text-xl mb-3 group-hover:text-gray-700 transition-colors duration-300">
                            {benefit.title}
                          </h3>
                          <p className="font-light text-gray-600 mb-4 leading-relaxed">
                            {benefit.description}
                          </p>
                          <div className="bg-gray-900/10 text-gray-700 px-4 py-2 rounded-full font-light text-sm inline-block">
                            {benefit.stats}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 p-8 bg-gray-900 rounded-2xl text-white">
                  {[
                    { number: '98%', label: 'Taux de réussite' },
                    { number: '45j', label: 'Délai moyen' },
                    { number: '+25%', label: 'Valorisation' },
                    { number: '500+', label: 'Propriétés vendues' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="text-3xl lg:text-4xl font-light text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </div>
                      <div className="font-light text-white/80 text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Link
                    to="/contact?type=sell"
                    className="inline-flex items-center space-x-3 bg-gray-900 text-white px-12 py-6 font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 rounded-2xl group"
                  >
                    <span>Rencontrer notre directeur des ventes</span>
                    <PhoneIcon className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Manage Section */}
          {activeSection === 'manage' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-gray-200">
                <h2 className="text-5xl font-light uppercase text-gray-900 mb-12 text-center relative">
                  <span className="relative z-10">Gestion Prestige</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-900"></div>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                  {managementServices.map((service, index) => (
                    <div 
                      key={index}
                      className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-gray-400 transition-all duration-500 transform hover:-translate-y-4 hover:shadow-2xl"
                    >
                      <div className="text-center mb-6">
                        <div className="relative inline-block mb-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg mx-auto">
                            <service.icon className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute inset-0 border-2 border-gray-400 rounded-2xl transform rotate-6 scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        <h3 className="font-light uppercase text-gray-900 text-2xl mb-4 group-hover:text-gray-700 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="font-light text-gray-600 mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        
                        <div className="text-2xl font-light text-gray-900 font-semibold mb-6">
                          {service.price}
                        </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center font-light text-gray-700">
                            <div className="w-2 h-2 bg-gray-900 rounded-full mr-3"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/contact?type=manage"
                        className="block w-full bg-gray-900 text-white text-center py-4 font-light uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 rounded-xl"
                      >
                        Demander un devis
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Additional Services */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
                  <h3 className="text-3xl font-light uppercase text-white mb-6 text-center">
                    Services Additionnels
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: ChartBarIcon, title: 'Audit de Rendement', description: 'Analyse détaillée de la performance de votre investissement' },
                      { icon: WrenchScrewdriverIcon, title: 'Rénovation Prestige', description: 'Coordination de travaux avec des artisans d\'exception' },
                      { icon: SparklesIcon, title: 'Staging Immobilier', description: 'Mise en scène professionnelle pour maximiser l\'attractivité' },
                      { icon: ShieldCheckIcon, title: 'Assurances Premium', description: 'Solutions d\'assurance adaptées aux biens d\'exception' }
                    ].map((service, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                        <service.icon className="w-8 h-8 text-white flex-shrink-0" />
                        <div>
                          <div className="font-light uppercase text-white text-sm mb-1">{service.title}</div>
                          <div className="font-light text-white/80 text-sm">{service.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Owners;