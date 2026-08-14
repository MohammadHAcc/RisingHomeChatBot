'use client';

const TIME_SLOTS = [
  { payload: 'TOUR_TIME_MORNING',   label: 'Morning',   sub: '9am – 12pm', icon: '🌅' },
  { payload: 'TOUR_TIME_AFTERNOON', label: 'Afternoon', sub: '12pm – 5pm', icon: '☀️'  },
  { payload: 'TOUR_TIME_EVENING',   label: 'Evening',   sub: '5pm – 7pm',  icon: '🌆' },
];

interface TimeSlotButtonsProps {
  onSelect: (payload: string, label: string) => void;
}

/**
 * Three time-slot option buttons shown during the tour_time step.
 * Clicking a button fires onSelect with the slot payload and display label.
 */
export default function TimeSlotButtons({ onSelect }: TimeSlotButtonsProps) {
  return (
    <div className="animate-slide-up pl-9 flex gap-2 flex-wrap">
      {TIME_SLOTS.map((slot) => (
        <button
          key={slot.payload}
          onClick={() => onSelect(slot.payload, `${slot.icon} ${slot.label} (${slot.sub})`)}
          className="flex flex-col items-center rounded-xl border-2 border-slate-200
                     bg-white px-4 py-2.5 text-center shadow-sm
                     hover:border-brand-500 hover:bg-brand-50
                     active:scale-95 transition-all"
        >
          <span className="text-xl">{slot.icon}</span>
          <span className="mt-0.5 text-xs font-semibold text-slate-700">{slot.label}</span>
          <span className="text-[10px] text-slate-400">{slot.sub}</span>
        </button>
      ))}
    </div>
  );
}
