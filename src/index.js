/**
 * index.js
 *
 * Entry point for the Rising Home Starry chatbot server.
 * Starts an Express server and mounts the Messenger webhook router.
 *
 * In production the server must be behind HTTPS (port 443) because
 * Facebook Messenger only delivers webhooks to HTTPS endpoints.
 * In local development use ngrok or a similar tunnel.
 */

'use strict';

require('dotenv').config();

const express = require('express');
const webhookRouter = require('./webhook');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Parse incoming JSON from Messenger
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.use('/webhook', webhookRouter);

// Health check — useful for load balancers and uptime monitors
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'rising-home-chatbot', version: '1.0.0' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const server = app.listen(PORT, () => {
  console.log(`[server] Rising Home Chatbot listening on port ${PORT}`);
  console.log(`[server] Webhook endpoint: POST /webhook`);
  console.log(`[server] Health check:     GET  /health`);
});

// Export for testing
module.exports = { app, server };
