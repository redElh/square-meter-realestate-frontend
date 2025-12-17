// Example: Translated and Currency-Aware Property Card Component
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../contexts/LocalizationContext';
import { useCurrency } from '../hooks/useCurrency';
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
  price: number; // Always in MAD (base currency)
  location: string;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  type: 'buy' | 'rent';
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  description,
  price,
  location,
  surface,
  bedrooms,
  bathrooms,
  images,
  type,
  isFavorite = false,
  onToggleFavorite
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();
  const { format } = useCurrency();

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={images[0]} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Type Badge */}
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
            {type === 'buy' ? t('properties.filters.buy') : t('properties.filters.rent')}
          </span>
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(id)}
            className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors`}
          >
            {isFavorite ? (
              <HeartIconSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className={`text-xl font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : ''}`}>
          {title}
        </h3>

        {/* Location */}
        <div className={`flex items-center text-gray-600 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <MapPinIcon className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
          <span className="text-sm">{location}</span>
        </div>

        {/* Description */}
        <p className={`text-gray-600 text-sm mb-4 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
          {description}
        </p>

        {/* Details */}
        <div className={`flex items-center gap-4 mb-4 text-sm text-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <HomeIcon className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            <span>{surface} m²</span>
          </div>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium">{bedrooms}</span>
            <span className={isRTL ? 'mr-1' : 'ml-1'}>{t('properties.details.bedrooms')}</span>
          </div>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-medium">{bathrooms}</span>
            <span className={isRTL ? 'mr-1' : 'ml-1'}>{t('properties.details.bathrooms')}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className={`flex items-center justify-between pt-4 border-t border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <p className="text-xs text-gray-500 mb-1">
              {t('properties.details.price')}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {format(price)}
            </p>
          </div>

          <Link
            to={`/properties/${id}`}
            className={`flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span>{t('common.view')}</span>
            <ArrowRightIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
