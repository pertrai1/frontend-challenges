class PricingComponent extends HTMLElement {
  constructor() {
    super();
    // Create Shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
    
    // Pricing tiers - could come from attributes later
    this.tiers = [
      { pageviews: "10K", price: 8 },
      { pageviews: "50K", price: 12 },
      { pageviews: "100K", price: 16 },
      { pageviews: "500K", price: 24 },
      { pageviews: "1M+", price: 36 },
    ];
  }

  // Define which attributes to observe for changes
  static get observedAttributes() {
    return ['currency', 'discount-percentage', 'initial-value'];
  }

  // Handle attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // Re-render when attributes change
      if (this.shadowRoot) {
        this.updateDisplay(this.getCurrentSliderValue());
      }
    }
  }

  // Getter methods for attributes
  get currency() {
    return this.getAttribute('currency') || '$';
  }

  get discountPercentage() {
    return parseInt(this.getAttribute('discount-percentage')) || 25;
  }

  get initialValue() {
    return parseInt(this.getAttribute('initial-value')) || 50;
  }

  // Called when element is added to DOM
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateDisplay(this.initialValue); // Initialize with attribute value
  }

  getCurrentSliderValue() {
    const slider = this.shadowRoot.querySelector('.slider');
    return slider ? parseInt(slider.value) : this.initialValue;
  }

  // Helper functions (same as before)
  getTierIndex = (value) => Math.min(Math.floor(value / 20), this.tiers.length - 1);
  getTierByValue = (value) => this.tiers[this.getTierIndex(value)];
  
  createSliderGradient = (percentage) => 
    `linear-gradient(to right, 
      hsl(var(--color-primary-light)) 0%, 
      hsl(var(--color-primary-light)) ${percentage}%, 
      hsl(var(--color-border)) ${percentage}%, 
      hsl(var(--color-border)) 100%)`;

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* CSS Custom Properties - inherited from parent */
        :host {
          display: block;
          font-family: "Manrope", sans-serif;
        }

        .pricing-card {
          background-color: hsl(var(--color-surface));
          border-radius: var(--radius-medium);
          padding: var(--space-m);
          box-shadow: 0 20px 25px -5px hsl(var(--color-secondary) / 0.1);
          container-type: inline-size;
        }

        .price-header {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-block-end: var(--space-m);
          text-align: center;
          gap: var(--space-s);
        }

        .price-title {
          color: hsl(var(--color-text-muted));
          font-size: var(--font-size-body);
          font-weight: 600;
        }

        .price-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .price-wrapper.mobile-only {
          justify-content: center;
          margin: var(--space-m) 0;
        }

        .desktop-only {
          display: none;
        }

        .price {
          display: flex;
          align-items: center;
        }

        .dollar-sign,
        .amount {
          color: hsl(var(--color-secondary));
          font-size: var(--font-size-price);
          font-weight: 800;
        }

        .period {
          color: hsl(var(--color-text-muted));
          font-size: var(--font-size-body);
          font-weight: 600;
        }

        .slider-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-block-end: 1.5rem;
        }

        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 2px;
          background: linear-gradient(to right,
              hsl(var(--color-primary-light)) 0%,
              hsl(var(--color-primary-light)) 50%,
              hsl(var(--color-border)) 50%,
              hsl(var(--color-border)) 100%);
          outline: none;
          cursor: pointer;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: hsl(var(--color-primary)) url('./images/icon-slider.svg') no-repeat center;
          background-size: 22px 13px;
          cursor: pointer;
          transition: background-color 0.2s;
          box-shadow: 0 15px 30px hsl(var(--shadow-color) / var(--shadow-alpha));
        }

        .slider::-webkit-slider-thumb:hover {
          background: hsl(var(--color-primary) / 0.8) url('./images/icon-slider.svg') no-repeat center;
          background-size: 22px 13px;
        }

        .price-display {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-block: 3rem 1.5rem;
          gap: var(--space-s);
          font-size: var(--font-size-small);
          color: hsl(var(--color-text-muted));
          font-weight: 600;
        }

        .yearly-billing,
        .billing-toggle {
          display: flex;
          align-items: center;
        }

        .billing-checkbox {
          display: none;
        }

        .billing-checkbox + label {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
          background: hsl(var(--color-border));
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .billing-checkbox:checked + label {
          background: hsl(var(--color-primary-light));
        }

        .billing-checkbox + label::before {
          content: "";
          position: absolute;
          left: 2px;
          top: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.2s;
        }

        .billing-checkbox:checked + label::before {
          transform: translateX(22px);
        }

        .discount-tag {
          background: hsl(var(--color-accent-bg));
          color: hsl(var(--color-accent));
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-large);
          font-size: var(--font-size-tiny);
          font-weight: 800;
          margin-left: var(--space-xs);
        }

        footer {
          border-top: 1px solid hsl(var(--color-border));
          padding-top: var(--space-m);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-m);
        }

        .features {
          margin-bottom: 0;
        }

        .features ul {
          list-style: none;
        }

        .features li {
          color: hsl(var(--color-text-muted));
          font-size: var(--font-size-body);
          font-weight: 600;
          margin-block-end: 0.75rem;
          position: relative;
          padding-left: 1.5rem;
        }

        .features li::before {
          content: url('./images/icon-check.svg');
          position: absolute;
          left: 0;
          top: 0;
          width: 10px;
          height: 10px;
        }

        .start-trial {
          width: 100%;
          padding: 0.75rem var(--space-l);
          background: hsl(var(--color-secondary));
          color: hsl(var(--color-pale-blue));
          border: none;
          border-radius: var(--radius-pill);
          font-size: var(--font-size-small);
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s;
        }

        .start-trial:hover {
          background: hsl(var(--color-secondary) / 0.9);
        }

        /* Responsive design with container queries */
        @container (min-width: 400px) {
          .price-header {
            flex-direction: row;
            justify-content: space-between;
            text-align: start;
            gap: 0;
          }

          .mobile-only {
            display: none;
          }

          .desktop-only {
            display: flex;
          }

          footer {
            flex-direction: row;
            justify-content: space-between;
            text-align: start;
            gap: 0;
          }

          .start-trial {
            width: auto;
          }
        }
      </style>

      <div class="pricing-card">
        <div class="price-header">
          <div class="price-title">100K PAGEVIEWS</div>
          <div class="price-wrapper desktop-only">
            <div class="price">
              <span class="dollar-sign">${this.currency}</span>
              <span class="amount">16</span>
            </div>
            <span class="period">/month</span>
          </div>
        </div>
        
        <div class="price-section">
          <div class="slider-container">
            <input type="range" min="0" max="100" value="${this.initialValue}" class="slider" />
          </div>

          <div class="price-wrapper mobile-only">
            <div class="price">
              <span class="dollar-sign">${this.currency}</span>
              <span class="amount">16</span>
            </div>
            <span class="period">/month</span>
          </div>

          <div class="price-display">
            <span>Monthly Billing</span>
            <div class="billing-toggle">
              <input type="checkbox" id="billing-toggle" class="billing-checkbox" />
              <label for="billing-toggle"></label>
            </div>
            <div class="yearly-billing">
              <span>Yearly Billing</span>
              <div class="discount-tag">${this.discountPercentage}% discount</div>
            </div>
          </div>
        </div>

        <footer>
          <div class="features">
            <ul>
              <li>Unlimited websites</li>
              <li>100% data ownership</li>
              <li>Email reports</li>
            </ul>
          </div>
          <button class="start-trial">Start my trial</button>
        </footer>
      </div>
    `;
  }

  setupEventListeners() {
    const slider = this.shadowRoot.querySelector('.slider');
    const billingToggle = this.shadowRoot.querySelector('.billing-checkbox');
    
    // Update display on slider change
    slider.addEventListener('input', ({ target: { value } }) => {
      this.updateDisplay(value);
    });

    // Update price on billing toggle
    billingToggle.addEventListener('change', () => {
      this.updatePrice(slider.value);
    });

    // Smooth transitions
    slider.addEventListener('mousedown', () => {
      slider.style.transition = 'none';
    });

    slider.addEventListener('mouseup', () => {
      slider.style.transition = 'background 0.2s';
    });
  }

  updateDisplay(value) {
    this.updateSliderValue(value);
    this.updatePrice(value);
    this.updateSliderFill(value);
  }

  updateSliderValue(value) {
    const tier = this.getTierByValue(value);
    const titles = this.shadowRoot.querySelectorAll('.price-title');
    titles.forEach(title => {
      title.textContent = `${tier.pageviews} PAGEVIEWS`;
    });
  }

  updatePrice(sliderValue) {
    const tier = this.getTierByValue(sliderValue);
    const billingToggle = this.shadowRoot.querySelector('.billing-checkbox');
    const discountMultiplier = (100 - this.discountPercentage) / 100;
    const price = billingToggle.checked ? tier.price * discountMultiplier : tier.price;
    
    const amounts = this.shadowRoot.querySelectorAll('.amount');
    amounts.forEach(amount => {
      amount.textContent = price.toFixed(2);
    });
  }

  updateSliderFill(value) {
    const slider = this.shadowRoot.querySelector('.slider');
    slider.style.background = this.createSliderGradient(value);
  }
}

// Register the custom element
customElements.define('pricing-component', PricingComponent);