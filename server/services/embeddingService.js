import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../app.js';

let genAI = null;

function getGeminiClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Generate embeddings for an array of texts using Google Gemini.
 * @param {string[]} texts
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
export async function generateEmbeddings(texts) {
  if (!texts || texts.length === 0) return [];
  
  try {
    const ai = getGeminiClient();
    const modelName = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-2';
    const model = ai.getGenerativeModel({ model: modelName });
    
    // Process texts in parallel
    const embeddingPromises = texts.map(async (text) => {
      const result = await model.embedContent(text);
      return result.embedding.values;
    });

    const embeddings = await Promise.all(embeddingPromises);
    return embeddings;
  } catch (error) {
    logger.error({ err: error }, 'Error generating embeddings with Gemini');
    throw new Error('Failed to generate embeddings');
  }
}
