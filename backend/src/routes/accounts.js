import { Router } from 'express';
import { accounts, findAccount } from '../data/store.js';
import { sendEnvelope, sendError } from '../utils/envelope.js';

const router = Router();

router.get('/', (_req, res) => {
  return sendEnvelope(res, { data: accounts });
});

router.get('/:id', (req, res) => {
  const account = findAccount(req.params.id);
  if (!account) {
    return sendError(res, {
      code: 'ACCOUNT_NOT_FOUND',
      message: 'Account not found',
      statusCode: 404,
    });
  }
  return sendEnvelope(res, { data: account });
});

export default router;
