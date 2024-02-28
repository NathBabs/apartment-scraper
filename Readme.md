# Web Scraping

### Project Summary
This project is a web scraping project that scrapes the [Myhome.ge](https://www.myhome.ge/en/s/Apartment-for-rent-Tbilisi?Keyword=%E1%83%97%E1%83%91%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1%E1%83%98&AdTypeID=3&PrTypeID=1&mapC=41.73188365%2C44.8368762993663&regions=687602533&districts=5469869&cities=1996871&GID=1996871&OwnerTypeID=1) results page, extracts relevant information about each apartment e.g id of listing, price, address, number of bedrooms, floors in building, area in square meters, thumbnail link e.t.c Downloads the thumbnail image and saves it along with the extracted information in text(.txt) file in a folder named after the id of the listing in the assets folder.

### Project Setup
Reequirements <br>
- Node.js > 14.0.0
- npm

 <br>
To start the project, run the following commands in the terminal.<br><br>

change directory

```bash
$ cd scraping
```
install dependencies

```bash
$ npm install
```

create a .env file for environment variables
```bash
$ touch .env
```

create the following variables in the .env file
```env
PORT=3000
```
next run the following to start the server
```bash
$ npm run start
```

### Route
The project has only one route, which you can pass in a query parameter called page, to specify which page to scrape. The default value is `1`. The route is as follows: <br>

```bash
/api/v1/scrape?page=5
```

### Response Format
The response is in JSON format and has the following structure: <br>
It returns a small summary of the scrapping process, which includes the page number, number of houses scraped, total number of rooms, total number of bedrooms and total price of all the houses scraped. <br>

Success Response
```bash
{
	"status": true,
	"data": {
		"page": 4,
		"housesScraped": 22,
		"totalRooms": "63 room(s)",
		"totalBedrooms": "40 bedroom(s)",
		"totalPrices": "20620$"
	}
}
```

Failure Response
```bash
{
    "success": false,
    "message": "Page not found"
}
```

### Folder Structure
The project has the following folder structure: <br>
```bash
.
├── Readme.md
├── assets
│   ├── 13871051
│   │   ├── 13871051.png
│   │   └── 13871051.txt
│   ├── 13871285
│   │   ├── 13871285.png
│   │   └── 13871285.txt
│   ├── 13913376
│   │   ├── 13913376.png
│   │   └── 13913376.txt
│   └── 14193530
│       ├── 14193530.png
│       └── 14193530.txt
├── babel.config.js
├── package-lock.json
├── package.json
├── src
│   ├── app.ts
│   ├── controllers
│   │   └── scrape.controller.ts
│   ├── exceptions
│   │   ├── AppError.ts
│   │   └── ErrorHandler.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── scrape.route.ts
│   ├── server.ts
│   ├── services
│   │   ├── browser.ts
│   │   ├── constants.ts
│   │   ├── index.ts
│   │   ├── pageController.ts
│   │   ├── pageScraper.ts
│   │   └── scrape.service.ts
│   └── utils
│       ├── logger.ts
│       └── safeAccess.ts
├── tsconfig.build.json
└── tsconfig.json
```