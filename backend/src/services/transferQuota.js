/**
 * Free transfer quota for Test Bank customers.
 *
 * Marketing promise: "20 transfer gratis setiap bulan."
 * Reality: the word "bulan" hides four separate decisions, and this module
 * makes all four of them. It has ZERO test coverage. Writing that coverage is
 * Task 3 in TASKS.md.
 *
 * The four decisions, in order of how often they cause production incidents:
 *   1. Which timezone defines the month boundary
 *   2. Whether a scheduled transfer counts on its creation date or its execution date
 *   3. Whether a reversed transfer gives the quota slot back
 *   4. Which channels consume quota at all
 */

export const FREE_TRANSFER_QUOTA = 20;

/** Test Bank operates on Western Indonesia Time, UTC+7. */
export const QUOTA_OFFSET_MINUTES = 7 * 60;

/** Only these channels consume free quota. Teller never does. */
export const QUOTA_CHANNELS = ['MOBILE', 'INTERNET'];

/**
 * The calendar month a timestamp belongs to, in bank local time.
 * A transfer at 2026-08-31T17:30:00Z is already 1 September in Jakarta.
 */
export function quotaPeriodKey(timestamp, offsetMinutes = QUOTA_OFFSET_MINUTES) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp: ${timestamp}`);
  }
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * A scheduled transfer is created on one date and executed on another.
 * Quota is consumed when the money actually moves.
 */
export function effectiveTimestamp(record) {
  return record.executedAt || record.createdAt;
}

export function consumesQuota(record) {
  if (!QUOTA_CHANNELS.includes(record.channel)) return false;
  if (record.status !== 'SETTLED') return false;
  if (record.reversed) return false;
  return true;
}

export function countQuotaUsed(records, { accountId, at }) {
  const period = quotaPeriodKey(at);
  return records.filter(
    (r) =>
      r.accountId === accountId &&
      consumesQuota(r) &&
      quotaPeriodKey(effectiveTimestamp(r)) === period
  ).length;
}

export function remainingQuota(records, { accountId, at }) {
  const used = countQuotaUsed(records, { accountId, at });
  return Math.max(0, FREE_TRANSFER_QUOTA - used);
}

export function quotaSnapshot(records, { accountId, at = new Date().toISOString() }) {
  const used = countQuotaUsed(records, { accountId, at });
  return {
    period: quotaPeriodKey(at),
    limit: FREE_TRANSFER_QUOTA,
    used,
    remaining: Math.max(0, FREE_TRANSFER_QUOTA - used),
  };
}
