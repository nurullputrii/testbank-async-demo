import React, { useState } from 'react';
import { api } from '../api/client.js';
import { id } from '../i18n/id.js';

export default function BillerPaymentForm({
  billerCode,
  title,
  customerRefLabel,
  customerRefPlaceholder,
  notFoundMessage,
}) {
  const [customerRef, setCustomerRef] = useState('');
  const [bill, setBill] = useState(null);
  const [message, setMessage] = useState('');

  const inputId = `biller-${billerCode}-customer-ref`;

  async function handleInquiry() {
    try {
      const result = await api.inquireBill(billerCode, customerRef);
      setBill(result);
      setMessage('');
    } catch (err) {
      setBill(null);
      setMessage(notFoundMessage);
    }
  }

  return (
    <section style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <h3>{title}</h3>

      <div>
        <label htmlFor={inputId}>{customerRefLabel}</label>
        <input
          id={inputId}
          type="text"
          value={customerRef}
          onChange={(e) => setCustomerRef(e.target.value)}
          placeholder={customerRefPlaceholder}
        />
      </div>

      <button onClick={handleInquiry}>{id.billInquiryButton}</button>

      {message && <p>{message}</p>}

      {bill && bill.bills.map((item) => (
        <div key={item.period || item.customerRef}>
          <div>{id.billCustomerNameLabel}: {item.name}</div>
          <div>{id.billPeriodLabel}: {item.period || id.billPeriodEmpty}</div>
          <div>{id.billAmountLabel}: Rp {item.amount.toLocaleString('id-ID')}</div>
          <div>{id.billAdminFeeLabel}: Rp {bill.adminFee.toLocaleString('id-ID')}</div>
          <div>{id.billStatusLabel}: {item.status}</div>
        </div>
      ))}
    </section>
  );
}
