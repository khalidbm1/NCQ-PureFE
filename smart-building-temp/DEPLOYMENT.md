# Smart Building - Firebase Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Firebase CLI** (will be installed automatically if not present)
4. **Firebase Project** (create one at https://console.firebase.google.com)

## Quick Deployment

### Option 1: Using the deployment script

```bash
./deploy.sh
```

This script will:
- Check dependencies
- Install Firebase CLI if needed
- Build the application
- Deploy to Firebase Hosting

### Option 2: Manual deployment

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Deploy to Firebase:
```bash
npm run deploy
```

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it (e.g., "ncq-smart-building")
4. Follow the setup wizard

### 2. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 3. Login to Firebase

```bash
firebase login
```

### 4. Initialize Firebase in the project

```bash
firebase init hosting
```

Select:
- Use an existing project → Select your project
- Public directory: `out`
- Single-page app: `Yes`
- Set up automatic builds: `No` (optional)

### 5. Update Firebase Project ID

Edit `.firebaserc` and update the project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

## Environment Configuration

Create `.env.production` for production settings:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-url.com
NEXT_PUBLIC_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_ENABLE_3D=true
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
```

## Deployment Commands

### Deploy to production:
```bash
npm run deploy
```

### Deploy to preview channel:
```bash
npm run deploy:preview
```

### View deployment:
```bash
firebase hosting:sites:list
```

## Post-Deployment

After successful deployment, your app will be available at:
- `https://[your-project-id].web.app`
- `https://[your-project-id].firebaseapp.com`

## Troubleshooting

### Build Errors

1. **Next.js i18n error**: The i18n configuration is commented out for static export
2. **Image optimization error**: Images are set to `unoptimized: true` for static export
3. **Dynamic routes error**: Ensure all pages can be statically generated

### Firebase Errors

1. **Permission denied**: Make sure you're logged in with `firebase login`
2. **Project not found**: Check `.firebaserc` has the correct project ID
3. **Quota exceeded**: Check Firebase pricing/limits

### Static Export Limitations

Since we're using `output: 'export'` for Firebase hosting:
- No server-side rendering (SSR)
- No API routes
- No dynamic routes without `getStaticPaths`
- No image optimization (using unoptimized mode)
- No internationalized routing

## Performance Optimization

The deployment includes:
- Cache headers for static assets
- Immutable cache for JS/CSS files
- Long-term caching for images
- Automatic compression

## Custom Domain

To add a custom domain:

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS verification process
4. Update DNS records as instructed

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

## Monitoring

After deployment, monitor your app:

1. **Firebase Console**: View hosting metrics
2. **Performance Monitoring**: Add Firebase Performance SDK
3. **Analytics**: Add Firebase Analytics
4. **Error Tracking**: Add Firebase Crashlytics

## Rollback

To rollback to a previous version:

```bash
firebase hosting:releases:list
firebase hosting:rollback
```