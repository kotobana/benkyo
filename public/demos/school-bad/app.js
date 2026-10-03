let clickCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  const btnSubmit = document.getElementById('btn-dead-submit');
  const secretCounter = document.getElementById('click-counter-secret');

  btnSubmit.addEventListener('click', () => {
    clickCount++;
    // あえて画面遷移やアラートを出さない（完全無反応クソUI）
    if (clickCount >= 3) {
      secretCounter.style.display = 'block';
      secretCounter.textContent = `※ 送信ボタンが現在 ${clickCount} 回押されました。（画面に「送信完了」などの反応が出ないため、届いているか不安で何度も押してしまいます）`;
    }
  });
});
