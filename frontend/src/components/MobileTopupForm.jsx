import React, { useState } from 'react';
import { api } from '../api/client.js';

export default function MobileTopupForm() {
  const [customerRef, setCustomerRef] = useState('');
  const [bill, setBill] = useState(null);
  const [message, setMessage] = useState('');

  async function handleInquiry() {
    try {
      const result = await api.inquireBill('mobile-topup', customerRef);
      setBill(result);
      setMessage('');
    } catch (err) {
      setBill(null);
      setMessage('Nomor handphone tidak ditemukan');
    }
  }

  return (
    <section className="card panel">
      <h3>Isi Pulsa</h3>

      <div className="field">
        <label htmlFor="mobile-ref">Nomor Handphone</label>
        <input
          id="mobile-ref"
          className="control"
          type="text"
          value={customerRef}
          onChange={(e) => setCustomerRef(e.target.value)}
          placeholder="Masukkan nomor handphone"
        />
      </div>

      <button className="btn" onClick={handleInquiry}>
        Cek Tagihan
      </button>

      {message && <p className="muted">{message}</p>}

      {bill &&
        bill.bills.map((item) => (
          <div className="bill" key={item.period || item.customerRef}>
            <div>Nama Pelanggan: {item.name}</div>
            <div>Periode Tagihan: {item.period || 'Tidak ada periode'}</div>
            <div>Jumlah Tagihan: Rp {item.amount.toLocaleString('id-ID')}</div>
            <div>Biaya Admin: Rp {bill.adminFee.toLocaleString('id-ID')}</div>
            <div>
              Status:{' '}
              <span className={`status status--${String(item.status).toLowerCase()}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
    </section>
  );
}
