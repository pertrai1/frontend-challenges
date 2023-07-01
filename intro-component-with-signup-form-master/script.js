const formInputs = Array.from(document.querySelectorAll('input'));
const submitBtn = document.querySelector('.submit-btn');

function toggleErrorMessages(input) {
  if (input.validity.valueMissing) {
    input.classList.add('invalid');
    document.querySelector(`.error-${input.name}`).classList.remove('display-none');
    document.querySelector(`.error-icon-${input.name}`).classList.remove('display-none');
  } else {
    input.classList.remove('invalid');
    document.querySelector(`.error-${input.name}`).classList.add('display-none');
    document.querySelector(`.error-icon-${input.name}`).classList.add('display-none');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      toggleErrorMessages(input);
    });
  });

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    formInputs.forEach(input => {
      toggleErrorMessages(input);
    });
  });
});

