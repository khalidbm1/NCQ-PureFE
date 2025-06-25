# NCQ Platform Deployment Guide

This guide provides instructions for deploying the NCQ Platform User Portal to various hosting services.

## Prerequisites

- Node.js 18+ and npm installed
- Built production files (`npm run build`)
- Git repository (for some deployment methods)

## Deployment Options

### 1. Vercel (Recommended for Quick Deployment)

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to link/create a project
```

**Option B: Using Git Integration**
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with default settings

### 2. Netlify

**Option A: Using Netlify CLI**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Option B: Drag and Drop**
1. Run `npm run build`
2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the `dist` folder to the deployment area

**Option C: Git Integration**
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository on Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### 3. Docker Deployment

**Build and Run Locally**
```bash
# Build Docker image
docker build -t ncq-platform .

# Run container
docker run -p 8080:80 ncq-platform

# Access at http://localhost:8080
```

**Deploy to Cloud Services**

**Google Cloud Run:**
```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/ncq-platform

# Deploy to Cloud Run
gcloud run deploy --image gcr.io/PROJECT-ID/ncq-platform --platform managed
```

**AWS ECS:**
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [account-id].dkr.ecr.us-east-1.amazonaws.com
docker build -t ncq-platform .
docker tag ncq-platform:latest [account-id].dkr.ecr.us-east-1.amazonaws.com/ncq-platform:latest
docker push [account-id].dkr.ecr.us-east-1.amazonaws.com/ncq-platform:latest
```

**Azure Container Instances:**
```bash
# Build and push to Azure Container Registry
az acr build --registry myregistry --image ncq-platform .

# Deploy
az container create --resource-group myResourceGroup --name ncq-platform --image myregistry.azurecr.io/ncq-platform:latest
```

### 4. Static Hosting (AWS S3 + CloudFront)

```bash
# Build the project
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Create CloudFront distribution pointing to S3 bucket
# Configure index.html as default root object
# Set up error pages to redirect to index.html for SPA routing
```

### 5. GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

### 6. Traditional Web Hosting (cPanel, FTP)

1. Build the project:
```bash
npm run build
```

2. Upload contents of `dist` folder to your web hosting root directory

3. Create `.htaccess` file for routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Environment Variables

If you need to add environment variables:

1. Create `.env.production` file:
```
VITE_API_URL=https://api.your-domain.com
VITE_APP_NAME=NCQ Platform
```

2. Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

## Post-Deployment Checklist

- [ ] Test all routes work correctly
- [ ] Verify 404 pages redirect to index.html
- [ ] Check console for any errors
- [ ] Test on mobile devices
- [ ] Verify all assets load correctly
- [ ] Check HTTPS is enabled
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (if applicable)

## Continuous Deployment

For automatic deployments on git push:

**GitHub Actions** (create `.github/workflows/deploy.yml`):
```yaml
name: Deploy

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
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Troubleshooting

**Routes not working:** Ensure your hosting service is configured to serve index.html for all routes.

**Assets not loading:** Check the base URL in vite.config.ts if deploying to a subdirectory.

**Build failures:** Ensure Node.js version matches the requirement (18+).

## Support

For deployment issues, check:
- Build logs for errors
- Browser console for runtime errors
- Network tab for failed asset loads