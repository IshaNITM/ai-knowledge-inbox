import Database from 'better-sqlite3';
import { logger } from '../app.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

export function initializeDatabase() {
  logger.info('Initializing SQLite Database');

  const createItemsTable = `
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      source_type TEXT NOT NULL,
      source_url TEXT,
      raw_content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createChunksTable = `
    CREATE TABLE IF NOT EXISTS chunks (
      id TEXT PRIMARY KEY,
      item_id TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      content TEXT NOT NULL,
      embedding TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
    );
  `;

  db.exec(createItemsTable);
  db.exec(createChunksTable);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  logger.info('Database initialized successfully');
}

export default db;
