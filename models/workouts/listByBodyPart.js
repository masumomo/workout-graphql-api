module.exports = (knex, Workout) => {
  return (param) => {
    const bodyPart = param;
    console.log("bodyPart :", bodyPart);
    return knex("workouts")
      .join("workouts_muscles", "workouts.id", "workouts_muscles.workout_id")
      .join("muscles", "muscles.id", "workouts_muscles.muscle_id ")
      .select(
        "workouts.id",
        "workouts.name",
        "workouts.type",
        "muscles.name as muscle_name"
      )
      .orderBy("workouts.id")
      .where({ "muscles.body_part": bodyPart })
      .then((workouts) => {
        return workouts.map((workout) => new Workout(workout));
      });
  };
};
