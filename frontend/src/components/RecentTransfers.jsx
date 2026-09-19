import React from 'react';

/**
 * BCAD-101 placeholder. Visible in the account detail pane on purpose so the
 * workshop presenter can point at unfinished work.
 *
 * TODO(BCAD-101): fetch GET /api/transfers/:accountId/recent
 * TODO(BCAD-101): this endpoint is v2 — read `payload.data`, not `payload.result`
 * TODO(BCAD-101): render up to 5 rows; badge status; empty state in Bahasa Indonesia
 * TODO(BCAD-101): format amounts with toLocaleString('id-ID'); never use floats
 */
export default function RecentTransfers({ accountId }) {
  return (
    <section
      style={{
        border: '1px dashed #888',
        borderRadius: 8,
        padding: 12,
        margin: '16px 0',
        background: '#fafafa',
      }}
    >
      <h2>Mutasi Transfer Terakhir</h2>
      <p>
        Data belum dimuat. Tiket <code>BCAD-101</code> masih terbuka
        {accountId ? ` untuk rekening ${accountId}` : ''}.
      </p>
      {/* TODO(BCAD-101): replace this paragraph with the fetched list or empty state */}
    </section>
  );
}
