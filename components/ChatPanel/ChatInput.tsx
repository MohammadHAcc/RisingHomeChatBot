'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

/**
 * Chat text input bar at the bottom of the chat panel.
 * Disabled during the intro / auth-prompt phase — only unlocks once the
 * user has completed the auth choice.
 */
export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder={
          disabled
            ? 'Choose an option above to get started…'
            : 'Ask Starry anything about homes…'
        }
        className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2
                   text-sm text-slate-800 placeholder:text-slate-400
                   focus:outline-none focus:ring-2 focus:ring-brand-400
                   disabled:cursor-not-allowed disabled:opacity-50
                   transition-all"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                   bg-brand-600 text-white shadow-sm hover:bg-brand-700
                   disabled:opacity-40 disabled:cursor-not-allowed
                   active:scale-95 transition-all"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M3.105 3.105a1 1 0 011.09-.217l13 5a1 1 0 010 1.848l-13 5a1 1
                   0 01-1.31-1.3L4.585 10 2.886 4.563a1 1 0 01.219-1.458z" />
        </svg>
      </button>
    </div>
  );
}
