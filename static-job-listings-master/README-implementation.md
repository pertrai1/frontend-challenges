# Job Listings with Filtering - Modern Implementation

A responsive job listings page with filtering functionality built using modern HTML/CSS/JavaScript and modular web components.

## 🚀 Features

- **Modern Web Components**: Modular, reusable components using native Web Components API
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Advanced Filtering**: Multi-filter logic with AND operation (all selected filters must match)
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Efficient DOM manipulation and debounced interactions
- **Modern CSS**: CSS Custom Properties, CSS Grid, and modern layout techniques

## 🏗️ Architecture

### Component Structure

```
components/
├── FilterTag.js      # Individual filter tag component
├── JobCard.js        # Job listing card component
├── FilterBar.js      # Active filters display and management
└── JobListings.js    # Main container for job cards and data fetching
```

### Web Components

- **`<filter-tag>`**: Clickable filter tags that emit add/remove events
- **`<job-card>`**: Individual job listing with company info and filter tags
- **`<filter-bar>`**: Shows active filters with remove buttons
- **`<job-listings>`**: Fetches data and renders filtered job cards

### Event-Driven Architecture

- Custom events for filter add/remove operations
- Centralized state management through event bubbling
- Loose coupling between components

## 🎨 Design System

### CSS Custom Properties

```css
--primary-green: hsl(180, 29%, 50%)
--background: hsl(180, 52%, 96%)
--dark-gray-cyan: hsl(180, 8%, 52%)
--very-dark-gray-cyan: hsl(180, 14%, 20%)
```

### Typography

- **Font**: League Spartan (Google Fonts)
- **Weights**: 500 (medium), 700 (bold)
- **Base Size**: 15px

### Responsive Breakpoints

- **Mobile**: 375px baseline
- **Desktop**: 1440px baseline
- **Range**: Tested 320px to large screens

## 🔧 Implementation Details

### Data Structure

Each job in `data.json` contains:

- `languages[]` and `tools[]` arrays for filtering
- Boolean `new` and `featured` flags for styling
- Logo paths relative to `/images/` directory

### Filtering Logic

- **Multi-filter AND logic**: Jobs must match ALL active filters
- **Filter categories**: Role, Level, Languages, Tools
- **Real-time updates**: Instant filtering without page reload

### Performance Optimizations

- Efficient array filtering using `Array.every()`
- Event delegation for dynamic content
- Debounced interactions in app utilities
- Minimal DOM manipulation

## 🚀 Getting Started

1. **Clone and Navigate**

   ```bash
   cd static-job-listings-master
   ```

2. **Serve Locally**

   ```bash
   python3 -m http.server 8080
   # or
   npx serve .
   ```

3. **Open Browser**
   Navigate to `http://localhost:8080`

## 📱 Usage

### Adding Filters

- Click any filter tag (Role, Level, Language, or Tool) on job cards
- Filter appears in the filter bar at the top
- Job list updates to show only matching jobs

### Removing Filters

- Click the ❌ button on any active filter tag
- Or click "Clear" to remove all filters
- Press `Escape` key to clear all filters

### Keyboard Navigation

- `Tab` to navigate between interactive elements
- `Enter` or `Space` to activate filter tags
- `Escape` to clear all filters
- `Arrow Left/Right` to navigate between filter tags

## 🧪 Browser Support

- **Modern Browsers**: Chrome 67+, Firefox 63+, Safari 10.1+, Edge 79+
- **Web Components**: Native support (no polyfills required)
- **CSS Grid**: Full support in target browsers
- **ES6 Modules**: Native module loading

## 📁 File Structure

```
├── index.html              # Main HTML file
├── styles.css              # Global styles and design system
├── data.json              # Job listings data
├── components/            # Web Components
│   ├── FilterTag.js
│   ├── JobCard.js
│   ├── FilterBar.js
│   └── JobListings.js
├── js/
│   └── app.js            # Main application logic
├── images/               # SVG assets and logos
└── design/               # Design reference files
```

## 🎯 Key Features Implemented

✅ **Responsive Design** - Mobile-first with desktop enhancements  
✅ **Web Components** - Modular, reusable component architecture  
✅ **Advanced Filtering** - Multi-filter AND logic with real-time updates  
✅ **Accessibility** - WCAG compliant with keyboard navigation  
✅ **Modern CSS** - CSS Custom Properties, Grid, and Flexbox  
✅ **Error Handling** - Graceful fallbacks for network issues  
✅ **Performance** - Efficient rendering and state management

## 🔮 Future Enhancements

- **Search Functionality**: Text search within job listings
- **Sort Options**: Sort by date, company, or relevance
- **Favorites**: Save interesting job listings
- **URL State**: Shareable URLs with active filters
- **PWA Features**: Offline support and app installation

---

Built with ❤️ using modern web standards and best practices.
