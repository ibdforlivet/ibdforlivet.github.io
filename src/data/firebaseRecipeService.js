// New Firebase-based recipe service
import { getRecipes, getFeaturedRecipes, searchRecipes } from '../firebase/recipeService.js'

// Cache for recipes to avoid repeated Firebase calls
let recipesCache = null
let cacheTimestamp = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to convert recipe name to kebab-case slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-') // Remove leading/trailing hyphens
}

// Favorites management (still local)
let favorites = JSON.parse(localStorage.getItem('recipeFavorites') || '[]')

const saveFavorites = () => {
  localStorage.setItem('recipeFavorites', JSON.stringify(favorites))
}

// Get recipes with caching
const getCachedRecipes = async () => {
  const now = Date.now()
  
  if (recipesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return recipesCache
  }
  
  try {
    recipesCache = await getRecipes()
    cacheTimestamp = now
    return recipesCache
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

// Clear cache when needed
export const clearRecipeCache = () => {
  recipesCache = null
  cacheTimestamp = null
}

// Recipe retrieval functions
export const getAllRecipes = async () => {
  return await getCachedRecipes()
}

export const getFeaturedRecipesService = async () => {
  try {
    return await getFeaturedRecipes()
  } catch (error) {
    console.error('Error fetching featured recipes:', error)
    return []
  }
}

export const getRecipeById = async (id) => {
  const recipes = await getCachedRecipes()
  return recipes.find(recipe => recipe.id === id)
}

export const getRecipeBySlug = async (slug) => {
  const recipes = await getCachedRecipes()
  return recipes.find(recipe => createSlug(recipe.name) === slug)
}

export const getRecipeSlug = (recipeOrId) => {
  // Handle both recipe object and recipe ID
  if (typeof recipeOrId === 'object' && recipeOrId.name) {
    return createSlug(recipeOrId.name)
  } else {
    // For ID-based lookup, we'd need to fetch the recipe first
    // This is handled in components that have the recipe object
    return null
  }
}

export const searchRecipesService = async (searchTerm) => {
  try {
    return await searchRecipes(searchTerm)
  } catch (error) {
    console.error('Error searching recipes:', error)
    return []
  }
}

export const getFavoriteRecipes = async () => {
  const recipes = await getCachedRecipes()
  return recipes.filter(recipe => favorites.includes(recipe.id))
}

// Favorites management functions (unchanged)
export const isFavorite = (recipeId) => {
  return favorites.includes(recipeId)
}

export const toggleFavorite = (recipeId) => {
  const index = favorites.indexOf(recipeId)
  
  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(recipeId)
  }
  
  saveFavorites()
  return favorites.includes(recipeId)
}

export const getFavoriteCount = async () => {
  // Only count favorites that actually exist in current recipes
  const recipes = await getCachedRecipes()
  const validFavorites = favorites.filter(favId => 
    recipes.some(recipe => recipe.id === favId)
  )
  
  // Clean up invalid favorites from localStorage
  if (validFavorites.length !== favorites.length) {
    favorites = validFavorites
    saveFavorites()
  }
  
  return validFavorites.length
}