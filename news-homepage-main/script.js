const mobileNavIcon = document.querySelector('.mobile-menu-icon');
const menuList = document.querySelector('.menu-list');

mobileNavIcon.addEventListener('click', () => {
  if (menuList.classList.contains('visible')) {
    mobileNavIcon.src = "./assets/images/icon-menu.svg";
  } else {
    mobileNavIcon.src = "./assets/images/icon-menu-close.svg";
  }
  menuList.classList.toggle('visible');
});
