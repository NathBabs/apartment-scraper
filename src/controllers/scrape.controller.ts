import { NextFunction, Request, Response } from 'express';
import { scrape } from '../services/scrape.service';

export const scrapePage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pageToScrape = Number(req.query.page);

  scrape(pageToScrape)
    .then(dataObj => {
      res.status(dataObj.statusCode).send({
        status: true,
        data: dataObj.data,
      });
    })
    .catch(e => next(e));
};
