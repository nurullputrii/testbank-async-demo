import React from 'react';
import { id } from '../i18n/id.js';

export default function AccountCard({ account, onSelect }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <strong>{account.name}</strong>
      <div>{id.accountNumberLabel}: {account.id}</div>
      <div>{id.accountTierLabel}: {account.tier}</div>
      <div>{id.accountBalanceLabel}: Rp {account.balance.toLocaleString('id-ID')}</div>
      <div>{id.accountBranchLabel}: {account.branch}</div>
      <button onClick={onSelect}>{id.accountDetailButton}</button>
    </div>
  );
}
