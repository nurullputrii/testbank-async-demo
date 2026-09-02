import React, { useState } from 'react';
import { api } from '../api/client.js';

export default function TransferForm({ account }) {
  const [amount, setAmount] = useState('');
  const [channel, setChannel] = useState('MOBILE');
  const [quote, setQuote] = useState(null);

  async function handleQuote() {
    const result = await api.quoteTransfer({
      from: account.id,
      amount: Number(amount),
      channel,
    });
    setQuote(result);
  }

  return (
    <section>
      <h2>Hitung Biaya Transfer</h2>

      <div>
        <label>Nominal Transfer</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Masukkan nominal"
        />
      </div>

      <div>
        <label>Saluran Transaksi</label>
        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="MOBILE">Mobile Banking</option>
          <option value="INTERNET">Internet Banking</option>
          <option value="ATM">ATM</option>
          <option value="TELLER">Teller Cabang</option>
        </select>
      </div>

      <button onClick={handleQuote}>Hitung Biaya</button>

      {quote && (
        <div>
          <div>Biaya Admin: Rp {quote.fee?.toLocaleString('id-ID')}</div>
          <div>Total Debet: Rp {quote.total?.toLocaleString('id-ID')}</div>
          <div>Sisa Kuota Gratis: {quote.quotaRemaining}</div>
        </div>
      )}
    </section>
  );
}
