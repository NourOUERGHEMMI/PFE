function validateExtraFields() {
  event.preventDefault();
  const requiredFields = document.querySelectorAll('#commonFields input[required], #commonFields select[required], #commonFields textarea[required]');
  let allFilled = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      allFilled = false;
      field.style.border = '1px solid red';
    } else {
      field.style.border = '';
    }
  });
  if (allFilled) {
    extraFields(1);
  }
}

function extraFields(click) {
  if (click === 1){
      document.getElementById('commonFields').style.display = 'none';
      document.getElementById('extraFields').style.display = 'block';
      document.getElementById('proceedButton').style.display = 'none';
      document.getElementById('submitButton').style.display = 'flex';
    }
}

function handleRoleSelection(role) {
  document.getElementById('roleSelection').style.display = 'none';
  document.getElementById('commonFields').style.display = 'block';

  if (role === 'employee') {
    document.getElementById('proceedButton').style.display = 'flex';
    extraFields();
  }
  else {
    document.getElementById('extraFields').style.display = 'none';
    document.getElementById('proceedButton').style.display = 'none';
    document.getElementById('submitButton').style.display = 'flex';
  }
}
