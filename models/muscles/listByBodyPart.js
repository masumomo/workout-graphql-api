module.exports = (knex, Muscle) => {
  return (param) => {
    const bodyPartName = param;

    return knex("muscles")
      .where({ body_part: bodyPartName })
      .select()
      .then((muscles) => {
        return muscles.map((muscle) => new Muscle(muscle));
      });
  };
};
