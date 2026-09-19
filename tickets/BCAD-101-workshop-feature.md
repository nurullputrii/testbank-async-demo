# BCAD-101 — Mutasi transfer terakhir on account detail

| Field | Value |
|---|---|
| Type | Story |
| Priority | Medium |
| Sprint | BCA Digital Cursor Workshop (live demo) |
| Components | `backend`, `frontend` |
| Status | **To Do — intentionally incomplete** |
| Estimate | ~10 minutes of agent implementation time |

This ticket is the Block #2 Plan Mode target. **Do not treat the current tree as
done.** Scaffolding exists so the agent has something to research; the
acceptance criteria below are not met yet.

## Summary

When a customer selects an account, the detail pane should show a short mutasi
(the last few transfers) next to the quota badge and fee quote form.

## Background

The API already stores transfer history in `backend/src/data/store.js`
(`transferRecords` / `transfersFor`). `GET /api/transfers/:accountId` returns
the full list, but the React client never calls it. `QuotaBadge` and
`TransferForm` occupy the detail pane with no mutasi.

A dedicated recent-list endpoint keeps the full-history route untouched (that
route is still on the deprecated v1 helper) and lets **new** code use the v2
envelope.

## Scope

Implement the scaffolding pointed at by `TODO(BCAD-101)` comments:

1. `backend/src/services/recentTransfers.js` — sort + limit. Today it returns `[]`.
2. `GET /api/transfers/:accountId/recent` in `backend/src/routes/transfers.js` —
   the route is wired but still serves the empty stub.
3. Tests in `backend/tests/unit/routes.test.js` for sort order, limit, and 404.
4. `frontend/src/api/client.js` — add a v2 reader (this endpoint uses `data`, not `result`).
5. `frontend/src/components/RecentTransfers.jsx` — fetch and render the list.
6. `frontend/src/App.jsx` already mounts the placeholder; keep it there.

## Acceptance criteria

- [ ] `GET /api/transfers/:accountId/recent` returns **HTTP 200** for a known
      account with a **v2 envelope**: `{ data, meta }`. Do **not** use
      `legacyResponse`. Use `sendEnvelope` / `sendError` from
      `backend/src/utils/envelope.js`.
- [ ] `data.items` is an array of at most **5** transfers for that account,
      sorted by `executedAt` **descending** (newest first).
- [ ] Each item includes at least: `id`, `to`, `amount`, `channel`, `status`,
      `executedAt`, `reversed`. Amounts stay **whole rupiah integers**.
- [ ] Include `SETTLED` and `FAILED` / reversed rows. The UI badges them; do
      not hide failed transfers.
- [ ] Unknown `accountId` → **HTTP 404** with v2 `{ error: { code, message }, meta }`.
      Use code `ACCOUNT_NOT_FOUND`.
- [ ] Selecting an account in the web app shows heading **Mutasi Transfer Terakhir**
      and one row per item. Customer-facing copy is **Bahasa Indonesia**.
      Format amounts with `toLocaleString('id-ID')`.
- [ ] Empty list (account with no transfers, e.g. `ACC-1003`) shows a Bahasa
      Indonesia empty state, not a blank section and not an English error.
- [ ] `bash scripts/verify.sh` prints `VERIFY OK`.
- [ ] New/updated route tests cover 404, the v2 shape, newest-first order, and
      the cap of 5. Do not weaken existing v1 assertions on other routes.

## Out of scope

- Do **not** migrate existing v1 routes off `legacyResponse`. That is a
  separate Cloud Agent story (see `TASKS.md` Task 1 and `demo/WORKSHOP.md`
  Block #3).
- Do **not** edit `backend/src/services/feePolicy.js`, quota limits, quota
  channels, or the settlement cutoff hour.
- No PDF statement, no pagination, no date-range filter, no execute-transfer
  POST (quote-only remains).
- No real customer data, no credentials, no external network calls.

## Fixture hint (invented training data)

`ACC-1001` has four rows in `transferRecords`. After a correct implementation,
`GET /api/transfers/ACC-1001/recent` should return those four, newest
`executedAt` first. `ACC-1003` has none.

## Open questions

None for this ticket. If something else looks underspecified, do not guess —
list it under **Open questions** in the pull request and implement the smallest
safe reading.
