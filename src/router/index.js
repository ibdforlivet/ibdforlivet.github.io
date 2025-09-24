import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Recipes from '../views/Recipes.vue'
import RecipePage from '../views/RecipePage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: Recipes
  },
  {
    path: '/recipe/:slug',
    name: 'RecipePage',
    component: RecipePage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (back/forward buttons), use it
    if (savedPosition) {
      return savedPosition
    }
    // Otherwise, scroll to top
    return { top: 0 }
  }
})

export default router