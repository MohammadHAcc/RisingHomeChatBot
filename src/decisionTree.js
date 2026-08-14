/**
 * decisionTree.js
 *
 * Rule-based conversation logic for Starry (Story 1 — Starry Introduction).
 *
 * All branching is keyword-based; no dynamic generation. Returns an ordered
 * array of message objects the webhook will send in sequence.
 *
 * A message object is one of:
 *   { type: 'text',        text: string }
 *   { type: 'quickReply',  text: string, quickReplies: array }
 */

'use strict';

const { RESPONSES, QUICK_REPLIES } = require('./responses');
const sessionStore = require('./sessionStore');

// ---------------------------------------------------------------------------
// Keyword matchers
// ---------------------------------------------------------------------------

/** Returns true if input matches the "sign in" intent. */
function isSignIn(text) {
  return /\b(sign[\s-]?in|signin|log[\s-]?in|login)\b/i.test(text);
}

/** Returns true if input matches the "guest" intent. */
function isGuest(text) {
  return /\b(guest|continue|browse|no|skip)\b/i.test(text);
}

// ---------------------------------------------------------------------------
// Message builders
// ---------------------------------------------------------------------------

function textMsg(text) {
  return { type: 'text', text };
}

function authPromptMsg() {
  return {
    type: 'quickReply',
    text: RESPONSES.authPrompt,
    quickReplies: QUICK_REPLIES.authOptions,
  };
}

// ---------------------------------------------------------------------------
// Decision tree
// ---------------------------------------------------------------------------

/**
 * Processes an inbound Messenger event and returns the messages Starry should
 * send in response. Also advances the session state.
 *
 * @param {string} senderId - Facebook PSID
 * @param {string} userText - Normalised text from the Messenger event
 *                            (message.text or quick_reply.payload)
 * @returns {Array<object>} ordered array of message objects
 */
function handle(senderId, userText) {
  const session = sessionStore.getOrCreate(senderId);
  const normalised = (userText || '').trim();

  // ── Step: intro ────────────────────────────────────────────────────────────
  // The user's first message (any content) triggers the greeting.
  if (session.conversation_step === 'intro') {
    sessionStore.update(senderId, { conversation_step: 'auth_prompt' });

    // Off-topic first message: prepend the off-topic nudge before the greeting.
    const isCapabilityRelated = isSignIn(normalised) || isGuest(normalised);
    const msgs = [];

    if (!isCapabilityRelated && normalised.length > 0) {
      msgs.push(textMsg(RESPONSES.offTopic));
    }

    msgs.push(textMsg(RESPONSES.greeting));
    msgs.push(authPromptMsg());
    return msgs;
  }

  // ── Step: auth_prompt ──────────────────────────────────────────────────────
  // The user is deciding between Sign In and Guest.
  if (session.conversation_step === 'auth_prompt') {
    // Button payload match or keyword match → Sign In
    if (normalised === 'AUTH_SIGN_IN' || isSignIn(normalised)) {
      sessionStore.update(senderId, {
        auth_mode: 'signed_in',
        conversation_step: 'complete',
      });
      return [textMsg(RESPONSES.signInAck)];
    }

    // Button payload match or keyword match → Guest
    if (normalised === 'AUTH_GUEST' || isGuest(normalised)) {
      sessionStore.update(senderId, {
        auth_mode: 'guest',
        conversation_step: 'complete',
      });
      return [textMsg(RESPONSES.guestAck)];
    }

    // Unrecognised reply — send clarification once, re-show buttons
    return [textMsg(RESPONSES.unrecognized), authPromptMsg()];
  }

  // ── Step: complete ─────────────────────────────────────────────────────────
  // Auth choice was made; further handling is out of scope for Story 1.
  // Return empty so the webhook logs but does not reply.
  return [];
}

module.exports = { handle };
