<template>
  <div class="home">
    <header class="hero">
      <div class="hero-content">
        <h1>{{ title }}</h1>
        <p class="hero-description">{{ description }}</p>
        <div class="hero-actions">
          <router-link to="/recipes" class="btn btn-primary">Explore Recipes</router-link>
          <router-link to="/about" class="btn btn-secondary">Learn More</router-link>
        </div>
      </div>
    </header>

    <section class="featured-recipes">
      <div class="container">
        <h2>Featured Recipes</h2>
        <p class="section-subtitle">Try these amazing recipes from our collection</p>
        <div class="recipe-grid">
          <RecipeCard
            v-for="recipe in featuredRecipes" 
            :key="recipe.id"
            :recipe="recipe"
            :show-favorite-indicator="true"
            :show-category="false"
            class=""
          />
        </div>
        <div class="more-recipes">
          <router-link to="/recipes" class="btn btn-primary">
            View All Recipes
          </router-link>
        </div>
      </div>
    </section>

        <section class="features">
      <div class="container">
        <h2>Why Choose Our Platform?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>Curated Recipes</h3>
            <p>Handpicked recipes from professional chefs and home cooks.</p>
          </div>
          <div class="feature-card">
            <h3>Easy to Follow</h3>
            <p>Step-by-step instructions with helpful tips and photos.</p>
          </div>
          <div class="feature-card">
            <h3>Community Driven</h3>
            <p>Share your own recipes and connect with fellow food lovers.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { getFeaturedRecipes } from '../data/recipeService.js'
import RecipeCard from '../components/RecipeCard.vue'

export default {
  name: 'Home',
  components: {
    RecipeCard
  },
  data() {
    return {
      title: 'Welcome to Recipe Paradise',
      description: 'Discover amazing recipes, share your culinary creations, and connect with food lovers around the world.',
      featuredRecipes: []
    }
  },
  mounted() {
    this.featuredRecipes = getFeaturedRecipes()
    console.log('Home page mounted')
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background-color: var(--neutral-cream);
  background-image: 
    linear-gradient(135deg, rgba(122, 139, 87, 0.05) 0%, rgba(164, 180, 148, 0.1) 100%),
    url('https://images.unsplash.com/photo-1614548539644-ef528186523a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGZvb2QlMjBvbiUyMGElMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D');
  color: var(--text-primary);
  text-align: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-content {
  max-width: 800px;
  z-index: 2;
}

.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--primary-green-dark);
  text-shadow: 0 2px 4px rgba(44, 42, 38, 0.1);
}

.hero-description {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
  color: var(--text-secondary);
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  padding: 100px 0;
  background-color: var(--neutral-warm-white);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.features h2 {
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  margin-bottom: 4rem;
  color: var(--primary-green-dark);
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--neutral-cream);
  padding: 3rem 2rem;
  border-radius: 20px;
  border: 1px solid var(--neutral-medium-gray);
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green) 0%, var(--accent-sage) 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(122, 139, 87, 0.15);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card h3 {
  font-family: var(--font-display);
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--primary-green-dark);
  font-weight: 600;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1.1rem;
}

.featured-recipes {
  padding: 100px 0;
  background-color: var(--neutral-light-gray);
}

.featured-recipes h2 {
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  margin-bottom: 1rem;
  color: var(--primary-green-dark);
  font-weight: 600;
}

.section-subtitle {
  text-align: center;
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 4rem;
  font-weight: 400;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.more-recipes {
  text-align: center;
}
</style>