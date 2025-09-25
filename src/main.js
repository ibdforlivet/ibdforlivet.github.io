import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Handle GitHub Pages SPA redirects
const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect !== location.href) {
  history.replaceState(null, null, redirect);
}

createApp(App).use(router).mount('#app')
