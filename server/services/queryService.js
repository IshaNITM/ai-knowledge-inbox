import { GoogleGenerativeAI } from '@google/generative-ai';
import db from '../database/db.js';
import { logger } from '../app.js';
import { generateEmbeddings } from './embeddingService.js';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';

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

export async function processQuery(question, topK = 5, minSimilarity = 0.5) {
  try {
    // 1. Generate embedding for the question
    const [questionEmbedding] = await generateEmbeddings([question]);
    
    // 2. Retrieve all chunks and embeddings
    const allChunks = db.prepare(`
      SELECT c.id, c.item_id, c.content, c.embedding, i.title, i.source_type
      FROM chunks c
      JOIN items i ON c.item_id = i.id
    `).all();

    // 3. Calculate similarity and sort
    const scoredChunks = allChunks.map(chunk => {
      const embedding = JSON.parse(chunk.embedding);
      const similarity = cosineSimilarity(questionEmbedding, embedding);
      return { ...chunk, similarity };
    });

    scoredChunks.sort((a, b) => b.similarity - a.similarity);

    // 4. Select top K
    const topChunks = scoredChunks
      .filter(c => c.similarity >= minSimilarity)
      .slice(0, topK);

    if (topChunks.length === 0) {
      return {
        answer: "I couldn't find any relevant information in your saved content to answer that question.",
        sources: []
      };
    }

    // 5. Construct Prompt
    const contextText = topChunks.map((chunk, index) => {
      return `--- Source [${index + 1}] ---\nTitle: ${chunk.title}\nContent: ${chunk.content}`;
    }).join('\n\n');

    const systemPrompt = `You are an AI assistant that answers questions based ONLY on the user's saved knowledge base context provided below.
If the answer cannot be found in the context, say "The saved content does not provide enough information to answer this question."
Do NOT invent information or draw on outside knowledge.
When you use a source, cite it using its source number [1], [2], etc.`;

    const userPrompt = `Context:\n${contextText}\n\nQuestion: ${question}`;

    // 6. Call Gemini Chat
    const ai = getGeminiClient();
    const chatModelName = process.env.GEMINI_CHAT_MODEL || 'gemini-3.5-flash';
    const model = ai.getGenerativeModel({ 
      model: chatModelName,
      systemInstruction: systemPrompt 
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0,
      }
    });

    const answer = result.response.text();

    // 7. Format Sources
    const sources = topChunks.map(chunk => ({
      itemId: chunk.item_id,
      title: chunk.title,
      sourceType: chunk.source_type,
      snippet: chunk.content, // sending the whole chunk for simplicity
      similarity: chunk.similarity
    }));

    return { answer, sources };

  } catch (error) {
    logger.error({ err: error, question }, 'Error processing query with Gemini');
    throw error;
  }
}
