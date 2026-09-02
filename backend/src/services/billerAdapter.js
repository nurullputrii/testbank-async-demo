/**
 * Shared biller lookup and payment simulation.
 * Every biller route talks to this. No external network calls.
 */
import { findBills } from '../data/store.js';

export const BILLER_LABELS = {
  ELECTRICITY: 'Listrik',
  WATER: 'Air',
  HEALTH_INSURANCE: 'Asuransi Kesehatan',
  MOBILE_TOPUP: 'Pulsa',
};

export const ADMIN_FEE = {
  ELECTRICITY: 3_000,
  WATER: 2_500,
  HEALTH_INSURANCE: 2_500,
  MOBILE_TOPUP: 1_500,
};

export function inquire(billerCode, customerRef) {
  const found = findBills(billerCode, customerRef);
  if (found.length === 0) {
    return { found: false, bills: [] };
  }
  return {
    found: true,
    biller: BILLER_LABELS[billerCode],
    adminFee: ADMIN_FEE[billerCode],
    bills: found,
  };
}

export function payable(billerCode, bill) {
  return {
    billerCode,
    customerRef: bill.customerRef,
    period: bill.period,
    amount: bill.amount,
    adminFee: ADMIN_FEE[billerCode],
    total: bill.amount + ADMIN_FEE[billerCode],
  };
}
