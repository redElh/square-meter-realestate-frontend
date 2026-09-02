import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DayPicker, DateRange, DayButtonProps } from 'react-day-picker';
import { format, addDays, startOfDay, differenceInCalendarDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { enUS } from 'date-fns/locale/en-US';
import { de } from 'date-fns/locale/de';
import { es } from 'date-fns/locale/es';
import { ru } from 'date-fns/locale/ru';
import { ar } from 'date-fns/locale/ar';
import type { Locale } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import {
  UsersIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  CheckIcon,
  MoonIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import 'react-day-picker/style.css';
import { useCurrency } from '../hooks/useCurrency';

interface ReservationCalendarProps {
  propertyId: string | number;
  propertyName: string;
  pricePerDay: number;
  currency?: string;
  onReserve: (range: DateRange | undefined, guests: number) => void;
}

const CALENDAR_THEME = `
  .reservation-calendar {
    --rdp-accent-color: #023927;
    --rdp-accent-background-color: #e8f3ee;
    --rdp-day-height: 42px;
    --rdp-day-width: 42px;
    --rdp-day_button-height: 38px;
    --rdp-day_button-width: 38px;
    --rdp-day_button-border-radius: 12px;
    --rdp-day_button-border: 2px solid transparent;
    --rdp-selected-border: 2px solid #023927;
    --rdp-range_start-date-background-color: #023927;
    --rdp-range_end-date-background-color: #023927;
    --rdp-range_start-color: #ffffff;
    --rdp-range_end-color: #ffffff;
    --rdp-range_middle-background-color: #0a4d3a;
    --rdp-range_middle-color: #ffffff;
    --rdp-today-color: #023927;
    --rdp-animation_duration: 0.3s;
    --rdp-animation_timing: cubic-bezier(0.16, 1, 0.3, 1);
    --rdp-nav_button-height: 2.5rem;
    --rdp-nav_button-width: 2.5rem;
    --rdp-months-gap: 1.5rem;
    --rdp-weekday-opacity: 1;
    --rdp-disabled-opacity: 0.35;
  }

  .reservation-calendar .rdp-month_caption {
    justify-content: center;
    padding: 0.35rem 0 0.85rem;
  }

  .reservation-calendar .rdp-caption_label {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: #023927;
    text-transform: capitalize;
  }

  .reservation-calendar .rdp-nav {
    gap: 0.35rem;
  }

  .reservation-calendar .rdp-button_previous,
  .reservation-calendar .rdp-button_next {
    color: #023927;
    border-radius: 10px;
    transition: all 0.2s ease;
    border: 1px solid rgba(2,57,39,0.08);
    background: white;
    box-shadow: 0 2px 8px rgba(2,57,39,0.06);
  }

  .reservation-calendar .rdp-button_previous:hover,
  .reservation-calendar .rdp-button_next:hover {
    background: #023927;
    color: white;
    border-color: #023927;
    transform: scale(1.04);
  }

  .reservation-calendar .rdp-chevron {
    fill: currentColor;
  }

  .reservation-calendar .rdp-weekday {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b7280;
  }

  .reservation-calendar .rdp-weekday:nth-child(1),
  .reservation-calendar .rdp-weekday:nth-child(7) {
    color: #023927;
  }

  .reservation-calendar .rdp-day_button {
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    color: #1f2937;
    font-size: 0.875rem;
    font-weight: 500;
    user-select: none;
    touch-action: manipulation;
  }

  .reservation-calendar .rdp-day:not(.rdp-outside):not(.rdp-disabled) .rdp-day_button:hover {
    background: #023927;
    color: white;
    transform: scale(1.06);
    box-shadow: 0 4px 14px rgba(2,57,39,0.18);
  }

  .reservation-calendar .rdp-day_today:not(.rdp-outside) .rdp-day_button {
    color: #023927;
    font-weight: 700;
    background: white;
    box-shadow: inset 0 0 0 2px #023927, 0 2px 8px rgba(2,57,39,0.08);
  }

  .reservation-calendar .rdp-selected .rdp-day_button,
  .reservation-calendar .rdp-range_start .rdp-day_button,
  .reservation-calendar .rdp-range_end .rdp-day_button {
    font-weight: 700;
    transform: scale(1.04);
    color: #ffffff !important;
    background: #023927 !important;
  }

  .reservation-calendar .rdp-range_middle {
    background: #0a4d3a;
  }

  .reservation-calendar .rdp-range_middle .rdp-day_button {
    color: #ffffff !important;
    background: transparent !important;
  }

  .reservation-calendar .rdp-range_start .rdp-day_button,
  .reservation-calendar .rdp-range_end .rdp-day_button {
    cursor: grab;
    touch-action: none;
    box-shadow: 0 4px 14px rgba(2,57,39,0.22);
    color: #ffffff !important;
  }

  .reservation-calendar .rdp-hover-range .rdp-day_button {
    background: #e8f3ee;
    color: #023927;
    border-radius: 0;
  }

  .reservation-calendar .rdp-hover-end .rdp-day_button {
    background: #023927 !important;
    color: #ffffff !important;
    font-weight: 700;
    border-radius: 12px;
  }

  .reservation-calendar {
    max-width: 100%;
    margin-inline: auto;
    overflow-x: hidden;
  }

  .reservation-calendar .rdp-months {
    flex-wrap: nowrap;
    justify-content: center;
  }

  @media (max-width: 640px) {
    .reservation-calendar {
      --rdp-day-width: 34px;
      --rdp-day-height: 34px;
      --rdp-day_button-width: 30px;
      --rdp-day_button-height: 30px;
      --rdp-months-gap: 0.75rem;
    }
    .reservation-calendar .rdp-day_button {
      font-size: 0.8125rem;
    }
  }

  @media (max-width: 380px) {
    .reservation-calendar {
      --rdp-day-width: 32px;
      --rdp-day-height: 32px;
      --rdp-day_button-width: 28px;
      --rdp-day_button-height: 28px;
      --rdp-months-gap: 0.5rem;
    }
    .reservation-calendar .rdp-day_button {
      font-size: 0.75rem;
    }
    .reservation-calendar .rdp-weekday {
      font-size: 0.6rem;
      letter-spacing: 0.06em;
    }
  }

  @keyframes reservation-fade-slide {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .reservation-fade-slide { animation: reservation-fade-slide 0.32s cubic-bezier(0.16,1,0.3,1) both; }
  .reservation-pulse { animation: reservation-pulse 1.6s ease-in-out infinite; }
  @keyframes reservation-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(2, 57, 39, 0.18); }
    50% { box-shadow: 0 0 0 8px rgba(2, 57, 39, 0); }
  }
`;

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ propertyId, propertyName, pricePerDay, currency = 'EUR', onReserve }) => {
  const { t, i18n } = useTranslation();
  const { format: formatPrice } = useCurrency();

  const today = startOfDay(new Date());
  const [range, setRange] = useState<DateRange | undefined>({
    from: addDays(today, 1),
    to: addDays(today, 8),
  });
  const [guests, setGuests] = useState(2);
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [dragging, setDragging] = useState<'from' | 'to' | null>(null);

  const rangeRef = useRef(range);
  const draggingRef = useRef<'from' | 'to' | null>(null);
  const suppressNextSelectRef = useRef(false);

  useEffect(() => {
    rangeRef.current = range;
  }, [range]);

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (draggingRef.current) {
        draggingRef.current = null;
        setDragging(null);
        window.setTimeout(() => {
          suppressNextSelectRef.current = false;
        }, 0);
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, []);

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const dayEl = el?.closest?.('[data-rdp-date]') as HTMLElement | null;
      if (!dayEl) return;
      const iso = dayEl.getAttribute('data-rdp-date');
      if (!iso) return;
      const [year, month, day] = iso.split('-').map(Number);
      if (!year || !month || !day) return;
      updateDraggedEndpoint(new Date(year, month - 1, day));
    };
    window.addEventListener('pointermove', handleGlobalPointerMove);
    return () => window.removeEventListener('pointermove', handleGlobalPointerMove);
  }, []);

  const updateDraggedEndpoint = (hovered: Date) => {
    const current = rangeRef.current;
    if (!current) return;
    const candidate = startOfDay(hovered);

    if (draggingRef.current === 'from' && current.to) {
      const maxFrom = startOfDay(current.to);
      const newFrom = candidate > maxFrom ? maxFrom : candidate;
      setRange({ from: newFrom, to: current.to });
    } else if (draggingRef.current === 'to' && current.from) {
      const minTo = startOfDay(current.from);
      const newTo = candidate < minTo ? minTo : candidate;
      setRange({ from: current.from, to: newTo });
    }
  };

  const handleDayMouseEnter = (date: Date) => {
    setHoveredDate(date);
    if (draggingRef.current) {
      updateDraggedEndpoint(date);
    }
  };

  const DayButton = useMemo<React.FC<DayButtonProps>>(
    () =>
      ({ modifiers, day, ...props }) => {
        const isStart = !!modifiers.range_start;
        const isEnd = !!modifiers.range_end;
        const isDraggable = isStart || isEnd;
        return (
          <button
            {...props}
            data-rdp-date={day?.isoDate}
            onPointerDown={(e) => {
              props.onPointerDown?.(e);
              const current = rangeRef.current;
              if (!isDraggable || !current?.from || !current?.to) return;
              e.preventDefault();
              draggingRef.current = isStart ? 'from' : 'to';
              setDragging(isStart ? 'from' : 'to');
              suppressNextSelectRef.current = true;
            }}
            onPointerEnter={() => {
              if (draggingRef.current && day?.date) {
                updateDraggedEndpoint(day.date);
              }
            }}
            onPointerUp={() => {
              draggingRef.current = null;
              setDragging(null);
            }}
          />
        );
      },
    []
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dateFnsLocales: Record<string, Locale> = {
    fr,
    en: enUS,
    de,
    es,
    ru,
    ar,
  };
  const currentLocale = dateFnsLocales[i18n.language.split('-')[0]] || enUS;

  const selectedDays = range?.from && range?.to
    ? Math.max(1, differenceInCalendarDays(range.to, range.from))
    : 0;
  const totalPrice = selectedDays > 0 ? selectedDays * (pricePerDay || 0) : 0;

  const isPickingDeparture = !!range?.from && !range?.to;

  const hoverRangeMatcher = (date: Date) => {
    if (!hoveredDate || !range?.from || range.to) return false;
    if (differenceInCalendarDays(date, range.from) <= 0) return false;
    if (differenceInCalendarDays(hoveredDate, date) < 0) return false;
    return true;
  };

  const hoverEndMatcher = (date: Date) => {
    if (!hoveredDate || !range?.from || range.to) return false;
    return isSameDay(date, hoveredDate) && differenceInCalendarDays(hoveredDate, range.from) > 0;
  };

  const handleReset = () => {
    setRange(undefined);
    setHoveredDate(undefined);
  };

  const applyQuickPick = (nights: number) => {
    const base = range?.from || addDays(today, 1);
    setRange({ from: base, to: addDays(base, nights) });
  };

  const quickPicks = [
    { nights: 2, label: t('propertyDetail.reservation.quickPickWeekend', { defaultValue: 'Week-end' }) },
    { nights: 7, label: t('propertyDetail.reservation.quickPickWeek', { defaultValue: 'Semaine' }) },
    { nights: 14, label: t('propertyDetail.reservation.quickPickTwoWeeks', { defaultValue: '2 semaines' }) },
  ];

  const stepLabel = isPickingDeparture
    ? t('propertyDetail.reservation.pickDeparture', { defaultValue: 'Choisissez votre date de départ pour terminer la sélection' })
    : range?.from && range?.to
    ? t('propertyDetail.reservation.datesConfirmed', { defaultValue: 'Sélection confirmée — ajustez vos dates ou réservez' })
    : t('propertyDetail.reservation.pickArrival', { defaultValue: 'Choisissez votre date d’arrivée pour commencer' });

  return (
    <div className="bg-white rounded-[28px] border border-[#023927]/10 shadow-[0_20px_60px_-20px_rgba(2,57,39,0.14)] overflow-hidden">
      <style>{CALENDAR_THEME}</style>

      {/* Premium Header — light, modern */}
      <div className="relative bg-white border-b border-[#023927]/10">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#023927] via-[#0a4d3a] to-[#023927]" />
        <div className="px-4 sm:px-7 py-5 sm:py-6 flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#023927] flex items-center justify-center shadow-[0_8px_20px_rgba(2,57,39,0.18)] flex-shrink-0">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-didont font-light text-[#023927] text-[20px] sm:text-[22px] leading-none">
                  {t('propertyDetail.reservation.title') || 'Réserver votre séjour'}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#023927]/5 border border-[#023927]/10 px-2.5 py-1 text-[#023927]/70 text-[11px] tracking-widest uppercase">
                  <SparklesIcon className="w-3 h-3" />
                  {t('propertyDetail.reservation.subtitle', { defaultValue: 'Sélectionnez vos dates' })}
                </span>
              </div>
              <p className="sm:hidden font-inter text-xs text-[#023927]/50 mt-1 uppercase tracking-widest">
                {t('propertyDetail.reservation.subtitle', { defaultValue: 'Sélectionnez vos dates' })}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#023927] text-white px-3 py-1.5 text-xs font-medium shadow-[0_4px_14px_rgba(2,57,39,0.18)]">
                  <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-[11px]">€</span>
                  {formatPrice(pricePerDay || 0, currency as any)} / {t('propertyDetail.reservation.nights', { defaultValue: 'nuit' }) || 'nuit'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#023927]/5 border border-[#023927]/10 px-3 py-1 text-[#023927]/60 text-xs">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  {t('propertyDetail.reservation.noPayment', { defaultValue: 'Aucun paiement maintenant' }).split(' — ')[0].split('—')[0].trim()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {range?.from && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#023927]/10 hover:bg-[#023927] hover:text-white hover:border-[#023927] px-3.5 py-1.5 text-[#023927] text-xs font-medium shadow-sm transition-all"
              >
                <ArrowPathIcon className="w-3.5 h-3.5" />
                {t('propertyDetail.reservation.clear', { defaultValue: 'Effacer' })}
              </button>
            )}
            <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-[#023927]/5 border border-[#023927]/10 px-3 py-1.5 text-xs font-semibold text-[#023927]">
              <MoonIcon className="w-3.5 h-3.5" />
              {selectedDays > 0 ? `${selectedDays} ${t('propertyDetail.reservation.nights', { defaultValue: 'nuits' })}` : t('propertyDetail.reservation.selectDates', { defaultValue: 'Sélectionnez vos dates' })}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Calendar Column */}
          <div className="flex-1 min-w-0">
            {/* Premium Step indicators */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-3 mb-5">
              <div
                className={`relative rounded-2xl px-2 sm:px-4 py-2.5 sm:py-3.5 border transition-all duration-300 ${
                  dragging === 'from'
                    ? 'border-[#023927] bg-[#023927] text-white shadow-[0_10px_24px_rgba(2,57,39,0.22)] scale-[1.02]'
                    : range?.from
                    ? 'border-[#023927]/15 bg-[#023927]/5'
                    : 'border-[#023927]/10 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      dragging === 'from' ? 'bg-white text-[#023927]' : range?.from ? 'bg-[#023927] text-white' : 'bg-white border border-[#023927]/10 text-[#023927]/50'
                    }`}
                  >
                    {range?.from ? <CheckIcon className="w-4 h-4" /> : '1'}
                  </div>
                  <span className={`font-inter text-xs font-semibold uppercase tracking-widest ${dragging === 'from' ? 'text-white' : 'text-[#023927]'}`}>
                    {t('propertyDetail.reservation.checkIn') || 'Arrivée'}
                  </span>
                </div>
                <p className={`mt-1.5 text-xs sm:text-sm font-medium truncate ${dragging === 'from' ? 'text-white/90' : 'text-[#023927]'}`}>
                  {range?.from ? format(range.from, 'EEE d MMM', { locale: currentLocale }) : '—'}
                </p>
              </div>

              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#023927] flex items-center justify-center shadow-[0_6px_16px_rgba(2,57,39,0.25)] flex-shrink-0">
                <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>

              <div
                className={`relative rounded-2xl px-2 sm:px-4 py-2.5 sm:py-3.5 border transition-all duration-300 ${
                  dragging === 'to'
                    ? 'border-[#023927] bg-[#023927] text-white shadow-[0_10px_24px_rgba(2,57,39,0.22)] scale-[1.02]'
                    : range?.to
                    ? 'border-[#023927]/15 bg-[#023927]/5'
                    : isPickingDeparture
                    ? 'border-[#023927] bg-white reservation-pulse'
                    : 'border-[#023927]/10 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      dragging === 'to' ? 'bg-white text-[#023927]' : range?.to ? 'bg-[#023927] text-white' : 'bg-white border border-[#023927]/10 text-[#023927]/50'
                    }`}
                  >
                    {range?.to ? <CheckIcon className="w-4 h-4" /> : '2'}
                  </div>
                  <span className={`font-inter text-xs font-semibold uppercase tracking-widest ${dragging === 'to' ? 'text-white' : 'text-[#023927]'}`}>
                    {t('propertyDetail.reservation.checkOut') || 'Départ'}
                  </span>
                </div>
                <p className={`mt-1.5 text-xs sm:text-sm font-medium truncate ${dragging === 'to' ? 'text-white/90' : 'text-[#023927]'}`}>
                  {range?.to ? format(range.to, 'EEE d MMM', { locale: currentLocale }) : '—'}
                </p>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#023927]/5 border border-[#023927]/10 px-3 py-2 text-xs text-[#023927] font-medium w-fit max-w-full">
              <MoonIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="leading-snug">
                {t('propertyDetail.reservation.dragHint', {
                  defaultValue: "Astuce : faites glisser les jours d'arrivée et de départ pour ajuster votre sélection",
                })}
              </span>
            </div>

            <div className="rounded-2xl border border-[#023927]/10 bg-white shadow-[0_12px_32px_rgba(2,57,39,0.06)] p-2 sm:p-4 overflow-hidden">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={(next) => {
                  if (suppressNextSelectRef.current) {
                    suppressNextSelectRef.current = false;
                    return;
                  }
                  setRange(next);
                }}
                locale={currentLocale}
                numberOfMonths={isMobile ? 1 : 2}
                disabled={{ before: today }}
                onDayMouseEnter={handleDayMouseEnter}
                onDayMouseLeave={() => setHoveredDate(undefined)}
                className="reservation-calendar mx-auto"
                components={{ DayButton }}
                modifiers={{
                  hoverRange: hoverRangeMatcher,
                  hoverEnd: hoverEndMatcher,
                }}
                modifiersClassNames={{
                  hoverRange: 'rdp-hover-range',
                  hoverEnd: 'rdp-hover-end',
                }}
              />
            </div>

            {/* Helper text */}
            <div
              key={stepLabel}
              className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 border border-[#023927]/10 px-3 py-2 text-sm text-[#023927] reservation-fade-slide w-fit max-w-full text-left"
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  range?.from && range?.to ? 'bg-[#023927]' : isPickingDeparture ? 'bg-[#0a4d3a] reservation-pulse' : 'bg-[#023927]/30'
                }`}
              ></span>
              <span className="font-inter text-xs sm:text-sm leading-snug">{stepLabel}</span>
            </div>

            {/* Quick picks — premium pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#023927]/50 uppercase tracking-widest font-medium">
                {t('propertyDetail.reservation.quickPick', { defaultValue: 'Sélection rapide' })}:
              </span>
              {quickPicks.map((pick) => (
                <button
                  key={pick.nights}
                  type="button"
                  onClick={() => applyQuickPick(pick.nights)}
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white border border-[#023927]/10 text-[#023927] hover:bg-[#023927] hover:text-white hover:border-[#023927] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                >
                  {pick.label} • {pick.nights} {t('propertyDetail.reservation.nights', { defaultValue: 'nuits' })}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Column — premium */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Guests */}
              <div className="rounded-2xl border border-[#023927]/10 bg-white p-4 shadow-sm">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#023927] uppercase tracking-widest mb-3">
                  <span className="w-7 h-7 rounded-full bg-[#023927]/5 border border-[#023927]/10 flex items-center justify-center">
                    <UsersIcon className="w-3.5 h-3.5 text-[#023927]" />
                  </span>
                  {t('propertyDetail.reservation.guests') || 'Nombre de personnes'}
                </label>
                <div className="flex items-center gap-2 rounded-full bg-gray-50 border border-[#023927]/10 p-1">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-full bg-white border border-[#023927]/10 flex items-center justify-center text-[#023927] hover:bg-[#023927] hover:text-white hover:border-[#023927] shadow-sm transition-all active:scale-95"
                  >
                    −
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      className="w-12 text-center bg-transparent font-inter font-semibold text-[#023927] text-lg focus:outline-none"
                      min="1"
                    />
                    <span className="font-inter text-xs text-[#023927]/50 hidden sm:inline">{guests === 1 ? 'invité' : 'invités'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuests(guests + 1)}
                    className="w-10 h-10 rounded-full bg-[#023927] text-white flex items-center justify-center hover:bg-[#0a4d3a] shadow-[0_6px_16px_rgba(2,57,39,0.22)] transition-all active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price summary — premium card */}
              <div className="rounded-2xl bg-[#023927] text-white p-5 shadow-[0_16px_40px_rgba(2,57,39,0.22)] overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} />
                <div className="relative">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-3">
                    <span className="text-xs text-white/60 uppercase tracking-widest font-medium">
                      {t('propertyDetail.reservation.summary', { defaultValue: 'Votre séjour' })}
                    </span>
                    {selectedDays > 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#023927] px-2.5 py-1 text-xs font-semibold shadow-sm">
                        <MoonIcon className="w-3.5 h-3.5" />
                        {selectedDays} {t('propertyDetail.reservation.nights', { defaultValue: 'nuits' })}
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-xs text-white/70">
                        {t('propertyDetail.reservation.selectDates') || 'Sélectionnez vos dates'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">{t('propertyDetail.reservation.checkIn') || 'Arrivée'}</span>
                      <span className="font-medium text-white">
                        {range?.from ? format(range.from, 'EEE d MMM yyyy', { locale: currentLocale }) : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">{t('propertyDetail.reservation.checkOut') || 'Départ'}</span>
                      <span className="font-medium text-white">
                        {range?.to ? format(range.to, 'EEE d MMM yyyy', { locale: currentLocale }) : '—'}
                      </span>
                    </div>

                    {selectedDays > 0 ? (
                      <div key={`${selectedDays}-${pricePerDay}`} className="reservation-fade-slide pt-3 mt-2 border-t border-white/15">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/60">
                            {formatPrice(pricePerDay || 0, currency as any)} × {selectedDays}
                          </span>
                          <span className="text-white/80">{formatPrice(totalPrice, currency as any)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-inter font-semibold text-white uppercase tracking-widest text-xs">
                            {t('propertyDetail.reservation.total') || 'Total estimé'}
                          </span>
                          <span className="font-didont font-light text-2xl text-white">{formatPrice(totalPrice, currency as any)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="pt-2 text-xs text-white/50 leading-relaxed">
                        {t('propertyDetail.reservation.selectDates') || 'Sélectionnez vos dates pour calculer le total'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA — premium */}
              <button
                type="button"
                onClick={() => onReserve(range, guests)}
                disabled={!range?.from || !range?.to}
                className="group relative w-full overflow-hidden rounded-full bg-[#023927] text-white py-4 px-6 font-inter font-semibold text-sm uppercase tracking-widest hover:bg-[#0a4d3a] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_12px_32px_rgba(2,57,39,0.28)] hover:shadow-[0_16px_40px_rgba(2,57,39,0.35)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {t('propertyDetail.reservation.button') || 'Demander une réservation'}
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 rounded-full bg-gray-50 border border-[#023927]/10 px-3 py-2">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-[#023927]/60" />
                <p className="font-inter text-xs text-[#023927]/60 text-center leading-tight">
                  {t('propertyDetail.reservation.noPayment', { defaultValue: 'Aucun paiement maintenant — votre sélection sera envoyée à notre équipe.' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
