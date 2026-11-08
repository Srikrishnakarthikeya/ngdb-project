import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import walletRoutes from './routes/wallet.js';
import coordinatorRoutes from './routes/coordinator.js';
import volunteerRoutes from './routes/volunteer.js';

const app = express();
const port = Number(process.env.PORT || 5000);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '12mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', storage: 'json-files', database: 'not-used' }));
app.use('/api/auth', authRoutes);
app.use('/api', walletRoutes);
app.use('/api', coordinatorRoutes);
app.use('/api', volunteerRoutes);
app.use('/api', apiRoutes);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
  console.log('Storage: backend/data/*.json');
});
