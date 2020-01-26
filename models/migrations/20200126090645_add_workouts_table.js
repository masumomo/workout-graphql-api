exports.up = function(knex, Promise) {
  return knex.schema.createTable("workouts", (t) => {
    t.increments().index();

    t.string("name", 30)
      .unique()
      .notNullable()
      .index();

    t.string("type", 30);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("workouts");
};
