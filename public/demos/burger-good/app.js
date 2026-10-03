let cartItems = [
  { id: 'burger', name: '特製てりやきビーフバーガー', price: 580, count: 1 }
];

function updateCartUI() {
  const totalCount = cartItems.reduce((acc, item) => acc + item.count, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.count), 0);

  document.getElementById('header-cart-count').textContent = `カート: ${totalCount}点`;
  document.getElementById('floating-cart-count').textContent = `合計 ${totalCount} 点`;
  document.getElementById('floating-cart-total').textContent = `¥${totalPrice.toLocaleString()}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.btn-add');
  const btnCheckout = document.getElementById('btn-checkout');
  const mainOrderView = document.getElementById('main-order-view');
  const orderCompleteCard = document.getElementById('order-complete-card');
  const floatingBar = document.getElementById('floating-order-bar');
  const btnOrderAgain = document.getElementById('btn-order-again');

  updateCartUI();

  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-id');
      const itemPrice = parseInt(btn.getAttribute('data-price'), 10);
      const itemName = btn.getAttribute('data-name');

      const existing = cartItems.find(i => i.id === itemId);
      if (existing) {
        existing.count++;
      } else {
        cartItems.push({ id: itemId, name: itemName, price: itemPrice, count: 1 });
      }

      // Visual feedback on button
      const originalText = btn.textContent;
      btn.textContent = '✓ 追加しました';
      btn.style.backgroundColor = '#1e7e34';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
      }, 700);

      updateCartUI();
    });
  });

  btnCheckout.addEventListener('click', () => {
    mainOrderView.style.display = 'none';
    floatingBar.style.display = 'none';
    orderCompleteCard.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btnOrderAgain.addEventListener('click', () => {
    cartItems = [];
    updateCartUI();
    mainOrderView.style.display = 'block';
    floatingBar.style.display = 'block';
    orderCompleteCard.style.display = 'none';
  });
});
