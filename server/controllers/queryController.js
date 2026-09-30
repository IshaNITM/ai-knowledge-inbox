import { processQuery } from '../services/queryService.js';
import { logger } from '../app.js';

export async function askQuestion(req, res) {
  try {
    const { question, topK = 5 } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await processQuery(question, topK);
    res.json(result);
  } catch (error) {
    logger.error({ err: error }, 'Query error');
    res.status(500).json({ error: 'Internal server error while processing query' });
  }
}
