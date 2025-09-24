<template>
  
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          <svg class="logo-svg" viewBox="0 0 170 60" xmlns="http://www.w3.org/2000/svg">
            <!-- Option 5: Heart Leaf with thinner stroke - vertically centered -->
            <path d="M20 40 L20 25" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/>
            <path d="M20 25 Q15 20 17 15 Q20 17 20 20 Q20 17 23 15 Q25 20 20 25" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            
            <!-- Text in one line - vertically centered -->
            <text x="35" y="33" font-family="var(--font-display)" font-size="24" font-weight="600" fill="currentColor">IBD</text>
            <text x="67" y="33" font-family="var(--font-display)" font-size="24" font-weight="400" font-style="italic" fill="currentColor">for</text>
            <text x="95" y="33" font-family="var(--font-display)" font-size="24" font-weight="600" fill="currentColor">LIVET</text>
          </svg>
        </router-link>
        
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/recipes" class="nav-link">Recipes</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>

    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2024 IBD for Livet. Made with 🌿 for healthy living.</p>
        <p class="privacy-notice">
          🔒 Your favorites are stored locally in your browser for your convenience. 
          <button @click="showPrivacyInfo = !showPrivacyInfo" class="privacy-link">
            Learn more
          </button>
        </p>
        
        <div v-if="showPrivacyInfo" class="privacy-details">
          <div class="privacy-box">
            <h4>Privacy & Data Storage</h4>
            <p>
              • Your recipe favorites are stored locally in your browser<br>
              • No personal data is sent to external servers<br>
              • You can clear your data anytime in browser settings<br>
              • Each browser/device maintains separate favorites
            </p>
            <button @click="clearAllData" class="clear-data-btn">
              Clear All My Data
            </button>
            <button @click="showPrivacyInfo = false" class="close-privacy-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </footer>
  
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showPrivacyInfo: false
    }
  },
  methods: {
    clearAllData() {
      if (confirm('Are you sure you want to clear all your saved favorites? This cannot be undone.')) {
        localStorage.removeItem('recipeFavorites')
        this.showPrivacyInfo = false
        // Reload the page to reflect changes
        window.location.reload()
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fafafa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: var(--neutral-warm-white);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 16px rgba(44, 42, 38, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--neutral-light-gray);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.nav-logo {
  font-size: 1.75rem;
  font-weight: 600;
  font-family: var(--font-display);
  color: var(--primary-green);
  text-decoration: none;
  transition: all 0.3s ease;
  letter-spacing: -0.025em;
  display: flex;
  align-items: center;
}

.nav-logo:hover {
  color: var(--primary-green-dark);
  transform: scale(1.02);
}

.logo-svg {
  height: 60px;
  width: auto;
  transition: all 0.3s ease;
}

.nav-logo:hover .logo-svg {
  transform: scale(1.05);
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2.5rem;
}

.nav-link {
  color: var(--neutral-charcoal);
  text-decoration: none;
  font-weight: 500;
  font-family: var(--font-body);
  padding: 0.75rem 1.5rem;
  border-radius: 24px;
  transition: all 0.3s ease;
  letter-spacing: 0.025em;
  position: relative;
}

.nav-link:hover {
  background: var(--accent-sage);
  color: var(--neutral-charcoal);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: var(--primary-green);
  color: var(--neutral-warm-white);
  box-shadow: 0 2px 8px rgba(122, 139, 87, 0.25);
}

.main-content {
  flex: 1;
}

.footer {
  background: var(--neutral-charcoal);
  color: var(--neutral-cream);
  padding: 3rem 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.footer p {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.75rem;
  font-family: var(--font-body);
  line-height: 1.6;
}

.privacy-notice {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-top: 1.5rem;
}

.privacy-link {
  background: none;
  border: none;
  color: var(--accent-sage);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--font-body);
  transition: color 0.3s ease;
}

.privacy-link:hover {
  color: var(--primary-green);
}

.privacy-details {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.privacy-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  margin: 20px;
  color: #333;
}

.privacy-box h4 {
  margin-bottom: 1rem;
  color: #333;
}

.privacy-box p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  text-align: left;
  opacity: 1;
}

.clear-data-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 1rem;
  font-size: 0.9rem;
}

.clear-data-btn:hover {
  background: #ff5252;
}

.close-privacy-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.close-privacy-btn:hover {
  background: #5a6268;
}

/* Page Transition Animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 1rem 20px;
  }
  
  .nav-menu {
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .nav-link {
    padding: 0.5rem;
  }
}
</style>
