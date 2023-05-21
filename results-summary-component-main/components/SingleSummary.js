const template = document.createElement('template');
template.innerHTML = `
  <style>
    .single-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .reaction {
      background-color: hsla(0, 100%, 67%, 0.1);
    }

    .reaction .summary-name {
      color: hsla(0, 100%, 67%, 1);
      font-weight: 800;
    }
  
    .memory {
      background-color: hsla(39, 100%, 56%, 0.1);
    }

    .memory .summary-name {
      color: hsl(39, 100%, 56%);
      font-weight: 800;
    }

    .verbal {
      background-color: hsla(166, 100%, 37%, 0.1);
    }

    .verbal .summary-name {
      color: hsl(166, 100%, 37%);
      font-weight: 800;
    }

    .visual {
      background-color: hsla(234, 85%, 45%, 0.1);
    }

    .visual .summary-name {
      color: hsl(234, 85%, 45%);
      font-weight: 800;
    }

    img {
      vertical-align: top;
      padding-right: 0.5rem;
    }
  </style>
  <div class="single-summary">
    <div>
      <img />
      <span class="summary-name"></span>
    </div>
    <div>
      <span class="score">80</span>
      <span class="total">/ 100</span>
    </div>
  </div>
`;

export class SingleSummary extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    const content = template.content.cloneNode(template);
    this.root.appendChild(content);

    const category = this.getAttribute('category');
    const title = this.getAttribute('title');
    this.shadowRoot.querySelector('.single-summary').classList.add(category);
    this.shadowRoot.querySelector('.summary-name').innerText = title;
    this.shadowRoot.querySelector('img').src = `/assets/images/icon-${category}.svg`;
  }

  static get observedAttributes() {
    return ['category', 'title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} with old: ${oldValue} and new: ${newValue}`);
  }
}

customElements.define('single-summary', SingleSummary);
