import React, { useEffect, useState } from 'react';
import { api } from './api/client.js';
import AccountCard from './components/AccountCard.jsx';
import TransferForm from './components/TransferForm.jsx';
import QuotaBadge from './components/QuotaBadge.jsx';
import ElectricityPaymentForm from './components/ElectricityPaymentForm.jsx';
import WaterPaymentForm from './components/WaterPaymentForm.jsx';
import MobileTopupForm from './components/MobileTopupForm.jsx';

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .listAccounts()
      .then(setAccounts)
      .catch(() => setError('Gagal memuat data rekening'));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>Test Bank Digital</h1>
      <p>Pilih rekening untuk melihat kuota transfer dan melakukan pembayaran tagihan.</p>

      {error && <p style={{ color: '#b00020' }}>{error}</p>}

      <section>
        <h2>Daftar Rekening</h2>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} onSelect={() => setSelected(account)} />
        ))}
      </section>

      {selected && (
        <>
          <QuotaBadge accountId={selected.id} />
          <TransferForm account={selected} />
          <h2>Pembayaran Tagihan</h2>
          <ElectricityPaymentForm />
          <WaterPaymentForm />
          <MobileTopupForm />
        </>
      )}
    </main>
  );
}
