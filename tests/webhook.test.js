/**
 * webhook.test.js
 *
 * Integration tests for the GET and POST /webhook endpoints.
 * The messenger.dispatch call is mocked so no real HTTP calls are made.
 */

'use strict';

// Must mock before requiring the app
jest.mock('../src/messenger', () => ({
  dispatch: jest.fn().mockResolvedValue(undefined),
}));

const request  = require('supertest');
const { app, server } = require('../src/index');
const messenger = require('../src/messenger');
const sessionStore = require('../src/sessionStore');

beforeEach(() => {
  sessionStore.clear();
  messenger.dispatch.mockClear();
});

afterAll(() => {
  server.close();
});

// ─── Webhook verification ─────────────────────────────────────────────────────

describe('GET /webhook — verification', () => {
  const VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN || '';

  test('returns challenge when token and mode match', async () => {
    const res = await request(app).get('/webhook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': 'test_challenge_123',
    });
    expect(res.status).toBe(200);
    expect(res.text).toBe('test_challenge_123');
  });

  test('returns 403 when token does not match', async () => {
    const res = await request(app).get('/webhook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong_token',
      'hub.challenge': 'abc',
    });
    expect(res.status).toBe(403);
  });

  test('returns 403 when mode is not subscribe', async () => {
    const res = await request(app).get('/webhook').query({
      'hub.mode': 'unsubscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': 'abc',
    });
    expect(res.status).toBe(403);
  });
});

// ─── POST /webhook — inbound messages ────────────────────────────────────────

function messengerPayload(senderId, text, quickReplyPayload = null) {
  const message = quickReplyPayload
    ? { text, quick_reply: { payload: quickReplyPayload } }
    : { text };

  return {
    object: 'page',
    entry: [
      {
        messaging: [
          {
            sender:  { id: senderId },
            message,
          },
        ],
      },
    ],
  };
}

describe('POST /webhook — message handling', () => {
  test('returns 200 immediately (AC1)', async () => {
    const res = await request(app)
      .post('/webhook')
      .send(messengerPayload('psid1', 'Hello'));
    expect(res.status).toBe(200);
  });

  test('returns 404 for non-page object', async () => {
    const res = await request(app)
      .post('/webhook')
      .send({ object: 'user' });
    expect(res.status).toBe(404);
  });

  test('dispatch is called on a valid first message', async () => {
    await request(app)
      .post('/webhook')
      .send(messengerPayload('psid2', 'Hello'));

    // Give async dispatch a moment to run
    await new Promise((r) => setTimeout(r, 50));
    expect(messenger.dispatch).toHaveBeenCalledWith(
      'psid2',
      expect.arrayContaining([
        expect.objectContaining({ type: 'text' }),
      ])
    );
  });

  test('echo events are ignored and dispatch is not called', async () => {
    const echoPayload = {
      object: 'page',
      entry: [
        {
          messaging: [
            {
              sender:  { id: 'psid3' },
              message: { is_echo: true, text: 'Bot message' },
            },
          ],
        },
      ],
    };
    await request(app).post('/webhook').send(echoPayload);
    await new Promise((r) => setTimeout(r, 50));
    expect(messenger.dispatch).not.toHaveBeenCalled();
  });

  test('quick reply button tap is dispatched correctly', async () => {
    // Advance user to auth_prompt
    await request(app)
      .post('/webhook')
      .send(messengerPayload('psid4', 'Hello'));
    await new Promise((r) => setTimeout(r, 50));

    messenger.dispatch.mockClear();

    // Simulate guest button tap
    await request(app)
      .post('/webhook')
      .send(messengerPayload('psid4', 'Continue as Guest', 'AUTH_GUEST'));
    await new Promise((r) => setTimeout(r, 50));

    expect(messenger.dispatch).toHaveBeenCalledWith(
      'psid4',
      expect.arrayContaining([
        expect.objectContaining({ text: expect.stringMatching(/welcome, guest/i) }),
      ])
    );
  });
});

// ─── Health check ─────────────────────────────────────────────────────────────

describe('GET /health', () => {
  test('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
