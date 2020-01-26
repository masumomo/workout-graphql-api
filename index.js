const config = require("./config");
const { buildSchema } = require("graphql");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const services = require("./services")(config);
const knex = require("knex")(config.db);
const models = require("./models")(knex);
// const models = require("./models");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const Resolver = require("graphql-knex-resolver");
// const models = require("./models")(knex);

const resolver = Resolver.getResolver(knex);
app.use(morgan("dev"));

// 3. Parse request bodies as json
app.use(bodyParser.json({ type: "application/json", limit: "50mb" }));

// 4. If the requests begin with '/api', hand them off to the API router
const schema = buildSchema(`
  type User {
    username: String
  }
  
  type Muscle {
    name: String
    bodyPart: String
  }

  type Workout {
    name: String
    muscleName: String
    type: String
  }

  input MuscleInput {
    name: String!
    bodyPart: String!
  }

  input WorkoutInput {
    name: String!
    muscleName: String!
    type: String!
  }
  input WorkoutInputForUpdate {
    name: String!
    type: String
  }

  type Query {
    Users: [User]
    User(username: String!): User
    Muscles: [Muscle]
    Muscle(name: String!): Muscle
    Workouts: [Workout]
    Workout(name: String!): Workout
    WorkoutsByBodyPart(name: String!): [Workout]
    WorkoutsByMuscle(name: String!): [Workout]
  }

  type Mutation { 
     createUser(username: String!): User
     createMuscle(muscle: MuscleInput!): Muscle
     createWorkout(workout: WorkoutInput!): Workout
     updateWorkout(workout: WorkoutInputForUpdate!): Workout
     deleteWorkout(name: String!): [Workout]
  }
`);

// The root provides the resolver functions for each type of query or mutation.
const root = {
  Users: () => {
    return models.users.list().then((result) => result);
  },
  User: (request) => {
    return models.users.get(request.username).then((result) => result);
  },
  Muscles: () => {
    return models.muscles.list().then((result) => result);
  },
  Muscle: (request) => {
    return models.muscles.get(request.name).then((result) => result);
  },

  Workouts: () => {
    return models.workouts.list().then((result) => result);
  },
  Workout: (request) => {
    return models.workouts.get(request.name).then((result) => result);
  },
  WorkoutsByBodyPart: (request) => {
    return models.workouts
      .listByBodyPart(request.name)
      .then((result) => result);
  },
  WorkoutsByMuscle: (request) => {
    return models.workouts.listByMuscle(request.name).then((result) => result);
  },

  createUser: (request) => {
    const newUser = {
      username: request.username,
    };
    return models.users.create(newUser).then((result) => result);
  },

  createMuscle: (request) => {
    const newMuscle = request.muscle;
    return models.muscles.create(newMuscle).then((result) => result);
  },

  createWorkout: (request) => {
    const newWorkout = request.workout;
    return models.workouts.create(newWorkout).then((result) => result);
  },

  updateWorkout: (request) => {
    const newWorkout = request.workout;
    return models.workouts.update(newWorkout).then((result) => {
      console.log("result :", result);
      return result;
    });
  },

  deleteWorkout: (request) => {
    const name = request.name;
    return models.workouts.delete(name).then((result) => result);
  },
};
/**
 ********************************START SERVER********************************
 ****************************************************************************
 */
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
app.use(express.static(`${__dirname}/public`)); // otherwise load the client app

app.use((err, req, res, next) => {
  if (err.stack) {
    if (err.stack.match("node_modules/body-parser"))
      return res.status(400).send("Invalid JSON");
  }

  services.logger.log(err);
  return res.status(500).send("Internal Error.");
});
app.listen(config.express.port, () => {
  services.logger.log(`Server up and listening on port ${config.express.port}`);
});
