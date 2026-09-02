import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { id } from '../i18n/id.js';

export default function QuotaBadge({ accountId }) {
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    api.getQuota(accountId).then(setQuota).catch(() => setQuota(null));
  }, [accountId]);

  if (!quota) return null;

  return (
    <section>
      <h2>{id.quotaHeading}</h2>
      <div>{id.quotaPeriodLabel}: {quota.period}</div>
      <div>{id.quotaLimitLabel}: {quota.limit} {id.quotaTransactionUnit}</div>
      <div>{id.quotaUsedLabel}: {quota.used} {id.quotaTransactionUnit}</div>
      <div>{id.quotaRemainingLabel}: {quota.remaining} {id.quotaTransactionUnit}</div>
    </section>
  );
}
