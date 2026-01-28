# Free Hosting Deployment Guide for React + Vite Project

## **Vercel Deployment (Recommended)**

### **Step 1: Install Vercel CLI**
```bash
cd react-project-structura
npm install -g vercel
```

### **Step 2: Login to Vercel**
```bash
vercel login
```
- Enter your email and verify
- Check email for verification link

### **Step 3: Deploy**
```bash
vercel
```
- Set up and deploy: **Y**
- Which scope: **Enter your username**
- Link to existing project: **N**
- Project name: **structura** (or your preferred name)
- Directory: **./** (current directory)
- Want to modify settings: **N**

### **Step 4: Production Deployment**
```bash
vercel --prod
```

---

## **Alternative: Netlify Deployment**

### **Option A: CLI Deployment**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### **Option B: Drag & Drop**
1. Build your project:
   ```bash
   npm run build
   ```
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder to the browser
4. Your site is live!

---

## **GitHub Pages Deployment**

### **Step 1: Create GitHub Repository**
1. Go to https://github.com/new
2. Repository name: `structura`
3. Public repository
4. Don't initialize with README

### **Step 2: Push Code**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/structura.git
git push -u origin main
```

### **Step 3: Install gh-pages**
```bash
npm install --save-dev gh-pages
```

### **Step 4: Update package.json**
Add to scripts:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Add homepage:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/structura",
  ...
}
```

### **Step 5: Deploy**
```bash
npm run deploy
```

---

## **Firebase Hosting Deployment**

### **Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

### **Step 2: Initialize**
```bash
firebase init
```
- Select: **Hosting**
- Use existing project: **N** (or select existing)
- Project create name: **structura**
- What do you want to use as public directory: **dist**
- Configure as single-page app: **N**
- Set up automatic builds: **N**

### **Step 3: Build & Deploy**
```bash
npm run build
firebase deploy
```

---

## **Build Command Summary**

Regardless of hosting platform, always build first:
```bash
cd react-project-structura
npm run build
```

This creates a `dist` folder with optimized production files.

---

## **Quick Deployment (Vercel - No Installation)**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Click "Deploy"

Vercel automatically detects React + Vite and configures everything!

---

## **Custom Domain (Optional)**

All platforms support free custom domains:
- **Vercel**: Domain settings → Add Domain
- **Netlify**: Domain management → Add custom domain
- **Firebase**: Hosting → Add custom domain
- **GitHub Pages**: Settings → Pages → Custom domain

---

## **Project Structure for Deployment**

After `npm run build`:
```
react-project-structura/
├── dist/
│   ├── index.html
│   ├── assets/
│   └── ...
├── package.json
└── ...
```

Upload the `dist` folder to any hosting platform.

---

## **Troubleshooting**

### **404 Errors**
Add to `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: './', // or your repo name for GitHub Pages
})
```

### **Routing Issues**
If using React Router, create `_redirects` file in `public` folder:
```
/*  /index.html  200
```

For Netlify, add to `public/_redirects`:
```
/*    /index.html    200
```

---

## **Recommended: Vercel + GitHub**

Best free setup:
1. Push code to GitHub
2. Connect to Vercel
3. Automatic deployments on every push
4. Free SSL, CDN, custom domains

**Estimated setup time: 10-15 minutes**

