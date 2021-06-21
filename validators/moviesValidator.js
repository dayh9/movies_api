'use strict';
const { getGenres } = require('../repositories/dbFile.js');

function validateMovie(req, res, next) {
    const movie = req.body;

    if (!isMovieValid(movie)) {
        return res.status(400).send({ error: "Request body should contain movie." });
    }

    // a list of genres (only predefined ones from db file) (required, array of predefined strings)
    if (!areGenresValid(movie.genres)) {
        return res.status(400).send({ error: "Request body should contain 'genres' that is type of array." });
    }
    const allowedGenres = getGenres();
    if (!allowedGenres) {
        return res.status(500).send({ error: 'Unable to read data from the db file.' });
    }
    res.locals.genres = allowedGenres;
    if (!areGenresFromList(movie.genres, allowedGenres)) {
        return res.status(400).send({ error: "Only predefined 'genres' from db file are valid." });
    }
    if (!areGenresUnique(movie.genres)) {
        return res.status(400).send({ error: "'genres' should not contain duplicates." });
    }

    // title (required, string, max 255 characters)
    if (!isRequiredString(movie.title)) {
        return res.status(400).send({ error: "Request body should contain 'title' that is type of string with max 255 characters." });
    }

    // year (required, number)
    if (!isRequiredNumber(movie.year)) {
        return res.status(400).send({ error: "Request body should contain 'year' that is type of number." });
    }

    // runtime (required, number)
    if (!isRequiredNumber(movie.runtime)) {
        return res.status(400).send({ error: "Request body should contain 'runtime' that is type of number." });
    }

    // director (required, string, max 255 characters)
    if (!isRequiredString(movie.director)) {
        return res.status(400).send({ error: "Request body should contain 'director' that is type of string with max 255 characters." });
    }

    // actors (optional, string)
    if (!isOptionalString(movie.actors)) {
        return res.status(400).send({ error: "Request body may contain 'actors' that should be type of string." });
    }

    // plot (optional, string)
    if (!isOptionalString(movie.plot)) {
        return res.status(400).send({ error: "Request body may contain 'plot' that should be type of string." });
    }

    // posterUrl (optional, string)
    if (!isOptionalString(movie.posterUrl)) {
        return res.status(400).send({ error: "Request body may contain 'posterUrl' that should be type of string." });
    }

    next();
}

function isMovieValid(movie) {
    if (movie && movie.constructor === Object
        && Object.keys(movie).length !== 0) {
        return true;
    }
    return false;
}

function areGenresValid(genres) {
    if (genres && Array.isArray(genres) && genres.length !== 0) {
        return true;
    }
    return false;
}

function areGenresFromList(genres, allowedGenres) {
    if (!genres.every(genre => allowedGenres.includes(genre))) {
        return false;
    }
    return true;
}

function areGenresUnique(genres) {
    if (new Set(genres).size !== genres.length) {
        return false;
    }
    return true;
}

function isRequiredNumber(field) {
    if (field && typeof (field) === 'number') {
        return true;
    }
    return false;
}

function isRequiredString(field) {
    if (field && typeof (field) === 'string' && field.length <= 255) {
        return true;
    }
    return false;
}

function isOptionalString(field) {
    if (!field) {
        return true;
    }
    if (typeof (field) === 'string') {
        return true;
    }
    return false;
}

module.exports = {
    validateMovie
}