import React, { useEffect, useState } from 'react';
import { api } from './api/client.js';
import BrandMark from './components/BrandMark.jsx';
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

  function jumpToId(id) {
    const target = document.getElementById(id);
    const header = document.querySelector('.header');
    if (!target) return;
    const cover = header ? header.getBoundingClientRect().height : 0;
    const top = window.scrollY + target.getBoundingClientRect().top - cover - 24;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function scrollToSection(event, id) {
    event.preventDefault();
    jumpToId(id);
    window.history.replaceState(null, '', `#${id}`);
  }

  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (!id) return;
    jumpToId(id);
  }, [selected]);

  return (
    <div className="app">
      <a className="skip-link" href="#rekening" onClick={(event) => scrollToSection(event, 'rekening')}>
        Lewati ke konten
      </a>

      <div className="topbar">
        <div className="topbar__inner">
          <span>Hubungi kami 1500017 · Senin–Jumat 08.00–17.00 WIB</span>
          <span>Bahasa Indonesia</span>
        </div>
      </div>

      <header className="header">
        <div className="header__inner">
          <a className="brand" href="#rekening" onClick={(event) => scrollToSection(event, 'rekening')}>
            <BrandMark />
            <span>
              <span className="brand__name">TEST BANK</span>
              <span className="brand__legal">Melayani Dengan Setulus Hati</span>
            </span>
          </a>
          <nav className="nav" aria-label="Menu utama">
            <a href="#rekening" onClick={(event) => scrollToSection(event, 'rekening')}>
              Individu
            </a>
            <a href="#transfer" onClick={(event) => scrollToSection(event, 'transfer')}>
              Transfer
            </a>
            <a href="#tagihan" onClick={(event) => scrollToSection(event, 'tagihan')}>
              Tagihan
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero__inner">
          <p className="hero__kicker">Satu Bank Untuk Semua</p>
          <h1>Melayani Dengan Setulus Hati</h1>
          <p>
            Pilih rekening untuk melihat kuota transfer dan melakukan pembayaran
            tagihan dengan layanan yang tenang, modern, dan mudah dikenali.
          </p>
        </div>
      </section>

      <main className="page">
        {error && <p className="alert">{error}</p>}

        <section className="section" id="rekening">
          <div className="section__head">
            <h2>Daftar Rekening</h2>
            <span className="section__hint">Pilih rekening aktif Anda</span>
          </div>
          <div className="grid">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                selected={selected?.id === account.id}
                onSelect={() => setSelected(account)}
              />
            ))}
          </div>
        </section>

        <div className="workspace">
          {selected && <QuotaBadge accountId={selected.id} />}
          {selected ? (
            <TransferForm account={selected} />
          ) : (
            <section className="card panel" id="transfer">
              <h2>Hitung Biaya Transfer</h2>
              <p className="muted">
                Pilih rekening terlebih dahulu untuk menghitung biaya transfer.
              </p>
            </section>
          )}
          <section className="section" id="tagihan">
            <div className="section__head">
              <h2>Pembayaran Tagihan</h2>
            </div>
            {selected ? (
              <div className="bills">
                <ElectricityPaymentForm />
                <WaterPaymentForm />
                <MobileTopupForm />
              </div>
            ) : (
              <p className="alert alert--info">
                Pilih rekening untuk melihat kuota transfer dan melakukan pembayaran tagihan.
              </p>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__grid">
            <div>
              <h2>Test Bank Kantor Pusat</h2>
              <p>
                Test Bank Digital adalah bank ritel fiktif untuk keperluan pelatihan.
                Tidak ada data nasabah sungguhan, kredensial, atau sistem produksi.
              </p>
            </div>
            <div>
              <h2>Hubungi Kami</h2>
              <p>1500017</p>
            </div>
            <div>
              <h2>Tautan</h2>
              <p>
                <a href="#rekening" onClick={(event) => scrollToSection(event, 'rekening')}>
                  Rekening
                </a>
                <br />
                <a href="#transfer" onClick={(event) => scrollToSection(event, 'transfer')}>
                  Transfer
                </a>
                <br />
                <a href="#tagihan" onClick={(event) => scrollToSection(event, 'tagihan')}>
                  Tagihan
                </a>
              </p>
            </div>
          </div>
          <p className="footer__legal">
            Test Bank berizin dan diawasi dalam lingkungan pelatihan. Simpanan pada
            aplikasi ini bersifat fiktif dan tidak dijamin lembaga mana pun.
          </p>
        </div>
      </footer>
    </div>
  );
}
