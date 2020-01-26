exports.up = function(knex, Promise) {
  return knex.schema.createTable("muscles", (t) => {
    t.increments().index();

    t.string("name", 30)
      .unique()
      .notNullable()
      .index();

    t.string("body_part", 30);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("muscles");
};
