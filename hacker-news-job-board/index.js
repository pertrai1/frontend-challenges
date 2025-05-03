const jobBoard = document.getElementById("job-board");
const loadMoreButton = document.getElementById("load-more");
let currentPage = 1;
const jobsPerPage = 5;

// Add error handling and loading states
async function loadJobs(page) {
  try {
    // Show loading state
    loadMoreButton.disabled = true;
    loadMoreButton.textContent = "Loading...";

    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/jobstories.json`
    );
    if (!response.ok) throw new Error("Failed to fetch job IDs");

    const jobIds = await response.json();
    const startIndex = (page - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const jobsToLoad = jobIds.slice(startIndex, endIndex);

    // Hide button if we've loaded all jobs
    if (endIndex >= jobIds.length) {
      loadMoreButton.style.display = "none";
    }

    // Use Promise.all to load all jobs in parallel
    const jobPromises = jobsToLoad.map((jobId) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${jobId}.json`).then(
        (response) => {
          if (!response.ok) throw new Error(`Failed to fetch job ${jobId}`);
          return response.json();
        }
      )
    );

    const jobs = await Promise.all(jobPromises);

    // Add jobs to the DOM
    jobs.forEach((job) => {
      const jobElement = document.createElement("li");

      // Add URL linking if available
      const title = job.url
        ? `<a href="${job.url}" target="_blank" rel="noopener">${job.title}</a>`
        : job.title;

      jobElement.innerHTML = `
        <h2>${title}</h2>
        <p>By ${job.by} on ${new Date(job.time * 1000).toLocaleString()}</p>
      `;
      jobBoard.appendChild(jobElement);
    });
  } catch (error) {
    console.error("Error loading jobs:", error);
    // Show error message to user
    const errorElement = document.createElement("li");
    errorElement.classList.add("error");
    errorElement.textContent = "Failed to load jobs. Please try again later.";
    jobBoard.appendChild(errorElement);
  } finally {
    // Reset button state
    loadMoreButton.disabled = false;
    loadMoreButton.textContent = "Load more jobs";
  }
}

loadJobs(currentPage);
loadMoreButton.addEventListener("click", () => {
  currentPage++;
  loadJobs(currentPage);
});
