<template>
  <div class="recipes">
    <div class="container">
      <header class="recipes-header">
        <h1>{{ pageTitle }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </header>

      <section class="filters">
        <div class="filters-left">
          <div class="filter-dropdown">
            <select id="category" v-model="selectedCategory" @change="filterRecipes">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div class="filter-search">
            <input 
              id="search" 
              type="text" 
              v-model="searchTerm" 
              @input="filterRecipes"
              placeholder="Search recipes..."
            />
          </div>
        </div>

        <div class="filters-right">
          <label class="favorites-toggle" :class="{ 'active': showFavoritesOnly }">
            <input 
              type="checkbox" 
              v-model="showFavoritesOnly"
              @change="filterRecipes"
            />
            <div class="heart-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span class="toggle-text">
              Favorites Only ({{ favoriteCount }})
            </span>
          </label>
        </div>
      </section>

      <section class="recipes-grid">
        <transition-group name="recipe-filter" tag="div" class="recipe-grid-container">
          <RecipeCard
            v-for="recipe in filteredRecipes" 
            :key="recipe.id"
            :recipe="recipe"
            :show-favorite-indicator="true"
            :show-category="true"
          />
        </transition-group>
      </section>
    </div>
  </div>
</template>

<script>
import { getAllRecipes, getFavoriteCount, isFavorite } from '../data/recipeService.js'
import RecipeCard from '../components/RecipeCard.vue'

export default {
  name: 'Recipes',
  components: {
    RecipeCard
  },
  data() {
    return {
      pageTitle: 'Recipe Collection',
      subtitle: 'Discover delicious recipes for every occasion',
      selectedCategory: '',
      searchTerm: '',
      showFavoritesOnly: false,
      recipes: []
    }
  },
  computed: {
    categories() {
      return [...new Set(this.recipes.map(recipe => recipe.category))]
    },
    favoriteCount() {
      return getFavoriteCount()
    },
    filteredRecipes() {
      let filtered = this.recipes

      if (this.showFavoritesOnly) {
        filtered = filtered.filter(recipe => isFavorite(recipe.id))
      }

      if (this.selectedCategory) {
        filtered = filtered.filter(recipe => recipe.category === this.selectedCategory)
      }

      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase()
        filtered = filtered.filter(recipe => 
          recipe.name.toLowerCase().includes(searchLower) ||
          recipe.description.toLowerCase().includes(searchLower)
        )
      }

      return filtered
    }
  },
  methods: {
    filterRecipes() {
      // This method is called when filters change
      // The computed property handles the actual filtering
    }
  },
  mounted() {
    this.recipes = getAllRecipes()
    console.log('Recipes page mounted')
  }
}
</script>

<style scoped>
.recipes {
  min-height: 100vh;
  padding: 60px 0;
  background-color: var(--neutral-cream);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.recipes-header {
  text-align: center;
  margin-bottom: 60px;
}

.recipes-header h1 {
  font-family: var(--font-display);
  font-size: clamp(3rem, 5vw, 4rem);
  color: var(--primary-green-dark);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 400;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  padding: 0;
}

.filters-left {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.filters-right {
  display: flex;
  align-items: center;
}

.filter-dropdown select,
.filter-search input {
  padding: 0.875rem 1.5rem;
  border: 2px solid var(--neutral-medium-gray);
  border-radius: 28px;
  font-size: 1rem;
  background-color: var(--neutral-warm-white);
  color: var(--neutral-charcoal);
  font-family: var(--font-body);
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(44, 42, 38, 0.06);
  min-width: 200px;
}

.filter-dropdown select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 3rem;
}

.filter-dropdown select:focus,
.filter-search input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 4px 16px rgba(122, 139, 87, 0.15);
  transform: translateY(-1px);
}

.filter-search input::placeholder {
  color: var(--neutral-dark-gray);
  opacity: 0.7;
}

.favorites-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.875rem 1.5rem;
  border-radius: 28px;
  transition: all 0.3s ease;
  background: transparent;
  border: 2px solid var(--neutral-medium-gray);
  font-family: var(--font-body);
  font-weight: 500;
  color: var(--neutral-charcoal);
  box-shadow: 0 2px 8px rgba(44, 42, 38, 0.06);
}

.favorites-toggle:hover {
  border-color: var(--accent-coral);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(241, 138, 118, 0.15);
}

.favorites-toggle.active {
  background: var(--accent-coral);
  border-color: var(--accent-coral);
  color: var(--neutral-warm-white);
  box-shadow: 0 4px 16px rgba(241, 138, 118, 0.25);
}

.favorites-toggle input[type="checkbox"] {
  display: none;
}

.heart-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.favorites-toggle.active .heart-icon svg {
  fill: currentColor;
  stroke: currentColor;
}

.toggle-text {
  font-size: 0.95rem;
  letter-spacing: 0.025em;
}

.recipes-grid {
  margin-bottom: 40px;
}

.recipe-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Recipe filter transitions */
.recipe-filter-enter-active {
  transition: all 0.6s ease;
}

.recipe-filter-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  z-index: 0;
}

.recipe-filter-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.recipe-filter-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.recipe-filter-move {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Ensure smooth repositioning during transitions */
.recipe-grid-container > * {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@media (max-width: 768px) {
  .recipes-header h1 {
    font-size: 2.5rem;
  }
  
  .filters {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
    padding: 0 0.5rem;
  }
  
  .filters-left {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filters-right {
    justify-content: center;
  }
  
  .filter-dropdown select,
  .filter-search input {
    min-width: 100%;
  }
  
  .favorites-toggle {
    justify-content: center;
  }
}
</style>