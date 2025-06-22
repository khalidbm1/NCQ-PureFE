# Firebase Setup Instructions

## ✅ Deployment Status

The NCQ Pure Frontend has been successfully deployed to Firebase!

🔗 **Live URL**: https://ncq-sa.web.app

## 🔐 Setting up GitHub Actions for Automatic Deployment

To enable automatic deployment when you push to GitHub, follow these steps:

### 1. Generate Firebase Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/project/ncq-sa/settings/serviceaccounts/adminsdk)
2. Click on "Service Accounts" tab
3. Click "Generate New Private Key"
4. Save the downloaded JSON file

### 2. Add Secret to GitHub Repository

1. Go to your GitHub repository: https://github.com/NCQ-sa/Pure-frontend
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Paste the entire content of the JSON file you downloaded
6. Click "Add secret"

### 3. Update GitHub Actions Workflow

The workflow file (`.github/workflows/deploy.yml`) needs to be updated with the correct project ID:

```yaml
projectId: ncq-sa  # (already updated)
```

### 4. Test Automatic Deployment

1. Make a small change to any file
2. Commit and push to the `main` branch
3. Go to the "Actions" tab in your GitHub repository
4. Watch the deployment workflow run

## 📱 Manual Deployment

To deploy manually from your local machine:

```bash
cd /Users/kh/Desktop/NCQ\ pure\ FE
firebase deploy --only hosting
```

## 🌐 Firebase Hosting URLs

- **Main Site**: https://ncq-sa.web.app
- **Alternative**: https://ncq-sa.firebaseapp.com

## 📊 Firebase Console

Access your Firebase project console here:
- https://console.firebase.google.com/project/ncq-sa/overview

### Useful Console Sections:
- **Hosting**: View deployment history and rollback if needed
- **Usage**: Monitor hosting bandwidth and storage
- **Settings**: Manage project settings and service accounts

## 🔧 Local Development

To test the build locally before deploying:

```bash
# Build the project
cd ncq-platform-demo/user-portal
npm run build

# Preview the build
npm run preview
```

## 🚀 Next Steps

1. Set up the GitHub Actions secret for automatic deployment
2. Consider setting up preview channels for pull requests
3. Add more products to the deployment (admin dashboard, hospital management, etc.)
4. Set up custom domains if needed

## 📝 Notes

- The current deployment only includes the user-portal
- To deploy multiple sites, we'll need to create additional Firebase hosting sites
- Firebase automatically handles SSL certificates and CDN distribution