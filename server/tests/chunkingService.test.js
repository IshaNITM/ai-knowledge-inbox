import { test, expect } from 'vitest';
import { chunkText } from '../services/chunkingService.js';

test('chunkText handles short text without splitting', () => {
  const chunks = chunkText('This is a short string', 2000, 200);
  expect(chunks.length).toBe(1);
  expect(chunks[0]).toBe('This is a short string');
});

test('chunkText splits long text based on character limit', () => {
  const longText = 'a'.repeat(3000);
  const chunks = chunkText(longText, 2000, 200);
  expect(chunks.length).toBe(2);
  expect(chunks[0].length).toBe(2000);
  expect(chunks[1].length).toBe(1200); // 3000 - 2000 + 200 (overlap)
});

test('chunkText handles empty or null input', () => {
  expect(chunkText('')).toEqual([]);
  expect(chunkText(null)).toEqual([]);
});
