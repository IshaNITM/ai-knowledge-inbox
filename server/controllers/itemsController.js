import db from '../database/db.js';
import { logger } from '../app.js';

export function getItems(req, res) {
  try {
    const items = db.prepare(`
      SELECT id, title, source_type, created_at, substr(raw_content, 1, 150) as preview 
      FROM items 
      ORDER BY created_at DESC
    `).all();
    res.json(items);
  } catch (error) {
    logger.error({ err: error }, 'Error fetching items');
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function getItemById(req, res) {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    logger.error({ err: error, id: req.params.id }, 'Error fetching item');
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM items WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Chunks will be deleted automatically due to ON DELETE CASCADE
    logger.info({ id }, 'Item deleted');
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    logger.error({ err: error, id: req.params.id }, 'Error deleting item');
    res.status(500).json({ error: 'Internal server error' });
  }
}
