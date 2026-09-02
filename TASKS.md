# Lab 4 Task Menu

Pick ONE task. Copy the prompt exactly as written into a cloud agent. Do not run
two at once on your first attempt.

Rule of thumb for this lab: a good async task is **wide, mechanical, and
verifiable**. A bad async task is **narrow, ambiguous, and needs a human
decision**. Everything below is chosen to make that contrast visible.

---

## Task 1 — API contract migration (recommended for SWE)

**Why it suits an async agent:** six route files, their tests, and the frontend
client all change in the same mechanical way. Wide, boring, and the test suite
proves it worked.

> Migrate every route under `backend/src/routes/` from the deprecated
> `legacyResponse` helper to the v2 contract in `backend/src/utils/envelope.js`.
> Success responses use `sendEnvelope`, error responses use `sendError` with a
> sensible machine-readable `code`.
> Update `backend/tests/unit/routes.test.js` to assert the v2 shape.
> Update `frontend/src/api/client.js`, which still unwraps `payload.result`.
> Delete `backend/src/utils/legacyResponse.js` once nothing imports it.
> Verify with `bash scripts/verify.sh` and open a pull request.

---

## Task 2 — Flaky test triage (recommended for QA)

**Why it suits an async agent:** diagnosis needs many repeated runs. That is
exactly the kind of waiting a human should not do.

> The suite in `backend/tests/flaky/` fails intermittently. Run
> `npm run test:flaky --prefix backend` at least ten times and record how many
> runs fail and which assertions fail. There is more than one cause. Diagnose
> each one separately. Then implement fixes that make the tests deterministic
> without reducing what they verify. In the pull request, explain for each test
> what it was actually protecting and whether it is still protected.

---

## Task 3 — Close a coverage gap (recommended for QA)

**Why it suits an async agent:** bounded, obvious target, and correctness is
checkable by running the suite.

> `backend/src/services/transferQuota.js` has no test coverage. Write a unit
> suite at `backend/tests/unit/transferQuota.test.js` covering: the month
> boundary in bank local time, including a transfer at 2026-08-31T17:30:00Z
> which is already September in Jakarta; scheduled transfers where `createdAt`
> and `executedAt` fall in different months; reversed and failed transfers;
> channels that do not consume quota; an account at exactly zero remaining; and
> invalid timestamps.
> Do not change the implementation. If you find behaviour that looks wrong,
> write the test for the behaviour as it exists and raise the concern under
> "Open questions" in the pull request.

---

## Task 4 — Frontend consolidation (recommended for SWE)

**Why it suits an async agent:** repetitive edits across several components,
zero business logic, easy to review.

> The three biller forms in `frontend/src/components/` (`ElectricityPaymentForm`,
> `WaterPaymentForm`, `MobileTopupForm`) are near-identical copies. Extract the
> shared structure into one reusable `BillerPaymentForm` component driven by
> props, and reduce each biller form to configuration only.
> Then move every hardcoded Indonesian string in `frontend/src/` into a single
> `frontend/src/i18n/id.js` module exporting a flat object, and replace each
> literal with a lookup.
> Finally, give every form control an accessible label using matching `htmlFor`
> and `id` attributes.
> Do not change any behaviour or API call. Verify with `bash scripts/verify.sh`.

---

## What we are NOT delegating

`backend/src/services/feePolicy.js` carries an open `TODO(product)`.

Test Bank advertises 20 free transfers a month. The campaign page never says what
happens when a transfer fails and is reversed. Does the customer get the free slot
back? The mobile team returns it. The core banking team does not. Both shipped.
At current volume the gap is roughly 40,000 transactions a month.

An agent will pick one reading in seconds and write clean, well-tested code around
it. The code will look excellent. What it will actually encode is a promise to
customers that the bank may never have made, and no test will catch that.

The rule: **if the ambiguity is about what the bank told a customer, a human
resolves it before an agent touches it.**

Bring this up in the debrief. It is the point of the whole session.
