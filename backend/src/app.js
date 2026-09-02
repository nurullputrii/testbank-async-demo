import express from 'express';
import accounts from './routes/accounts.js';
import transfers from './routes/transfers.js';
import electricity from './routes/billers/electricity.js';
import mobileTopup from './routes/billers/mobileTopup.js';
import healthInsurance from './routes/billers/healthInsurance.js';
import water from './routes/billers/water.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/accounts', accounts);
  app.use('/api/transfers', transfers);
  app.use('/api/billers/electricity', electricity);
  app.use('/api/billers/mobile-topup', mobileTopup);
  app.use('/api/billers/health-insurance', healthInsurance);
  app.use('/api/billers/water', water);

  return app;
}
