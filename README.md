# Rising Home — Starry Chatbot

Facebook Messenger chatbot for Rising Home. **Starry** is a friendly, jargon-free guide that helps users find neighborhoods, schedule tours, and navigate the site.

---

## Story 1: Starry Introduction

The first sprint delivers the entry-point conversation:

1. Starry greets any new user within **1 second** of their first message.
2. Introduces its four core capabilities in plain language (no real-estate jargon).
3. Prompts the user to **Sign In** or **Continue as Guest** using Messenger Quick Reply buttons.
4. Handles off-topic first messages gracefully and re-routes to the intro.

All responses are **hardcoded strings** — no LLM API is called in this story.

---

## Project Structure

```
rising-home-chatbot/
├── src/
│   ├── index.js          # Express server entry point
│   ├── webhook.js        # GET + POST /webhook handlers
│   ├── decisionTree.js   # Rule-based conversation logic
│   ├── messenger.js      # Facebook Messenger Send API wrapper
│   ├── responses.js      # Hardcoded response strings & Quick Reply defs
│   └── sessionStore.js   # In-memory session state
├── tests/
│   ├── decisionTree.test.js  # Unit tests — conversation logic
│   └── webhook.test.js       # Integration tests — HTTP endpoints
├── .env.example          # Environment variable template
├── .gitignore
└── package.json
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.0.0 |
| npm | ≥ 9.0.0 |

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/MohammadHAcc/RisingHomeChatBot.git
cd RisingHomeChatBot

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in MESSENGER_VERIFY_TOKEN and MESSENGER_PAGE_ACCESS_TOKEN

# 4. Start in development mode (auto-reload)
npm run dev

# 5. Expose your local server to the internet (Meta requires HTTPS)
# Example with ngrok:
ngrok http 3000
# Copy the https URL and set it as your webhook URL in the Meta Developer App
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MESSENGER_VERIFY_TOKEN` | ✅ | Token you set in the Meta Developer App webhook config |
| `MESSENGER_PAGE_ACCESS_TOKEN` | ✅ | Page Access Token from Meta App → Messenger → Settings |
| `PORT` | ❌ | Server port (default: `3000`) |
| `NODE_ENV` | ❌ | `development` or `production` |

---

## Webhook Setup (Meta Developer App)

1. Go to **Meta for Developers → Your App → Messenger → Settings**.
2. Under **Webhooks**, click **Add Callback URL**.
3. Set the URL to `https://<your-domain>/webhook`.
4. Set the **Verify Token** to match `MESSENGER_VERIFY_TOKEN` in your `.env`.
5. Subscribe to the `messages` and `messaging_postbacks` webhook fields.

---

## Running Tests

```bash
npm test
```

Tests cover:
- Decision tree: greeting, off-topic, sign-in, guest, unrecognised, complete step
- Webhook: verification handshake, message dispatch, echo filtering, health check

---

## Conversation Flow (Story 1)

```
User sends any message
  └─> Greeting (4 capabilities listed)
        └─> Auth prompt + [Sign In] [Continue as Guest] buttons
              ├─> "sign in" / AUTH_SIGN_IN  → "Sign-in coming soon!"  (placeholder)
              ├─> "guest"  / AUTH_GUEST     → "Welcome, guest!"       (placeholder)
              └─> Anything else             → Clarification + re-show buttons

User sends off-topic first message
  └─> Off-topic nudge → Greeting → Auth prompt (same as above)
```

---

## Open Items Before Launch

| Item | Owner |
|------|-------|
| Meta Developer App credentials & Page access token | Dev team |
| Production HTTPS endpoint / deployment | Dev team |
| Final copy approval for Starry's intro message | Product Owner |
| GDPR / CCPA compliance review | Legal |
| Facebook Messenger API cost evaluation | Product Owner |
| Replace in-memory session store with Redis/DynamoDB | Dev team (Story 2+) |

---

## Out of Scope — Story 1

- Neighborhood / property recommendations
- Tour scheduling
- Renting vs. buying tips
- Account creation / real authentication
- Any channel other than Facebook Messenger

---

## License

Internal project — Rising Home / Accenture. Not for public distribution.
