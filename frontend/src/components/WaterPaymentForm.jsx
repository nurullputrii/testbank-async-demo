import React from 'react';
import BillerPaymentForm from './BillerPaymentForm.jsx';
import { id } from '../i18n/id.js';

export default function WaterPaymentForm() {
  return (
    <BillerPaymentForm
      billerCode="water"
      title={id.billerWaterTitle}
      customerRefLabel={id.billerWaterCustomerRefLabel}
      customerRefPlaceholder={id.billerWaterCustomerRefPlaceholder}
      notFoundMessage={id.billerWaterNotFound}
    />
  );
}
