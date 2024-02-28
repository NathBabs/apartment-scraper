import { Browser } from 'puppeteer';
import logger from '../utils/logger';
import { scraperObject as pageScraper } from './pageScraper';
export async function scrapeAll(browserInstance: Browser, pageNumber: number) {
  let browser;
  try {
    browser = await browserInstance;
    const results = await pageScraper.scraper(browser, pageNumber);

    return results;
  } catch (err) {
    logger.error('::: Something went wrong :::', [err]);
    const errorMessage = err.message
      ? err?.message
      : 'Could not resolve browser instance';
    throw new Error(errorMessage);
  }
}
