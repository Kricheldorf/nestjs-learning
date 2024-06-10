## Description

I've created this repository to learn more about [NestJS](https://github.com/nestjs/nest) and its features.
It's a very simple CRUD API to manage users.

Some observations:

* The project and User related files were created using the Nest CLI.

Things setup after scaffolding the project:

* I'm using a docker container to run the database (Postgres).
* I'm using TypeORM to manage the database (configured after scaffolding the project).
    * Although TypoORM provides the `syncronize` option (it's not recommended to use in a prod env), I'm not using it
      because I wanted to setup migrations.
* I'm using the `class-validator` package to validate the request body.

TODOs:

* Improve e2e tests
* Add more features to the API for practice

## DB setup

```bash
$ yarn run db:up
```

## Migrations

```bash
$ yarn run migration:run
```

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
