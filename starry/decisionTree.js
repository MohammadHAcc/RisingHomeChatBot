/**
 * starry/decisionTree.js
 *
 * Pure rule-based conversation logic for Starry.
 * All branching is keyword / button matching — no LLM or dynamic generation.
 *
 * processInput() is called by ChatPanel on every user submission.
 * The auto-greeting sequence on page load is handled separately in ChatPanel.
 *
 * @typedef {import('./sessionState').ConversationStep} ConversationStep
 * @typedef {import('./sessionState').AuthMode}         AuthMode
 * @typedef {import('./sessionState').TourBooking}      TourBooking
 *
 * @typedef {Object} TreeResult
 * @property {string}            response
 * @property {ConversationStep}  nextStep
 * @property {AuthMode}          [authMode]
 * @property {boolean}           [showQuickReplies]    Auth buttons
 * @property {boolean}           [showPropertyPicker]  Tour property buttons
 * @property {boolean}           [showTimeSlots]       Tour time-slot buttons
 * @property {boolean}           [isConfirmation]      Show TourConfirmationCard
 * @property {boolean}           [inputEnabled]
 * @property {boolean}           [inputDisabled]
 * @property {Partial<TourBooking>} [tourUpdate]       Fields to merge into tourBooking
 * @property {boolean}           [incrementRetry]
 */

import { RESPONSES } from './responses.js';
import { mockListings } from '../data/mockListings.js';

// ── Keyword matchers ──────────────────────────────────────────────────────────

function isSignIn(text) {
  return /\b(sign[\s-]?in|signin|log[\s-]?in|login)\b/i.test(text);
}

function isGuest(text) {
  return /\b(guest|continue|browse|no|skip)\b/i.test(text);
}

function isTourRequest(text) {
  return /\b(schedule|book|arrange|tour|visit|showing|see the place|view)\b/i.test(text);
}

/**
 * Returns 'morning' | 'afternoon' | 'evening' | null.
 * Also handles button payloads (TOUR_TIME_*).
 */
function matchTimeSlot(text) {
  if (/^TOUR_TIME_MORNING$/i.test(text) || /\b(morning|9am|9 am|early)\b/i.test(text))
    return 'morning';
  if (/^TOUR_TIME_AFTERNOON$/i.test(text) || /\b(afternoon|noon|12pm|midday|lunch|afternoon)\b/i.test(text))
    return 'afternoon';
  if (/^TOUR_TIME_EVENING$/i.test(text) || /\b(evening|5pm|6pm|7pm|pm|late|tonight)\b/i.test(text))
    return 'evening';
  return null;
}

/** Basic email or phone validation. */
function isValidContact(text) {
  const emailRe = /\S+@\S+\.\S+/;
  const phoneRe = /\d{3}[\s.\-]?\d{3}[\s.\-]?\d{4}/;
  return emailRe.test(text) || phoneRe.test(text);
}

/**
 * Attempts to match typed text against mock listings.
 * Returns the matched listing or null.
 */
function findListing(text) {
  const lower = text.toLowerCase();
  return (
    mockListings.find((l) =>
      lower.includes(l.neighborhood.toLowerCase()) ||
      lower.includes(l.address.toLowerCase().split(',')[0])
    ) ?? null
  );
}

/** Pretty-formats a time slot label. */
export function timeSlotLabel(slot) {
  return slot === 'morning'   ? 'Morning (9am – 12pm)'
       : slot === 'afternoon' ? 'Afternoon (12pm – 5pm)'
       : slot === 'evening'   ? 'Evening (5pm – 7pm)'
       : slot;
}

/** Pretty-formats an ISO date string for display. */
export function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * @param {string}           userInput
 * @param {ConversationStep} conversationStep
 * @param {number}           retryCount
 * @param {TourBooking}      tourBooking   Current accumulated booking data
 * @returns {TreeResult | null}  null = no reply (active step, out of scope)
 */
export function processInput(userInput, conversationStep, retryCount, tourBooking = {}) {
  const text = (userInput || '').trim();

  // ── auth_prompt ─────────────────────────────────────────────────────────────
  if (conversationStep === 'auth_prompt') {
    if (isSignIn(text)) return { response: RESPONSES.signInPlaceholder, nextStep: 'active', authMode: 'signed_in', inputEnabled: true };
    if (isGuest(text))  return { response: RESPONSES.guestConfirm,      nextStep: 'active', authMode: 'guest',     inputEnabled: true };
    if (retryCount >= 1) return { response: RESPONSES.guestConfirm,     nextStep: 'active', authMode: 'guest',     inputEnabled: true };
    return { response: RESPONSES.unrecognized, nextStep: 'auth_prompt', showQuickReplies: true, inputEnabled: false, incrementRetry: true };
  }

  // ── intro (typed before greeting finished) ───────────────────────────────────
  if (conversationStep === 'intro') {
    return { response: RESPONSES.offTopic, nextStep: 'auth_prompt', showQuickReplies: true, inputEnabled: false };
  }

  // ── active ───────────────────────────────────────────────────────────────────
  if (conversationStep === 'active') {
    if (isTourRequest(text)) {
      return {
        response: RESPONSES.tour.initiate,
        nextStep: 'tour_property',
        showPropertyPicker: true,
        inputEnabled: true,
      };
    }
    return { response: RESPONSES.activeUnknown, nextStep: 'active', inputEnabled: true };
  }

  // ── tour_property ────────────────────────────────────────────────────────────
  if (conversationStep === 'tour_property') {
    if (!text) return null;

    // Try to match a known listing; fall back to free text
    const matched = findListing(text);
    const propertyId      = matched?.id      ?? null;
    const propertyAddress = matched?.address ?? text;

    return {
      response: RESPONSES.tour.askDate,
      nextStep: 'tour_date',
      tourUpdate: { propertyId, propertyAddress },
      showPropertyPicker: false,
      inputEnabled: true,
    };
  }

  // ── tour_date ────────────────────────────────────────────────────────────────
  if (conversationStep === 'tour_date') {
    if (!text) return null;
    return {
      response: RESPONSES.tour.askTime,
      nextStep: 'tour_time',
      tourUpdate: { date: text },
      showTimeSlots: true,
      inputDisabled: true,   // force button selection
    };
  }

  // ── tour_time ────────────────────────────────────────────────────────────────
  if (conversationStep === 'tour_time') {
    const slot = matchTimeSlot(text);
    if (!slot) {
      return {
        response: `I didn't catch that — please tap one of the time options above! 👆`,
        nextStep: 'tour_time',
        showTimeSlots: true,
        inputDisabled: true,
      };
    }
    return {
      response: RESPONSES.tour.askName,
      nextStep: 'tour_name',
      tourUpdate: { timeSlot: slot },
      showTimeSlots: false,
      inputEnabled: true,
    };
  }

  // ── tour_name ────────────────────────────────────────────────────────────────
  if (conversationStep === 'tour_name') {
    if (!text || text.length < 2) {
      return {
        response: `Could you share your name so we can personalise your confirmation? 😊`,
        nextStep: 'tour_name',
        inputEnabled: true,
      };
    }
    // Capitalise first letter of each word
    const name = text.replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      response: RESPONSES.tour.askContact,
      nextStep: 'tour_contact',
      tourUpdate: { guestName: name },
      inputEnabled: true,
    };
  }

  // ── tour_contact ─────────────────────────────────────────────────────────────
  if (conversationStep === 'tour_contact') {
    if (!isValidContact(text)) {
      if (retryCount >= 1) {
        // Accept anything after two attempts — don't block the user
        return buildConfirmation(text, tourBooking);
      }
      return {
        response: RESPONSES.tour.badContact,
        nextStep: 'tour_contact',
        inputEnabled: true,
        incrementRetry: true,
      };
    }
    return buildConfirmation(text, tourBooking);
  }

  // ── tour_complete / any mid-flow unrecognised ────────────────────────────────
  return null;
}

/** Builds the confirmation result for the final tour_contact step. */
function buildConfirmation(contact, tourBooking) {
  const name = tourBooking.guestName ?? 'there';
  return {
    response: RESPONSES.tour.confirmIntro(name),
    nextStep: 'tour_complete',
    tourUpdate: { contact },
    isConfirmation: true,
    inputEnabled: true,
    retryCount: 0,
  };
}
