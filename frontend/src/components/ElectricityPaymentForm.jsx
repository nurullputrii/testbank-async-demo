import React from 'react';
import BillerPaymentForm from './BillerPaymentForm.jsx';
import { id } from '../i18n/id.js';

export default function ElectricityPaymentForm() {
  return (
    <BillerPaymentForm
      billerCode="electricity"
      title={id.billerElectricityTitle}
      customerRefLabel={id.billerElectricityCustomerRefLabel}
      customerRefPlaceholder={id.billerElectricityCustomerRefPlaceholder}
      notFoundMessage={id.billerElectricityNotFound}
    />
  );
}
