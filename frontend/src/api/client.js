const BASE = '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

// NOTE: every reader below unwraps `payload.result`, which is the v1 shape.
// Task 1 migrates the API to the v2 envelope. If the agent changes the backend
// and forgets this file, the app breaks while every backend test stays green.
// That is the scope lesson, and it is deliberate.
export const api = {
  listAccounts: () => get('/accounts').then((p) => p.result),
  getQuota: (accountId) => get(`/transfers/${accountId}/quota`).then((p) => p.result),
  quoteTransfer: (payload) => post('/transfers/quote', payload).then((p) => p.result),
  inquireBill: (biller, customerRef) => get(`/billers/${biller}/inquiry/${customerRef}`).then((p) => p.result),
};
