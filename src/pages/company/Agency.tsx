// src/pages/Agency.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  MapPinIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const Agency: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTeamMember, setActiveTeamMember] = useState(0);

  // Cinematic hero slides - updated with premium real estate images
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "L'Excellence Immobilière"
    },
    {
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Réseau International"
    },
    {
      image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1920",
      title: "Expertise Exclusive"
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Dimitri Martin',
      role: 'Fondateur & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
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
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
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
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=800',
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
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Architecte d\'intérieur et experte en mise en valeur patrimoniale',
      specialties: ['Staging premium', 'Architecture d\'intérieur', 'Design contemporain'],
      experience: '8 ans',
      properties: '60+',
      languages: ['FR', 'EN', 'RU'],
      quote: '"L\'espace doit inspirer l\'émotion."'
    }
  ];

  const philosophyPrinciples = [
    {
      title: 'Discrétion Absolue',
      description: 'Vos projets immobiliers sont traités avec la plus stricte confidentialité et protection des données.',
      icon: ShieldCheckIcon
    },
    {
      title: 'Excellence & Expertise',
      description: 'Une connaissance approfondie des marchés immobiliers de prestige et des tendances du luxe.',
      icon: ChartBarIcon
    },
    {
      title: 'Service Personnalisé',
      description: 'Un accompagnement sur mesure pour chaque client, de la recherche à la transaction finale.',
      icon: UserGroupIcon
    },
    {
      title: 'Réseau International',
      description: 'Accès à un portefeuille de biens exclusifs worldwide et à une clientèle internationale exigeante.',
      icon: BuildingLibraryIcon
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

  return (
    <div className="min-h-screen bg-white font-inter text-base">
      {/* Hero Section - match Properties page height and spacing */}
      <section className="relative h-[60vh] overflow-hidden bg-white">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 left-6 right-6 transform -translate-y-1/2 flex justify-between z-20">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 transition-all duration-300 ${
                  activeSlide === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Buttons Container - Centered at bottom */}
        <div className="absolute bottom-12 lg:bottom-16 left-0 right-0 z-20 flex justify-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/contact" 
              className="bg-[#023927] text-white px-12 py-4 font-inter uppercase tracking-wider text-lg hover:bg-white hover:text-[#023927] hover:border-2 hover:border-[#023927] transition-all duration-500"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Rencontrer notre équipe</span>
                <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            <Link 
              to="/properties" 
              className="border-2 border-white text-white px-12 py-4 font-inter uppercase tracking-wider text-lg hover:bg-white hover:text-[#023927] transition-all duration-500"
            >
              <span>Découvrir nos biens</span>
            </Link>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      </section>

      {/* Team Section - Placed immediately after hero */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter font-light text-gray-900 mb-4">
              Notre Équipe d'Experts
            </h2>
            <div className="h-px bg-gray-200 w-24 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Des professionnels passionnés, unis par l'excellence et dédiés à la réalisation de vos projets les plus ambitieux
            </p>
          </div>

          {/* Team Carousel */}
          <div className="relative max-w-6xl mx-auto">
            {/* Main Team Member Display */}
            <div className="bg-white border-2 border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Team Member Image */}
                <div className="relative h-[500px] lg:h-auto">
                  <img
                    src={teamMembers[activeTeamMember].image}
                    alt={teamMembers[activeTeamMember].name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevTeamMember}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextTeamMember}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors duration-300 border border-white/30"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Team Member Info */}
                <div className="p-12 flex flex-col justify-center">
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 font-inter uppercase text-xs tracking-wide mb-4 border border-gray-300">
                      {teamMembers[activeTeamMember].role}
                    </span>
                    <h3 className="text-3xl font-inter font-medium text-gray-900 mb-4">
                      {teamMembers[activeTeamMember].name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                      {teamMembers[activeTeamMember].description}
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="mb-8">
                    <h4 className="font-inter uppercase text-gray-700 text-sm mb-4 font-medium">Spécialités</h4>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers[activeTeamMember].specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-[#023927]/10 text-[#023927] font-medium text-sm border border-[#023927]/20">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center p-4 bg-gray-50 border border-gray-200">
                      <div className="font-inter text-[#023927] text-xl font-semibold">{teamMembers[activeTeamMember].experience}</div>
                      <div className="text-gray-600 text-sm">Expérience</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 border border-gray-200">
                      <div className="font-inter text-[#023927] text-xl font-semibold">{teamMembers[activeTeamMember].properties}</div>
                      <div className="text-gray-600 text-sm">Propriétés</div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center space-x-3 mb-8">
                    <span className="font-inter uppercase text-gray-700 text-sm font-medium">Langues:</span>
                    <div className="flex space-x-2">
                      {teamMembers[activeTeamMember].languages.map((lang, index) => (
                        <span key={index} className="px-3 py-1 bg-[#023927] text-white text-sm font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-gray-600 italic text-lg leading-relaxed">
                      "{teamMembers[activeTeamMember].quote}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member Indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTeamMember(index)}
                  className={`w-2 h-2 transition-all duration-300 ${
                    index === activeTeamMember 
                      ? 'bg-[#023927] scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-inter font-light text-gray-900 mb-4">
              Notre Philosophie
            </h2>
            <div className="h-px bg-gray-200 w-24 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              Fondée sur les principes d'excellence, de discrétion et d'expertise, 
              M² Square Meter réinvente l'immobilier de prestige. Notre approche 
              personnalisée et notre réseau international nous permettent de vous 
              proposer les biens les plus exclusifs et les services les plus raffinés.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {philosophyPrinciples.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-8 border-2 border-gray-100 hover:border-[#023927] transition-all duration-500 group"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-[#023927]/10 flex items-center justify-center border border-[#023927]/20 group-hover:bg-[#023927] group-hover:text-white transition-all duration-500">
                        <IconComponent className="w-7 h-7 text-[#023927] group-hover:text-white transition-colors duration-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-inter text-xl text-gray-900 mb-4 group-hover:text-[#023927] transition-colors duration-500">
                        {principle.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agency;