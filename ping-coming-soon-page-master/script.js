const emailInput = document.querySelector('input[type="email"]');
const notifyBtn = document.querySelector('.notify-btn');
const errorEmptyMessage = document.querySelector('.error-empty');
const errorInvalidMessage = document.querySelector('.error-invalid');

window.addEventListener('DOMContentLoaded', () => {
  notifyBtn.addEventListener('click', () => {
    if (!emailInput.validity.valid) {
      errorEmptyMessage.classList.remove('display-none');      
    }
    if (emailInput.validity.typeMismatch) {
      errorInvalidMessage.classList.remove('display-none');      
    }
  });
});
