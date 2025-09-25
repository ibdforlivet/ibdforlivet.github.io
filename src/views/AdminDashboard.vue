<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <h1>Recipe Admin Dashboard</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>

    <div class="admin-content">
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
              <label for="category">Category *</label>
              <input
                id="category"
                v-model="recipeForm.category"
                type="text"
                required
                class="form-input"
                placeholder="e.g., Italian, Mexican, Desserts"
              />
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
            <label for="image">Image Path</label>
            <input
              id="image"
              v-model="recipeForm.image"
              type="text"
              class="form-input"
              placeholder="e.g., /assets/recipes/recipe-image.jpg"
            />
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
            <p class="recipe-category">{{ recipe.category }}</p>
            <p class="recipe-description">{{ recipe.description }}</p>
            <div class="recipe-actions">
              <button @click="editRecipe(recipe)" class="edit-btn">Edit</button>
              <button @click="deleteRecipe(recipe.id)" class="delete-btn">Delete</button>
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
  </div>
</template>

<script>
import { recipes as initialRecipes } from '../data/recipesData'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      recipes: [],
      editingRecipe: null,
      recipeForm: {
        name: '',
        description: '',
        category: '',
        prepTime: '',
        cookTime: '',
        servings: 1,
        difficulty: '',
        featured: false,
        image: '',
        ingredients: [''],
        instructions: ['']
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
      localStorage.removeItem('adminLoggedIn')
      localStorage.removeItem('adminLoginTime')
      this.$router.push('/admin/login')
    },
    
    saveRecipe() {
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

      if (this.editingRecipe) {
        // Update existing recipe
        const index = this.recipes.findIndex(r => r.id === this.editingRecipe.id)
        if (index !== -1) {
          this.recipes[index] = { ...recipeData, id: this.editingRecipe.id }
        }
        this.editingRecipe = null
      } else {
        // Add new recipe
        const newId = Math.max(...this.recipes.map(r => r.id), 0) + 1
        this.recipes.push({ ...recipeData, id: newId })
      }

      this.resetForm()
      this.saveToLocalStorage()
    },

    editRecipe(recipe) {
      this.editingRecipe = recipe
      this.recipeForm = {
        ...recipe,
        ingredients: [...recipe.ingredients],
        instructions: [...recipe.instructions]
      }
    },

    deleteRecipe(id) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        this.recipes = this.recipes.filter(r => r.id !== id)
        this.saveToLocalStorage()
      }
    },

    resetForm() {
      this.editingRecipe = null
      this.recipeForm = {
        name: '',
        description: '',
        category: '',
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

    saveToLocalStorage() {
      localStorage.setItem('adminRecipes', JSON.stringify(this.recipes))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('adminRecipes')
      if (saved) {
        this.recipes = JSON.parse(saved)
      } else {
        this.recipes = [...initialRecipes]
      }
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

  mounted() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn')
    const loginTime = localStorage.getItem('adminLoginTime')
    const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours

    if (!isLoggedIn || !loginTime || (Date.now() - parseInt(loginTime)) >= sessionDuration) {
      this.$router.push('/admin/login')
      return
    }

    this.loadFromLocalStorage()
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
</style>