document.addEventListener("DOMContentLoaded", function () {
  const workoutList = document.getElementById("workoutList");

  // Static workout plan
  const workoutPlan = [
    "Warm-up: 5 minutes stretching",
    "Push-ups: 3 sets of 15 reps",
    "Squats: 3 sets of 20 reps",
    "Jogging/Brisk walk: 15 minutes",
    "Cool-down: Gentle stretching",
  ];

  // Render workout plan
  function renderPlan(plan) {
    workoutList.innerHTML = "";
    plan.forEach((exercise, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>${exercise}</span>
        <input type="checkbox" data-exercise-index="${index}" />
      `;
      workoutList.appendChild(li);
    });

    // Add checkbox change listeners
    workoutList.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      checkbox.addEventListener("change", onCheckboxChange);
    });
  }

  // Handle checkbox changes
  function onCheckboxChange() {
    const allChecked = Array.from(
      workoutList.querySelectorAll("input[type=checkbox]")
    ).every((chk) => chk.checked);

    saveProgress(allChecked ? 1 : 0);
  }

  // Save progress locally (can extend to API later)
  function saveProgress(completed) {
    console.log(`Progress saved: ${completed ? "Completed" : "Incomplete"}`);
    localStorage.setItem("workoutProgress", completed ? "1" : "0");
  }

  // Initialize
  renderPlan(workoutPlan);
});
