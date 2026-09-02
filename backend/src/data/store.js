/**
 * In-memory fixture data for Test Bank.
 * Every customer, account, and bill here is invented for training purposes.
 * No real data, no credentials, no production connection strings.
 */
export const accounts = [
  { id: 'ACC-1001', name: 'Rina Wijaya', tier: 'REGULER', balance: 3_450_000, branch: 'JKT-01' },
  { id: 'ACC-1002', name: 'Dimas Prakoso', tier: 'PRIORITAS', balance: 41_200_000, branch: 'BDG-04' },
  { id: 'ACC-1003', name: 'Sari Oktaviani', tier: 'REGULER', balance: 780_000, branch: 'JKT-07' },
  { id: 'ACC-1004', name: 'Bayu Nugroho', tier: 'PAYROLL', balance: 9_150_000, branch: 'SBY-02' },
];

/**
 * Transfer history. Note the mixed shapes on purpose:
 * - some are instant, some were scheduled and executed later
 * - some were reversed after settlement failed
 * This is the raw material for the quota logic in services/transferQuota.js
 */
export const transferRecords = [
  { id: 'TRX-9001', accountId: 'ACC-1001', to: 'ACC-1003', amount: 250_000, channel: 'MOBILE', createdAt: '2026-09-01T02:11:00Z', executedAt: '2026-09-01T02:11:00Z', status: 'SETTLED', reversed: false },
  { id: 'TRX-9002', accountId: 'ACC-1001', to: 'ACC-1004', amount: 1_500_000, channel: 'MOBILE', createdAt: '2026-08-31T16:40:00Z', executedAt: '2026-08-31T16:40:00Z', status: 'SETTLED', reversed: false },
  { id: 'TRX-9003', accountId: 'ACC-1001', to: 'ACC-1002', amount: 90_000, channel: 'MOBILE', createdAt: '2026-08-28T09:02:00Z', executedAt: '2026-09-01T01:00:00Z', status: 'SETTLED', reversed: false },
  { id: 'TRX-9004', accountId: 'ACC-1001', to: 'ACC-1003', amount: 400_000, channel: 'MOBILE', createdAt: '2026-09-01T03:30:00Z', executedAt: '2026-09-01T03:30:00Z', status: 'FAILED', reversed: true },
  { id: 'TRX-9005', accountId: 'ACC-1002', to: 'ACC-1001', amount: 2_750_000, channel: 'INTERNET', createdAt: '2026-09-01T05:15:00Z', executedAt: '2026-09-01T05:15:00Z', status: 'SETTLED', reversed: false },
];

export const bills = [
  { billerCode: 'ELECTRICITY', customerRef: '512300998877', name: 'Rina Wijaya', period: '2026-08', amount: 384_500, status: 'UNPAID' },
  { billerCode: 'ELECTRICITY', customerRef: '512300112233', name: 'Bayu Nugroho', period: '2026-08', amount: 1_120_000, status: 'PAID' },
  { billerCode: 'WATER', customerRef: 'PDAM-77120', name: 'Rina Wijaya', period: '2026-08', amount: 96_000, status: 'UNPAID' },
  { billerCode: 'HEALTH_INSURANCE', customerRef: '0001234567890', name: 'Sari Oktaviani', period: '2026-09', amount: 150_000, status: 'UNPAID' },
  { billerCode: 'MOBILE_TOPUP', customerRef: '081200110022', name: 'Dimas Prakoso', period: null, amount: 100_000, status: 'AVAILABLE' },
];

export function findAccount(id) {
  return accounts.find((a) => a.id === id) || null;
}

export function findBills(billerCode, customerRef) {
  return bills.filter((b) => b.billerCode === billerCode && b.customerRef === customerRef);
}

export function transfersFor(accountId) {
  return transferRecords.filter((t) => t.accountId === accountId);
}
