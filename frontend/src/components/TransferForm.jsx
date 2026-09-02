import React, { useState } from 'react';
import { api } from '../api/client.js';
import { id } from '../i18n/id.js';

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
      <h2>{id.transferHeading}</h2>

      <div>
        <label htmlFor="transfer-amount">{id.transferAmountLabel}</label>
        <input
          id="transfer-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={id.transferAmountPlaceholder}
        />
      </div>

      <div>
        <label htmlFor="transfer-channel">{id.transferChannelLabel}</label>
        <select
          id="transfer-channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="MOBILE">{id.transferChannelMobile}</option>
          <option value="INTERNET">{id.transferChannelInternet}</option>
          <option value="ATM">{id.transferChannelAtm}</option>
          <option value="TELLER">{id.transferChannelTeller}</option>
        </select>
      </div>

      <button onClick={handleQuote}>{id.transferQuoteButton}</button>

      {quote && (
        <div>
          <div>{id.transferFeeLabel}: Rp {quote.fee?.toLocaleString('id-ID')}</div>
          <div>{id.transferTotalLabel}: Rp {quote.total?.toLocaleString('id-ID')}</div>
          <div>{id.transferQuotaRemainingLabel}: {quote.quotaRemaining}</div>
        </div>
      )}
    </section>
  );
}
