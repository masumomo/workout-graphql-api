module.exports = (knex, Workout) => {
  return (param) => {
    const name = param;
    return knex("workouts")
      .join("workouts_muscles", "workouts.id", "workouts_muscles.workout_id")
      .join("muscles", "muscles.id", "workouts_muscles.muscle_id ")
      .select(
        "workouts.id",
        "workouts.name",
        "workouts.type",
        "muscles.name as muscle_name"
      )
      .where({ "workouts.name": name })
      .then((workouts) => {
        if (workouts.length) return new Workout(workouts.pop());
        throw new Error(`Error finding workout ${name}`);
      });
  };
};
