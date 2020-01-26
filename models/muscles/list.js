module.exports = (knex, Muscle) => {
  return () => {
    return knex("muscles")
      .select()
      .then((muscles) => {
        return muscles.map((muscle) => new Muscle(muscle));
      });
  };
};
