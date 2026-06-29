const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: 'Unknown',
    },
    rating: {
      type: Number,
      default: 0,
    },
    watched: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'Plan to Watch',
    },
    review: {
      type: String,
      default: '',
    },
    poster: {
      type: String,
      default: 'N/A',
    },
    year: {
      type: String,
      default: '',
    },
    imdbID: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
