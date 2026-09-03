import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function QuotaBadge({ accountId }) {
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    api.getQuota(accountId).then(setQuota).catch(() => setQuota(null));
  }, [accountId]);

  if (!quota) return null;

  return (
    <section className="quota">
      <div className="section__head">
        <h2>Kuota Transfer Gratis</h2>
        <span className="section__hint">Periode {quota.period}</span>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="stat__label">Batas Bulanan</span>
          <span className="stat__value">{quota.limit}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Sudah Terpakai</span>
          <span className="stat__value">{quota.used}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Sisa Kuota</span>
          <span className="stat__value">{quota.remaining}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Periode</span>
          <span className="stat__value">{quota.period}</span>
        </div>
      </div>
    </section>
  );
}
