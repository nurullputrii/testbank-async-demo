import React, { useState } from 'react';
import { api } from '../api/client.js';

export default function WaterPaymentForm() {
  const [customerRef, setCustomerRef] = useState('');
  const [bill, setBill] = useState(null);
  const [message, setMessage] = useState('');

  async function handleInquiry() {
    try {
      const result = await api.inquireBill('water', customerRef);
      setBill(result);
      setMessage('');
    } catch (err) {
      setBill(null);
      setMessage('Tagihan air tidak ditemukan');
    }
  }

  return (
    <section style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
      <h3>Tagihan Air</h3>

      <div>
        <label>Nomor Pelanggan PDAM</label>
        <input
          type="text"
          value={customerRef}
          onChange={(e) => setCustomerRef(e.target.value)}
          placeholder="Masukkan nomor pelanggan"
        />
      </div>

      <button onClick={handleInquiry}>Cek Tagihan</button>

      {message && <p>{message}</p>}

      {bill && bill.bills.map((item) => (
        <div key={item.period || item.customerRef}>
          <div>Nama Pelanggan: {item.name}</div>
          <div>Periode Tagihan: {item.period || 'Tidak ada periode'}</div>
          <div>Jumlah Tagihan: Rp {item.amount.toLocaleString('id-ID')}</div>
          <div>Biaya Admin: Rp {bill.adminFee.toLocaleString('id-ID')}</div>
          <div>Status: {item.status}</div>
        </div>
      ))}
    </section>
  );
}
