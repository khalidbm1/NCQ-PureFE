# 🚀 NCQ Platform - Professional Deployment Guide

This guide will help you deploy the NCQ Platform to create a professional website similar to abir.holdings.

## 📋 Quick Deployment Options

### Option 1: Vercel (Recommended - Like abir.holdings)

Vercel provides fast global CDN, automatic HTTPS, and easy custom domain setup.

#### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy (from the user-portal directory)
vercel
```

Follow the prompts:
- Log in/Sign up to Vercel
- Set up and deploy: Yes
- Which scope: Select your account
- Link to existing project: No
- Project name: ncq-platform
- Directory: ./
- Override settings: No

#### Step 2: Configure Custom Domain

1. Go to your project on [vercel.com](https://vercel.com)
2. Go to Settings → Domains
3. Add your domain (e.g., `ncq-platform.com`)
4. Update your domain's DNS records:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.21.21`

#### Step 3: Enable Analytics (Optional)

```bash
vercel analytics enable
```

### Option 2: Netlify

#### Step 1: Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify init
netlify deploy --prod
```

#### Step 2: Custom Domain Setup

1. Go to your site on [netlify.com](https://netlify.com)
2. Domain settings → Add custom domain
3. Follow DNS configuration instructions

### Option 3: GitHub Pages with Custom Domain

#### Step 1: Prepare Repository

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. Select GitHub Actions as source

#### Step 2: Deploy

```bash
# The GitHub Action will automatically deploy on push to main
git add .
git commit -m "Deploy NCQ Platform"
git push origin main
```

#### Step 3: Custom Domain

1. Go to Settings → Pages
2. Add custom domain
3. Update DNS:
   - Add CNAME record: `www` → `[username].github.io`
   - Add A records for apex domain:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

## 🌐 Professional Setup (Like abir.holdings)

### 1. Domain Configuration

**Recommended DNS Settings:**
```
Type    Host    Value
A       @       76.76.21.21 (Vercel)
CNAME   www     cname.vercel-dns.com
```

### 2. SSL/HTTPS

- Vercel/Netlify: Automatic SSL provisioning
- Custom hosting: Use Let's Encrypt or Cloudflare

### 3. Performance Optimization

The build is already optimized with:
- Code splitting
- Minification
- Compression
- Lazy loading

### 4. SEO Setup

Add to `index.html`:
```html
<meta name="description" content="NCQ Platform - Your Digital Hub for Smart Hospitality and Building Management">
<meta property="og:title" content="NCQ Platform">
<meta property="og:description" content="B2B platform connecting businesses with travelers through AI-powered insights">
<meta property="og:image" content="https://your-domain.com/og-image.png">
```

### 5. Analytics Setup

**Google Analytics:**
```html
<!-- Add to index.html before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 📱 Post-Deployment Checklist

- [ ] ✅ Website loads on custom domain
- [ ] ✅ HTTPS is working
- [ ] ✅ All pages/routes work correctly
- [ ] ✅ Mobile responsive design works
- [ ] ✅ Forms and interactions work
- [ ] ✅ Images and assets load quickly
- [ ] ✅ No console errors
- [ ] ✅ Analytics tracking works

## 🔧 Troubleshooting

### Domain not working
- DNS propagation can take up to 48 hours
- Check DNS with: `dig yourdomain.com`

### 404 errors on routes
- Ensure SPA routing is configured
- Vercel/Netlify handle this automatically

### Slow loading
- Enable caching headers
- Use CDN (automatic with Vercel/Netlify)
- Optimize images

## 🎯 Quick Deploy Commands

```bash
# Vercel
npm run deploy:vercel

# Netlify  
npm run deploy:netlify

# Build only
npm run build
```

## 💡 Pro Tips

1. **Use Environment Variables**
   ```bash
   # .env.production
   VITE_API_URL=https://api.your-domain.com
   VITE_GA_ID=GA_MEASUREMENT_ID
   ```

2. **Monitor Performance**
   - Use Vercel Analytics
   - Set up Lighthouse CI
   - Monitor Core Web Vitals

3. **Security Headers**
   Already configured in deployment files:
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy

## 🆘 Support

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- GitHub Pages: https://pages.github.com

---

**Ready to deploy?** Run `vercel` and have your site live in minutes! 🎉