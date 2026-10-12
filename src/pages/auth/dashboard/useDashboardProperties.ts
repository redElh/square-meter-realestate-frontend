import { useEffect, useState } from 'react';
import {
  apimoService,
  isSoldStatus,
  type Property as ApimoAppProperty,
} from '../../../services/apimoService';
import type { Property } from './types';

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  AED: 'AED',
  MAD: 'DH',
};

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600';

export const formatDashboardPrice = (
  price: number,
  type: 'buy' | 'rent' | 'seasonal' | 'program',
  currency?: string,
  pricePeriod?: number
): string => {
  if (!price) return 'Prix sur demande';
  const symbol = CURRENCY_SYMBOLS[(currency || 'EUR').toUpperCase()] || currency || '€';
  const amount = new Intl.NumberFormat('fr-FR').format(price);
  if (type === 'buy' || type === 'program') return `${amount} ${symbol}`;
  if (type === 'seasonal' && pricePeriod === 1) return `${amount} ${symbol}/jour`;
  if (type === 'seasonal') return `${amount} ${symbol}/mois`;
  return `${amount} ${symbol}/mois`;
};

const statusLabel = (property: ApimoAppProperty): string => {
  if (isSoldStatus(property.status)) return 'Vendu';
  if (property.type === 'buy') return 'En vente';
  if (property.type === 'seasonal') return 'Location saisonnière';
  return 'En location';
};

const mandateLabel = (property: ApimoAppProperty): string | undefined => {
  const type = property.agreement?.type;
  if (type === 3) return 'Mandat exclusif';
  if (type === 2) return 'Mandat semi-exclusif';
  if (type === 1) return 'Mandat simple';
  return undefined;
};

export const toDashboardProperty = (property: ApimoAppProperty): Property => ({
  id: property.id,
  title: property.title,
  location: property.location,
  price: formatDashboardPrice(property.price, property.type, property.currency, property.pricePeriod),
  image: property.images?.[0] || FALLBACK_IMAGE,
  surface: property.surface > 0 ? `${Math.round(property.surface)} m²` : '—',
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  rooms: property.rooms,
  type: property.type,
  status: statusLabel(property),
  description: property.description || '',
  features: property.features || [],
  yearBuilt: property.yearBuilt,
  landSize:
    typeof property.landSurface === 'number' && property.landSurface > 0
      ? `${Math.round(property.landSurface)} m²`
      : undefined,
  reference: property.reference,
  mandate: mandateLabel(property),
  views: 0,
  favorites: 0,
  inquiries: 0,
  visitsThisMonth: 0,
  score: 0,
  isNew: property.featured === true,
});

export interface DashboardPropertiesState {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

export const useDashboardProperties = (): DashboardPropertiesState => {
  const [state, setState] = useState<DashboardPropertiesState>({
    properties: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    apimoService
      .getProperties({ limit: 1000 }, undefined, 'fr')
      .then(({ properties }) => {
        if (cancelled) return;
        setState({ properties: properties.map(toDashboardProperty), loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          properties: [],
          loading: false,
          error: error instanceof Error ? error.message : String(error),
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};