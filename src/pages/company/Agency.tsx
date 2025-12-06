// src/pages/Agency.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  TrophyIcon,
  ShieldCheckIcon,
  StarIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  ArrowRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  SparklesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';

const Agency: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTeamMember, setActiveTeamMember] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cinematic hero slides
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "L'Excellence Immobilière",
      subtitle: "Depuis 2008"
    },
    {
      image: "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Réseau International",
      subtitle: "12 pays desservis"
    },
    {
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Expertise Exclusive",
      subtitle: "Plus de 250 propriétés vendues"
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Dimitri Martin',
      role: 'Fondateur & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Expert en immobilier de luxe avec 15 ans d\'expérience internationale',
      specialties: ['Stratégie d\'acquisition', 'Négociation complexe', 'Marchés internationaux'],
      experience: '15 ans',
      properties: '120+',
      languages: ['FR', 'EN', 'IT'],
      quote: '"L\'excellence n\'est pas un acte, mais une habitude."'
    },
    {
      id: 2,
      name: 'Sophie Laurent',
      role: 'Directrice des Ventes',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Spécialiste des biens d\'exception sur la Côte d\'Azur et Paris',
      specialties: ['Propriétés côtières', 'Architecture contemporaine', 'Clientèle internationale'],
      experience: '12 ans',
      properties: '85+',
      languages: ['FR', 'EN', 'ES'],
      quote: '"Chaque propriété raconte une histoire unique."'
    },
    {
      id: 3,
      name: 'Thomas Moreau',
      role: 'Responsable Conciergerie',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Garant de l\'expérience client premium et des services sur mesure',
      specialties: ['Services conciergerie', 'Gestion patrimoniale', 'Relations prestataires'],
      experience: '10 ans',
      properties: '200+',
      languages: ['FR', 'EN', 'DE'],
      quote: '"Le luxe réside dans les détails."'
    },
    {
      id: 4,
      name: 'Marie-Claire de Villiers',
      role: 'Directrice Artistique',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Architecte d\'intérieur et experte en mise en valeur patrimoniale',
      specialties: ['Staging premium', 'Architecture d\'intérieur', 'Design contemporain'],
      experience: '8 ans',
      properties: '60+',
      languages: ['FR', 'EN', 'RU'],
      quote: '"L\'espace doit inspirer l\'émotion."'
    }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Discrétion Absolue',
      description: 'Vos projets immobiliers sont traités avec la plus stricte confidentialité et protection des données.',
      features: ['NDA systématiques', 'Communication cryptée', 'Processus confidentiels']
    },
    {
      icon: TrophyIcon,
      title: 'Excellence & Expertise',
      description: 'Une connaissance approfondie des marchés immobiliers de prestige et des tendances du luxe.',
      features: ['Formation continue', 'Veille marché', 'Expertise sectorielle']
    },
    {
      icon: StarIcon,
      title: 'Service Personnalisé',
      description: 'Un accompagnement sur mesure pour chaque client, de la recherche à la transaction finale.',
      features: ['Conseiller dédié', 'Suivi personnalisé', 'Solutions adaptées']
    },
    {
      icon: GlobeAltIcon,
      title: 'Réseau International',
      description: 'Accès à un portefeuille de biens exclusifs worldwide et à une clientèle internationale exigeante.',
      features: ['Réseau global', 'Partenariats premium', 'Market intelligence']
    }
  ];

  const achievements = [
    { number: '50M€+', label: 'Volume de transactions', icon: ChartBarIcon },
    { number: '15+', label: 'Années d\'excellence', icon: CalendarIcon },
    { number: '250+', label: 'Biens exclusifs', icon: BuildingStorefrontIcon },
    { number: '98%', label: 'Taux de satisfaction', icon: StarIcon },
    { number: '12', label: 'Pays desservis', icon: GlobeAltIcon },
    { number: '50+', label: 'Prix d\'excellence', icon: TrophyIcon }
  ];

  const testimonials = [
    {
      name: 'Family Laurent',
      role: 'Investisseurs internationaux',
      content: 'M² a transformé notre vision de l\'immobilier de prestige. Leur expertise et leur discrétion sont incomparables.',
      property: 'Villa Saint-Tropez',
      rating: 5
    },
    {
      name: 'Mr. & Mrs. Schmidt',
      role: 'Collectionneurs d\'art',
      content: 'Un service exceptionnel qui dépasse toutes nos attentes. Chaque détail était parfaitement orchestré.',
      property: 'Penthouse Paris 8ème',
      rating: 5
    },
    {
      name: 'Groupe International',
      role: 'Investissement corporatif',
      content: 'Le professionnalisme et le réseau de M² nous ont ouvert les portes des marchés les plus exclusifs.',
      property: 'Portefeuille Europe',
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    let slideInterval: NodeJS.Timeout;
    if (isPlaying) {
      slideInterval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6000);
    }

    return () => clearInterval(slideInterval);
  }, [isPlaying, heroSlides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextTeamMember = () => {
    setActiveTeamMember((prev) => (prev + 1) % teamMembers.length);
  };

  const prevTeamMember = () => {
    setActiveTeamMember((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIconSolid 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-gold' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-amber-50">
      {/* Cinematic Hero Section */}
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
                className="w-full h-full object-cover transform scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-deep-green/80 via-deep-green/60 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-6 right-6 transform -translate-y-1/2 flex justify-between z-20">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-ivory hover:bg-gold hover:text-deep-green transition-all duration-300 transform hover:scale-110"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-ivory hover:bg-gold hover:text-deep-green transition-all duration-300 transform hover:scale-110"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex items-center justify-center h-full text-ivory">
          <div className="max-w-6xl mx-auto px-6 w-full">
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {/* Animated Logo */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative group">
                  <div className="relative w-20 h-20 bg-gradient-to-br from-gold to-amber-600 rounded-2xl shadow-2xl transform group-hover:rotate-6 transition-transform duration-500 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="text-deep-green font-bold text-3xl relative z-10">M²</span>
                  </div>
                  <div className="absolute -inset-4 border-2 border-gold/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-inter uppercase tracking-widest mb-6 text-center font-light">
                M² Agency
              </h1>
              
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-didot text-gold mb-4">
                  {heroSlides[activeSlide].title}
                </h2>
                <p className="text-xl font-didot text-ivory/90">
                  {heroSlides[activeSlide].subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
                <Link 
                  to="/contact" 
                  className="group relative bg-gold text-deep-green px-12 py-4 font-inter uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Rencontrer notre équipe</span>
                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
                <Link 
                  to="/properties" 
                  className="group relative border-2 border-ivory text-ivory px-12 py-4 font-inter uppercase tracking-wider transition-all duration-300 transform hover:scale-105 overflow-hidden rounded-2xl"
                >
                  <div className="absolute inset-0 bg-ivory transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <span className="relative z-10 group-hover:text-deep-green">
                    Découvrir nos biens
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-ivory hover:text-gold transition-colors duration-300"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSlide === index 
                    ? 'bg-gold scale-125' 
                    : 'bg-ivory/50 hover:bg-ivory'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-repeat" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50 L100 0 L100 100 Z' fill='%23B8860B'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl font-inter uppercase text-deep-green mb-8">
              Notre Philosophie
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-2xl font-didot text-gray-700 leading-relaxed mb-12">
              Fondée sur les principes d'excellence, de discrétion et d'expertise, 
              M² Square Meter réinvente l'immobilier de prestige. Notre approche 
              personnalisée et notre réseau international nous permettent de vous 
              proposer les biens les plus exclusifs et les services les plus raffinés.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={index}
                  className="group p-8 bg-gradient-to-br from-ivory to-white rounded-3xl shadow-2xl border border-gold/20 hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2"
                >
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold to-amber-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                        <IconComponent className="w-8 h-8 text-deep-green" />
                      </div>
                      <div className="absolute -inset-2 border-2 border-gold/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-inter uppercase text-deep-green text-2xl mb-4 group-hover:text-gold transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="font-didot text-gray-600 mb-6 leading-relaxed">
                        {value.description}
                      </p>
                      <ul className="space-y-2">
                        {value.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center font-didot text-gray-700">
                            <div className="w-2 h-2 bg-gold rounded-full mr-3 transform group-hover:scale-125 transition-transform duration-300"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-deep-green text-ivory relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-ivory/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-inter uppercase mb-8">
              Notre Héritage
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-xl font-didot text-gold max-w-3xl mx-auto">
              Plus d'une décennie d'excellence au service de clients exigeants à travers le monde
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="group text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-500">
                      <IconComponent className="w-8 h-8 text-gold" />
                    </div>
                    <div className="absolute inset-0 border-2 border-gold/30 rounded-2xl transform rotate-6 scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-inter text-gold font-light mb-2 transform group-hover:scale-105 transition-transform duration-300">
                    {achievement.number}
                  </div>
                  <div className="font-didot text-ivory/80 text-sm leading-relaxed">
                    {achievement.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-ivory to-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-inter uppercase text-deep-green mb-8">
              Notre Équipe d'Experts
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-xl font-didot text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Des professionnels passionnés, unis par l'excellence et dédiés à la réalisation de vos projets les plus ambitieux
            </p>
          </div>

          {/* Team Carousel */}
          <div className="relative max-w-6xl mx-auto">
            {/* Main Team Member Display */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Team Member Image */}
                <div className="relative h-96 lg:h-auto">
                  <img
                    src={teamMembers[activeTeamMember].image}
                    alt={teamMembers[activeTeamMember].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevTeamMember}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-ivory hover:bg-gold hover:text-deep-green transition-all duration-300"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextTeamMember}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-ivory hover:bg-gold hover:text-deep-green transition-all duration-300"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Team Member Info */}
                <div className="p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-ivory text-deep-green font-inter uppercase text-xs tracking-wide rounded-full border border-gold/30 mb-4">
                      {teamMembers[activeTeamMember].role}
                    </span>
                    <h3 className="text-4xl font-inter uppercase text-deep-green mb-4">
                      {teamMembers[activeTeamMember].name}
                    </h3>
                    <p className="font-didot text-gray-600 text-lg mb-6 leading-relaxed">
                      {teamMembers[activeTeamMember].description}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="mb-8">
                    <h4 className="font-inter uppercase text-deep-green text-sm mb-4">Spécialités</h4>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers[activeTeamMember].specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-gold/10 text-deep-green rounded-full font-didot text-sm border border-gold/30">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center p-3 bg-ivory rounded-xl">
                      <div className="font-inter text-deep-green text-lg font-semibold">{teamMembers[activeTeamMember].experience}</div>
                      <div className="font-didot text-gray-600 text-sm">Expérience</div>
                    </div>
                    <div className="text-center p-3 bg-ivory rounded-xl">
                      <div className="font-inter text-deep-green text-lg font-semibold">{teamMembers[activeTeamMember].properties}</div>
                      <div className="font-didot text-gray-600 text-sm">Propriétés</div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center space-x-2">
                    <span className="font-inter uppercase text-deep-green text-sm">Langues:</span>
                    <div className="flex space-x-1">
                      {teamMembers[activeTeamMember].languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-deep-green text-ivory rounded text-xs font-didot">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="mt-8 pt-6 border-t border-gold/20">
                    <p className="font-didot text-gray-600 italic text-lg">
                      "{teamMembers[activeTeamMember].quote}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member Indicators */}
            <div className="flex justify-center space-x-4 mt-8">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTeamMember(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTeamMember 
                      ? 'bg-gold scale-125' 
                      : 'bg-gray-300 hover:bg-gold/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-deep-green text-ivory relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <SparklesIcon className="absolute top-10 left-10 w-24 h-24 transform rotate-12" />
          <SparklesIcon className="absolute bottom-10 right-10 w-24 h-24 transform -rotate-12" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-inter uppercase mb-8">
              Témoignages Clients
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-xl font-didot text-gold max-w-3xl mx-auto">
              La confiance de nos clients est notre plus grande récompense
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-gold/20 hover:border-gold transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Rating */}
                <div className="flex mb-6">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Content */}
                <p className="font-didot text-ivory text-lg mb-8 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Client Info */}
                <div className="border-t border-gold/20 pt-6">
                  <div className="font-inter uppercase text-gold text-lg mb-1">
                    {testimonial.name}
                  </div>
                  <div className="font-didot text-ivory/80 text-sm mb-2">
                    {testimonial.role}
                  </div>
                  <div className="font-didot text-gold text-sm">
                    {testimonial.property}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-white to-ivory relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-amber-600"></div>
        </div>

        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-inter uppercase text-deep-green mb-8">
              Prêt à concrétiser votre projet d'exception ?
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-2xl font-didot text-gray-700 mb-12 leading-relaxed">
              Rencontrons-nous pour discuter de vos ambitions immobilières et 
              découvrir comment nous pouvons vous accompagner vers l'excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/contact"
                className="group relative bg-deep-green text-ivory px-12 py-4 font-inter uppercase tracking-wider transition-all duration-500 transform hover:scale-105 overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Prendre rendez-vous</span>
                </span>
              </Link>
              <div className="flex items-center space-x-6 text-deep-green">
                <a href="tel:+33123456789" className="flex items-center space-x-2 hover:text-gold transition-colors duration-300 group">
                  <PhoneIcon className="w-5 h-5" />
                  <span className="font-didot">+33 1 23 45 67 89</span>
                </a>
                <a href="mailto:contact@squaremeter.com" className="flex items-center space-x-2 hover:text-gold transition-colors duration-300 group">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span className="font-didot">contact@squaremeter.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agency;