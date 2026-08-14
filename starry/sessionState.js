/**
 * starry/sessionState.js
 *
 * Defines the shape and initial value of Starry's chat session state.
 * Stored in React useState — no persistence (prototype only).
 *
 * @typedef {'intro' | 'auth_prompt' | 'active'
 *         | 'tour_property' | 'tour_date' | 'tour_time'
 *         | 'tour_name'    | 'tour_contact' | 'tour_complete'} ConversationStep
 *
 * @typedef {null | 'guest' | 'signed_in'} AuthMode
 *
 * @typedef {Object} TourBooking
 * @property {string|null} propertyId
 * @property {string|null} propertyAddress
 * @property {string|null} date           ISO date string (YYYY-MM-DD)
 * @property {string|null} timeSlot       'morning' | 'afternoon' | 'evening'
 * @property {string|null} guestName
 * @property {string|null} contact        Email or phone
 *
 * @typedef {Object} SessionState
 * @property {AuthMode}          authMode
 * @property {ConversationStep}  conversationStep
 * @property {string|null}       selectedPropertyId
 * @property {number}            retryCount
 * @property {TourBooking}       tourBooking
 */

/** @type {SessionState} */
export const initialState = {
  authMode: null,
  conversationStep: 'intro',
  selectedPropertyId: null,
  retryCount: 0,
  tourBooking: {
    propertyId:      null,
    propertyAddress: null,
    date:            null,
    timeSlot:        null,
    guestName:       null,
    contact:         null,
  },
};
