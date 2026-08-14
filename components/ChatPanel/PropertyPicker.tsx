'use client';

import { mockListings } from '@/data/mockListings';

interface PropertyPickerProps {
  onSelect: (propertyId: string, propertyAddress: string) => void;
}

/**
 * Scrollable list of property chips shown during the tour_property step.
 * User can tap a chip OR type an address/neighborhood in the input below.
 */
export default function PropertyPicker({ onSelect }: PropertyPickerProps) {
  return (
    <div className="animate-slide-up pl-9 pb-1">
      <p className="mb-1.5 text-xs text-slate-400 font-medium">Tap a property:</p>
      <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1 listings-scroll">
        {mockListings.map((listing) => (
          <button
            key={listing.id}
            onClick={() => onSelect(listing.id, listing.address)}
            className="flex items-center justify-between rounded-xl border border-slate-200
                       bg-white px-3 py-2 text-left text-xs shadow-sm
                       hover:border-brand-400 hover:bg-brand-50 active:scale-[0.98]
                       transition-all"
          >
            <div>
              <p className="font-semibold text-slate-700 leading-tight">
                {listing.address.split(',')[0]}
              </p>
              <p className="text-slate-400">{listing.neighborhood}</p>
            </div>
            <span className="ml-2 shrink-0 font-bold text-brand-600">
              ${listing.price.toLocaleString()}/mo
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
