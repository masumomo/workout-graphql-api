exports.up = function(knex, Promise) {
  return knex.schema.createTable("workouts_muscles", (t) => {
    t.integer("workout_id")
      .notNullable()
      .references("id")
      .inTable("workouts")
      .onDelete("cascade");

    t.integer("muscle_id")
      .notNullable()
      .references("id")
      .inTable("muscles")
      .onDelete("cascade");

    t.unique("workout_id"); //For now
    // t.unique(["workout_id", "muscle_id"]);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("workouts_muscles");
};
