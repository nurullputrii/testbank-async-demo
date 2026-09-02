import React, { useEffect, useState } from 'react';
import { api } from './api/client.js';
import { id } from './i18n/id.js';
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
      .catch(() => setError(id.accountsLoadError));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1>{id.appTitle}</h1>
      <p>{id.appIntro}</p>

      {error && <p style={{ color: '#b00020' }}>{error}</p>}

      <section>
        <h2>{id.accountsHeading}</h2>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} onSelect={() => setSelected(account)} />
        ))}
      </section>

      {selected && (
        <>
          <QuotaBadge accountId={selected.id} />
          <TransferForm account={selected} />
          <h2>{id.billsHeading}</h2>
          <ElectricityPaymentForm />
          <WaterPaymentForm />
          <MobileTopupForm />
        </>
      )}
    </main>
  );
}
