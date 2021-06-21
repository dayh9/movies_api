'use strict';
const { filterDuration, filterGenres } = require('../filters/moviesFilter.js');
const { getMovies, addMovie } = require('../repositories/dbFile.js');

function getMoviesMiddleware(req, res) {
    let movies = getMovies();
    const duration = parseInt(req.query.duration);
    let genres = req.query.genres;

    if (duration) {
        movies = filterDuration(movies, duration);
    }

    if (movies.length === 0) {
        return res.status(404).send({ error: 'No movie found for provided parameters.' });
    }

    if (genres) {
        movies = filterGenres(movies, genres);
        if (movies.length === 0) {
            return res.status(404).send({ error: 'No movie found for provided parameters.' });
        }
        return res.status(200).send(movies);
    }

    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    res.status(200).send(randomMovie);
}

function postMoviesMiddleware(req, res) {
    const genres = res.locals.genres;
    const movies = getMovies();
    if (!movies) {
        return res.status(500).send({ error: 'Unable to read data from the db file.' });
    }

    const lastMovieId = movies[movies.length - 1].id;
    const newMovieId = lastMovieId + 1;

    const newMovie = {
        id: newMovieId,
        title: req.body.title,
        year: req.body.year,
        runtime: req.body.runtime,
        genres: req.body.genres,
        director: req.body.director,
        actors: req.body.actors || '',
        plot: req.body.plot || '',
        posterUrl: req.body.posterUrl || ''
    };

    if (!addMovie(genres, movies, newMovie)) {
        return res.status(500).send({ error: 'Unable to write data to the db file.' });
    }

    res.status(201).send(newMovie);
}

module.exports = {
    getMoviesMiddleware,
    postMoviesMiddleware
}