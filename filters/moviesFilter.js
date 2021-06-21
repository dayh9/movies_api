'use strict';
function filterDuration(movies, duration) {
    const checkDuration = movie => movie.runtime >= duration - 10 && movie.runtime <= duration + 10;
    movies = movies.filter(checkDuration);
    return movies;
}

function filterGenres(movies, genres) {
    genres = genres.trim();
    const isParamTable = param => param[0] === '[' && param[param.length - 1] === ']';

    if (isParamTable(genres)) {
        genres = genres.slice(1, -1);
    }
    genres = genres.split(',');

    let specifiedGenresScores = [];

    for (let movie of movies) {
        const sumGenres = [...genres, ...movie.genres];
        const duplicatedGenresCount = sumGenres.length - new Set(sumGenres).size;
        specifiedGenresScores.push(duplicatedGenresCount);
    }

    const maxSpecifiedGenresScore = Math.max(...specifiedGenresScores);
    let filteredMovies = [];

    for (let genreScore = maxSpecifiedGenresScore; genreScore > 0; genreScore--) {
        for (let i = 0; i < specifiedGenresScores.length; i++) {
            if (specifiedGenresScores[i] === genreScore) {
                filteredMovies.push(movies[i]);
            }
        }
    }
    return filteredMovies;
}

module.exports = {
    filterDuration,
    filterGenres
}