const form = document.getElementById('credit-card-info');
const cardFront = document.querySelector('.img-front');
const confirmButton = document.getElementById('confirm-button');
const continueButton = document.getElementById('continue-button');
const success = document.getElementById('success');

form.addEventListener('input', e => {
  const {classList, name, validity, value} = e.target;
  const label = document.querySelector(`label[for=${name}]`);
  if (validity.valueMissing) {
    classList.toggle('error');
    label.insertAdjacentHTML('beforeend', "<span class='field-error'>Can't be blank</span>");
  }
  switch (name) {
    case 'cardholder':
      document.getElementById(`${name}-slot`).innerText = value || 'Jane Appleseed'
      break;
    case 'cardnumber':
      document.getElementById(`${name}-slot`).innerText = splitCardNumber(value) || '0000 0000 0000 0000'
      break;
    case 'expiration-month':
    case 'expiration-year':
      document.getElementById('cardyear-slot').innerText = splitCardYear(value)
      break;
    case 'cvc':
      document.getElementById(`${name}-slot`).innerText = value
      break;
  }
});

confirmButton.addEventListener('click', () => {
  form.style.display = 'none';
  success.style.display = 'block';
});

continueButton.addEventListener('click', () => {
  success.style.display = 'none';
  form.style.display = 'block';
});

function splitCardNumber(num) {
  return num.split('').map((v, i) => i % 4 === 0 ? ` ${v}` : v).join('');
}

function splitCardYear(text) {
  const monthInput = document.querySelector('input[name="expiration-month"]').value; 
  const yearInput = document.querySelector('input[name="expiration-year"]').value; 
  return monthInput || yearInput ? `${monthInput}/${yearInput}` : '00/00';
}
