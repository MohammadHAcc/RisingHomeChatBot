'use client';

import { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import QuickReplyButtons from './QuickReplyButtons';
import PropertyPicker from './PropertyPicker';
import TimeSlotButtons from './TimeSlotButtons';
import TourConfirmationCard from './TourConfirmationCard';
import { RESPONSES } from '@/starry/responses';
import { processInput } from '@/starry/decisionTree';
import { initialState } from '@/starry/sessionState';

// ── Types ─────────────────────────────────────────────────────────────────────

type ConversationStep =
  | 'intro' | 'auth_prompt' | 'active'
  | 'tour_property' | 'tour_date' | 'tour_time'
  | 'tour_name'     | 'tour_contact' | 'tour_complete';

interface TourBooking {
  propertyId:      string | null;
  propertyAddress: string | null;
  date:            string | null;
  timeSlot:        string | null;
  guestName:       string | null;
  contact:         string | null;
}

interface ChatMessage {
  id: string;
  sender: 'starry' | 'user';
  text: string;
}

interface SessionState {
  authMode:         null | 'guest' | 'signed_in';
  conversationStep: ConversationStep;
  retryCount:       number;
}

// ── ID counter ────────────────────────────────────────────────────────────────

let msgCounter = 0;
const newId = () => `msg-${++msgCounter}`;

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * ChatPanel — the right 40% of the split layout.
 *
 * Manages all Starry conversation state:
 *   Story 1 — auto-greeting, auth prompt, guest/sign-in choice
 *   Story 3 — multi-step tour scheduling flow
 */
export default function ChatPanel() {
  const [messages, setMessages]         = useState<ChatMessage[]>([]);
  const [session, setSession]           = useState<SessionState>({
    authMode:         initialState.authMode as null,
    conversationStep: initialState.conversationStep as ConversationStep,
    retryCount:       initialState.retryCount,
  });
  const [tourBooking, setTourBooking]   = useState<TourBooking>(initialState.tourBooking);

  // UI-only flags
  const [isTyping, setIsTyping]           = useState(false);
  const [showQuickReplies, setShowQR]     = useState(false);
  const [showPropertyPicker, setShowProp] = useState(false);
  const [showTimeSlots, setShowTime]      = useState(false);
  const [showConfirmCard, setShowConfirm] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Scroll to bottom on any chat change ──────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showQuickReplies, showPropertyPicker, showTimeSlots, showConfirmCard]);

  // ── Auto-greeting on page load (Story 1 — AC1) ───────────────────────────────
  useEffect(() => {
    let mounted = true;
    setIsTyping(true);

    const t1 = setTimeout(() => {
      if (!mounted) return;
      setIsTyping(false);
      setMessages([{ id: newId(), sender: 'starry', text: RESPONSES.greeting }]);

      const t2 = setTimeout(() => {
        if (!mounted) return;
        setIsTyping(true);

        const t3 = setTimeout(() => {
          if (!mounted) return;
          setIsTyping(false);
          setMessages((prev) => [...prev, { id: newId(), sender: 'starry', text: RESPONSES.authPrompt }]);
          setSession((s) => ({ ...s, conversationStep: 'auth_prompt' }));
          setShowQR(true);
        }, 700);

        return () => clearTimeout(t3);
      }, 300);

      return () => clearTimeout(t2);
    }, 500);

    return () => { mounted = false; clearTimeout(t1); };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const addStarry = (text: string) =>
    setMessages((prev) => [...prev, { id: newId(), sender: 'starry', text }]);

  const addUser = (text: string) =>
    setMessages((prev) => [...prev, { id: newId(), sender: 'user', text }]);

  /** Applies a TreeResult to all state slices. */
  function applyResult(
    result: ReturnType<typeof processInput>,
    mergedTour?: Partial<TourBooking>
  ) {
    if (!result) return;

    const nextTour = mergedTour
      ? { ...tourBooking, ...mergedTour, ...(result.tourUpdate ?? {}) }
      : { ...tourBooking, ...(result.tourUpdate ?? {}) };

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addStarry(result.response);

      setSession((s) => ({
        ...s,
        conversationStep: result.nextStep as ConversationStep,
        authMode:         (result.authMode ?? s.authMode) as SessionState['authMode'],
        retryCount:       result.incrementRetry ? s.retryCount + 1 : (result.retryCount ?? s.retryCount),
      }));

      setTourBooking(nextTour as TourBooking);

      // UI flags
      setShowQR(result.showQuickReplies      ?? false);
      setShowProp(result.showPropertyPicker  ?? false);
      setShowTime(result.showTimeSlots       ?? false);

      if (result.isConfirmation) {
        setTimeout(() => {
          setShowConfirm(true);
          addStarry(RESPONSES.tour.confirmClose);
        }, 300);
      }

      if (result.inputEnabled)  setInputDisabled(false);
      if (result.inputDisabled) setInputDisabled(true);
    }, 600);
  }

  // ── Auth handlers (Story 1) ───────────────────────────────────────────────────

  function handleSignIn() {
    setShowQR(false);
    addUser('Sign In');
    addStarry(RESPONSES.signInPlaceholder);
    setSession((s) => ({ ...s, authMode: 'signed_in', conversationStep: 'active' }));
    setInputDisabled(false);
  }

  function handleGuest() {
    setShowQR(false);
    addUser('Continue as Guest');
    addStarry(RESPONSES.guestConfirm);
    setSession((s) => ({ ...s, authMode: 'guest', conversationStep: 'active' }));
    setInputDisabled(false);
  }

  // ── Tour handlers (Story 3) ───────────────────────────────────────────────────

  function handlePropertySelect(propertyId: string, propertyAddress: string) {
    setShowProp(false);
    addUser(propertyAddress.split(',')[0]);
    const merged = { propertyId, propertyAddress };
    const result = processInput(propertyAddress, 'tour_property', session.retryCount, tourBooking);
    applyResult(result, merged);
  }

  function handleTimeSlotSelect(payload: string, label: string) {
    setShowTime(false);
    addUser(label);
    const result = processInput(payload, 'tour_time', session.retryCount, tourBooking);
    applyResult(result);
  }

  // ── Generic text input handler ────────────────────────────────────────────────

  function handleUserInput(text: string) {
    // Hide all pickers on text submit
    setShowProp(false);
    setShowTime(false);
    addUser(text);

    const result = processInput(text, session.conversationStep, session.retryCount, tourBooking);
    if (!result) return;
    applyResult(result);
  }

  // ── Derive input type from current step ───────────────────────────────────────

  const inputType = session.conversationStep === 'tour_date' ? 'date' : 'text';

  // After the confirmation is shown, find the merged booking for display
  const finalBooking: TourBooking = showConfirmCard
    ? tourBooking
    : initialState.tourBooking;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
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

      {/* ── Messages ───────────────────────────────────────────────────────── */}
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
                <span key={i}
                      className="typing-dot h-2 w-2 rounded-full bg-slate-400 animate-bounce-dot" />
              ))}
            </div>
          </div>
        )}

        {/* Story 1 — Auth quick replies */}
        {showQuickReplies && !isTyping && (
          <QuickReplyButtons onSignIn={handleSignIn} onGuest={handleGuest} />
        )}

        {/* Story 3 — Property picker */}
        {showPropertyPicker && !isTyping && (
          <PropertyPicker onSelect={handlePropertySelect} />
        )}

        {/* Story 3 — Time slot buttons */}
        {showTimeSlots && !isTyping && (
          <TimeSlotButtons onSelect={handleTimeSlotSelect} />
        )}

        {/* Story 3 — Confirmation card */}
        {showConfirmCard && (
          <TourConfirmationCard booking={finalBooking} />
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ──────────────────────────────────────────────────────────── */}
      <div className="shrink-0">
        <ChatInput
          onSend={handleUserInput}
          disabled={inputDisabled}
          inputType={inputType}
        />
      </div>
    </div>
  );
}
