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

// Response contract v2 (see backend/src/utils/envelope.js):
//   success: { data, meta: { apiVersion, timestamp, ... } }
//   failure: { error: { code, message }, meta: { ... } }
// Every reader below unwraps `payload.data`.
export const api = {
  listAccounts: () => get('/accounts').then((p) => p.data),
  getQuota: (accountId) => get(`/transfers/${accountId}/quota`).then((p) => p.data),
  quoteTransfer: (payload) => post('/transfers/quote', payload).then((p) => p.data),
  inquireBill: (biller, customerRef) => get(`/billers/${biller}/inquiry/${customerRef}`).then((p) => p.data),
};
