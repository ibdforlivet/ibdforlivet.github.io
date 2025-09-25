<template>
  <div 
    class="recipe-card" 
    @click="handleClick"
  >
    <div class="recipe-image-container">
      <!-- Background Image -->
      <div class="recipe-image">
        <img v-if="recipe.image && (recipe.image.startsWith('http') || recipe.image.startsWith('/src/'))" :src="recipe.image" :alt="recipe.name" />
        <div v-else class="recipe-emoji-bg">{{ recipe.image }}</div>
      </div>
      
      <!-- Overlay Gradient -->
      <div class="recipe-overlay"></div>
      
      <!-- Content Overlay -->
      <div class="recipe-overlay-content">
        <!-- Centered Title -->
        <div class="recipe-title-container">
          <h3 class="recipe-title">{{ recipe.name }}</h3>
        </div>
        
        <!-- Bottom Content -->
        <div class="recipe-bottom-content">
          <div class="recipe-tags">
            <span class="recipe-time">{{ recipe.cookTime }}</span>
            <span class="recipe-difficulty">{{ recipe.difficulty }}</span>
            <span v-if="showCategory" class="recipe-category">{{ recipe.category }}</span>
          </div>
        </div>
      </div>
      
      <!-- Favorite indicator -->
      <div v-if="showFavoriteIndicator" 
           class="favorite-indicator" 
           :class="{ 'favorited': isFavorite(recipe.id) }"
           @click.stop="toggleFavoriteStatus">
        <svg viewBox="0 0 24 24" class="heart-icon">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { isFavorite, getRecipeSlug, toggleFavorite } from '../data/recipeService.js'

export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    },
    showFavoriteIndicator: {
      type: Boolean,
      default: true
    },
    showCategory: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    isFavorite(recipeId) {
      return isFavorite(recipeId)
    },
    handleClick() {
      const slug = getRecipeSlug(this.recipe.id)
      this.$router.push(`/recipe/${slug}`)
    },
    toggleFavoriteStatus() {
      toggleFavorite(this.recipe.id)
      // Force reactivity update
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.recipe-card {
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(44, 42, 38, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease;
  height: 400px;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(122, 139, 87, 0.25);
}

.recipe-card:hover .recipe-overlay {
  /* background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 100%
  ); */
  background: linear-gradient(to bottom, rgb(213 213 213 / 31%) 100%)
}

.recipe-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.recipe-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-green-light) 0%, var(--accent-sage) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-emoji-bg {
  font-size: 4rem;
  opacity: 0.8;
}

.recipe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.05) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.7) 100%
  ); */
  background: linear-gradient(to bottom, rgb(213 213 213 / 31%) 100%);
  transition: all 0.4s ease;
  z-index: 1;
}

.recipe-overlay-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  z-index: 2;
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0;
  justify-content: center;
}

.recipe-tags span {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 400;
  font-family: var(--font-body);
  letter-spacing: 0.025em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  /* text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); */
}

.recipe-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.recipe-title {
  font-family: var(--font-display);
  color: var(--neutral-warm-white);
  margin: 0;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-align: center;
}

.recipe-bottom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
}





.favorite-indicator {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 3;
  transition: all 0.3s ease;
  cursor: pointer;
}

.heart-icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: white;
  stroke-width: 2;
  transition: all 0.3s ease;
}

.favorite-indicator.favorited {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(255, 255, 255, 1);
}

.favorite-indicator.favorited .heart-icon {
  fill: #e74c3c;
  stroke: #e74c3c;
}

.favorite-indicator:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.9);
}

.favorite-indicator:hover .heart-icon {
  stroke: #e74c3c;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .recipe-card {
    height: 350px;
  }
  
  .recipe-overlay-content {
    padding: 1.25rem;
  }
  
  .recipe-title {
    font-size: 1.4rem;
  }
  
  .recipe-tags span {
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
  }
}

/* Variations for different contexts */
.recipe-card.compact {
  height: 300px;
}

.recipe-card.large {
  height: 450px;
}
</style>