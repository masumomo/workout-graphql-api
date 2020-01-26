const Muscle = function(dbMuscle) {
  this.id = dbMuscle.id;
  this.name = dbMuscle.name;
  this.bodyPart = dbMuscle.body_part;
};

Muscle.prototype.serialize = function() {
  return {
    id: this.id,
    name: this.name,
    body_part: this.bodyPart,
  };
};

module.exports = (knex) => {
  return {
    create: require("./create")(knex, Muscle),
    list: require("./list")(knex, Muscle),
    listByBodyPart: require("./listByBodyPart")(knex, Muscle),
    get: require("./get")(knex, Muscle),
  };
};
