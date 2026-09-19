/**
 * BCAD-101 — short mutasi (recent transfers) for one account.
 *
 * Scaffolding only. Plan Mode / the implementing agent must fill this in.
 * Do not invent extra records; read from `transferRecords` via `transfersFor`.
 *
 * Spec: tickets/BCAD-101-workshop-feature.md
 */

import { transfersFor } from '../data/store.js';

const DEFAULT_LIMIT = 5;

/**
 * @param {string} accountId
 * @param {{ limit?: number }} [options]
 * @returns {Array<{
 *   id: string,
 *   to: string,
 *   amount: number,
 *   channel: string,
 *   status: string,
 *   executedAt: string,
 *   reversed: boolean,
 * }>}
 */
export function listRecentTransfers(accountId, { limit = DEFAULT_LIMIT } = {}) {
  // Touch the existing helper so Plan Mode can follow the import.
  // The return value is intentionally empty until BCAD-101 is implemented.
  void transfersFor;
  void accountId;
  void limit;

  // TODO(BCAD-101): return up to `limit` transfers for `accountId`.
  // Sort by executedAt descending (newest first). Include FAILED/reversed rows.
  // Map each record to { id, to, amount, channel, status, executedAt, reversed }.
  // Amounts are whole rupiah integers — do not convert to float.
  return [];
}
