/**
 * Splits text into chunks based on character count with overlap.
 * This is a simple approximation for token-based chunking.
 * @param {string} text - The input text to chunk
 * @param {number} chunkSize - Target character size (e.g. 2000 chars ~ 500 tokens)
 * @param {number} overlap - Overlap in characters (e.g. 200)
 * @returns {string[]} Array of text chunks
 */
export function chunkText(text, chunkSize = 2000, overlap = 200) {
  if (!text || typeof text !== 'string') return [];
  
  const textStr = text.trim();
  if (textStr.length <= chunkSize) {
    return [textStr];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < textStr.length) {
    let endIndex = startIndex + chunkSize;

    // If we're not at the end of the text, try to find a natural break point (newline or space)
    if (endIndex < textStr.length) {
      // Look back for a newline
      let breakIndex = textStr.lastIndexOf('\n', endIndex);
      
      // If no newline found in a reasonable distance, look for a period
      if (breakIndex < startIndex + (chunkSize / 2)) {
        breakIndex = textStr.lastIndexOf('. ', endIndex);
      }
      
      // If no period found, look for a space
      if (breakIndex < startIndex + (chunkSize / 2)) {
        breakIndex = textStr.lastIndexOf(' ', endIndex);
      }

      // If we found a valid break point, use it
      if (breakIndex > startIndex) {
        endIndex = breakIndex + 1; // Include the break character
      }
    }

    const chunk = textStr.slice(startIndex, endIndex).trim();
    if (chunk) {
      chunks.push(chunk);
    }

    startIndex = endIndex - overlap;
    
    // Safety check to prevent infinite loop
    if (startIndex >= endIndex) {
      startIndex = endIndex;
    }
  }

  return chunks;
}
