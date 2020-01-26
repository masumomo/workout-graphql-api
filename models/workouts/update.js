module.exports = (knex, Workout) => {
  return (param) => {
    const newWorkout = param;
    const name = param.name;
    return knex("workouts")
      .where({ name })
      .update(newWorkout)
      .then(() =>
        knex("workouts")
          .join(
            "workouts_muscles",
            "workouts.id",
            "workouts_muscles.workout_id"
          )
          .join("muscles", "muscles.id", "workouts_muscles.muscle_id ")
          .select(
            "workouts.id",
            "workouts.name",
            "workouts.type",
            "muscles.name as muscle_name"
          )
          .where("workouts.name", name)
          .orderBy("workouts.id")
          .then((workouts) => {
            if (workouts.length) return new Workout(workouts.pop());
          })
      );
  };
};
// if (workouts.length) return new Workout(workouts.pop());
