'use strict';
const { filterDuration, filterGenres } = require('../filters/moviesFilter.js');

describe('moviesFilter', () => {
    let mockMovies = [];
    const DURATION_PARAMETER = '120';
    const GENRES_PARAMETER = '[Drama, Mystery]';
    beforeEach(() => {
        mockMovies = [
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
    });

    it('filterDuration returns movies with runtime between <duration - 10> and <duration + 10>', () => {
        const filteredMovies = filterDuration(mockMovies, DURATION_PARAMETER);
        expect(filteredMovies).toStrictEqual([
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

    it('filterGenres returns movies with at least 1 genre matching and sorted by amount of matching genres', () => {
        const filteredMovies = filterGenres(mockMovies, GENRES_PARAMETER);
        expect(filteredMovies).toStrictEqual([
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

    it('filterGenres allows for list without square brackets and spaces', () => {
        const mockGenreParameter = 'Drama,Mystery'
        const filteredMovies = filterGenres(mockMovies, mockGenreParameter);
        expect(filteredMovies).toStrictEqual([
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
});