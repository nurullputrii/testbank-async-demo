/**
 * Transfer fee policy.
 *
 * PARTICIPANTS: this file is deliberately NOT on the task list.
 * See TASKS.md, section "What we are not delegating".
 *
 * The open question below is not a coding problem. It is a question about what
 * Test Bank told its customers, and no agent can answer it from the code.
 */

const CHANNEL_FEE = {
  MOBILE: 2_500,
  INTERNET: 2_500,
  ATM: 6_500,
  TELLER: 15_000,
};

const TIER_DISCOUNT = {
  REGULER: 0,
  PAYROLL: 0.5,
  PRIORITAS: 1,
};

// TODO(product): the "20 transfer gratis" campaign page does not say what
// happens when a transfer fails and is reversed. Does the customer get the
// free slot back?
//
// The mobile team returns the slot. The core banking team does not. Both
// shipped. At current volume the gap is roughly 40,000 transactions a month,
// and every one of them is either a customer charged for something we called
// free, or revenue we said we would collect and did not.
//
// Do NOT let an agent choose a reading here. Product and compliance decide,
// then we implement. See consumesQuota() in transferQuota.js for where the
// current behaviour is encoded.
export function resolveTransferFee({ channel, accountTier, quotaRemaining }) {
  if (!CHANNEL_FEE[channel]) {
    throw new Error(`Unknown channel: ${channel}`);
  }
  if (TIER_DISCOUNT[accountTier] === undefined) {
    throw new Error(`Unknown account tier: ${accountTier}`);
  }

  const base = CHANNEL_FEE[channel];

  // Teller transactions are never covered by the free quota.
  if (channel === 'TELLER') {
    return Math.floor(base * (1 - TIER_DISCOUNT[accountTier]));
  }

  if (quotaRemaining > 0) {
    return 0;
  }

  return Math.floor(base * (1 - TIER_DISCOUNT[accountTier]));
}
