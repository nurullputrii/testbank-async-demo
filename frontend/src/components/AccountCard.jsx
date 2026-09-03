import React from 'react';

export default function AccountCard({ account, onSelect, selected }) {
  return (
    <article className={selected ? 'card card--selected' : 'card'}>
      <p className="card__eyebrow">{account.tier}</p>
      <h3 className="card__title">{account.name}</h3>
      <p className="balance">Rp {account.balance.toLocaleString('id-ID')}</p>
      <p className="balance__label">Saldo tersedia</p>
      <div className="meta">
        <div>
          Nomor Rekening: <strong>{account.id}</strong>
        </div>
        <div>
          Kantor Cabang: <strong>{account.branch}</strong>
        </div>
      </div>
      <button className="btn btn--block" onClick={onSelect}>
        {selected ? 'Terpilih' : 'Lihat Detail'}
      </button>
    </article>
  );
}
