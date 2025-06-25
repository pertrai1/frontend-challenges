(() => {
  // Constants
  const RESET_DELAY = 300;

  // DOM elements
  const lightEls = [...document.querySelectorAll(".light")];
  const activeEls = document.querySelector("#active-lights");

  // State
  let activeLights = [];
  let isResetting = false;
  let resetTimeouts = [];

  // Helper functions
  const updateDisplay = () => {
    activeEls.textContent = activeLights.join(", ");
  };

  const clearAllTimeouts = () => {
    resetTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    resetTimeouts = [];
  };

  const resetLights = () => {
    if (isResetting) return;

    isResetting = true;
    clearAllTimeouts();

    // Reset lights in reverse order of activation
    activeLights.forEach((lightIndex, i) => {
      const timeoutId = setTimeout(() => {
        lightEls[lightIndex].classList.remove("activated");

        // Update display to show remaining lights
        const remainingLights = activeLights.slice(
          0,
          activeLights.length - 1 - i
        );
        activeEls.textContent = remainingLights.join(", ");

        // If this is the last light, reset everything
        if (i === activeLights.length - 1) {
          activeLights = [];
          isResetting = false;
          resetTimeouts = [];
        }
      }, RESET_DELAY * (i + 1));

      resetTimeouts.push(timeoutId);
    });
  };

  const handleLightClick = (target, index) => {
    // Prevent clicks during reset
    if (isResetting) return;

    // Only activate if not already activated
    if (!target.classList.contains("activated")) {
      activeLights.push(index);
      target.classList.add("activated");
      updateDisplay();

      // Check if all lights are activated
      if (activeLights.length === lightEls.length) {
        resetLights();
      }
    }
  };

  // Add event listeners
  lightEls.forEach((light, index) => {
    light.addEventListener("click", ({ target }) => {
      handleLightClick(target, index);
    });

    // Add keyboard support
    light.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleLightClick(event.target, index);
      }
    });

    // Make lights focusable
    light.setAttribute("tabindex", "0");
    light.setAttribute("role", "button");
    light.setAttribute("aria-label", `Light ${index + 1}`);
  });

  // Initialize display
  updateDisplay();
})();
