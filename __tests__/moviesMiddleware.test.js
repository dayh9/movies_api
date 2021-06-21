'use strict';
const { getMoviesMiddleware, postMoviesMiddleware } = require('../middlewares/moviesMiddleware.js')
const dbFile = require('../repositories/dbFile.js');

const mockMovies = [
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
];

const DURATION_PARAMETER = '120';
const GENRES_PARAMETER = '[Drama, Mystery]';

jest.mock('../repositories/dbFile.js');

describe('moviesMiddleware', () => {
    let mockRequest;
    let mockResponse;

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
            },
            query: {}
        };
        mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
            locals: {}
        };
        dbFile.getMovies.mockReturnValue(mockMovies);
        jest.clearAllMocks();
    });

    it('getMoviesMiddleware returns random movie when no query parameters provided', () => {
        dbFile.getMovies.mockReturnValueOnce([mockMovies[0]]);
        getMoviesMiddleware(mockRequest, mockResponse);
        expect(mockResponse.status).toBeCalledWith(200);
        expect(mockResponse.send).toBeCalledWith(mockMovies[0]);
    });

    it('getMoviesMiddleware returns random movie with runtime between <duration - 10> and <duration + 10> when only duration parameter provided', () => {
        mockRequest.query.duration = DURATION_PARAMETER;
        getMoviesMiddleware(mockRequest, mockResponse);
        expect(mockResponse.status).toBeCalledWith(200);
        expect(mockResponse.send).toBeCalledWith(mockMovies[1]);
    });

    it('getMoviesMiddleware does not return movie when no one movie meets runtime cryteria when only duration parameter provided', () => {
        mockRequest.query.duration = '10';
        getMoviesMiddleware(mockRequest, mockResponse);
        expect(mockResponse.status).toBeCalledWith(404);
        expect(mockResponse.send).toBeCalledWith({ error: 'No movie found for provided parameters.' });
    });

    it('getMoviesMiddleware returns movies with at least 1 genre matching and sorted by amount of matching genres', () => {
        mockRequest.query.genres = GENRES_PARAMETER;
        getMoviesMiddleware(mockRequest, mockResponse);
        expect(mockResponse.status).toBeCalledWith(200);
        expect(mockResponse.send).toBeCalledWith([
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
            }
        ]);
    });

    it('getMoviesMiddleware does not return movie when no one movie meets genres cryteria when only genres parameter provided', () => {
        mockRequest.query.genres = '[Crime]';
        getMoviesMiddleware(mockRequest, mockResponse);
        expect(mockResponse.status).toBeCalledWith(404);
        expect(mockResponse.send).toBeCalledWith({ error: 'No movie found for provided parameters.' });
    });

    it('postMoviesMiddleware returns error when could not read data from db file', () => {
        dbFile.getMovies.mockReturnValueOnce(null);
        postMoviesMiddleware(mockRequest, mockResponse);
        expect(mockResponse.status).toBeCalledWith(500);
        expect(mockResponse.send).toBeCalledWith({ error: 'Unable to read data from the db file.' });
    });

    it('postMoviesMiddleware returns error when could not write data to db file', () => {
        dbFile.addMovie.mockReturnValueOnce(false);
        postMoviesMiddleware(mockRequest, mockResponse);
        expect(mockResponse.status).toBeCalledWith(500);
        expect(mockResponse.send).toBeCalledWith({ error: 'Unable to write data to the db file.' });
    });

    it('postMoviesMiddleware returns error when could not write data to db file', () => {
        mockRequest.body.id = 4;
        dbFile.addMovie.mockReturnValueOnce(true);
        postMoviesMiddleware(mockRequest, mockResponse);
        expect(mockResponse.status).toBeCalledWith(201);
        expect(mockResponse.send).toBeCalledWith(mockRequest.body);
    });
});