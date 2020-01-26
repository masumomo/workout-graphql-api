exports.up = function(knex, Promise) {
  // create the 'users' table with three columns
  return knex.schema.createTable("users", (t) => {
    t.increments().index();

    t.string("username", 15)
      .unique()
      .notNullable()
      .index();

    t.timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
