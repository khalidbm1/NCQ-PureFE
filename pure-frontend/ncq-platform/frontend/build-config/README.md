# NCQ Platform - Build Configuration

Advanced build optimization configuration for the NCQ Platform frontend with support for both Vite and Webpack bundlers, featuring intelligent code splitting, compression, and performance optimizations.

## Features

- 🚀 **Dual Bundler Support** - Optimized configurations for both Vite and Webpack
- 📦 **Advanced Code Splitting** - Intelligent vendor chunking and route-based splitting
- 🗜️ **Multi-format Compression** - Gzip and Brotli compression support
- 📊 **Bundle Analysis** - Detailed build reports and visualization
- 🔧 **Micro-frontend Ready** - Module Federation support for scalable architecture
- 🏗️ **Multi-stage Docker** - Optimized containerization with nginx
- ⚡ **Performance Optimized** - Tree-shaking, minification, and asset optimization
- 🌐 **PWA Support** - Service worker generation and caching strategies
- 🔒 **Security Headers** - Built-in security best practices

## Quick Start

### Using Vite (Recommended)

```bash
# Development
npm run dev:vite

# Production build
npm run build:vite

# Build with analysis
npm run analyze:vite

# Preview production build
npm run preview
```

### Using Webpack

```bash
# Development
npm run dev:webpack

# Production build
npm run build:webpack

# Build with analysis
npm run analyze:webpack
```

### Advanced Build Options

```bash
# Module Federation build
npm run build:federation

# Legacy browser support
npm run build:legacy

# Docker build
npm run build:docker

# Custom build with optimizer
node scripts/build-optimizer.js --bundler vite --analyze --profile
```

## Configuration

### Environment Variables

```bash
# API Configuration
VITE_API_URL=https://api.ncq.com
VITE_APP_TITLE="NCQ Platform"
VITE_APP_DESCRIPTION="Next-generation business platform"

# Build Configuration
ANALYZE=true                    # Enable bundle analysis
MODULE_FEDERATION=true          # Enable module federation
LEGACY_BUILD=true              # Enable legacy browser support
GENERATE_SOURCEMAP=false       # Disable source maps for production

# Performance
VITE_BUILD_TARGET=esnext       # Build target
VITE_CHUNK_SIZE_WARNING=1000   # Chunk size warning threshold
```

### Vite Configuration Features

- **SWC Integration** - Fast React compilation with SWC
- **Dynamic Imports** - Automatic route-based code splitting
- **Vendor Chunking** - Intelligent library grouping:
  - `react-vendor` - React ecosystem
  - `ui-vendor` - UI component libraries
  - `data-vendor` - Data fetching and state management
  - `form-vendor` - Form handling libraries
  - `chart-vendor` - Visualization libraries
  - `utils-vendor` - Utility libraries
  - `animation-vendor` - Animation libraries

- **Asset Optimization**:
  - Images: Automatic WebP conversion and optimization
  - Fonts: Subsetting and format optimization
  - CSS: PostCSS with Tailwind CSS and autoprefixer
  - SVG: SVGR integration for React components

### Webpack Configuration Features

- **SWC Loader** - Fast TypeScript and JavaScript compilation
- **Module Federation** - Micro-frontend architecture support
- **Advanced Chunking**:
  ```javascript
  splitChunks: {
    cacheGroups: {
      react: { /* React ecosystem */ },
      ui: { /* UI libraries */ },
      data: { /* Data libraries */ },
      forms: { /* Form libraries */ },
      charts: { /* Chart libraries */ },
      utils: { /* Utility libraries */ },
      animation: { /* Animation libraries */ },
    }
  }
  ```

- **Performance Optimizations**:
  - Tree-shaking with Terser
  - CSS extraction and minification
  - Asset optimization and compression
  - Runtime chunk separation

## Code Splitting Strategies

### 1. Route-based Splitting

```typescript
// Automatic with React Router
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Analytics = lazy(() => import('@/pages/Analytics'))

// Manual with dynamic imports
const loadDashboard = () => import('@/pages/Dashboard')
```

### 2. Vendor Library Splitting

Libraries are automatically grouped into optimized chunks:

- **React Ecosystem** (~150KB)
- **UI Components** (~200KB)
- **Data Management** (~100KB)
- **Form Handling** (~80KB)
- **Charts & Visualization** (~300KB)
- **Utilities** (~50KB)

### 3. Feature-based Splitting

```typescript
// Feature modules
const AuthModule = lazy(() => import('@/features/auth'))
const PaymentModule = lazy(() => import('@/features/payment'))
const AnalyticsModule = lazy(() => import('@/features/analytics'))
```

## Build Optimization

### Bundle Analysis

Generate detailed bundle analysis reports:

```bash
# Vite analysis
npm run analyze:vite

# Webpack analysis
npm run analyze:webpack

# Custom analysis with build optimizer
node scripts/build-optimizer.js --analyze --bundler vite
```

The build optimizer generates:
- Interactive bundle visualization
- File size breakdown by type
- Compression ratio analysis
- Performance recommendations
- HTML and JSON reports

### Performance Metrics

Target performance budgets:
- **Initial Bundle**: < 250KB (gzipped)
- **Vendor Chunks**: < 150KB each (gzipped)
- **Route Chunks**: < 100KB each (gzipped)
- **Asset Files**: < 1MB total

### Compression

Multi-format compression support:
- **Gzip**: Level 9 compression (~60-70% reduction)
- **Brotli**: Level 11 compression (~70-80% reduction)

```bash
# Pre-compressed files are generated automatically
dist/
├── js/main.abc123.js
├── js/main.abc123.js.gz      # Gzip compressed
├── js/main.abc123.js.br      # Brotli compressed
└── css/main.def456.css
```

## Micro-frontend Architecture

### Module Federation Setup

Enable module federation for scalable micro-frontend architecture:

```bash
# Build with module federation
MODULE_FEDERATION=true npm run build:webpack
```

### Exposed Modules

```javascript
// webpack.config.ts
new ModuleFederationPlugin({
  name: 'ncq_platform',
  exposes: {
    './Shell': './src/shell/index.tsx',
    './Auth': './src/auth/index.tsx',
    './Dashboard': './src/dashboard/index.tsx',
    './Admin': './src/admin/index.tsx',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    '@ncq/design-system': { singleton: true },
  },
})
```

### Consumer Setup

```typescript
// Remote module consumption
import { loadRemoteModule } from '@module-federation/utilities'

const AuthModule = React.lazy(() =>
  loadRemoteModule({
    url: 'https://auth.ncq.com/remoteEntry.js',
    scope: 'auth',
    module: './AuthApp',
  })
)
```

## Docker Deployment

### Multi-stage Build

```dockerfile
# Build stage
FROM node:18-alpine AS builder
COPY . .
RUN npm run build:vite

# Production stage
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
```

### Build and Deploy

```bash
# Build Docker image
docker build -t ncq-platform -f docker/Dockerfile.multi-stage .

# Run container
docker run -p 3000:3000 ncq-platform

# With custom build arguments
docker build \
  --build-arg BUNDLER=vite \
  --build-arg MODULE_FEDERATION=true \
  -t ncq-platform .
```

### Nginx Configuration

Optimized nginx configuration includes:
- **Static Asset Caching** - 1 year for immutable assets
- **Compression** - Gzip and Brotli support
- **Security Headers** - CSP, HSTS, XSS protection
- **Rate Limiting** - API endpoint protection
- **Health Checks** - Container health monitoring

## Performance Optimizations

### Build Time Optimizations

- **SWC Compiler** - 10x faster than Babel
- **Filesystem Caching** - Persistent build cache
- **Parallel Processing** - Multi-threaded builds
- **Incremental Builds** - Only rebuild changed files

### Runtime Optimizations

- **Tree Shaking** - Dead code elimination
- **Code Splitting** - Lazy loading and chunking
- **Asset Optimization** - Image compression and WebP conversion
- **Service Worker** - Offline caching and background sync

### Bundle Size Optimizations

```typescript
// Import optimization
import { Button } from '@ncq/design-system'  // ✅ Tree-shakable
import debounce from 'lodash/debounce'        // ✅ Specific import
import * as lodash from 'lodash'              // ❌ Full library

// Dynamic imports for large libraries
const ChartLibrary = lazy(() => import('recharts'))
```

## Testing and Quality

### Build Validation

```bash
# Type checking
npm run type-check

# Build testing
npm run test:build

# Performance auditing
npm run audit:performance
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Build and Analyze
  run: |
    npm run build:vite
    node scripts/build-optimizer.js --analyze
    
- name: Upload Build Report
  uses: actions/upload-artifact@v3
  with:
    name: build-report
    path: dist/build-report.html
```

## Troubleshooting

### Common Issues

1. **Large Bundle Size**
   ```bash
   # Analyze bundle
   npm run analyze:vite
   # Check for duplicate dependencies
   npm ls --depth=0
   ```

2. **Slow Build Times**
   ```bash
   # Enable build profiling
   PROFILE=true npm run build:vite
   # Clear cache
   rm -rf node_modules/.vite
   ```

3. **Memory Issues**
   ```bash
   # Increase Node.js memory
   NODE_OPTIONS="--max-old-space-size=8192" npm run build
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=true npm run build:vite

# Verbose webpack output
npm run build:webpack -- --progress --verbose
```

## Configuration Files

- `vite.config.ts` - Vite bundler configuration
- `webpack.config.ts` - Webpack bundler configuration
- `scripts/build-optimizer.js` - Build analysis and optimization
- `docker/` - Docker configuration files
- `package.json` - Build scripts and dependencies

## Support

For build configuration issues:
- GitHub Issues: [Create an issue](https://github.com/NCQ-sa/ncq-platform/issues)
- Documentation: [Build Guide](https://docs.ncq.com/build)
- Team: build-tools@ncq.com