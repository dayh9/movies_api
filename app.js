'use strict';
const express = require('express');
const { validateMovie } = require('./validators/moviesValidator.js');
const { getMoviesMiddleware, postMoviesMiddleware } = require('./middlewares/moviesMiddleware.js')

const port = process.env.port || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send({
        status: 'OK'
    })
});

app.get('/movies',
    getMoviesMiddleware);

app.post('/movies',
    validateMovie,
    postMoviesMiddleware);

app.listen(port, err => {
    if (err) {
        return console.log("ERROR", err);
    }
    console.log(`listening on http://localhost:${port}`)
});
