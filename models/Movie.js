const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: { type: String },
    myRating: { type: Number, min: 0, max: 10 }, // ⭐ User's rating
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    } // ✅ Link movie to a specific user
  },
  { timestamps: true } // createdAt = watched date
);

module.exports = mongoose.model("Movie", movieSchema);
