'use client';

import MapView from './MapView';
import PropertyCard from './PropertyCard';
import { mockListings, neighborhoods } from '@/data/mockListings';
import { useState } from 'react';

/**
 * MapPanel — the left 60% of the split layout.
 *
 * Contains:
 *   • A mock SVG map with neighbourhood zones and property pins
 *   • A scrollable list of property cards below
 *
 * Filtering and property selection are out of scope for Story 1 but the
 * neighbourhood filter pills are rendered as a visual stub.
 */
export default function MapPanel() {
  const [activeNeighborhood, setActiveNeighborhood] = useState<string | null>(null);

  const filtered = activeNeighborhood
    ? mockListings.filter((l) => l.neighborhood === activeNeighborhood)
    : mockListings;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <div>
          <h1 className="text-sm font-semibold text-slate-800">
            Chicago Properties
          </h1>
          <p className="text-xs text-slate-500">{filtered.length} listings</p>
        </div>

        {/* Neighbourhood filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button
            onClick={() => setActiveNeighborhood(null)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors
              ${activeNeighborhood === null
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          {neighborhoods.map((n) => (
            <button
              key={n}
              onClick={() => setActiveNeighborhood(n === activeNeighborhood ? null : n)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors
                ${activeNeighborhood === n
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ── Map ────────────────────────────────────────────────────────── */}
      <div className="relative shrink-0" style={{ height: '38%' }}>
        <MapView />
      </div>

      {/* ── Listing cards ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto listings-scroll px-4 py-3 space-y-2">
        {filtered.map((listing, i) => (
          <PropertyCard key={listing.id} listing={listing} index={i} />
        ))}
      </div>
    </div>
  );
}
