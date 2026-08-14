'use client';

interface ChatBubbleProps {
  sender: 'starry' | 'user';
  text: string;
}

/**
 * Renders a single chat message bubble.
 * Starry messages appear on the left; user messages on the right.
 * Newlines in the text are preserved.
 */
export default function ChatBubble({ sender, text }: ChatBubbleProps) {
  const isStarry = sender === 'starry';

  return (
    <div className={`flex animate-slide-up ${isStarry ? 'justify-start' : 'justify-end'}`}>
      {/* Starry avatar */}
      {isStarry && (
        <div className="mr-2 mt-auto shrink-0 flex h-7 w-7 items-center justify-center
                        rounded-full bg-gradient-to-br from-brand-500 to-purple-600
                        text-white text-xs font-bold shadow-sm">
          ✦
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm
          ${isStarry
            ? 'rounded-tl-sm bg-slate-100 text-slate-800'
            : 'rounded-tr-sm bg-brand-600 text-white'}`}
        style={{ whiteSpace: 'pre-line' }}
      >
        {text}
      </div>
    </div>
  );
}
