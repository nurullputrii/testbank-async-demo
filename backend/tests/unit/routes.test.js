import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

const app = createApp();

/**
 * Every assertion here is written against the v2 envelope in
 * src/utils/envelope.js:
 *   success: { data, meta: { apiVersion, timestamp, ... } }
 *   failure: { error: { code, message }, meta: { apiVersion, timestamp } }
 */

function expectMeta(body) {
  expect(body.meta).toBeDefined();
  expect(body.meta.apiVersion).toBe('2');
  expect(typeof body.meta.timestamp).toBe('string');
}

describe('accounts', () => {
  it('lists accounts', async () => {
    const res = await request(app).get('/api/accounts');
    expect(res.status).toBe(200);
    expectMeta(res.body);
    expect(res.body.data).toHaveLength(4);
  });

  it('returns 404 for an unknown account', async () => {
    const res = await request(app).get('/api/accounts/ACC-0000');
    expect(res.status).toBe(404);
    expectMeta(res.body);
    expect(res.body.error.code).toBe('ACCOUNT_NOT_FOUND');
    expect(res.body.error.message).toBe('Account not found');
  });
});

describe('transfers', () => {
  it('quotes a mobile transfer while quota remains', async () => {
    const res = await request(app)
      .post('/api/transfers/quote')
      .send({ from: 'ACC-1001', amount: 250_000, channel: 'MOBILE' });
    expect(res.status).toBe(200);
    expectMeta(res.body);
    expect(res.body.data.fee).toBe(0);
  });

  it('rejects a zero amount', async () => {
    const res = await request(app)
      .post('/api/transfers/quote')
      .send({ from: 'ACC-1001', amount: 0, channel: 'MOBILE' });
    expect(res.status).toBe(400);
    expectMeta(res.body);
    expect(res.body.error.code).toBe('INVALID_AMOUNT');
  });

  it('reports a quota snapshot', async () => {
    const res = await request(app).get('/api/transfers/ACC-1001/quota');
    expect(res.status).toBe(200);
    expectMeta(res.body);
    expect(res.body.data.limit).toBe(20);
    expect(res.body.data.remaining).toBeLessThanOrEqual(20);
  });
});

describe('billers', () => {
  it('finds an unpaid electricity bill', async () => {
    const res = await request(app).get('/api/billers/electricity/inquiry/512300998877');
    expect(res.status).toBe(200);
    expectMeta(res.body);
    expect(res.body.data.bills[0].amount).toBe(384_500);
  });

  it('returns 404 for an unknown water customer', async () => {
    const res = await request(app).get('/api/billers/water/inquiry/PDAM-00000');
    expect(res.status).toBe(404);
    expectMeta(res.body);
    expect(res.body.error.code).toBe('BILL_NOT_FOUND');
  });

  it('refuses to pay an already paid bill', async () => {
    const res = await request(app)
      .post('/api/billers/electricity/payment')
      .send({ customerRef: '512300112233', period: '2026-08' });
    expect(res.status).toBe(409);
    expectMeta(res.body);
    expect(res.body.error.code).toBe('BILL_ALREADY_PAID');
  });

  it('quotes a health insurance payment with admin fee', async () => {
    const res = await request(app)
      .post('/api/billers/health-insurance/payment')
      .send({ customerRef: '0001234567890', period: '2026-09' });
    expect(res.status).toBe(200);
    expectMeta(res.body);
    expect(res.body.data.total).toBe(152_500);
  });
});
