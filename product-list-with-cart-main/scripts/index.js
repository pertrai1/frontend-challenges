import { hello } from "./base.js";
import { fetchData } from "./services.js";

const jsonData = fetchData();
jsonData.then((data) => {
  console.log(data);
  const wrapperEl = document.createElement("div");
  wrapperEl.classList.add("wrapper");
  document.body.appendChild(wrapperEl);

  const thumbnailWrapperEl = document.createElement("div");
  thumbnailWrapperEl.classList.add("thumbnail-wrapper");
  wrapperEl.appendChild(thumbnailWrapperEl);
});
