const signUp = document.getElementById('sign-up');
const success = document.getElementById('success');
const aside = document.querySelector('aside');

const emailInput = document.getElementById('email');
const subscribeBtn = document.getElementById('btn-subscribe');
const dismissBtn = document.getElementById('btn-dismiss');

const errorMessage = document.getElementById('error-message');

emailInput.addEventListener('blur', () => {
  if (emailInput.validity.typeMismatch) {
    emailInput.classList.add('error');
    errorMessage.classList.remove('hidden');
  } else {
    emailInput.classList.remove('error');
    errorMessage.classList.add('hidden');
  }
});

subscribeBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (emailInput.validity.typeMismatch || emailInput.validity.valueMissing) {
    emailInput.classList.add('error');
    errorMessage.classList.remove('hidden');
  } else {
    signUp.classList.add('hidden');
    success.classList.remove('hidden');
    aside.classList.add('hidden');
  }
});

dismissBtn.addEventListener('click', () => {
  signUp.classList.remove('hidden');
  success.classList.add('hidden');
  aside.classList.remove('hidden');
});
