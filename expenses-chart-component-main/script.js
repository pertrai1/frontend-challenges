document.addEventListener('DOMContentLoaded', async () => {
  let response;
  try {
    response = await fetchData();
    const chartEl = document.querySelector('.chart');
    chartEl.insertAdjacentHTML('beforeend', `
      ${response.map((data, i) => `<div>
        <div id="tooltip-column-${i}" class="tooltip hidden">$${data.amount}</div>
        <div class="bar bar-${data.amount > 50 ? 'high' : 'low'}" style="height: ${Math.ceil(data.amount * 3)}px"></div>
        <span class="data-label">${data.day}</span>
      </div>`).join('')}
    `);
    const chartDivs = [...document.querySelectorAll('.chart > div')];
    chartDivs.forEach((div, i) => {
      div.addEventListener('mouseenter', e => {
        document.getElementById(`tooltip-column-${i}`).classList.remove('hidden');
      });
      div.addEventListener('mouseleave', e => {
        document.getElementById(`tooltip-column-${i}`).classList.add('hidden');
      });
    });
  } finally {
    console.log(response);
  }
});

async function fetchData() {
  const request = await fetch('data.json');
  return await request.json();
}
