import React from 'react';

export default function AccountCard({ account, onSelect }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <strong>{account.name}</strong>
      <div>Nomor Rekening: {account.id}</div>
      <div>Tipe Nasabah: {account.tier}</div>
      <div>Saldo: Rp {account.balance.toLocaleString('id-ID')}</div>
      <div>Kantor Cabang: {account.branch}</div>
      <button onClick={onSelect}>Lihat Detail</button>
    </div>
  );
}
