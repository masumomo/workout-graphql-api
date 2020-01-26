/* eslint-disable no-console */
const { expect, assert } = require("chai");
const config = require("../config");
const knex = require("knex")(config.db);
const models = require("../models")(knex);

const forcePromiseReject = () => {
  throw new Error("This promise should have failed, but did not.");
};

describe("All", () => {
  const testWorkout1 = { name: "testWorkout1", type: "gym" };
  const testWorkout2 = { name: "testWorkout2", type: "gym" };
  const testMuscle1 = { name: "testMuscle1", body_part: "all" };
  const testMuscle2 = { name: "testMuscle2", body_part: "all2" };
  describe("setup", () => {
    it("able to connect to database", () =>
      knex
        .raw("select 1+1 as result")
        .catch(() => assert.fail("unable to connect to db")));
    it("has run the initial migrations", () =>
      knex("users")
        .select()
        .catch(() => assert.fail("users table is not found.")));
  });
  xdescribe("#initial", () => {
    it("able to init database", () => {
      const testWorkoutIds = [];
      const testMuscleIds = [];
      const testWorkoutMuscleCombo = [];
      knex("workouts")
        .insert([testWorkout1, testWorkout2])
        .then(() => {
          return knex("workouts")
            .select()
            .then((result) => {
              result.forEach((x) => {
                testWorkoutIds.push(x.id);
              });
            });
        })
        .then(() => {
          knex("muscles")
            .insert([testMuscle1, testMuscle2])
            .then(() => {
              return knex("muscles")
                .select()
                .then((result) => {
                  result.forEach((x) => {
                    testMuscleIds.push(x.id);
                  });
                });
            })
            .then(() => {
              knex("workouts_muscles")
                .insert([
                  {
                    workout_id: testWorkoutIds[0],
                    muscle_id: testMuscleIds[0],
                  },
                  {
                    workout_id: testWorkoutIds[1],
                    muscle_id: testMuscleIds[1],
                  },
                ])
                .then(() => {
                  return knex("workouts_muscles")
                    .select()
                    .then((result) => {
                      result.forEach((x) => {
                        testWorkoutMuscleCombo.push({
                          workout_id: result.workout_id,
                          muscle_id: result.muscle_id,
                        });
                      });
                    });
                });
            });
        })
        .catch((e) => assert.fail(`Err${e}`));
    });
  });

  describe("Users", () => {
    describe("#create", () => {
      const params = { username: "" };
      before(() => {
        params.username = "Miki";
      });
      afterEach(() => knex("users").del());
      it("creates a channel", () =>
        models.users.create(params).then((user) => {
          expect(user).to.include({ username: params.username });
          expect(user.id).to.be.a("number");
        }));
      context("when a duplicate name is provided", () => {
        beforeEach(() => models.users.create(params));
        it("generates a sanitized error message", () =>
          models.users
            .create(params)
            .then(forcePromiseReject)
            .catch((err) =>
              expect(err.message).to.equal("That username already exists")
            ));
      });
    });
    describe("#list", () => {
      const userNames = ["Miki", "Asami"];
      const users = userNames.map((user) => ({ username: user }));
      before(() => Promise.all(users.map(models.users.create)));
      after(() => knex("users").del());
      it("lists all users", () =>
        models.users.list().then((resp) => {
          expect(userNames).to.include(resp[0].username);
          expect(userNames).to.include(resp[1].username);
        }));
      it("returns serializable objects", () =>
        models.users.list().then((resp) => {
          expect(resp[0].serialize).to.be.a("function");
          expect(resp[0].serialize().id).to.be.a("number");
          expect(resp[0].serialize().username).to.be.a("string");
        }));
    });

    describe("#get", () => {
      const userNames = ["Miki", "Asami"];
      const users = userNames.map((username) => ({ username }));
      before(() => Promise.all(users.map(models.users.create)));
      after(() => knex("users").del());
      it("Get one user", () =>
        models.users.get(userNames[0]).then((resp) => {
          expect(userNames[0]).to.be.equal(resp.username);
        }));
      it("returns err if the name exists", () =>
        models.users
          .get("someone")
          .then(forcePromiseReject)
          .catch((err) =>
            expect(err.message).to.equal("Error finding user someone")
          ));
    });
  });

  describe("Muscles", () => {
    describe("#create", () => {
      const params = { name: "testMuscle1", bodyPart: "all" };
      afterEach(() => knex("muscles").del());
      it("creates a muscles", () =>
        models.muscles.create(params).then((muscle) => {
          expect(muscle).to.include({ name: params.name });
          expect(muscle).to.include({ bodyPart: params.bodyPart });
          expect(muscle.id).to.be.a("number");
        }));
      context("when a duplicate name is provided", () => {
        beforeEach(() => models.muscles.create(params));
        it("generates a sanitized error message", () =>
          models.muscles
            .create(params)
            .then(forcePromiseReject)
            .catch((err) =>
              expect(err.message).to.equal("That name already exists")
            ));
      });
    });
    describe("#list", () => {
      const muscles = [
        { name: "testMuscle1", bodyPart: "all" },
        { name: "testMuscle2", bodyPart: "all" },
      ];
      before(() => Promise.all(muscles.map(models.muscles.create)));
      after(() => knex("muscles").del());
      it("lists all muscles", () =>
        models.muscles.list().then((resp) => {
          expect(muscles[0].name).to.include(resp[0].name);
          expect(muscles[1].name).to.include(resp[1].name);
          expect(muscles[0].bodyPart).to.include(resp[0].bodyPart);
          expect(muscles[1].bodyPart).to.include(resp[1].bodyPart);
        }));
    });

    describe("#listByBodyPart", () => {
      const muscles = [
        { name: "testMuscle1", bodyPart: "abs" },
        { name: "testMuscle2", bodyPart: "all" },
        { name: "testMuscle3", bodyPart: "all" },
      ];
      before(() => Promise.all(muscles.map(models.muscles.create)));
      after(() => knex("muscles").del());
      it("lists all muscles", () =>
        models.muscles.listByBodyPart("all").then((resp) => {
          expect(resp.length).to.be.equal(2);
          expect(muscles[1].name).to.include(resp[0].name);
          expect(muscles[2].name).to.include(resp[1].name);
          expect(muscles[1].bodyPart).to.include(resp[0].bodyPart);
          expect(muscles[2].bodyPart).to.include(resp[1].bodyPart);
        }));
    });

    describe("#get", () => {
      const muscles = [
        { name: "testMuscle1", bodyPart: "all" },
        { name: "testMuscle2", bodyPart: "all" },
      ];
      before(() => Promise.all(muscles.map(models.muscles.create)));
      after(() => knex("muscles").del());
      it("Get a muscle", () =>
        models.muscles.get(muscles[0].name).then((resp) => {
          expect(muscles[0].name).to.be.equal(resp.name);
          expect(muscles[0].bodyPart).to.be.equal(resp.bodyPart);
        }));
      it("returns err if it doesn't exist", () =>
        models.muscles
          .get("something")
          .then(forcePromiseReject)
          .catch((err) =>
            expect(err.message).to.equal("Error finding muscle something")
          ));
    });
  });

  describe.only("Workouts", () => {
    const testMuscle1 = { name: "testMuscle1", body_part: "all" };
    const testMuscle2 = { name: "testMuscle2", body_part: "abs" };
    const testMuscle3 = { name: "testMuscle3", body_part: "all" };

    const testMuscleIds = [];
    before(() => {
      knex("muscles")
        .insert([testMuscle1, testMuscle2, testMuscle3])
        .then(() => {
          return knex("muscles")
            .select()
            .then((result) => {
              result.forEach((x) => {
                testMuscleIds.push(x.id);
              });
            });
        });
    });

    after(() => {
      knex("workouts_muscles")
        .del()
        .then(() =>
          knex("workouts")
            .del()
            .then(() => {
              knex("muscles").del();
            })
        );
    });

    xdescribe("#create", () => {
      const params = {
        name: "testWorkout1",
        muscleName: testMuscle1.name,
        type: "gym",
      };

      after(() => {
        knex("workouts_muscles")
          .del()
          .then(() => knex("workouts").del());
      });
      it("creates a workouts", () => {
        models.workouts.create(params).then((workout) => {
          expect(workout).to.include({ name: params.name });
          expect(workout).to.include({ muscleName: params.muscleName });
          expect(workout).to.include({ type: params.type });
          expect(workout.id).to.be.a("number");
        });
      });

      it("when a invalid muscle name is provided", () => {
        const params = {
          name: "testWorkout1",
          muscleName: "something",
          type: "gym",
        };
        models.workouts
          .create(params)
          .then(forcePromiseReject)
          .catch((err) =>
            expect(err.message).to.equal("That muscle name doesn't exists")
          );
      });
    });
    xdescribe("#list", () => {
      const workouts = [
        { name: "testWorkout1", type: "all", muscleName: testMuscle1.name },
        { name: "testWorkout2", type: "all", muscleName: testMuscle2.name },
      ];
      before(() => Promise.all(workouts.map(models.workouts.create)));
      after(() =>
        knex("workouts_muscles")
          .del()
          .then(() => {
            knex("workouts").del();
          })
      );
      it("lists all workouts", () =>
        models.workouts.list().then((resp) => {
          expect(workouts[0].name).to.include(resp[0].name);
          expect(workouts[1].name).to.include(resp[1].name);
          expect(workouts[0].type).to.include(resp[0].type);
          expect(workouts[1].type).to.include(resp[1].type);
          expect(workouts[0].muscleName).to.include(resp[0].muscleName);
          expect(workouts[1].muscleName).to.include(resp[1].muscleName);
        }));
    });

    xdescribe("#listByMuscle", () => {
      const workouts = [
        { name: "testWorkout1", type: "Gym", muscleName: testMuscle1.name },
        { name: "testWorkout2", type: "Gym", muscleName: testMuscle1.name },
        { name: "testWorkout3", type: "Gym", muscleName: testMuscle2.name },
      ];
      before(() => Promise.all(workouts.map(models.workouts.create)));
      after(() =>
        knex("workouts_muscles")
          .del()
          .then(() => {
            knex("workouts").del();
          })
      );
      it("lists workouts by muscle", () =>
        models.workouts.listByMuscle(testMuscle1.name).then((resp) => {
          expect(resp.length).to.be.equal(2);
          expect(workouts[0].name).to.include(resp[0].name);
          expect(workouts[1].name).to.include(resp[1].name);
          expect(workouts[0].type).to.include(resp[0].type);
          expect(workouts[1].type).to.include(resp[1].type);
          expect(workouts[0].muscleName).to.include(resp[0].muscleName);
          expect(workouts[1].muscleName).to.include(resp[1].muscleName);
        }));
    });

    xdescribe("#listByBodyPart", () => {
      const workouts = [
        { name: "testWorkout1", type: "Gym", muscleName: testMuscle1.name },
        { name: "testWorkout2", type: "Gym", muscleName: testMuscle1.name },
        { name: "testWorkout3", type: "Gym", muscleName: testMuscle2.name },
      ];
      before(() => Promise.all(workouts.map(models.workouts.create)));
      after(() =>
        knex("workouts_muscles")
          .del()
          .then(() => {
            knex("workouts").del();
          })
      );
      it("lists workouts by muscle", () =>
        models.workouts.listByBodyPart(testMuscle2.body_part).then((resp) => {
          expect(resp.length).to.be.equal(1);
          expect(workouts[2].name).to.include(resp[0].name);
          expect(workouts[2].type).to.include(resp[0].type);
          expect(workouts[2].muscleName).to.include(resp[0].muscleName);
        }));
    });

    describe("#get", () => {
      const workouts = [
        { name: "testWorkout1", type: "Gym", muscleName: testMuscle1.name },
        { name: "testWorkout2", type: "Gym", muscleName: testMuscle1.name },
        { name: "testWorkout3", type: "Gym", muscleName: testMuscle2.name },
      ];
      before(() => Promise.all(workouts.map(models.workouts.create)));
      after(() =>
        knex("workouts_muscles")
          .del()
          .then(() => {
            knex("workouts").del();
          })
      );
      it("Get a workout", () =>
        models.workouts.get(workouts[1].name).then((resp) => {
          expect(workouts[1].name).to.be.equal(resp.name);
          expect(workouts[1].type).to.be.equal(resp.type);
          expect(workouts[1].muscleName).to.include(resp.muscleName);
        }));
      it("returns err if it doesn't exist", () =>
        models.workouts
          .get("something")
          .then(forcePromiseReject)
          .catch((err) =>
            expect(err.message).to.equal("Error finding workout something")
          ));
    });
  });
});
