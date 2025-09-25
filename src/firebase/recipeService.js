import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from './config.js'

// Collection names
const RECIPES_COLLECTION = 'recipes'
const CATEGORIES_COLLECTION = 'categories'

// Upload image to Firebase Storage
export const uploadRecipeImage = async (file, recipeId) => {
  try {
    const timestamp = Date.now()
    const fileName = `recipes/${recipeId}_${timestamp}_${file.name}`
    const storageRef = ref(storage, fileName)
    
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Delete image from Firebase Storage
export const deleteRecipeImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw error for image deletion failures
  }
}

// Add new recipe to Firestore
export const addRecipe = async (recipeData) => {
  try {
    const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
      ...recipeData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding recipe:', error)
    throw error
  }
}

// Get all recipes from Firestore
export const getRecipes = async () => {
  try {
    const q = query(collection(db, RECIPES_COLLECTION), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const recipes = []
    querySnapshot.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return recipes
  } catch (error) {
    console.error('Error getting recipes:', error)
    throw error
  }
}

// Update recipe in Firestore
export const updateRecipe = async (recipeId, recipeData) => {
  try {
    const recipeRef = doc(db, RECIPES_COLLECTION, recipeId)
    await updateDoc(recipeRef, {
      ...recipeData,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating recipe:', error)
    throw error
  }
}

// Delete recipe from Firestore
export const deleteRecipe = async (recipeId, imageUrl) => {
  try {
    // Delete image if exists
    if (imageUrl) {
      await deleteRecipeImage(imageUrl)
    }
    
    // Delete recipe document
    await deleteDoc(doc(db, RECIPES_COLLECTION, recipeId))
  } catch (error) {
    console.error('Error deleting recipe:', error)
    throw error
  }
}

// Get featured recipes
export const getFeaturedRecipes = async () => {
  try {
    const recipes = await getRecipes()
    return recipes.filter(recipe => recipe.featured)
  } catch (error) {
    console.error('Error getting featured recipes:', error)
    throw error
  }
}

// Search recipes
export const searchRecipes = async (searchTerm) => {
  try {
    const recipes = await getRecipes()
    const lowercaseSearch = searchTerm.toLowerCase()
    
    return recipes.filter(recipe => {
      // Search in name and description
      const nameMatch = recipe.name.toLowerCase().includes(lowercaseSearch)
      const descMatch = recipe.description.toLowerCase().includes(lowercaseSearch)
      
      // Search in categories (handle both single category and multiple categories)
      let categoryMatch = false
      if (Array.isArray(recipe.categories)) {
        categoryMatch = recipe.categories.some(cat => 
          cat.toLowerCase().includes(lowercaseSearch)
        )
      } else if (recipe.category) {
        categoryMatch = recipe.category.toLowerCase().includes(lowercaseSearch)
      }
      
      // Search in ingredients
      const ingredientMatch = recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(lowercaseSearch)
      )
      
      return nameMatch || descMatch || categoryMatch || ingredientMatch
    })
  } catch (error) {
    console.error('Error searching recipes:', error)
    throw error
  }
}

// === CATEGORY MANAGEMENT ===

// Add new category
export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

// Get all categories
export const getCategories = async () => {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('name', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const categories = []
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return categories
  } catch (error) {
    console.error('Error getting categories:', error)
    throw error
  }
}

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId)
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId))
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}