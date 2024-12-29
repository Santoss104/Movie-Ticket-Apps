const express = require("express");
const tixScraper = require("../controller/tix-scraper");
const router = express.Router();

router.route("/").get(tixScraper.getMovies);
router.route("/:id").get(tixScraper.getDetailMovie);

module.exports = router;
