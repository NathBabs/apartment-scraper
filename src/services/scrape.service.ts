import { AppError, StatusCode } from '../exceptions/AppError';
import logger from '../utils/logger';
import { startBrowser } from './browser';
import { scrapeAll } from './pageController';

export async function scrape(page: number) {
  try {
    if (page < 1) {
      throw new AppError({
        statusCode: StatusCode.BAD_REQUEST,
        description: 'Page number must be greater than 0',
      });
    }

    // Start the browser and create a browser instance
    const browserInstance = await startBrowser();

    // Pass the browser instance to the scraper controller
    const data = await scrapeAll(browserInstance, page);

    return {
      statusCode: StatusCode.OK,
      data,
    };
  } catch (error) {
    logger.error(error);
    throw new AppError({
      statusCode: error?.statusCode || StatusCode.BAD_REQUEST,
      description: error?.message || 'Something went wrong with the transfer',
    });
  }
}
