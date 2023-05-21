const template = document.createElement("template");
template.innerHTML = `
<div class="result">
  <h1>Your Result</h1>
  <div class="score">
    <h2>76</h2>
    of 100
  </div>

  <h3>Great</h3>
  You scored higher than 65% of the people who have taken these tests.
</div>
`;
export class Result extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const styles = document.createElement("style");
    this.root.appendChild(styles);

    async function loadCSS() {
      const request = await fetch("./components/Result.css");
      const css = await request.text();
      styles.textContent = css;
    }
    loadCSS();
  }

  connectedCallback() {
    //const template = document.getElementById("app-result");
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);
  }
}

customElements.define("app-result", Result);
