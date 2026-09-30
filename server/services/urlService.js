import * as cheerio from 'cheerio';
import { logger } from '../app.js';

export async function fetchAndExtractUrl(url) {
  try {
    // Basic SSRF protection - ensure it's http/https and not localhost
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported');
    }
    if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') {
      throw new Error('Localhost URLs are not allowed');
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AI-Knowledge-Inbox-Bot/1.0',
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, noscript, iframe, img, svg, nav, footer, header').remove();

    const title = $('title').text().trim() || url;
    
    // Extract readable text
    const content = $('body').text()
      .replace(/\s+/g, ' ') // replace multiple whitespace with single space
      .trim();

    if (!content) {
      throw new Error('No readable content found on the page');
    }

    return { title, content };
  } catch (error) {
    logger.error({ err: error, url }, 'URL extraction failed');
    throw error;
  }
}
