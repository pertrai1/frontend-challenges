(() => {
  const lightEls = [...document.querySelectorAll(".light")];
  const activeEls = document.querySelector("#active-lights");
  const activeLights = [];
  lightEls.forEach((light, index) => {
    light.addEventListener("click", ({ target }) => {
      if (!target.classList.contains("activated")) {
        activeLights.push(index);
        activeEls.innerHTML = activeLights.join(", ");
        target.classList.add("activated");
      }
      if (activeLights.length === lightEls.length) {
        for (let i = 0; i < activeLights.length; i++) {
          setTimeout(() => {
            lightEls[activeLights[i]].classList.remove("activated");
            activeEls.innerHTML = activeLights
              .slice(0, activeLights.length - 1 - i)
              .join(", ");
          }, 300 * (i + 1));
        }
      }
    });
  });
})();
