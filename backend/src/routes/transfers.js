import { Router } from 'express';
import { transferRecords, findAccount, transfersFor } from '../data/store.js';
import { resolveTransferFee } from '../services/feePolicy.js';
import { quotaSnapshot, remainingQuota } from '../services/transferQuota.js';
import { sendEnvelope, sendError } from '../utils/envelope.js';

const router = Router();

router.get('/:accountId', (req, res) => {
  const account = findAccount(req.params.accountId);
  if (!account) {
    return sendError(res, {
      code: 'ACCOUNT_NOT_FOUND',
      message: 'Account not found',
      statusCode: 404,
    });
  }
  return sendEnvelope(res, { data: transfersFor(account.id) });
});

router.get('/:accountId/quota', (req, res) => {
  const account = findAccount(req.params.accountId);
  if (!account) {
    return sendError(res, {
      code: 'ACCOUNT_NOT_FOUND',
      message: 'Account not found',
      statusCode: 404,
    });
  }
  return sendEnvelope(res, {
    data: quotaSnapshot(transferRecords, { accountId: account.id }),
  });
});

router.post('/quote', (req, res) => {
  const { from, amount, channel } = req.body || {};
  const account = findAccount(from);
  if (!account) {
    return sendError(res, {
      code: 'SOURCE_ACCOUNT_NOT_FOUND',
      message: 'Source account not found',
      statusCode: 404,
    });
  }
  if (!amount || amount <= 0) {
    return sendError(res, {
      code: 'INVALID_AMOUNT',
      message: 'Amount must be greater than zero',
      statusCode: 400,
    });
  }
  try {
    const quotaRemaining = remainingQuota(transferRecords, {
      accountId: account.id,
      at: new Date().toISOString(),
    });
    const fee = resolveTransferFee({ channel, accountTier: account.tier, quotaRemaining });
    return sendEnvelope(res, {
      data: { amount, fee, total: amount + fee, quotaRemaining },
    });
  } catch (err) {
    return sendError(res, {
      code: 'FEE_QUOTE_FAILED',
      message: err.message,
      statusCode: 400,
    });
  }
});

export default router;
