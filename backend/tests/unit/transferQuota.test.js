import { describe, it, expect } from 'vitest';
import { transferRecords } from '../../src/data/store.js';
import {
  FREE_TRANSFER_QUOTA,
  QUOTA_CHANNELS,
  QUOTA_OFFSET_MINUTES,
  consumesQuota,
  countQuotaUsed,
  effectiveTimestamp,
  quotaPeriodKey,
  quotaSnapshot,
  remainingQuota,
} from '../../src/services/transferQuota.js';

const SEPTEMBER = '2026-09-15T04:00:00Z';
const AUGUST = '2026-08-15T04:00:00Z';

function transfer(overrides = {}) {
  return {
    id: 'TRX-TEST',
    accountId: 'ACC-1001',
    to: 'ACC-1003',
    amount: 100_000,
    channel: 'MOBILE',
    createdAt: '2026-09-01T02:00:00Z',
    executedAt: '2026-09-01T02:00:00Z',
    status: 'SETTLED',
    reversed: false,
    ...overrides,
  };
}

function settledInPeriod(index) {
  const day = String((index % 20) + 1).padStart(2, '0');
  const stamp = `2026-09-${day}T03:00:00Z`;
  return transfer({
    id: `TRX-FILL-${index}`,
    createdAt: stamp,
    executedAt: stamp,
  });
}

describe('quotaPeriodKey', () => {
  it('places 2026-08-31T17:30:00Z in September because that is already 00:30 in Jakarta', () => {
    expect(quotaPeriodKey('2026-08-31T17:30:00Z')).toBe('2026-09');
  });

  it('keeps a transfer one second before Jakarta midnight in August', () => {
    expect(quotaPeriodKey('2026-08-31T16:59:59Z')).toBe('2026-08');
  });

  it('rolls into September at exactly Jakarta midnight, 17:00 UTC', () => {
    expect(quotaPeriodKey('2026-08-31T17:00:00Z')).toBe('2026-09');
  });

  it('uses Western Indonesia Time (UTC+7) as the default offset', () => {
    expect(QUOTA_OFFSET_MINUTES).toBe(7 * 60);
    expect(quotaPeriodKey('2026-08-31T17:30:00Z', QUOTA_OFFSET_MINUTES)).toBe('2026-09');
  });

  it('throws on invalid timestamps', () => {
    expect(() => quotaPeriodKey('not-a-date')).toThrow('Invalid timestamp: not-a-date');
    expect(() => quotaPeriodKey('')).toThrow('Invalid timestamp: ');
    expect(() => quotaPeriodKey(undefined)).toThrow('Invalid timestamp: undefined');
    expect(() => quotaPeriodKey('2026-13-01')).toThrow('Invalid timestamp: 2026-13-01');
    expect(() => quotaPeriodKey(Number.NaN)).toThrow('Invalid timestamp: NaN');
  });

  it('treats null and 0 as the Unix epoch rather than as invalid timestamps', () => {
    expect(quotaPeriodKey(null)).toBe('1970-01');
    expect(quotaPeriodKey(0)).toBe('1970-01');
  });
});

describe('effectiveTimestamp', () => {
  it('counts a scheduled transfer on executedAt when that date is present', () => {
    const record = transfer({
      createdAt: '2026-08-28T09:02:00Z',
      executedAt: '2026-09-01T01:00:00Z',
    });
    expect(effectiveTimestamp(record)).toBe('2026-09-01T01:00:00Z');
  });

  it('falls back to createdAt when executedAt is missing', () => {
    const record = transfer({ executedAt: undefined, createdAt: '2026-08-28T09:02:00Z' });
    expect(effectiveTimestamp(record)).toBe('2026-08-28T09:02:00Z');
  });
});

describe('consumesQuota', () => {
  it('consumes quota only for settled, non-reversed MOBILE and INTERNET transfers', () => {
    expect(QUOTA_CHANNELS).toEqual(['MOBILE', 'INTERNET']);
    expect(consumesQuota(transfer({ channel: 'MOBILE' }))).toBe(true);
    expect(consumesQuota(transfer({ channel: 'INTERNET' }))).toBe(true);
  });

  it('does not consume quota for TELLER or ATM channels', () => {
    expect(consumesQuota(transfer({ channel: 'TELLER' }))).toBe(false);
    expect(consumesQuota(transfer({ channel: 'ATM' }))).toBe(false);
  });

  it('does not consume quota for failed transfers', () => {
    expect(consumesQuota(transfer({ status: 'FAILED', reversed: false }))).toBe(false);
  });

  it('does not consume quota for reversed transfers, even when status is SETTLED', () => {
    expect(consumesQuota(transfer({ status: 'SETTLED', reversed: true }))).toBe(false);
  });
});

describe('countQuotaUsed, remainingQuota, and quotaSnapshot', () => {
  it('counts a Jakarta-September transfer that is still 31 August in UTC', () => {
    const records = [
      transfer({
        id: 'TRX-BOUNDARY',
        createdAt: '2026-08-31T17:30:00Z',
        executedAt: '2026-08-31T17:30:00Z',
      }),
    ];
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(1);
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: AUGUST })).toBe(0);
  });

  it('consumes quota in the execution month when createdAt and executedAt fall in different months', () => {
    const records = [
      transfer({
        id: 'TRX-SCHEDULED',
        createdAt: '2026-08-28T09:02:00Z',
        executedAt: '2026-09-01T01:00:00Z',
      }),
    ];
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(1);
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: AUGUST })).toBe(0);
  });

  it('does not count reversed or failed transfers toward used quota', () => {
    const records = [
      transfer({ id: 'TRX-REVERSED', status: 'SETTLED', reversed: true }),
      transfer({ id: 'TRX-FAILED', status: 'FAILED', reversed: false }),
      transfer({
        id: 'TRX-FAILED-REVERSED',
        status: 'FAILED',
        reversed: true,
        createdAt: '2026-09-01T03:30:00Z',
        executedAt: '2026-09-01T03:30:00Z',
      }),
    ];
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(0);
    expect(remainingQuota(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(FREE_TRANSFER_QUOTA);
  });

  it('ignores channels that do not consume quota', () => {
    const records = [
      transfer({ id: 'TRX-TELLER', channel: 'TELLER' }),
      transfer({ id: 'TRX-ATM', channel: 'ATM' }),
    ];
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(0);
  });

  it('reports remaining of zero when the account has used exactly the free quota', () => {
    const records = Array.from({ length: FREE_TRANSFER_QUOTA }, (_, i) => settledInPeriod(i));
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(20);
    expect(remainingQuota(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(0);
    expect(quotaSnapshot(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toEqual({
      period: '2026-09',
      limit: 20,
      used: 20,
      remaining: 0,
    });
  });

  it('clamps remaining at zero when used exceeds the free quota', () => {
    const records = Array.from({ length: FREE_TRANSFER_QUOTA + 1 }, (_, i) => settledInPeriod(i));
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(21);
    expect(remainingQuota(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(0);
  });

  it('does not count another account’s transfers', () => {
    const records = [transfer({ accountId: 'ACC-1002' })];
    expect(countQuotaUsed(records, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(0);
  });

  it('matches the seeded history: ACC-1001 uses two September slots and one August slot', () => {
    expect(countQuotaUsed(transferRecords, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(2);
    expect(remainingQuota(transferRecords, { accountId: 'ACC-1001', at: SEPTEMBER })).toBe(18);
    expect(countQuotaUsed(transferRecords, { accountId: 'ACC-1001', at: AUGUST })).toBe(1);
  });

  it('propagates invalid timestamps from the snapshot clock', () => {
    expect(() =>
      quotaSnapshot([], { accountId: 'ACC-1001', at: 'not-a-date' }),
    ).toThrow('Invalid timestamp: not-a-date');
  });
});
