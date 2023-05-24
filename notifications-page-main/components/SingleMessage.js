const template = document.createElement('template');
template.innerHTML = `
  <div class="message">
    <slot name="avatar"></slot>
    <slot name="content"></slot>
    <slot name="reply"></slot>
    <slot name="photo-comment"></slot>
  </div>
`;
const style = new CSSStyleSheet();
style.replaceSync(`
  .message {
    display: grid;
    grid-template-columns: 45px 1fr auto;
    grid-template-areas: "avatar . photoComment" ". reply reply";
    align-items: center;
    gap: 15px;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    border-radius: 10px;
  }

  .avatar {
    grid-area: avatar;
  }

  .photo-comment {
    grid-area: photoComment;
  }

  .new {
    background-color: var(--very-light-grayish-blue);
    cursor: pointer;
  }
`);
export class SingleMessage extends HTMLElement {
  static get observedAttributes() {
    return ['read'];
  }
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.isRead = this.getAttribute('read');
  }
  connectedCallback() {
    const content = template.content.cloneNode(template);
    this.root.appendChild(content);
    this.root.adoptedStyleSheets = [style];

    const messageContainer = this.root.querySelector('.message');
    this.isRead === "false" ? messageContainer.classList.add('new') : messageContainer.classList.remove('new');


    const count = document.querySelector('.count');
    messageContainer.addEventListener('click', e => {
      messageContainer.classList.remove('new');
      count.innerText--;
    });
  }
  
}

customElements.define('single-message', SingleMessage);
