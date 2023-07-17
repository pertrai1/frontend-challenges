const form = document.querySelector('form');

const billInput = document.getElementById('bill');
const numPeopleInput = document.getElementById('num-people');

const tipAmount = document.getElementById('tip-amount');
const totalAmount = document.getElementById('total-amount');

const tipBtns = Array.from(document.querySelectorAll('[data-tip]'));

// start with a default of 1 person
let totalPeople = 1;
let totalAmountPerPerson = 0;

// capture user input into bill input after blur
billInput.addEventListener('blur', (e) => {
  // update the total amount
  totalAmountPerPerson = +e.target.value;
  let tipAmountPerPerson = ((totalPeople / 100) * totalAmountPerPerson) / totalPeople
  totalAmount.textContent = ((totalAmountPerPerson / totalPeople) + tipAmountPerPerson).toFixed(2);
  // listen for tip button changes
  handleBtnClicks();
  // update the tip amount
  tipAmount.textContent = tipAmountPerPerson;
});
// capture user input into total people
numPeopleInput.addEventListener('blur', (e) => {
  // update the total amount
  totalPeople = +e.target.value;
  if (totalPeople === 0) {
    document.getElementById('people-error').style.display = 'block';
    numPeopleInput.classList.add('error');
    return;
  } else {
    document.getElementById('people-error').style.display = 'none';
    numPeopleInput.classList.remove('error');
  }
  let tipAmountPerPerson = ((totalPeople / 100) * totalAmountPerPerson) / totalPeople
  totalAmount.textContent = ((totalAmountPerPerson / totalPeople) + tipAmountPerPerson).toFixed(2);
  // listen for tip button changes
  handleBtnClicks();
  // update the tip amount
  tipAmount.textContent = tipAmountPerPerson;
});
// capture button clicked for the tip percentage
tipBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // update the total amount
    // update the tip amount
  });
});

function handleBtnClicks() {
  tipBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      tipPerPerson = ((Number(e.target.dataset.tip) / 100) * stringToNum(totalAmountPerPerson)) / stringToNum(totalPeople);
    });
  });
}

function stringToNum(str) {
  return Number(str);
}
