class ImageCarousel extends HTMLElement {
  #images = [];
  #currentIndex = 0;
  #root;
  constructor() {
    super();
    this.#root = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["images"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "images") {
      try {
        this.#images = JSON.parse(newValue);
        this.#currentIndex = 0;
        this.render();
      } catch (e) {
        console.error("Invalid images JSON:", e);
      }
    }
  }

  connectedCallback() {
    this.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        this.#goToNext();
      } else if (e.key === "ArrowLeft") {
        this.#goToPrevious();
      }
    });
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
    this.render();
  }

  render() {
    const currentImage = this.#images[this.#currentIndex];

    this.#root.innerHTML = `
    <style>
    ::slotted(*) {
      font-family: sans-serif;
      color: #fff !important;
      padding: 1rem;
      text-align: center;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      height: 100vh;
      width: 100vw;
    }

    .image-carousel {
      background-color: #000;
      height: 400px;
      overflow: hidden;
      width: min(600px, 100vw);
      position: relative;
    }

    .image-carousel__image {
      object-fit: contain;
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .image-carousel__button {
      --size: 40px;
      height: var(--size);
      width: var(--size);

      background-color: #0008;
      border-radius: 100%;
      border: none;
      color: #fff;
      cursor: pointer;

      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .image-carousel__button:hover {
      background-color: #000b;
    }

    .image-carousel__button--prev {
      left: 16px;
    }

    .image-carousel__button--next {
      right: 16px;
    }

    .image-carousel__pages {
      background-color: #0008;
      border-radius: 12px;
      display: inline-flex;
      gap: 8px;
      padding: 8px;

      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
    }

    .image-carousel__pages__button {
      --size: 8px;
      height: var(--size);
      width: var(--size);

      border: none;
      border-radius: 100%;
      background-color: #666;
      cursor: pointer;
      display: inline-block;
      flex-shrink: 0;
      padding: 0;
      transition: background-color 0.3s ease-in-out;
    }

    .image-carousel__pages__button:hover {
      background-color: #ccc;
    }

    .image-carousel__pages__button--active {
      background-color: #fff;
    }
    </style>
    <div class="wrapper">
      <div class="image-carousel">
      ${
        this.#images.length
          ? `
        <img src="${currentImage.src}" alt="${
              currentImage.alt
            }" loading="lazy" class="image-carousel__image" aria-live="polite" />
        <button class="image-carousel__button image-carousel__button--prev" aria-label="Previous image" tabindex="0">&#10094;</button>
        <button class="image-carousel__button image-carousel__button--next" aria-label="Next image" tabindex="0">&#10095;</button>
        <div class="image-carousel__pages" role="tablist">
          ${this.#images
            .map(
              (_, index) => `
            <button
              class="image-carousel__pages__button ${
                index === this.#currentIndex
                  ? "image-carousel__pages__button--active"
                  : ""
              }"
              data-index="${index}"
              aria-label="Go to image ${index + 1}"
              role="tab"
              aria-selected="${index === this.#currentIndex}"
              tabindex="${index === this.#currentIndex ? 0 : -1}"></button>
          `
            )
            .join("")}
        </div>
        `
          : `
        <slot>
            <p>No images found. Please pass "images" attribute to the component</p>
        </slot>
        `
      }
      </div>
    </div>
    `;

    this.#root
      .querySelector(".image-carousel__button--prev")
      .addEventListener("click", () => this.#goToPrevious());
    this.#root
      .querySelector(".image-carousel__button--next")
      .addEventListener("click", () => this.#goToNext());

    this.#root
      .querySelectorAll(".image-carousel__pages__button")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = parseInt(e.currentTarget.getAttribute("data-index"));
          this.#currentIndex = index;
          this.render();
        });
      });

    this.#preloadImage(this.#getPrevIndex());
    this.#preloadImage(this.#getNextIndex());
  }

  #getPrevIndex() {
    return (this.#currentIndex - 1 + this.#images.length) % this.#images.length;
  }

  #getNextIndex() {
    return (this.#currentIndex + 1) % this.#images.length;
  }

  #preloadImage(index) {
    const img = new Image();
    img.src = this.#images[index].src;
  }

  #goToPrevious() {
    this.#currentIndex =
      (this.#currentIndex - 1 + this.#images.length) % this.#images.length;
    this.render();
  }

  #goToNext() {
    this.#currentIndex = (this.#currentIndex + 1) % this.#images.length;
    this.render();
  }
}
customElements.define("image-carousel", ImageCarousel);
