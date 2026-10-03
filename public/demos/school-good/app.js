document.addEventListener('DOMContentLoaded', () => {
  const formWrap = document.getElementById('form-wrap');
  const btnSubmit = document.getElementById('btn-submit');
  const submittedBanner = document.getElementById('submitted-banner');
  const timeDisplay = document.getElementById('submitted-time');

  btnSubmit.addEventListener('click', () => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    timeDisplay.textContent = timeStr;

    formWrap.style.display = 'none';
    submittedBanner.style.display = 'block';
  });
});
