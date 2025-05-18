function animateProgress(element, targetValue, duration = 1000) {
  const progressBar = element.querySelector(".progress");
  const startValue = parseInt(progressBar.getAttribute("aria-valuenow"));
  const startWidth = parseInt(progressBar.style.width);
  const startTime = performance.now();

  function update(currentTime) {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime >= duration) {
      progressBar.style.width = targetValue + "%";
      progressBar.setAttribute("aria-valuenow", targetValue);
      progressBar.textContent = targetValue + "%";
      return;
    }

    const progress = elapsedTime / duration;
    const currentValue = Math.floor(
      startValue + (targetValue - startValue) * progress
    );
    progressBar.style.width = currentValue + "%";
    progressBar.setAttribute("aria-valuenow", currentValue);
    progressBar.textContent = currentValue + "%";

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
