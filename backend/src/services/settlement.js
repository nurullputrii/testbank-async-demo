/**
 * Interbank settlement helpers.
 *
 * Transfers submitted after the daily cutoff settle on the next working day.
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
 * Monotonic so two transfers in the same process cannot share an id.
 */
let nextReferenceSeq = 0;

export function generateReferenceId() {
  nextReferenceSeq += 1;
  return `REF-${String(nextReferenceSeq).padStart(12, '0')}`;
}

/**
 * Simulates handing one transfer to the downstream clearing system.
 * Latency still varies, but items that share a sink are handed off in
 * submission order so concurrent callers cannot race the append.
 */
const sinkQueues = new WeakMap();

export function settleItem(item, sink) {
  const previous = sinkQueues.get(sink) ?? Promise.resolve();
  const next = previous.then(
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          sink.push(item.id);
          resolve(item.id);
        }, Math.floor(Math.random() * 4));
      }),
  );
  sinkQueues.set(sink, next);
  return next;
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
