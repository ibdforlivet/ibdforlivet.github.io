import { recipes } from './recipesData.js'

// Helper function to convert recipe name to kebab-case slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-') // Remove leading/trailing hyphens
}

// Favorites management
let favorites = JSON.parse(localStorage.getItem('recipeFavorites') || '[]')

const saveFavorites = () => {
  localStorage.setItem('recipeFavorites', JSON.stringify(favorites))
}

// Recipe retrieval functions
export const getFeaturedRecipes = () => {
  return recipes.filter(recipe => recipe.featured)
}

export const getRecipeById = (id) => {
  return recipes.find(recipe => recipe.id === parseInt(id))
}

export const getRecipeBySlug = (slug) => {
  return recipes.find(recipe => createSlug(recipe.name) === slug)
}

export const getRecipeSlug = (recipeOrId) => {
  // Handle both recipe object and recipe ID
  if (typeof recipeOrId === 'object' && recipeOrId.name) {
    return createSlug(recipeOrId.name)
  } else {
    // It's an ID, find the recipe first
    const recipe = recipes.find(r => r.id === recipeOrId)
    return recipe ? createSlug(recipe.name) : null
  }
}

export const getAllRecipes = () => {
  return recipes
}

export const getFavoriteRecipes = () => {
  return recipes.filter(recipe => favorites.includes(recipe.id))
}

// Favorites management functions
export const isFavorite = (recipeId) => {
  return favorites.includes(parseInt(recipeId))
}

export const toggleFavorite = (recipeId) => {
  const id = parseInt(recipeId)
  const index = favorites.indexOf(id)
  
  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(id)
  }
  
  saveFavorites()
  return favorites.includes(id)
}

export const getFavoriteCount = () => {
  return favorites.length
}