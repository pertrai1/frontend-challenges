(() => {
  const slider = document.querySelector(".slider");
  const priceTitle = document.querySelector(".price-title");
  const amount = document.querySelector(".amount");
  const billingToggle = document.querySelector(".billing-checkbox");

  // Pricing tiers
  const tiers = [
    { pageviews: "10K", price: 8 },
    { pageviews: "50K", price: 12 },
    { pageviews: "100K", price: 16 },
    { pageviews: "500K", price: 24 },
    { pageviews: "1M+", price: 36 },
  ];

  // Helper function to safely get tier index
  const getTierIndex = (value) => Math.min(Math.floor(value / 20), tiers.length - 1);
  
  // Helper function to get tier object by value
  const getTierByValue = (value) => tiers[getTierIndex(value)];
  
  // Get colors from CSS custom properties
  const getColorFromCSS = (colorVar) => 
    getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
  
  const colors = {
    primaryLight: `hsl(${getColorFromCSS('--color-primary-light')})`,
    border: `hsl(${getColorFromCSS('--color-border')})`
  };
  
  // Helper function to create gradient background
  const createSliderGradient = (percentage) => 
    `linear-gradient(to right, 
      ${colors.primaryLight} 0%, 
      ${colors.primaryLight} ${percentage}%, 
      ${colors.border} ${percentage}%, 
      ${colors.border} 100%)`;

  // Combined update function for better organization
  const updateDisplay = (value) => {
    updateSliderValue(value);
    updatePrice(value);
    updateSliderFill(value);
  };

  // Initialize slider value and price
  updateDisplay(50);

  // Update price and pageviews based on slider position
  slider.addEventListener("input", ({ target: { value } }) => {
    updateDisplay(value);
  });

  // Update price when billing toggle changes
  billingToggle.addEventListener("change", () => {
    updatePrice(slider.value);
  });

  function updateSliderValue(value) {
    const tier = getTierByValue(value);
    priceTitle.textContent = `${tier.pageviews} PAGEVIEWS`;
  }

  function updatePrice(sliderValue) {
    const tier = getTierByValue(sliderValue);
    const price = billingToggle.checked ? tier.price * 0.75 : tier.price;
    amount.textContent = price.toFixed(2);
  }

  function updateSliderFill(value) {
    slider.style.background = createSliderGradient(value);
  }

  // Add smooth transitions to slider
  slider.addEventListener("mousedown", () => {
    slider.style.transition = "none";
  });

  slider.addEventListener("mouseup", () => {
    slider.style.transition = "background 0.2s";
  });
})();
