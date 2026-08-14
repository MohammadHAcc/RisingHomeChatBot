/**
 * starry/sessionState.js
 *
 * Defines the shape and initial value of Starry's chat session state.
 * Stored in React useState — no persistence, no localStorage (Story 1 scope).
 *
 * @typedef {'intro' | 'auth_prompt' | 'active'} ConversationStep
 * @typedef {null | 'guest' | 'signed_in'} AuthMode
 *
 * @typedef {Object} ChatMessage
 * @property {string}           id        Unique message ID
 * @property {'starry'|'user'}  sender
 * @property {string}           text
 * @property {number}           timestamp ms since epoch
 *
 * @typedef {Object} SessionState
 * @property {AuthMode}          authMode
 * @property {ConversationStep}  conversationStep
 * @property {ChatMessage[]}     messages
 * @property {string|null}       selectedPropertyId
 * @property {number}            retryCount   Unrecognised inputs at auth_prompt
 */

/** @type {SessionState} */
export const initialState = {
  authMode: null,
  conversationStep: 'intro',
  messages: [],
  selectedPropertyId: null,
  retryCount: 0,
};
