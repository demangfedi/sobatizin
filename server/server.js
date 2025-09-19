import express from 'express';
import cookieParser from 'cookie-parser';
import { env, assertSecrets } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { ordersRouter } from './routes/orders.js';

assertSecrets();

export const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

if (env.nodeEnv !== 'test') {
  app.listen(env.port, () => {
    console.log(`Sobat Izin API listening on port ${env.port}`);
  });
}
