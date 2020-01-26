exports.seed = async (knex) => {
  // Deletes ALL existing entries
  const muscleIds = [];
  const workoutIds = [];
  const workoutsMuscles = [];
  await knex("workouts_muscles").del();
  await knex("workouts").del();
  await knex("muscles").del();

  await knex("muscles").insert([
    { name: "Trapezius", body_part: "Back" },
    { name: "Levator Scapulae", body_part: "Back" },
    { name: "Rhomboids", body_part: "Back" },
    { name: "Pectoralis Major", body_part: "Chest" },
    { name: "Pectoralis Minor", body_part: "Chest" },
    { name: "Serratus Anterior", body_part: "Chest" },
    { name: "Abs", body_part: "Stomach" },
    { name: "Soleus", body_part: "Lower leg" },
    { name: "Tibialis Posterior", body_part: "Lower leg" },
    { name: "Inner thigh", body_part: "Thigh" },
    { name: "Outer thigh", body_part: "Thigh" },
    { name: "Gluteus maximus", body_part: "Hip" },
    { name: "Gluteus medius", body_part: "Hip" },
    { name: "Gluteus minimus", body_part: "Hip" },
    { name: "Tensor fasciae latae", body_part: "Hip" },
  ]);
  await knex("muscles")
    .select("id")
    .then((results) => {
      results.map((x) => muscleIds.push(x.id));
    });
  await knex("workouts").insert([
    { name: "Hip Thrust", type: "Gym Free weights" },
    { name: "Donkey Kicks", type: "Home exercise" },
    { name: "Single leg hip-lift", type: "Home exercise" },
    { name: "Squad", type: "Home exercise" },
    { name: "Push up", type: "Home exercise" },
    { name: "Leg Press", type: "Gym Free weights" },
    { name: "Chest Press", type: "Gym machine" },
    { name: "Shoulder Press", type: "Gym machine" },
    { name: "Rear Delt", type: "Gym machine" },
    { name: "Pec Fly", type: "Gym machine" },
    { name: "Pulldown", type: "Gym machine" },
    { name: "Seated Row", type: "Gym machine" },
  ]);
  await knex("workouts")
    .select("id")
    .then((results) => {
      results.map((x) => workoutIds.push(x.id));
    });
  await workoutsMuscles.push(
    { workout_id: workoutIds[0], muscle_id: muscleIds[12] },
    { workout_id: workoutIds[1], muscle_id: muscleIds[12] },
    { workout_id: workoutIds[2], muscle_id: muscleIds[12] },
    { workout_id: workoutIds[3], muscle_id: muscleIds[3] },
    { workout_id: workoutIds[4], muscle_id: muscleIds[3] },
    { workout_id: workoutIds[5], muscle_id: muscleIds[3] },
    { workout_id: workoutIds[6], muscle_id: muscleIds[3] },
    { workout_id: workoutIds[7], muscle_id: muscleIds[3] },
    { workout_id: workoutIds[8], muscle_id: muscleIds[3] },
    { workout_id: workoutIds[9], muscle_id: muscleIds[3] },
    { workout_id: workoutIds[10], muscle_id: muscleIds[3] },
    { workout_id: workoutIds[11], muscle_id: muscleIds[3] }
  );
  // await workoutIds.map((x, i) =>
  //   workoutsMuscles.push({ workout_id: x, muscle_id: muscleIds[i] })
  // );
  await knex("workouts_muscles").insert(workoutsMuscles);
  await console.log(workoutsMuscles);
};
