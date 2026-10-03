document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reg-form');
  const inputPassword = document.getElementById('password');
  const btnToggleEye = document.getElementById('btn-toggle-eye');
  const chipLength = document.getElementById('chip-length');
  const chipLetter = document.getElementById('chip-letter');
  const chipNumber = document.getElementById('chip-number');
  const checkboxTerms = document.getElementById('terms');
  const btnSubmit = document.getElementById('btn-submit');
  const successCard = document.getElementById('success-card');
  const playerNameDisplay = document.getElementById('player-name-display');
  const inputUsername = document.getElementById('username');

  let isPasswordVisible = false;

  // Eye toggle
  btnToggleEye.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    inputPassword.type = isPasswordVisible ? 'text' : 'password';
    btnToggleEye.textContent = isPasswordVisible ? '🙈' : '👁️';
  });

  // Real-time password validation
  function validateForm() {
    const val = inputPassword.value;
    const isLenValid = val.length >= 8;
    const isLetterValid = /[a-zA-Z]/.test(val);
    const isNumValid = /[0-9]/.test(val);

    updateChip(chipLength, isLenValid);
    updateChip(chipLetter, isLetterValid);
    updateChip(chipNumber, isNumValid);

    const isAllValid = isLenValid && isLetterValid && isNumValid && checkboxTerms.checked && inputUsername.value.trim().length > 0;
    btnSubmit.disabled = !isAllValid;
  }

  function updateChip(chip, isValid) {
    if (isValid) {
      chip.classList.add('valid');
      chip.querySelector('.icon').textContent = '✓';
    } else {
      chip.classList.remove('valid');
      chip.querySelector('.icon').textContent = '・';
    }
  }

  inputPassword.addEventListener('input', validateForm);
  checkboxTerms.addEventListener('change', validateForm);
  inputUsername.addEventListener('input', validateForm);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    playerNameDisplay.textContent = inputUsername.value;
    form.style.display = 'none';
    successCard.style.display = 'block';
  });
});
