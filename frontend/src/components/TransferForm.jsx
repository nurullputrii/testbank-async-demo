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
    <section className="card panel" id="transfer">
      <h2>Hitung Biaya Transfer</h2>

      <div className="field">
        <label htmlFor="transfer-amount">Nominal Transfer</label>
        <input
          id="transfer-amount"
          className="control"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Masukkan nominal"
        />
      </div>

      <div className="field">
        <label htmlFor="transfer-channel">Saluran Transaksi</label>
        <select
          id="transfer-channel"
          className="control"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="MOBILE">Mobile Banking</option>
          <option value="INTERNET">Internet Banking</option>
          <option value="ATM">ATM</option>
          <option value="TELLER">Teller Cabang</option>
        </select>
      </div>

      <button className="btn" onClick={handleQuote}>
        Hitung Biaya
      </button>

      {quote && (
        <div className="quote">
          <div>
            Biaya Admin: <strong>Rp {quote.fee?.toLocaleString('id-ID')}</strong>
          </div>
          <div>
            Total Debet: <strong>Rp {quote.total?.toLocaleString('id-ID')}</strong>
          </div>
          <div>Sisa Kuota Gratis: {quote.quotaRemaining}</div>
        </div>
      )}
    </section>
  );
}
