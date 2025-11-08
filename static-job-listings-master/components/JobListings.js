class JobListings extends HTMLElement {
  constructor() {
    super();
    this.allJobs = [];
    this.filteredJobs = [];
    this.activeFilters = [];
  }

  connectedCallback() {
    this.render();
    this.loadJobs();

    // Listen for filter changes
    document.addEventListener(
      "filters-changed",
      this.handleFilterChange.bind(this)
    );
  }

  disconnectedCallback() {
    document.removeEventListener(
      "filters-changed",
      this.handleFilterChange.bind(this)
    );
  }

  async loadJobs() {
    try {
      this.showLoading();
      const response = await fetch("./data.json");

      if (!response.ok) {
        throw new Error(`Failed to load jobs: ${response.status}`);
      }

      this.allJobs = await response.json();
      this.filteredJobs = [...this.allJobs];
      this.render();
    } catch (error) {
      console.error("Error loading jobs:", error);
      this.showError("Failed to load job listings. Please try again.");
    }
  }

  handleFilterChange(e) {
    this.activeFilters = e.detail.filters;
    this.filterJobs();
    this.render();
  }

  filterJobs() {
    if (this.activeFilters.length === 0) {
      this.filteredJobs = [...this.allJobs];
      return;
    }

    this.filteredJobs = this.allJobs.filter((job) => {
      // Get all filterable attributes for this job
      const jobTags = [
        job.role,
        job.level,
        ...job.languages,
        ...job.tools,
      ].filter(Boolean);

      // Check if job contains ALL active filters (AND logic)
      return this.activeFilters.every((filter) => jobTags.includes(filter));
    });
  }

  render() {
    if (this.filteredJobs.length === 0 && this.allJobs.length > 0) {
      this.showEmptyState();
      return;
    }

    const jobCardsHTML = this.filteredJobs
      .map((job) => `<job-card data-job-id="${job.id}"></job-card>`)
      .join("");

    this.innerHTML = `
      <div class="job-list">
        ${jobCardsHTML}
      </div>
    `;

    // Set job data for each card after rendering
    this.filteredJobs.forEach((job, index) => {
      const jobCard = this.querySelectorAll("job-card")[index];
      if (jobCard) {
        jobCard.data = job;
      }
    });
  }

  showLoading() {
    this.innerHTML = `
      <div class="loading">
        <p>Loading job listings...</p>
      </div>
    `;
  }

  showError(message) {
    this.innerHTML = `
      <div class="error">
        <h3>Oops! Something went wrong</h3>
        <p>${message}</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  showEmptyState() {
    this.innerHTML = `
      <div class="empty-state">
        <h3>No jobs found</h3>
        <p>Try adjusting your filters to see more results.</p>
      </div>
    `;
  }

  // Method to get job by ID (for future use)
  getJobById(id) {
    return this.allJobs.find((job) => job.id === parseInt(id));
  }
}

customElements.define("job-listings", JobListings);
