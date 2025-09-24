# Recipe Paradise

A beautiful Vue 3 application built with Vite and Vue Router, featuring a collection of recipes with a modern, responsive design.

## Features

- 🏠 **Home Page** - Welcome page with hero section, feature highlights, and featured recipes
- 📖 **About Page** - Information about the platform, team, and mission
- 🍽️ **Recipes Page** - Interactive recipe collection with filtering and search functionality
- 📄 **Individual Recipe Pages** - Detailed recipe views with interactive ingredients and instructions
- 🧭 **Navigation** - Responsive navigation menu with active route highlighting
- 📱 **Responsive Design** - Mobile-friendly layout that works on all devices
- 🔍 **Search & Filter** - Find recipes by name, category, or keywords
- ✅ **Interactive Cooking** - Check off ingredients and steps while cooking

## Tech Stack

- **Vue 3** - Progressive JavaScript framework using Options API
- **Vite** - Next generation frontend build tool
- **Vue Router 4** - Official router for Vue.js
- **CSS3** - Modern styling with Grid and Flexbox

## Project Structure

```
src/
├── components/          # Reusable Vue components
├── data/               # Shared data and utilities
│   └── recipes.js      # Recipe data and helper functions
├── views/              # Page components
│   ├── Home.vue        # Landing page with featured recipes
│   ├── About.vue       # About page
│   ├── Recipes.vue     # Recipe collection page
│   └── RecipePage.vue  # Individual recipe detail page
├── router/             # Vue Router configuration
│   └── index.js        # Route definitions
├── App.vue             # Root component with navigation
└── main.js             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Pages Overview

### Home Page
- Hero section with call-to-action buttons
- Feature highlights showcasing platform benefits
- Featured recipes section with clickable cards
- Modern gradient design with responsive layout

### About Page
- Company story and mission
- Team member profiles
- Platform statistics
- Responsive grid layout with sidebar

### Recipes Page
- Interactive recipe cards with hover effects
- Search and category filtering
- Recipe cards link to individual recipe pages
- Responsive grid layout

### Individual Recipe Pages
- Detailed recipe information with large emoji icons
- Interactive ingredients checklist
- Step-by-step instructions with progress tracking
- Print and share functionality
- Responsive design with mobile optimization

## Development

This project uses Vue 3 with the Options API for a more traditional Vue development experience. Each component is self-contained with template, script, and scoped styles.

### Adding New Recipes

To add new recipes to the collection, edit the `recipes` array in `src/views/Recipes.vue`:

```javascript
{
  id: 5,
  name: 'New Recipe Name',
  description: 'Recipe description',
  category: 'Category',
  prepTime: '10 mins',
  cookTime: '20 mins',
  servings: 4,
  difficulty: 'Easy',
  ingredients: ['ingredient 1', 'ingredient 2'],
  instructions: ['step 1', 'step 2']
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
