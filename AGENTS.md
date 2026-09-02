# AGENTS.md

## Project summary

Test Bank, a fictional retail digital bank. Transfers with a monthly free quota,
and bill payment for electricity, water, health insurance, and mobile top-up.
Node.js + Express API in `backend/`, React + Vite client in `frontend/`.
No real data, no secrets, no external services.

## How to verify your work

Run one command:

```bash
bash scripts/verify.sh
```

It runs the backend unit tests and a production build of the frontend. If it
prints `VERIFY OK`, the work is verifiable. If it does not, the work is not done.

The suite in `backend/tests/flaky/` is excluded from `verify.sh` on purpose. Run
it only when a task asks you to: `npm run test:flaky --prefix backend`.

## Cursor Cloud specific instructions

- Dependencies are already installed by the environment install script. Do not
  re-run `npm install` unless you changed a `package.json`.
- Two terminals are already running: `api` on port 3001 and `web` on port 5173.
  Do not start a second dev server on those ports. Use the ones that exist.
- Ports 3001 and 5173 are exposed. You can and should open the app to check your
  own work rather than assuming the UI still renders.
- There is no database, no queue, and no external network dependency. If your
  plan requires reaching an outside service, the plan is wrong.
- Always open a pull request. Never push directly to `main`.
- Keep the diff scoped to the task. A cloud agent that rewrites unrelated files
  is harder to review than the problem it solved.

## Where the money logic lives

| Concern | File |
|---|---|
| Free transfer quota counting | `backend/src/services/transferQuota.js` |
| Fee resolution | `backend/src/services/feePolicy.js` |
| Interbank settlement timing | `backend/src/services/settlement.js` |
| Biller lookup and admin fees | `backend/src/services/billerAdapter.js` |

Changes to `feePolicy.js` need a human product decision first. See the
TODO(product) note in that file.

## Pull request format

Three headings, in this order:

1. **What changed**
2. **How it was verified** (paste the tail of the verify output)
3. **What I did not change and why**

Add an **Open questions** heading if anything was ambiguous.
