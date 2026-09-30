# AI Knowledge Inbox

A production-style full-stack application that allows users to save plain-text notes and extract URLs into a local Knowledge Base. Users can then ask questions about their saved content using an AI-powered Retrieval-Augmented Generation (RAG) pipeline.

## Features

- **Note Ingestion:** Save plain-text notes.
- **URL Extraction:** Fetch web pages and automatically extract readable text while removing clutter (nav, scripts, ads).
- **Knowledge Base:** View, search, and delete saved items.
- **Ask AI (RAG Pipeline):** Ask natural language questions. The AI retrieves semantically relevant chunks from your saved items to generate a precise answer with source citations.
- **Local Vector Search:** Uses a local, lightweight JavaScript implementation of cosine similarity search over SQLite.

## Technology Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Lucide React
- **HTTP Client:** Axios
- **Architecture:** Reusable functional components with Hooks.

### Backend
- **Framework:** Node.js + Express.js
- **Database:** SQLite (`better-sqlite3`)
- **AI Integration:** Google Gemini API (Chat and Embeddings)
- **Utilities:** Cheerio (URL parsing), Pino (structured logging), Vitest (testing)

## Architecture Overview

1. **Ingestion:** When a note or URL is ingested, the content is split into smaller chunks.
2. **Embeddings:** Each chunk is sent to the Google Gemini Embeddings API (`text-embedding-004`) to generate a vector representation.
3. **Storage:** Both the raw item and its chunks + embeddings are stored locally in SQLite.
4. **Retrieval (RAG):** When a user asks a question, the question is embedded. The backend calculates the cosine similarity between the question vector and all stored chunk vectors in memory. The top K most similar chunks are injected as context into the prompt for the Google Gemini Chat API.

### Chunking Strategy and Rationale
A simple character-based chunking strategy is used. It attempts to split text at natural boundaries (newlines, periods, spaces) near a target character limit (default 2000 chars, ~500 tokens), with an overlap (default 200 chars) to preserve context between chunks. 
**Tradeoffs:** This avoids the need for a complex tokenizer dependency like `tiktoken` in Node.js, keeping the application lightweight. However, character counts are only an approximation of token limits.

### Vector Storage Choice and Tradeoffs
For this minimal assignment, embeddings are serialized to JSON and stored directly in SQLite, and similarity is computed in memory via JavaScript.
**Tradeoffs:** This is extremely lightweight and requires no external vector DB infrastructure (like Pinecone or Milvus). However, as the number of documents grows to the tens of thousands, full table scans and in-memory JS vector math will become a severe performance bottleneck. 

## Database Schema (SQLite)

- **items:** `id` (PK), `title`, `source_type`, `source_url`, `raw_content`, `created_at`
- **chunks:** `id` (PK), `item_id` (FK), `chunk_index`, `content`, `embedding` (JSON string), `created_at`

## API Documentation

- `POST /api/ingest`: Body `{ type: 'note' | 'url', title?, content?, url? }`
- `GET /api/items`: Returns all items (with preview).
- `GET /api/items/:id`: Returns full item details.
- `DELETE /api/items/:id`: Deletes an item and its associated chunks.
- `POST /api/query`: Body `{ question: string, topK?: number }`. Returns `{ answer, sources }`.

## Installation and Setup

### 1. Prerequisites
- Node.js (v18+)
- OpenAI API Key

### 2. Install Dependencies
In the root directory, there are two separate packages:
```bash
# Terminal 1: Backend
cd server
npm install

# Terminal 2: Frontend
cd client
npm install
```

### 3. Environment Variables
In the `server` directory, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `server/.env` and replace `your_openai_api_key` with your actual OpenAI key.

### 4. Run the Application
```bash
# Terminal 1: Backend (runs on port 5000)
cd server
npm run dev

# Terminal 2: Frontend (runs on port 5173)
cd client
npm run dev
```

### 5. Running Tests
The backend includes basic unit tests for chunking and cosine similarity logic:
```bash
cd server
npm test
```

## Known Limitations & Production Improvements

1. **In-Memory Vector Search:** As mentioned, this will scale poorly. In production, we would use an extension like `sqlite-vss`, `pgvector`, or a dedicated vector database (Pinecone).
2. **URL Fetching:** Some websites block automated scrapers. A production app might need a headless browser (Puppeteer) or a proxy service to bypass bot protection reliably.
3. **Authentication:** There is no user authentication. A production app would need user accounts and multi-tenant data isolation (where users only query their own chunks).
4. **Background Jobs:** Ingestion currently blocks the API response while embeddings are generated. In production, we'd use a message queue (BullMQ/Redis) and background workers to process ingestion asynchronously.
