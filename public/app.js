const result = document.body.querySelector("#result");
const getAllWorkout = document.body.querySelector("#get-all-workouts");
const getAllWorkoutByMuscle = document.body.querySelector(
  "#get-all-workouts-by-muscle"
);
const muscleList = document.body.querySelector("#muscle-list");

function init() {
  fetch("./graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: "{ Muscles { name } }" }),
  })
    .then((r) => r.json())
    .then((data) => {
      data.data.Muscles.map((option) => {
        const optionEle = document.createElement("option");
        optionEle.value = option.name;
        optionEle.innerHTML = option.name;
        muscleList.appendChild(optionEle);
      });
    });
}
function querySend(query) {
  console.log("query :", query);
  fetch("./graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((r) => r.json())
    .then((data) => {
      result.innerHTML = `<div class="alert alert-success" role="alert">
            <h4 class="alert-heading">Result</h4>
            <hr>
            <p>${JSON.stringify(data)}</p>
          </div>`;
      console.log("data returned:", data);
    });
}

getAllWorkout.addEventListener("click", () => {
  querySend("{ Workouts{ name type } }");
});

getAllWorkoutByMuscle.addEventListener("click", () => {
  const muscleName = muscleList.options[muscleList.selectedIndex].value;
  console.log("muscleName :", muscleName);
  querySend(`{ WorkoutsByMuscle(name:"${muscleName}"){ name type } } `);
});

init();
