import { describe, it, expect } from 'vitest';
import {
  isAfterCutoff,
  nextSettlementDate,
  generateReferenceId,
  settleItem,
  buildBatch,
} from '../../src/services/settlement.js';

/**
 * Cutoff helpers accept an explicit clock. Tests pin a local wall time
 * inside the operating window so they do not depend on when the suite runs.
 */
const INSIDE_OPERATING_WINDOW = new Date(2026, 8, 3, 10, 0, 0, 0);

describe('settlement cutoff', () => {
  it('settles today when we are still inside the operating window', () => {
    const today = new Date(INSIDE_OPERATING_WINDOW);
    today.setHours(0, 0, 0, 0);
    expect(nextSettlementDate(INSIDE_OPERATING_WINDOW).getTime()).toBe(today.getTime());
  });

  it('reports that we are before the cutoff', () => {
    expect(isAfterCutoff(INSIDE_OPERATING_WINDOW)).toBe(false);
  });
});

describe('reference numbers', () => {
  it('never issues the same reference twice in one batch', () => {
    const issued = [];
    for (let i = 0; i < 30; i += 1) {
      issued.push(generateReferenceId());
    }
    expect(new Set(issued).size).toBe(issued.length);
  });
});

describe('clearing hand-off', () => {
  it('settles transfers in submission order', async () => {
    const batch = buildBatch(3);
    const sink = [];

    await Promise.all(batch.map((item) => settleItem(item, sink)));

    expect(sink).toEqual(batch.map((item) => item.id));
  });
});
