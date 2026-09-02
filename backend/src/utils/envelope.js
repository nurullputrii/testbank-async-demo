/**
 * v2 response contract. The target shape for Task 1.
 *
 * Success: { data: <payload>, meta: { apiVersion, timestamp, ...extra } }
 * Failure: { error: { code, message }, meta: { apiVersion, timestamp } }
 */
const API_VERSION = '2';

function baseMeta(extra = {}) {
  return { apiVersion: API_VERSION, timestamp: new Date().toISOString(), ...extra };
}

export function sendEnvelope(res, { data, meta = {}, statusCode = 200 }) {
  return res.status(statusCode).json({ data, meta: baseMeta(meta) });
}

export function sendError(res, { code, message, statusCode = 400 }) {
  return res.status(statusCode).json({ error: { code, message }, meta: baseMeta() });
}
