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
  SparklesIcon,
  ArrowRightIcon,
  FireIcon,
  StarIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  HomeModernIcon,
  MapPinIcon
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
    { key: 'all', label: 'Tous les articles', icon: SparklesIcon, count: articles.length },
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
    <div className="min-h-screen bg-gradient-to-br from-ivory via-white to-amber-50 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Enhanced Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-9xl font-didot">M²</div>
          </div>
          <h1 className="text-6xl md:text-7xl font-inter uppercase text-deep-green mb-6 relative">
            Le Mag
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-amber-600 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl font-didot text-gray-700 max-w-4xl mx-auto leading-relaxed">
            L'actualité de l'immobilier de prestige, les tendances du luxe 
            et les conseils d'experts pour vos projets d'exception.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold transition-colors duration-300" />
            <input
              type="text"
              placeholder="Rechercher un article, une tendance, un expert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot text-lg transition-all duration-300 hover:border-gold"
            />
          </div>
        </div>

        {/* Enhanced Categories */}
        <div className={`flex justify-center mb-16 transition-all duration-300 ${isScrolled ? 'sticky top-4 z-50 transform scale-95' : ''}`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-gold/20">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                const isActive = activeCategory === category.key;
                
                return (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`px-6 py-4 font-inter uppercase text-sm tracking-wide transition-all duration-500 rounded-xl flex items-center space-x-3 group ${
                      isActive
                        ? 'bg-gradient-to-r from-gold to-amber-600 text-deep-green shadow-lg transform scale-105'
                        : 'text-deep-green hover:bg-gold/10 hover:text-gold'
                    }`}
                  >
                    <CategoryIcon className="w-4 h-4" />
                    <span>{category.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs transition-all duration-300 ${
                      isActive ? 'bg-deep-green text-ivory' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Article - Enhanced */}
        {featuredArticle && activeCategory === 'all' && (
          <div className="mb-20">
            <Link to={`/mag/${featuredArticle.id}`} className="group block">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gold/20 hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
                  <div className="relative overflow-hidden h-96 lg:h-auto">
                    <img 
                      src={featuredArticle.image} 
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Featured Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gold to-amber-600 text-deep-green font-inter uppercase text-sm tracking-wide rounded-full shadow-lg">
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Article à la une
                      </span>
                    </div>

                    {/* Trending Badge */}
                    {featuredArticle.trending && (
                      <div className="absolute top-6 right-6">
                        <span className="inline-flex items-center px-4 py-2 bg-red-500 text-ivory font-inter uppercase text-sm tracking-wide rounded-full shadow-lg">
                          <FireIconSolid className="w-4 h-4 mr-2" />
                          Tendances
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-12 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="inline-block px-4 py-2 bg-ivory text-deep-green font-inter uppercase text-xs tracking-wide rounded-full border border-gold/30">
                        {categories.find(c => c.key === featuredArticle.category)?.label}
                      </span>
                      <div className="flex items-center text-gray-500 font-didot text-sm">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {featuredArticle.readTime}
                      </div>
                      <div className="flex items-center text-gray-500 font-didot text-sm">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        {featuredArticle.views}
                      </div>
                    </div>

                    <h2 className="text-4xl font-inter uppercase text-deep-green mb-6 leading-tight group-hover:text-gold transition-colors duration-300">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-xl font-didot text-gray-700 mb-8 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {featuredArticle.authorImage && (
                          <img 
                            src={featuredArticle.authorImage} 
                            alt={featuredArticle.author}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gold"
                          />
                        )}
                        <div>
                          <div className="font-inter text-deep-green text-sm">{featuredArticle.author}</div>
                          <div className="font-didot text-gray-500 text-sm flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {featuredArticle.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSaveArticle(featuredArticle.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gold transition-colors duration-300"
                        >
                          {savedArticles.includes(featuredArticle.id) ? (
                            <BookmarkIconSolid className="w-5 h-5" />
                          ) : (
                            <BookmarkIcon className="w-5 h-5" />
                          )}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gold transition-colors duration-300">
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

        {/* Trending Articles */}
        {activeCategory === 'all' && trendingArticles.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-inter uppercase text-deep-green flex items-center space-x-3">
                <FireIconSolid className="w-8 h-8 text-red-500" />
                <span>Articles Tendances</span>
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/mag/${article.id}`}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gold/20 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 bg-red-500 text-ivory font-inter uppercase text-xs tracking-wide rounded-full">
                        <FireIconSolid className="w-3 h-3 mr-1" />
                        Tendances
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-inter uppercase text-deep-green text-lg mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="font-didot text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-gray-500 font-didot text-sm">
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

        {/* Articles Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles
            .filter(article => !article.featured || activeCategory !== 'all')
            .map((article) => (
              <div
                key={article.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gold/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <Link to={`/mag/${article.id}`}>
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-ivory text-deep-green font-inter uppercase text-xs tracking-wide rounded-full border border-gold/30">
                        {categories.find(c => c.key === article.category)?.label}
                      </span>
                    </div>

                    {/* Save Button */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSaveArticle(article.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold"
                    >
                      {savedArticles.includes(article.id) ? (
                        <BookmarkIconSolid className="w-4 h-4 text-deep-green" />
                      ) : (
                        <BookmarkIcon className="w-4 h-4 text-ivory" />
                      )}
                    </button>
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-500 font-didot text-sm space-x-3">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </div>
                      {article.views && (
                        <div className="flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {article.views}
                        </div>
                      )}
                    </div>
                  </div>

                  <Link to={`/mag/${article.id}`}>
                    <h3 className="font-inter uppercase text-deep-green text-xl mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <p className="font-didot text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                    <div className="flex items-center text-gray-500 font-didot text-sm">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {article.date}
                    </div>
                    <Link 
                      to={`/mag/${article.id}`}
                      className="flex items-center space-x-2 text-gold hover:text-deep-green transition-colors duration-300 group/readmore"
                    >
                      <span className="font-inter uppercase text-sm">Lire</span>
                      <ArrowRightIcon className="w-4 h-4 transform group-hover/readmore:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Enhanced Newsletter */}
        <div className="max-w-4xl mx-auto mt-24 bg-gradient-to-br from-deep-green to-forest-green rounded-3xl shadow-2xl p-12 text-ivory text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="relative z-10">
            <SparklesIcon className="w-16 h-16 text-gold mx-auto mb-6" />
            <h3 className="text-4xl font-inter uppercase text-gold mb-4">
              L'Excellence en Exclusivité
            </h3>
            <p className="text-xl font-didot text-ivory/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Recevez en avant-première nos analyses de marché, 
              les tendances du luxe et les conseils de nos experts.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="votre.email@exemple.com"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-gold/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold font-didot text-ivory placeholder-ivory/60"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-gold to-amber-600 text-deep-green px-8 py-4 font-inter uppercase tracking-wide hover:from-amber-500 hover:to-gold transition-all duration-500 transform hover:scale-105 rounded-2xl font-semibold"
              >
                S'abonner
              </button>
            </form>
            <p className="font-didot text-ivory/60 text-sm mt-4">
              Désabonnement à tout moment • Données protégées
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 text-center">
          {[
            { number: '500+', label: 'Articles Premium' },
            { number: '50K+', label: 'Lecteurs Mensuels' },
            { number: '25+', label: 'Experts' },
            { number: '98%', label: 'Satisfaction' }
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="text-3xl lg:text-4xl font-inter text-gold mb-2 transform group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="font-didot text-gray-600 text-sm">
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