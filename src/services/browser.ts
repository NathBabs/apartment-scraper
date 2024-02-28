import puppeteer from 'puppeteer';
import logger from '../utils/logger';

export async function startBrowser() {
  let browser;
  try {
    logger.info('Opening the browser......');
    browser = await puppeteer.launch({
      headless: false,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    logger.error('Could not create a browser instance => : ', err);
  }
  return browser;
}
