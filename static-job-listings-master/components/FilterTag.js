class FilterTag extends HTMLElement {
  constructor() {
    super();
    this.isRemovable = false;
  }

  static get observedAttributes() {
    return ["label", "removable", "active"];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
      this.attachEventListeners();
    }
  }

  render() {
    const label = this.getAttribute("label") || "";
    this.isRemovable = this.hasAttribute("removable");

    if (this.isRemovable) {
      this.innerHTML = `
        <div class="filter-tag removable">
          <span class="tag-label">${label}</span>
          <button class="remove-filter" aria-label="Remove ${label} filter">
            <img src="./images/icon-remove.svg" alt="Remove">
          </button>
        </div>
      `;
    } else {
      this.innerHTML = `
        <button class="filter-tag" type="button">
          ${label}
        </button>
      `;
    }
  }

  attachEventListeners() {
    if (this.isRemovable) {
      const removeBtn = this.querySelector(".remove-filter");
      removeBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent("remove-filter", {
            detail: { label: this.getAttribute("label") },
            bubbles: true,
          })
        );
      });
    } else {
      const button = this.querySelector(".filter-tag");
      button?.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("add-filter", {
            detail: { label: this.getAttribute("label") },
            bubbles: true,
          })
        );
      });
    }
  }
}

customElements.define("filter-tag", FilterTag);
