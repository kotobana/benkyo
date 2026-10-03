document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reg-form');
  const errorBanner = document.getElementById('error-banner');
  const backLink = document.getElementById('back-link');
  const inputUsername = document.getElementById('username');
  const inputPassword = document.getElementById('password');
  const checkboxTerms = document.getElementById('terms');
  const successBox = document.getElementById('success-box');

  // クソUI: 戻るリンクを押すと入力内容が全消去される
  backLink.addEventListener('click', () => {
    inputUsername.value = '';
    inputPassword.value = '';
    checkboxTerms.checked = false;
    errorBanner.style.display = 'none';
    alert('【警告】画面遷移が発生したため、入力データが初期化されました。');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const pass = inputPassword.value;

    // クソUI: 厳しい条件が事前に書いておらず、送信時に初めて怒られる
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*]/.test(pass);
    const isLongEnough = pass.length >= 10;

    if (!hasUpper || !hasLower || !hasNum || !hasSpecial || !isLongEnough) {
      errorBanner.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!checkboxTerms.checked) {
      alert('利用規約に同意チェックを入れてください。');
      return;
    }

    form.style.display = 'none';
    errorBanner.style.display = 'none';
    successBox.style.display = 'block';
  });
});
