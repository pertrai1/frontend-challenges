/*
  ============================================
  LAUNCH COUNTDOWN TIMER
  ============================================
  This JavaScript handles:
  1. Calculating time remaining until launch (14 days from now)
  2. Updating the DOM every second
  3. Triggering flip animations when numbers change
  4. Persisting launch date across page refreshes
*/

/*
  ============================================
  IIFE (Immediately Invoked Function Expression)
  ============================================
  Why wrap in IIFE?
  1. Creates a private scope (variables don't pollute global namespace)
  2. Prevents naming conflicts with other scripts
  3. Allows us to use 'use strict' mode safely

  Pattern: (function() { ... })();
*/
(function () {
  "use strict";

  const COUNTDOWN_DAYS = 14;
  const UPDATE_INTERVAL = 1000;
  const STORAGE_KEY = "launchCountdownDate";

  /*
    ============================================
    DOM REFERENCES
    ============================================
    Cache DOM queries for better performance
    Why? DOM queries are slow - query once, reuse many times
  */

  /*
    querySelectorAll returns a NodeList (not an Array)
    We convert to Array using spread operator [...] for array methods
    Why? NodeLists don't have methods like .map(), .forEach(), etc.
  */
  const timeUnits = [...document.querySelectorAll(".time-unit")];

  /*
    ============================================
    STATE MANAGEMENT
    ============================================
    Store current countdown values to detect changes
    Why? We only want to animate when numbers actually change
  */
  let previousValues = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
  };

  /*
    ============================================
    INITIALIZE LAUNCH DATE
    ============================================
    Get or create the target launch date
  */

  /**
   * Gets the launch date from localStorage or creates a new one
   * @returns {Date} The target launch date
   *
   * Why a function?
   * Encapsulates logic, makes code reusable and testable
   */
  function getOrCreateLaunchDate() {
    // Try to get existing launch date from localStorage
    const storedDate = localStorage.getItem(STORAGE_KEY);

    if (storedDate) {
      /*
        Parse stored date string back into Date object
        Why? localStorage only stores strings, not objects
      */
      return new Date(storedDate);
    }

    /*
      No stored date found, create new one
      Calculate date 14 days from now
    */
    const now = new Date();

    /*
      Date manipulation:
      1. getTime() converts Date to milliseconds since Unix epoch
      2. Add milliseconds for 14 days (COUNTDOWN_DAYS * 24 hours * 60 min * 60 sec * 1000 ms)
      3. Create new Date from the result
    */
    const launchDate = new Date(
      now.getTime() + COUNTDOWN_DAYS * 24 * 60 * 60 * 1000
    );

    /*
      Store in localStorage for persistence
      toISOString() converts Date to standard string format
      Why ISO format? It's universal, unambiguous, and easily parsed
    */
    localStorage.setItem(STORAGE_KEY, launchDate.toISOString());

    return launchDate;
  }

  const LAUNCH_DATE = getOrCreateLaunchDate();

  /*
    ============================================
    UTILITY FUNCTIONS
    ============================================
    Small, focused functions that do one thing well
    "Pure functions" - same input always gives same output
  */

  /**
   * Pads a number with leading zero if less than 10
   * @param {number} num - Number to pad
   * @returns {string} Padded string
   *
   * Examples:
   * padZero(5) returns "05"
   * padZero(15) returns "15"
   *
   * Why? Countdown timers traditionally show "05" not "5"
   */
  function padZero(num) {
    /*
      String() converts number to string
      padStart(2, '0') ensures string is at least 2 chars, padding with '0' if needed
      This is cleaner than: num < 10 ? '0' + num : num
    */
    return String(num).padStart(2, "0");
  }

  /**
   * Calculates time remaining until launch
   * @param {Date} targetDate - The launch date
   * @returns {Object} Object with days, hours, minutes, seconds
   *
   * Return value example:
   * { days: 8, hours: 23, minutes: 45, seconds: 12 }
   */
  function calculateTimeRemaining(targetDate) {
    /*
      Calculate difference in milliseconds
      targetDate - now = how many milliseconds until launch
    */
    const now = new Date();
    const difference = targetDate - now;

    /*
      If difference is negative, launch date has passed
      Return all zeros
    */
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    /*
      Convert milliseconds to time units
      Why these calculations?

      Math.floor rounds down to nearest integer
      We work from largest to smallest unit:

      1. Total seconds = milliseconds / 1000
      2. Total minutes = total seconds / 60
      3. Total hours = total minutes / 60
      4. Total days = total hours / 24

      Modulo (%) gets remainder:
      - 125 seconds = 2 minutes + 5 seconds (125 % 60 = 5)
      - 25 hours = 1 day + 1 hour (25 % 24 = 1)
    */

    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    /*
      Object shorthand syntax:
      { days: days } can be written as just { days }
      when property name and variable name match
    */
    return { days, hours, minutes, seconds };
  }

  /**
   * Triggers flip animation for a specific time unit
   * @param {HTMLElement} unitElement - The .time-unit element
   * @param {string} newValue - The new value to display
   *
   * How flip animation SHOULD work (classic flip clock):
   * 1. Bottom half updates immediately to new value
   * 2. Update the "back" top card with new value
   * 3. Add 'flip' class to trigger CSS animation (top half flips down)
   * 4. After animation completes, update top half and remove 'flip' class
   */
  function triggerFlip(unitElement, newValue) {
    /*
      querySelector on an element (not document) searches within that element
      This is more efficient than searching the entire document
    */
    const flipCard = unitElement.querySelector(".flip-card");

    /*
      Safety check: does the element exist?
      Defensive programming prevents errors if DOM structure changes
    */
    if (!flipCard) return;

    /*
      STEP 1: Immediately update the bottom half to show new number
      This is what the user will see as the "new" bottom half
    */
    const bottomSpan = flipCard.querySelector(".flip-card-bottom span");
    if (bottomSpan) bottomSpan.textContent = newValue;

    /*
      STEP 2: Update the animated "back" card spans with new value
      These will be visible during the flip animation
    */
    const backSpans = flipCard.querySelectorAll(".flip-card-back span");
    backSpans.forEach((span) => {
      span.textContent = newValue;
    });

    /*
      STEP 3: Add 'flip' class to trigger CSS animation
      The top half will flip down, revealing the new number
    */
    flipCard.classList.add("flip");

    /*
      STEP 4: After animation completes, update the top half
      setTimeout schedules a function to run after a delay
      Why 600ms? That's our CSS animation duration (from --transition-speed)
    */
    setTimeout(() => {
      // Update top half to match bottom (both show new value now)
      const topSpan = flipCard.querySelector(".flip-card-top span");
      if (topSpan) topSpan.textContent = newValue;

      // Remove flip class to reset animation for next time
      flipCard.classList.remove("flip");
    }, 600); // Match CSS transition duration
  }

  /**
   * Updates a specific time unit in the DOM
   * @param {HTMLElement} unitElement - The .time-unit element
   * @param {string} unit - Type of unit ('days', 'hours', 'minutes', 'seconds')
   * @param {number} value - The value to display
   *
   * This function:
   * 1. Converts value to padded string
   * 2. Checks if value changed from last update
   * 3. Triggers flip animation if changed
   * 4. Updates previous value for next comparison
   */
  function updateTimeUnit(unitElement, unit, value) {
    const paddedValue = padZero(value);

    /*
      Only animate if value actually changed
      Why? Unnecessary animations waste resources and distract users
    */
    if (previousValues[unit] !== paddedValue) {
      /*
        For first load, don't animate
        previousValues[unit] === null means this is the first update
      */
      if (previousValues[unit] !== null) {
        triggerFlip(unitElement, paddedValue);
      } else {
        /*
          First load: set value without animation
          Update all spans directly
        */
        const allSpans = unitElement.querySelectorAll("[data-value]");
        allSpans.forEach((span) => {
          span.textContent = paddedValue;
        });
      }

      // Update previous value for next comparison
      previousValues[unit] = paddedValue;
    }
  }

  /**
   * Main update function - calculates and updates all time units
   * This runs every second via setInterval
   */
  function updateCountdown() {
    // Calculate current time remaining
    const timeRemaining = calculateTimeRemaining(LAUNCH_DATE);

    /*
      Object destructuring:
      Extract properties from object into individual variables
      Same as:
      const days = timeRemaining.days;
      const hours = timeRemaining.hours;
      etc.

      Why destructuring? More concise and clearer intent
    */
    const { days, hours, minutes, seconds } = timeRemaining;

    /*
      Update each time unit
      We iterate through our cached DOM elements
    */
    timeUnits.forEach((unitElement) => {
      /*
        dataset gives access to data-* attributes
        data-unit="days" becomes unitElement.dataset.unit === "days"

        Why data attributes?
        - HTML5 standard way to store custom data
        - Accessible via JavaScript
        - Won't conflict with standard attributes
      */
      const unit = unitElement.dataset.unit;

      /*
        Switch statement for control flow
        Based on unit type, update with corresponding value

        Why switch instead of if/else?
        - Cleaner for multiple conditions
        - Better performance (sometimes)
        - More readable intent
      */
      switch (unit) {
        case "days":
          updateTimeUnit(unitElement, unit, days);
          break;
        case "hours":
          updateTimeUnit(unitElement, unit, hours);
          break;
        case "minutes":
          updateTimeUnit(unitElement, unit, minutes);
          break;
        case "seconds":
          updateTimeUnit(unitElement, unit, seconds);
          break;
      }
    });

    /*
      Check if countdown reached zero
      If so, we could trigger some action
    */
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      handleCountdownComplete();
    }
  }

  /**
   * Handles countdown completion
   * Called when timer reaches zero
   */
  function handleCountdownComplete() {
    /*
      Optional: add special handling when countdown finishes
      Examples:
      - Show "We're live!" message
      - Redirect to main site
      - Trigger confetti animation
      - Clear localStorage to reset for next visit
    */
    console.log("🚀 Launch time!");

    // Could clear stored date so next visit starts fresh countdown
    // localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Initializes the countdown timer
   * Sets up interval and runs first update
   */
  function init() {
    /*
      Run update immediately on page load
      Why? Without this, there's a 1-second delay before first update
      User would see placeholder values for a second
    */
    updateCountdown();

    /*
      setInterval repeatedly calls a function with a fixed delay
      Returns an interval ID that can be used to stop it with clearInterval

      Why setInterval instead of setTimeout?
      - setInterval automatically repeats
      - setTimeout would need to call itself recursively

      Note: We store the interval ID for cleanup (see below)
    */
    const intervalId = setInterval(updateCountdown, UPDATE_INTERVAL);

    /*
      Cleanup on page unload
      Why? Good practice to clean up intervals/timers
      Prevents memory leaks in single-page applications

      beforeunload event fires when user leaves page
    */
    window.addEventListener("beforeunload", () => {
      clearInterval(intervalId);
    });

    /*
      Optional: Pause countdown when page not visible
      Saves resources when user switches tabs
      Page Visibility API tells us if page is visible
    */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Page is hidden, could pause here
        // clearInterval(intervalId);
      } else {
        // Page is visible again, could resume
        // But easier to just keep running
        // User won't notice 1-second granularity gaps
      }
    });
  }

  /*
    ============================================
    INITIALIZE ON DOM READY
    ============================================
    Wait for DOM to fully load before running script
  */

  /*
    DOMContentLoaded fires when HTML is fully parsed
    Why wait? We need DOM elements to exist before querying them

    readyState === 'loading' means HTML still parsing
    If not loading, DOM is already ready, run immediately
  */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM already loaded (script loaded after HTML parsed)
    init();
  }

  /*
    ============================================
    DEBUG HELPERS (Development only)
    ============================================
    Useful functions for testing
    Remove or comment out in production
  */

  /*
    Expose reset function to window for testing
    Type resetCountdown() in browser console to reset timer

    Why window.resetCountdown?
    IIFE creates private scope, but we can expose specific functions
    by attaching them to window object
  */
  window.resetCountdown = function () {
    localStorage.removeItem(STORAGE_KEY);
    location.reload(); // Refresh page to restart with new date
  };

  /*
    Set custom countdown duration for testing
    Example: setCountdownDuration(1) for 1 day countdown
  */
  window.setCountdownDuration = function (days) {
    const now = new Date();
    const customDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    localStorage.setItem(STORAGE_KEY, customDate.toISOString());
    location.reload();
  };

  /*
    Fast-forward to test countdown end
    Sets countdown to 10 seconds from now
  */
  window.testCountdownEnd = function () {
    const now = new Date();
    const testDate = new Date(now.getTime() + 10000); // 10 seconds
    localStorage.setItem(STORAGE_KEY, testDate.toISOString());
    location.reload();
  };
})(); // End of IIFE - immediately invoke the function

/*
  ============================================
  KEY TAKEAWAYS FOR LEARNING
  ============================================

  1. CODE ORGANIZATION
     - Use IIFE for encapsulation
     - Group related code into functions
     - Constants at top, init at bottom

  2. MODERN JAVASCRIPT
     - const/let over var
     - Arrow functions for brevity
     - Template literals for strings
     - Destructuring for cleaner code
     - Array spread operator

  3. PERFORMANCE
     - Cache DOM queries
     - Only update when values change
     - Use data attributes for configuration

  4. MAINTAINABILITY
     - Descriptive function and variable names
     - Comments explain WHY, not WHAT
     - Small, focused functions
     - Constants for magic numbers

  5. BEST PRACTICES
     - 'use strict' mode
     - Defensive coding (check if elements exist)
     - Clean up resources (clear intervals)
     - Test helpers for development

  6. JAVASCRIPT CONCEPTS DEMONSTRATED
     - Closures (IIFE scope)
     - Event listeners
     - Timers (setInterval/setTimeout)
     - LocalStorage API
     - Date manipulation
     - DOM manipulation
     - CSS class manipulation
     - Array methods

  ============================================
*/
