import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HeartIcon,
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import type { Property } from '../services/apimoService';

const AUTO_ADVANCE_MS = 4500;
const SWIPE_THRESHOLD_PX = 45;

interface PropertyListingCardProps {
  property: Property;
  statusLabel: string;
  sold: boolean;
  exclusive: boolean;
  priceLabel: string;
  priceCaption: string;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onOpenGallery: (images: string[], title: string, index: number) => void;
  onNavigate?: () => void;
}

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({
  property,
  statusLabel,
  sold,
  exclusive,
  priceLabel,
  priceCaption,
  isFavorite,
  onToggleFavorite,
  onOpenGallery,
  onNavigate,
}) => {
  const { t } = useTranslation();

  const images = property.images || [];
  const count = images.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Clamp so the carousel can never point past the available images.
  const safeIndex = count > 0 ? Math.min(index, count - 1) : 0;

  const step = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setIndex((current) => {
        const base = Math.min(current, count - 1);
        return ((base + delta) % count + count) % count;
      });
    },
    [count]
  );

  // Automatic swipe between photos. Paused on hover/focus and skipped entirely
  // for visitors who asked for reduced motion.
  useEffect(() => {
    if (count <= 1 || paused) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => {
        const base = Math.min(current, count - 1);
        return (base + 1) % count;
      });
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  const hasCarousel = count > 1;

  const openGalleryAt = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenGallery(images, property.title, i);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start == null || end == null) return;
    const delta = end - start;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    step(delta < 0 ? 1 : -1);
  };

  return (
    <Link
      to={`/properties/${property.id}`}
      onClick={onNavigate}
      className="group relative block bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-gray-200 hover:shadow-[0_24px_64px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-700"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A97E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Single photo area with carousel */}
      <div
        className="relative h-[300px] sm:h-[340px] lg:h-[380px] overflow-hidden bg-gray-50"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <img
              key={`${img}-${i}`}
              src={img}
              alt={`${property.title} — ${i + 1}`}
              loading="lazy"
              className="w-full h-full shrink-0 object-cover"
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-14 z-10 flex items-center gap-2 flex-wrap">
          {exclusive && (
            <span className="inline-flex items-center gap-1.5 bg-white/92 backdrop-blur-xl border border-[#C8A97E]/25 px-2.5 sm:px-3 py-1 text-[10px] tracking-[0.18em] uppercase font-semibold text-[#023927] shadow-sm">
              <span className="w-1 h-1 rounded-full bg-[#C8A97E]"></span>
              {t('properties.listing.exclusive')}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[10px] tracking-[0.14em] uppercase font-medium backdrop-blur-xl border shadow-sm ${
              sold ? 'bg-gray-900 text-white border-gray-800' : 'bg-white/90 text-gray-700 border-white/60'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${sold ? 'bg-gray-400' : 'bg-emerald-500'}`}></span>
            {statusLabel}
          </span>
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 group/fav"
        >
          {isFavorite ? (
            <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover/fav:text-red-500 transition-colors" />
          )}
        </button>

        {/* Carousel arrows — centred on the sides, revealed on hover (always visible on touch) */}
        {hasCarousel && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex items-center justify-center text-gray-700 hover:bg-white hover:text-[#023927] hover:scale-105 active:scale-95 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
            >
              <ChevronLeftIcon className="w-4 h-4 sm:w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex items-center justify-center text-gray-700 hover:bg-white hover:text-[#023927] hover:scale-105 active:scale-95 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
            >
              <ChevronRightIcon className="w-4 h-4 sm:w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom: photo counter */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 flex items-end justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/15 text-white px-2.5 py-1 text-[11px] tracking-wide shadow-sm">
            <CameraIcon className="w-3.5 h-3.5 opacity-80" />
            <span>{count} {t('properties.listing.photos')}</span>
          </div>
        </div>

        {/* Click the photo to open the full gallery */}
        <button
          onClick={(e) => openGalleryAt(e, safeIndex)}
          aria-label="Open photo gallery"
          className="absolute inset-0 z-[5] cursor-zoom-in"
        ></button>
      </div>

      {/* Content */}
      <div className="px-5 sm:px-7 lg:px-8 pt-6 sm:pt-7 pb-6 sm:pb-7">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 lg:gap-8">
          <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="hidden sm:block w-px self-stretch bg-gradient-to-b from-[#C8A97E] via-[#C8A97E]/30 to-transparent shrink-0"></div>
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-[19px] sm:text-[21px] lg:text-[23px] leading-[1.02] tracking-[-0.025em] font-light text-gray-900 truncate group-hover:text-[#023927] transition-colors duration-500">
                {property.title}
              </h3>

              <div className="mt-2 text-[12px] sm:text-[13px] text-gray-500">
                <span className="truncate font-light">— {property.location}</span>
              </div>

              <div className="mt-3.5 flex items-center gap-2.5 sm:gap-3.5 text-[11px] tracking-[0.16em] uppercase font-medium text-gray-500">
                <span>{property.rooms || 0} ch.</span>
                <span className="w-px h-3.5 bg-gray-200"></span>
                <span>{property.surface > 0 ? `${property.surface.toFixed(0)} m²` : '—'}</span>
              </div>
            </div>
          </div>

          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 lg:text-right shrink-0 lg:min-w-[190px] border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0">
            <div>
              <div className="font-serif text-[21px] sm:text-[23px] lg:text-[25px] leading-none tracking-[-0.02em] font-light text-[#023927]">
                {priceLabel}
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mt-1.5 font-medium">
                {priceCaption}
              </div>
            </div>
            <span className="group/cta inline-flex items-center gap-2.5 sm:gap-3 shrink-0">
              <span className="relative text-[11px] sm:text-xs tracking-[0.18em] uppercase font-semibold text-[#023927]">
                Voir
                <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#023927] group-hover:w-full transition-all duration-500 ease-out"></span>
              </span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#023927]/15 bg-white flex items-center justify-center text-[#023927] group-hover:bg-[#023927] group-hover:text-white group-hover:border-[#023927] group-hover:scale-105 transition-all duration-300 shadow-sm">
                <span className="text-[14px] leading-none">→</span>
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent group-hover:border-[#C8A97E]/10 transition-colors duration-700 hidden lg:block"></div>
    </Link>
  );
};

export default PropertyListingCard;
