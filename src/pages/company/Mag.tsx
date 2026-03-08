// src/pages/Mag.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ClockIcon,
  CalendarIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  StarIcon,
  ChartBarIcon,
  HomeModernIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  BookmarkIcon as BookmarkIconSolid,
  FireIcon as FireIconSolid,
} from '@heroicons/react/24/solid';
import { getViewCount, formatViewCount } from '../../utils/articleViews';
import { getReadingTime } from '../../utils/readingTime';
import ShareButton from '../../components/ShareButton';

// ─── WordPress API ────────────────────────────────────────────────────────────
// Development: use local proxy (/setupProxy.js)
// Production: use Vercel serverless function to solve anti-bot challenge
const isProduction = process.env.NODE_ENV === 'production';

// Helper to build WordPress API URLs
const wpUrl = (path: string) => {
  if (isProduction) {
    // Vercel serverless function: /api/wordpress?path=/posts
    return `/api/wordpress?path=${encodeURIComponent(path)}`;
  }
  // Development proxy: /wp-api/posts
  return `/wp-api${path}`;
};

interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    author?: Array<{ name: string; avatar_urls: { '96': string } }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// ─── Derived Article ──────────────────────────────────────────────────────────
interface Article {
  id: number;
  wpSlug: string;
  title: string;
  excerpt: string;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  image: string;
  readTime: string;
  date: string;
  dateRaw: string; // ISO date string for localization
  featured?: boolean;
  trending?: boolean;
  author: string;
  authorImage: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
};

const formatDate = (iso: string, locale: string = 'fr-FR'): string => {
  // Map i18n language codes to date locale codes
  const localeMap: { [key: string]: string } = {
    'fr': 'fr-FR',
    'en': 'en-US',
    'es': 'es-ES',
    'de': 'de-DE',
    'ar': 'ar-MA',
    'ru': 'ru-RU'
  };
  const dateLocale = localeMap[locale] || 'fr-FR';
  return new Date(iso).toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' });
};

const categoryIcon = (slug: string) => {
  switch (slug) {
    case 'marche-immobilier':   return ChartBarIcon;
    case 'tendances':           return MapPinIcon;
    case 'conseils-immobiliers': return StarIcon;
    default:                    return HomeModernIcon;
  }
};

const FALLBACK_IMG =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800';

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="bg-white border-2 border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-200 rounded w-full" />
      <div className="h-5 bg-gray-200 rounded w-4/5" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const Mag: React.FC = () => {
  const { t, i18n: i18nInstance } = useTranslation();

  // Hero
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [isHeroPlaying] = useState(true);

  // UI
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedArticles, setSavedArticles] = useState<number[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // WordPress data
  const [articles, setArticles] = useState<Article[]>([]);
  const [originalArticles, setOriginalArticles] = useState<Article[]>([]);
  const [wpCategories, setWpCategories] = useState<WPCategory[]>([]);
  const [translatedCategoryNames, setTranslatedCategoryNames] = useState<Record<string, string>>({}); // Map of slug -> translated name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState(i18nInstance.language);

  // Hero slides for magazine
  const heroSlides = [
    {
      image: "/mag-1.jpeg",
      title: t('mag.heroSlides.slide1.title'),
      subtitle: t('mag.heroSlides.slide1.subtitle'),
      category: "market"
    },
    {
      image: "/mag-2.jpeg",
      title: t('mag.heroSlides.slide2.title'),
      subtitle: t('mag.heroSlides.slide2.subtitle'),
      category: "architecture"
    },
    {
      image: "/mag-3.jpeg",
      title: t('mag.heroSlides.slide3.title'),
      subtitle: t('mag.heroSlides.slide3.subtitle'),
      category: "investments"
    },
    {
      image: "/mag-4.jpeg",
      title: t('mag.heroSlides.slide1.title'),
      subtitle: t('mag.heroSlides.slide1.subtitle'),
      category: "destinations"
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
  }, [isHeroPlaying, heroSlides.length]);

  const prevHeroSlide = () => setActiveHeroSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length);
  const nextHeroSlide = () => setActiveHeroSlide((p) => (p + 1) % heroSlides.length);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch WordPress data
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [postsRes, catsRes] = await Promise.all([
          fetch(wpUrl('/posts?_embed&per_page=20')),
          fetch(wpUrl('/categories?per_page=50')),
        ]);

        // If either response is not JSON (e.g. WordPress is unavailable and returns HTML),
        // silently show an empty magazine instead of crashing.
        const postsContentType = postsRes.headers.get('content-type') ?? '';
        const catsContentType  = catsRes.headers.get('content-type') ?? '';
        if (!postsContentType.includes('application/json') || !catsContentType.includes('application/json')) {
          throw new Error('WordPress API unreachable (proxy returned non-JSON)');
        }

        if (!postsRes.ok) throw new Error(`Posts fetch failed (${postsRes.status})`);
        if (!catsRes.ok)  throw new Error(`Categories fetch failed (${catsRes.status})`);
        const wpPosts: WPPost[]     = await postsRes.json();
        const cats:    WPCategory[] = await catsRes.json();
        if (cancelled) return;

        const filteredCats = cats.filter((c) => c.slug !== 'uncategorized' && c.count > 0);
        setWpCategories(filteredCats);

        const catMap: Record<number, { name: string; slug: string }> = {};
        cats.forEach((c) => { catMap[c.id] = { name: c.name, slug: c.slug }; });

        const mapped: Article[] = wpPosts.map((post, idx) => {
          const imageUrl    = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? FALLBACK_IMG;
          const authorName  = post._embedded?.author?.[0]?.name ?? 'Square Meter';
          const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'] ?? '';
          const primaryCatId = post.categories[0] ?? 0;
          const cat = catMap[primaryCatId] ?? { name: 'Article', slug: 'article' };
          
          return {
            id:           post.id,
            wpSlug:       post.slug,
            title:        stripHtml(post.title.rendered),
            excerpt:      stripHtml(post.excerpt.rendered).replace(/\[…\]/g, '…'),
            categoryId:   primaryCatId,
            categorySlug: cat.slug,
            categoryName: cat.name,
            image:        imageUrl,
            readTime:     getReadingTime(post.content.rendered, 'fr'),
            date:         formatDate(post.date, 'fr'),
            dateRaw:      post.date, // Store raw ISO date
            featured:     idx === 0,
            trending:     idx >= 1 && idx <= 3,
            author:       authorName,
            authorImage:  authorAvatar,
          };
        });
        setArticles(mapped);
        setOriginalArticles(mapped); // Store originals for translation
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? t('mag.errorLoading'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [t]);

  // Track language changes
  useEffect(() => {
    setCurrentLang(i18nInstance.language);
  }, [i18nInstance.language]);

  // Translate articles when language changes
  useEffect(() => {
    if (originalArticles.length === 0) return;
    
    const translateArticles = async () => {
      // Don't translate if English (original) or French (WordPress is in French)
      if (currentLang === 'en' || currentLang === 'fr') {
        // But still update date formatting for the current locale
        const updatedArticles = originalArticles.map(article => ({
          ...article,
          date: formatDate(article.dateRaw, currentLang)
        }));
        setArticles(updatedArticles);
        setTranslatedCategoryNames({}); // Clear translations
        return;
      }
      
      try {
        const { translateBatch } = await import('../../services/browserTranslationService');
        
        // Get all titles and excerpts to translate
        const titles = originalArticles.map(a => a.title);
        const excerpts = originalArticles.map(a => a.excerpt);
        const categoryNames = originalArticles.map(a => a.categoryName);
        
        // Also get unique category names from wpCategories for tab translation
        const categoryTabNames = wpCategories.map(cat => cat.name);
        
        // Translate in parallel
        const [translatedTitles, translatedExcerpts, translatedCategories, translatedTabNames] = await Promise.all([
          translateBatch(titles, currentLang, 'fr'),
          translateBatch(excerpts, currentLang, 'fr'),
          translateBatch(categoryNames, currentLang, 'fr'),
          translateBatch(categoryTabNames, currentLang, 'fr')
        ]);
        
        // Create translated articles
        const translatedArticles = originalArticles.map((article, index) => ({
          ...article,
          title: translatedTitles[index] || article.title,
          excerpt: translatedExcerpts[index] || article.excerpt,
          categoryName: translatedCategories[index] || article.categoryName,
          date: formatDate(article.dateRaw, currentLang), // Re-format date for current locale
        }));
        
        // Create map of slug -> translated name for category tabs
        const categoryNameMap: Record<string, string> = {};
        wpCategories.forEach((cat, index) => {
          categoryNameMap[cat.slug] = translatedTabNames[index] || cat.name;
        });
        setTranslatedCategoryNames(categoryNameMap);
        
        setArticles(translatedArticles);
        console.log(`✅ Translated ${originalArticles.length} articles to ${currentLang}`);
      } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original articles
        setArticles(originalArticles);
      }
    };
    
    translateArticles();
  }, [currentLang, originalArticles, wpCategories]);

  // Derived data
  const categories = useMemo(() => [
    { key: 'all', label: t('mag.categories.all'), icon: StarIcon, count: articles.length },
    ...wpCategories.map((c) => ({
      key:   c.slug,
      label: translatedCategoryNames[c.slug] || c.name, // Use translated name if available
      icon:  categoryIcon(c.slug),
      count: articles.filter((a) => a.categorySlug === c.slug).length,
    })),
  ], [wpCategories, articles, t, translatedCategoryNames]);

  const filteredArticles = useMemo(() => {
    let list = activeCategory === 'all'
      ? articles
      : articles.filter((a) => a.categorySlug === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.categoryName.toLowerCase().includes(q),
      );
    }
    return list;
  }, [articles, activeCategory, searchQuery]);

  const featuredArticle  = useMemo(() => articles.find((a) => a.featured), [articles]);

  const toggleSave = (id: number) => {
    setSavedArticles((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Matching Properties Page Style */}
      <section className="relative h-[70vh] sm:h-screen overflow-hidden bg-white -mt-24 sm:-mt-32">
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

        {/* Search Bar - Bottom positioned like Home hero buttons */}
          <div className="absolute bottom-44 sm:bottom-36 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('mag.searchPlaceholder')}
                  className="w-full px-6 sm:px-8 py-2.5 sm:py-4 pl-12 sm:pl-14 bg-white/95 backdrop-blur-sm border-2 border-white/50 text-gray-900 placeholder-gray-600 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/30 shadow-2xl text-base sm:text-lg lg:text-xl font-light transition-all duration-300"
                  style={{ borderRadius: '0' }}
                />
                <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                  <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#023927]" />
                </div>
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

        {/* Bottom Gradient removed per request */}
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">

        {/* Error banner */}
        {error && (
          <div className="mb-8 px-6 py-4 bg-red-50 border-2 border-red-200 text-red-700 font-inter text-sm flex items-center gap-3">
            <span className="font-semibold">Erreur :</span> {error}
          </div>
        )}

        {/* Category filter */}
        {!loading && (
          <div className={`flex justify-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-300 ${isScrolled ? 'sticky top-4 z-50 transform scale-95' : ''}`}>
            <div className="bg-white border-2 border-gray-200 p-1 sm:p-2 w-full overflow-x-auto">
              <div className="flex justify-start sm:justify-center gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.key;
                  return (
                    <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                      className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-inter uppercase text-xs sm:text-sm tracking-wide transition-all duration-500 flex items-center space-x-2 sm:space-x-3 border-2 whitespace-nowrap ${
                        isActive ? 'border-[#023927] bg-white text-[#023927]' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900 hover:text-[#023927]'
                      }`}>
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{cat.label}</span>
                      <span className={`px-1.5 sm:px-2 py-0.5 text-xs ${isActive ? 'bg-[#023927]/10 text-[#023927]' : 'bg-gray-100 text-gray-600'}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <>
            <div className="mb-10 bg-white border-2 border-gray-100 overflow-hidden animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 sm:h-80 bg-gray-200" />
                <div className="p-8 sm:p-12 space-y-4">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded w-4/5" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="flex items-center gap-4 mt-6">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="space-y-2"><div className="h-3 bg-gray-200 rounded w-24" /><div className="h-3 bg-gray-200 rounded w-16" /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {!loading && !error && (
          <>
            {/* Featured Article */}
            {featuredArticle && activeCategory === 'all' && !searchQuery && (
              <div className="mb-8 sm:mb-12 lg:mb-16">
                <Link to={`/mag/${featuredArticle.id}`} className="group block">
                  <div className="bg-white border-2 border-gray-200 overflow-hidden group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
                      <div className="relative overflow-hidden h-64 sm:h-80 lg:h-auto">
                        <img src={featuredArticle.image} alt={featuredArticle.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-3 sm:top-6 left-3 sm:left-6 flex flex-col gap-2">
                          <span className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 bg-[#023927] text-white font-inter uppercase text-xs tracking-wide max-w-max">
                            {t('mag.badges.featured')}
                          </span>
                          <span className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 bg-black text-white font-inter uppercase text-xs tracking-wide max-w-max">
                            <FireIconSolid className="w-3 h-3 mr-1 sm:mr-2" />{t('mag.badges.trending')}
                          </span>
                        </div>
                        <button onClick={(e) => { e.preventDefault(); toggleSave(featuredArticle.id); }}
                          className="absolute top-3 sm:top-6 right-3 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300">
                          {savedArticles.includes(featuredArticle.id)
                            ? <BookmarkIconSolid className="w-5 h-5 sm:w-6 sm:h-6 text-[#023927]" />
                            : <BookmarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />}
                        </button>
                      </div>
                      <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6 flex-wrap gap-2">
                          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-gray-300 text-gray-700 font-inter uppercase text-xs tracking-wide">
                            {featuredArticle.categoryName}
                          </span>
                          <div className="flex items-center text-gray-500 font-inter text-xs sm:text-sm">
                            <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{featuredArticle.readTime}
                          </div>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-inter font-light text-gray-900 mb-4 sm:mb-6 leading-tight group-hover:text-[#023927] transition-colors duration-300">
                          {featuredArticle.title}
                        </h2>
                        <p className="font-inter text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed line-clamp-4">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            {featuredArticle.authorImage && (
                              <img src={featuredArticle.authorImage} alt={featuredArticle.author}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover border-2 border-gray-200 rounded-full" />
                            )}
                            <div>
                              <div className="font-inter text-gray-900 text-xs sm:text-sm font-medium">{featuredArticle.author}</div>
                              <div className="font-inter text-gray-500 text-xs flex items-center gap-1.5">
                                <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />{featuredArticle.date}
                                <span className="text-gray-300">·</span>
                                <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />{formatViewCount(getViewCount(featuredArticle.id))}
                              </div>
                            </div>
                          </div>
                          <ShareButton
                            url={`${window.location.origin}/mag/${featuredArticle.id}`}
                            title={featuredArticle.title}
                            description={featuredArticle.excerpt}
                            className="p-2 text-gray-400 hover:text-[#023927] transition-colors duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}



            {/* Section header */}
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-inter font-light text-gray-900 whitespace-nowrap">
                {searchQuery
                  ? t('mag.resultsFor', { query: searchQuery })
                  : activeCategory !== 'all'
                    ? categories.find((c) => c.key === activeCategory)?.label
                    : t('mag.allArticles')}
              </h2>
              <div className="h-px flex-1 bg-gray-200" />
              {(searchQuery || activeCategory !== 'all') && (
                <span className="text-sm text-gray-400 font-inter whitespace-nowrap">
                  {filteredArticles.length} {t('mag.article', { count: filteredArticles.length })}
                </span>
              )}
            </div>

            {/* No results */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="font-inter text-gray-500 text-lg">{t('mag.noResults')}</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="mt-4 text-[#023927] font-inter text-sm hover:underline">
                  {t('mag.resetFilter')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredArticles
                  .filter((a) => !(a.featured && activeCategory === 'all' && !searchQuery))
                  .map((article) => (
                    <div key={article.id}
                      className="group bg-white border-2 border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
                      <Link to={`/mag/${article.id}`}>
                        <div className="relative overflow-hidden h-40 sm:h-48">
                          <img src={article.image} alt={article.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                            <span className="inline-block px-2 sm:px-3 py-1 border-2 border-white/80 bg-black/70 text-white font-inter uppercase text-xs tracking-wide">
                              {article.categoryName}
                            </span>
                          </div>
                          <button onClick={(e) => { e.preventDefault(); toggleSave(article.id); }}
                            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white">
                            {savedArticles.includes(article.id)
                              ? <BookmarkIconSolid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#023927]" />
                              : <BookmarkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />}
                          </button>
                        </div>
                      </Link>
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center text-gray-500 font-inter text-xs sm:text-sm mb-2 sm:mb-3">
                          <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{article.readTime}
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
                          <div className="flex items-center gap-2">
                            {article.authorImage && (
                              <img src={article.authorImage} alt={article.author}
                                className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                            )}
                            <div>
                              <div className="font-inter text-gray-700 text-xs font-medium">{article.author}</div>
                              <div className="font-inter text-gray-400 text-xs flex items-center gap-1.5">
                                <CalendarIcon className="w-3 h-3" />{article.date}
                                <span className="text-gray-300">·</span>
                                <EyeIcon className="w-3 h-3" />{formatViewCount(getViewCount(article.id))}
                              </div>
                            </div>
                          </div>
                          <Link to={`/mag/${article.id}`}
                            className="flex items-center space-x-1 text-[#023927] hover:text-gray-900 transition-colors duration-300 group/rm">
                            <span className="font-inter text-xs sm:text-sm">{t('mag.articlesSection.readMore')}</span>
                            <ArrowRightIcon className="w-4 h-4 transform group-hover/rm:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}



        {/* Properties CTA */}
        <div className="mt-12 sm:mt-16 lg:mt-20 border-2 border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-56 lg:h-auto overflow-hidden">
              <img
                src="/mag-1.jpeg"
                alt="Propriétés Square Meter"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#023927]/40" />
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
              <span className="inline-block mb-4 px-3 py-1.5 border-2 border-[#023927] text-[#023927] font-inter uppercase text-xs tracking-widest max-w-max">
                {t('mag.cta.brandLabel')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-inter font-light text-gray-900 mb-4 leading-snug">
                {t('mag.cta.title')}
              </h3>
              <p className="font-inter text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
                {t('mag.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 bg-[#023927] text-white px-6 py-3 font-inter text-sm uppercase tracking-wide hover:bg-[#023927]/90 transition-colors duration-300 max-w-max">
                  {t('mag.cta.viewProperties')}
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 font-inter text-sm uppercase tracking-wide hover:border-[#023927] hover:text-[#023927] transition-colors duration-300 max-w-max">
                  {t('mag.cta.contactUs')}
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Mag;
