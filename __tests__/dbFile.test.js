'use strict';
const { getMovies, addMovie, getGenres } = require('../repositories/dbFile.js');
const fs = require('fs');

const mockFileData = {
    genres: [
        "Comedy",
        "Fantasy",
        "Crime",
        "Drama",
        "Music",
        "Adventure",
        "History",
        "Thriller",
        "Animation",
        "Family",
        "Mystery",
        "Biography",
        "Action",
        "Film-Noir",
        "Romance",
        "Sci-Fi",
        "War",
        "Western",
        "Horror",
        "Musical",
        "Sport"
    ],
    movies: [
        {
            id: 1,
            runtime: "140",
            genres: [
                "Drama",
                "Mystery"
            ],
        },
        {
            id: 2,
            runtime: "120",
            genres: [
                "Drama",
                "Comedy"
            ],
        },
        {
            id: 3,
            runtime: "109",
            genres: [
                "Biography",
                "Comedy"
            ],
        }
    ]
};

jest.mock('fs');

describe('moviesFilter', () => {
    it('returns null if error when reading movies from db file', () => {
        fs.readFileSync.mockImplementation(() => { throw new Error });
        const movies = getMovies('test_path');
        expect(movies).toBe(null);
    });

    it('returns null if error when no movies in db file', () => {
        fs.readFileSync.mockImplementation(() => { return JSON.stringify({}) });
        const movies = getMovies('test_path');
        expect(movies).toStrictEqual(null);
    });

    it('returns movies from in db file', () => {
        fs.readFileSync.mockImplementation(() => { return JSON.stringify(mockFileData) });
        const movies = getMovies('test_path');
        expect(movies).toStrictEqual(mockFileData.movies);
    });

    it('returns null if error when reading genres from db file', () => {
        fs.readFileSync.mockImplementation(() => { throw new Error });
        const genres = getGenres('test_path');
        expect(genres).toBe(null);
    });

    it('returns null if error when no genres in db file', () => {
        fs.readFileSync.mockImplementation(() => { return JSON.stringify({}) });
        const genres = getGenres('test_path');
        expect(genres).toStrictEqual(null);
    });

    it('returns genres from in db file', () => {
        fs.readFileSync.mockImplementation(() => { return JSON.stringify(mockFileData) });
        const genres = getGenres('test_path');
        expect(genres).toStrictEqual(mockFileData.genres);
    });

    it('returns null if error when writing movie to db file', () => {
        const newMovie = {
            id: 4,
            runtime: "123",
            genres: [
                "Biography",
                "Comedy"
            ],
        };
        fs.writeFileSync.mockImplementation(() => { throw new Error });
        const writeMovie = addMovie(mockFileData.genres, mockFileData.movies, newMovie, 'test_path');
        expect(writeMovie).toBe(null);
    });

    it('returns added movie when writing movie to db file', () => {
        const newMovie = {
            id: 4,
            runtime: "123",
            genres: [
                "Biography",
                "Comedy"
            ],
        };
        fs.writeFileSync.mockReturnValue({});
        const writeMovie = addMovie(mockFileData.genres, mockFileData.movies, newMovie, 'test_path');
        expect(writeMovie).toBe(newMovie);
    });
});