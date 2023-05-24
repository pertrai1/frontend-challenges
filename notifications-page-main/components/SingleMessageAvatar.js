export class SingleMessageAvatar extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    const image = document.createElement('img');
    image.src = this.getAttribute('src');
    image.classList = 'avatar';
    image.alt = this.getAttribute('alt');
    image.height = "45";
    this.root.appendChild(image);
  }
}

customElements.define('single-message-avatar', SingleMessageAvatar);
