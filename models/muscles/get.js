module.exports = (knex, Muscle) => {
  return (param) => {
    const name = param;

    return knex("muscles")
      .where({ name })
      .select()
      .then((muscles) => {
        if (muscles.length) return new Muscle(muscles.pop());

        throw new Error(`Error finding muscle ${name}`);
      });
  };
};
