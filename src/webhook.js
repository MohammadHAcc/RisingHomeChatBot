/**
 * webhook.js
 *
 * Express router for the Facebook Messenger webhook.
 *
 * GET  /webhook  — Meta platform verification (one-time setup)
 * POST /webhook  — Inbound message events from Messenger
 *
 * Docs: https://developers.facebook.com/docs/messenger-platform/webhooks/
 */

'use strict';

const express = require('express');
const decisionTree = require('./decisionTree');
const messenger = require('./messenger');

const router = express.Router();
const VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN || '';

// ---------------------------------------------------------------------------
// GET /webhook — webhook verification handshake
// ---------------------------------------------------------------------------

router.get('/', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[webhook] Verification successful.');
    return res.status(200).send(challenge);
  }

  console.warn('[webhook] Verification failed — token mismatch or wrong mode.');
  return res.sendStatus(403);
});

// ---------------------------------------------------------------------------
// POST /webhook — inbound message events
// ---------------------------------------------------------------------------

router.post('/', (req, res) => {
  const body = req.body;

  if (body.object !== 'page') {
    return res.sendStatus(404);
  }

  // Acknowledge receipt immediately — AC1 compliance (respond < 1 s)
  // All actual sending happens asynchronously after this 200.
  res.sendStatus(200);

  for (const entry of body.entry || []) {
    for (const event of entry.messaging || []) {
      handleEvent(event).catch((err) =>
        console.error('[webhook] Event handling error:', err)
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Internal event handler
// ---------------------------------------------------------------------------

/**
 * Routes a single Messenger event through the decision tree and sends replies.
 *
 * Handles:
 *   - messages with text
 *   - messages with a quick_reply payload (button taps)
 *
 * @param {object} event - raw Messenger webhook event object
 */
async function handleEvent(event) {
  const senderId = event.sender?.id;
  if (!senderId) return;

  // Ignore echo events (messages sent by the page itself)
  if (event.message?.is_echo) return;

  let userText = '';

  if (event.message?.quick_reply?.payload) {
    // User tapped a Quick Reply button
    userText = event.message.quick_reply.payload;
  } else if (event.message?.text) {
    userText = event.message.text;
  } else {
    // Unsupported event type (sticker, attachment, etc.) — treat as empty text
    // so the greeting still fires for first-time users
    userText = '';
  }

  const messages = decisionTree.handle(senderId, userText);

  if (messages.length > 0) {
    await messenger.dispatch(senderId, messages);
  }
}

module.exports = router;
