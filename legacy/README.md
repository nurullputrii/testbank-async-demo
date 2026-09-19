# `legacy/` — synthetic workshop prop

**This folder is not part of the running Test Bank app.** Nothing in
`backend/` or `frontend/` imports it. It is not compiled. It contains no
secrets and no real customer data.

It exists so Block #3 can tell a **Java-style upgrade story** while standing
inside this Node.js repo:

| Talking point | In this folder (synthetic Java) | In the real app (Node) |
|---|---|---|
| Deprecated API surface | `javax.ws.rs.*` JAX-RS 2 resource | `backend/src/utils/legacyResponse.js` (v1) |
| Target contract | `jakarta.ws.rs.*` + a typed envelope | `backend/src/utils/envelope.js` (v2) |
| Mechanical, wide, testable | Rename packages, keep behaviour | Six route files + tests + `client.js` (`TASKS.md` Task 1) |

Kick off the **Cloud Agent** against the Node migration prompt in
`demo/prompts.md`, not against these Java files. Open the `.java` file on
stage only as the analog.

`/multitask` on iOS is out of scope for this repository.
