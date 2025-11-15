# Calculator App - Frontend Mentor Challenge

A fully functional, responsive calculator web app with multiple themes and complete keyboard support.

## 🚀 Demo

Open `index.html` in any modern web browser or serve it using a local HTTP server.

## ✨ Features

### Calculator Operations

- ✅ Basic arithmetic operations: addition (+), subtraction (-), multiplication (×), division (÷)
- ✅ Decimal number support with proper validation
- ✅ DEL key for deleting last entered digit/character
- ✅ RESET key for clearing all input and calculator state
- ✅ Equals (=) key for computing results
- ✅ Division by zero error handling
- ✅ Input validation to prevent invalid sequences
- ✅ Large number formatting with scientific notation
- ✅ Floating point precision handling

### Display & UX

- ✅ Real-time display updates as user enters numbers and operators
- ✅ Clear result display after calculations
- ✅ Responsive font sizing for different screen sizes
- ✅ Maximum display length handling with graceful overflow
- ✅ Error messages for invalid operations

### Theming System

- ✅ Three distinct color themes matching the design specifications
- ✅ Visual theme switcher with radio button interface
- ✅ Smooth transitions between themes
- ✅ System preference detection (`prefers-color-scheme`)
- ✅ Theme persistence using localStorage
- ✅ Automatic theme restoration on page reload

### Accessibility & Keyboard Support

- ✅ Full keyboard navigation support
- ✅ Proper focus states for all interactive elements
- ✅ ARIA labels and semantic HTML structure
- ✅ Screen reader friendly
- ✅ Keyboard shortcuts:
  - Numbers (0-9) and decimal point (.)
  - Operators (+, -, \*, /)
  - Enter or = for equals
  - Backspace for delete
  - Delete or Escape for reset

### Responsive Design

- ✅ Mobile-first responsive layout
- ✅ Optimized for screen sizes from 320px to desktop
- ✅ Touch-friendly button sizes on mobile
- ✅ Proper scaling of fonts and spacing
- ✅ Layout matches provided mobile and desktop designs

## 🛠️ Technologies Used

- **HTML5**: Semantic, accessible structure
- **CSS3**: Modern CSS with custom properties, Flexbox, and Grid
- **Vanilla JavaScript**: No frameworks, clean ES6+ code
- **Google Fonts**: League Spartan font family

## 📁 File Structure

```
calculator-app-main/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS with all themes
├── script.js           # Calculator logic and interactions
├── style-guide.md      # Design tokens and colors
├── design/             # JPG mockups for all themes
├── images/             # Favicon and assets
└── README.md          # This file
```

## 🎨 Themes

### Theme 1 (Default - Dark)

- Navy blue backgrounds with orange accent
- White text on dark backgrounds
- Maps to system dark mode preference

### Theme 2 (Light)

- Light gray backgrounds with blue/orange accents
- Dark text on light backgrounds
- Maps to system light mode preference

### Theme 3 (Purple)

- Dark purple backgrounds with cyan accent
- Yellow text with purple styling
- Unique vibrant color scheme

## 🧪 Testing

The calculator has been tested for:

### Basic Operations

- ✅ 2 + 3 = 5
- ✅ 7 - 4 = 3
- ✅ 6 × 7 = 42
- ✅ 8 ÷ 2 = 4

### Chained Operations

- ✅ 5 + 5 - 2 = 8
- ✅ 3 × 4 ÷ 2 = 6

### Decimal Operations

- ✅ 0.1 + 0.2 = 0.3
- ✅ 2.5 × 4 = 10

### Edge Cases

- ✅ Division by zero handling
- ✅ Multiple operator presses
- ✅ Repeated equals operations
- ✅ Delete at empty state
- ✅ Large number overflow
- ✅ Floating point precision

### Theme Functionality

- ✅ Theme switching works correctly
- ✅ Themes persist after page reload
- ✅ System preference detection works
- ✅ All UI elements update with theme changes

### Responsiveness

- ✅ Mobile layout (375px width)
- ✅ Desktop layout (1440px width)
- ✅ All intermediate screen sizes
- ✅ Touch targets are appropriate size

## 🚀 How to Run

### Option 1: Direct File Opening

1. Clone or download the repository
2. Open `index.html` directly in any modern web browser

### Option 2: Local HTTP Server (Recommended)

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 💡 Implementation Highlights

### Calculator Logic

The calculator uses a clean state-based approach:

- `currentInput`: Currently displayed value
- `previousInput`: Stored value for operations
- `operator`: Selected operation (+, -, ×, ÷)
- `waitingForOperand`: Flag for input state management

### Theme System

CSS custom properties enable efficient theme switching:

```css
:root {
  --main-bg: hsl(222, 26%, 31%);
}
.theme-2 {
  --main-bg: hsl(0, 0%, 90%);
}
```

### Error Handling

Robust error handling for:

- Division by zero → "Cannot divide by zero"
- Number overflow → "Result too large"
- Invalid operations → Graceful recovery

## 🔧 Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Edge 88+

## 📝 Known Limitations

- Very long decimal results may be truncated for display
- Scientific notation used for very large/small numbers
- Theme persistence requires localStorage (gracefully degrades)

## 🏗️ Future Enhancements

- Memory functions (M+, M-, MR, MC)
- History/previous calculations
- Additional mathematical operations
- Custom theme creation
- Sound effects for button presses

---

**Challenge by [Frontend Mentor](https://www.frontendmentor.io)**  
**Coded by [Rob Simpson](https://github.com/pertrai1)**
