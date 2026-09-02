import { Router } from 'express';
import { transferRecords, findAccount, transfersFor } from '../data/store.js';
import { resolveTransferFee } from '../services/feePolicy.js';
import { quotaSnapshot, remainingQuota } from '../services/transferQuota.js';
import { legacyResponse } from '../utils/legacyResponse.js';

const router = Router();

router.get('/:accountId', (req, res) => {
  const account = findAccount(req.params.accountId);
  if (!account) {
    return legacyResponse(res, { message: 'Account not found' }, 404);
  }
  return legacyResponse(res, transfersFor(account.id));
});

router.get('/:accountId/quota', (req, res) => {
  const account = findAccount(req.params.accountId);
  if (!account) {
    return legacyResponse(res, { message: 'Account not found' }, 404);
  }
  return legacyResponse(res, quotaSnapshot(transferRecords, { accountId: account.id }));
});

router.post('/quote', (req, res) => {
  const { from, amount, channel } = req.body || {};
  const account = findAccount(from);
  if (!account) {
    return legacyResponse(res, { message: 'Source account not found' }, 404);
  }
  if (!amount || amount <= 0) {
    return legacyResponse(res, { message: 'Amount must be greater than zero' }, 400);
  }
  try {
    const quotaRemaining = remainingQuota(transferRecords, {
      accountId: account.id,
      at: new Date().toISOString(),
    });
    const fee = resolveTransferFee({ channel, accountTier: account.tier, quotaRemaining });
    return legacyResponse(res, { amount, fee, total: amount + fee, quotaRemaining });
  } catch (err) {
    return legacyResponse(res, { message: err.message }, 400);
  }
});

export default router;
