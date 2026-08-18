import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import {
  CakeIcon,
  HeartIcon,
  SparklesIcon,
  FireIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CategoryKey = 'gastronomie' | 'bien-etre' | 'loisirs' | 'sports';

interface PartnerOffer {
  discount: string;
  discountValue: string;
  details: string[];
}

interface PrivilegePartner {
  name: string;
  category: CategoryKey;
  rating: number;
  description: string;
  address: string;
  phone: string;
  website?: string;
  email?: string;
  offer: PartnerOffer;
}

/* ------------------------------------------------------------------ */
/*  Category config                                                    */
/* ------------------------------------------------------------------ */

const CATEGORY_CONFIG: Record<
  CategoryKey,
  { color: string; bg: string; border: string; lightBg: string; Icon: React.FC<any>; labelKey: string }
> = {
  gastronomie: {
    color: '#E67E22',
    bg: 'bg-[#E67E22]',
    border: 'border-[#E67E22]',
    lightBg: 'bg-[#E67E22]/10',
    Icon: CakeIcon,
    labelKey: 'travelerSpace.partnerCategories.gastronomy',
  },
  'bien-etre': {
    color: '#2ECC71',
    bg: 'bg-[#2ECC71]',
    border: 'border-[#2ECC71]',
    lightBg: 'bg-[#2ECC71]/10',
    Icon: HeartIcon,
    labelKey: 'travelerSpace.partnerCategories.wellness',
  },
  loisirs: {
    color: '#9B59B6',
    bg: 'bg-[#9B59B6]',
    border: 'border-[#9B59B6]',
    lightBg: 'bg-[#9B59B6]/10',
    Icon: SparklesIcon,
    labelKey: 'travelerSpace.partnerCategories.adventure',
  },
  sports: {
    color: '#3498DB',
    bg: 'bg-[#3498DB]',
    border: 'border-[#3498DB]',
    lightBg: 'bg-[#3498DB]/10',
    Icon: FireIcon,
    labelKey: 'travelerSpace.partnerCategories.nauticalSports',
  },
};

/* ------------------------------------------------------------------ */
/*  Partners data                                                      */
/* ------------------------------------------------------------------ */

const PARTNERS: PrivilegePartner[] = [
  {
    name: 'Habibis',
    category: 'gastronomie',
    rating: 5,
    description: 'Cuisine & More · Restaurant',
    address: 'Essaouira',
    phone: '+212600494746',
    website: 'habibis.mogador',
    offer: {
      discount: '10% OFF',
      discountValue: '10%',
      details: [
        'travelerSpace.privilege.offreRemise',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
  {
    name: 'Le Palazzo',
    category: 'gastronomie',
    rating: 4,
    description: 'Restaurant · Cuisine italienne',
    address: 'Médina, Essaouira',
    phone: '+212622339458',
    website: 'lepalazzo.essaouira',
    offer: {
      discount: '10% OFF',
      discountValue: '10%',
      details: [
        'travelerSpace.privilege.offreRemise',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
  {
    name: 'Alma',
    category: 'gastronomie',
    rating: 4,
    description: 'Restaurant · Cuisine raffinée',
    address: 'Complexe Bin Al Aswak, Bab El Sebaa',
    phone: '+212661740568',
    website: 'Alma.and_co',
    offer: {
      discount: '10% OFF',
      discountValue: '10%',
      details: [
        'travelerSpace.privilege.offreRemise',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
  {
    name: 'Le Panoramique',
    category: 'gastronomie',
    rating: 5,
    description: 'Restaurant & Bar Plage · Vue panoramique',
    address: "Corniche d'Essaouira",
    phone: '+212617658792',
    website: 'panoramique.brunch',
    offer: {
      discount: '15% OFF',
      discountValue: '15%',
      details: [
        'travelerSpace.privilege.offreRemise',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
  {
    name: 'Bistro Kao',
    category: 'gastronomie',
    rating: 3,
    description: 'Restaurant · Cuisine locale',
    address: 'Sidi Kaouki',
    phone: '+212678967425',
    email: 'bistro_kao',
    offer: {
      discount: '5% OFF',
      discountValue: '5%',
      details: [
        'travelerSpace.privilege.offreRemise',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
  {
    name: 'Ressource Spa',
    category: 'bien-etre',
    rating: 4,
    description: 'Centre de beauté · Spa & Coiffure',
    address: 'Essaouira',
    phone: '+33605587337',
    email: 'ressource_spa_coiffure',
    offer: {
      discount: '10% OFF',
      discountValue: '10%',
      details: [
        'travelerSpace.privilege.offreRemise',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
  {
    name: 'Ranch de Diabat',
    category: 'loisirs',
    rating: 5,
    description: 'Quad · Cheval · Dromadaire',
    address: 'Diabat',
    phone: '+212662297203',
    offer: {
      discount: '15% OFF',
      discountValue: '15%',
      details: [
        'travelerSpace.privilege.offreRemiseCode',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
  {
    name: 'Escape Game Essaouira',
    category: 'loisirs',
    rating: 4,
    description: 'Escape game · Aventure immersive',
    address: 'Médina, Essaouira',
    phone: '+212708284049',
    website: 'escapegameessaouira',
    offer: {
      discount: '55DH OFF',
      discountValue: '55DH',
      details: [
        'travelerSpace.privilege.offreFixe',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
  {
    name: 'Explora Surf',
    category: 'sports',
    rating: 4,
    description: 'Surf · Watersports',
    address: 'Essaouira',
    phone: '+212611475188',
    website: 'Explorawatersports',
    offer: {
      discount: '5% OFF',
      discountValue: '5%',
      details: [
        'travelerSpace.privilege.offreRemise',
        'travelerSpace.privilege.valableUneSeuleFois',
        'travelerSpace.privilege.nonCumulable',
        'travelerSpace.privilege.presentezVotreCarte',
      ],
    },
  },
];

const FILTER_KEYS: { key: CategoryKey | 'all'; labelKey: string }[] = [
  { key: 'all', labelKey: 'travelerSpace.privilege.filterAll' },
  { key: 'gastronomie', labelKey: 'travelerSpace.partnerCategories.gastronomy' },
  { key: 'bien-etre', labelKey: 'travelerSpace.partnerCategories.wellness' },
  { key: 'loisirs', labelKey: 'travelerSpace.partnerCategories.adventure' },
  { key: 'sports', labelKey: 'travelerSpace.partnerCategories.nauticalSports' },
];

/* ------------------------------------------------------------------ */
/*  Helper sub-components                                              */
/* ------------------------------------------------------------------ */

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) =>
      i <= rating ? (
        <StarIconSolid key={i} className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <StarIcon key={i} className="w-3.5 h-3.5 text-gray-300" />
      )
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const PrivilegePartners: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<CategoryKey | 'all'>('all');
  const [selectedPartner, setSelectedPartner] = useState<PrivilegePartner | null>(null);

  const filtered =
    activeFilter === 'all'
      ? PARTNERS
      : PARTNERS.filter((p) => p.category === activeFilter);

  return (
    <div className="space-y-8">
      {/* ---- Header ---- */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-2">
          {t('travelerSpace.privilege.title')}
        </h2>
        <p className="font-inter text-gray-500 text-sm max-w-xl mx-auto">
          {t('travelerSpace.privilege.subtitle')}
        </p>
      </div>

      {/* ---- VIP Card ---- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#023927] via-emerald-800 to-[#023927] text-white rounded-2xl max-w-2xl mx-auto shadow-xl shadow-emerald-900/20">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="font-inter uppercase text-[11px] tracking-widest text-emerald-300/80 mb-1">
                {t('travelerSpace.privilege.cardLabel')}
              </div>
              <div className="font-inter text-2xl font-light tracking-wide">VIP Experience</div>
              <div className="font-inter text-sm text-emerald-200/70 mt-1">Square Meter</div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5">
              <CheckBadgeIcon className="w-4 h-4 text-emerald-300" />
              <span className="font-inter text-xs font-medium uppercase tracking-wide text-emerald-200">
                {t('travelerSpace.privilege.validUntil')}
              </span>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-xl p-4 mb-6">
            <div className="font-inter uppercase text-[11px] tracking-widest text-emerald-300/80 mb-2">
              {t('travelerSpace.privilege.exclusiveBenefits')}
            </div>
            <div className="font-inter text-sm text-emerald-100/90">
              {t('travelerSpace.privilege.benefitsText')}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-inter text-xs text-emerald-200/60">
              {t('travelerSpace.privilege.experienceLabel')}
            </div>
            <button className="bg-white text-[#023927] px-4 py-2 rounded-lg font-inter text-xs font-semibold uppercase tracking-wide hover:bg-emerald-50 transition-colors duration-200 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {t('travelerSpace.privilege.downloadCard')}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Category Filters ---- */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FILTER_KEYS.map(({ key, labelKey }) => {
          const isActive = activeFilter === key;
          const cfg = key !== 'all' ? CATEGORY_CONFIG[key] : null;
          const CatIcon = cfg?.Icon;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-inter text-xs font-semibold uppercase tracking-wide transition-all duration-200 border ${
                isActive
                  ? key === 'all'
                    ? 'bg-[#023927] text-white border-[#023927] shadow-md shadow-emerald-900/20'
                    : `${cfg!.bg} text-white border-transparent shadow-md`
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {CatIcon && <CatIcon className="w-3.5 h-3.5" />}
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {/* ---- Partners Grid ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((partner) => {
          const cfg = CATEGORY_CONFIG[partner.category];
          const PartnerIcon = cfg.Icon;
          return (
            <div
              key={partner.name}
              className={`group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden`}
              style={{ borderLeftWidth: '3px', borderLeftColor: cfg.color }}
            >
              {/* Card header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-white`}
                    style={{ backgroundColor: cfg.color }}
                  >
                    <PartnerIcon className="w-3 h-3" />
                    {t(cfg.labelKey)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Stars rating={partner.rating} />
                  </div>
                </div>

                {/* Discount badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-lg font-inter text-xs font-bold">
                    {partner.offer.discount}
                  </div>
                </div>

                {/* Name & description */}
                <h3 className="font-inter text-base font-bold text-gray-900 uppercase tracking-wide mb-1">
                  {partner.name}
                </h3>
                <p className="font-inter text-sm text-gray-500">{partner.description}</p>
              </div>

              {/* Info rows */}
              <div className="px-5 pb-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-inter">{partner.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-inter">{partner.phone}</span>
                </div>
                {partner.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GlobeAltIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-inter">{partner.website}</span>
                  </div>
                )}
                {partner.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-inter">{partner.email}</span>
                  </div>
                )}
              </div>

              {/* Offer section */}
              <div className="mx-5 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckBadgeIcon className="w-4 h-4" style={{ color: cfg.color }} />
                  <span className="font-inter text-xs font-bold uppercase tracking-wide text-gray-700">
                    {t('travelerSpace.privilege.offreExclusive')}
                  </span>
                </div>
                <div className="space-y-1">
                  {partner.offer.details.map((key, i) => {
                    let text = t(key);
                    if (key.includes('offreRemise') && !key.includes('Code') && !key.includes('Fixe')) {
                      text = `${partner.offer.discountValue} ${t('travelerSpace.privilege.deRemise')}`;
                    } else if (key.includes('offreRemiseCode')) {
                      text = `${partner.offer.discountValue} ${t('travelerSpace.privilege.deRemiseCode')}`;
                    } else if (key.includes('offreFixe')) {
                      text = `${partner.offer.discountValue} ${t('travelerSpace.privilege.surLaPartie')}`;
                    }
                    return (
                      <div key={i} className="flex items-start gap-2">
                        {i === 0 && <span className="text-gray-700 font-inter text-xs font-semibold">{text}</span>}
                        {i === 1 && <ClockIcon className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />}
                        {i === 2 && <ExclamationTriangleIcon className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />}
                        {i === 3 && <KeyIcon className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />}
                        {i > 0 && <span className="font-inter text-xs text-gray-500">{text}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-5 pb-5 flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                >
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {t('travelerSpace.privilege.itineraire')}
                </a>
                <a
                  href={`tel:${partner.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                  {t('travelerSpace.privilege.appeler')}
                </a>
                <button
                  onClick={() => setSelectedPartner(partner)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-inter text-xs font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: cfg.color }}
                >
                  {t('travelerSpace.privilege.details')}
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Empty state ---- */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-inter text-gray-400 text-sm">
            {t('travelerSpace.privilege.noPartners')}
          </p>
        </div>
      )}

      {/* ---- Detail Modal ---- */}
      <Transition show={selectedPartner !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedPartner(null)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <DialogPanel className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {selectedPartner && (() => {
                    const cfg = CATEGORY_CONFIG[selectedPartner.category];
                    const ModalIcon = cfg.Icon;
                    return (
                      <>
                        {/* Modal header */}
                        <div
                          className="relative px-6 pt-6 pb-4"
                          style={{ borderBottom: `3px solid ${cfg.color}` }}
                        >
                          <button
                            onClick={() => setSelectedPartner(null)}
                            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-500" />
                          </button>

                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-white"
                              style={{ backgroundColor: cfg.color }}
                            >
                              <ModalIcon className="w-3 h-3" />
                              {t(cfg.labelKey)}
                            </div>
                            <Stars rating={selectedPartner.rating} />
                          </div>

                          <DialogTitle className="font-inter text-xl font-bold text-gray-900 uppercase tracking-wide">
                            {selectedPartner.name}
                          </DialogTitle>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-5 space-y-5">
                          {/* General info */}
                          <div>
                            <h4 className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: cfg.color + '20' }}>
                                <ModalIcon className="w-3 h-3" style={{ color: cfg.color }} />
                              </span>
                              {t('travelerSpace.privilege.generalInfo')}
                            </h4>
                            <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <div className="flex items-start gap-3">
                                <span className="font-inter text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5 uppercase">
                                  {t('travelerSpace.privilege.labelName')}
                                </span>
                                <span className="font-inter text-sm text-gray-800 font-medium">{selectedPartner.name}</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="font-inter text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5 uppercase">
                                  {t('travelerSpace.privilege.labelCategory')}
                                </span>
                                <span className="font-inter text-sm text-gray-800">{t(cfg.labelKey)}</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="font-inter text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5 uppercase">
                                  {t('travelerSpace.privilege.labelDescription')}
                                </span>
                                <span className="font-inter text-sm text-gray-800">{selectedPartner.description}</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="font-inter text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5 uppercase">
                                  {t('travelerSpace.privilege.labelAddress')}
                                </span>
                                <span className="font-inter text-sm text-gray-800">{selectedPartner.address}</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <span className="font-inter text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5 uppercase">
                                  {t('travelerSpace.privilege.labelPhone')}
                                </span>
                                <span className="font-inter text-sm text-gray-800">{selectedPartner.phone}</span>
                              </div>
                              {selectedPartner.website && (
                                <div className="flex items-start gap-3">
                                  <span className="font-inter text-xs text-gray-400 w-20 flex-shrink-0 pt-0.5 uppercase">
                                    {t('travelerSpace.privilege.labelWebsite')}
                                  </span>
                                  <span className="font-inter text-sm text-gray-800">{selectedPartner.website}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Exclusive offer */}
                          <div>
                            <h4 className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                                <CheckBadgeIcon className="w-3 h-3 text-amber-600" />
                              </span>
                              {t('travelerSpace.privilege.offreExclusive')}
                            </h4>
                            <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-100 space-y-2">
                              {(() => {
                                const discountText =
                                  selectedPartner.offer.discountValue.includes('DH')
                                    ? `${selectedPartner.offer.discountValue} ${t('travelerSpace.privilege.surLaPartie')}`
                                    : `${selectedPartner.offer.discountValue} ${t('travelerSpace.privilege.deRemise')}`;
                                return (
                                  <div className="flex items-center gap-2">
                                    <span className="font-inter text-sm font-semibold text-gray-800">{discountText}</span>
                                  </div>
                                );
                              })()}
                              {selectedPartner.offer.details.slice(1).map((key, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="font-inter text-sm text-gray-600">{t(key)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Modal actions */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPartner.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                            >
                              <MapPinIcon className="w-4 h-4" />
                              {t('travelerSpace.privilege.openMaps')}
                            </a>
                            <a
                              href={`tel:${selectedPartner.phone}`}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                            >
                              <PhoneIcon className="w-4 h-4" />
                              {t('travelerSpace.privilege.appeler')}
                            </a>
                            {selectedPartner.email && (
                              <a
                                href={`mailto:${selectedPartner.email}`}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                              >
                                <EnvelopeIcon className="w-4 h-4" />
                                {t('travelerSpace.privilege.email')}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Modal footer */}
                        <div className="px-6 pb-5">
                          <button
                            onClick={() => setSelectedPartner(null)}
                            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 transition-colors duration-200"
                          >
                            {t('travelerSpace.privilege.close')}
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default PrivilegePartners;
