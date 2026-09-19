import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

const app = createApp();

/**
 * Every assertion here is written against the v1 contract.
 * Task 1 migrates the routes to the v2 envelope, so these tests must move too.
 * An agent that changes the routes and leaves these untouched has not finished.
 */
describe('accounts', () => {
  it('lists accounts', async () => {
    const res = await request(app).get('/api/accounts');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.result).toHaveLength(4);
  });

  it('returns 404 for an unknown account', async () => {
    const res = await request(app).get('/api/accounts/ACC-0000');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('transfers', () => {
  it('quotes a mobile transfer while quota remains', async () => {
    const res = await request(app)
      .post('/api/transfers/quote')
      .send({ from: 'ACC-1001', amount: 250_000, channel: 'MOBILE' });
    expect(res.status).toBe(200);
    expect(res.body.result.fee).toBe(0);
  });

  it('rejects a zero amount', async () => {
    const res = await request(app)
      .post('/api/transfers/quote')
      .send({ from: 'ACC-1001', amount: 0, channel: 'MOBILE' });
    expect(res.status).toBe(400);
  });

  it('reports a quota snapshot', async () => {
    const res = await request(app).get('/api/transfers/ACC-1001/quota');
    expect(res.status).toBe(200);
    expect(res.body.result.limit).toBe(20);
    expect(res.body.result.remaining).toBeLessThanOrEqual(20);
  });
});

/**
 * BCAD-101 scaffolding. The handler is v2 on purpose; listRecentTransfers still
 * returns []. Plan Mode must add newest-first + max-5 assertions — do not assert
 * an empty list here or the implementing tests will fight the stub.
 */
describe('transfers recent (BCAD-101 scaffolding)', () => {
  it('returns 404 with a v2 error for an unknown account', async () => {
    const res = await request(app).get('/api/transfers/ACC-0000/recent');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('ACCOUNT_NOT_FOUND');
    expect(res.body.meta.apiVersion).toBe('2');
    expect(res.body.result).toBeUndefined();
  });

  it('returns a v2 envelope with an items array', async () => {
    const res = await request(app).get('/api/transfers/ACC-1001/recent');
    expect(res.status).toBe(200);
    expect(res.body.meta.apiVersion).toBe('2');
    expect(res.body.data.items).toBeInstanceOf(Array);
    expect(res.body.data.items.length).toBeLessThanOrEqual(5);
    expect(res.body.result).toBeUndefined();
    // TODO(BCAD-101): assert newest executedAt first and ACC-1001's four fixture rows
  });
});

describe('billers', () => {
  it('finds an unpaid electricity bill', async () => {
    const res = await request(app).get('/api/billers/electricity/inquiry/512300998877');
    expect(res.status).toBe(200);
    expect(res.body.result.bills[0].amount).toBe(384_500);
  });

  it('returns 404 for an unknown water customer', async () => {
    const res = await request(app).get('/api/billers/water/inquiry/PDAM-00000');
    expect(res.status).toBe(404);
  });

  it('refuses to pay an already paid bill', async () => {
    const res = await request(app)
      .post('/api/billers/electricity/payment')
      .send({ customerRef: '512300112233', period: '2026-08' });
    expect(res.status).toBe(409);
  });

  it('quotes a health insurance payment with admin fee', async () => {
    const res = await request(app)
      .post('/api/billers/health-insurance/payment')
      .send({ customerRef: '0001234567890', period: '2026-09' });
    expect(res.status).toBe(200);
    expect(res.body.result.total).toBe(152_500);
  });
});
