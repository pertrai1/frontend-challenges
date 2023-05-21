import {SingleSummary} from './SingleSummary.js';

const template = document.createElement("template");
template.innerHTML = `
<div class="summary">
  <h1>Summary</h1>

  <single-summary
    category="reaction"
    title="Reaction"
  >
  </single-summary>
  <single-summary
    category="memory"
    title="Memory"
  >
  </single-summary>
  <single-summary
    category="verbal"
    title="Verbal"
  >
  </single-summary>
  <single-summary
    category="visual"
    title="Visual"
  >
  </single-summary>

  <button type="button">
    Continue
  </button
</div>
`;
export class Summary extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const styles = document.createElement("style");
    this.root.appendChild(styles);

    async function loadCSS() {
      const request = await fetch("/components/Summary.css");
      const css = await request.text();
      styles.innerText = css;
    }
    loadCSS();
  }

  connectedCallback() {
    //const template = document.getElementById("app-summary");
    const content = template.content.cloneNode(template);
    this.root.appendChild(content);
  }
}

customElements.define("app-summary", Summary);
