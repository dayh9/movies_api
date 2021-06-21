# movies api

### To run api:
```sh
npm start
```

### To run unit tests:
```sh
npm run test:unit
```

### Endpoints:
Default port: 3000
### GET
`/`

`/movies`
#### Query Params
Key | Value | Example
--- | --- | ---
duration | number | 130
genres | array | [Action, Drama, Adventure]
### POST
`/movies`

Provide movie object in the request body.
