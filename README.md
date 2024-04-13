# NestJS Movies & Genres API

## Description

NestJS TypeORM RestAPI Movies & Genres API

## API Specification
### Movie
 - POST /movies - creates a new movie, also creates genres which do not exist in the database if provided
 - GET /movies - finds movies by title and genre
 - GET /movies/paginate - paginates a list of movies, with dynamic sorting and title and genre filtering
 - GET /movies/:id - gets a movie by ID
 - PATCH /movies/:id - updates movie information by movie ID
 - POST /movies/:id/genres - inserts one or multiple genres into an existing movie by providing movie ID and genre names
 - DELETE /movies/:id/genres/:name - removes a genre from a movie by providing movie ID and genre name
 - DELETE /movies/:id - deletes a movie from the database by ID
### Genre
 - POST /genres - creates a new genre
 - GET /genres - gets all genres
 - GET /genres/:id - gets a genre by ID
 - PATCH /genres/:id - updates genre name by genre ID
 - DELETE /genres/:id - deletes a genre from the database by ID

## Accessing the Swagger API documentation
Complete Swagger API documentation can be accessed by navigating to ```/docs``` route of the environment 


## Setting up the environment

1. Create a PostgreSQL database with the naming of your choice on your machine or on a remote server

2. Create a ```.env``` file in the root directory of the project

3. Copy environment variables from existing ```.env.example``` file to the new ```.env``` file and update accordingly in order to setup the database connection and application port and environment

## Installation

Run ```npm install``` to install the application packages

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
