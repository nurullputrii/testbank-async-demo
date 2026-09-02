import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function QuotaBadge({ accountId }) {
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    api.getQuota(accountId).then(setQuota).catch(() => setQuota(null));
  }, [accountId]);

  if (!quota) return null;

  return (
    <section>
      <h2>Kuota Transfer Gratis</h2>
      <div>Periode: {quota.period}</div>
      <div>Batas Bulanan: {quota.limit} transaksi</div>
      <div>Sudah Terpakai: {quota.used} transaksi</div>
      <div>Sisa Kuota: {quota.remaining} transaksi</div>
    </section>
  );
}
