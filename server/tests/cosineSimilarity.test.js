import { test, expect } from 'vitest';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';

test('cosineSimilarity calculates identical vectors as 1', () => {
  const sim = cosineSimilarity([1, 0, 0], [1, 0, 0]);
  expect(sim).toBe(1);
});

test('cosineSimilarity calculates orthogonal vectors as 0', () => {
  const sim = cosineSimilarity([1, 0, 0], [0, 1, 0]);
  expect(sim).toBe(0);
});

test('cosineSimilarity calculates opposite vectors as -1', () => {
  const sim = cosineSimilarity([1, 0], [-1, 0]);
  expect(sim).toBe(-1);
});

test('cosineSimilarity throws on unequal lengths', () => {
  expect(() => cosineSimilarity([1], [1, 0])).toThrow('Vectors must have the same length');
});
