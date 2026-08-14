'use client';

import MapPanel from '@/components/MapPanel/MapPanel';
import ChatPanel from '@/components/ChatPanel/ChatPanel';

/**
 * SplitLayout
 *
 * The top-level split-screen container.
 *   Left  60% — interactive map + property listings
 *   Right 40% — Starry chat panel
 *
 * Desktop-first; mobile layout is out of scope for Story 1.
 */
export default function SplitLayout() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* ── Nav bar ──────────────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-10 flex h-12 items-center justify-between
                      border-b border-slate-200 bg-white px-5 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <span className="flex h-7 w-7 items-center justify-center
                           rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 text-white text-sm font-bold">
            R
          </span>
          <span className="text-sm font-semibold text-slate-800 tracking-tight">
            Rising Home
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="hidden sm:inline">Chicago, IL</span>
          <button className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-medium text-white
                             hover:bg-brand-600 transition-colors">
            Sign In
          </button>
        </div>
      </div>

      {/* ── Split panels (offset by nav height) ──────────────────────────── */}
      <div className="flex w-full pt-12 h-full">
        {/* Left panel — 60% */}
        <div className="hidden lg:flex flex-col" style={{ width: '60%' }}>
          <MapPanel />
        </div>

        {/* Right panel — 40% */}
        <div
          className="flex flex-col border-l border-slate-200 bg-white"
          style={{ width: '40%', minWidth: '360px', flex: '1 1 auto' }}
        >
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
