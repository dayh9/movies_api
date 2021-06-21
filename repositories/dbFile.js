'use strict';
const fs = require('fs');

const dataPath = './data/db.json'

function getMovies(path = dataPath) {
    try {
        const fileData = fs.readFileSync(path, 'utf8');
        const movies = JSON.parse(fileData).movies;
        if (!movies) {
            throw Error('no movies in the db file')
        }
        return movies;
    }
    catch (err) {
        console.log('read file error', err);
    }
    return null;
}

function addMovie(genres, movies, newMovie, path = dataPath) {
    movies.push(newMovie);
    const updatedDBFile = { genres, movies };

    try {
        fs.writeFileSync(path, JSON.stringify(updatedDBFile, null, 4), 'utf8');
        return newMovie;
    }
    catch (err) {
        console.log('write file error', err);
    }
    return null;
}

function getGenres(path = dataPath) {
    try {
        const fileData = fs.readFileSync(path, 'utf8');
        const genres = JSON.parse(fileData).genres;
        if (!genres) {
            throw Error('no genres in the db file');
        }
        return genres;
    } catch (err) {
        console.log('read file error', err);
    }
    return null;
}

module.exports = {
    getMovies,
    addMovie,
    getGenres
}