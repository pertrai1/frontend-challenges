class JobCard extends HTMLElement {
  constructor() {
    super();
    this.jobData = null;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  set data(jobData) {
    this.jobData = jobData;
    if (this.isConnected) {
      this.render();
      this.attachEventListeners();
    }
  }

  get data() {
    return this.jobData;
  }

  render() {
    if (!this.jobData) return;

    const {
      company,
      logo,
      new: isNew,
      featured,
      position,
      role,
      level,
      postedAt,
      contract,
      location,
      languages = [],
      tools = [],
    } = this.jobData;

    // Combine all filter tags
    const allTags = [role, level, ...languages, ...tools].filter(Boolean);

    this.className = `job-card ${featured ? "featured" : ""}`;

    this.innerHTML = `
      <div class="job-card__company">
        <img src="${logo}" alt="${company} logo" class="company-logo">
      </div>

      <div class="company-info">
        <div class="company-header">
          <h2 class="company-name">${company}</h2>
          ${isNew ? '<span class="badge new">New!</span>' : ""}
          ${featured ? '<span class="badge featured">Featured</span>' : ""}
        </div>

        <h3 class="job-title">${position}</h3>

        <div class="job-meta">
          <span>${postedAt}</span>
          <span>${contract}</span>
          <span>${location}</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="job-tags">
        ${allTags
          .map((tag) => `<filter-tag label="${tag}"></filter-tag>`)
          .join("")}
      </div>
    `;
  }

  attachEventListeners() {
    const jobTitle = this.querySelector(".job-title");
    jobTitle?.addEventListener("click", () => {
      // Could add job detail navigation here
      console.log(
        `Clicked on ${this.jobData.position} at ${this.jobData.company}`
      );
    });

    // Make job title keyboard accessible
    jobTitle?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        jobTitle.click();
      }
    });

    jobTitle?.setAttribute("tabindex", "0");
    jobTitle?.setAttribute("role", "button");
  }
}

customElements.define("job-card", JobCard);
