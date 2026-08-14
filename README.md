# Rising Home — Mock Website

A front-end prototype of the Rising Home rental platform. Browse mock Chicago property listings on an interactive map while chatting with **Starry**, your built-in home-finding guide.

**Tech stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Vercel

---

## Story 1: Starry Introduction ✅

Implements the split-screen layout and Starry's opening conversation:

1. Starry's greeting auto-renders **≤ 500 ms** after page load (AC1 — must be &lt; 1 s)
2. Introduction lists all four capabilities in plain language — no jargon (AC2, AC4)
3. Guest / Sign In buttons render below the auth prompt (AC3)
4. Both button taps and typed equivalents handled by the decision tree
5. Off-topic input and unrecognised replies handled gracefully
6. 10 mock Chicago listings visible in the left panel across 4 neighbourhoods

---

## Project Structure

```
rising-home/
├── app/
│   ├── layout.tsx            Root layout — metadata, font, globals
│   ├── page.tsx              Renders SplitLayout
│   └── globals.css           Tailwind directives + custom animations
├── components/
│   ├── Layout/
│   │   └── SplitLayout.tsx   60/40 split container + nav bar
│   ├── MapPanel/
│   │   ├── MapPanel.tsx      Left panel — neighbourhood filter + listings
│   │   ├── MapView.tsx       SVG mock map with zones and property pins
│   │   └── PropertyCard.tsx  Individual listing card
│   └── ChatPanel/
│       ├── ChatPanel.tsx     Chat state, auto-greeting sequence, decision tree
│       ├── ChatBubble.tsx    Single message bubble (Starry / user)
│       ├── ChatInput.tsx     Text input bar (locked during intro)
│       └── QuickReplyButtons.tsx  Sign In / Continue as Guest buttons
├── starry/
│   ├── responses.js          All hardcoded Starry copy (single source of truth)
│   ├── decisionTree.js       Pure keyword-matching conversation logic
│   └── sessionState.js       Initial state shape
├── data/
│   └── mockListings.js       10 hardcoded Chicago properties across 4 neighbourhoods
├── vercel.json
└── package.json
```

---

## Local Development

```bash
# 1. Install
npm install

# 2. Run dev server
npm run dev
# Open http://localhost:3000
```

No environment variables are required for Story 1 — everything is hardcoded.

---

## Deploy to Vercel

```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy (preview)
vercel

# Deploy to production
vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard → Framework: Next.js → no env vars needed.

---

## Conversation Flow

```
Page loads
  └─> [typing indicator]
        └─> Greeting (≤ 500 ms)         — lists 4 capabilities, no jargon
              └─> Auth prompt (≤ 1 200 ms) + [ Sign In ] [ Continue as Guest ]
                    ├─> Button / "sign in" → placeholder ack → chat unlocks
                    ├─> Button / "guest"   → welcome ack    → chat unlocks
                    └─> anything else      → clarification + re-show buttons
                                            (max 2 retries, then default to guest)

User types before intro finishes
  └─> Off-topic nudge → auth prompt + buttons
```

---

## Open Items Before Launch

| Item | Owner |
|------|-------|
| Final copy approval — Starry's intro messages | Product Owner |
| Mock listing images (replace gradient placeholders) | Dev / Design |
| Real Leaflet map vs. static mock — confirm approach | Dev team |
| Tailwind design token decisions (colours, fonts) | Design |
| Vercel project created + team access granted | Dev team |
| GDPR / CCPA compliance review | Legal |

---

## Out of Scope — Story 1

- Property filtering / search logic
- Clicking a property to reference it in chat
- Tour scheduling
- Renting vs. buying tips responses
- Real authentication / account creation
- Mobile / responsive layout
- Any external API (map tiles, data, AI)
