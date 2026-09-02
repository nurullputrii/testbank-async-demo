import React from 'react';
import BillerPaymentForm from './BillerPaymentForm.jsx';
import { id } from '../i18n/id.js';

export default function MobileTopupForm() {
  return (
    <BillerPaymentForm
      billerCode="mobile-topup"
      title={id.billerMobileTopupTitle}
      customerRefLabel={id.billerMobileTopupCustomerRefLabel}
      customerRefPlaceholder={id.billerMobileTopupCustomerRefPlaceholder}
      notFoundMessage={id.billerMobileTopupNotFound}
    />
  );
}
