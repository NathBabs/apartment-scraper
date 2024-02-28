// import fs
import fs from 'fs';
import logger from '../utils/logger';
import { Browser } from 'puppeteer';
import { URL } from './constants';

export const scraperObject = {
  url: URL,
  async scraper(browser: Browser, pageNumber: number) {
    let page = await browser.newPage();
    logger.info(`Page number: ${pageNumber}`);
    // if the page number is greater than 1, add a new query param to the url
    // e.g &Page=2
    this.url = pageNumber > 1 ? `${this.url}&Page=${pageNumber}` : this.url;
    logger.info(`Navigating to ${this.url}...`);

    await page.goto(this.url);
    // Wait for the required DOM to be rendered
    logger.info(`Waiting for the required DOM to be rendered...`);

    // wrap this in a try/catch block
    try {
      await page.waitForSelector('.search-contents.ml-0');
    } catch (error) {
      // If the selector is not found within the timeout, it might be a 404 page
      logger.info('Page Not Found');
      // Handle the "Not Found" scenario here
      throw new Error('Page Not Found');
    }

    // check for 404 page, if it exists, throw an error
    // with a div of class "_404-content"
    const notFoundElement = await page.$('div._404-content');
    if (notFoundElement) {
      throw new Error('Page Not Found');
    }

    // Fetch the list of houses using page.evaluate
    const housesResults = await page.$$eval('div.statement-card', houses => {
      return houses.map(houseElement => {
        // check if house is an instance of HTMLDivElement
        if (!(houseElement instanceof HTMLDivElement)) {
          return null;
        }

        if (houseElement?.attributes.length < 1) {
          return null;
        }
        const attributeMap = {};
        for (const attribute of houseElement?.attributes) {
          attributeMap[attribute.name] = attribute.value;
        }

        // get the text from the selected div house element
        const text = houseElement?.innerText;

        // split the text by new line character
        // and assign the separated values
        const parts = text.split('\n');
        const [
          title,
          price,
          dollarPerM2,
          totalArea,
          floors,
          rooms,
          bedrooms,
          address,
          date,
        ] = parts;

        // extract the number from the string of the floors, rooms and bedrooms
        const floorsNumber = floors?.match(/\d+/g)?.join('');
        const roomsNumber = rooms?.match(/\d+/g)?.join('');
        const bedroomsNumber = bedrooms?.match(/\d+/g)?.join('');

        return {
          id: attributeMap['data-product-id'] ?? null,
          thumb: attributeMap['data-thumb'] ?? null,
          title: title ?? null,
          price: price ? `${price}$` : null,
          dollarPerM2: dollarPerM2 ? `${dollarPerM2} $` : null,
          totalArea: totalArea ?? null,
          floors: floorsNumber ? `${floorsNumber} floor(s)` : null,
          rooms: roomsNumber ? `${roomsNumber} room(s)` : null,
          bedrooms: bedroomsNumber ? `${bedroomsNumber} bedroom(s)` : null,
          address: address ?? null,
          date: date ?? null,
        };
      });
    });

    // remove every object that doesn't have an id
    const housesResultsFiltered = housesResults.filter(house => house?.id);

    // 1. Create a folder called assets/ in the root of the project
    // check if the folder exists
    const assetsFolderExists = fs.existsSync('./assets');
    if (!assetsFolderExists) {
      // if it doesn't exist, create it
      fs.mkdirSync('./assets');
    }

    // 2. Create a separate folder for each list item, using the unique ID of the item as
    // the folder name, looping through housesResultsFiltered
    for (const house of housesResultsFiltered) {
      // check if the folder exists
      const folderExists = fs.existsSync(`./assets/${house.id}`);
      if (!folderExists) {
        // if it doesn't exist, create it
        fs.mkdirSync(`./assets/${house.id}`);
      }
      // 3. Save the rest of the data as a text file(.txt) in the same folder
      // create a text file
      fs.writeFileSync(
        `./assets/${house.id}/${house.id}.txt`,
        JSON.stringify(house, null, 2),
      );

      // 4. Download the thumbnail image of each item into the corresponding folder
      // check if the thumb property exists and it is not an empty string
      if (!house.thumb || house.thumb === '') {
        // skip the rest of the loop and continue with the next item
        continue;
      }
      await page.goto(house.thumb, { timeout: 60000 });
      await page.screenshot({
        path: `./assets/${house.id}/${house.id}.png`,
        fullPage: true,
      });
    }

    // calculate some analytics about the scraping process and the data
    const totalRooms = housesResultsFiltered.reduce((acc, house) => {
      const roomsNumber = house?.rooms?.match(/\d+/g)?.join('');
      return acc + Number(roomsNumber);
    }, 0);

    const totalBedrooms = housesResultsFiltered.reduce((acc, house) => {
      const bedroomsNumber = house?.bedrooms?.match(/\d+/g)?.join('');
      return acc + Number(bedroomsNumber);
    }, 0);

    const totalPrices = housesResultsFiltered.reduce((acc, house) => {
      const priceNumber = house?.price?.match(/\d+/g)?.join('');
      return acc + Number(priceNumber);
    }, 0);

    const analytics = {
      page: pageNumber ?? 1,
      housesScraped: housesResultsFiltered.length,
      totalRooms: `${totalRooms} room(s)`,
      totalBedrooms: `${totalBedrooms} bedroom(s)`,
      totalPrices: `${totalPrices}$`,
    };

    // close the browser
    await browser.close();

    return analytics;
  },
};
