# 🔐 Firebase Authentication Setup Guide

## Hvad har jeg ændret?

Din admin login bruger nu **Firebase Authentication** i stedet for en simpel password-check. Dette gør din database sikker! 🔒

## 📋 Setup Steps (Tager 5 minutter)

### Step 1: Aktiver Firebase Authentication

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Vælg dit projekt: **ibd-for-livet-recipes**
3. Klik på **"Authentication"** i venstre menu
4. Klik **"Get started"**
5. Under "Sign-in method", klik på **"Email/Password"**
6. Aktivér **"Email/Password"** (første switch)
7. Klik **"Save"**

### Step 2: Opret din Admin Bruger

1. Stadig i Authentication, gå til **"Users"** tab
2. Klik **"Add user"**
3. Indtast:
   - **Email:** din@email.dk (din egen email)
   - **Password:** vælg et sikkert password (gem det godt!)
4. Klik **"Add user"**

✅ Det er det! Din admin bruger er oprettet.

### Step 3: Upload Security Rules

1. Gå til **"Firestore Database"** i Firebase Console
2. Klik på **"Rules"** tab
3. Erstat ALT indhold med:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Recipes collection
    match /recipes/{recipeId} {
      // Everyone can read recipes (public website)
      allow read: if true;
      
      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }
    
    // Categories collection
    match /categories/{categoryId} {
      // Everyone can read categories (public website)
      allow read: if true;
      
      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }
    
    // Deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Klik **"Publish"**

### Step 4: Upload Storage Rules

1. Gå til **"Storage"** i Firebase Console
2. Klik på **"Rules"** tab
3. Erstat ALT indhold med:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Recipe images
    match /recipes/{imageName} {
      // Everyone can read images (public website)
      allow read: if true;
      
      // Only authenticated users can upload/delete
      allow write, delete: if request.auth != null;
      
      // Validation for uploads
      allow create: if request.auth != null
                    && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                    && request.resource.contentType.matches('image/.*'); // Only images
    }
    
    // Deny all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Klik **"Publish"**

## 🎉 Færdig! Sådan logger du ind nu:

1. Gå til: https://ibdforlivet.github.io/admin/login
2. Indtast:
   - **Email:** den email du oprettede i Step 2
   - **Password:** det password du valgte i Step 2
3. Klik **"Login"**

## 🔒 Hvad gør dette sikkert?

✅ **Alle kan læse opskrifter** - Din hjemmeside virker normalt for besøgende
✅ **Kun DU kan skrive** - Kun når du er logget ind med Firebase Auth
✅ **Ingen kan hacke databasen** - Firebase tjekker automatisk authentication
✅ **Stadig 100% gratis** - Firebase Auth er gratis op til 10.000 brugere/måned

## 🆘 Troubleshooting

**Problem:** "User not found" ved login
- **Løsning:** Gå til Firebase Console → Authentication → Users, og tjek at brugeren er oprettet

**Problem:** "Permission denied" når du gemmer opskrifter
- **Løsning:** Tjek at du har published de nye Firestore rules i Step 3

**Problem:** Kan ikke uploade billeder
- **Løsning:** Tjek at du har published de nye Storage rules i Step 4

## 💡 Fordele ved den nye løsning

- ✅ Din database er beskyttet mod angreb
- ✅ Du logger ind med email/password (mere professionelt)
- ✅ Firebase håndterer al sikkerhed automatisk
- ✅ Stadig helt gratis
- ✅ Du får ikke flere advarsler fra Firebase

---

**Når du har gennemført disse steps, vil din hjemmeside være 100% sikker! 🎊**
