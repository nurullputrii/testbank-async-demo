import { describe, it, expect } from 'vitest';
import { resolveTransferFee } from '../../src/services/feePolicy.js';

describe('resolveTransferFee', () => {
  it('charges nothing while free quota remains', () => {
    expect(resolveTransferFee({ channel: 'MOBILE', accountTier: 'REGULER', quotaRemaining: 5 })).toBe(0);
  });

  it('charges the full rate once quota is exhausted', () => {
    expect(resolveTransferFee({ channel: 'MOBILE', accountTier: 'REGULER', quotaRemaining: 0 })).toBe(2_500);
  });

  it('halves the fee for payroll customers', () => {
    expect(resolveTransferFee({ channel: 'ATM', accountTier: 'PAYROLL', quotaRemaining: 0 })).toBe(3_250);
  });

  it('waives the fee entirely for priority customers', () => {
    expect(resolveTransferFee({ channel: 'TELLER', accountTier: 'PRIORITAS', quotaRemaining: 0 })).toBe(0);
  });

  it('never covers teller transactions with free quota', () => {
    expect(resolveTransferFee({ channel: 'TELLER', accountTier: 'REGULER', quotaRemaining: 20 })).toBe(15_000);
  });

  it('rejects an unknown channel', () => {
    expect(() => resolveTransferFee({ channel: 'PIGEON', accountTier: 'REGULER', quotaRemaining: 1 })).toThrow();
  });

  it('rejects an unknown tier', () => {
    expect(() => resolveTransferFee({ channel: 'MOBILE', accountTier: 'PLATINUM', quotaRemaining: 1 })).toThrow();
  });
});
