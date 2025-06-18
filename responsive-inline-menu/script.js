function updateMenu() {
  const menuList = document.getElementById("menuList");
  const moreMenu = document.getElementById("moreMenu");
  const moreDropdown = document.getElementById("moreDropdown");

  // Move any dropdown items back to main list
  [...moreDropdown.children].forEach((li) => {
    menuList.insertBefore(li, moreMenu);
  });

  const items = [...menuList.querySelectorAll("li")].filter(
    (li) => li !== moreMenu
  );

  // Make sure "More" is visible for measuring
  moreMenu.classList.remove("hidden");
  void menuList.offsetWidth; // Force layout reflow

  const availableWidth = menuList.offsetWidth;
  let totalWidth = moreMenu.offsetWidth;

  const overflow = [];

  for (const li of items) {
    totalWidth += li.offsetWidth;
    if (totalWidth > availableWidth) {
      overflow.push(li);
    }
  }

  if (overflow.length > 0) {
    overflow.forEach((li) => moreDropdown.appendChild(li));
    moreMenu.classList.remove("hidden");
  } else {
    moreMenu.classList.add("hidden");
    if (moreDropdown.matches(":popover-open")) {
      moreDropdown.hidePopover();
    }
  }
}

window.addEventListener("resize", updateMenu);
window.addEventListener("load", updateMenu);
