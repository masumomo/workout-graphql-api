module.exports = function(knex) {
  return {
    users: require("./users")(knex),
    workouts: require("./workouts")(knex),
    muscles: require("./muscles")(knex),
  };
};
