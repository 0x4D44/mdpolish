# GitHub Pages Deployment Guide for Polish Timer

## Overview
This guide explains how to deploy the Polish Timer web app to GitHub Pages, making it accessible at `https://YOUR_USERNAME.github.io/polish-timer`.

## Prerequisites
- GitHub account
- Git installed locally
- Node.js and npm installed
- Repository pushed to GitHub

## Setup Instructions

### Step 1: Update Configuration Files

#### 1.1 Update package.json
Replace `YOUR_USERNAME` in the package.json homepage field with your actual GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/polish-timer",
```

For example, if your GitHub username is "arthur", it should be:
```json
"homepage": "https://arthur.github.io/polish-timer",
```

#### 1.2 Update webpack.config.js
If your repository name is different from "polish-timer", update the `publicPath` in webpack.config.js:

```javascript
config.output.publicPath = '/YOUR-REPO-NAME/';
```

### Step 2: Create GitHub Repository

If you haven't already:

1. Go to GitHub.com and create a new repository named "polish-timer"
2. Initialize and push your local code:

```bash
cd polish-timer
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/polish-timer.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch (will be created after first deployment)
6. Click "Save"

## Deployment Options

### Option A: Automatic Deployment with GitHub Actions (Recommended)

This is already set up! The `.github/workflows/deploy.yml` file will automatically deploy your app whenever you push to the main branch.

**How it works:**
1. Push code to the `main` branch
2. GitHub Actions automatically builds the web version
3. Deploys to GitHub Pages
4. App is live at `https://YOUR_USERNAME.github.io/polish-timer`

**To trigger deployment:**
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

**Monitor deployment:**
- Go to your repository on GitHub
- Click the "Actions" tab
- Watch the deployment progress

### Option B: Manual Deployment from Local Machine

If you prefer to deploy manually or GitHub Actions isn't working:

1. **First-time setup:**
```bash
cd polish-timer
npm install
```

2. **Build and deploy:**
```bash
npm run deploy
```

This command will:
- Build the web version (creates `dist` folder)
- Push to `gh-pages` branch automatically
- Deploy to GitHub Pages

3. **Alternative manual steps:**
```bash
# Build the web app
npm run build:web

# Deploy to gh-pages branch
npx gh-pages -d dist
```

## Verify Deployment

After deployment (takes 2-5 minutes):

1. Visit `https://YOUR_USERNAME.github.io/polish-timer`
2. The app should be live and functional
3. Check that all features work:
   - Timer countdown
   - Settings modal
   - Sound notifications (web audio)
   - Data persistence (localStorage)

## Troubleshooting

### Build Errors

If you encounter webpack errors:
```bash
npm install --save-dev @expo/webpack-config
```

### 404 Error on GitHub Pages

1. Make sure the repository is public
2. Check that GitHub Pages is enabled in Settings
3. Wait 5-10 minutes after deployment
4. Clear browser cache and try again

### Assets Not Loading

If images or assets aren't loading:
1. Check that `publicPath` in webpack.config.js matches your repo name
2. Ensure all asset paths use relative URLs
3. Rebuild and redeploy

### Timer Not Working

If the timer functionality isn't working:
1. Check browser console for errors
2. Ensure localStorage is not blocked
3. Try in an incognito/private window

## Updating the App

To update the deployed app:

1. Make your changes locally
2. Test locally: `npm run web`
3. Commit and push:
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

4. GitHub Actions will automatically redeploy (Option A)
   OR
   Run `npm run deploy` manually (Option B)

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain:
```
timer.yourdomain.com
```

2. Configure DNS settings with your domain provider:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`

3. Enable custom domain in GitHub Pages settings

## Local Testing Before Deployment

To test the production build locally:

```bash
# Build for production
npm run build:web

# Serve the dist folder locally
npx serve dist
```

Then open http://localhost:3000 in your browser.

## Important Notes

- The app uses React Native Web for the web version
- Web Audio API is used for sound notifications (no file downloads)
- localStorage is used for data persistence (not AsyncStorage on web)
- The progress ring and animations work fully on modern browsers
- Vibration feature is disabled on web (Android only)

## Quick Deploy Checklist

1. ✅ Update `homepage` in package.json with your GitHub username
2. ✅ Push code to GitHub main branch
3. ✅ Enable GitHub Pages in repository settings
4. ✅ Wait for GitHub Actions to complete (check Actions tab)
5. ✅ Visit your deployed app at the GitHub Pages URL

## Support

If you encounter issues:
1. Check the GitHub Actions logs for build errors
2. Verify all configuration files are correctly updated
3. Ensure Node.js version compatibility (v18+ recommended)
4. Check browser console for runtime errors

Your Polish Timer app should now be live on GitHub Pages!