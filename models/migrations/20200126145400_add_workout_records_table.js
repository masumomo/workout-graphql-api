exports.up = function(knex, Promise) {
  // create the 'users' table with three columns
  return knex.schema.createTable("workout_records", (t) => {
    t.increments().index();

    t.integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users");

    t.integer("workout_id")
      .notNullable()
      .references("id")
      .inTable("workouts");

    t.date("date")
      .notNullable()
      .defaultTo(knex.fn.now(6));

    t.string("place", 30);

    t.timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("workout_records");
};
