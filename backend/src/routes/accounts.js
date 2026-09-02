import { Router } from 'express';
import { accounts, findAccount } from '../data/store.js';
import { legacyResponse } from '../utils/legacyResponse.js';

const router = Router();

router.get('/', (_req, res) => {
  return legacyResponse(res, accounts);
});

router.get('/:id', (req, res) => {
  const account = findAccount(req.params.id);
  if (!account) {
    return legacyResponse(res, { message: 'Account not found' }, 404);
  }
  return legacyResponse(res, account);
});

export default router;
