import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Setup logger
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

import ingestRoutes from './routes/ingest.js';
import { initializeDatabase } from './database/db.js';

// Initialize DB on startup
initializeDatabase();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
import itemsRoutes from './routes/items.js';
import queryRoutes from './routes/query.js';
app.use('/api/ingest', ingestRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/query', queryRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
