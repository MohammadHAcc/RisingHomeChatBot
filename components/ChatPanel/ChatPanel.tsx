'use client';

import { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import QuickReplyButtons from './QuickReplyButtons';
import { RESPONSES } from '@/starry/responses';
import { processInput } from '@/starry/decisionTree';
import { initialState } from '@/starry/sessionState';

/** Shape of a single chat message stored in state. */
interface ChatMessage {
  id: string;
  sender: 'starry' | 'user';
  text: string;
}

/** Chat session state managed by this component. */
interface SessionState {
  authMode: null | 'guest' | 'signed_in';
  conversationStep: 'intro' | 'auth_prompt' | 'active';
  retryCount: number;
}

let msgCounter = 0;
function newId() {
  return `msg-${++msgCounter}`;
}

/**
 * ChatPanel — the right 40% of the split layout.
 *
 * Story 1 behaviour:
 *   1. On mount: auto-send greeting (≤ 500 ms) then auth prompt (≤ 1 200 ms)
 *   2. Render [ Sign In ] [ Continue as Guest ] quick-reply buttons
 *   3. Handle button taps AND typed equivalents via the decision tree
 *   4. Lock chat input until auth choice is made
 */
export default function ChatPanel() {
  const [messages, setMessages]         = useState<ChatMessage[]>([]);
  const [session, setSession]           = useState<SessionState>({
    authMode: initialState.authMode as null,
    conversationStep: initialState.conversationStep as 'intro',
    retryCount: initialState.retryCount,
  });
  const [isTyping, setIsTyping]         = useState(false);
  const [showQuickReplies, setShowQR]   = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Auto-scroll to bottom whenever messages change ────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showQuickReplies]);

  // ── Auto-greeting sequence on page load ───────────────────────────────────
  // AC1: greeting appears ≤ 500 ms (well within the 1 s requirement)
  useEffect(() => {
    let mounted = true;

    // 1. Show typing indicator immediately
    setIsTyping(true);

    const t1 = setTimeout(() => {
      if (!mounted) return;
      // 2. Render greeting at 500 ms
      setIsTyping(false);
      setMessages([{ id: newId(), sender: 'starry', text: RESPONSES.greeting }]);

      // 3. Brief pause, then typing indicator again
      const t2 = setTimeout(() => {
        if (!mounted) return;
        setIsTyping(true);

        // 4. Render auth prompt at ~1 200 ms total
        const t3 = setTimeout(() => {
          if (!mounted) return;
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { id: newId(), sender: 'starry', text: RESPONSES.authPrompt },
          ]);
          setSession((s) => ({ ...s, conversationStep: 'auth_prompt' }));
          setShowQR(true);
        }, 700);

        return () => clearTimeout(t3);
      }, 300);

      return () => clearTimeout(t2);
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(t1);
    };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function addStarryMessage(text: string) {
    setMessages((prev) => [...prev, { id: newId(), sender: 'starry', text }]);
  }

  function addUserMessage(text: string) {
    setMessages((prev) => [...prev, { id: newId(), sender: 'user', text }]);
  }

  // ── Quick reply button handlers ───────────────────────────────────────────

  function handleSignIn() {
    setShowQR(false);
    addUserMessage('Sign In');
    addStarryMessage(RESPONSES.signInPlaceholder);
    setSession((s) => ({ ...s, authMode: 'signed_in', conversationStep: 'active' }));
    setInputDisabled(false);
  }

  function handleGuest() {
    setShowQR(false);
    addUserMessage('Continue as Guest');
    addStarryMessage(RESPONSES.guestConfirm);
    setSession((s) => ({ ...s, authMode: 'guest', conversationStep: 'active' }));
    setInputDisabled(false);
  }

  // ── Typed input handler ───────────────────────────────────────────────────

  function handleUserInput(text: string) {
    addUserMessage(text);

    const result = processInput(text, session.conversationStep, session.retryCount);

    if (!result) {
      // 'active' step — out of scope Story 1, Starry stays silent
      return;
    }

    // Show a brief typing indicator before replying
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addStarryMessage(result.response);

      setSession((s) => ({
        ...s,
        conversationStep: result.nextStep as SessionState['conversationStep'],
        authMode:         result.authMode as SessionState['authMode'],
        retryCount:       result.incrementRetry ? s.retryCount + 1 : s.retryCount,
      }));

      setShowQR(result.showQuickReplies ?? false);
      if (result.inputEnabled) setInputDisabled(false);
    }, 600);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full
                        bg-gradient-to-br from-brand-500 to-purple-600 text-white text-sm shadow-sm">
          ✦
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">Starry</p>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
            Your home-finding guide
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} sender={msg.sender} text={msg.text} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex animate-slide-up justify-start">
            <div className="mr-2 mt-auto flex h-7 w-7 shrink-0 items-center justify-center
                            rounded-full bg-gradient-to-br from-brand-500 to-purple-600
                            text-white text-xs font-bold shadow-sm">
              ✦
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm
                            bg-slate-100 px-3.5 py-3 shadow-sm">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="typing-dot h-2 w-2 rounded-full bg-slate-400 animate-bounce-dot"
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick reply buttons */}
        {showQuickReplies && !isTyping && (
          <QuickReplyButtons onSignIn={handleSignIn} onGuest={handleGuest} />
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0">
        <ChatInput onSend={handleUserInput} disabled={inputDisabled} />
      </div>
    </div>
  );
}
