class SvgIcon extends HTMLElement {
  static get observedAttributes() {
    return ["path"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("viewBox", "0 0 24 24");
    this.svg.setAttribute("fill", "#737373");
    this.svg.setAttribute("aria-hidden", "true");
    this.svg.setAttribute("width", "1em");
    this.svg.setAttribute("height", "1em");
    this.pathElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    this.svg.appendChild(this.pathElement);
    this.shadowRoot.appendChild(this.svg);
  }

  attributeChangedCallback(name, oldVar, newVal) {
    if (name === "path") {
      this.pathElement.setAttribute("d", newVal);
    }
  }
}

customElements.define("svg-icon", SvgIcon);
