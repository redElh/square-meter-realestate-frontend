import React, { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { enUS } from 'date-fns/locale/en-US';
import { useTranslation } from 'react-i18next';
import { UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';
import 'react-day-picker/style.css';
import { useCurrency } from '../hooks/useCurrency';

interface ReservationCalendarProps {
  propertyId: string | number;
  propertyName: string;
  pricePerDay: number;
  onReserve: (range: DateRange | undefined, guests: number) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ propertyId, propertyName, pricePerDay, onReserve }) => {
  const { t, i18n } = useTranslation();
  const { format: formatPrice } = useCurrency();
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [guests, setGuests] = useState(2);

  const currentLocale = i18n.language === 'fr' ? fr : enUS;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const selectedDays = range?.from && range?.to
    ? Math.max(1, differenceInCalendarDays(range.to, range.from))
    : 0;
  const totalPrice = selectedDays > 0 ? selectedDays * (pricePerDay || 0) : 0;

  const handleReserve = () => {
    onReserve(range, guests);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <CalendarIcon className="w-6 h-6 text-[#023927]" />
        <h3 className="text-xl font-inter font-light text-gray-900">
          {t('propertyDetail.reservation.title') || 'Réserver votre séjour'}
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <style>{`
            .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
              background-color: #023927 !important;
              color: white !important;
            }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: #f3f4f6 !important;
            }
            .rdp-day_today {
              color: #023927 !important;
              font-weight: bold;
            }
          `}</style>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            locale={currentLocale}
            numberOfMonths={isMobile ? 1 : 2}
            disabled={{ before: new Date() }}
            className="border rounded-md p-4 mx-auto md:mx-0"
          />
        </div>

        <div className="w-full lg:w-72 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <UsersIcon className="w-4 h-4" />
              {t('propertyDetail.reservation.guests') || 'Nombre de personnes'}
            </label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition-colors border-r"
              >
                -
              </button>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                className="w-full text-center focus:outline-none"
                min="1"
              />
              <button
                onClick={() => setGuests(guests + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition-colors border-l"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('propertyDetail.reservation.checkIn') || 'Arrivée'}</span>
              <span className="font-medium">{range?.from ? format(range.from, 'PP', { locale: currentLocale }) : '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('propertyDetail.reservation.checkOut') || 'Départ'}</span>
              <span className="font-medium">{range?.to ? format(range.to, 'PP', { locale: currentLocale }) : '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t('propertyDetail.reservation.total') || 'Total'}</span>
              <span className="font-semibold text-[#023927]">
                {selectedDays > 0 ? formatPrice(totalPrice) : '-'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {selectedDays > 0
                ? `${selectedDays} ${t('propertyDetail.reservation.days') || 'day(s)'} x ${formatPrice(pricePerDay || 0)}`
                : t('propertyDetail.reservation.selectDates') || 'Select your dates to calculate the total'}
            </div>
          </div>

          <button
            onClick={handleReserve}
            disabled={!range?.from || !range?.to}
            className="w-full bg-[#023927] text-white py-4 font-inter hover:bg-[#023927]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('propertyDetail.reservation.button') || 'Demander une réservation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
