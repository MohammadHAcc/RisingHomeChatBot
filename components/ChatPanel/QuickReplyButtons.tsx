'use client';

interface QuickReplyButtonsProps {
  onSignIn: () => void;
  onGuest: () => void;
}

/**
 * Renders the [ Sign In ] and [ Continue as Guest ] inline chat buttons — AC3.
 * Both options have equal visual weight (same size/style, different fill).
 */
export default function QuickReplyButtons({ onSignIn, onGuest }: QuickReplyButtonsProps) {
  return (
    <div className="flex animate-slide-up justify-start pl-9 gap-2 flex-wrap">
      <button
        onClick={onSignIn}
        className="rounded-full border-2 border-brand-600 px-4 py-1.5
                   text-sm font-semibold text-brand-600 hover:bg-brand-50
                   active:scale-95 transition-all"
      >
        Sign In
      </button>
      <button
        onClick={onGuest}
        className="rounded-full border-2 border-brand-600 bg-brand-600 px-4 py-1.5
                   text-sm font-semibold text-white hover:bg-brand-700
                   active:scale-95 transition-all"
      >
        Continue as Guest
      </button>
    </div>
  );
}
