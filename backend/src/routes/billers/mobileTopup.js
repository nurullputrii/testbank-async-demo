import { Router } from 'express';
import { inquire, payable } from '../../services/billerAdapter.js';
import { legacyResponse } from '../../utils/legacyResponse.js';

const BILLER_CODE = 'MOBILE_TOPUP';
const router = Router();

router.get('/inquiry/:customerRef', (req, res) => {
  const result = inquire(BILLER_CODE, req.params.customerRef);
  if (!result.found) {
    return legacyResponse(res, { message: 'Tagihan tidak ditemukan' }, 404);
  }
  return legacyResponse(res, result);
});

router.post('/payment', (req, res) => {
  const { customerRef, period } = req.body || {};
  const result = inquire(BILLER_CODE, customerRef);
  if (!result.found) {
    return legacyResponse(res, { message: 'Tagihan tidak ditemukan' }, 404);
  }
  const bill = result.bills.find((item) => item.period === period) || result.bills[0];
  if (bill.status === 'PAID') {
    return legacyResponse(res, { message: 'Tagihan sudah dibayar' }, 409);
  }
  return legacyResponse(res, payable(BILLER_CODE, bill));
});

export default router;
