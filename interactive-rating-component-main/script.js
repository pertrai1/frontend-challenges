const submitBtn = document.querySelector('.btn-submit');
const ratingBtns = Array.from(document.querySelectorAll('[data-rating]'));
const starsContainer = document.querySelector('.stars-container');
const rateEl = document.querySelector('.rate');
const thankYouEl = document.querySelector('.thank-you');

document.addEventListener('DOMContentLoaded', () => {
  ratingBtns.forEach(btn => {
    btn.addEventListener('click', ({target}) => {
      ratingBtns.forEach(btn => {
        btn.classList.remove('selected')
      });
      btn.classList.add('selected');
      starsContainer.innerHTML = '';
      for (let i = 0; i < Number(target.dataset.rating); i++) {
        starsContainer.insertAdjacentHTML('beforeend', `  
          <div class="rating"><img src="images/icon-star.svg" alt="star icon" /></div>
        `);
      };
    });
  });

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    rateEl.style.display = 'none';
    thankYouEl.style.display = 'block';
  });
});
