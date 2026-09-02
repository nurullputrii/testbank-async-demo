import { Router } from 'express';
import { inquire, payable } from '../../services/billerAdapter.js';
import { sendEnvelope, sendError } from '../../utils/envelope.js';

const BILLER_CODE = 'ELECTRICITY';
const router = Router();

router.get('/inquiry/:customerRef', (req, res) => {
  const result = inquire(BILLER_CODE, req.params.customerRef);
  if (!result.found) {
    return sendError(res, {
      code: 'BILL_NOT_FOUND',
      message: 'Tagihan tidak ditemukan',
      statusCode: 404,
    });
  }
  return sendEnvelope(res, { data: result });
});

router.post('/payment', (req, res) => {
  const { customerRef, period } = req.body || {};
  const result = inquire(BILLER_CODE, customerRef);
  if (!result.found) {
    return sendError(res, {
      code: 'BILL_NOT_FOUND',
      message: 'Tagihan tidak ditemukan',
      statusCode: 404,
    });
  }
  const bill = result.bills.find((item) => item.period === period) || result.bills[0];
  if (bill.status === 'PAID') {
    return sendError(res, {
      code: 'BILL_ALREADY_PAID',
      message: 'Tagihan sudah dibayar',
      statusCode: 409,
    });
  }
  return sendEnvelope(res, { data: payable(BILLER_CODE, bill) });
});

export default router;
