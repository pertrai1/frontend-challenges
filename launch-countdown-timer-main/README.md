# Frontend Mentor - Launch countdown timer solution

This is a solution to the [Launch countdown timer challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/launch-countdown-timer-N0XkGfyz-). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- See hover states for all interactive elements on the page
- See a live countdown timer that ticks down every second (start the count at 14 days)
- **Bonus**: When a number changes, make the card flip from the middle

### Screenshot

![Launch Countdown Timer](./design/desktop-design.jpg)

### Links

- Solution URL: [GitHub Repository](https://github.com/yourusername/launch-countdown-timer)
- Live Site URL: [Live Demo](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties (CSS variables)
- CSS Grid for responsive layout
- Flexbox for component alignment
- CSS 3D transforms for flip animation
- Vanilla JavaScript (ES6+)
- Mobile-first responsive design
- CSS logical properties for internationalization
- ARIA labels for accessibility

### What I learned

This project was an excellent opportunity to dive deep into **CSS 3D transforms** and **flip card animations**. The most challenging aspect was creating the split-number effect where both halves of the card display different portions of the same number.

#### Key Learning: CSS 3D Flip Animation

The flip card structure uses absolute positioning with careful transform calculations:

```css
.flip-card-top span {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  line-height: 1;
}
```

This positions the number's center at the bottom edge of the top-half container, so `overflow: hidden` clips the bottom portion, showing only the top half of the number.

#### JavaScript Countdown Logic

Implemented date manipulation and localStorage persistence:

```js
function calculateTimeRemaining(targetDate) {
  const now = new Date();
  const difference = targetDate - now;

  const seconds = Math.floor((difference / 1000) % 60);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}
```

#### Animation Sequencing

The flip animation required precise sequencing:

```js
function triggerFlip(unitElement, newValue) {
  // 1. Update bottom half immediately
  const bottomSpan = flipCard.querySelector(".flip-card-bottom span");
  bottomSpan.textContent = newValue;

  // 2. Update animated back card
  const backSpans = flipCard.querySelectorAll(".flip-card-back span");
  backSpans.forEach((span) => (span.textContent = newValue));

  // 3. Trigger CSS animation
  flipCard.classList.add("flip");

  // 4. After animation, update top half
  setTimeout(() => {
    const topSpan = flipCard.querySelector(".flip-card-top span");
    topSpan.textContent = newValue;
    flipCard.classList.remove("flip");
  }, 600);
}
```

### Continued development

Areas I want to focus on in future projects:

1. **Advanced CSS animations** - Exploring more complex 3D transform animations and timing functions
2. **Performance optimization** - Using `requestAnimationFrame` for smoother animations
3. **Web Animations API** - Modern JavaScript API for more control over animations
4. **Accessibility enhancements** - Testing with screen readers and implementing skip links
5. **Progressive enhancement** - Ensuring the countdown works even if JavaScript fails

### Useful resources

- [MDN CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) - Comprehensive guide to 3D transforms
- [CSS Tricks - Flip Card Effect](https://css-tricks.com/almanac/properties/t/transform/) - Helped understand the mechanics of flip animations
- [MDN Date Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) - Essential for countdown timer calculations
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) - Understanding CSS variables and theming

## Author

- Website - Rob Simpson
- Frontend Mentor - [@pertrai1](https://www.frontendmentor.io/profile/pertrai1)
- GitHub - [@pertrai1](https://github.com/pertrai1)

---

**Challenge by [Frontend Mentor](https://www.frontendmentor.io)**
**Coded with vanilla HTML, CSS, and JavaScript**
