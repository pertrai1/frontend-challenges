/**
 * Calculator App JavaScript
 * Implements calculator operations, theme switching, and persistence
 */

class Calculator {
  constructor() {
    // Calculator state
    this.currentInput = "0";
    this.previousInput = null;
    this.operator = null;
    this.waitingForOperand = false;

    // DOM elements
    this.display = document.querySelector(".display-input");
    this.keypad = document.querySelector(".keypad");
    this.themeInputs = document.querySelectorAll('input[name="theme"]');

    // Initialize
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTheme();
    this.updateDisplay();
  }

  setupEventListeners() {
    // Keypad clicks
    this.keypad.addEventListener("click", this.handleKeypadClick.bind(this));

    // Theme switching
    this.themeInputs.forEach((input) => {
      input.addEventListener("change", this.handleThemeChange.bind(this));
    });

    // Keyboard support
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeypadClick(event) {
    const { target } = event;

    if (!target.classList.contains("key")) return;

    const value = target.dataset.value;
    const operator = target.dataset.operator;
    const action = target.dataset.action;

    if (value !== undefined) {
      this.inputDigit(value);
    } else if (operator !== undefined) {
      this.inputOperator(operator);
    } else if (action !== undefined) {
      this.performAction(action);
    }
  }

  handleKeyDown(event) {
    const { key } = event;

    // Prevent default for calculator keys
    if (/[0-9+\-*/.=]|Enter|Backspace|Delete|Escape/.test(key)) {
      event.preventDefault();
    }

    // Handle number input
    if (/[0-9.]/.test(key)) {
      this.inputDigit(key);
    }
    // Handle operators
    else if (key === "+") {
      this.inputOperator("+");
    } else if (key === "-") {
      this.inputOperator("-");
    } else if (key === "*") {
      this.inputOperator("*");
    } else if (key === "/") {
      this.inputOperator("/");
    }
    // Handle actions
    else if (key === "Enter" || key === "=") {
      this.performAction("equals");
    } else if (key === "Backspace") {
      this.performAction("delete");
    } else if (key === "Delete" || key === "Escape") {
      this.performAction("reset");
    }
  }

  inputDigit(digit) {
    if (this.waitingForOperand) {
      this.currentInput = digit === "." ? "0." : digit;
      this.waitingForOperand = false;
    } else {
      // Handle decimal point
      if (digit === ".") {
        if (this.currentInput.indexOf(".") === -1) {
          this.currentInput += digit;
        }
        return;
      }

      // Handle zero at start
      if (this.currentInput === "0") {
        this.currentInput = digit;
      } else {
        // Limit display length
        if (this.currentInput.length < 12) {
          this.currentInput += digit;
        }
      }
    }

    this.updateDisplay();
  }

  inputOperator(nextOperator) {
    const inputValue = parseFloat(this.currentInput);

    if (this.previousInput === null) {
      this.previousInput = inputValue;
    } else if (this.operator && !this.waitingForOperand) {
      const result = this.calculate();

      if (result === null) return; // Error occurred

      this.currentInput = String(result);
      this.previousInput = result;
      this.updateDisplay();
    }

    this.waitingForOperand = true;
    this.operator = nextOperator;
  }

  performAction(action) {
    switch (action) {
      case "equals":
        this.equals();
        break;
      case "delete":
        this.delete();
        break;
      case "reset":
        this.reset();
        break;
    }
  }

  equals() {
    if (
      this.operator &&
      this.previousInput !== null &&
      !this.waitingForOperand
    ) {
      const result = this.calculate();

      if (result === null) return; // Error occurred

      this.currentInput = String(result);
      this.previousInput = null;
      this.operator = null;
      this.waitingForOperand = true;
      this.updateDisplay();
    }
  }

  delete() {
    if (this.waitingForOperand) {
      // If waiting for operand, clear the operator
      this.operator = null;
      this.waitingForOperand = false;
      if (this.previousInput !== null) {
        this.currentInput = String(this.previousInput);
        this.previousInput = null;
      }
    } else {
      // Remove last digit
      if (this.currentInput.length > 1) {
        this.currentInput = this.currentInput.slice(0, -1);
      } else {
        this.currentInput = "0";
      }
    }

    this.updateDisplay();
  }

  reset() {
    this.currentInput = "0";
    this.previousInput = null;
    this.operator = null;
    this.waitingForOperand = false;
    this.updateDisplay();
  }

  calculate() {
    const prev = this.previousInput;
    const current = parseFloat(this.currentInput);

    if (prev === null || this.operator === null) {
      return current;
    }

    let result;

    switch (this.operator) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        if (current === 0) {
          this.showError("Cannot divide by zero");
          return null;
        }
        result = prev / current;
        break;
      default:
        return current;
    }

    // Handle floating point precision issues
    result = Math.round(result * 100_000_000_000) / 100_000_000_000;

    // Check for overflow
    if (!isFinite(result)) {
      this.showError("Result too large");
      return null;
    }

    return result;
  }

  showError(message) {
    this.currentInput = "Error";
    this.updateDisplay();

    // Reset after showing error
    setTimeout(() => {
      this.reset();
    }, 2000);
  }

  updateDisplay() {
    let displayValue = this.currentInput;

    // Format large numbers with scientific notation
    const num = parseFloat(displayValue);
    if (
      num !== 0 &&
      (Math.abs(num) >= 1_000_000_000_000 ||
        (Math.abs(num) < 0.000_001 && Math.abs(num) !== 0))
    ) {
      displayValue = num.toExponential(6);
    }
    // Limit decimal places for display
    else if (displayValue.includes(".") && displayValue.length > 12) {
      displayValue = parseFloat(displayValue).toPrecision(10);
    }
    // Format large integers with numeric separators for readability
    else if (Number.isInteger(num) && Math.abs(num) >= 1_000) {
      displayValue = this.formatWithNumericSeparators(num);
    }

    this.display.value = displayValue;
  }

  formatWithNumericSeparators(number) {
    // Use Intl.NumberFormat to add commas as thousand separators (standard en-US formatting)
    return new Intl.NumberFormat("en-US").format(number);
  }

  handleThemeChange(event) {
    const theme = event.target.value;
    this.setTheme(theme);
    this.saveTheme(theme);
  }

  setTheme(theme) {
    // Remove existing theme classes
    document.body.classList.remove("theme-1", "theme-2", "theme-3");

    // Add new theme class
    if (theme !== "1") {
      document.body.classList.add(`theme-${theme}`);
    }

    // Update radio button
    const themeInput = document.querySelector(`input[value="${theme}"]`);
    if (themeInput) {
      themeInput.checked = true;
    }
  }

  saveTheme(theme) {
    try {
      localStorage.setItem("calculator-theme", theme);
    } catch (error) {
      console.warn("Could not save theme preference:", error);
    }
  }

  loadTheme() {
    let theme = "1"; // Default theme

    try {
      // First, try to load from localStorage
      const savedTheme = localStorage.getItem("calculator-theme");
      if (savedTheme && ["1", "2", "3"].includes(savedTheme)) {
        theme = savedTheme;
      } else {
        // If no saved theme, check system preference
        theme = this.getSystemTheme();
      }
    } catch (error) {
      console.warn("Could not load theme preference:", error);
      theme = this.getSystemTheme();
    }

    this.setTheme(theme);
  }

  getSystemTheme() {
    // Map system dark mode to theme 1 (dark), light mode to theme 2 (light)
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "1"; // Dark theme
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "2"; // Light theme
    }
    return "1"; // Default to dark theme
  }
}

// Initialize calculator when DOM is loaded
let calculator = null;
document.addEventListener("DOMContentLoaded", () => {
  calculator = new Calculator();
});

// Listen for system theme changes
if (window.matchMedia) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      // Only update if no theme is saved in localStorage
      if (!localStorage.getItem("calculator-theme") && calculator) {
        calculator.setTheme(calculator.getSystemTheme());
      }
    });
}
