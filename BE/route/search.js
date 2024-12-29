const express = require("express");
const omdbAPI = require("../controller/omdb-api");
const router = express.Router();

router.route("/").all(omdbAPI.searchMovies);
router.route("/:id").get(omdbAPI.getDetailMovie);

module.exports = router;
