const express = require('express');
const { getMovies, addMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getMovies);
router.post('/', protect, addMovie);
router.put('/:id', protect, updateMovie);
router.delete('/:id', protect, deleteMovie);

module.exports = router;
