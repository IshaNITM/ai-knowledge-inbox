import crypto from 'crypto';
import db from '../database/db.js';
import { logger } from '../app.js';
import { generateEmbeddings } from '../services/embeddingService.js';
import { chunkText } from '../services/chunkingService.js';
import { fetchAndExtractUrl } from '../services/urlService.js';

export async function ingestItem(req, res) {
  try {
    const { type, title, content, url } = req.body;

    if (!['note', 'url'].includes(type)) {
      return res.status(400).json({ error: 'Invalid source type' });
    }

    let finalTitle = title;
    let finalContent = content;
    let finalUrl = url || null;

    if (type === 'note') {
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required for notes' });
      }
    } else if (type === 'url') {
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      try {
        const extracted = await fetchAndExtractUrl(url);
        finalTitle = extracted.title;
        finalContent = extracted.content;
      } catch (error) {
        return res.status(422).json({ error: 'Failed to extract content from URL', details: error.message });
      }
    }

    const itemId = crypto.randomUUID();
    const chunks = chunkText(finalContent);
    
    if (chunks.length === 0) {
      return res.status(422).json({ error: 'Content is too short or empty after processing' });
    }

    // Generate embeddings
    let embeddings = [];
    try {
      embeddings = await generateEmbeddings(chunks);
    } catch (error) {
      return res.status(502).json({ error: 'Failed to generate embeddings from AI service' });
    }

    // Begin Transaction
    const insertItem = db.prepare(`
      INSERT INTO items (id, title, source_type, source_url, raw_content)
      VALUES (?, ?, ?, ?, ?)
    `);

    const insertChunk = db.prepare(`
      INSERT INTO chunks (id, item_id, chunk_index, content, embedding)
      VALUES (?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertItem.run(itemId, finalTitle, type, finalUrl, finalContent);
      
      chunks.forEach((chunk, index) => {
        insertChunk.run(
          crypto.randomUUID(),
          itemId,
          index,
          chunk,
          JSON.stringify(embeddings[index])
        );
      });
    });

    transaction();

    logger.info({ itemId, type }, 'Successfully ingested item');

    res.status(201).json({
      message: 'Item ingested successfully',
      item: {
        id: itemId,
        title: finalTitle,
        source_type: type,
        source_url: finalUrl,
        chunks_count: chunks.length
      }
    });

  } catch (error) {
    logger.error({ err: error }, 'Ingestion error');
    res.status(500).json({ error: 'Internal server error during ingestion' });
  }
}
