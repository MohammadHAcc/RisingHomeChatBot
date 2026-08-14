'use client';

import { mockListings } from '@/data/mockListings';

/** Neighbourhood zone definitions for the SVG mock map. */
const ZONES = [
  { name: 'Logan Square',  x: 5,  y: 22, w: 28, h: 30, color: '#fef9c3' },
  { name: 'Wicker Park',   x: 18, y: 30, w: 22, h: 22, color: '#fce7f3' },
  { name: 'Lincoln Park',  x: 40, y: 12, w: 24, h: 26, color: '#dbeafe' },
  { name: 'River North',   x: 52, y: 45, w: 20, h: 20, color: '#dcfce7' },
];

/** Street lines to give the map a grid feel. */
const H_STREETS = [15, 30, 45, 60, 75];
const V_STREETS = [20, 35, 50, 65, 80];

export default function MapView() {
  return (
    <div className="relative w-full h-full bg-stone-100 overflow-hidden select-none">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Base fill */}
        <rect x="0" y="0" width="100" height="100" fill="#f1f0ec" />

        {/* Street grid */}
        {H_STREETS.map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y}
                stroke="#e2ddd6" strokeWidth="0.5" />
        ))}
        {V_STREETS.map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100"
                stroke="#e2ddd6" strokeWidth="0.5" />
        ))}

        {/* A couple of diagonal "diagonal" streets */}
        <line x1="0" y1="40" x2="40" y2="0"  stroke="#dad8d2" strokeWidth="0.7" />
        <line x1="60" y1="100" x2="100" y2="60" stroke="#dad8d2" strokeWidth="0.7" />

        {/* Lake Michigan (right edge) */}
        <rect x="82" y="0" width="18" height="100" fill="#bfdbfe" opacity="0.6" />
        <text x="88" y="50" fontSize="2.5" fill="#3b82f6" textAnchor="middle"
              fontFamily="sans-serif" transform="rotate(90 88 50)">
          Lake Michigan
        </text>

        {/* Neighbourhood zones */}
        {ZONES.map((z) => (
          <g key={z.name}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h}
                  fill={z.color} opacity="0.55" rx="1" />
            <text
              x={z.x + z.w / 2} y={z.y + z.h / 2}
              fontSize="2.8" textAnchor="middle" dominantBaseline="middle"
              fill="#374151" fontFamily="sans-serif" fontWeight="600"
            >
              {z.name}
            </text>
          </g>
        ))}

        {/* Property pins */}
        {mockListings.map((listing, i) => (
          <g key={listing.id}>
            <circle
              cx={listing.mapPin.x} cy={listing.mapPin.y} r="2.2"
              fill="#4f46e5" stroke="white" strokeWidth="0.8"
            />
            <text
              x={listing.mapPin.x} y={listing.mapPin.y}
              fontSize="1.7" textAnchor="middle" dominantBaseline="middle"
              fill="white" fontFamily="sans-serif" fontWeight="bold"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 rounded-lg bg-white/90 backdrop-blur-sm
                      px-2.5 py-1.5 text-xs text-slate-600 shadow-sm border border-slate-200">
        <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-1">
          <span className="h-3 w-3 rounded-full bg-brand-600 inline-block" />
          Property pins
        </div>
        {ZONES.map((z) => (
          <div key={z.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm inline-block border border-slate-200"
                  style={{ background: z.color }} />
            {z.name}
          </div>
        ))}
      </div>

      {/* Mock map attribution */}
      <div className="absolute bottom-2 right-2 text-[10px] text-slate-400">
        © Rising Home Mock Map
      </div>
    </div>
  );
}
