// Get all details elements
const detailsElements = document.querySelectorAll("details");

// Apply the initial state for any open details
detailsElements.forEach((details) => {
  const icon = details.querySelector(".accordion-icon");
  if (details.open) {
    icon.classList.add("accordion-icon--rotated");
  }
});

// Add event listeners to all details elements
detailsElements.forEach((details) => {
  details.addEventListener("toggle", function () {
    const icon = this.querySelector(".accordion-icon");
    if (this.open) {
      icon.classList.add("accordion-icon--rotated");
    } else {
      icon.classList.remove("accordion-icon--rotated");
    }
  });
});
