document.getElementById('medicalForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const age = +document.getElementById('age').value;
  const weight = +document.getElementById('weight').value;
  const height = +document.getElementById('height').value;
  const gender = document.getElementById('gender').value;

  if (!age || !weight || !height || !gender) {
    alert('Please fill out all fields correctly.');
    return;
  }

  try {
    const response = await fetch('medical_details.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age, weight, height, gender })
    });

    const data = await response.json();

    if (data.success) {
      alert('Medical details saved. Redirecting to dashboard...');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.error || 'Failed to save data.');
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
});
