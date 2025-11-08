# Copilot Instructions - Job Listings with Filtering

## Project Overview

This is a **Frontend Mentor challenge** for building a responsive job listings page with filtering functionality. The project is a **vanilla HTML/CSS/JavaScript** implementation with no build tools or frameworks - keep it simple and dependency-free.

## Architecture & Data Flow

- **Static HTML structure**: `index.html` contains placeholder content that should be replaced dynamically
- **JSON data source**: `data.json` contains job listings with structured fields (id, company, logo, position, role, level, languages, tools, etc.)
- **Dynamic rendering**: JavaScript should fetch data.json and replace static HTML content with dynamic job cards
- **Filter system**: Users click filter tags to add/remove filters; only jobs matching ALL active filters should display

## Key Project Patterns

### Data Structure (data.json)

- Each job has `languages[]` and `tools[]` arrays for filtering
- Boolean `new` and `featured` flags affect visual styling
- `logo` paths are relative to `/images/` directory
- Use `id` field for unique identification when rendering

### HTML Structure Convention

The current HTML shows the expected job card structure:

- Company name, "New!" and "Featured" badges
- Position title, posting time, contract type, location
- Filter tags for role, level, languages, and tools
- Reference existing HTML comments for semantic grouping

### Responsive Design Requirements

- **Mobile**: 375px baseline, stack job details vertically
- **Desktop**: 1440px baseline, horizontal layout with filters on right
- Use design files in `/design/` folder for visual reference
- Test responsive behavior between 320px to large screens

### Color System (from style-guide.md)

- **Primary Green**: `hsl(180, 29%, 50%)` for active states
- **Background**: `hsl(180, 52%, 96%)`
- **Text Gray**: `hsl(180, 8%, 52%)`
- **Dark Green**: `hsl(180, 14%, 20%)`

### Typography

- **Font**: League Spartan (Google Fonts)
- **Weights**: 500 (medium), 700 (bold)
- **Base size**: 15px

## Development Workflow

1. **Start with HTML structure**: Create semantic job card components before adding styles
2. **Implement data fetching**: Load `data.json` and render job listings dynamically
3. **Add filtering logic**: Track active filters and implement multi-filter AND logic
4. **Style mobile-first**: Build responsive layout starting from 375px
5. **Test across devices**: Ensure hover states work and filtering is intuitive

## Critical Implementation Notes

- **No build process**: Direct file serving, no bundlers or preprocessors
- **Filter interaction**: Clicking filter tags should toggle them on/off with visual feedback
- **Active filter display**: Show currently applied filters with remove buttons
- **Empty state**: Handle when no jobs match the active filters
- **Performance**: Consider efficient DOM manipulation for large filter operations

## Asset Management

- All company logos are SVG files in `/images/`
- Header background images: `bg-header-desktop.svg` and `bg-header-mobile.svg`
- Remove filter icon: `icon-remove.svg`
- Reference design mockups in `/design/` for pixel-perfect implementation
