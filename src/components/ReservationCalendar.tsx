import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DayPicker, DateRange, DayButtonProps } from 'react-day-picker';
import { format, addDays, startOfDay, differenceInCalendarDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { enUS } from 'date-fns/locale/en-US';
import { useTranslation } from 'react-i18next';
import {
  UsersIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  CheckIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import 'react-day-picker/style.css';
import { useCurrency } from '../hooks/useCurrency';

interface ReservationCalendarProps {
  propertyId: string | number;
  propertyName: string;
  pricePerDay: number;
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
    --rdp-day_button-border-radius: 10px;
    --rdp-day_button-border: 2px solid transparent;
    --rdp-selected-border: 2px solid #023927;
    --rdp-range_start-date-background-color: #023927;
    --rdp-range_end-date-background-color: #023927;
    --rdp-range_start-color: #ffffff;
    --rdp-range_end-color: #ffffff;
    --rdp-range_middle-background-color: #e8f3ee;
    --rdp-range_middle-color: #023927;
    --rdp-today-color: #023927;
    --rdp-animation_duration: 0.3s;
    --rdp-animation_timing: cubic-bezier(0.4, 0, 0.2, 1);
    --rdp-nav_button-height: 2.5rem;
    --rdp-nav_button-width: 2.5rem;
    --rdp-months-gap: 1.25rem;
    --rdp-weekday-opacity: 1;
    --rdp-disabled-opacity: 0.35;
  }

  .reservation-calendar .rdp-month_caption {
    justify-content: center;
    padding: 0.25rem 0 0.75rem;
  }

  .reservation-calendar .rdp-caption_label {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #111827;
    text-transform: capitalize;
  }

  .reservation-calendar .rdp-nav {
    gap: 0.25rem;
  }

  .reservation-calendar .rdp-button_previous,
  .reservation-calendar .rdp-button_next {
    color: #023927;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .reservation-calendar .rdp-button_previous:hover,
  .reservation-calendar .rdp-button_next:hover {
    background: #e8f3ee;
    color: #023927;
  }

  .reservation-calendar .rdp-chevron {
    fill: #023927;
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
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    color: #374151;
    font-size: 0.875rem;
    user-select: none;
    touch-action: manipulation;
  }

  .reservation-calendar .rdp-day:not(.rdp-outside):not(.rdp-disabled) .rdp-day_button:hover {
    background: #e8f3ee;
    color: #023927;
    transform: scale(1.08);
  }

  .reservation-calendar .rdp-day_today:not(.rdp-outside) .rdp-day_button {
    color: #023927;
    font-weight: 700;
    box-shadow: inset 0 0 0 2px #023927;
  }

  .reservation-calendar .rdp-selected .rdp-day_button,
  .reservation-calendar .rdp-range_start .rdp-day_button,
  .reservation-calendar .rdp-range_end .rdp-day_button {
    font-weight: 700;
    transform: scale(1.08);
  }

  .reservation-calendar .rdp-range_start .rdp-day_button,
  .reservation-calendar .rdp-range_end .rdp-day_button {
    color: #ffffff !important;
  }

  .reservation-calendar .rdp-range_start .rdp-day_button,
  .reservation-calendar .rdp-range_end .rdp-day_button {
    cursor: grab;
    touch-action: none;
  }

  .reservation-calendar .rdp-range_start .rdp-day_button:hover,
  .reservation-calendar .rdp-range_end .rdp-day_button:hover {
    color: #023927 !important;
    background-color: #e8f3ee !important;
  }

  .reservation-calendar .rdp-range_start .rdp-day_button:active,
  .reservation-calendar .rdp-range_end .rdp-day_button:active {
    cursor: grabbing;
    color: #023927 !important;
    background-color: #dcefe7 !important;
  }

  .reservation-calendar .rdp-range_middle .rdp-day_button:hover {
    transform: scale(1.08);
    background: #dcefe7;
  }

  .reservation-calendar .rdp-hover-range .rdp-day_button {
    background: #e8f3ee;
    color: #023927;
    border-radius: 0;
    transform: scale(1.08);
  }

  .reservation-calendar .rdp-hover-end .rdp-day_button {
    background: #023927 !important;
    color: #ffffff !important;
    font-weight: 700;
    border-radius: 10px;
    transform: scale(1.08);
  }

  .reservation-calendar {
    max-width: 100%;
    margin-inline: auto;
    overflow-x: hidden;
  }

  .reservation-calendar .rdp-months {
    flex-wrap: nowrap;
  }

  @media (max-width: 480px) {
    .reservation-calendar {
      --rdp-day-width: 36px;
      --rdp-day-height: 36px;
      --rdp-day_button-width: 32px;
      --rdp-day_button-height: 32px;
      --rdp-months-gap: 0.5rem;
      --rdp-weekday-padding: 0.35rem 0rem;
      padding: 0.5rem !important;
    }

    .reservation-calendar .rdp-day_button {
      font-size: 0.8125rem;
    }

    .reservation-calendar .rdp-month_caption {
      padding: 0.15rem 0 0.5rem;
    }
  }

  @keyframes reservation-fade-slide {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .reservation-fade-slide {
    animation: reservation-fade-slide 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .reservation-pulse {
    animation: reservation-pulse 1.6s ease-in-out infinite;
  }

  @keyframes reservation-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(2, 57, 39, 0.22);
    }
    50% {
      box-shadow: 0 0 0 6px rgba(2, 57, 39, 0);
    }
  }
`;

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ propertyId, propertyName, pricePerDay, onReserve }) => {
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

  const currentLocale = i18n.language === 'fr' ? fr : enUS;

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
    <div className="bg-white border-2 border-gray-100 shadow-lg shadow-gray-200/60">
      <style>{CALENDAR_THEME}</style>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#023927] to-[#0a4d3a] px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-white/10 border border-white/20 flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-inter font-light text-white tracking-tight">
              {t('propertyDetail.reservation.title') || 'Réserver votre séjour'}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 uppercase tracking-widest mt-0.5">
              {t('propertyDetail.reservation.subtitle', { defaultValue: 'Sélectionnez vos dates' })}
            </p>
          </div>
        </div>

        {range?.from && (
          <button
            type="button"
            onClick={handleReset}
            className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white text-sm uppercase tracking-wider transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            {t('propertyDetail.reservation.clear', { defaultValue: 'Effacer' })}
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Calendar Column */}
          <div className="flex-1 min-w-0">
            {/* Step indicator */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 mb-6">
              <div
                className={`relative px-3 sm:px-4 py-3 border-2 transition-all duration-300 ${
                  dragging === 'from'
                    ? 'border-[#023927] bg-[#023927]/10 ring-2 ring-[#023927]/25 scale-[1.03]'
                    : range?.from
                    ? 'border-[#023927] bg-[#023927]/5'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                      range?.from ? 'bg-[#023927] text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {range?.from ? <CheckIcon className="w-3.5 h-3.5" /> : '1'}
                  </div>
                  <span className="font-inter text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    {t('propertyDetail.reservation.checkIn') || 'Arrivée'}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-gray-600 font-medium truncate">
                  {range?.from ? format(range.from, 'EEE d MMM', { locale: currentLocale }) : '-'}
                </p>
              </div>

              <ArrowRightIcon className="w-5 h-5 text-[#023927] flex-shrink-0" />

              <div
                className={`relative px-3 sm:px-4 py-3 border-2 transition-all duration-300 ${
                  dragging === 'to'
                    ? 'border-[#023927] bg-[#023927]/10 ring-2 ring-[#023927]/25 scale-[1.03]'
                    : range?.to
                    ? 'border-[#023927] bg-[#023927]/5'
                    : isPickingDeparture
                    ? 'border-[#023927]/60 bg-[#023927]/5 reservation-pulse'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                      range?.to ? 'bg-[#023927] text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {range?.to ? <CheckIcon className="w-3.5 h-3.5" /> : '2'}
                  </div>
                  <span className="font-inter text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    {t('propertyDetail.reservation.checkOut') || 'Départ'}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-gray-600 font-medium truncate">
                  {range?.to ? format(range.to, 'EEE d MMM', { locale: currentLocale }) : '-'}
                </p>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-[#023927]/80 font-medium">
              <MoonIcon className="w-4 h-4 flex-shrink-0" />
              <span>
                {t('propertyDetail.reservation.dragHint', {
                  defaultValue: "Astuce : faites glisser les jours d'arrivée et de départ pour ajuster votre sélection",
                })}
              </span>
            </div>

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
              className="reservation-calendar border border-gray-100 rounded-lg p-4 sm:p-5 bg-white shadow-sm mx-auto md:mx-0"
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

            {/* Helper text */}
            <div
              key={stepLabel}
              className="mt-4 flex items-center gap-2 text-sm text-gray-600 reservation-fade-slide"
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  range?.from && range?.to ? 'bg-[#023927]' : isPickingDeparture ? 'bg-[#0a4d3a] reservation-pulse' : 'bg-gray-300'
                }`}
              ></span>
              {stepLabel}
            </div>

            {/* Quick picks */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mr-1">
                {t('propertyDetail.reservation.quickPick', { defaultValue: 'Sélection rapide' })}:
              </span>
              {quickPicks.map((pick) => (
                <button
                  key={pick.nights}
                  type="button"
                  onClick={() => applyQuickPick(pick.nights)}
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium border-2 border-gray-200 text-gray-700 hover:border-[#023927] hover:text-[#023927] hover:bg-[#023927]/5 transition-all duration-300"
                >
                  {pick.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Column */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8 space-y-5">
              {/* Guests */}
              <div className="border-2 border-gray-100 p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  <UsersIcon className="w-4 h-4 text-[#023927]" />
                  {t('propertyDetail.reservation.guests') || 'Nombre de personnes'}
                </label>
                <div className="flex items-stretch border-2 border-gray-200 focus-within:border-[#023927] transition-colors">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-11 flex items-center justify-center text-lg text-gray-600 hover:text-[#023927] hover:bg-gray-50 transition-colors border-r-2 border-gray-200"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    className="w-full text-center font-inter font-semibold text-gray-900 focus:outline-none"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => setGuests(guests + 1)}
                    className="w-11 flex items-center justify-center text-lg text-gray-600 hover:text-[#023927] hover:bg-gray-50 transition-colors border-l-2 border-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-gradient-to-br from-[#f7faf9] to-[#eef5f1] border-2 border-gray-100 p-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                  <span className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                    {t('propertyDetail.reservation.summary', { defaultValue: 'Votre séjour' })}
                  </span>
                  {selectedDays > 0 && (
                    <span className="flex items-center gap-1 text-sm font-semibold text-[#023927]">
                      <MoonIcon className="w-4 h-4" />
                      {selectedDays} {t('propertyDetail.reservation.nights', { defaultValue: 'nuits' })}
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('propertyDetail.reservation.checkIn') || 'Arrivée'}</span>
                    <span className="font-medium text-gray-900">
                      {range?.from ? format(range.from, 'EEE d MMM yyyy', { locale: currentLocale }) : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('propertyDetail.reservation.checkOut') || 'Départ'}</span>
                    <span className="font-medium text-gray-900">
                      {range?.to ? format(range.to, 'EEE d MMM yyyy', { locale: currentLocale }) : '-'}
                    </span>
                  </div>

                  {selectedDays > 0 && (
                    <div key={`${selectedDays}-${pricePerDay}`} className="reservation-fade-slide pt-2.5 mt-1 border-t border-dashed border-gray-300">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-gray-600">
                          {formatPrice(pricePerDay || 0)} × {selectedDays}
                        </span>
                        <span className="text-gray-600">{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-inter font-semibold text-gray-900 uppercase tracking-wide">
                          {t('propertyDetail.reservation.total') || 'Total estimé'}
                        </span>
                        <span className="font-serif font-bold text-2xl text-[#023927]">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedDays === 0 && (
                  <p className="mt-3 text-xs text-gray-500">
                    {t('propertyDetail.reservation.selectDates') || 'Sélectionnez vos dates pour calculer le total'}
                  </p>
                )}
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => onReserve(range, guests)}
                disabled={!range?.from || !range?.to}
                className="w-full bg-[#023927] text-white py-4 px-6 font-inter font-medium uppercase tracking-wider hover:bg-[#0a4d3a] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <span className="flex items-center justify-center gap-2">
                  {t('propertyDetail.reservation.button') || 'Demander une réservation'}
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>

              <p className="text-center text-xs text-gray-500">
                {t('propertyDetail.reservation.noPayment', { defaultValue: 'Aucun paiement maintenant — votre sélection sera envoyée à notre équipe.' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
