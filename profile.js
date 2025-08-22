function showProfileDisplay(data) {
  document.getElementById('dispWeight').textContent = data.weight || '';
  document.getElementById('dispHeight').textContent = data.height || '';
  document.getElementById('dispAge').textContent = data.age || '';
  document.getElementById('dispGender').textContent = (data.gender == 1) ? 'Male' : 'Female';
  document.getElementById('profileDisplay').style.display = '';
  document.getElementById('profileForm').style.display = 'none';
  document.getElementById('message').textContent = '';
}

function showProfileEdit(data) {
  document.getElementById('weight').value = data.weight || '';
  document.getElementById('height').value = data.height || '';
  document.getElementById('age').value = data.age || '';
  document.getElementById('gender').value = data.gender !== undefined ? data.gender : '';
  document.getElementById('profileDisplay').style.display = 'none';
  document.getElementById('profileForm').style.display = '';
  document.getElementById('message').textContent = '';
}

let latestData = {};

document.addEventListener('DOMContentLoaded', () => {
  fetch('dashboard.php')
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        latestData = data;
        document.getElementById('userName').textContent = data.name || '';
        showProfileDisplay(data);
      }
    });
});

document.getElementById('editBtn').addEventListener('click', () => {
  showProfileEdit(latestData);
});
document.getElementById('cancelBtn').addEventListener('click', () => {
  showProfileDisplay(latestData);
});

// Handle form submit
document.getElementById('profileForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const formData = {
    weight: parseFloat(form.weight.value),
    height: parseFloat(form.height.value),
    age: parseInt(form.age.value),
    gender: parseInt(form.gender.value)
  };

  fetch('update_fat.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(result => {
    const messageEl = document.getElementById('message');
    if(result.success){
      latestData = {...latestData, ...formData};
      showProfileDisplay(latestData);
      messageEl.textContent = 'Profile updated successfully!';
      messageEl.style.color = 'lightgreen';
    } else {
      messageEl.textContent = 'Failed to update profile.';
      messageEl.style.color = 'red';
    }
  })
  .catch(() => {
    const messageEl = document.getElementById('message');
    messageEl.textContent = 'Network or server error.';
    messageEl.style.color = 'red';
  });
});
