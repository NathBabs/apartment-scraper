import { scrapePage } from '../controllers/scrape.controller';
import express from 'express';
const router = express.Router();

router.route('/api/v1/scrape').get(scrapePage);

module.exports = router;
