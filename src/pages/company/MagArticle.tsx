// src/pages/company/MagArticle.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  BookmarkIcon,
  ShareIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  HomeModernIcon,
  ChartBarIcon,
  MapPinIcon,
  StarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { incrementViewCount, getViewCount, formatViewCount } from '../../utils/articleViews';

// ─── WordPress proxy ──────────────────────────────────────────────────────────
const WP_BASE = '/wp-api';

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
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text?: string }>;
    author?: Array<{ name: string; avatar_urls: { '96': string }; description: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

interface RelatedArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  categoryName: string;
  readTime: string;
}

interface TocEntry { id: string; text: string; level: number }

const FALLBACK_IMG =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200';

const stripHtml = (html: string): string => {
  const d = document.createElement('div');
  d.innerHTML = html;
  return (d.textContent || d.innerText || '').trim();
};

const calcReadTime = (html: string): string => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const categoryIcon = (slug: string) => {
  switch (slug) {
    case 'marche-immobilier':    return ChartBarIcon;
    case 'tendances':            return MapPinIcon;
    case 'conseils-immobiliers': return StarIcon;
    default:                     return HomeModernIcon;
  }
};

/**
 * Converts <p> tags whose text starts with an emoji into <h2> tags,
 * stripping the leading emoji so pagination can split on them.
 */
function convertEmojiParasToH2(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  div.querySelectorAll('p').forEach((p) => {
    const text = p.textContent?.trim() ?? '';
    const cp = text.codePointAt(0) ?? 0;
    // Misc Symbols 0x2600-0x27BF, Supplementary emoji 0x1F000+
    if ((cp >= 0x2600 && cp <= 0x27BF) || cp >= 0x1F000) {
      const h2 = document.createElement('h2');
      // Supplementary-plane emoji (U+1F000+) are 2 UTF-16 units; BMP emoji are 1
      const emojiLen = cp > 0xFFFF ? 2 : 1;
      h2.textContent = text.slice(emojiLen).trimLeft();
      p.replaceWith(h2);
    }
  });
  return div.innerHTML;
}

/** Inject heading IDs and build a flat TOC from a single HTML string. */
function processContent(html: string): { content: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const div = document.createElement('div');
  div.innerHTML = html;
  let idx = 0;
  div.querySelectorAll('h2, h3').forEach((h) => {
    const id = `heading-${idx}`;
    h.id = id;
    toc.push({ id, text: h.textContent?.trim() ?? '', level: parseInt(h.tagName[1]) });
    idx++;
  });
  return { content: div.innerHTML, toc };
}

// ─── Component ────────────────────────────────────────────────────────────────
const MagArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Data
  const [post, setPost]       = useState<WPPost | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Content
  const [processedContent, setProcessedContent] = useState('');
  const [toc, setToc]                           = useState<TocEntry[]>([]);

  // UI
  const [saved, setSaved]                 = useState(false);
  const [readProgress, setReadProgress]   = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeToc, setActiveToc]         = useState<string>('');
  const [viewCount, setViewCount]         = useState(0);

  const contentRef  = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll: progress + back-to-top + active TOC
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackToTop(scrollTop > 400);
      if (contentRef.current) {
        const headings = contentRef.current.querySelectorAll('h2[id], h3[id]');
        let active = '';
        headings.forEach((h) => {
          if (h.getBoundingClientRect().top <= 160) active = h.id;
        });
        if (active) setActiveToc(active);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch post + related
  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${WP_BASE}/posts/${id}?_embed`);
        const ct  = res.headers.get('content-type') ?? '';
        if (!ct.includes('application/json')) throw new Error('API unavailable');
        if (!res.ok) throw new Error(`Post non trouvé (${res.status})`);
        const data: WPPost = await res.json();
        setPost(data);

        // Process content: emoji → h2, inject IDs, build TOC
        const preprocessed = convertEmojiParasToH2(data.content.rendered);
        const { content: c, toc: t } = processContent(preprocessed);
        setProcessedContent(c);
        setToc(t);

        // View counter
        const count = incrementViewCount(data.id);
        setViewCount(count);

        // Related posts
        const catId = data.categories[0];
        if (catId) {
          const rr  = await fetch(`${WP_BASE}/posts?_embed&per_page=3&categories=${catId}&exclude=${id}`);
          const rct = rr.headers.get('content-type') ?? '';
          if (rct.includes('application/json') && rr.ok) {
            const rp: WPPost[] = await rr.json();
            setRelated(rp.map((p) => ({
              id:           p.id,
              title:        stripHtml(p.title.rendered),
              excerpt:      stripHtml(p.excerpt.rendered).replace(/\[…\]/g, '…'),
              image:        p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? FALLBACK_IMG,
              date:         formatDate(p.date),
              categoryName: p._embedded?.['wp:term']?.[0]?.[0]?.name ?? '',
              readTime:     calcReadTime(p.content.rendered),
            })));
          }
        }
      } catch (err: any) {
        setError(err.message ?? 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && post) {
      await navigator.share({ title: stripHtml(post.title.rendered), url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  // Derived values
  const heroImage     = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? FALLBACK_IMG;
  const authorName    = post?._embedded?.author?.[0]?.name ?? 'Square Meter';
  const authorAvatar  = post?._embedded?.author?.[0]?.avatar_urls?.['96'] ?? '';
  const authorBio     = post?._embedded?.author?.[0]?.description ?? '';
  const category      = post?._embedded?.['wp:term']?.[0]?.[0];
  const CategoryIcon  = category ? categoryIcon(category.slug) : HomeModernIcon;
  const readTime      = post ? calcReadTime(post.content.rendered) : '';
  const dateFormatted = post ? formatDate(post.date) : '';
  const title         = post ? stripHtml(post.title.rendered) : '';


  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-[70vh] sm:h-screen bg-gray-200 animate-pulse" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-full" />
              <div className="h-10 bg-gray-200 rounded w-3/4" />
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className={`h-4 bg-gray-100 rounded ${i % 5 === 4 ? 'w-1/2' : 'w-full'}`} />
              ))}
            </div>
            <div className="hidden lg:block space-y-4">
              <div className="h-48 bg-gray-100 rounded" />
              <div className="h-32 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR ──────────────────────────────────────────────────────────────────
  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl font-inter font-light text-gray-200 mb-4">!</div>
          <h2 className="text-2xl font-inter font-light text-gray-900 mb-3">Article introuvable</h2>
          <p className="font-inter text-gray-500 text-sm mb-8">{error}</p>
          <Link to="/mag"
            className="inline-flex items-center gap-2 bg-[#023927] text-white px-6 py-3 font-inter text-sm uppercase tracking-wide hover:bg-[#023927]/90 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Retour au magazine
          </Link>
        </div>
      </div>
    );
  }

  // RENDER
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO (full-screen, matching homepage) ──────────────────────── */}
      <div className="relative h-[70vh] sm:h-screen overflow-hidden -mt-24 sm:-mt-32">
        <img src={heroImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        {/* Top-left: back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-44 sm:top-52 left-4 sm:left-10 flex items-center gap-2 text-white/80 hover:text-white font-inter text-sm uppercase tracking-wide transition-all duration-300 group"
        >
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Magazine
        </button>

        {/* Top-right: views + bookmark + share */}
        <div className="absolute top-44 sm:top-52 right-4 sm:right-10 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm border border-white/20 text-white font-inter text-xs">
            <EyeIcon className="w-3.5 h-3.5" />{formatViewCount(viewCount)}
          </div>
          <button onClick={() => setSaved(!saved)}
            className="w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
            {saved ? <BookmarkIconSolid className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
          </button>
          <button onClick={handleShare}
            className="w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom meta */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
          <div className="max-w-4xl">
            {category && (
              <div className="flex items-center gap-2 mb-4">
                <CategoryIcon className="w-4 h-4 text-white/70" />
                <span className="font-inter uppercase text-xs tracking-widest text-white/70">{category.name}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-inter font-light text-white leading-tight mb-5 max-w-3xl">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/70 font-inter text-xs sm:text-sm">
              {authorAvatar && (
                <img src={authorAvatar} alt={authorName}
                  className="w-8 h-8 rounded-full border-2 border-white/40 object-cover" />
              )}
              <span className="text-white/90 font-medium">{authorName}</span>
              <span className="flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5" />{dateFormatted}</span>
              <span className="flex items-center gap-1.5"><ClockIcon className="w-3.5 h-3.5" />{readTime} de lecture</span>
              <span className="flex items-center gap-1.5"><EyeIcon className="w-3.5 h-3.5" />{formatViewCount(viewCount)} vues</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY PROGRESS BAR ─────────────────────────────────────────── */}
      <div ref={progressRef} className="sticky top-24 sm:top-32 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center gap-4 py-2.5">
            <span className="font-inter text-gray-700 text-sm truncate flex-1 hidden sm:block">{title}</span>
            <span className="flex items-center gap-1.5 font-inter text-gray-500 text-xs whitespace-nowrap">
              <EyeIcon className="w-3.5 h-3.5" />{formatViewCount(viewCount)}
            </span>
            <span className="font-inter text-[#023927] text-xs font-medium whitespace-nowrap">{Math.round(readProgress)}%</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
          <div className="h-full bg-[#023927] transition-all duration-150" style={{ width: `${readProgress}%` }} />
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 xl:gap-20">

          {/* ── CONTENT ─────────────────────────────────────────────────── */}
          <div>
            <p className="text-base sm:text-lg font-inter text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-100 italic font-light">
              {stripHtml(post.excerpt.rendered).replace(/\[…\]/g, '…')}
            </p>

            <div ref={contentRef} className="wp-article-content"
              dangerouslySetInnerHTML={{ __html: processedContent }} />

            {category && (
                  <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <CategoryIcon className="w-4 h-4 text-[#023927]" />
                    <button onClick={() => navigate('/mag')}
                      className="px-3 py-1.5 border-2 border-[#023927] text-[#023927] font-inter text-xs uppercase tracking-wide hover:bg-[#023927] hover:text-white transition-colors duration-300">
                      {category.name}
                    </button>
                  </div>
                )}
                <div className="mt-10 p-6 sm:p-8 bg-gray-50 border-l-4 border-[#023927] flex gap-5 items-start">
                  {authorAvatar && (
                    <img src={authorAvatar} alt={authorName}
                      className="w-14 h-14 rounded-full border-2 border-white shadow object-cover flex-shrink-0" />
                  )}
                  <div>
                    <div className="font-inter text-gray-900 font-medium mb-1">{authorName}</div>
                    <p className="font-inter text-gray-500 text-sm leading-relaxed">
                      {authorBio || 'Rédacteur pour Square Meter Immobilier — analyses de marché, conseils et tendances immobilières.'}
                    </p>
                  </div>
                </div>
                {related.length > 0 && (
                  <div className="mt-14">
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-xl font-inter font-light text-gray-900 whitespace-nowrap">À lire aussi</h2>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {related.map((r) => (
                        <Link key={r.id} to={`/mag/${r.id}`}
                          className="group bg-white border-2 border-gray-200 overflow-hidden hover:border-[#023927] transition-all duration-500 hover:shadow-lg">
                          <div className="relative h-36 overflow-hidden">
                            <img src={r.image} alt={r.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            {r.categoryName && (
                              <span className="absolute bottom-2 left-3 px-2 py-0.5 bg-black/70 text-white font-inter text-xs uppercase tracking-wide">{r.categoryName}</span>
                            )}
                            <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/60 text-white font-inter text-xs">
                              <EyeIcon className="w-3 h-3" />{formatViewCount(getViewCount(r.id))}
                            </span>
                          </div>
                          <div className="p-4">
                            <h3 className="font-inter text-gray-900 text-sm font-medium line-clamp-2 mb-2 group-hover:text-[#023927] transition-colors duration-300 leading-snug">{r.title}</h3>
                            <div className="flex items-center justify-between text-gray-400 font-inter text-xs">
                              <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{r.date}</span>
                              <span className="flex items-center gap-1 text-[#023927]">Lire <ArrowRightIcon className="w-3 h-3" /></span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-14 pt-8 border-t border-gray-100">
                  <Link to="/mag"
                    className="inline-flex items-center gap-2 text-[#023927] font-inter text-sm uppercase tracking-wide group hover:gap-3 transition-all duration-300">
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    Retour au magazine
                  </Link>
                </div>
          </div>

          {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
          <aside className="hidden lg:block self-start sticky top-48">
            <div className="space-y-6">
              {toc.length > 0 && (
                <div className="border-2 border-gray-100 p-5">
                  <div className="font-inter uppercase text-xs tracking-widest text-gray-400 mb-3">Sur cette page</div>
                  <nav className="space-y-0.5 max-h-56 overflow-y-auto">
                    {toc.map((entry) => (
                      <button key={entry.id}
                        onClick={() => document.getElementById(entry.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className={`w-full text-left font-inter text-sm py-1.5 border-l-2 pl-3 transition-colors duration-200
                          ${entry.level === 3 ? 'pl-6 text-xs' : ''}
                          ${activeToc === entry.id ? 'border-[#023927] text-[#023927]' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}>
                        {entry.text}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
              <div className="border-2 border-gray-100 p-5 flex items-center gap-3">
                <EyeIcon className="w-5 h-5 text-[#023927] shrink-0" />
                <div>
                  <div className="font-inter text-xl text-[#023927] font-light">{formatViewCount(viewCount)}</div>
                  <div className="font-inter text-gray-400 text-xs uppercase tracking-wide">lectures</div>
                </div>
              </div>
              <div className="bg-[#023927] p-5 text-white">
                <div className="font-inter uppercase text-xs tracking-widest text-white/50 mb-2">Square Meter</div>
                <p className="font-inter font-light text-sm leading-relaxed mb-4 text-white/90">
                  Découvrez nos propriétés d'exception au Maroc et à l'international.
                </p>
                <Link to="/properties"
                  className="inline-flex items-center gap-2 bg-white text-[#023927] px-4 py-2 font-inter text-xs uppercase tracking-wide hover:bg-gray-100 transition-colors duration-300">
                  Voir les biens <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-11 h-11 bg-[#023927] text-white flex items-center justify-center shadow-lg hover:bg-[#023927]/90 transition-all duration-300 z-40">
          <ChevronUpIcon className="w-5 h-5" />
        </button>
      )}

      {/* Article content styles */}
      <style>{`
        .wp-article-content {
          font-family: 'Inter', sans-serif;
          color: #1a1a1a;
          line-height: 1.85;
          font-size: 1rem;
        }
        .wp-article-content h2 {
          font-size: 1.5rem;
          font-weight: 300;
          color: #023927;
          margin: 2.5rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
          scroll-margin-top: 100px;
        }
        .wp-article-content h3 {
          font-size: 1.15rem;
          font-weight: 500;
          color: #111827;
          margin: 2rem 0 0.75rem;
          scroll-margin-top: 100px;
        }
        .wp-article-content p {
          margin-bottom: 1.4rem;
          color: #374151;
        }
        .wp-article-content a {
          color: #023927;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .wp-article-content a:hover { color: #111827; }
        .wp-article-content ul, .wp-article-content ol {
          margin: 1.25rem 0 1.25rem 1.5rem;
        }
        .wp-article-content ul { list-style-type: disc; }
        .wp-article-content ol { list-style-type: decimal; }
        .wp-article-content li { margin-bottom: 0.5rem; color: #374151; }
        .wp-article-content blockquote {
          border-left: 4px solid #023927;
          margin: 2rem 0;
          padding: 1rem 1.5rem;
          background: #f0faf5;
          font-style: italic;
          color: #374151;
        }
        .wp-article-content blockquote p { margin-bottom: 0; }
        .wp-article-content img {
          width: 100%;
          height: auto;
          margin: 1.5rem 0;
          display: block;
        }
        .wp-article-content figure { margin: 2rem 0; }
        .wp-article-content figcaption {
          text-align: center;
          font-size: 0.8rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }
        .wp-article-content strong { font-weight: 600; color: #111827; }
        .wp-article-content em { font-style: italic; }
        .wp-article-content code {
          background: #f3f4f6;
          padding: 0.1em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        .wp-article-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1.25rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .wp-article-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2.5rem 0;
        }
        .wp-article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9rem;
        }
        .wp-article-content th {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 500;
          color: #111827;
        }
        .wp-article-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1rem;
          color: #374151;
        }
        .wp-article-content tr:nth-child(even) td { background: #f9fafb; }
      `}</style>
    </div>
  );
};

export default MagArticle;
