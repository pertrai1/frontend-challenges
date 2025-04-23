import "./svg-icon.js";

const template = document.createElement("template");
const generateId = (() => {
  return (prefix) => {
    return `${prefix}-${
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2, 10)
    }`;
  };
})();

template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: 'Inter', sans-serif;
      margin-block-end: 1.5rem;

      --label-color: #344054;
      --input-bg: #f5f5f5;
      --input-border: #d0d5dd;
      --input-border-focus: #84caff;
      --input-border-error: #d92d20;
      --input-disabled-bg: #f9fafb;
      --input-disabled-color: #9ca3af;
      --hint-color: #737373;
      --error-color: #dc2626;
      --font-size: 1rem;
      --label-size: 0.875rem;
      --hint-size: 0.8125rem;
      --error-size: 0.8125rem;
      --padding-x: 0.875rem;
      --padding-y: 0;
      --border-radius: 0.5rem;
      --input-height: 44px;
    }

    .label {
      display: block;
      font-size: var(--label-size);
      font-weight: 600;
      color: var(--label-color);
      margin-block-end: 0.375rem;
      cursor: pointer;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      height: var(--input-height);
      border: 1px solid var(--input-border);
      border-radius: var(--border-radius);
      padding-block: var(--padding-y);
      padding-inline: var(--padding-x);
      background-color: var(--input-bg);
      transition: border 0.2s ease, box-shadow 0.2s ease;
    }

    .input-wrapper:not(.disabled):hover {
      border-color: color-mix(in srgb, var(--input-border-focus) 25%, black);
    }

    .input-wrapper.focused {
      border-color: var(--input-border-focus);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--input-border-focus) 40%, transparent);
    }

    .input-wrapper.error {
      border-color: var(--input-border-error);
    }

    .input-wrapper.disabled {
      background-color: var(--input-disabled-bg);
      color: var(--input-disabled-color);
      pointer-events: none;
    }

    ::slotted([slot="icon-start"]),
    ::slotted([slot="icon-end"]) {
      font-size: 20px;
      display: flex;
      align-items: center;
      margin-inline: 0.5rem;
    }

    ::slotted(.icon-circle) {
      border: 1px solid var(--input-border);
      border-radius: 50%;
      padding: 4px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: var(--hint-color);
    }

    input {
      border: none;
      flex: 1;
      font-size: var(--font-size);
      outline: none;
      background: transparent;
      color: #101828;
      line-height: 1.5;
    }

    .hint {
      font-size: var(--hint-size);
      color: var(--hint-color);
      margin-block-start: 0.375rem;
    }

    .error-message {
      font-size: var(--error-size);
      color: var(--error-color);
      margin-block-start: 0.375rem;
    }
  </style>

  <label class="label" part="label"></label>
  <div class="input-wrapper" part="input-wrapper">
    <slot name="icon-start"></slot>
    <input type="text" part="input" aria-describedby="hint error" />
    <slot name="icon-end"></slot>
  </div>
  <div id="hint" class="hint" part="hint"></div>
  <div id="error" class="error-message" part="error" hidden></div>
`;

class TextInputComponent extends HTMLElement {
  static formAssociated = true;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
    this.input = shadow.querySelector("input");
    this.wrapper = shadow.querySelector(".input-wrapper");
    this.labelEl = shadow.querySelector(".label");
    this.hintEl = shadow.querySelector(".hint");
    this.errorEl = shadow.querySelector(".error-message");

    this.input.addEventListener("focus", () =>
      this.wrapper.classList.add("focused")
    );
    this.input.addEventListener("blur", () =>
      this.wrapper.classList.remove("focused")
    );

    // Assign unique IDs for hint and error
    this.hintId = generateId("hint");
    this.errorId = generateId("error");
    this.hintEl.id = this.hintId;
    this.errorEl.id = this.errorId;
    this.input.setAttribute(
      "aria-describedby",
      `${this.hintId} ${this.errorId}`
    );
  }

  connectedCallback() {
    this.update();
    if (this.hasAttribute("disabled")) {
      this.input.disabled = true;
      this.wrapper.classList.add("disabled");
    }
    this.labelEl.addEventListener("click", () => this.input.focus());
  }

  static get observedAttributes() {
    return ["label", "placeholder", "hint", "error", "value", "disabled"];
  }

  attributeChangedCallback() {
    this.update();
  }

  update() {
    this.labelEl.textContent = this.getAttribute("label") || "";
    this.input.placeholder = this.getAttribute("placeholder") || "";
    const hint = this.getAttribute("hint") || "";
    const error = this.getAttribute("error") || "";

    if (error) {
      this.errorEl.hidden = false;
      this.errorEl.textContent = error;
      this.wrapper.classList.add("error");
      this.hintEl.textContent = "";
    } else {
      this.errorEl.hidden = true;
      this.wrapper.classList.remove("error");
      this.hintEl.textContent = hint;
    }

    this.input.value = this.getAttribute("value") || "";
  }

  get value() {
    return this.input.value;
  }

  set value(val) {
    this.setAttribute("value", val);
    this.input.value = val;
  }
}

customElements.define("text-input", TextInputComponent);
