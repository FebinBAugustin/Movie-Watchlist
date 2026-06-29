const Movie = require('../models/Movie');

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addMovie = async (req, res) => {
  const {
    title,
    genre,
    rating,
    watched,
    status,
    review,
    poster,
    year,
    imdbID,
    trailer,
  } = req.body;

  if (!title) {
    return res.status(400).json({
      message: 'Title is required',
    });
  }

  try {
    const movie = await Movie.create({
      title,
      genre,
      rating,
      watched: watched ?? status === 'Watched',
      status: status || 'Plan to Watch',
      review: review || '',
      poster: poster || 'N/A',
      year: year || '',
      imdbID: imdbID || '',
      trailer: trailer || '',
      user: req.user._id,
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const updateFields = {};

    if (
      typeof req.body.status === 'string' &&
      req.body.status.trim()
    ) {
      updateFields.status = req.body.status;
      updateFields.watched =
        req.body.status === 'Watched';
    }

    if (typeof req.body.rating === 'number') {
      updateFields.rating = req.body.rating;
    }

    if (typeof req.body.review === 'string') {
      updateFields.review = req.body.review;
    }

    if (typeof req.body.watched === 'boolean') {
      updateFields.watched = req.body.watched;
    }

    if (typeof req.body.trailer === 'string') {
      updateFields.trailer = req.body.trailer;
    }

    const movie = await Movie.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        $set: updateFields,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      });
    }

    if (
      movie.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    await movie.deleteOne();

    res.json({
      message: 'Movie removed',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

const getMovieStats = async (req, res) => {
  try {
    const movies = await Movie.find({ user: req.user._id });
    const watchedMovies = movies.filter(m => m.status === 'Watched' || m.watched);
    const ratedMovies = movies.filter(m => m.rating > 0);

    const moviesWatchedCount = watchedMovies.length;
    const avgRating = ratedMovies.length > 0
      ? (ratedMovies.reduce((sum, m) => sum + m.rating, 0) / ratedMovies.length).toFixed(1)
      : 0;

    res.json({
      moviesWatched: moviesWatchedCount,
      averageRating: Number(avgRating),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getMovieStats,
};
