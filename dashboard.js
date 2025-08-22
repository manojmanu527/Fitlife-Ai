let latestUserData = {};

document.addEventListener("DOMContentLoaded", function() {
  fetch('dashboard.php')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        // Suppress error alert for prototype
        console.warn('User data load error:', data.error);
        return;
      }
      latestUserData = data;

      // Update Health Snapshot Card - only numbers, no units
      if (data.name) document.getElementById('userName').textContent = data.name;
      document.getElementById('weightVal').textContent = data.weight;
      document.getElementById('heightVal').textContent = data.height;
      document.getElementById('ageVal').textContent = data.age;

      // Calculate BMI if not provided
      let weight = parseFloat(data.weight);
      let height = parseFloat(data.height);
      let bmi = data.bmi;
      if ((!bmi || bmi === '--') && !isNaN(weight) && !isNaN(height) && weight > 0 && height > 0) {
        bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
      }
      document.getElementById('bmiVal').textContent = bmi;

      // Post BMI to backend to update DB
      if (bmi !== '--') {
        fetch('update_bmi.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bmi: bmi })
        })
        .then(resp => resp.json())
        .then(result => {
          if (result && !result.error && result.bmi) {
            document.getElementById('bmiVal').textContent = result.bmi;
            latestUserData.bmi = result.bmi;
          }
        })
        .catch(() => { /* ignore errors */ });
      }
    })
    .catch(() => {
      // Optional: suppress alert here too for prototype
      console.warn("Failed to load user data");
    });
});

function updateHealthModal(data) {
  if (!data) return;
  document.getElementById('modalUserName').textContent = data.name || '';
  document.getElementById('modalWeightVal').textContent = data.weight;
  document.getElementById('modalHeightVal').textContent = data.height;
  document.getElementById('modalBmiVal').textContent = data.bmi;
  document.getElementById('modalAgeVal').textContent = data.age;

  let bmi = parseFloat(data.bmi || 0);
  let pos = 0;
  if (bmi < 18.5) pos = (bmi / 40) * 100;
  else if (bmi < 25) pos = ((bmi - 18.5) / (25 - 18.5)) * 30 + 25;
  else if (bmi < 30) pos = ((bmi - 25) / (30 - 25)) * 20 + 55;
  else pos = Math.min((bmi / 40) * 100, 100);
  document.getElementById('bmiIndicator').style.left = `calc(${pos}%)`;

  let targetBMI = 22;
  let heightCm = parseFloat(data.height);
  let idealWeight = '--';
  if (!isNaN(heightCm) && heightCm > 0) {
    let heightM = heightCm / 100;
    idealWeight = (targetBMI * heightM * heightM).toFixed(1);
  }

  let suggestionText = '';
  if (!isNaN(bmi)) {
    if (bmi < 18.5)
      suggestionText = `Your BMI is low. Aim to reach <strong>${idealWeight} kg</strong> for a healthy BMI (around 22).`;
    else if (bmi <= 25)
      suggestionText = `Your BMI is healthy. Maintain your weight near <strong>${idealWeight} kg</strong>.`;
    else
      suggestionText = `Your BMI is high. Try to reduce your weight to <strong>${idealWeight} kg</strong> to reach a healthy BMI (around 22).`;
  }
  const adviceDiv = document.getElementById('modalBmiAdvice');
  adviceDiv.innerHTML = suggestionText;
  adviceDiv.style.display = suggestionText ? 'block' : 'none';
}

document.getElementById('viewBmiModalBtn').addEventListener('click', () => updateHealthModal(latestUserData));
