# testbank-async-demo

Training repository for **Lab 4: Cloud & Background Agents for Asynchronous
Developer Workflow**.

**Test Bank** is a fictional retail digital bank. Customers transfer money with a
monthly free quota, and pay bills for electricity, water, health insurance, and
mobile top-up. Every customer, account, and bill in this repo is invented. There
are no secrets, no credentials, and no real data anywhere.

## Stack

| Part | Tech | Port |
|---|---|---|
| `backend/` | Node.js 20, Express 4, ES modules, Vitest + Supertest | 3001 |
| `frontend/` | React 18, Vite 5 | 5173 |

## Run it locally

```bash
npm run install:all
npm --prefix backend run dev     # terminal 1
npm --prefix frontend run dev    # terminal 2
```

## Verify

```bash
bash scripts/verify.sh
```

One command: backend unit tests plus a frontend production build. If it prints
`VERIFY OK`, you are good.

The suite in `backend/tests/flaky/` is intentionally unstable and excluded from
the default run. That instability is the material for Task 2.

## For the lab

1. Fork this repo into your own GitHub or GitLab account.
2. In Cursor, connect that account under **Settings → Integrations**.
3. Open `TASKS.md`, pick one task, and hand the prompt to a cloud agent.
4. While it runs, keep working locally. That is the whole point.

`.cursor/environment.json` is committed, so every fork inherits a working cloud
environment. `AGENTS.md` tells the agent how to verify its work and how to write
the pull request.

## API surface

| Endpoint | Purpose |
|---|---|
| `GET /api/accounts` | List customers |
| `GET /api/transfers/:accountId` | Transfer history |
| `GET /api/transfers/:accountId/quota` | Free quota snapshot for the current month |
| `POST /api/transfers/quote` | Fee quote for a proposed transfer |
| `GET /api/billers/:biller/inquiry/:customerRef` | Bill lookup |
| `POST /api/billers/:biller/payment` | Payment quote |

Billers: `electricity`, `water`, `health-insurance`, `mobile-topup`.

## Deliberate design notes for facilitators

| File | What is planted there | Serves |
|---|---|---|
| `backend/src/utils/legacyResponse.js` | Deprecated v1 helper used by all six route files | Task 1 |
| `frontend/src/api/client.js` | Unwraps `payload.result`, so it breaks if the API migrates alone | Task 1 |
| `backend/tests/flaky/settlement.test.js` | Three independent causes: a wall-clock dependency, a reference id with too small an address space, and an async ordering race | Task 2 |
| `backend/src/services/transferQuota.js` | Zero coverage. Month boundary in UTC+7, scheduled vs executed date, reversals, channel eligibility | Task 3 |
| `frontend/src/components/*PaymentForm.jsx` | Three near-identical copies, hardcoded strings, no accessible labels | Task 4 |
| `backend/src/services/feePolicy.js` | An ambiguous customer promise that must NOT be delegated | Debrief |
