/**
 * starry/responses.js
 *
 * Single source of truth for all of Starry's hardcoded copy.
 * No LLM or AI API is used — every string is static (Story 1 constraint).
 *
 * ⚠️  Copy is pending Product Owner approval before launch.
 *     Edit this file only — do not hardcode strings in components.
 */

export const RESPONSES = {
  /** Auto-renders on page load — AC1, AC2 */
  greeting:
    `Hey there! 👋 I'm Starry, your home-finding guide from Rising Home!\n\n` +
    `Here's what I can do for you:\n` +
    `🏘 Find neighborhoods that match your vibe and budget\n` +
    `📅 Schedule tours or calls with an agent\n` +
    `💡 Give you tips on renting vs. buying\n` +
    `🧭 Help you navigate this site\n\n` +
    `Ready to get started?`,

  /** Renders immediately after greeting — AC3 */
  authPrompt:
    `First — would you like to sign in for a personalized experience, ` +
    `or just browse as a guest? Either works great!`,

  /** User chose "Continue as Guest" or typed "guest" */
  guestConfirm:
    `Welcome! Let's find your perfect place. 🏡 ` +
    `You can ask me about neighborhoods, properties, or anything home-related.`,

  /** User chose "Sign In" — out of scope, defaults to guest for now */
  signInPlaceholder:
    `Great! Sign-in is coming soon. For now, let's get you started as a guest. 😊`,

  /**
   * Sent when the user types before the intro completes.
   * Decision tree still shows auth prompt afterward — AC3.
   */
  offTopic:
    `Hmm, that's a little outside my expertise! 😊 ` +
    `I'm best at helping you find a home. Want to get started?`,

  /**
   * Sent for unrecognised input at the auth prompt.
   * Buttons are re-rendered after. Max 2 retries then default to guest.
   */
  unrecognized:
    `I didn't quite catch that — no worries! ` +
    `Tap a button below or just type "guest" to start browsing.`,
};
