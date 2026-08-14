'use client';

/** Colour palette per neighbourhood — used for the card accent strip. */
const NEIGHBORHOOD_COLORS: Record<string, string> = {
  'Wicker Park':  'bg-pink-500',
  'Lincoln Park': 'bg-blue-500',
  'Logan Square': 'bg-yellow-500',
  'River North':  'bg-green-500',
};

interface Listing {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  petFriendly: boolean;
  neighborhood: string;
  walkabilityScore: number;
  schoolRating: number;
  type: string;
  tag: string;
}

interface PropertyCardProps {
  listing: Listing;
  index: number;
}

export default function PropertyCard({ listing, index }: PropertyCardProps) {
  const accentColor = NEIGHBORHOOD_COLORS[listing.neighborhood] ?? 'bg-slate-400';

  return (
    <div className="group flex items-stretch gap-0 rounded-xl border border-slate-200
                    bg-white shadow-sm hover:shadow-md hover:border-brand-300
                    transition-all duration-200 overflow-hidden cursor-pointer">
      {/* Colour accent strip + number */}
      <div className={`${accentColor} flex w-10 shrink-0 items-center justify-center`}>
        <span className="text-xs font-bold text-white">{index + 1}</span>
      </div>

      {/* Property image placeholder */}
      <div className="relative h-20 w-24 shrink-0 overflow-hidden bg-slate-100">
        {/* Gradient placeholder instead of an external image */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg,
              hsl(${(index * 47) % 360}, 60%, 80%) 0%,
              hsl(${(index * 47 + 60) % 360}, 60%, 70%) 100%)`,
          }}
        />
        {/* Type badge */}
        <span className={`absolute top-1 left-1 rounded px-1.5 py-0.5 text-[10px]
                          font-semibold uppercase tracking-wide
                          ${listing.type === 'buy'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-indigo-100 text-indigo-700'}`}>
          {listing.type === 'buy' ? 'Buy' : 'Rent'}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between px-3 py-2 min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
              {listing.address}
            </p>
            <span className="shrink-0 text-sm font-bold text-brand-600">
              ${listing.price.toLocaleString()}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{listing.neighborhood}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span title="Bedrooms">🛏 {listing.bedrooms}bd</span>
          <span title="Bathrooms">🚿 {listing.bathrooms}ba</span>
          <span title="Square feet">📐 {listing.sqft.toLocaleString()} sqft</span>
          {listing.petFriendly && <span title="Pet friendly">🐾</span>}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium
                           text-brand-700 border border-brand-100">
            {listing.tag}
          </span>
          <span className="text-[10px] text-slate-400">
            Walk {listing.walkabilityScore} · Schools {listing.schoolRating}/10
          </span>
        </div>
      </div>
    </div>
  );
}
