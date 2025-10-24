````markdown
# Admin Setup Instructions

## 🔐 Admin Access with Firebase Authentication

The admin panel is now protected by **Firebase Authentication** for better security.

### Setup Instructions:

See [FIREBASE_AUTH_SETUP.md](FIREBASE_AUTH_SETUP.md) for complete setup instructions.

**Quick Summary:**
1. Enable Email/Password authentication in Firebase Console
2. Create an admin user (email + password)
3. Update Firestore and Storage security rules
4. Login at `/admin/login` with your Firebase credentials

### Security Benefits:

- ✅ Industry-standard authentication
- ✅ Password is never stored in code or environment variables
- ✅ Automatic session management
- ✅ Firebase handles all security
- ✅ 100% free (up to 10,000 users/month)

### Admin Access:

Access the admin panel at: https://ibdforlivet.github.io/admin/login
````