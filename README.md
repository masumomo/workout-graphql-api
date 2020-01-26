# Workout API by GraphQL

This was created during my time as a student at Code Chrysalis.

## About this api

This api is for people who train. It provides following futures.

- You can look for workout data
- You can filter workout data by muscle you want to train
- You can filter workout data by body part you want to train
- You can use web app and graphQL to use these data

## Get started

To install dependencies:

```bash
    yarn
```

To run migrations and set up the database:

```bash
    yarn migrate
```

To init data:

```bash
    yarn run knex seed:run  --knexfile models knexfile.js
```

To run the app and you can see here `localhost:3000`:

```bash
    yarn start
```

please enjoy!
