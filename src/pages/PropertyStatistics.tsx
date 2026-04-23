/**
 * Property Statistics Dashboard - Premium Analytics
 * Sophisticated real-time performance metrics with enterprise-grade visualizations
 */

import React, { useState, useEffect, useMemo, useCallback, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  EyeIcon,
  EnvelopeIcon,
  HeartIcon,
  CursorArrowRaysIcon,
  SparklesIcon,
  ChevronDownIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  UsersIcon,
  BanknotesIcon,
  ArrowsPointingOutIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  SignalIcon,
  ArrowRightIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  ComposedChart,
  Line
} from 'recharts';
import { apimoService } from '../services/apimoService';
import propertyStatsService, { PropertyStats } from '../services/propertyStatsService';
import { useCurrency } from '../hooks/useCurrency';
import { useLocalization } from '../contexts/LocalizationContext';
import SEO from '../components/SEO/SEO';

interface InteractionEvent {
  id: string;
  type: 'view' | 'inquiry' | 'favorite' | 'click';
  timestamp: number;
  label: string;
}

type Timeframe = '24h' | '7d' | '30d';

interface TrendData {
  date: string;
  views: number;
  inquiries: number;
  favorites: number;
  clicks: number;
}

interface StatsUiFallback {
  pageTitle: string;
  engagementTitle: string;
  engagementRate: string;
  timeframe: Record<Timeframe, string>;
}

const statsUiFallbacks: Record<string, StatsUiFallback> = {
  en: {
    pageTitle: 'Analytics / Dashboard',
    engagementTitle: 'Engagement Analysis',
    engagementRate: 'Engagement',
    timeframe: {
      '24h': '24h',
      '7d': '7d',
      '30d': '30d',
    },
  },
  fr: {
    pageTitle: 'Analyse / Tableau de bord',
    engagementTitle: 'Analyse de l\'engagement',
    engagementRate: 'Taux d\'engagement',
    timeframe: {
      '24h': '24 h',
      '7d': '7 jours',
      '30d': '30 jours',
    },
  },
  es: {
    pageTitle: 'Analitica / Panel de control',
    engagementTitle: 'Analisis de interaccion',
    engagementRate: 'Interaccion',
    timeframe: {
      '24h': '24 h',
      '7d': '7 dias',
      '30d': '30 dias',
    },
  },
  de: {
    pageTitle: 'Analyse / Ubersichtsseite',
    engagementTitle: 'Interaktionsanalyse',
    engagementRate: 'Interaktion',
    timeframe: {
      '24h': '24 Std.',
      '7d': '7 Tage',
      '30d': '30 Tage',
    },
  },
  ar: {
    pageTitle: 'التحليلات / لوحة المعلومات',
    engagementTitle: 'تحليل التفاعل',
    engagementRate: 'معدل التفاعل',
    timeframe: {
      '24h': '24 ساعة',
      '7d': '7 أيام',
      '30d': '30 يوما',
    },
  },
  ru: {
    pageTitle: 'Аналитика / Панель управления',
    engagementTitle: 'Анализ вовлеченности',
    engagementRate: 'Вовлеченность',
    timeframe: {
      '24h': '24 ч',
      '7d': '7 дн',
      '30d': '30 дн',
    },
  },
};

const PropertyStatistics: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { format: formatCurrency } = useCurrency();
  const { isRTL } = useLocalization();

  const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0].toLowerCase();
  const currentStatsUiFallback = statsUiFallbacks[currentLanguage] || statsUiFallbacks.en;
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [recentInteractions, setRecentInteractions] = useState<InteractionEvent[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [previousStats, setPreviousStats] = useState<PropertyStats | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>('7d');
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  // Map i18n language to locale string for date formatting
  const getLocaleString = (lang: string): string => {
    const localeMap: { [key: string]: string } = {
      en: 'en-US',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
      ar: 'ar-SA',
      ru: 'ru-RU'
    };
    return localeMap[lang] || 'en-US';
  };

  const currentLocale = getLocaleString(currentLanguage);

  const localizeTrendDateLabel = useCallback((rawDate: string, currentTimeframe: Timeframe) => {
    if (currentTimeframe === '24h') {
      return rawDate;
    }

    // Real trend data comes with English labels from the API (e.g. "Apr 16").
    // Parse and re-format with the active locale so month names follow the selected language.
    const englishShortMonthMap: Record<string, number> = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    const normalizedRawDate = String(rawDate || '').trim();
    const monthDayMatch = normalizedRawDate.match(/^([A-Za-z]{3})\s+(\d{1,2})$/);

    if (monthDayMatch) {
      const monthIndex = englishShortMonthMap[monthDayMatch[1].toLowerCase()];
      const day = Number(monthDayMatch[2]);

      if (monthIndex !== undefined && Number.isFinite(day)) {
        const parsedDate = new Date();
        parsedDate.setMonth(monthIndex, day);
        return parsedDate.toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' });
      }
    }

    const fallbackParsedDate = new Date(normalizedRawDate);
    if (!Number.isNaN(fallbackParsedDate.getTime())) {
      return fallbackParsedDate.toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' });
    }

    return normalizedRawDate;
  }, [currentLocale]);

  // Fetch all properties
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties-all', currentLanguage],
    queryFn: async () => {
      const result = await apimoService.getProperties({ limit: 1000 }, t, currentLanguage);
      return result.properties || [];
    },
    staleTime: 60000,
  });

  // Fetch all stats
  const { data: allStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['property-stats-all'],
    queryFn: () => propertyStatsService.getAllStats(),
    refetchInterval: isAutoRefresh ? 3000 : false,
    staleTime: 1000,
  });

  // Generate trend data from real stats
  useEffect(() => {
    if (!selectedPropertyId) return;

    // Helper function to distribute values maintaining the exact total
    const distributeWithAccuracy = (total: number, weights: number[], period: number = 24) => {
      const values = weights.map(w => total * w);
      const rounded = values.map(v => Math.floor(v));
      let sum = rounded.reduce((a, b) => a + b, 0);
      
      // Add remainder to the most recent period to ensure total is exact
      let remainder = total - sum;
      if (remainder > 0) {
        rounded[rounded.length - 1] += remainder;
      } else if (remainder < 0) {
        // If we somehow over-distributed, remove from the most recent
        rounded[rounded.length - 1] = Math.max(0, rounded[rounded.length - 1] + remainder);
      }
      
      return rounded;
    };

    const generateTrendData = async () => {
      // First, try to get real trend data from events for this timeframe
      const realTrendData = await propertyStatsService.getTrendData(selectedPropertyId, timeframe);
      
      if (realTrendData && realTrendData.length > 0) {
        console.log('[Stats] Using real trend data from events');
        const localizedRealTrendData = realTrendData.map((entry: TrendData) => ({
          ...entry,
          date: localizeTrendDateLabel(entry.date, timeframe),
        }));
        setTrendData(localizedRealTrendData);
        return;
      }

      // Fall back to distributing total stats if no event history
      console.log('[Stats] No event history found, generating synthetic trends');
      const data: TrendData[] = [];
      const stats = allStats[selectedPropertyId] as PropertyStats | undefined;
      
      // Use actual stats and distribute them across the timeframe
      const totalViews = stats?.views || 0;
      const totalInquiries = stats?.inquiries || 0;
      const totalFavorites = stats?.favorites || 0;
      const totalClicks = stats?.clicks || 0;
      
      if (timeframe === '24h') {
        // Generate hourly data for last 24 hours
        const weights: number[] = [];
        for (let i = 23; i >= 0; i--) {
          const weight = Math.max(0.05, 1 - (i / 24) * 0.8);
          weights.push(weight);
        }
        
        // Normalize weights to sum to 1
        const sumWeights = weights.reduce((a, b) => a + b, 0);
        const normalizedWeights = weights.map(w => w / sumWeights);
        
        // Distribute values maintaining exact totals
        const viewsDistributed = distributeWithAccuracy(totalViews, normalizedWeights);
        const inquiriesDistributed = distributeWithAccuracy(totalInquiries, normalizedWeights);
        const favoritesDistributed = distributeWithAccuracy(totalFavorites, normalizedWeights);
        const clicksDistributed = distributeWithAccuracy(totalClicks, normalizedWeights);
        
        for (let i = 23; i >= 0; i--) {
          const date = new Date();
          date.setHours(date.getHours() - i);
          const index = 23 - i;
          
          data.push({
            date: `${date.getHours().toString().padStart(2, '0')}:00`,
            views: viewsDistributed[index],
            inquiries: inquiriesDistributed[index],
            favorites: favoritesDistributed[index],
            clicks: clicksDistributed[index],
          });
        }
      } else if (timeframe === '7d') {
        // Generate daily data for last 7 days
        const weights: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const weight = Math.max(0.1, 1 - (i / 7) * 0.6);
          weights.push(weight);
        }
        
        // Normalize weights to sum to 1
        const sumWeights = weights.reduce((a, b) => a + b, 0);
        const normalizedWeights = weights.map(w => w / sumWeights);
        
        // Distribute values maintaining exact totals
        const viewsDistributed = distributeWithAccuracy(totalViews, normalizedWeights, 7);
        const inquiriesDistributed = distributeWithAccuracy(totalInquiries, normalizedWeights, 7);
        const favoritesDistributed = distributeWithAccuracy(totalFavorites, normalizedWeights, 7);
        const clicksDistributed = distributeWithAccuracy(totalClicks, normalizedWeights, 7);
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const index = 6 - i;
          
          data.push({
            date: date.toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' }),
            views: viewsDistributed[index],
            inquiries: inquiriesDistributed[index],
            favorites: favoritesDistributed[index],
            clicks: clicksDistributed[index],
          });
        }
      } else {
        // Generate daily data for last 30 days
        const weights: number[] = [];
        for (let i = 29; i >= 0; i--) {
          const weight = Math.max(0.08, 1 - (i / 30) * 0.7);
          weights.push(weight);
        }
        
        // Normalize weights to sum to 1
        const sumWeights = weights.reduce((a, b) => a + b, 0);
        const normalizedWeights = weights.map(w => w / sumWeights);
        
        // Distribute values maintaining exact totals
        const viewsDistributed = distributeWithAccuracy(totalViews, normalizedWeights, 30);
        const inquiriesDistributed = distributeWithAccuracy(totalInquiries, normalizedWeights, 30);
        const favoritesDistributed = distributeWithAccuracy(totalFavorites, normalizedWeights, 30);
        const clicksDistributed = distributeWithAccuracy(totalClicks, normalizedWeights, 30);
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const index = 29 - i;
          
          data.push({
            date: date.toLocaleDateString(currentLocale, { month: 'short', day: 'numeric' }),
            views: viewsDistributed[index],
            inquiries: inquiriesDistributed[index],
            favorites: favoritesDistributed[index],
            clicks: clicksDistributed[index],
          });
        }
      }
      
      setTrendData(data);
    };
    
    generateTrendData();
  }, [selectedPropertyId, timeframe, allStats, localizeTrendDateLabel, currentLocale]);

  // Auto-select first property if available
  useEffect(() => {
    if (!selectedPropertyId && properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  // Track stats changes for real-time interaction detection
  useEffect(() => {
    if (!selectedPropertyId) return;

    const currentStats = allStats[selectedPropertyId] as PropertyStats | undefined;
    if (!currentStats || !previousStats) {
      setPreviousStats(currentStats || null);
      return;
    }

    const newInteractions: InteractionEvent[] = [];
    const viewsDiff = (currentStats.views || 0) - (previousStats.views || 0);
    const inquiriesDiff = (currentStats.inquiries || 0) - (previousStats.inquiries || 0);
    const favoritesDiff = (currentStats.favorites || 0) - (previousStats.favorites || 0);
    const clicksDiff = (currentStats.clicks || 0) - (previousStats.clicks || 0);

    if (viewsDiff > 0) {
      for (let i = 0; i < viewsDiff; i++) {
        newInteractions.push({
          id: `view-${Date.now()}-${i}`,
          type: 'view',
          timestamp: Date.now(),
          label: 'Property View'
        });
      }
    }

    if (inquiriesDiff > 0) {
      for (let i = 0; i < inquiriesDiff; i++) {
        newInteractions.push({
          id: `inquiry-${Date.now()}-${i}`,
          type: 'inquiry',
          timestamp: Date.now(),
          label: 'New Inquiry'
        });
      }
    }

    if (favoritesDiff > 0) {
      for (let i = 0; i < favoritesDiff; i++) {
        newInteractions.push({
          id: `favorite-${Date.now()}-${i}`,
          type: 'favorite',
          timestamp: Date.now(),
          label: 'Added to Favorites'
        });
      }
    }

    if (clicksDiff > 0) {
      for (let i = 0; i < clicksDiff; i++) {
        newInteractions.push({
          id: `click-${Date.now()}-${i}`,
          type: 'click',
          timestamp: Date.now(),
          label: 'Content Interaction'
        });
      }
    }

    if (newInteractions.length > 0) {
      setRecentInteractions(prev => [...newInteractions, ...prev].slice(0, 50));
    }

    setPreviousStats(currentStats);
  }, [allStats, selectedPropertyId, previousStats]);

  // Get selected property with stats
  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;

    const prop = properties.find(p => p.id === selectedPropertyId);
    if (!prop) return null;

    const stats = allStats[selectedPropertyId] as PropertyStats | undefined;
    if (!stats) {
      return {
        ...prop,
        stats: { propertyId: selectedPropertyId, views: 0, inquiries: 0, favorites: 0, clicks: 0 },
        engagementScore: 0,
        conversionRate: 0,
        recentInteractions
      };
    }

    return {
      ...prop,
      stats,
      engagementScore: propertyStatsService.calculateEngagementScore(stats),
      conversionRate: propertyStatsService.getConversionRate(stats),
      recentInteractions
    };
  }, [selectedPropertyId, properties, allStats, recentInteractions]);

  const isLoading = propertiesLoading || statsLoading;

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (!selectedProperty) return null;
    
    const views = selectedProperty.stats?.views || 0;
    const inquiries = selectedProperty.stats?.inquiries || 0;
    const favorites = selectedProperty.stats?.favorites || 0;
    const clicks = selectedProperty.stats?.clicks || 0;
    
    const totalInteractions = inquiries + favorites + clicks;
    const normalizedStats: PropertyStats = {
      propertyId: selectedProperty.stats?.propertyId ?? selectedProperty.id,
      views,
      inquiries,
      favorites,
      clicks,
    };
    const engagementRate = propertyStatsService.getEngagementRate(normalizedStats);
    const inquiryRate = propertyStatsService.getConversionRate(normalizedStats);
    
    return {
      totalInteractions,
      engagementRate,
      inquiryRate,
      views,
      inquiries,
      favorites,
      clicks
    };
  }, [selectedProperty]);

  // Pie chart data for interaction breakdown
  const pieData = useMemo(() => {
    if (!performanceMetrics) return [];
    
    return [
      { name: t('stats.metrics.inquiries'), value: performanceMetrics.inquiries, color: '#8B5CF6' },
      { name: t('stats.metrics.favorites'), value: performanceMetrics.favorites, color: '#EF4444' },
      { name: t('stats.engagement.clicks'), value: performanceMetrics.clicks, color: '#10B981' }
    ].filter(item => item.value > 0);
  }, [performanceMetrics, t]);

  // Premium Metric Card Component
  const PremiumMetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    trend, 
    gradient,
    iconGradient 
  }: { 
    icon: React.ComponentType<any>;
    label: string;
    value: number;
    trend?: number;
    gradient: string;
    iconGradient: string;
  }) => (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10"
           style={{ background: gradient }} />
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-gold/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${iconGradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend >= 0 ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <p className="text-sm font-medium text-gray-500 mb-1 tracking-wide uppercase">{label}</p>
        <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );

  // Premium Progress Ring Component
  const ProgressRing = ({ 
    value, 
    max = 100, 
    label,
    subtitle,
    startColor,
    endColor,
  }: { 
    value: number; 
    max?: number;
    label: string;
    subtitle?: string;
    startColor: string;
    endColor: string;
  }) => {
    const gradientId = `progress-ring-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
    const percentage = max > 0 ? Math.min((safeValue / max) * 100, 100) : 0;
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex h-full flex-col items-center text-center">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="8"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={startColor} />
                <stop offset="100%" stopColor={endColor} />
              </linearGradient>
            </defs>
            {/* Progress ring */}
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{Math.round(percentage)}%</div>
            </div>
          </div>
        </div>
        <p className="mt-4 min-h-[2.75rem] text-sm font-semibold text-gray-900 uppercase tracking-wider leading-tight flex items-center justify-center">
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1 min-h-[1.25rem] flex items-center justify-center">
            {subtitle}
          </p>
        )}
      </div>
    );
  };

  if (isLoading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl animate-pulse" />
            <SparklesIcon className="w-20 h-20 text-gold mx-auto mb-6 relative animate-spin-slow" />
          </div>
          <p className="text-gray-600 text-lg font-medium">{t('stats.header.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={t('stats.title', { defaultValue: 'Property Statistics' })}
        description={t('stats.description', { defaultValue: 'Real-time property performance analytics' })}
      />

      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Premium Header */}
        <div className=" top-[64px] sm:top-[96px] z-40 w-full left-0 right-0 mt-12">
          <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
              <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-gold to-amber-600 rounded-xl shadow-lg shadow-gold/20">
                    <PresentationChartLineIcon className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-light tracking-tight text-gray-900">
                    <span className="font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                      {t('stats.pageTitle', { defaultValue: currentStatsUiFallback.pageTitle })}
                    </span>
                  </h1>
                </div>
                <p className="text-gray-500 text-sm tracking-wide uppercase font-medium">
                  {t('stats.header.performance')}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Timeframe selector */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {(['24h', '7d', '30d'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        timeframe === tf 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t(`stats.header.timeframe.${tf}`, { defaultValue: currentStatsUiFallback.timeframe[tf] })}
                    </button>
                  ))}
                </div>
                
                {/* Auto-refresh toggle */}
                <button
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isAutoRefresh
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent shadow-lg shadow-green-500/25'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  } font-medium text-sm`}
                >
                  <ArrowPathIcon className={`w-4 h-4 ${isAutoRefresh ? 'animate-spin-slow' : ''}`} />
                  {isAutoRefresh ? t('stats.header.liveUpdates') : t('stats.header.updatesPaused')}
                </button>
              </div>
            </div>

            {/* Property Selector - Premium Style */}
            <div className={`flex items-center gap-4 pb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="w-5 h-5 text-gold" />
                <label className="font-semibold text-gray-700 text-sm uppercase tracking-wider">
                  {t('stats.header.activeProperty')}
                </label>
              </div>
              <div className="relative flex-1 max-w-md">
                <select
                  value={selectedPropertyId || ''}
                  onChange={(e) => setSelectedPropertyId(Number(e.target.value))}
                  className="w-full px-5 py-3 pr-12 bg-white border-2 border-gray-100 rounded-xl text-gray-900 font-medium 
                           focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 
                           appearance-none cursor-pointer shadow-sm transition-all hover:border-gray-200 truncate"
                >
                  <option value="">{t('stats.header.selectProperty')}</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>
                      {prop.title} — {prop.location}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none flex-shrink-0" />
              </div>
              
              {selectedProperty && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gold/5 rounded-xl border border-gold/20">
                  <CheckBadgeIcon className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-gray-600">
                    {t('stats.header.propertyId')} <span className="font-mono text-gray-900">{selectedPropertyId}</span>
                  </span>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {selectedProperty ? (
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
            
            {/* Property Overview Card - Premium Glassmorphism */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-amber-500/5 to-gold/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold/10 to-transparent rounded-full blur-3xl" />
                <div className="flex gap-8 p-8">
                  <div className="relative w-44 h-44 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                    <img
                      src={selectedProperty.images?.[0] || '/photo-1.jfif'}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                          {selectedProperty.title}
                        </h2>
                        <div className="flex items-center gap-2 text-gold mb-4">
                          <BuildingOfficeIcon className="w-4 h-4" />
                          <p className="text-lg font-medium">{selectedProperty.location}</p>
                        </div>
                      </div>
                      {selectedProperty.engagementScore > 70 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold to-amber-600 text-white rounded-full shadow-lg shadow-gold/30">
                          <TrophyIcon className="w-5 h-5" />
                          <span className="font-semibold text-sm">{t('stats.overview.topPerforming')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex flex-wrap gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <BanknotesIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t('stats.overview.price')}</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(selectedProperty.price || 0, selectedProperty.currency as any || 'EUR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                          <ArrowsPointingOutIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t('stats.overview.surface')}</p>
                          <p className="text-xl font-bold text-gray-900">{selectedProperty.surface} m²</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <UsersIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t('stats.overview.bedrooms')}</p>
                          <p className="text-xl font-bold text-gray-900">{selectedProperty.bedrooms}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                          <SignalIcon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{t('stats.overview.engagementScore')}</p>
                          <p className="text-xl font-bold bg-gradient-to-r from-gold to-amber-600 bg-clip-text text-transparent">
                            {selectedProperty.engagementScore || 0}/100
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PremiumMetricCard
                icon={EyeIcon}
                label={t('stats.metrics.totalViews')}
                value={performanceMetrics?.views || 0}
                gradient="from-blue-500 to-cyan-500"
                iconGradient="from-blue-500 to-cyan-500"
              />
              <PremiumMetricCard
                icon={EnvelopeIcon}
                label={t('stats.metrics.inquiries')}
                value={performanceMetrics?.inquiries || 0}
                gradient="from-purple-500 to-pink-500"
                iconGradient="from-purple-500 to-pink-500"
              />
              <PremiumMetricCard
                icon={HeartIcon}
                label={t('stats.metrics.favorites')}
                value={performanceMetrics?.favorites || 0}
                gradient="from-red-500 to-rose-500"
                iconGradient="from-red-500 to-rose-500"
              />
              <PremiumMetricCard
                icon={CursorArrowRaysIcon}
                label={t('stats.metrics.interactions')}
                value={performanceMetrics?.totalInteractions || 0}
                gradient="from-emerald-500 to-green-500"
                iconGradient="from-emerald-500 to-green-500"
              />
            </div>

            {/* Main Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Trend Chart - Large Area */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{t('stats.trends.title')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{t('stats.trends.subtitle')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-xs font-medium text-gray-600">{t('stats.trends.views')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-xs font-medium text-gray-600">{t('stats.trends.inquiries')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-gray-600">{t('stats.trends.interactions')}</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={trendData}>
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="inquiriesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      fill="url(#viewsGradient)"
                    />
                    <Bar 
                      dataKey="inquiries" 
                      fill="#8B5CF6" 
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Metrics Panel */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t('stats.engagement.title', { defaultValue: currentStatsUiFallback.engagementTitle })}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  <ProgressRing
                    value={performanceMetrics?.engagementRate || 0}
                    label={t('stats.engagement.engagementRate', { defaultValue: currentStatsUiFallback.engagementRate })}
                    subtitle={`${performanceMetrics?.totalInteractions || 0} ${t('stats.engagement.actions')}`}
                    startColor="#D4AF37"
                    endColor="#B8860B"
                  />
                  <ProgressRing
                    value={performanceMetrics?.inquiryRate || 0}
                    max={100}
                    label={t('stats.engagement.conversionRate')}
                    subtitle={`${performanceMetrics?.inquiries || 0} ${t('stats.engagement.inquiries')}`}
                    startColor="#8B5CF6"
                    endColor="#EC4899"
                  />
                </div>

                {/* Interaction Breakdown */}
                {pieData.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                      {t('stats.engagement.interactionBreakdown')}
                    </h4>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6 mt-4">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-medium text-gray-600">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Live Feed & Performance Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Live Activity Feed */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-md animate-pulse" />
                      <BoltIcon className="w-6 h-6 text-green-600 relative" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{t('stats.activityFeed.title')}</h3>
                      <p className="text-sm text-gray-500">{t('stats.activityFeed.subtitle')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-700">{t('stats.activityFeed.live')}</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {recentInteractions.length > 0 ? (
                    recentInteractions.slice(0, 20).map((interaction, i) => (
                      <div
                        key={interaction.id}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                          i === 0
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 animate-pulse'
                            : i < 3
                            ? 'bg-gray-50 border-l-4 border-gold'
                            : 'bg-gray-50/50 border-l-4 border-gray-200'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {interaction.type === 'view' && <EyeIcon className="w-5 h-5 text-blue-500" />}
                          {interaction.type === 'inquiry' && <EnvelopeIcon className="w-5 h-5 text-purple-500" />}
                          {interaction.type === 'favorite' && <HeartIcon className="w-5 h-5 text-red-500" />}
                          {interaction.type === 'click' && <CursorArrowRaysIcon className="w-5 h-5 text-green-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{interaction.label}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round((Date.now() - interaction.timestamp) / 1000)} {t('stats.activityFeed.secondsAgo')}
                          </p>
                        </div>
                        {i === 0 && (
                          <ArrowRightIcon className="w-4 h-4 text-green-500 animate-bounce" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">{t('stats.activityFeed.noActivity')}</p>
                      <p className="text-sm text-gray-400 mt-1">{t('stats.activityFeed.noActivityDesc')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Score Card */}
              <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <ChartPieIcon className="w-6 h-6 text-gold" />
                    <h3 className="text-xl font-bold">{t('stats.performanceIndex.title')}</h3>
                  </div>
                  
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <svg className="w-48 h-48" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#1F2937" strokeWidth="8" />
                        <circle
                          cx="60" cy="60" r="54"
                          fill="none"
                          stroke="url(#performanceGradient)"
                          strokeWidth="8"
                          strokeDasharray={`${(selectedProperty.engagementScore || 0) * 3.39} 339`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                          transform="rotate(-90 60 60)"
                        />
                        <defs>
                          <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#B8860B" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent">
                          {selectedProperty.engagementScore || 0}
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">{t('stats.performanceIndex.outOf100')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-400">{t('stats.performanceIndex.marketPosition')}</span>
                      <span className="font-semibold">
                        {(selectedProperty.engagementScore || 0) > 70 ? t('stats.performanceIndex.top10') : 
                         (selectedProperty.engagementScore || 0) > 40 ? t('stats.performanceIndex.top40') : t('stats.performanceIndex.average')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-400">{t('stats.performanceIndex.viewToInquiry')}</span>
                      <span className="font-semibold">{performanceMetrics?.inquiryRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-400">{t('stats.performanceIndex.lastUpdate')}</span>
                      <span className="font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        {t('stats.performanceIndex.live')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="p-6 bg-gray-100 rounded-2xl inline-block mb-6">
                <ChartBarIcon className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                {t('stats.emptyState.title')}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {t('stats.emptyState.description')}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default PropertyStatistics;