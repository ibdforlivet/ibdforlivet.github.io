<template>
  <div class="recipes">
    <div class="container">
      <header class="recipes-header">
        <h1>{{ pageTitle }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </header>

      <section class="filters">
        <div class="filters-left">
          <div class="custom-dropdown" ref="categoryDropdown">
            <div 
              class="dropdown-trigger"
              @click="toggleDropdown"
              :class="{ 'active': isDropdownOpen }"
            >
              <div class="selected-categories">
                <span v-if="selectedCategories.length === 0" class="placeholder">
                  All Categories
                </span>
                <span v-else class="selection-count">
                  {{ selectedCategories.length === 1 ? '1 category selected' : `${selectedCategories.length} categories selected` }}
                </span>
              </div>
              <div class="dropdown-arrow" :class="{ 'rotated': isDropdownOpen }">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <div 
              v-if="isDropdownOpen" 
              class="dropdown-menu"
              @click.stop
            >
              <div class="dropdown-header">
                <span class="dropdown-title">Select Categories</span>
                <button 
                  v-if="selectedCategories.length > 0"
                  @click="clearAllCategories"
                  class="clear-all-btn"
                >
                  Clear All
                </button>
              </div>
              
              <div class="dropdown-options">
                <div 
                  v-for="category in categories" 
                  :key="category"
                  class="dropdown-option"
                  @click="toggleCategory(category)"
                >
                  <div class="option-content">
                    <div 
                      class="category-color-dot"
                      :style="{ backgroundColor: getCategoryColor(category) }"
                    ></div>
                    <span class="category-name">{{ category }}</span>
                  </div>
                  <div class="checkbox-container">
                    <input 
                      type="checkbox" 
                      :checked="selectedCategories.includes(category)"
                      class="category-checkbox"
                      readonly
                    >
                    <div class="custom-checkbox"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-search">
            <input 
              id="search" 
              type="text" 
              v-model="searchTerm" 
              @input="filterRecipes"
              placeholder="Search recipes, categories, ingredients..."
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
        <div v-if="loading" class="loading-state">
          <p>Loading delicious recipes...</p>
        </div>
        
        <div v-else-if="recipes.length === 0" class="empty-state">
          <p>No recipes found. Add some recipes in the admin panel!</p>
        </div>
        
        <div v-else-if="filteredRecipes.length === 0" class="empty-state">
          <p>No recipes match your current filters. Try adjusting your search.</p>
        </div>
        
        <transition-group v-else name="recipe-filter" tag="div" class="recipe-grid-container">
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
import { getAllRecipes, getFavoriteCount, isFavorite } from '../data/firebaseRecipeService.js'
import { getCategories } from '../firebase/recipeService.js'
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
      selectedCategories: [],
      searchTerm: '',
      showFavoritesOnly: false,
      recipes: [],
      loading: true,
      categoryData: [],
      isDropdownOpen: false
    }
  },
  computed: {
    categories() {
      const allCategories = []
      this.recipes.forEach(recipe => {
        if (Array.isArray(recipe.categories)) {
          allCategories.push(...recipe.categories)
        } else if (recipe.category) {
          allCategories.push(recipe.category)
        }
      })
      return [...new Set(allCategories)].sort()
    },
    favoriteCount() {
      // Only count favorites that actually exist in current recipes
      return this.recipes.filter(recipe => isFavorite(recipe.id)).length
    },
    filteredRecipes() {
      let filtered = this.recipes

      if (this.showFavoritesOnly) {
        filtered = filtered.filter(recipe => isFavorite(recipe.id))
      }

      if (this.selectedCategories.length > 0) {
        filtered = filtered.filter(recipe => {
          const recipeCategories = Array.isArray(recipe.categories) 
            ? recipe.categories 
            : recipe.category ? [recipe.category] : []
          
          // Check if recipe has ANY of the selected categories (OR logic)
          return this.selectedCategories.some(selectedCat => 
            recipeCategories.includes(selectedCat)
          )
        })
      }

      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase()
        filtered = filtered.filter(recipe => {
          // Search in recipe name and description
          const nameMatch = recipe.name.toLowerCase().includes(searchLower)
          const descMatch = recipe.description.toLowerCase().includes(searchLower)
          
          // Search in categories (handle both single category and multiple categories)
          let categoryMatch = false
          if (Array.isArray(recipe.categories)) {
            categoryMatch = recipe.categories.some(cat => 
              cat.toLowerCase().includes(searchLower)
            )
          } else if (recipe.category) {
            categoryMatch = recipe.category.toLowerCase().includes(searchLower)
          }
          
          // Search in ingredients if they exist
          let ingredientMatch = false
          if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
            ingredientMatch = recipe.ingredients.some(ingredient => 
              ingredient.toLowerCase().includes(searchLower)
            )
          }
          
          return nameMatch || descMatch || categoryMatch || ingredientMatch
        })
      }

      return filtered
    }
  },
  methods: {
    filterRecipes() {
      // This method is called when filters change
      // The computed property handles the actual filtering
    },
    getCategoryColor(categoryName) {
      const category = this.categoryData.find(cat => cat.name === categoryName)
      return category ? category.color || '#667eea' : '#667eea'
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    toggleCategory(category) {
      const index = this.selectedCategories.indexOf(category)
      if (index > -1) {
        this.selectedCategories.splice(index, 1)
      } else {
        this.selectedCategories.push(category)
      }
      this.filterRecipes()
    },
    clearAllCategories() {
      this.selectedCategories = []
      this.filterRecipes()
    },
    handleClickOutside(event) {
      if (this.$refs.categoryDropdown && !this.$refs.categoryDropdown.contains(event.target)) {
        this.isDropdownOpen = false
      }
    }
  },
  async mounted() {
    try {
      this.recipes = await getAllRecipes()
      this.categoryData = await getCategories()
      console.log('Recipes loaded:', this.recipes.length)
    } catch (error) {
      console.error('Error loading recipes:', error)
    } finally {
      this.loading = false
    }
    
    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside)
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

/* Custom Multi-Select Dropdown */
.custom-dropdown {
  position: relative;
  min-width: 280px;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  border: 2px solid var(--neutral-medium-gray);
  border-radius: 28px;
  background-color: var(--neutral-warm-white);
  color: var(--neutral-charcoal);
  font-family: var(--font-body);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(44, 42, 38, 0.06);
}

.dropdown-trigger:hover,
.dropdown-trigger.active {
  border-color: var(--primary-green);
  box-shadow: 0 4px 16px rgba(122, 139, 87, 0.15);
  transform: translateY(-1px);
}

.selected-categories {
  flex: 1;
  display: flex;
  align-items: center;
}

.placeholder {
  color: var(--neutral-charcoal);
}

.selection-count {
  color: var(--primary-green);
  font-weight: 500;
  font-size: 0.95rem;
}

.dropdown-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  color: var(--neutral-dark-gray);
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--neutral-warm-white);
  border: 2px solid var(--neutral-medium-gray);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(44, 42, 38, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--neutral-light-gray);
}

.dropdown-title {
  font-weight: 600;
  color: var(--neutral-charcoal);
  font-size: 0.9rem;
}

.clear-all-btn {
  background: none;
  border: none;
  color: var(--primary-green);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.clear-all-btn:hover {
  background: rgba(122, 139, 87, 0.1);
}

.dropdown-options {
  padding: 0.5rem 0;
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-option:hover {
  background: rgba(122, 139, 87, 0.05);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-name {
  font-weight: 500;
  color: var(--neutral-charcoal);
}

.checkbox-container {
  position: relative;
}

.category-checkbox {
  opacity: 0;
  position: absolute;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--neutral-medium-gray);
  border-radius: 4px;
  background: white;
  position: relative;
  transition: all 0.2s ease;
}

.dropdown-option:hover .custom-checkbox {
  border-color: var(--primary-green);
}

.category-checkbox:checked + .custom-checkbox {
  background: var(--primary-green);
  border-color: var(--primary-green);
}

.category-checkbox:checked + .custom-checkbox::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
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

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.loading-state {
  color: var(--primary-green);
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