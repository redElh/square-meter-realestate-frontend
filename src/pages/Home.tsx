// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  HomeModernIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  HeartIcon,
  MapPinIcon,
  CurrencyEuroIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

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

  const clientTestimonials = [
    {
      name: "Aïcha, MRE – Paris",
      text: "Une équipe rare, à l'écoute et d'un professionnalisme exemplaire. Grâce à M² Square Meter, j'ai trouvé bien plus qu'une maison : une expérience humaine.",
    },
    {
      name: "Marc & Hélène, propriétaires à Diabat",
      text: "Une vraie connaissance du marché d'Essaouira, des conseils justes et une bienveillance sincère.",
    },
    {
      name: "Thomas, investisseur – Casablanca",
      text: "Expertise remarquable et accompagnement sur mesure. Une équipe qui comprend les enjeux de l'investissement immobilier de luxe.",
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
      {/* Hero Section - Épurée */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Logo Minimaliste en haut à gauche */}
        <div className="absolute top-8 left-8 z-30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#023927] flex items-center justify-center">
              <span className="text-white font-bold text-xl">M²</span>
            </div>
            <div className="text-white">
              <div className="font-inter uppercase tracking-widest text-sm">SQUARE METER</div>
              <div className="font-serif text-xs text-gray-300">Excellence immobilière</div>
            </div>
          </div>
        </div>

        {/* Contenu Hero - Positionné en bas */}
        <div className="absolute bottom-20 left-0 right-0 z-20">
          <div className="container mx-auto px-6">
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              
              {/* Boutons d'action - Nouveau design */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link 
                  to="/properties?type=buy" 
                  className="group relative bg-white text-gray-900 px-10 py-4 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center min-w-[200px]"
                >
                  <div className="absolute inset-0 bg-[#023927] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                    Acheter
                  </span>
                </Link>
                
                <Link 
                  to="/properties?type=rent" 
                  className="group relative border-2 border-white text-white px-10 py-4 font-inter uppercase tracking-wider transition-all duration-500 overflow-hidden text-center min-w-[200px]"
                >
                  <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative z-10 group-hover:text-gray-900 transition-colors duration-500">
                    Louer
                  </span>
                </Link>
              </div>

              {/* Info de la slide actuelle - Discrète */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-6 bg-black/40 backdrop-blur-sm px-6 py-3">
                  <div className="text-white">
                    <div className="font-inter uppercase tracking-widest text-sm">{heroSlides[activeSlide].title}</div>
                    <div className="font-serif text-xs text-gray-300">{heroSlides[activeSlide].location}</div>
                  </div>
                  <div className="w-px h-6 bg-white/30"></div>
                  <div className="font-serif text-white text-sm font-medium">
                    {heroSlides[activeSlide].price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contrôles Carousel - Positionné en bas à droite */}
        <div className="absolute bottom-8 right-8 z-30 flex items-center space-x-4">
          {/* Navigation Arrows */}
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-300"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-300"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-8 h-1 transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-[#023927]' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors duration-300"
          >
            {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
          </button>
        </div>

        {/* Indicateur de scroll */}
        <div className="absolute bottom-8 left-8 animate-pulse">
          <div className="text-white text-xs font-inter uppercase tracking-widest rotate-[-90deg] origin-left">
            Scroll
          </div>
        </div>
      </section>

      {/* Notre Essence Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-inter uppercase mb-6 text-gray-900 text-center">
              Notre essence
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-8"></div>
            
            <p className="text-xl font-serif text-gray-700 mb-6 leading-relaxed">
              La rigueur de la gestion et la passion de la pierre
            </p>
            
            <div className="space-y-4 text-gray-600 mb-8">
              <p>
                Née de la rencontre de huit années d'expertise dans l'immobilier et de huit années de direction dans la grande distribution, SQUARE METER conjugue discipline, exigence et sensibilité pour offrir bien plus qu'une simple agence.
              </p>
              <p>
                Deux parcours complémentaires, unis par une même conviction :
                <span className="text-[#023927] font-medium"> L'immobilier n'est pas qu'une affaire de biens, c'est une histoire de valeurs.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/properties" 
                className="bg-[#023927] text-white px-8 py-3 font-inter uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-[#023927] hover:border hover:border-[#023927] hover:scale-105 text-center"
              >
                Découvrir nos biens exclusifs
              </Link>
              <Link 
                to="/valuation" 
                className="border border-[#023927] text-[#023927] px-8 py-3 font-inter uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-[#023927] hover:border-[#023927] hover:scale-105 text-center"
              >
                Faire estimer mon bien
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              Sublimer chaque projet, notre mission
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chaque propriétaire, chaque bien, chaque histoire mérite une approche sur mesure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-3 font-medium">
                Transaction Immobilière
              </h3>
              <p className="text-gray-600 group-hover:text-[#023927]">
                La transaction immobilière, avec une stratégie de mise en valeur et de diffusion haut de gamme.
              </p>
            </div>
            
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-3 font-medium">
                Location Longue Durée
              </h3>
              <p className="text-gray-600 group-hover:text-[#023927]">
                La location longue durée, avec une gestion rigoureuse et transparente.
              </p>
            </div>
            
            <div className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-3 font-medium">
                Location Saisonnière
              </h3>
              <p className="text-gray-600 group-hover:text-[#023927]">
                La location saisonnière, pensée comme une expérience de séjour complète et harmonieuse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              Propriétés d'Exception
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez une sélection de biens prestigieux soigneusement choisis pour leur caractère unique, 
              leur architecture remarquable et leur situation exclusive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  {property.exclusive && (
                    <div className="absolute top-4 right-4 bg-[#023927] text-white px-3 py-1 font-inter uppercase text-xs font-medium">
                      EXCLUSIF
                    </div>
                  )}
                </div>

                  <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg font-medium">
                      {property.title}
                    </h3>
                    <span className="font-serif text-[#023927] font-semibold">
                      {property.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="font-serif">{property.location}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-100 pt-4 mb-4">
                    <div className="text-center">
                      <div className="font-inter text-gray-900 font-medium">{property.beds}</div>
                      <div className="text-gray-600 text-sm">Chambres</div>
                    </div>
                    <div className="text-center">
                      <div className="font-inter text-gray-900 font-medium">{property.baths}</div>
                      <div className="text-gray-600 text-sm">SDB</div>
                    </div>
                    <div className="text-center">
                      <div className="font-inter text-gray-900 font-medium">{property.area}</div>
                      <div className="text-gray-600 text-sm">Surface</div>
                    </div>
                  </div>

                  <button className="w-full bg-[#023927] text-white py-3 font-inter uppercase tracking-wide hover:bg-white hover:text-[#023927] hover:border hover:border-[#023927] transition-colors duration-300 transform hover:scale-[1.02]">
                    Découvrir
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/properties" 
              className="inline-flex items-center space-x-2 border border-gray-900 text-gray-900 px-8 py-3 font-inter uppercase tracking-wide hover:bg-white hover:text-[#023927] hover:border-[#023927] transition-all duration-300"
            >
              <span>Explorer notre collection</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              Ce que nos clients disent de nous
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-gray-600">Reprendre nos avis sur Google</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {clientTestimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-[#023927] text-5xl mb-4">"</div>
                <p className="text-gray-600 italic mb-6 leading-relaxed text-lg">
                  {testimonial.text}
                </p>
                <p className="font-inter text-gray-900 font-medium border-t border-gray-100 pt-4">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              Nos valeurs, nos racines, notre vision
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium">
                  Exigence
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927]">
                  Offrir une qualité de service irréprochable.
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium">
                  Humanité
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927]">
                  Placer la relation au centre de chaque mission.
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium">
                  Innovation
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927]">
                  Mettre la technologie au service de l'expérience.
                </p>
              </div>
              
              <div className="p-6 border border-gray-100 hover:border-[#023927] transition-colors duration-300 group">
                <h3 className="font-inter uppercase text-gray-900 group-hover:text-[#023927] text-lg mb-2 font-medium">
                  Responsabilité
                </h3>
                <p className="text-gray-600 group-hover:text-[#023927]">
                  Redonner à Essaouira ce qu'elle nous inspire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter uppercase text-gray-900 mb-4">
              Prêt à concrétiser votre projet ?
            </h2>
            <div className="w-16 h-0.5 bg-[#023927] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Que vous soyez propriétaire, acquéreur ou investisseur,
              nous serons ravis de vous accompagner à Essaouira et dans sa province.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-inter uppercase text-gray-900 mb-6">
                  Notre agence
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-inter text-gray-900 font-medium mb-1">Adresse</h4>
                    <p className="text-gray-600">Essaouira – Maroc</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-inter text-gray-900 font-medium mb-1">Horaires</h4>
                    <p className="text-gray-600">Sur rendez-vous</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-inter text-gray-900 font-medium mb-1">Email</h4>
                    <p className="text-gray-600">essaouira@m2squaremeter.com</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-inter text-gray-900 font-medium mb-1">Téléphone</h4>
                    <p className="text-gray-600">+212 (0)7 00 000 644</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-2xl font-inter uppercase text-gray-900 mb-2">
                    SQUARE METER
                  </h3>
                  <p className="text-[#023927] italic">
                    La rigueur de la gestion. La passion de la pierre. Et la noblesse du nécessaire.
                  </p>
                </div>
                
                <Link 
                  to="/contact" 
                  className="bg-[#023927] text-white py-4 font-inter uppercase tracking-wide hover:bg-white hover:text-[#023927] hover:border hover:border-[#023927] transition-all duration-300 transform hover:scale-[1.02] text-center text-lg"
                >
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "250+", label: "Propriétés exclusives" },
              { number: "15", label: "Années d'expertise" },
              { number: "98%", label: "Clients satisfaits" },
              { number: "12", label: "Pays desservis" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl font-inter text-[#023927] font-light mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
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