let cartCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.btn-tiny-add');
  const countDisplay = document.getElementById('cart-count');
  const btnCancelAll = document.getElementById('btn-cancel-all');
  const btnConfirm = document.getElementById('btn-confirm');
  const orderCompletedView = document.getElementById('order-completed-view');
  const mainOrderForm = document.getElementById('main-order-form');

  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      countDisplay.textContent = cartCount;
    });
  });

  btnCancelAll.addEventListener('click', () => {
    if (cartCount === 0) {
      alert('カートには何も入っていません。');
      return;
    }
    cartCount = 0;
    countDisplay.textContent = cartCount;
    alert('【警告】カート内の商品がすべて消去されました。');
  });

  btnConfirm.addEventListener('click', () => {
    if (cartCount === 0) {
      alert('カートに商品を入れてから注文確定を押してください。');
      return;
    }
    mainOrderForm.style.display = 'none';
    orderCompletedView.style.display = 'block';
  });
});
