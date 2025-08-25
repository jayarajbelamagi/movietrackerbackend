const Movie = require("../models/Movie");

// ➕ Add a new movie
exports.addMovie = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const { title, genre, myRating } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // ✅ Check if movie already exists for this user
    const existing = await Movie.findOne({ title, userId: req.session.userId });
    if (existing) {
      return res.status(400).json({ message: "Movie already added before!" });
    }

    const movie = new Movie({
      title,
      genre,
      myRating,
      userId: req.session.userId,
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    console.error("❌ Error adding movie:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📥 Get all movies for logged-in user
exports.getMovies = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const movies = await Movie.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error("❌ Error fetching movies:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📊 Stats (per month & per year)
exports.getStats = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const movies = await Movie.find({ userId: req.session.userId });

    const stats = {
      total: movies.length,
      perMonth: {},
      perYear: {},
    };

    movies.forEach((movie) => {
      const watchedDate = movie.createdAt; // createdAt acts as watched date
      const monthKey = watchedDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const yearKey = watchedDate.getFullYear();

      stats.perMonth[monthKey] = (stats.perMonth[monthKey] || 0) + 1;
      stats.perYear[yearKey] = (stats.perYear[yearKey] || 0) + 1;
    });

    res.json(stats);
  } catch (err) {
    console.error("❌ Error calculating stats:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
