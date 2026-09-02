// Example: Translated and Currency-Aware Property Card Component
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../contexts/LocalizationContext';
import { useCurrency } from '../hooks/useCurrency';
import { isSoldStatus } from '../services/apimoService';
import { 
  MapPinIcon, 
  HomeIcon, 
  HeartIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface PropertyCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  currency?: string;
  location: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  rooms?: number;
  floors?: number;
  images: string[];
  type: 'buy' | 'rent';
  status?: number;
  reference?: string;
  isExclusive?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  description,
  price,
  currency,
  location,
  surface,
  bedrooms,
  bathrooms,
  rooms,
  floors,
  images,
  type,
  status,
  reference,
  isExclusive = false,
  isFavorite = false,
  onToggleFavorite
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();
  const { format } = useCurrency();

  const sold = isSoldStatus(status);
  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="group relative bg-white border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-700 h-full flex flex-col"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A97E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      {/* Image */}
      <div className="relative h-[300px] overflow-hidden bg-gray-50">
        <img 
          src={images[0]} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"></div>
        
        {/* Top bar */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isExclusive && (
            <span className="inline-flex items-center gap-1.5 bg-white/92 backdrop-blur-xl border border-[#C8A97E]/25 px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase font-semibold text-[#023927] shadow-sm">
              <span className="w-1 h-1 rounded-full bg-[#C8A97E]"></span>
              {t('properties.listing.exclusive')}
            </span>
          )}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase font-medium backdrop-blur-xl border shadow-sm ${sold ? 'bg-gray-900 text-white border-gray-800' : 'bg-white/90 text-gray-700 border-white/60'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sold ? 'bg-gray-400' : 'bg-emerald-500'}`}></span>
            {sold ? (type === 'buy' ? t('properties.filters.sold') : t('properties.filters.rented')) : type === 'buy' ? t('properties.filters.buy') : t('properties.filters.rent')}
          </span>
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(id)}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-9 h-9 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300`}
          >
            {isFavorite ? (
              <HeartIconSolid className="w-4 h-4 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}
        {/* bottom meta */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md border border-white/15 text-white px-2.5 py-1 text-[11px] tracking-wide">
            <MapPinIcon className="w-3.5 h-3.5 opacity-80" />
            <span className="truncate max-w-[160px]">{location}</span>
          </span>
          <span className="hidden sm:inline-flex bg-white/90 backdrop-blur-xl border border-white/50 text-gray-900 px-2 py-1 text-[10px] tracking-[0.14em] uppercase font-semibold">
            {images.length} photos
          </span>
        </div>
      </div>

      {/* Content — editorial */}
      <div className="px-5 sm:px-6 pt-5 pb-4 flex-1 flex flex-col">
        <div className={`flex gap-3 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="hidden sm:block w-px self-stretch bg-gradient-to-b from-[#C8A97E] via-[#C8A97E]/40 to-transparent shrink-0"></div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-serif text-[19px] leading-[1.1] tracking-[-0.015em] font-light text-gray-900 truncate group-hover:text-[#023927] transition-colors duration-500 ${isRTL ? 'text-right' : ''}`}>
              {title}
            </h3>
            {reference && (
              <p className={`text-[11px] tracking-wide text-gray-400 font-mono mt-1 ${isRTL ? 'text-right' : ''}`}>
                Réf. {reference}
              </p>
            )}
            <p className={`text-gray-500 text-[13px] leading-relaxed mt-2 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
              {description}
            </p>
            <div className={`mt-3 flex items-center gap-2 sm:gap-3 text-[11px] tracking-[0.14em] uppercase font-medium text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`inline-flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}><HomeIcon className="w-3.5 h-3.5 text-gray-400" /> {surface} m²</span>
              <span className="w-px h-3 bg-gray-200"></span>
              <span>{rooms || 0} ch.</span>
              <span className="w-px h-3 bg-gray-200"></span>
              <span>{floors || 0} ét.</span>
            </div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className={`mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="font-serif text-[20px] leading-none tracking-[-0.02em] font-light text-[#023927]">
              {format(price, (currency as any) || 'EUR')}
            </p>
            <p className="text-[10px] tracking-[0.14em] uppercase text-gray-400 mt-1 font-medium">
              {type === 'buy' ? 'Prix' : 'Par mois'}
            </p>
          </div>

          <Link
            to={`/properties/${id}`}
            className={`group/cta inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span className="relative text-[11px] tracking-[0.16em] uppercase font-semibold text-[#023927]">{t('common.view')}
              <span className={`absolute -bottom-1 h-px w-0 bg-[#023927] group-hover/cta:w-full transition-all duration-500 ${isRTL ? 'right-0' : 'left-0'}`}></span>
            </span>
            <span className="w-8 h-8 rounded-full border border-[#023927]/15 bg-white flex items-center justify-center text-[#023927] group-hover/cta:bg-[#023927] group-hover/cta:text-white transition-all duration-300">
              <ArrowRightIcon className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </span>
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 border border-transparent group-hover:border-[#C8A97E]/10 transition-colors duration-700 hidden lg:block"></div>
    </div>
  );
};

export default PropertyCard;
