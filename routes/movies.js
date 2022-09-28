const movieRouter = require('express').Router();
const movie = require('../controllers/movies');
const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validation');

movieRouter.get('/movies', movie.getMovies);

movieRouter.post('/movies', createMovieValidator, movie.createMovie);

movieRouter.delete('/movies/:id', deleteMovieValidator, movie.deleteMovie);

module.exports = movieRouter;
