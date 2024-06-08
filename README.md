## Description

[Nest](https://github.com/nestjs/nest) repository for learning purposes.

## DB setup

```bash
$ docker compose -f ./config/docker-compose.yml --project-directory . --env-file config/.env up -d
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
