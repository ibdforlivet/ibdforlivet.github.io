# Firebase Setup Guide for IBD for Livet Recipe App

## 🔥 Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project"
   - Name: `ibd-for-livet-recipes` (or your preferred name)
   - Enable Google Analytics (optional)
   - Click "Create project"

## 🗄️ Step 2: Setup Firestore Database

1. **Create Firestore Database**
   - In Firebase console, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (for now)
   - Select a location (europe-west3 for Denmark)

2. **Setup Security Rules** (Later, when ready for production)
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to recipes for everyone
       match /recipes/{document} {
         allow read: if true;
         allow write: if request.auth != null; // Only authenticated users can write
       }
     }
   }
   ```

## 📁 Step 3: Setup Firebase Storage

1. **Create Storage Bucket**
   - Go to "Storage" in Firebase console
   - Click "Get started"
   - Choose "Start in test mode"
   - Use default location

2. **Setup Storage Rules** (Later, for production)
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /recipes/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

## ⚙️ Step 4: Get Firebase Configuration

1. **Add Web App**
   - In Project Overview, click the web icon (</>)
   - App nickname: "IBD for Livet Web App"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

2. **Copy Configuration**
   - Copy the config object that looks like:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456789"
   };
   ```

## 🔧 Step 5: Update Your Code

1. **Replace Firebase Config**
   - Open `src/firebase/config.js`
   - Replace the placeholder config with your actual Firebase config

2. **Optional: Setup Authentication** (For better admin security)
   - In Firebase console, go to "Authentication"
   - Click "Get started"
   - Enable "Email/Password" provider
   - You can create admin users here

## 🚀 Step 6: Test Your Setup

1. **Run your app**: `npm run dev`
2. **Go to admin**: Double-click footer → Admin Access
3. **Login with**: `admin123` (or your password)
4. **Try adding a recipe** with an image
5. **Check Firebase console** to see data and storage

## 📊 Step 7: Update Your Components (Optional)

If you want to use Firebase data everywhere (not just admin), update your components to use the new Firebase service:

1. **Update Home.vue**:
   ```javascript
   import { getFeaturedRecipesService } from '../data/firebaseRecipeService.js'
   
   // In mounted():
   this.featuredRecipes = await getFeaturedRecipesService()
   ```

2. **Update Recipes.vue and other components similarly**

## 🔒 Step 8: Production Security (When Ready)

1. **Update Firestore Rules** (restrict write access)
2. **Update Storage Rules** (restrict upload access)
3. **Setup Firebase Authentication** for admin users
4. **Remove test mode** from Firestore and Storage

## 💡 Benefits After Setup

✅ **Real-time recipe management** - Add/edit/delete from admin panel
✅ **Image upload** - Upload images directly to Firebase Storage
✅ **No code changes needed** - Your customer can manage everything
✅ **Automatic backups** - Firebase handles data persistence
✅ **Global CDN** - Fast image loading worldwide
✅ **Scalable** - Handles any number of recipes

## 🆘 Troubleshooting

- **"Permission denied"**: Check Firestore/Storage rules
- **"Config not found"**: Make sure you updated `src/firebase/config.js`
- **Images not uploading**: Check Storage is enabled and rules allow uploads
- **Data not loading**: Check browser console for errors

---

**Need help?** The Firebase console has excellent documentation and error messages to guide you through any issues!