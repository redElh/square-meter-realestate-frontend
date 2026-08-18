import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import {
  GlobeAltIcon,
  CakeIcon,
  HeartIcon,
  SparklesIcon,
  FireIcon,
  GiftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UsersIcon,
  CheckIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  LifebuoyIcon,
  ArrowRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CategoryKey = 'nautique' | 'gastronomie' | 'bien-etre' | 'aventure' | 'sport' | 'loisirs';

interface PricingTier {
  label: string;
  price: number;
}

interface Activity {
  name: string;
  category: CategoryKey;
  shortDesc: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  available: boolean;
  availability: string;
  capacity: string;
  included: string[];
  notIncluded: string[];
  highlights: string[];
  pricingTiers: PricingTier[];
  commission: number;
}

/* ------------------------------------------------------------------ */
/*  Category config                                                    */
/* ------------------------------------------------------------------ */

const CATEGORY_CONFIG: Record<
  CategoryKey,
  { color: string; bg: string; Icon: React.FC<any>; labelKey: string }
> = {
  nautique: {
    color: '#3498DB',
    bg: 'bg-[#3498DB]',
    Icon: GlobeAltIcon,
    labelKey: 'travelerSpace.activityCategories.nautical',
  },
  gastronomie: {
    color: '#E67E22',
    bg: 'bg-[#E67E22]',
    Icon: CakeIcon,
    labelKey: 'travelerSpace.activityCategories.gastronomy',
  },
  'bien-etre': {
    color: '#2ECC71',
    bg: 'bg-[#2ECC71]',
    Icon: HeartIcon,
    labelKey: 'travelerSpace.activityCategories.wellness',
  },
  aventure: {
    color: '#9B59B6',
    bg: 'bg-[#9B59B6]',
    Icon: SparklesIcon,
    labelKey: 'travelerSpace.activityCategories.adventure',
  },
  sport: {
    color: '#E74C3C',
    bg: 'bg-[#E74C3C]',
    Icon: FireIcon,
    labelKey: 'travelerSpace.activityCategories.sport',
  },
  loisirs: {
    color: '#F39C12',
    bg: 'bg-[#F39C12]',
    Icon: GiftIcon,
    labelKey: 'travelerSpace.activityCategories.leisure',
  },
};

/* ------------------------------------------------------------------ */
/*  Activities data                                                    */
/* ------------------------------------------------------------------ */

const ACTIVITIES: Activity[] = [
  {
    name: 'Excursion en mer',
    category: 'nautique',
    shortDesc: "Découverte des côtes d'Essaouira",
    description:
      "Profitez d'une excursion en mer exceptionnelle à la découverte des côtes sauvages d'Essaouira. Observez les oiseaux migrateurs, nagez dans des criques secrètes et dégustez un déjeuner typique à bord.",
    duration: '4h',
    price: 450,
    currency: 'MAD',
    available: true,
    availability: 'Sur demande (7/7)',
    capacity: '2 à 12 personnes',
    included: ['Guide', 'Déjeuner', 'Boissons', 'Matériel'],
    notIncluded: ['Transport aller-retour'],
    highlights: ['Côtes sauvages', 'Déjeuner inclus', 'Oiseaux migrateurs'],
    pricingTiers: [
      { label: '1-2 personnes', price: 550 },
      { label: '3-4 personnes', price: 450 },
      { label: '5-8 personnes', price: 380 },
      { label: '+ de 8 personnes', price: 320 },
    ],
    commission: 15,
  },
  {
    name: 'Cours de cuisine provençale',
    category: 'gastronomie',
    shortDesc: 'Atelier culinaire & dégustation',
    description:
      "Plongez dans l'art culinaire provençal avec un chef local. Apprenez à préparer des plats traditionnels et savourez votre création accompagné d'un vin de la région.",
    duration: '3h',
    price: 280,
    currency: 'MAD',
    available: true,
    availability: 'Sur demande (7/7)',
    capacity: '2 à 8 personnes',
    included: ['Chef professionnel', 'Ingrédients', 'Dégustation vin', 'Recettes'],
    notIncluded: ['Transport'],
    highlights: ['Atelier culinaire', 'Dégustation incluse', 'Chef local'],
    pricingTiers: [
      { label: '1-2 personnes', price: 320 },
      { label: '3-4 personnes', price: 280 },
      { label: '5-8 personnes', price: 250 },
    ],
    commission: 12,
  },
  {
    name: 'Visite vignoble privé',
    category: 'gastronomie',
    shortDesc: 'Découverte des vins & dégustation',
    description:
      "Visitez un vignoble privé aux alentours d'Essaouira. Découvrez le processus de vinification et dégustez une sélection de vins de qualité accompagnés de fromages locaux.",
    duration: '5h',
    price: 380,
    currency: 'MAD',
    available: true,
    availability: 'Sur demande (7/7)',
    capacity: '2 à 10 personnes',
    included: ['Visite guidée', 'Dégustation 5 vins', 'Fromages', 'Transport local'],
    notIncluded: ['Transport aller-retour'],
    highlights: ['Vignoble privé', 'Dégustation', 'Fromages'],
    pricingTiers: [
      { label: '1-2 personnes', price: 420 },
      { label: '3-4 personnes', price: 380 },
      { label: '5-8 personnes', price: 340 },
      { label: '+ de 8 personnes', price: 300 },
    ],
    commission: 15,
  },
  {
    name: 'Massage spa privatif',
    category: 'bien-etre',
    shortDesc: 'Soins traditionnels & relaxation',
    description:
      "Offrez-vous un moment de détente absolue avec un massage spa privatif. Nos thérapeutes utilisent des huiles essentielles locales pour une expérience de relaxation unique.",
    duration: '1h30',
    price: 320,
    currency: 'MAD',
    available: true,
    availability: 'Sur demande (7/7)',
    capacity: '1 à 4 personnes',
    included: ['Thérapeute certifié', 'Huiles essentielles', 'Serviettes', 'Tisane'],
    notIncluded: ['Transport'],
    highlights: ['Soins traditionnels', 'Ambiance relaxante', 'Huiles essentielles'],
    pricingTiers: [
      { label: '1 personne', price: 350 },
      { label: '2 personnes', price: 320 },
      { label: '3-4 personnes', price: 290 },
    ],
    commission: 10,
  },
  {
    name: 'Quad à Diabat',
    category: 'aventure',
    shortDesc: 'Aventure en plein air',
    description:
      "Partez à l'aventure sur un quad à travers les paysages spectaculaires de Diabat. Parcourez les dunes, les plages et les forêts de thuya dans une expérience inoubliable.",
    duration: '3h',
    price: 250,
    currency: 'MAD',
    available: true,
    availability: 'Sur demande (7/7)',
    capacity: '2 à 6 personnes',
    included: ['Quad', 'Casque', 'Guide', 'Assurance'],
    notIncluded: ['Transport aller-retour', 'Pourboire'],
    highlights: ['Paysages spectaculaires', 'Dunes & plages', 'Guide expert'],
    pricingTiers: [
      { label: '1 personne', price: 280 },
      { label: '2 personnes', price: 250 },
      { label: '3-4 personnes', price: 220 },
      { label: '5-6 personnes', price: 200 },
    ],
    commission: 15,
  },
  {
    name: 'Escape Game Essaouira',
    category: 'loisirs',
    shortDesc: 'Aventure immersive en équipe',
    description:
      "Affrontez une énigme palpitante dans un escape game immersif au cœur de la médina. Résolvez les indices, cassez les codes et échappez dans les temps !",
    duration: '1h30',
    price: 55,
    currency: 'MAD',
    available: true,
    availability: 'Sur demande (7/7)',
    capacity: '2 à 6 personnes',
    included: ['Game master', 'Indices', 'Cadenas & accessoires'],
    notIncluded: ['Boissons'],
    highlights: ['Aventure immersive', 'Médina d\'Essaouira', 'En équipe'],
    pricingTiers: [
      { label: '2-3 personnes', price: 65 },
      { label: '4-6 personnes', price: 55 },
    ],
    commission: 20,
  },
  {
    name: 'Cours de surf',
    category: 'sport',
    shortDesc: 'Apprenez à surfer en bord de mer',
    description:
      "Initiez-vous au surf avec nos moniteurs certifiés sur les plages idéales d'Essaouira. Matériel inclus, débutants bienvenus.",
    duration: '2h',
    price: 180,
    currency: 'MAD',
    available: true,
    availability: 'Sur demande (7/7)',
    capacity: '1 à 6 personnes',
    included: ['Moniteur certifié', 'Planche de surf', 'Combinaison', 'Matériel'],
    notIncluded: ['Transport'],
    highlights: ['Moniteur certifié', 'Matériel inclus', 'Débutants bienvenus'],
    pricingTiers: [
      { label: '1 personne', price: 200 },
      { label: '2 personnes', price: 180 },
      { label: '3-4 personnes', price: 160 },
      { label: '5-6 personnes', price: 140 },
    ],
    commission: 10,
  },
];

const FILTER_KEYS: { key: CategoryKey | 'all'; labelKey: string }[] = [
  { key: 'all', labelKey: 'travelerSpace.activities.filterAll' },
  { key: 'nautique', labelKey: 'travelerSpace.activityCategories.nautical' },
  { key: 'gastronomie', labelKey: 'travelerSpace.activityCategories.gastronomy' },
  { key: 'bien-etre', labelKey: 'travelerSpace.activityCategories.wellness' },
  { key: 'aventure', labelKey: 'travelerSpace.activityCategories.adventure' },
  { key: 'sport', labelKey: 'travelerSpace.activityCategories.sport' },
  { key: 'loisirs', labelKey: 'travelerSpace.activityCategories.leisure' },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const ActivityConcierge: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<CategoryKey | 'all'>('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filtered =
    activeFilter === 'all'
      ? ACTIVITIES
      : ACTIVITIES.filter((a) => a.category === activeFilter);

  const bookingPhone = '+212600494746';

  return (
    <div className="space-y-8">
      {/* ---- Header ---- */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-inter uppercase text-emerald-800 mb-2">
          {t('travelerSpace.activities.title')}
        </h2>
        <p className="font-inter text-gray-500 text-sm max-w-xl mx-auto">
          {t('travelerSpace.activities.subtitle')}
        </p>
      </div>

      {/* ---- Category Filters ---- */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FILTER_KEYS.map(({ key, labelKey }) => {
          const isActive = activeFilter === key;
          const cfg = key !== 'all' ? CATEGORY_CONFIG[key] : null;
          const FilterIcon = cfg?.Icon;
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
              {FilterIcon && <FilterIcon className="w-3.5 h-3.5" />}
              {t(labelKey)}
            </button>
          );
        })}
      </div>

      {/* ---- Activities count ---- */}
      <div className="flex items-center justify-between">
        <p className="font-inter text-sm text-gray-400 uppercase tracking-wide">
          {t('travelerSpace.activities.availableCount', { count: filtered.length })}
        </p>
      </div>

      {/* ---- Activities Grid ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((activity) => {
          const cfg = CATEGORY_CONFIG[activity.category];
          const ActivityIcon = cfg.Icon;
          return (
            <div
              key={activity.name}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden"
              style={{ borderLeftWidth: '3px', borderLeftColor: cfg.color }}
            >
              {/* Card header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-white"
                    style={{ backgroundColor: cfg.color }}
                  >
                    <ActivityIcon className="w-3 h-3" />
                    {t(cfg.labelKey)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activity.available ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                        <CheckBadgeIcon className="w-3 h-3" />
                        {t('travelerSpace.activities.available')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-semibold">
                        {t('travelerSpace.activities.full')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & description */}
                <h3 className="font-inter text-base font-bold text-gray-900 uppercase tracking-wide mb-1">
                  {activity.name}
                </h3>
                <p className="font-inter text-sm text-gray-500">{activity.shortDesc}</p>
              </div>

              {/* Info tags */}
              <div className="px-5 pb-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-xs font-inter text-gray-600 border border-gray-100">
                  <ClockIcon className="w-3 h-3 text-gray-400" />
                  {activity.duration}
                </span>
                {activity.highlights.slice(0, 2).map((h, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-xs font-inter text-gray-600 border border-gray-100"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="px-5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-xl font-bold text-gray-900">
                      {activity.price}
                    </span>
                    <span className="font-inter text-sm text-gray-400 uppercase">
                      {activity.currency} / {t('travelerSpace.activities.perPerson')}
                    </span>
                  </div>
                  <span className="font-inter text-xs text-gray-400">
                    {t('travelerSpace.activities.onRequest')}
                  </span>
                </div>
              </div>

              {/* SM Experience badge */}
              <div className="mx-5 mb-3 px-3 py-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-inter text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                    Square Meter Experience · {t('travelerSpace.activities.commission')} : {activity.commission}%
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-5 pb-5 flex items-center gap-2">
                <button
                  onClick={() => setSelectedActivity(activity)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-inter text-xs font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: cfg.color }}
                >
                  {t('travelerSpace.activities.seeDetails')}
                </button>
                <a
                  href={`https://wa.me/${bookingPhone}?text=${encodeURIComponent(
                    t('travelerSpace.whatsappMessages.bookActivity') + ' ' + activity.name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    t('travelerSpace.activities.requestBooking')
                  )}&body=${encodeURIComponent(
                    t('travelerSpace.whatsappMessages.bookActivity') + ' ' + activity.name
                  )}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                >
                  <EnvelopeIcon className="w-3.5 h-3.5" />
                  {t('travelerSpace.activities.email')}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Empty state ---- */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-inter text-gray-400 text-sm">
            {t('travelerSpace.activities.noActivities')}
          </p>
        </div>
      )}

      {/* ---- Detail Modal ---- */}
      <Transition show={selectedActivity !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedActivity(null)}>
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
                  {selectedActivity && (() => {
                    const cfg = CATEGORY_CONFIG[selectedActivity.category];
                    const ModalIcon = cfg.Icon;
                    return (
                      <>
                        {/* Modal header */}
                        <div
                          className="relative px-6 pt-6 pb-4"
                          style={{ borderBottom: `3px solid ${cfg.color}` }}
                        >
                          <button
                            onClick={() => setSelectedActivity(null)}
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
                          </div>

                          <DialogTitle className="font-inter text-xl font-bold text-gray-900 uppercase tracking-wide">
                            {selectedActivity.name}
                          </DialogTitle>
                          <p className="font-inter text-sm text-gray-500 mt-1">
                            {selectedActivity.shortDesc}
                          </p>
                        </div>

                        {/* Modal body */}
                        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
                          {/* Activity details */}
                          <div>
                            <h4 className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                              <span
                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: cfg.color + '20' }}
                              >
                                <ModalIcon className="w-3 h-3" style={{ color: cfg.color }} />
                              </span>
                              {t('travelerSpace.activities.modal.activityDetails')}
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                              <div className="flex items-start gap-3">
                                <ClockIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-inter text-xs text-gray-400 uppercase">
                                    {t('travelerSpace.activities.modal.duration')}
                                  </span>
                                  <span className="font-inter text-sm text-gray-800 ml-2">
                                    {selectedActivity.duration}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CurrencyDollarIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-inter text-xs text-gray-400 uppercase">
                                    {t('travelerSpace.activities.modal.price')}
                                  </span>
                                  <span className="font-inter text-sm text-gray-800 ml-2">
                                    {selectedActivity.price} {selectedActivity.currency} / {t('travelerSpace.activities.perPerson')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CalendarDaysIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-inter text-xs text-gray-400 uppercase">
                                    {t('travelerSpace.activities.modal.availability')}
                                  </span>
                                  <span className="font-inter text-sm text-gray-800 ml-2">
                                    {selectedActivity.availability}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <UsersIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-inter text-xs text-gray-400 uppercase">
                                    {t('travelerSpace.activities.modal.capacity')}
                                  </span>
                                  <span className="font-inter text-sm text-gray-800 ml-2">
                                    {selectedActivity.capacity}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <CheckIcon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-inter text-xs text-gray-400 uppercase">
                                    {t('travelerSpace.activities.modal.included')}
                                  </span>
                                  <span className="font-inter text-sm text-gray-800 ml-2">
                                    {selectedActivity.included.join(', ')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <XMarkIcon className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-inter text-xs text-gray-400 uppercase">
                                    {t('travelerSpace.activities.modal.notIncluded')}
                                  </span>
                                  <span className="font-inter text-sm text-gray-800 ml-2">
                                    {selectedActivity.notIncluded.join(', ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <h4 className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                <DocumentTextIcon className="w-3 h-3 text-gray-400" />
                              </span>
                              {t('travelerSpace.activities.modal.description')}
                            </h4>
                            <p className="font-inter text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                              {selectedActivity.description}
                            </p>
                          </div>

                          {/* Pricing tiers */}
                          <div>
                            <h4 className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                                <CurrencyDollarIcon className="w-3 h-3 text-amber-600" />
                              </span>
                              {t('travelerSpace.activities.modal.pricing')}
                            </h4>
                            <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-100 space-y-2">
                              {selectedActivity.pricingTiers.map((tier, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <span className="font-inter text-sm text-gray-600">{tier.label}</span>
                                  <span className="font-inter text-sm font-semibold text-gray-800">
                                    {tier.price} {selectedActivity.currency}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* SM Experience */}
                          <div>
                            <h4 className="font-inter text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                <ShieldCheckIcon className="w-3 h-3 text-emerald-600" />
                              </span>
                              Square Meter Experience
                            </h4>
                            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-100 space-y-2">
                              <div className="flex items-center gap-2">
                                <CheckIcon className="w-4 h-4 text-emerald-600" />
                                <span className="font-inter text-sm text-gray-700">
                                  {t('travelerSpace.activities.modal.securePayment')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckIcon className="w-4 h-4 text-emerald-600" />
                                <span className="font-inter text-sm text-gray-700">
                                  {t('travelerSpace.activities.modal.freeCancellation')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckIcon className="w-4 h-4 text-emerald-600" />
                                <span className="font-inter text-sm text-gray-700">
                                  {t('travelerSpace.activities.modal.assistance247')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <LifebuoyIcon className="w-4 h-4 text-emerald-600" />
                                <span className="font-inter text-sm text-gray-700">
                                  {t('travelerSpace.activities.modal.exclusiveExperience')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Modal actions */}
                        <div className="px-6 pb-5 space-y-2">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <a
                              href={`https://wa.me/${bookingPhone}?text=${encodeURIComponent(
                                t('travelerSpace.whatsappMessages.bookActivity') + ' ' + selectedActivity.name
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-inter text-xs font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:opacity-90"
                              style={{ backgroundColor: cfg.color }}
                            >
                              <PhoneIcon className="w-4 h-4" />
                              {t('travelerSpace.activities.modal.bookWhatsapp')}
                            </a>
                            <a
                              href={`mailto:?subject=${encodeURIComponent(
                                t('travelerSpace.activities.requestBooking')
                              )}&body=${encodeURIComponent(
                                t('travelerSpace.whatsappMessages.bookActivity') + ' ' + selectedActivity.name
                              )}`}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all duration-200"
                            >
                              <EnvelopeIcon className="w-4 h-4" />
                              {t('travelerSpace.activities.modal.sendRequest')}
                            </a>
                          </div>
                          <button
                            onClick={() => setSelectedActivity(null)}
                            className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-inter text-xs font-semibold uppercase tracking-wide text-gray-600 transition-colors duration-200"
                          >
                            {t('travelerSpace.activities.modal.close')}
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

export default ActivityConcierge;
