/**
 * messenger.js
 *
 * Thin wrapper around the Facebook Messenger Send API.
 * Converts internal message objects (from decisionTree.js) into the correct
 * Messenger API payload and fires the HTTP call.
 *
 * Docs: https://developers.facebook.com/docs/messenger-platform/send-messages/
 */

'use strict';

const https = require('https');

const PAGE_ACCESS_TOKEN = process.env.MESSENGER_PAGE_ACCESS_TOKEN || '';
const GRAPH_API_VERSION = 'v20.0';
const SEND_API_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}/me/messages`;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Sends a raw payload to the Messenger Send API.
 *
 * @param {object} body - full request body for the Send API
 * @returns {Promise<void>}
 */
function sendRaw(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(`${SEND_API_URL}?access_token=${PAGE_ACCESS_TOKEN}`);

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error('[messenger] Send API error', res.statusCode, raw);
          }
          resolve();
        });
      }
    );

    req.on('error', (err) => {
      console.error('[messenger] Request error:', err.message);
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Public helpers — each converts one internal message type to a Send API call
// ---------------------------------------------------------------------------

/**
 * Sends a plain text message.
 *
 * @param {string} recipientId - Facebook PSID
 * @param {string} text
 */
function sendText(recipientId, text) {
  return sendRaw({
    recipient: { id: recipientId },
    message: { text },
  });
}

/**
 * Sends a text message with Quick Reply buttons attached.
 *
 * @param {string} recipientId
 * @param {string} text
 * @param {Array<object>} quickReplies - Messenger Quick Reply objects
 */
function sendQuickReply(recipientId, text, quickReplies) {
  return sendRaw({
    recipient: { id: recipientId },
    message: { text, quick_replies: quickReplies },
  });
}

/**
 * Dispatches an array of internal message objects in order.
 * Messages are sent sequentially so they arrive in the correct order.
 *
 * @param {string} recipientId
 * @param {Array<{type: string, text: string, quickReplies?: Array}>} messages
 */
async function dispatch(recipientId, messages) {
  for (const msg of messages) {
    if (msg.type === 'quickReply') {
      await sendQuickReply(recipientId, msg.text, msg.quickReplies);
    } else {
      await sendText(recipientId, msg.text);
    }
  }
}

module.exports = { sendText, sendQuickReply, dispatch };
