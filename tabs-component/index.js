/**
 * Accessible tabs component with keyboard navigation
 */
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');

  // Set up event listeners using delegation
  document
    .querySelector(".tab-buttons")
    .addEventListener("click", handleTabClick);
  document
    .querySelector(".tab-buttons")
    .addEventListener("keydown", handleTabKeydown);

  /**
   * Handles tab button clicks
   * @param {Event} event - The click event
   */
  function handleTabClick(event) {
    const button = event.target.closest('[role="tab"]');
    if (!button) return;

    activateTab(button);
  }

  /**
   * Handles keyboard navigation between tabs
   * @param {KeyboardEvent} event - The keydown event
   */
  function handleTabKeydown(event) {
    const button = event.target.closest('[role="tab"]');
    if (!button) return;

    // Convert NodeList to Array for easier indexing
    const buttons = [...tabButtons];
    const currentIndex = buttons.indexOf(button);

    // Handle arrow keys for navigation
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        // Move to next tab or wrap around
        activateTab(buttons[(currentIndex + 1) % buttons.length]);
        event.preventDefault();
        break;
      case "ArrowLeft":
      case "ArrowUp":
        // Move to previous tab or wrap to end
        activateTab(
          buttons[(currentIndex - 1 + buttons.length) % buttons.length]
        );
        event.preventDefault();
        break;
      case "Home":
        // Move to first tab
        activateTab(buttons[0]);
        event.preventDefault();
        break;
      case "End":
        // Move to last tab
        activateTab(buttons[buttons.length - 1]);
        event.preventDefault();
        break;
    }
  }

  /**
   * Activates a tab and shows its associated panel
   * @param {HTMLElement} tabButton - The tab button to activate
   */
  function activateTab(tabButton) {
    const tabId = tabButton.getAttribute("data-tab-button");

    // Update tab buttons
    tabButtons.forEach((btn) => {
      const isActive = btn === tabButton;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive);
    });

    // Update tab panels
    tabPanels.forEach((panel) => {
      const shouldShow = panel.getAttribute("data-tab-content") === tabId;
      panel.classList.toggle("show", shouldShow);
      panel.classList.toggle("hide", !shouldShow);
    });

    // Focus the activated tab
    tabButton.focus();

    // Focus the panel if needed
    if (tabButton.getAttribute("aria-selected") === "true") {
      const activePanel = document.getElementById(
        tabButton.getAttribute("aria-controls")
      );
      activePanel.focus();
    }
  }
});
