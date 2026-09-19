# BCA Digital Cursor workshop — presenter runbook

Live demo repo: [nurullputrii/testbank-async-demo](https://github.com/nurullputrii/testbank-async-demo).
Presenter opens **this repo in Cursor desktop**. Everything here is fictional
Test Bank data. No real customers, no credentials, no production systems.

Copy-paste prompts live in [`prompts.md`](./prompts.md).
The Block #2 ticket is [`tickets/BCAD-101-workshop-feature.md`](../tickets/BCAD-101-workshop-feature.md).

**Do not implement BCAD-101 before the session.** The empty mutasi panel is the
punchline of Plan Mode.

---

## Naming (say this out loud in Block #3; useful in Block #2 too)

| Name | What it is | What it is not |
|---|---|---|
| **Cloud Agents** | Cursor's remote/async agents that clone the repo, open a PR, and keep working while you talk | Not a local chat tab |
| **Grok Bot** | A different product (xAI). Do not use this name for Cursor Cloud Agents | Not this demo |
| **`/multitask`** | An iOS Cursor flow for parallel tasks | **Out of this repo.** Do not demo it here |

If someone asks about iOS `/multitask`: "Great question — different surface.
Today we stay in Cursor desktop with Plan Mode and Cloud Agents on this Node
app."

---

## Exact commands for this repo

Stack: Node.js 20 + Express 4 (`backend/`, port **3001**) and React 18 + Vite 5
(`frontend/`, port **5173**, proxies `/api` → 3001).

```bash
# one-time
npm run install:all

# terminal 1 — API
npm --prefix backend run dev

# terminal 2 — web
npm --prefix frontend run dev

# the only verification command that counts
bash scripts/verify.sh
```

Equivalent pieces if you need to show them separately:

```bash
npm --prefix backend run test          # Vitest unit tests (excludes flaky/)
npm --prefix frontend run build        # production build
npm run test:flaky --prefix backend    # NOT for Block #2; lab Task 2 only
```

`VERIFY OK` at the end of `scripts/verify.sh` means the work is verifiable.

---

## Pre-flight (5 min, before the room sits down)

1. Clone/open this repo in Cursor desktop. Stay on `main` (or a clean branch
   that still has BCAD-101 **unfinished**).
2. Confirm `.cursor/rules/` shows five `.mdc` files. Plan Mode will load them.
3. Run `npm run install:all` if `node_modules` is missing, then start both
   dev servers with the commands above.
4. Open http://localhost:5173 — pick **Rina Wijaya** (`ACC-1001`). You should
   see kuota, hitung biaya, tagihan, and a **dashed** box **Mutasi Transfer
   Terakhir** saying the ticket is still open.
5. Keep [`demo/prompts.md`](./prompts.md) in a split editor or a notes app for
   one-click paste.
6. GitHub integration: **Settings → Integrations** (needed if you will open a
   PR or kick a Cloud Agent).
7. Hide any branch where BCAD-101 is already implemented. The live demo needs
   the gap.

---

## Block #2 — Feature Dev (primary, 15 min)

Ticket → Plan Mode → multi-file changes → tests → PR.

| Min | Click path |
|---|---|
| **0:00–0:45** | Browser: http://localhost:5173. Select Rina Wijaya. Point at the dashed **Mutasi Transfer Terakhir** panel: "This is unfinished on purpose." |
| **0:45–1:30** | Cursor: open `tickets/BCAD-101-workshop-feature.md`. Scroll acceptance criteria. One sentence: "This is the Jira ticket. We will not type the design ourselves." |
| **1:30–2:00** | Open the Agent chat (**Cmd+L** / **Ctrl+L**). Switch to **Plan Mode**: click the mode picker or press **Shift+Tab** until the input says Plan. Say the names: Agent / Ask / Plan. |
| **2:00–3:00** | Type `@` and attach `tickets/BCAD-101-workshop-feature.md`. Paste **Plan Mode prompt** from `demo/prompts.md`. Send. |
| **3:00–6:00** | While it researches, narrate what you should see: it reads `.cursor/rules/` (v2 envelope, tests required, Bahasa Indonesia, don't touch `feePolicy.js`), `recentTransfers.js`, `transfers.js`, `client.js`, `RecentTransfers.jsx`. If it tries to migrate all v1 routes or edit `feePolicy.js`, **reject that part of the plan**. |
| **6:00–7:00** | Review the plan on the projector. Confirm: service sort+limit, `GET /:accountId/recent` stays v2, tests, frontend reader uses `data` not `result`, UI empty state for `ACC-1003`. Click **Build** / accept the plan (wording depends on Cursor version — the control that starts implementation from Plan Mode). |
| **7:00–11:00** | Let the agent edit. Flip through the diff: `recentTransfers.js` first, then route, then `routes.test.js`, then `client.js` + `RecentTransfers.jsx`. Call out multi-file as the point of the block. |
| **11:00–13:00** | Integrated terminal: `bash scripts/verify.sh`. Wait for `VERIFY OK`. Then refresh the browser, select Rina again — mutasi rows should appear. Select **Sari Oktaviani** (`ACC-1003`) — empty state, not a crash. |
| **13:00–15:00** | Commit on a **new branch** (never push `main`). Open a PR. If Cursor offers Agent PR: use it. Otherwise `git checkout -b demo/bcad-101-mutasi`, commit, push, GitHub PR. Source control / PR UI is the close. |

If Plan Mode is slow: skip the long narration at 3:00 and jump to accepting a
shorter plan. If implementation overruns: stop after `VERIFY OK` and skip the
PR click-path; show `git diff --stat` instead.

### Time-tight fallback (same block)

Use the **Fallback Plan Mode prompt** in `demo/prompts.md`. Skip the empty-state
browser check (`ACC-1003`) if you only have ~8 minutes of agent time.

---

## Block #3 — Legacy migrations (backup, 20 min)

Use this if Block #2 finishes early, if Plan Mode misfires, or as a second
station. Story: **mechanical upgrades are what you hand to a Cloud Agent**.

| Min | Script |
|---|---|
| **0:00–2:00** | Whiteboard / chat: **Cloud Agents ≠ Grok Bot ≠ `/multitask`**. `/multitask` iOS is out of this repo. Cloud Agents run remotely, open a PR, you keep presenting. |
| **2:00–5:00** | Split editor: `backend/src/utils/legacyResponse.js` (v1 `{ status, result }`) vs `backend/src/utils/envelope.js` (v2 `{ data, meta }`). Then open `legacy/README.md` and `legacy/TransferInquiryResource.java`. Line: "This Java file is a **synthetic prop**. Same story as `javax` → `jakarta`. The code we actually run is the Node v1 → v2 envelope." |
| **5:00–7:00** | Open `TASKS.md` Task 1 (full six-route migration). Say: "That is the wide version. For a live kickoff we bound it so the agent returns during this block." Paste **Cloud Agent prompt** from `demo/prompts.md`. Kick off a **Cloud Agent** (Cursor Cloud / background agent on this GitHub repo — not the local Plan Mode tab, not Grok, not `/multitask`). |
| **7:00–16:00** | While it runs, keep talking. Points that must land: (1) wide + mechanical + verifiable = good async work; (2) `frontend/src/api/client.js` still unwraps `result` — migrating the API alone breaks the UI; (3) `feePolicy.js` is the counter-example, do **not** delegate product ambiguity; (4) Java analog is package rename + tests, not a rewrite. Open `TASKS.md` "What we are NOT delegating" if you need a closer. |
| **16:00–20:00** | Return to the Cloud Agent run. Show the branch/PR if it landed. If still running: show logs and the bounded scope ("accounts route only"). Do not start a second Cloud Agent. Do not demo iOS `/multitask`. |

If Cloud Agents are not signed in: walk `TASKS.md` Task 1 + the `legacy/` Java
file as a slide, and run `bash scripts/verify.sh` locally so the room still
sees a green loop.

---

## What success looks like

- Block #2: a plan that cites the ticket and the rules, a multi-file diff,
  `VERIFY OK`, mutasi visible for `ACC-1001`.
- Block #3: the room can explain why the envelope migration is a Cloud Agent
  job and why `feePolicy.js` is not.

## Abort cues

- Agent starts rewriting `feePolicy.js` or changing the free-transfer quota
  of 20 → stop, point at `.cursor/rules/020-banking-guardrails.mdc`.
- Agent migrates every v1 route during BCAD-101 → out of scope; revert that
  slice, keep the mutasi work.
- `verify.sh` fails → do not delete tests; read the failure on the projector.
