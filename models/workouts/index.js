const Workout = function(dbWorkout) {
  this.id = dbWorkout.id;
  this.name = dbWorkout.name;
  this.muscleName = dbWorkout.muscle_name;
  this.type = dbWorkout.type;
};

Workout.prototype.serialize = function() {
  return {
    id: this.id,
    name: this.name,
    muscle_name: this.muscleName,
    type: this.type,
  };
};

module.exports = (knex) => {
  return {
    create: require("./create")(knex, Workout),
    update: require("./update")(knex, Workout),
    delete: require("./delete")(knex, Workout),
    list: require("./list")(knex, Workout),
    get: require("./get")(knex, Workout),
    listByBodyPart: require("./listByBodyPart")(knex, Workout),
    listByMuscle: require("./listByMuscle")(knex, Workout),
  };
};
