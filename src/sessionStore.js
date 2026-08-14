/**
 * sessionStore.js
 *
 * In-memory session state store.
 *
 * Tracks where each user is in the conversation so the decision tree
 * can return the correct hardcoded response for every input.
 *
 * Shape of a session record:
 * {
 *   session_id:        string  — Facebook sender PSID
 *   auth_mode:         'guest' | 'signed_in' | 'pending'
 *   conversation_step: 'intro' | 'auth_prompt' | 'complete'
 *   timestamp:         ISO-8601 string — time the session was first created
 * }
 *
 * NOTE: This is an in-process Map; sessions are lost on server restart.
 *       Replace with a persistent store (Redis, DynamoDB, etc.) before production.
 */

'use strict';

/** @type {Map<string, object>} */
const store = new Map();

/**
 * Returns the session for a given sender ID.
 * Creates a new session record if one does not yet exist.
 *
 * @param {string} senderId - Facebook Page-Scoped User ID (PSID)
 * @returns {object} session
 */
function getOrCreate(senderId) {
  if (!store.has(senderId)) {
    store.set(senderId, {
      session_id: senderId,
      auth_mode: 'pending',
      conversation_step: 'intro',
      timestamp: new Date().toISOString(),
    });
  }
  return store.get(senderId);
}

/**
 * Partially updates a session record.
 *
 * @param {string} senderId
 * @param {object} patch - fields to merge into the existing session
 * @returns {object} updated session
 */
function update(senderId, patch) {
  const session = getOrCreate(senderId);
  Object.assign(session, patch);
  return session;
}

/**
 * Returns a session if it exists, or null.
 *
 * @param {string} senderId
 * @returns {object|null}
 */
function get(senderId) {
  return store.get(senderId) ?? null;
}

/**
 * Removes a session (useful for testing).
 *
 * @param {string} senderId
 */
function remove(senderId) {
  store.delete(senderId);
}

/** Clears all sessions (useful for testing). */
function clear() {
  store.clear();
}

module.exports = { getOrCreate, update, get, remove, clear };
