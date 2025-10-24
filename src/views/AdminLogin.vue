<template>
  <div class="admin-login">
    <div class="login-container">
      <h2>Admin Login</h2>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter admin email"
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter admin password"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

export default {
  name: 'AdminLogin',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async login() {
      this.loading = true
      this.error = ''
      
      try {
        // Sign in with Firebase Authentication
        await signInWithEmailAndPassword(auth, this.email, this.password)
        
        // Store login state in localStorage (optional, for UI persistence)
        localStorage.setItem('adminLoggedIn', 'true')
        localStorage.setItem('adminLoginTime', Date.now().toString())
        
        // Redirect to admin dashboard
        this.$router.push('/admin/dashboard')
      } catch (error) {
        console.error('Login error:', error)
        
        // Handle different error codes
        if (error.code === 'auth/invalid-email') {
          this.error = 'Invalid email address.'
        } else if (error.code === 'auth/user-not-found') {
          this.error = 'No account found with this email.'
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          this.error = 'Invalid password. Please try again.'
        } else if (error.code === 'auth/too-many-requests') {
          this.error = 'Too many failed attempts. Please try again later.'
        } else {
          this.error = 'Login failed. Please try again.'
        }
      }
      
      this.loading = false
    },
    
    logout() {
      auth.signOut()
      localStorage.removeItem('adminLoggedIn')
      localStorage.removeItem('adminLoginTime')
    }
  },
  mounted() {
    // Check if already logged in with Firebase Auth
    if (auth.currentUser) {
      this.$router.push('/admin/dashboard')
    }
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  background: #667eea;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.login-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.login-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #fee;
  border-radius: 5px;
}
</style>