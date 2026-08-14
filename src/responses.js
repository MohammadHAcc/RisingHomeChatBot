/**
 * responses.js
 *
 * All hardcoded response strings for Starry.
 * No LLM API is used — every reply is a static string (Story 1 constraint).
 *
 * Copy is subject to Product Owner approval before launch.
 */

'use strict';

const RESPONSES = {
  /** Sent immediately on the first inbound message — AC1, AC2 */
  greeting:
    "Hey there! 👋 I'm Starry, your home-finding guide from Rising Home!\n\n" +
    "Here's what I can do for you:\n" +
    '🏘 Find neighborhoods that match your vibe and budget\n' +
    '📅 Schedule tours or calls with an agent\n' +
    '💡 Give you tips on renting vs. buying\n' +
    '🧭 Help you navigate the Rising Home site\n\n' +
    'Ready to get started?',

  /** Sent right after the greeting — AC3 */
  authPrompt:
    'First — would you like to sign in to your Rising Home account for a ' +
    'personalized experience, or just browse as a guest? Either works great!',

  /** Placeholder until sign-in flow is built (out of scope Story 1) */
  signInAck: "Great! Sign-in is coming soon — we're working on it! 🔒",

  /** Placeholder until guest flow is built (out of scope Story 1) */
  guestAck: "Welcome, guest! Let's find your home. 🏠",

  /**
   * Sent when a user's first message is off-topic.
   * Decision tree still continues to the auth prompt afterward — AC3.
   */
  offTopic:
    "Hmm, I'm not sure I can help with that! 😊 " +
    "I'm best at helping you find a home. Want to get started?",

  /**
   * Sent when a user replies with something unrecognised at the auth-prompt step.
   * Quick Reply buttons are re-sent after this — AC3.
   */
  unrecognized:
    "I didn't quite catch that — no worries! " +
    'You can say "guest" to browse freely, or "sign in" if you have a Rising Home account.',
};

/**
 * Quick Reply button definitions for the auth prompt.
 * See: https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies/
 */
const QUICK_REPLIES = {
  authOptions: [
    {
      content_type: 'text',
      title: 'Sign In',
      payload: 'AUTH_SIGN_IN',
    },
    {
      content_type: 'text',
      title: 'Continue as Guest',
      payload: 'AUTH_GUEST',
    },
  ],
};

module.exports = { RESPONSES, QUICK_REPLIES };
