class JobListingsApp {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log("Job Listings App initialized");

    // Add keyboard navigation support
    this.setupKeyboardNavigation();

    // Add analytics or other app-level features here
    this.setupAnalytics();

    // Setup error handling
    this.setupErrorHandling();
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for the entire app
    document.addEventListener("keydown", (e) => {
      // Escape key clears all filters
      if (e.key === "Escape") {
        const filterBar = document.querySelector("filter-bar");
        if (filterBar && filterBar.filters.length > 0) {
          filterBar.clearAllFilters();
          e.preventDefault();
        }
      }

      // Arrow key navigation between filter tags
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const focusedElement = document.activeElement;
        if (focusedElement.matches("filter-tag button, .filter-tag")) {
          this.navigateFilters(e.key === "ArrowRight" ? 1 : -1);
          e.preventDefault();
        }
      }
    });
  }

  navigateFilters(direction) {
    const filterButtons = Array.from(
      document.querySelectorAll("filter-tag button, .filter-tag")
    );
    const currentIndex = filterButtons.indexOf(document.activeElement);

    if (currentIndex !== -1) {
      let nextIndex = currentIndex + direction;
      if (nextIndex < 0) nextIndex = filterButtons.length - 1;
      if (nextIndex >= filterButtons.length) nextIndex = 0;

      filterButtons[nextIndex].focus();
    }
  }

  setupAnalytics() {
    // Track filter usage
    document.addEventListener("add-filter", (e) => {
      console.log("Filter added:", e.detail.label);
      // Add analytics tracking here if needed
    });

    document.addEventListener("remove-filter", (e) => {
      console.log("Filter removed:", e.detail.label);
      // Add analytics tracking here if needed
    });

    // Track job interactions
    document.addEventListener("click", (e) => {
      if (e.target.matches(".job-title")) {
        const jobCard = e.target.closest("job-card");
        const jobId = jobCard?.getAttribute("data-job-id");
        console.log("Job clicked:", jobId);
        // Add analytics tracking here if needed
      }
    });
  }

  setupErrorHandling() {
    // Global error handler for unhandled promises
    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled promise rejection:", e.reason);
      // Could show user-friendly error message here
    });

    // Global error handler for JavaScript errors
    window.addEventListener("error", (e) => {
      console.error("JavaScript error:", e.error);
      // Could show user-friendly error message here
    });
  }

  // Utility methods for other parts of the app
  static showNotification(message, type = "info") {
    // Simple notification system
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-green);
      color: white;
      padding: 1rem;
      border-radius: 4px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Initialize the app
const app = new JobListingsApp();

// Export for potential use in other modules
export default JobListingsApp;
