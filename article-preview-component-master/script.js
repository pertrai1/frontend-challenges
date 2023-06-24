console.log('hi');
const shareBtn = document.querySelector('.btn-share');
const shareEl = document.querySelector('.share-options');

window.addEventListener('DOMContentLoaded', () => {
  shareBtn.addEventListener('click', () => {
    shareBtn.classList.toggle('active');
    shareEl.classList.toggle('show-sharing');
  });
});
