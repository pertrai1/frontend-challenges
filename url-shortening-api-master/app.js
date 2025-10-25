(function () {
  "use strict";

  const APP_CONFIG = {
    // Using Clean URI API with CORS proxy for development
    // In production, you'd use your own backend or serverless function
    API_URL: "https://corsproxy.io/?https://cleanuri.com/api/v1/shorten",

    // Alternative CORS proxy options:
    // API_URL: "https://cors-anywhere.herokuapp.com/https://cleanuri.com/api/v1/shorten",
    // API_URL: "https://api.allorigins.win/raw?url=https://cleanuri.com/api/v1/shorten",

    STORAGE_KEY: "shortly_urls",
    MAX_STORED_URLS: 10,
    API_TIMEOUT: 10000,
  };

  let appState = {
    shortenedUrls: [],
    isLoading: false,
    currentError: null,
  };

  const elements = {
    form: document.getElementById("shorten-form"),
    input: document.getElementById("url-input"),
    submitButton: document.querySelector(".shorten__submit"),
    errorDisplay: document.getElementById("url-error"),
    resultsContainer: document.getElementById("shorten-results"),
    navToggle: document.querySelector(".nav__toggle"),
    navMenu: document.querySelector(".nav__menu"),
  };

  /**
   * Modern URL validation using built-in URL constructor
   * More robust than regex patterns
   */
  function isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
      return false;
    }
  }

  /**
   * Debounce function for performance optimization
   * Prevents excessive API calls while user is typing
   */
  function debounce(func, wait) {
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

  /**
   * Generate unique ID for URL entries
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Sanitize HTML to prevent XSS attacks
   */
  function sanitizeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Announce to screen readers for accessibility
   */
  function announceToScreenReader(message, priority = "polite") {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Load URLs from local storage
   */
  function loadStoredUrls() {
    try {
      const stored = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Error loading stored URLs:", error);
      return [];
    }
  }

  /**
   * Save URLs to local storage with size limit
   */
  function saveUrlsToStorage(urls) {
    try {
      // Keep only the most recent URLs
      const urlsToStore = urls.slice(-APP_CONFIG.MAX_STORED_URLS);
      localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(urlsToStore));
    } catch (error) {
      console.warn("Error saving URLs to storage:", error);
    }
  }

  /**
   * Add new URL to storage
   */
  function addUrlToStorage(urlData) {
    const currentUrls = loadStoredUrls();
    const updatedUrls = [
      ...currentUrls,
      { ...urlData, id: generateId(), timestamp: Date.now() },
    ];
    saveUrlsToStorage(updatedUrls);
    return updatedUrls;
  }

  /**
   * Modern fetch with timeout and proper error handling
   */
  async function fetchWithTimeout(
    url,
    options = {},
    timeout = APP_CONFIG.API_TIMEOUT
  ) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Mock URL shortener for development/fallback
   */
  function createMockShortUrl(originalUrl) {
    // Simple hash-based shortener for demo purposes
    const hash = Math.random().toString(36).substring(2, 8);
    return `https://short.ly/${hash}`;
  }

  /**
   * Shorten URL using Clean URI API with fallback to mock
   */
  async function shortenUrl(originalUrl) {
    try {
      const response = await fetchWithTimeout(APP_CONFIG.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: originalUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle API-specific response format
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.result_url) {
        throw new Error("Invalid API response: missing shortened URL");
      }

      return {
        original: originalUrl,
        shortened: data.result_url,
        success: true,
      };
    } catch (error) {
      console.error("API Error:", error);
      console.log("Falling back to mock URL shortener for demo purposes");

      // For development/demo: use mock shortener as fallback
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("CORS") ||
        error.name === "TypeError"
      ) {
        console.log("Using mock shortener due to CORS/network issues");

        return {
          original: originalUrl,
          shortened: createMockShortUrl(originalUrl),
          success: true,
          isMock: true, // Flag to indicate this is a demo URL
        };
      }

      // Provide user-friendly error messages for other errors
      let userMessage = "Unable to shorten URL. Please try again.";

      if (error.name === "AbortError") {
        userMessage =
          "Request timed out. Please check your connection and try again.";
      } else if (error.message.includes("HTTP 4")) {
        userMessage =
          "Invalid URL provided. Please check the URL and try again.";
      }

      return {
        original: originalUrl,
        error: userMessage,
        success: false,
      };
    }
  }

  /**
   * Copy text to clipboard using modern Clipboard API with fallback
   */
  async function copyToClipboard(text) {
    try {
      // Modern Clipboard API (preferred)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand("copy");
      document.body.removeChild(textArea);

      return success;
    } catch (error) {
      console.error("Clipboard error:", error);
      return false;
    }
  }

  /**
   * Show error message with accessibility support
   */
  function showError(message) {
    elements.errorDisplay.textContent = message;
    elements.input.setAttribute("aria-invalid", "true");
    elements.input.setAttribute("aria-describedby", "url-error");

    // Announce error to screen readers
    announceToScreenReader(`Error: ${message}`, "assertive");

    appState.currentError = message;
  }

  /**
   * Clear error message
   */
  function clearError() {
    elements.errorDisplay.textContent = "";
    elements.input.removeAttribute("aria-invalid");
    appState.currentError = null;
  }

  /**
   * Show loading state
   */
  function showLoading() {
    appState.isLoading = true;
    elements.submitButton.disabled = true;
    elements.submitButton.textContent = "Shortening...";
    elements.submitButton.setAttribute("aria-busy", "true");
  }

  /**
   * Hide loading state
   */
  function hideLoading() {
    appState.isLoading = false;
    elements.submitButton.disabled = false;
    elements.submitButton.textContent = "Shorten It!";
    elements.submitButton.removeAttribute("aria-busy");
  }

  /**
   * Create URL result element with accessibility features
   */
  function createUrlResultElement(urlData) {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.setAttribute("role", "group");
    resultItem.setAttribute(
      "aria-label",
      `Shortened URL result for ${urlData.original}`
    );

    // Add demo indicator if using mock API
    const demoIndicator = urlData.isMock
      ? '<span class="result-item__demo" title="Demo URL - not a real shortened link">(Demo)</span>'
      : "";

    resultItem.innerHTML = `
    <span class="result-item__original">${sanitizeHtml(urlData.original)}</span>
    <a href="${
      urlData.isMock ? urlData.original : sanitizeHtml(urlData.shortened)
    }"
       class="result-item__shortened"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Open ${urlData.isMock ? "original" : "shortened"} URL: ${
      urlData.shortened
    }">
      ${sanitizeHtml(urlData.shortened)} ${demoIndicator}
    </a>
    <button class="btn btn--primary result-item__copy"
            type="button"
            aria-label="Copy shortened URL to clipboard"
            data-url="${sanitizeHtml(urlData.shortened)}">
      Copy
    </button>
  `;

    return resultItem;
  }

  /**
   * Add URL result to DOM
   */
  function addUrlResult(urlData) {
    const resultElement = createUrlResultElement(urlData);
    elements.resultsContainer.appendChild(resultElement);

    // Announce success to screen readers
    announceToScreenReader(
      `URL shortened successfully. New URL: ${urlData.shortened}`
    );

    // Add to app state
    appState.shortenedUrls.push(urlData);
  }

  /**
   * Load and display stored URLs on page load
   */
  function loadStoredUrlsToUI() {
    const storedUrls = loadStoredUrls();

    storedUrls.forEach((urlData) => {
      const resultElement = createUrlResultElement(urlData);
      elements.resultsContainer.appendChild(resultElement);
    });

    appState.shortenedUrls = storedUrls;
  }

  /**
   * Handle form submission
   */
  async function handleFormSubmit(event) {
    event.preventDefault();

    const url = elements.input.value.trim();

    // Clear previous errors
    clearError();

    // Validate input
    if (!url) {
      showError("Please add a link");
      elements.input.focus();
      return;
    }

    if (!isValidUrl(url)) {
      showError("Please add a valid URL (must start with http:// or https://)");
      elements.input.focus();
      return;
    }

    // Show loading state
    showLoading();

    try {
      // Shorten the URL
      const result = await shortenUrl(url);

      if (result.success) {
        // Add to storage and UI
        addUrlResult(result);

        // Clear input
        elements.input.value = "";

        // Focus on the copy button of the new result for keyboard users
        const newCopyButton =
          elements.resultsContainer.lastElementChild.querySelector(
            ".result-item__copy"
          );
        newCopyButton.focus();
      } else {
        showError(result.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      showError("An unexpected error occurred. Please try again.");
    } finally {
      hideLoading();
    }
  }

  /**
   * Handle copy button clicks with proper feedback
   */
  async function handleCopyClick(event) {
    const button = event.target;
    const urlToCopy = button.dataset.url;

    if (!urlToCopy) return;

    const originalText = button.textContent;

    try {
      const success = await copyToClipboard(urlToCopy);

      if (success) {
        // Visual feedback
        button.textContent = "Copied!";
        button.classList.add("result-item__copy--copied");

        // Announce to screen readers
        announceToScreenReader("URL copied to clipboard");

        // Reset after 2 seconds
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("result-item__copy--copied");
        }, 2000);
      } else {
        throw new Error("Copy failed");
      }
    } catch (error) {
      console.error("Copy error:", error);
      announceToScreenReader("Failed to copy URL", "assertive");

      // Show temporary error state
      button.textContent = "Copy Failed";
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  }

  /**
   * Handle mobile navigation toggle
   */
  function handleNavToggle() {
    const isExpanded =
      elements.navToggle.getAttribute("aria-expanded") === "true";

    elements.navToggle.setAttribute("aria-expanded", !isExpanded);
    elements.navMenu.setAttribute("aria-expanded", !isExpanded);

    // Update hamburger animation (if you want to add CSS for this)
    elements.navToggle.classList.toggle("nav__toggle--open");
  }

  /**
   * Handle keyboard navigation for better accessibility
   */
  function handleKeyboardNavigation(event) {
    // Escape key closes mobile menu
    if (
      event.key === "Escape" &&
      elements.navMenu.getAttribute("aria-expanded") === "true"
    ) {
      handleNavToggle();
      elements.navToggle.focus();
    }

    // Enter key on form submission (handled by browser, but good to be explicit)
    if (event.key === "Enter" && event.target === elements.input) {
      handleFormSubmit(event);
    }
  }

  function initApp() {
    // Load stored URLs
    loadStoredUrlsToUI();

    // Set up event listeners
    elements.form.addEventListener("submit", handleFormSubmit);

    // Event delegation for copy buttons (handles dynamically added buttons)
    elements.resultsContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("result-item__copy")) {
        handleCopyClick(event);
      }
    });

    // Mobile navigation
    if (elements.navToggle) {
      elements.navToggle.addEventListener("click", handleNavToggle);
    }

    // Keyboard navigation
    document.addEventListener("keydown", handleKeyboardNavigation);

    // Input validation feedback (real-time)
    const debouncedValidation = debounce((event) => {
      const url = event.target.value.trim();
      if (url && !isValidUrl(url)) {
        showError("Please enter a valid URL starting with http:// or https://");
      } else if (appState.currentError && isValidUrl(url)) {
        clearError();
      }
    }, 500);

    elements.input.addEventListener("input", debouncedValidation);

    console.log("✅ Shortly App initialized successfully");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

  // Optionally expose some functions for testing
  // In production, you might not want to expose anything
  window.ShortenApp = {
    // Only expose what's needed for testing or external integration
    isValidUrl: isValidUrl,
    // Don't expose internal state or sensitive functions
  };
})();
