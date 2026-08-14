/**
 * starry/responses.js
 *
 * Single source of truth for all of Starry's hardcoded copy.
 * No LLM or AI API is used — every string is static.
 *
 * ⚠️  Copy is pending Product Owner approval before launch.
 *     Edit this file only — do not hardcode strings in components.
 */

export const RESPONSES = {
  // ── Story 1: Introduction ───────────────────────────────────────────────────

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

  offTopic:
    `Hmm, that's a little outside my expertise! 😊 ` +
    `I'm best at helping you find a home. Want to get started?`,

  unrecognized:
    `I didn't quite catch that — no worries! ` +
    `Tap a button below or just type "guest" to start browsing.`,

  // ── Story 3: Tour Scheduling ─────────────────────────────────────────────────

  tour: {
    /** Kicks off the flow — shown after user says "schedule a tour" etc. */
    initiate:
      `I'd love to help you book a tour! 🏠\n\n` +
      `Which property are you interested in? ` +
      `Tap one below or type the address or neighborhood.`,

    /** After property is selected */
    askDate:
      `Great choice! 📅 What date works best for you? ` +
      `We have availability Monday through Saturday.`,

    /** After date is entered */
    askTime: `Perfect! What time of day works for you?`,

    /** After time slot is picked */
    askName: `Almost there! What's your name?`,

    /** After name is entered */
    askContact:
      `And what's the best way to reach you? ` +
      `Drop your email or phone number and we'll send a confirmation.`,

    /**
     * Final confirmation intro — shown above the summary card.
     * @param {string} name
     */
    confirmIntro: (name) => `You're all set, ${name}! 🎉 Here's your tour summary:`,

    /** Shown below the confirmation card */
    confirmClose:
      `A Rising Home agent will confirm your tour within 24 hours. ` +
      `In the meantime, feel free to keep browsing!`,

    /** Typed input didn't match a known property — accept and move on */
    propertyAccepted: (address) =>
      `Got it — I've noted **${address}**. 📅 What date works best for you? ` +
      `We have availability Monday through Saturday.`,

    /** Bad contact format on first try */
    badContact:
      `Hmm, that doesn't look like an email or phone number. ` +
      `Could you double-check? (e.g. jane@email.com or 312-555-0100)`,

    /** User typed during an active tour step that expects a specific input */
    midFlowPrompt:
      `Let's finish booking your tour first! ` +
      `Answer the question above and we'll get you set up. 😊`,
  },

  /** Shown in the active step when Starry doesn't recognise the request */
  activeUnknown:
    `I'm still learning! 😊 Right now I can help you ` +
    `**schedule a tour** or browse properties. What would you like to do?`,
};
