# Admin Setup Instructions

## Setting up Admin Password

For security reasons, the admin password is not stored in the code. Instead, it uses environment variables.

### Local Development Setup:

1. **Copy the environment template:**
   ```bash
   cp .env.template .env
   ```

2. **Edit the .env file:**
   ```bash
   VITE_ADMIN_PASSWORD=your-secure-admin-password-here
   ```
   Replace `your-secure-admin-password-here` with your desired admin password.

3. **The .env file is automatically ignored by git** and will never be committed to GitHub.

### Production Deployment (GitHub Pages):

For GitHub Pages deployment, you'll need to set the environment variable in your GitHub repository settings:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `VITE_ADMIN_PASSWORD`
5. Value: Your secure admin password
6. Click **Add secret**

### Security Benefits:

- ✅ Password is never visible in your public code
- ✅ Each environment can have different passwords
- ✅ Easy to change without code modifications
- ✅ Follows security best practices

### Admin Access:

Once configured, access the admin panel at: `/admin/login`