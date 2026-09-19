# Copy-paste prompts — BCA Digital Cursor workshop

Use with [`WORKSHOP.md`](./WORKSHOP.md). Paste as-is. Attach files with `@`
where the prompt says to.

All work stays in this Node/React Test Bank app. No second stack. No secrets.
No real customer data.

---

## 1. Plan Mode prompt (Block #2)

Switch the chat to **Plan Mode** (mode picker or **Shift+Tab**). Attach the
ticket with `@tickets/BCAD-101-workshop-feature.md` before sending.

```
You are implementing a small unfinished feature in this Test Bank repo for a live workshop.

Read @tickets/BCAD-101-workshop-feature.md end to end and treat it as the spec. The feature is NOT done — TODO(BCAD-101) comments and an empty mutasi panel are intentional scaffolding.

Implement only BCAD-101:
1. Fill in listRecentTransfers in backend/src/services/recentTransfers.js (newest executedAt first, max 5, include FAILED/reversed, whole rupiah integers, use transfersFor / transferRecords — do not invent rows).
2. Keep GET /api/transfers/:accountId/recent on the v2 envelope (sendEnvelope / sendError from backend/src/utils/envelope.js). Unknown account → 404, code ACCOUNT_NOT_FOUND. Do not switch this route to legacyResponse.
3. Add/adjust tests in backend/tests/unit/routes.test.js: 404, v2 shape, newest-first, cap of 5. Do not weaken existing v1 assertions on other routes.
4. Add a frontend client reader for this endpoint that uses payload.data (v2). Do not rewrite existing v1 unwraps of payload.result.
5. Implement frontend/src/components/RecentTransfers.jsx (Bahasa Indonesia, amount toLocaleString('id-ID'), empty state). App.jsx already mounts it.

Constraints:
- Follow .cursor/rules (especially 020-banking-guardrails, 030-api-tests, 031-frontend-conventions).
- Do not edit backend/src/services/feePolicy.js.
- Do not migrate existing v1 routes off legacyResponse (that is TASKS.md Task 1, out of this ticket).
- Do not change fee amounts, quota 20, quota channels, or settlement cutoff.

When the plan is done, implement it, run bash scripts/verify.sh, and open a PR with headings What changed / How it was verified / What I did not change and why.
```

---

## 2. Cloud Agent prompt (Block #3 backup)

Kick this off as a **Cloud Agent** (remote/async), not local Plan Mode, not
Grok Bot, not `/multitask`.

This is a **bounded** slice of the v1 → v2 API migration already planted in
this repo (`legacyResponse.js` → `envelope.js`). The Java file under `legacy/`
is a synthetic talking prop only — do not ask the agent to compile it.

```
Bounded API contract migration in this Test Bank repo (fictional bank, no real customer data).

Migrate ONLY backend/src/routes/accounts.js from the deprecated legacyResponse helper to the v2 helpers in backend/src/utils/envelope.js:
- Success: sendEnvelope with { data, meta }
- Errors: sendError with a machine-readable code (use ACCOUNT_NOT_FOUND for missing accounts) and { error, meta }

Update ONLY the "accounts" describe block in backend/tests/unit/routes.test.js so those tests assert the v2 shape. Leave the transfers and billers tests on the v1 { status, result } contract.

Do NOT change frontend/src/api/client.js in this run. Call out in the PR under Open questions that listAccounts still unwraps payload.result and will break against the migrated accounts route until a follow-up.

Do NOT edit feePolicy.js, transferQuota.js, settlement.js, or any biller route.
Do NOT implement tickets/BCAD-101-workshop-feature.md.
Do NOT touch the synthetic Java under legacy/ — it is workshop narrative, not build input.

Verify with bash scripts/verify.sh. Open a pull request with:
1. What changed
2. How it was verified (paste the tail of verify output)
3. What I did not change and why
4. Open questions
```

Full-width version if the room wants the "real" async lab: copy **Task 1** from
[`TASKS.md`](../TASKS.md) instead. That one also updates `client.js` and every
route. Prefer the bounded prompt above for a 20-minute live wait.

---

## 3. Fallback Plan Mode prompt (time is tight)

Still Plan Mode, still `@tickets/BCAD-101-workshop-feature.md`. Shorter so the
agent spends minutes on code, not on a long plan.

```
Implement @tickets/BCAD-101-workshop-feature.md only.

Fill listRecentTransfers, keep GET /api/transfers/:accountId/recent on sendEnvelope/sendError (v2), add tests (404, v2 shape, newest first, max 5), and make RecentTransfers.jsx fetch payload.data and render in Bahasa Indonesia.

Do not touch feePolicy.js or existing v1 routes. Do not unwrap this new endpoint as payload.result. Run bash scripts/verify.sh.
```
