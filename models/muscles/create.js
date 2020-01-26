const validateName = (uName) =>
  typeof uName === "string" && uName.replace(" ", "").length > 2;

module.exports = (knex, Muscle) => {
  return (params) => {
    const name = params.name;
    const bodyPart = params.bodyPart;
    if (!validateName(name)) {
      return Promise.reject(
        new Error("name must be provided, and be at least two characters")
      );
    }

    return knex("muscles")
      .insert({ name, body_part: bodyPart })
      .then(() => {
        return knex("muscles")
          .where({ name, body_part: bodyPart })
          .select();
      })
      .then((muscles) => new Muscle(muscles.pop()))
      .catch((err) => {
        // sanitize known errors
        if (
          err.message.match("duplicate key value") ||
          err.message.match("UNIQUE constraint failed")
        )
          return Promise.reject(new Error("That name already exists"));

        // throw unknown errors
        return Promise.reject(err);
      });
  };
};
