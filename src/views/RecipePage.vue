<template>
  <div class="recipe-page">
    <div v-if="loading" class="loading-container">
      <div class="loading-state">
        <p>Loading recipe...</p>
      </div>
    </div>
    
    <div v-else-if="recipe">
      <!-- Recipe Header -->
      <header class="recipe-header">
        <!-- <div class="container">
          <button @click="goBack" class="back-button">
            ← Back to Recipes
          </button>
        </div> -->
        
        <div class="recipe-hero">
          <!-- Full-width background stage -->
          <div class="hero-stage">
            <div class="stage-image">
              <img :src="recipe.image" alt="Recipe Image" />
            </div>
            <div class="stage-overlay"></div>
          </div>
        </div>
        
        <!-- Clean recipe intro -->
        <div class="recipe-intro">
          <div class="intro-content">
            <h1>{{ recipe.name }}</h1>
            <p class="recipe-description">{{ recipe.description }}</p>
            
            <div class="recipe-tags">
              <!-- Display multiple categories -->
              <template v-if="Array.isArray(recipe.categories)">
                <span 
                  v-for="category in recipe.categories" 
                  :key="category"
                  class="tag category-tag"
                  :style="{ backgroundColor: getCategoryColor(category) }"
                >
                  {{ category }}
                </span>
              </template>
              <span 
                v-else-if="recipe.category" 
                class="tag category-tag"
                :style="{ backgroundColor: getCategoryColor(recipe.category) }"
              >
                {{ recipe.category }}
              </span>
              <span v-if="recipe.featured" class="tag featured">Featured</span>
              <button 
                @click="toggleRecipeFavorite" 
                class="favorite-btn tag-heart"
                :class="{ 'active': isRecipeFavorite }"
              >
                <div class="heart-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </button>
            </div>
            
            <div class="recipe-meta-row">
              <div class="recipe-quick-info">
                <div class="info-item">
                  <span class="info-value">{{ recipe.prepTime }}</span>
                  <span class="info-label">Prep Time</span>
                </div>
                <div class="info-item">
                  <span class="info-value">{{ recipe.cookTime }}</span>
                  <span class="info-label">Cook Time</span>
                </div>
                <div class="info-item">
                  <span class="info-value">{{ recipe.difficulty }}</span>
                  <span class="info-label">Difficulty</span>
                </div>
                <div class="info-item servings-adjuster">
                  <div class="serving-controls">
                    <button @click="decreaseServings" class="serving-btn" :disabled="currentServings <= 1">-</button>
                    <span class="info-value">{{ currentServings }}</span>
                    <button @click="increaseServings" class="serving-btn">+</button>
                  </div>
                  <span class="info-label">Servings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Recipe Content -->
      <div class="container">
        <div class="recipe-content">
        <div class="content-grid">
          <!-- Ingredients -->
          <section class="ingredients-section">
            <h2>Ingredients</h2>
            <div class="ingredients-list">
              <div 
                class="ingredient-item" 
                v-for="(ingredient, index) in scaledIngredients" 
                :key="index"
                @click="toggleIngredient(index)"
                :class="{ 'completed': completedIngredients.includes(index) }"
              >
                <div class="ingredient-checkbox">
                  <svg viewBox="0 0 24 24" class="check-icon">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <span class="ingredient-text">{{ ingredient }}</span>
              </div>
            </div>
          </section>

          <!-- Instructions -->
          <section class="instructions-section">
            <h2>Instructions</h2>
            <div class="instructions-list">
              <div 
                class="instruction-item" 
                v-for="(instruction, index) in recipe.instructions" 
                :key="index"
                @click="toggleInstruction(index)"
                :class="{ 'completed': completedInstructions.includes(index) }"
              >
                <div class="step-circle">{{ index + 1 }}</div>
                <span class="instruction-text">{{ instruction }}</span>
              </div>
            </div>
          </section>
        </div>
        </div>


      </div>
    </div>

    <!-- Recipe Not Found -->
    <div v-else class="container">
      <div class="not-found">
        <h1>Recipe Not Found</h1>
        <p>Sorry, we couldn't find the recipe you're looking for.</p>
        <router-link to="/recipes" class="btn btn-primary">
          Browse All Recipes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecipeBySlug, isFavorite, toggleFavorite } from '../data/firebaseRecipeService.js'
import { getCategories } from '../firebase/recipeService.js'

export default {
  name: 'RecipePage',
  data() {
    return {
      recipe: null,
      completedIngredients: [],
      completedInstructions: [],
      isRecipeFavorite: false,
      currentServings: 1,
      loading: true,
      categories: []
    }
  },
  computed: {
    scaledIngredients() {
      if (!this.recipe) return []
      
      const scaleFactor = this.currentServings / this.recipe.servings
      
      return this.recipe.ingredients.map(ingredient => {
        return this.scaleIngredient(ingredient, scaleFactor)
      })
    }
  },
  methods: {
    async loadRecipe() {
      this.loading = true
      try {
        const recipeSlug = this.$route.params.slug
        this.recipe = await getRecipeBySlug(recipeSlug)
        
        if (!this.recipe) {
          console.error('Recipe not found:', recipeSlug)
        } else {
          this.isRecipeFavorite = isFavorite(this.recipe.id)
          this.currentServings = this.recipe.servings
        }
      } catch (error) {
        console.error('Error loading recipe:', error)
      } finally {
        this.loading = false
      }
    },
    scaleIngredient(ingredient, scaleFactor) {
      // Regular expression to find numbers (including decimals and fractions)
      const numberRegex = /(\d+(?:\.\d+)?(?:\/\d+)?|\d+\/\d+)/g
      
      return ingredient.replace(numberRegex, (match) => {
        let num = this.parseNumber(match)
        let scaled = num * scaleFactor
        
        // Round to reasonable precision
        if (scaled < 0.1) {
          scaled = Math.round(scaled * 100) / 100
        } else if (scaled < 1) {
          scaled = Math.round(scaled * 10) / 10
        } else {
          scaled = Math.round(scaled * 4) / 4 // Round to nearest quarter
        }
        
        return this.formatNumber(scaled)
      })
    },
    parseNumber(str) {
      if (str.includes('/')) {
        const parts = str.split('/')
        return parseFloat(parts[0]) / parseFloat(parts[1])
      }
      return parseFloat(str)
    },
    formatNumber(num) {
      // Convert back to fraction if it makes sense
      if (num === 0.25) return '1/4'
      if (num === 0.33) return '1/3'
      if (num === 0.5) return '1/2'
      if (num === 0.67) return '2/3'
      if (num === 0.75) return '3/4'
      
      // For other numbers, use decimal
      if (num % 1 === 0) return num.toString()
      return num.toString()
    },
    increaseServings() {
      this.currentServings++
    },
    decreaseServings() {
      if (this.currentServings > 1) {
        this.currentServings--
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    toggleRecipeFavorite() {
      if (this.recipe) {
        this.isRecipeFavorite = toggleFavorite(this.recipe.id)
      }
    },
    toggleIngredient(index) {
      if (this.completedIngredients.includes(index)) {
        this.completedIngredients = this.completedIngredients.filter(i => i !== index)
      } else {
        this.completedIngredients.push(index)
      }
    },
    toggleInstruction(index) {
      if (this.completedInstructions.includes(index)) {
        this.completedInstructions = this.completedInstructions.filter(i => i !== index)
      } else {
        this.completedInstructions.push(index)
      }
    },
    resetProgress() {
      this.completedIngredients = []
      this.completedInstructions = []
    },
    printRecipe() {
      window.print()
    },
    shareRecipe() {
      if (navigator.share) {
        navigator.share({
          title: this.recipe.name,
          text: this.recipe.description,
          url: window.location.href
        })
      } else {
        // Fallback - copy URL to clipboard
        navigator.clipboard.writeText(window.location.href)
        alert('Recipe URL copied to clipboard!')
      }
    },
    getCategoryColor(categoryName) {
      const category = this.categories.find(cat => cat.name === categoryName)
      return category ? category.color || '#667eea' : '#667eea'
    }
  },
  async mounted() {
    await this.loadRecipe()
    try {
      this.categories = await getCategories()
    } catch (error) {
      console.error('Error loading categories for colors:', error)
    }
  },
  watch: {
    async '$route'() {
      await this.loadRecipe()
      this.resetProgress()
    }
  }
}
</script>

<style scoped>
.recipe-page {
  min-height: 100vh;
  background-color: var(--neutral-cream);
}

.loading-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-state {
  text-align: center;
  color: var(--primary-green);
  font-size: 1.2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.back-button {
  background: none;
  border: none;
  color: var(--primary-green);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 1rem 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  color: var(--primary-green-dark);
  transform: translateX(-4px);
}

.recipe-hero {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%); /* Center and make full width */
  min-height: 500px;
  margin-bottom: 0; /* No extra margin needed */
}

/* Full-width stage background */
.hero-stage {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.stage-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.stage-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.stage-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(102, 126, 234, 0.3) 0%, 
    rgba(118, 75, 162, 0.3) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

/* Clean recipe intro */
.recipe-intro {
  position: relative;
  z-index: 10;
  margin-top: -120px;
  padding-bottom: 4rem;
}

.intro-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem;
  background: var(--neutral-warm-white);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(44, 42, 38, 0.08);
  border: 1px solid var(--neutral-light-gray);
  text-align: center;
}

.recipe-intro h1 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--neutral-charcoal);
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.recipe-description {
  font-size: 1.1rem;
  color: var(--neutral-dark-gray);
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-weight: 400;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.recipe-meta-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;    
}

.recipe-quick-info {
  display: flex;
  gap: 2.5rem;
  align-items: center;
  justify-content: center;
}

.recipe-actions-inline {
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem;
}

.servings-adjuster {
  position: relative;
}

.serving-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.serving-btn {
  background: transparent;
  color: var(--primary-green);
  border: 2px solid var(--primary-green);
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: none;
}

.serving-btn:hover:not(:disabled) {
  background: var(--primary-green);
  color: var(--neutral-warm-white);
  border-color: var(--primary-green);
  transform: scale(1.1);
}

.serving-btn:disabled {
  background: transparent;
  color: var(--neutral-medium-gray);
  border-color: var(--neutral-medium-gray);
  cursor: not-allowed;
  transform: none;
  opacity: 0.6;
}

.info-label {
  font-size: 0.75rem;
  color: var(--neutral-dark-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.info-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-charcoal);
  font-family: var(--font-body);
}

.recipe-actions-inline {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.recipe-tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2.5rem;
  align-items: center;
}

.tag {
  background: var(--accent-sage);
  color: var(--neutral-charcoal);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: var(--font-body);
  letter-spacing: 0.025em;
  border: 1px solid rgba(122, 139, 87, 0.2);
}

.tag.category-tag {
  color: white;
  border: none;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background: var(--category-color, var(--accent-sage));
}

.tag.featured {
  background: transparent;
  color: var(--primary-green);
  border-color: var(--primary-green);
}

.tag.favorited {
  background: var(--primary-green);
  color: var(--neutral-warm-white);
  border-color: var(--primary-green);
}

.favorite-btn.tag-heart {
  background: transparent;
  border: 2px solid var(--neutral-medium-gray);
  color: var(--neutral-charcoal);
  width: 32px;
  height: 32px;
  padding: 0.4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.favorite-btn.tag-heart .heart-icon {
  width: 16px;
  height: 16px;
}

.favorite-btn.tag-heart:hover {
  border-color: var(--accent-coral);
  color: var(--accent-coral);
  transform: scale(1.1);
}

.favorite-btn.tag-heart.active {
  background: var(--accent-coral);
  border-color: var(--accent-coral);
  color: var(--neutral-warm-white);
}

.favorite-btn {
  background: transparent;
  border: 2px solid var(--neutral-medium-gray);
  color: var(--neutral-charcoal);
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: var(--font-body);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.favorite-btn:hover {
  border-color: var(--accent-coral);
  color: var(--accent-coral);
  transform: scale(1.1);
}

.favorite-btn.active {
  background: var(--accent-coral);
  border-color: var(--accent-coral);
  color: var(--neutral-warm-white);
}

.heart-icon {
  width: 18px;
  height: 18px;
}

.heart-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.favorite-btn.active .heart-icon svg {
  fill: currentColor;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  margin-bottom: 3rem;
  margin-top: 0; /* No extra margin needed now */
}

.ingredients-section h2,
.instructions-section h2 {
  color: var(--neutral-charcoal);
  margin-bottom: 2rem;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 600;
  font-family: var(--font-display);
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.ingredients-list,
.instructions-list {
  padding: 0;
}

.ingredient-item,
.instruction-item {
  display: flex;
  align-items: flex-start;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(122, 139, 87, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-body);
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--neutral-charcoal);
}

.ingredient-item:last-child,
.instruction-item:last-child {
  border-bottom: none;
}

.ingredient-item:hover,
.instruction-item:hover {
  padding-left: 1rem;
  background: rgba(122, 139, 87, 0.05);
  border-radius: 8px;
  margin: 0 -1rem;
  padding: 1.25rem 1rem;
}

.ingredient-item.completed,
.instruction-item.completed {
  opacity: 0.6;
}

.ingredient-item.completed .ingredient-text,
.instruction-item.completed .instruction-text {
  text-decoration: line-through;
  color: var(--neutral-dark-gray);
}

.ingredient-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--primary-green);
  border-radius: 6px;
  margin-right: 1.25rem;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  background: transparent;
  cursor: pointer;
}

.ingredient-checkbox:hover {
  background: var(--accent-sage);
}

.ingredient-item.completed .ingredient-checkbox {
  background: var(--primary-green);
  border-color: var(--primary-green);
}

.check-icon {
  width: 14px;
  height: 14px;
  fill: var(--neutral-warm-white);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ingredient-item.completed .check-icon {
  opacity: 1;
}

.step-circle {
  width: 32px;
  height: 32px;
  background: var(--primary-green);
  color: var(--neutral-warm-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin-right: 1.25rem;
  flex-shrink: 0;
  font-size: 0.95rem;
  font-family: var(--font-display);
  transition: all 0.3s ease;
}

.instruction-item.completed .step-circle {
  background: var(--accent-sage);
}

.instruction-item:hover .step-circle {
  transform: scale(1.1);
}

.instruction-text,
.ingredient-text {
  line-height: 1.6;
  color: #333;
}

.recipe-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: #6c757d;
}

.action-btn.secondary:hover {
  background: #5a6268;
}

.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.not-found p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover {
  background-color: #5a6fd8;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .recipe-hero {
    min-height: 400px;
  }
  
  .recipe-intro {
    margin-top: -80px;
  }
  
  .intro-content {
    padding: 2rem 1rem;
  }
  
  .recipe-intro h1 {
    font-size: 2.5rem;
  }
  
  .recipe-meta-row {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  
  .recipe-quick-info {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }
  
  .recipe-actions-inline {
    align-items: center;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media print {
  .back-button,
  .recipe-actions,
  .ingredient-checkbox {
    display: none;
  }
  
  .recipe-page {
    padding: 0;
  }
}
</style>