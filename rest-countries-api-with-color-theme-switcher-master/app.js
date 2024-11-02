const displayCountries = (countries) => {
  const countryWrapper = document.querySelector("#country-wrapper");
  countries.forEach((country) => {
    const {
      flags: { png },
    } = country;
    const countryDiv = document.createElement("div");
    countryDiv.classList.add("country");
    countryDiv.innerHTML = `
      <img src="${png}" />
    `;
    countryWrapper.appendChild(countryDiv);
  });
};
(async () => {
  const data = await fetch("http://localhost:8080/data.json");
  const countries = await data.json();
  displayCountries(countries);
})();
