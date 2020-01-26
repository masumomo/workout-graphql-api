const validateName = (uName) =>
  typeof uName === "string" && uName.replace(" ", "").length > 2;

module.exports = (knex, Workout) => {
  return (params) => {
    const name = params.name;
    const type = params.type;
    const muscleName = params.muscleName;
    let muscleId;
    if (!validateName(name)) {
      return Promise.reject(
        new Error("name must be provided, and be at least two characters")
      );
    }

    return knex("muscles") //Check if specified muscle exists
      .select("id")
      .where("name", muscleName)
      .then((result) => {
        //If muscle doesn't exist
        if (result.length === 0) {
          return Promise.reject(new Error("That muscle name doesn't exists"));
        }
        muscleId = result[0].id;
        return knex("workouts")
          .insert({ name, type })
          .then(() => {
            return knex("workouts")
              .where({ name, type })
              .select("id");
          })
          .then((workout) => {
            //Insert into join table
            return knex("workouts_muscles ").insert({
              workout_id: workout[0].id,
              muscle_id: muscleId,
            });
          })
          .then(() => {
            return (
              knex("workouts")
                .join(
                  "workouts_muscles",
                  "workouts.id",
                  "workouts_muscles.workout_id"
                )
                .join("muscles", "muscles.id", "workouts_muscles.muscle_id ")
                // .where({ name, type })
                .select(
                  "workouts.id",
                  "workouts.name",
                  "workouts.type",
                  "muscles.name as muscle_name"
                )
            );
          })
          .then((workouts) => {
            return new Workout(workouts.pop());
          })
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
      })
      .catch((err) => {
        // throw unknown errors
        return Promise.reject(err);
      });
  };
};
