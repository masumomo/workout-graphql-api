const config = require("../config");
const knex = require("knex")(config.db);

const ignoreError = () => {
  // do nothing
};

const clearTable = (tableName) =>
  knex(tableName)
    .del()
    .catch(ignoreError);

const tables = ["workouts", "muscles", "users", "workouts_muscles"];

Promise.all(tables.map(clearTable)).then(process.exit);
