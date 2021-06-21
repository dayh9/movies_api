'use strict';
const { validateMovie } = require('../validators/moviesValidator.js');
const dbFile = require('../repositories/dbFile.js');

const genresMock = [
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
];

jest.mock('../repositories/dbFile.js')

describe('moviesValidator', () => {
    let mockRequest;
    let mockResponse;
    let mockNext = jest.fn();

    beforeEach(() => {
        mockRequest = {
            body: {
                title: "The Big Short",
                year: 2015,
                runtime: 130,
                genres: [
                    "Biography",
                    "Comedy",
                    "Drama"
                ],
                director: "Adam McKay",
                actors: "Ryan Gosling, Rudy Eisenzopf, Casey Groves, Charlie Talbert",
                plot: "Four denizens in the world of high-finance predict the credit and housing bubble collapse of the mid-2000s, and decide to take on the big banks for their greed and lack of foresight.",
                posterUrl: "https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg"
            }
        };
        mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
            locals: {}
        };
        dbFile.getGenres.mockReturnValue(genresMock);
        jest.clearAllMocks();
    });

    it('runs next() when valid movie provided', () => {
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledTimes(0);
        expect(mockResponse.send).toHaveBeenCalledTimes(0);
    });

    it('runs next() when valid movie provided without optional fields', () => {
        delete mockRequest.body.actors;
        delete mockRequest.body.plot;
        delete mockRequest.body.posterUrl;
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledTimes(0);
        expect(mockResponse.send).toHaveBeenCalledTimes(0);
    });

    it('returns error when no movie provided', () => {
        mockRequest.body = {};
        const expectedResponse = { error: "Request body should contain movie." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when no genres provided', () => {
        delete mockRequest.body.genres;
        const expectedResponse = { error: "Request body should contain 'genres' that is type of array." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when empty genres provided', () => {
        mockRequest.body.genres = [];
        const expectedResponse = { error: "Request body should contain 'genres' that is type of array." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when genres provided is not an array', () => {
        mockRequest.body.genres = "genres";
        const expectedResponse = { error: "Request body should contain 'genres' that is type of array." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when could not get genres from db file', () => {
        dbFile.getGenres.mockImplementationOnce(() => null);
        const expectedResponse = { error: 'Unable to read data from the db file.' };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(dbFile.getGenres).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toBeCalledWith(500);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when not all genres are like predefined ones from db file', () => {
        mockRequest.body.genres = [
            "Biography",
            "Comedy",
            "NotAGenre"
        ];
        const expectedResponse = { error: "Only predefined 'genres' from db file are valid." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error genres contain duplicates', () => {
        mockRequest.body.genres = [
            "Biography",
            "Biography",
            "Comedy"
        ];
        const expectedResponse = { error: "'genres' should not contain duplicates." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when no title provided', () => {
        delete mockRequest.body.title;
        const expectedResponse = { error: "Request body should contain 'title' that is type of string with max 255 characters." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when title is not a string', () => {
        mockRequest.body.title = 123;
        const expectedResponse = { error: "Request body should contain 'title' that is type of string with max 255 characters." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when title over 255 characters provided', () => {
        mockRequest.body.title = [...Array(256)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        const expectedResponse = { error: "Request body should contain 'title' that is type of string with max 255 characters." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when no year provided', () => {
        delete mockRequest.body.year;
        const expectedResponse = { error: "Request body should contain 'year' that is type of number." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when year is not a number', () => {
        mockRequest.body.year = "year";
        const expectedResponse = { error: "Request body should contain 'year' that is type of number." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when no runtime provided', () => {
        delete mockRequest.body.runtime;
        const expectedResponse = { error: "Request body should contain 'runtime' that is type of number." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when runtime is not a number', () => {
        mockRequest.body.runtime = "runtime";
        const expectedResponse = { error: "Request body should contain 'runtime' that is type of number." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when no director provided', () => {
        delete mockRequest.body.director;
        const expectedResponse = { error: "Request body should contain 'director' that is type of string with max 255 characters." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when director is not a string', () => {
        mockRequest.body.director = 123;
        const expectedResponse = { error: "Request body should contain 'director' that is type of string with max 255 characters." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when director over 255 characters provided', () => {
        mockRequest.body.director = [...Array(256)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        const expectedResponse = { error: "Request body should contain 'director' that is type of string with max 255 characters." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when actors is not a string', () => {
        mockRequest.body.actors = 123;
        const expectedResponse = { error: "Request body may contain 'actors' that should be type of string." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when plot is not a string', () => {
        mockRequest.body.plot = 123;
        const expectedResponse = { error: "Request body may contain 'plot' that should be type of string." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });

    it('returns error when posterUrl is not a string', () => {
        mockRequest.body.posterUrl = 123;
        const expectedResponse = { error: "Request body may contain 'posterUrl' that should be type of string." };
        validateMovie(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toBeCalledWith(400);
        expect(mockResponse.send).toBeCalledWith(expectedResponse);
    });
});