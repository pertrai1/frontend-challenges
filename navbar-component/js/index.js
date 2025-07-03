const mobileView = document.getElementById("mobile-view");
const btnOpen = document.querySelector(".btn-open");
const btnClose = document.querySelector(".btn-close");

function openMobileNavigation() {
  mobileView.style.display = "block";
  this.setAttribute("aria-expanded", true);

  btnOpen.style.display = "none";
}

function closeMobileNavigation() {
  mobileView.style.display = "none";
  this.setAttribute("aria-expanded", false);

  btnOpen.style.display = "block";
}

btnOpen.addEventListener("click", openMobileNavigation);
btnClose.addEventListener("click", closeMobileNavigation);
