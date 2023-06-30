const formInputs = Array.from(document.querySelectorAll('input'));
const submitBtn = document.querySelector('.submit-btn');

window.addEventListener('DOMContentLoaded', () => {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    formInputs.forEach(input => {
      console.log(input.name);
      if (input.validity.valueMissing) {
        input.classList.add('invalid');
        document.querySelector(`.error-${input.name}`).classList.remove('display-none');
        document.querySelector(`.error-icon-${input.name}`).classList.remove('display-none');
      }
    });
  });
});

