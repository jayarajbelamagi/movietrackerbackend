const express = require("express");
const { addMovie, getMovies, getStats } = require("../controllers/movieController");
const router = express.Router();

router.post("/add", addMovie);
router.get("/", getMovies);
router.get("/stats", getStats);

module.exports = router;
