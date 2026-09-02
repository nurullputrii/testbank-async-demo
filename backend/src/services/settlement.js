/**
 * Interbank settlement helpers.
 *
 * Transfers submitted after the daily cutoff settle on the next working day.
 * The suite in tests/flaky exercises this module and disagrees with itself
 * between runs. Finding every cause is Task 2. There is more than one.
 */

export const CUTOFF_HOUR_LOCAL = 15;

export function isAfterCutoff(date = new Date()) {
  return date.getHours() >= CUTOFF_HOUR_LOCAL;
}

export function nextSettlementDate(date = new Date()) {
  const next = new Date(date);
  if (isAfterCutoff(date)) {
    next.setDate(next.getDate() + 1);
  }
  next.setHours(0, 0, 0, 0);
  return next;
}

/**
 * Reference number stamped on every settled transfer.
 * The address space here is deliberately small.
 */
export function generateReferenceId() {
  return `REF-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')}`;
}

/**
 * Simulates handing one transfer to the downstream clearing system.
 * Latency varies the way a real network call does.
 */
export function settleItem(item, sink) {
  return new Promise((resolve) => {
    setTimeout(() => {
      sink.push(item.id);
      resolve(item.id);
    }, Math.floor(Math.random() * 4));
  });
}

export function buildBatch(size) {
  return Array.from({ length: size }, (_, i) => ({
    id: `TRX-${100000 + i}`,
    amount: ((i * 7919) % 5_000_000) + 1_000,
    channel: i % 3 === 0 ? 'TELLER' : 'MOBILE',
  }));
}

export function summarizeBatch(batch) {
  let total = 0;
  let tellerCount = 0;
  for (const item of batch) {
    total += item.amount;
    if (item.channel === 'TELLER') tellerCount += 1;
  }
  return { count: batch.length, total, tellerCount };
}
