class FilterBar extends HTMLElement {
  constructor() {
    super();
    this.activeFilters = new Set();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();

    // Listen for filter events from the document
    document.addEventListener("add-filter", this.handleAddFilter.bind(this));
    document.addEventListener(
      "filters-updated",
      this.handleFiltersUpdated.bind(this)
    );
  }

  disconnectedCallback() {
    document.removeEventListener("add-filter", this.handleAddFilter.bind(this));
    document.removeEventListener(
      "filters-updated",
      this.handleFiltersUpdated.bind(this)
    );
  }

  render() {
    const hasFilters = this.activeFilters.size > 0;

    if (!hasFilters) {
      this.innerHTML = "";
      return;
    }

    const filterTagsHTML = Array.from(this.activeFilters)
      .map((filter) => `<filter-tag label="${filter}" removable></filter-tag>`)
      .join("");

    this.innerHTML = `
      <div class="filter-bar">
        <div class="filter-tags">
          ${filterTagsHTML}
        </div>
        <button class="clear-filters" type="button">Clear</button>
      </div>
    `;
  }

  attachEventListeners() {
    // Handle remove filter events
    this.addEventListener("remove-filter", (e) => {
      this.removeFilter(e.detail.label);
    });

    // Handle clear filters
    const clearButton = this.querySelector(".clear-filters");
    clearButton?.addEventListener("click", () => {
      this.clearAllFilters();
    });
  }

  handleAddFilter(e) {
    this.addFilter(e.detail.label);
  }

  handleFiltersUpdated(e) {
    this.activeFilters = new Set(e.detail.filters);
    this.render();
    this.attachEventListeners();
  }

  addFilter(filterLabel) {
    if (!this.activeFilters.has(filterLabel)) {
      this.activeFilters.add(filterLabel);
      this.render();
      this.attachEventListeners();
      this.notifyFilterChange();
    }
  }

  removeFilter(filterLabel) {
    if (this.activeFilters.has(filterLabel)) {
      this.activeFilters.delete(filterLabel);
      this.render();
      this.attachEventListeners();
      this.notifyFilterChange();
    }
  }

  clearAllFilters() {
    this.activeFilters.clear();
    this.render();
    this.notifyFilterChange();
  }

  notifyFilterChange() {
    this.dispatchEvent(
      new CustomEvent("filters-changed", {
        detail: { filters: Array.from(this.activeFilters) },
        bubbles: true,
      })
    );
  }

  get filters() {
    return Array.from(this.activeFilters);
  }
}

customElements.define("filter-bar", FilterBar);
