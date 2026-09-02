import { describe, it, expect } from 'vitest';
import {
  isAfterCutoff,
  nextSettlementDate,
  generateReferenceId,
  settleItem,
  buildBatch,
} from '../../src/services/settlement.js';

/**
 * This suite passes on some runs and fails on others.
 * Run it several times: npm run test:flaky --prefix backend
 *
 * Task 2 asks a cloud agent to find EVERY cause and propose fixes that keep the
 * tests deterministic without weakening what they verify.
 *
 * There is more than one cause here, and they are not the same kind of problem.
 */

describe('settlement cutoff', () => {
  it('settles today when we are still inside the operating window', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(nextSettlementDate().getTime()).toBe(today.getTime());
  });

  it('reports that we are before the cutoff', () => {
    expect(isAfterCutoff()).toBe(false);
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
