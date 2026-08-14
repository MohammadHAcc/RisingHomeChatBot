/**
 * decisionTree.test.js
 *
 * Unit tests for the Starry Introduction decision tree (Story 1).
 * Covers all AC acceptance criteria and edge cases.
 */

'use strict';

const decisionTree = require('../src/decisionTree');
const sessionStore = require('../src/sessionStore');

beforeEach(() => {
  sessionStore.clear();
});

// ─── Helper ─────────────────────────────────────────────────────────────────

/** Returns the message type array for a given sender + input. */
function send(senderId, text) {
  return decisionTree.handle(senderId, text);
}

// ─── AC1 & AC2: Greeting triggered on any first message ─────────────────────

describe('First message — greeting flow', () => {
  test('returns greeting and auth prompt on any first text', () => {
    const msgs = send('user1', 'Hello');
    const types  = msgs.map((m) => m.type);
    const texts  = msgs.map((m) => m.text);

    // Should always end with a quick-reply auth prompt
    expect(types).toContain('quickReply');
    // Greeting text must mention Starry and at least two capabilities
    const greeting = texts.find((t) => t.includes('Starry'));
    expect(greeting).toBeDefined();
    expect(greeting).toMatch(/neighborhood/i);
    expect(greeting).toMatch(/tour/i);
    expect(greeting).toMatch(/renting/i);
    expect(greeting).toMatch(/navigate/i);
  });

  test('greeting contains no real-estate jargon — AC4', () => {
    const msgs  = send('user2', 'Hi');
    const allText = msgs.map((m) => m.text).join(' ');
    const jargon = ['MLS', 'cap rate', 'escrow', 'contingency'];
    jargon.forEach((word) => {
      expect(allText.toLowerCase()).not.toContain(word.toLowerCase());
    });
  });

  test('session step advances to auth_prompt after first message', () => {
    send('user3', 'Hey');
    const session = sessionStore.get('user3');
    expect(session.conversation_step).toBe('auth_prompt');
  });
});

// ─── Off-topic first message ─────────────────────────────────────────────────

describe('Off-topic first message', () => {
  test('prepends off-topic message before greeting', () => {
    const msgs = send('user4', "What's the weather?");
    // First message should be the off-topic nudge
    expect(msgs[0].text).toMatch(/not sure I can help with that/i);
    // Greeting still follows
    const hasGreeting = msgs.some((m) => m.text && m.text.includes('Starry'));
    expect(hasGreeting).toBe(true);
    // Auth prompt with quick replies still appears at the end
    const hasQR = msgs.some((m) => m.type === 'quickReply');
    expect(hasQR).toBe(true);
  });

  test('off-topic still advances session to auth_prompt', () => {
    send('user5', 'Tell me a joke');
    expect(sessionStore.get('user5').conversation_step).toBe('auth_prompt');
  });
});

// ─── AC3: Auth prompt — Sign In ───────────────────────────────────────────────

describe('Auth prompt — sign in branch', () => {
  const cases = [
    ['typed "sign in"',     'sign in'],
    ['typed "Sign In"',     'Sign In'],
    ['typed "signin"',      'signin'],
    ['typed "log in"',      'log in'],
    ['typed "login"',       'login'],
    ['button payload',      'AUTH_SIGN_IN'],
  ];

  test.each(cases)('%s triggers sign-in acknowledgement', (_label, input) => {
    // Advance past intro
    send('signUser', 'Hello');
    const msgs = send('signUser', input);
    expect(msgs[0].text).toMatch(/sign-in/i);
    expect(sessionStore.get('signUser').auth_mode).toBe('signed_in');
    expect(sessionStore.get('signUser').conversation_step).toBe('complete');
    // Reset for each case
    sessionStore.remove('signUser');
  });
});

// ─── AC3: Auth prompt — Guest ────────────────────────────────────────────────

describe('Auth prompt — guest branch', () => {
  const cases = [
    ['typed "guest"',            'guest'],
    ['typed "continue"',         'continue'],
    ['typed "browse"',           'browse'],
    ['typed "no"',               'no'],
    ['typed "skip"',             'skip'],
    ['button payload',           'AUTH_GUEST'],
    ['typed "Continue as Guest"','Continue as Guest'],
  ];

  test.each(cases)('%s triggers guest acknowledgement', (_label, input) => {
    send('guestUser', 'Hello');
    const msgs = send('guestUser', input);
    expect(msgs[0].text).toMatch(/welcome, guest/i);
    expect(sessionStore.get('guestUser').auth_mode).toBe('guest');
    expect(sessionStore.get('guestUser').conversation_step).toBe('complete');
    sessionStore.remove('guestUser');
  });
});

// ─── Unrecognised reply at auth prompt ───────────────────────────────────────

describe('Unrecognised reply at auth prompt', () => {
  test('sends clarification then re-shows quick replies', () => {
    send('user6', 'Hello');
    const msgs = send('user6', 'purple elephant');
    expect(msgs[0].text).toMatch(/didn't quite catch that/i);
    // Should re-show quick reply buttons
    const qr = msgs.find((m) => m.type === 'quickReply');
    expect(qr).toBeDefined();
    expect(qr.quickReplies.length).toBeGreaterThanOrEqual(2);
    // Session stays at auth_prompt for another attempt
    expect(sessionStore.get('user6').conversation_step).toBe('auth_prompt');
  });
});

// ─── Complete step — no reply after auth is set ───────────────────────────────

describe('Conversation complete step', () => {
  test('returns empty array when session is already complete', () => {
    send('user7', 'Hello');
    send('user7', 'guest');
    // Any further message at 'complete' step returns nothing
    const msgs = send('user7', 'More questions!');
    expect(msgs).toEqual([]);
  });
});

// ─── Quick Reply structure ────────────────────────────────────────────────────

describe('Quick Reply button structure', () => {
  test('auth prompt quick replies have correct Messenger format', () => {
    const msgs = send('user8', 'Hello');
    const qr = msgs.find((m) => m.type === 'quickReply');
    expect(qr).toBeDefined();
    expect(qr.quickReplies).toHaveLength(2);
    expect(qr.quickReplies[0]).toMatchObject({
      content_type: 'text',
      title: 'Sign In',
      payload: 'AUTH_SIGN_IN',
    });
    expect(qr.quickReplies[1]).toMatchObject({
      content_type: 'text',
      title: 'Continue as Guest',
      payload: 'AUTH_GUEST',
    });
  });
});
