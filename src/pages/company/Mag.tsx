// src/pages/Mag.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClockIcon,
  CalendarIcon,
  EyeIcon,
  BookmarkIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  FireIcon,
  StarIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  HomeModernIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import {
  BookmarkIcon as BookmarkIconSolid,
  StarIcon as StarIconSolid,
  FireIcon as FireIconSolid
} from '@heroicons/react/24/solid';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  date: string;
  featured?: boolean;
  views?: number;
  author?: string;
  authorImage?: string;
  trending?: boolean;
}

const Mag: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState<number[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);

  // Hero slides for magazine
  const heroSlides = [
    {
      image: "https://images.pexels.com/photos/3209049/pexels-photo-3209049.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "L'Art de l'Immobilier",
      subtitle: "Découvrez les tendances 2024 et les analyses exclusives de nos experts",
      category: "market"
    },
    {
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "Architecture & Design",
      subtitle: "Les plus belles réalisations architecturales du moment",
      category: "architecture"
    },
    {
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800",
      title: "Investissements Prestige",
      subtitle: "Stratégies et opportunités pour les portefeuilles d'exception",
      category: "investments"
    }
  ];

  // Hero carousel controls
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isHeroPlaying) {
      slideInterval = setInterval(() => {
        setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [isHeroPlaying]);

  const nextHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setActiveHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Premium article images from Pexels
  const articleImages = [
    "https://images.pexels.com/photos/7031407/pexels-photo-7031407.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800"
  ];

  const articles: Article[] = [
    {
      id: 1,
      title: 'Les Tendances de l\'Immobilier de Luxe 2024',
      excerpt: 'Découvrez les évolutions du marché prestige et les nouvelles attentes des acquéreurs internationaux dans un contexte économique en mutation.',
      category: 'market',
      image: articleImages[0],
      readTime: '5 min',
      date: '15 Jan 2024',
      featured: true,
      views: 2847,
      author: 'Sophie Laurent',
      authorImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      trending: true
    },
    {
      id: 2,
      title: 'Saint-Tropez : Le Nouvel Âge d\'Or',
      excerpt: 'Comment la perle de la Côte d\'Azur continue de séduire les investisseurs les plus exigeants avec des transactions records.',
      category: 'destinations',
      image: articleImages[1],
      readTime: '4 min',
      date: '12 Jan 2024',
      views: 1923,
      author: 'Pierre Dubois',
      authorImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'L\'Art de la Vente Discrète',
      excerpt: 'Les secrets des transactions immobilières confidentielles pour une clientèle d\'exception qui valorise la discrétion absolue.',
      category: 'expertise',
      image: articleImages[2],
      readTime: '6 min',
      date: '8 Jan 2024',
      views: 1567,
      author: 'Marie-Claire de Villiers',
      authorImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      trending: true
    },
    {
      id: 4,
      title: 'Architecture : Le Retour du Classique',
      excerpt: 'Pourquoi les acheteurs premium reviennent aux codes architecturaux traditionnels et aux matériaux nobles.',
      category: 'architecture',
      image: articleImages[3],
      readTime: '7 min',
      date: '5 Jan 2024',
      views: 1342,
      author: 'Jean-Michel Durand'
    },
    {
      id: 5,
      title: 'Conciergerie 5 Étoiles : Le Nouveau Standard',
      excerpt: 'Comment les services sur mesure révolutionnent l\'expérience des propriétaires dans l\'immobilier de prestige.',
      category: 'services',
      image: articleImages[4],
      readTime: '3 min',
      date: '3 Jan 2024',
      views: 987,
      author: 'Thomas Moreau'
    },
    {
      id: 6,
      title: 'Investir dans le Vin : Les Domaines Prestige',
      excerpt: 'Focus sur les vignobles qui attirent les investisseurs les plus avisés et offrent des rendements exceptionnels.',
      category: 'investments',
      image: articleImages[5],
      readTime: '8 min',
      date: '1 Jan 2024',
      views: 2156,
      author: 'Isabelle Renaud',
      trending: true
    }
  ];

  const categories = [
    { key: 'all', label: 'Tous les articles', icon: StarIcon, count: articles.length },
    { key: 'market', label: 'Marché', icon: ChartBarIcon, count: articles.filter(a => a.category === 'market').length },
    { key: 'destinations', label: 'Destinations', icon: MapPinIcon, count: articles.filter(a => a.category === 'destinations').length },
    { key: 'expertise', label: 'Expertise', icon: StarIcon, count: articles.filter(a => a.category === 'expertise').length },
    { key: 'architecture', label: 'Architecture', icon: BuildingStorefrontIcon, count: articles.filter(a => a.category === 'architecture').length },
    { key: 'services', label: 'Services', icon: HomeModernIcon, count: articles.filter(a => a.category === 'services').length },
    { key: 'investments', label: 'Investissements', icon: ChartBarIcon, count: articles.filter(a => a.category === 'investments').length }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const featuredArticle = articles.find(article => article.featured);
  const trendingArticles = articles.filter(article => article.trending);

  const toggleSaveArticle = (articleId: number) => {
    setSavedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Properties Page Style */}
      <section className="relative h-[60vh] sm:h-[70vh] overflow-hidden bg-white">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
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

        {/* Centered Content */}
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6">
          <div className="w-full max-w-4xl text-center">
            <div className="mb-4 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-inter font-light text-white mb-4 sm:mb-6 tracking-tight">
                Le Mag
              </h1>
              <div className="h-1 bg-white/30 w-32 sm:w-48 mx-auto mb-4 sm:mb-8"></div>
              <p className="text-base sm:text-lg lg:text-xl font-inter text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
                L'expertise immobilière de prestige, décryptée par nos spécialistes
              </p>
            </div>

            {/* Search Bar - Like Properties Page */}
            <div className="w-full max-w-2xl mx-auto mt-6 sm:mt-12">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 pl-12 sm:pl-16 bg-white/95 backdrop-blur-sm border-2 border-white/50 text-gray-900 placeholder-gray-600 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/30 shadow-2xl text-sm sm:text-base lg:text-lg font-light transition-all duration-300"
                  style={{ borderRadius: '0' }}
                />
                <div className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2">
                  <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#023927]" />
                </div>
              </div>
              
              {/* Search Suggestions */}
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
                <span className="text-white/90 text-xs sm:text-sm">Catégories :</span>
                {categories.slice(1, 5).map((category) => (
                  <button 
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm hover:text-[#023927] hover:bg-white transition-all duration-500"
                    style={{ borderRadius: '0' }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
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
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroSlide(index)}
                className={`w-2 h-2 transition-all duration-300 ${
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

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Enhanced Categories */}
        <div className={`flex justify-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-300 ${isScrolled ? 'sticky top-4 z-50 transform scale-95' : ''}` }>
          <div className="bg-white border-2 border-gray-200 p-1 sm:p-2 w-full overflow-x-auto">
            <div className="flex justify-start sm:justify-center gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                const isActive = activeCategory === category.key;
                
                return (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-inter uppercase text-xs sm:text-sm tracking-wide transition-all duration-500 flex items-center space-x-2 sm:space-x-3 group border-2 whitespace-nowrap ${
                      isActive
                        ? 'border-[#023927] bg-white text-[#023927]'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-[#023927] hover:bg-white'
                    }`}
                  >
                    <CategoryIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs ${
                      isActive ? 'bg-[#023927]/10 text-[#023927]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Article - Enhanced Clean Design */}
        {featuredArticle && activeCategory === 'all' && (
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <Link to={`/mag/${featuredArticle.id}`} className="group block">
              <div className="bg-white border-2 border-gray-200 overflow-hidden group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
                  <div className="relative overflow-hidden h-64 sm:h-80 lg:h-auto">
                    <img 
                      src={featuredArticle.image} 
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 sm:top-6 left-3 sm:left-6 flex flex-col gap-2">
                      <span className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 bg-[#023927] text-white font-inter uppercase text-xs tracking-wide max-w-max">
                        À la une
                      </span>
                      {featuredArticle.trending && (
                        <span className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 bg-black text-white font-inter uppercase text-xs tracking-wide max-w-max">
                          <FireIconSolid className="w-3 h-3 mr-1 sm:mr-2" />
                          Tendances
                        </span>
                      )}
                    </div>

                    {/* Save Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSaveArticle(featuredArticle.id);
                      }}
                      className="absolute top-3 sm:top-6 right-3 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 group/fav"
                    >
                      {savedArticles.includes(featuredArticle.id) ? (
                        <BookmarkIconSolid className="w-5 h-5 sm:w-6 sm:h-6 text-[#023927]" />
                      ) : (
                        <BookmarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 group-hover/fav:text-[#023927] transition-colors" />
                      )}
                    </button>
                  </div>
                  
                  <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6 flex-wrap gap-2">
                      <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-gray-300 text-gray-700 font-inter uppercase text-xs tracking-wide">
                        {categories.find(c => c.key === featuredArticle.category)?.label}
                      </span>
                      <div className="flex items-center text-gray-500 font-inter text-xs sm:text-sm">
                        <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {featuredArticle.readTime}
                      </div>
                      <div className="flex items-center text-gray-500 font-inter text-xs sm:text-sm">
                        <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {featuredArticle.views}
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-inter font-light text-gray-900 mb-4 sm:mb-6 leading-tight group-hover:text-[#023927] transition-colors duration-300">
                      {featuredArticle.title}
                    </h2>
                    <p className="font-inter text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        {featuredArticle.authorImage && (
                          <img 
                            src={featuredArticle.authorImage} 
                            alt={featuredArticle.author}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover border-2 border-gray-200"
                          />
                        )}
                        <div>
                          <div className="font-inter text-gray-900 text-xs sm:text-sm">{featuredArticle.author}</div>
                          <div className="font-inter text-gray-500 text-xs flex items-center">
                            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {featuredArticle.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button className="p-2 text-gray-400 hover:text-[#023927] transition-colors duration-300">
                          <ShareIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Trending Articles - Clean Design */}
        {activeCategory === 'all' && trendingArticles.length > 0 && (
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-inter font-light text-gray-900 flex items-center space-x-2 sm:space-x-3">
                <span>Articles Tendances</span>
              </h2>
              <div className="h-px flex-1 bg-gray-200 ml-2 sm:ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {trendingArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/mag/${article.id}`}
                  className="group bg-white border-2 border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
                >
                  <div className="relative overflow-hidden h-40 sm:h-48">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-black text-white font-inter uppercase text-xs tracking-wide">
                        <FireIconSolid className="w-3 h-3 mr-1" />
                        Tendances
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="font-inter text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-[#023927] transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="font-inter text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-gray-500 font-inter text-sm">
                      <span>{article.date}</span>
                      <span className="flex items-center space-x-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{article.views}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles Grid - Clean Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredArticles
            .filter(article => !article.featured || activeCategory !== 'all')
            .map((article) => (
              <div
                key={article.id}
                className="group bg-white border-2 border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]"
              >
                <Link to={`/mag/${article.id}`}>
                  <div className="relative overflow-hidden h-40 sm:h-48">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span className="inline-block px-2 sm:px-3 py-1 border-2 border-white/80 bg-black/70 text-white font-inter uppercase text-xs tracking-wide">
                        {categories.find(c => c.key === article.category)?.label}
                      </span>
                    </div>

                    {/* Save Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSaveArticle(article.id);
                      }}
                      className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                    >
                      {savedArticles.includes(article.id) ? (
                        <BookmarkIconSolid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#023927]" />
                      ) : (
                        <BookmarkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </Link>
                
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center text-gray-500 font-inter text-xs sm:text-sm space-x-2 sm:space-x-3">
                      <div className="flex items-center">
                        <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        {article.readTime}
                      </div>
                      {article.views && (
                        <div className="flex items-center">
                          <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {article.views}
                        </div>
                      )}
                    </div>
                  </div>

                  <Link to={`/mag/${article.id}`}>
                    <h3 className="font-inter text-gray-900 text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-[#023927] transition-colors duration-300 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="font-inter text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex items-center text-gray-500 font-inter text-xs sm:text-sm">
                      <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {article.date}
                    </div>
                    <Link 
                      to={`/mag/${article.id}`}
                      className="flex items-center space-x-2 text-[#023927] hover:text-gray-900 transition-colors duration-300 group/readmore"
                    >
                      <span className="font-inter text-sm">Lire</span>
                      <ArrowRightIcon className="w-4 h-4 transform group-hover/readmore:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Newsletter Section - Clean Green & White */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-16 lg:mt-24 bg-[#023927] p-6 sm:p-8 lg:p-12 text-white text-center">
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-inter font-light text-white mb-3 sm:mb-4">
              Restez Informé
            </h3>
            <p className="font-inter text-white/80 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Recevez nos analyses de marché et les tendances du luxe directement dans votre boîte mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="votre.email@exemple.com"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 focus:outline-none focus:border-white font-inter text-white placeholder-white/60 text-sm sm:text-base"
                style={{ borderRadius: '0' }}
              />
              <button
                type="submit"
                className="bg-white text-[#023927] px-6 sm:px-8 py-3 sm:py-4 font-inter hover:bg-gray-100 transition-all duration-500 font-medium border-2 border-white text-sm sm:text-base"
                style={{ borderRadius: '0' }}
              >
                S'abonner
              </button>
            </form>
            <p className="font-inter text-white/60 text-xs sm:text-sm mt-3 sm:mt-4 px-4">
              Désabonnement à tout moment • Données protégées
            </p>
          </div>
        </div>

        {/* Stats Section - Clean */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 text-center">
          {[
            { number: '500+', label: 'Articles Premium' },
            { number: '50K+', label: 'Lecteurs Mensuels' },
            { number: '25+', label: 'Experts' },
            { number: '98%', label: 'Satisfaction' }
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-inter font-light text-[#023927] mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="font-inter text-gray-600 text-xs sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mag;