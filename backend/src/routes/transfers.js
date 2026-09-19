import { Router } from 'express';
import { transferRecords, findAccount, transfersFor } from '../data/store.js';
import { resolveTransferFee } from '../services/feePolicy.js';
import { quotaSnapshot, remainingQuota } from '../services/transferQuota.js';
import { listRecentTransfers } from '../services/recentTransfers.js';
import { legacyResponse } from '../utils/legacyResponse.js';
import { sendEnvelope, sendError } from '../utils/envelope.js';

const router = Router();

// New routes use the v2 envelope. Existing handlers below stay on v1 until Task 1.
router.get('/:accountId/recent', (req, res) => {
  const account = findAccount(req.params.accountId);
  if (!account) {
    return sendError(res, {
      code: 'ACCOUNT_NOT_FOUND',
      message: 'Account not found',
      statusCode: 404,
    });
  }
  // TODO(BCAD-101): listRecentTransfers still returns []. Wire-up is done so
  // Plan Mode can follow the handler; fill the service, then add sort/limit tests.
  const items = listRecentTransfers(account.id);
  return sendEnvelope(res, { data: { items } });
});

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
