const diceBtn = document.querySelector('.dice-btn');
const adviceEl = document.querySelector('.advice');

document.addEventListener('DOMContentLoaded', async () => {
  await loadAdvice();
});

diceBtn.addEventListener('click', async () => {
  await loadAdvice();
});

async function loadAdvice() {
  adviceEl.innerHTML = '';

  const response = await fetch('https://api.adviceslip.com/advice');
  const data = await response.json();

  adviceEl.insertAdjacentHTML('afterbegin', `
    <h2>Advice #${data.slip.id}</h2>
    <h1>"${data.slip.advice}"</h1>
  `);
};

