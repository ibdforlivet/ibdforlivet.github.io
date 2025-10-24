<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <h1>Recipe Admin Dashboard</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>

    <div class="admin-content">
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          @click="activeTab = 'recipes'" 
          :class="{ active: activeTab === 'recipes' }"
          class="tab-btn"
        >
          Manage Recipes
        </button>
        <button 
          @click="activeTab = 'categories'" 
          :class="{ active: activeTab === 'categories' }"
          class="tab-btn"
        >
          Manage Categories
        </button>
      </div>

      <!-- Recipe Management Section -->
      <div v-if="activeTab === 'recipes'" class="tab-content">
        <!-- Add New Recipe Form -->
        <div class="recipe-form-section">
        <h2>{{ editingRecipe ? 'Edit Recipe' : 'Add New Recipe' }}</h2>
        <form @submit.prevent="saveRecipe" class="recipe-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Recipe Name *</label>
              <input
                id="name"
                v-model="recipeForm.name"
                type="text"
                required
                class="form-input"
              />
            </div>
                      <div class="form-group">
            <label>Categories:</label>
            <div class="categories-checkbox-group">
              <div 
                v-for="category in categories" 
                :key="category.id" 
                class="category-checkbox-item"
              >
                <input 
                  type="checkbox" 
                  :id="`category-${category.id}`"
                  :value="category.name"
                  v-model="recipeForm.categories"
                  class="category-checkbox"
                />
                <label 
                  :for="`category-${category.id}`" 
                  class="category-checkbox-label"
                  :style="{ borderColor: category.color || '#667eea' }"
                >
                  <div 
                    class="category-color-indicator" 
                    :style="{ backgroundColor: category.color || '#667eea' }"
                  ></div>
                  {{ category.name }}
                </label>
              </div>
            </div>
          </div>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              v-model="recipeForm.description"
              required
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="prepTime">Prep Time *</label>
              <input
                id="prepTime"
                v-model="recipeForm.prepTime"
                type="text"
                required
                class="form-input"
                placeholder="e.g., 15 mins"
              />
            </div>
            <div class="form-group">
              <label for="cookTime">Cook Time *</label>
              <input
                id="cookTime"
                v-model="recipeForm.cookTime"
                type="text"
                required
                class="form-input"
                placeholder="e.g., 30 mins"
              />
            </div>
            <div class="form-group">
              <label for="servings">Servings *</label>
              <input
                id="servings"
                v-model.number="recipeForm.servings"
                type="number"
                required
                class="form-input"
                min="1"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                v-model="recipeForm.difficulty"
                required
                class="form-input"
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div class="form-group">
              <label for="featured">Featured Recipe</label>
              <input
                id="featured"
                v-model="recipeForm.featured"
                type="checkbox"
                class="form-checkbox"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="image">Recipe Image</label>
            <div class="image-upload-section">
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="form-input"
                ref="imageInput"
              />
              <div v-if="imageUploading" class="upload-progress">
                Uploading image... Please wait.
              </div>
              <div v-if="recipeForm.image" class="image-preview">
                <img :src="recipeForm.image" alt="Recipe preview" class="preview-img" />
                <button type="button" @click="removeImage" class="remove-image-btn">
                  Remove Image
                </button>
              </div>
            </div>
          </div>

          <!-- Ingredients -->
          <div class="form-group">
            <label>Ingredients *</label>
            <div v-for="(ingredient, index) in recipeForm.ingredients" :key="index" class="ingredient-item">
              <input
                v-model="recipeForm.ingredients[index]"
                type="text"
                required
                class="form-input"
                placeholder="e.g., 2 cups flour"
              />
              <button
                type="button"
                @click="removeIngredient(index)"
                class="remove-btn"
                v-if="recipeForm.ingredients.length > 1"
              >
                Remove
              </button>
            </div>
            <button type="button" @click="addIngredient" class="add-btn">
              Add Ingredient
            </button>
          </div>

          <!-- Instructions -->
          <div class="form-group">
            <label>Instructions *</label>
            <div v-for="(instruction, index) in recipeForm.instructions" :key="index" class="instruction-item">
              <div class="instruction-number">{{ index + 1 }}.</div>
              <textarea
                v-model="recipeForm.instructions[index]"
                required
                class="form-textarea"
                rows="2"
                placeholder="Describe this step..."
              ></textarea>
              <button
                type="button"
                @click="removeInstruction(index)"
                class="remove-btn"
                v-if="recipeForm.instructions.length > 1"
              >
                Remove
              </button>
            </div>
            <button type="button" @click="addInstruction" class="add-btn">
              Add Instruction
            </button>
          </div>

          <div class="form-actions">
            <button type="submit" class="save-btn">
              {{ editingRecipe ? 'Update Recipe' : 'Save Recipe' }}
            </button>
            <button
              type="button"
              @click="resetForm"
              class="cancel-btn"
              v-if="editingRecipe"
            >
              Cancel Edit
            </button>
          </div>
        </form>
      </div>

      <!-- Recipe List -->
      <div class="recipe-list-section">
        <h2>Existing Recipes</h2>
        <div class="recipe-grid">
          <div
            v-for="recipe in recipes"
            :key="recipe.id"
            class="recipe-card"
          >
            <h3>{{ recipe.name }}</h3>
            <div class="recipe-categories">
              <span 
                v-if="Array.isArray(recipe.categories)" 
                v-for="categoryName in recipe.categories" 
                :key="categoryName"
                class="recipe-category-tag"
                :style="{ backgroundColor: getCategoryColor(categoryName) }"
              >
                {{ categoryName }}
              </span>
              <span 
                v-else-if="recipe.category"
                class="recipe-category-tag"
                :style="{ backgroundColor: getCategoryColor(recipe.category) }"
              >
                {{ recipe.category }}
              </span>
            </div>
            <p class="recipe-description">{{ recipe.description }}</p>
            <div class="recipe-actions">
              <button @click="editRecipe(recipe)" class="edit-btn">Edit</button>
              <button @click="deleteRecipe(recipe)" class="delete-btn">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Instructions -->
      <div class="export-section">
        <h3>Export Data</h3>
        <p>After making changes, copy the code below and replace the content in <code>src/data/recipesData.js</code>:</p>
        <textarea
          v-model="exportCode"
          readonly
          class="export-textarea"
          rows="10"
        ></textarea>
        <button @click="copyToClipboard" class="copy-btn">Copy to Clipboard</button>
      </div>
      </div>

      <!-- Category Management Section -->
      <div v-if="activeTab === 'categories'" class="tab-content">
        <!-- Add New Category Form -->
        <div class="category-form-section">
          <h2>{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h2>
          <form @submit.prevent="saveCategory" class="category-form">
            <div class="form-row">
              <div class="form-group">
                <label for="categoryName">Category Name *</label>
                <input
                  id="categoryName"
                  v-model="categoryForm.name"
                  type="text"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="categoryColor">Color</label>
                <input
                  id="categoryColor"
                  v-model="categoryForm.color"
                  type="color"
                  class="form-input color-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="categoryDescription">Description</label>
              <textarea
                id="categoryDescription"
                v-model="categoryForm.description"
                class="form-textarea"
                rows="2"
                placeholder="Optional description for this category"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ editingCategory ? 'Update Category' : 'Add Category' }}
              </button>
              <button v-if="editingCategory" @click="resetCategoryForm" type="button" class="cancel-btn">
                Cancel Edit
              </button>
            </div>
          </form>
        </div>

        <!-- Category List -->
        <div class="category-list-section">
          <h2>Existing Categories</h2>
          <div class="category-grid">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-card"
            >
              <div class="category-header">
                <div class="category-color" :style="{ backgroundColor: category.color || '#667eea' }"></div>
                <h3>{{ category.name }}</h3>
              </div>
              <p v-if="category.description" class="category-description">{{ category.description }}</p>
              <div class="category-stats">
                {{ getRecipeCountForCategory(category.name) }} recipes
              </div>
              <div class="category-actions">
                <button @click="editCategory(category)" class="edit-btn">Edit</button>
                <button @click="deleteCategory(category)" class="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getRecipes, 
  addRecipe, 
  updateRecipe, 
  deleteRecipe, 
  uploadRecipeImage,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../firebase/recipeService.js'
import { auth } from '../firebase/config'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      recipes: [],
      categories: [],
      activeTab: 'recipes', // 'recipes' or 'categories'
      editingRecipe: null,
      editingCategory: null,
      loading: false,
      imageUploading: false,
      recipeForm: {
        name: '',
        description: '',
        categories: [],
        prepTime: '',
        cookTime: '',
        servings: 1,
        difficulty: '',
        featured: false,
        image: '',
        ingredients: [''],
        instructions: ['']
      },
      categoryForm: {
        name: '',
        description: '',
        color: '#667eea'
      }
    }
  },
  computed: {
    exportCode() {
      return `export const recipes = ${JSON.stringify(this.recipes, null, 2)}`
    }
  },
  methods: {
    logout() {
      auth.signOut()
      localStorage.removeItem('adminLoggedIn')
      localStorage.removeItem('adminLoginTime')
      this.$router.push('/admin/login')
    },

    async handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.imageUploading = true
      try {
        // Generate temporary ID for new recipes
        const tempId = this.editingRecipe?.id || `temp_${Date.now()}`
        const imageUrl = await uploadRecipeImage(file, tempId)
        this.recipeForm.image = imageUrl
        this.$refs.imageInput.value = '' // Clear file input
      } catch (error) {
        alert('Error uploading image: ' + error.message)
      } finally {
        this.imageUploading = false
      }
    },

    removeImage() {
      this.recipeForm.image = ''
      this.$refs.imageInput.value = ''
    },
    
    async saveRecipe() {
      // Clean up empty ingredients and instructions
      const cleanedIngredients = this.recipeForm.ingredients.filter(i => i.trim())
      const cleanedInstructions = this.recipeForm.instructions.filter(i => i.trim())
      
      if (cleanedIngredients.length === 0 || cleanedInstructions.length === 0) {
        alert('Please add at least one ingredient and one instruction.')
        return
      }

      const recipeData = {
        ...this.recipeForm,
        ingredients: cleanedIngredients,
        instructions: cleanedInstructions
      }

      this.loading = true
      try {
        if (this.editingRecipe) {
          // Update existing recipe
          await updateRecipe(this.editingRecipe.id, recipeData)
          alert('Recipe updated successfully!')
        } else {
          // Add new recipe
          await addRecipe(recipeData)
          alert('Recipe added successfully!')
        }

        await this.loadRecipes()
        this.resetForm()
      } catch (error) {
        alert('Error saving recipe: ' + error.message)
      } finally {
        this.loading = false
      }
    },

    editRecipe(recipe) {
      this.editingRecipe = recipe
      this.recipeForm = {
        ...recipe,
        // Handle backward compatibility: convert single category to array
        categories: Array.isArray(recipe.categories) ? [...recipe.categories] : 
                   recipe.category ? [recipe.category] : [],
        ingredients: [...recipe.ingredients],
        instructions: [...recipe.instructions]
      }
    },

    async deleteRecipe(recipe) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        this.loading = true
        try {
          await deleteRecipe(recipe.id, recipe.image)
          alert('Recipe deleted successfully!')
          await this.loadRecipes()
        } catch (error) {
          alert('Error deleting recipe: ' + error.message)
        } finally {
          this.loading = false
        }
      }
    },

    resetForm() {
      this.editingRecipe = null
      this.recipeForm = {
        name: '',
        description: '',
        categories: [],
        prepTime: '',
        cookTime: '',
        servings: 1,
        difficulty: '',
        featured: false,
        image: '',
        ingredients: [''],
        instructions: ['']
      }
    },

    addIngredient() {
      this.recipeForm.ingredients.push('')
    },

    removeIngredient(index) {
      this.recipeForm.ingredients.splice(index, 1)
    },

    addInstruction() {
      this.recipeForm.instructions.push('')
    },

    removeInstruction(index) {
      this.recipeForm.instructions.splice(index, 1)
    },

    async loadRecipes() {
      this.loading = true
      try {
        this.recipes = await getRecipes()
      } catch (error) {
        alert('Error loading recipes: ' + error.message)
        this.recipes = []
      } finally {
        this.loading = false
      }
    },

    async loadCategories() {
      try {
        this.categories = await getCategories()
        console.log('Loaded categories:', this.categories) // Debug log
      } catch (error) {
        alert('Error loading categories: ' + error.message)
        this.categories = []
      }
    },

    // Category Management Methods
    async saveCategory() {
      if (!this.categoryForm.name.trim()) {
        alert('Please enter a category name.')
        return
      }

      // Ensure color has a value
      const categoryData = {
        ...this.categoryForm,
        color: this.categoryForm.color || '#667eea'
      }

      console.log('Saving category with data:', categoryData) // Debug log

      this.loading = true
      try {
        if (this.editingCategory) {
          await updateCategory(this.editingCategory.id, categoryData)
          alert('Category updated successfully!')
        } else {
          await addCategory(categoryData)
          alert('Category added successfully!')
        }

        await this.loadCategories()
        this.resetCategoryForm()
      } catch (error) {
        alert('Error saving category: ' + error.message)
      } finally {
        this.loading = false
      }
    },

    editCategory(category) {
      this.editingCategory = category
      this.categoryForm = {
        name: category.name,
        description: category.description || '',
        color: category.color || '#667eea'
      }
      console.log('Editing category:', category, 'Form color:', this.categoryForm.color) // Debug log
    },

    async deleteCategory(category) {
      // Check if category is used by any recipes (handle both old single category and new multiple categories)
      const recipesUsingCategory = this.recipes.filter(recipe => {
        if (Array.isArray(recipe.categories)) {
          return recipe.categories.includes(category.name)
        } else {
          return recipe.category === category.name
        }
      })
      if (recipesUsingCategory.length > 0) {
        alert(`Cannot delete category "${category.name}" as it is used by ${recipesUsingCategory.length} recipe(s). Please update those recipes first.`)
        return
      }

      if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
        this.loading = true
        try {
          await deleteCategory(category.id)
          alert('Category deleted successfully!')
          await this.loadCategories()
        } catch (error) {
          alert('Error deleting category: ' + error.message)
        } finally {
          this.loading = false
        }
      }
    },

    resetCategoryForm() {
      this.editingCategory = null
      this.categoryForm = {
        name: '',
        description: '',
        color: '#667eea'
      }
    },

    getRecipeCountForCategory(categoryName) {
      return this.recipes.filter(recipe => {
        if (Array.isArray(recipe.categories)) {
          return recipe.categories.includes(categoryName)
        } else {
          return recipe.category === categoryName
        }
      }).length
    },

    getCategoryColor(categoryName) {
      const category = this.categories.find(cat => cat.name === categoryName)
      return category ? category.color || '#667eea' : '#667eea'
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.exportCode)
        alert('Code copied to clipboard!')
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = this.exportCode
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Code copied to clipboard!')
      }
    }
  },

  async mounted() {
    // Check if user is logged in with Firebase Auth
    if (!auth.currentUser) {
      this.$router.push('/admin/login')
      return
    }

    await this.loadRecipes()
    await this.loadCategories()
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c0392b;
}

.recipe-form-section {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 3rem;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-input, .form-textarea {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-checkbox {
  width: auto;
  margin-top: 0.5rem;
}

.ingredient-item, .instruction-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.ingredient-item .form-input,
.instruction-item .form-textarea {
  flex: 1;
}

.instruction-number {
  min-width: 30px;
  font-weight: bold;
  color: #666;
  padding-top: 0.75rem;
}

.add-btn, .remove-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.add-btn {
  background: #27ae60;
  color: white;
  margin-top: 0.5rem;
}

.add-btn:hover {
  background: #219a52;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  min-width: 80px;
}

.remove-btn:hover {
  background: #c0392b;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn, .cancel-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.save-btn {
  background: #667eea;
  color: white;
}

.save-btn:hover {
  background: #5a6fd8;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background: #7f8c8d;
}

.recipe-list-section {
  margin-bottom: 3rem;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.recipe-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recipe-category {
  color: #667eea;
  font-weight: bold;
  margin: 0.5rem 0;
}

.recipe-description {
  color: #666;
  margin-bottom: 1rem;
}

.recipe-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.edit-btn {
  background: #f39c12;
  color: white;
}

.edit-btn:hover {
  background: #e67e22;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background: #c0392b;
}

.export-section {
  background: #f0f8ff;
  padding: 2rem;
  border-radius: 10px;
  border: 2px solid #667eea;
}

.export-textarea {
  width: 100%;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  margin: 1rem 0;
}

.copy-btn {
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.copy-btn:hover {
  background: #5a6fd8;
}

code {
  background: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-progress {
  color: #667eea;
  font-style: italic;
  padding: 0.5rem;
  background: #f0f8ff;
  border-radius: 5px;
}

.image-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.preview-img {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.remove-image-btn {
  background: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.remove-image-btn:hover {
  background: #c0392b;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e1e8ed;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
  font-weight: 600;
}

.tab-content {
  min-height: 400px;
}

/* Category Management Styles */
.category-form-section {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.category-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.color-input {
  width: 60px !important;
  height: 40px;
  padding: 0;
  border: 2px solid #ddd;
  cursor: pointer;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ddd;
}

.category-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.category-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.category-stats {
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.category-list-section {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Category Checkbox Styles */
.categories-checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.category-checkbox-item {
  display: flex;
  align-items: center;
}

.category-checkbox {
  display: none;
}

.category-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  background: white;
  width: 100%;
}

.category-checkbox-label:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.category-checkbox:checked + .category-checkbox-label {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.category-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Recipe Category Tags */
.recipe-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.recipe-category-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>