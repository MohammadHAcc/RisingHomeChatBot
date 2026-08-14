'use client';

import { formatDate, timeSlotLabel } from '@/starry/decisionTree';

interface TourBooking {
  propertyId:      string | null;
  propertyAddress: string | null;
  date:            string | null;
  timeSlot:        string | null;
  guestName:       string | null;
  contact:         string | null;
}

interface TourConfirmationCardProps {
  booking: TourBooking;
}

/**
 * Styled confirmation card rendered in-chat after a tour is successfully booked.
 * Displays a summary of all collected booking details.
 */
export default function TourConfirmationCard({ booking }: TourConfirmationCardProps) {
  const rows = [
    { icon: '🏠', label: 'Property', value: booking.propertyAddress ?? '—' },
    { icon: '📅', label: 'Date',     value: booking.date ? formatDate(booking.date) : '—' },
    { icon: '🕐', label: 'Time',     value: booking.timeSlot ? timeSlotLabel(booking.timeSlot) : '—' },
    { icon: '👤', label: 'Name',     value: booking.guestName ?? '—' },
    { icon: '📬', label: 'Contact',  value: booking.contact ?? '—' },
  ];

  return (
    <div className="animate-slide-up pl-9">
      <div className="rounded-2xl rounded-tl-sm border border-emerald-200
                      bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full
                           bg-emerald-500 text-white text-sm font-bold shadow-sm">
            ✓
          </span>
          <p className="text-sm font-bold text-emerald-800">Tour Booked!</p>
        </div>

        {/* Detail rows */}
        <div className="space-y-1.5">
          {rows.map(({ icon, label, value }) => (
            <div key={label} className="flex items-start gap-2 text-xs">
              <span className="w-4 shrink-0 text-center">{icon}</span>
              <span className="w-14 shrink-0 font-semibold text-slate-500">{label}</span>
              <span className="text-slate-700 leading-snug">{value}</span>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-3 text-[11px] text-emerald-700 border-t border-emerald-200 pt-2">
          A Rising Home agent will confirm your tour within 24 hours. 🌟
        </p>
      </div>
    </div>
  );
}
