/**
 * starry/decisionTree.js
 *
 * Pure rule-based conversation logic for Starry.
 * No LLM or dynamic generation — all branching is keyword / button matching.
 *
 * processInput() is called by ChatPanel when the user submits text.
 * The auto-greeting sequence (on page load) is handled separately in ChatPanel.
 *
 * @typedef {import('./sessionState').ConversationStep} ConversationStep
 * @typedef {import('./sessionState').AuthMode} AuthMode
 *
 * @typedef {Object} TreeResult
 * @property {string}            response         Text Starry will say
 * @property {ConversationStep}  nextStep         Updated conversation step
 * @property {AuthMode}          authMode         Updated auth mode
 * @property {boolean}           showQuickReplies Whether to re-show auth buttons
 * @property {boolean}           inputEnabled     Whether chat input should unlock
 * @property {boolean}           [incrementRetry] Whether to bump the retry counter
 */

import { RESPONSES } from './responses.js';

// ── Keyword matchers ──────────────────────────────────────────────────────────

function isSignIn(text) {
  return /\b(sign[\s-]?in|signin|log[\s-]?in|login)\b/i.test(text);
}

function isGuest(text) {
  return /\b(guest|continue|browse|no|skip)\b/i.test(text);
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Processes a user text input and returns what Starry should do next.
 *
 * @param {string}           userInput
 * @param {ConversationStep} conversationStep
 * @param {number}           retryCount
 * @returns {TreeResult}
 */
export function processInput(userInput, conversationStep, retryCount) {
  const text = (userInput || '').trim();

  // ── auth_prompt step ────────────────────────────────────────────────────────
  if (conversationStep === 'auth_prompt') {
    if (isSignIn(text)) {
      return {
        response: RESPONSES.signInPlaceholder,
        nextStep: 'active',
        authMode: 'signed_in', // treated as guest internally
        showQuickReplies: false,
        inputEnabled: true,
      };
    }

    if (isGuest(text)) {
      return {
        response: RESPONSES.guestConfirm,
        nextStep: 'active',
        authMode: 'guest',
        showQuickReplies: false,
        inputEnabled: true,
      };
    }

    // Unrecognised — after 2 retries default to guest
    if (retryCount >= 1) {
      return {
        response: RESPONSES.guestConfirm,
        nextStep: 'active',
        authMode: 'guest',
        showQuickReplies: false,
        inputEnabled: true,
      };
    }

    return {
      response: RESPONSES.unrecognized,
      nextStep: 'auth_prompt',
      authMode: null,
      showQuickReplies: true,
      inputEnabled: false,
      incrementRetry: true,
    };
  }

  // ── intro step (user typed before auto-greeting finished) ──────────────────
  if (conversationStep === 'intro') {
    return {
      response: RESPONSES.offTopic,
      nextStep: 'auth_prompt',
      authMode: null,
      showQuickReplies: true,
      inputEnabled: false,
    };
  }

  // ── active step — out of scope for Story 1 ─────────────────────────────────
  return null;
}
