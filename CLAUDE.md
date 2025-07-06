# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NCQ Pure Frontend Platform - A comprehensive multi-product SaaS demonstration system showcasing various enterprise solutions. Built as a pure frontend application with React and TypeScript, featuring mock APIs and realistic simulations.

## Essential Commands

### Main User Portal Development
```bash
# Navigate to main development directory
cd ncq-platform/frontend/user-portal

# Install dependencies
npm install

# Start development server (default port 5173)
npm run dev

# Start on alternate port 3002
npm run dev:port

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Testing
npm run test
npm run test:ui
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy commands
npm run deploy:vercel     # Deploy to Vercel
npm run deploy:netlify    # Deploy to Netlify
```

### Project-Wide Operations
```bash
# Deploy all products (from root)
./deploy-all.sh

# Deploy specific products
./deploy-smart-building.sh
./deploy-unified.sh
```

## Architecture Overview

### Repository Structure
```
NCQ-pure-FE/
├── ncq-platform/frontend/user-portal/  # Main React application
├── products/                           # Product-specific implementations
│   ├── hospital-management/
│   ├── ncq-llm/
│   ├── ncq-pgw/
│   └── smart-hospitality/
├── core-technologies/                  # Technology demos
│   ├── blockchain/
│   └── iot-platform/
├── financial/                          # Financial dashboards
└── smart-building-temp/                # Smart building Next.js app
```

### Key Architectural Patterns

1. **Mock API Architecture**: 
   - All API calls use mock interceptors via `services/mockApi.ts`
   - Mock data generated in `lib/mockData.ts`
   - Realistic delays simulate network latency
   - No actual backend connections required

2. **Component Structure**:
   - UI components use Radix UI primitives in `components/ui/`
   - Page components in `pages/` directory
   - Layout components wrap all routes
   - Consistent TypeScript interfaces for props

3. **State Management**:
   - Zustand stores for global state (when implemented)
   - Local React state for component-specific data
   - Context providers for theme, language, auth

4. **Routing Architecture**:
   - React Router v6 with centralized route definitions
   - All routes public (no auth required)
   - Lazy loading for code splitting
   - Default redirect to `/platform`

5. **Build Configuration**:
   - Vite for fast development and optimized builds
   - Path alias `@/` maps to `src/`
   - Manual chunks for vendor splitting
   - Source maps enabled in production

## Working with Products

### Adding New Products
1. Create product page component in `src/pages/products/`
2. Add route in `src/App.tsx`
3. Add navigation item in sidebar if needed
4. Create mock data in appropriate service file

### Product Routes
- `/hospital` - Hospital Management System
- `/llm` - LLM Platform
- `/iot` - IoT Platform
- `/payment-gateway` - Payment Gateway
- `/smart-buildings` - Smart Buildings
- `/hospitality-hub` - Hospitality Hub
- `/traveler-portal` - Traveler Portal
- `/business-dashboard` - Business Dashboard

### Mock Data Patterns
```typescript
// Add to mockResponses in services/mockApi.ts
'/api/endpoint': {
  data: [],
  total: 0,
  // Include realistic response structure
}
```

## UI Development Guidelines

### Styling Approach
- Tailwind CSS for utility-first styling
- CSS custom properties for theme variables
- Dark mode via `dark` class on document root
- RTL support via Tailwind RTL plugin

### Component Best Practices
- Use TypeScript for all components
- Implement proper error boundaries
- Follow existing component patterns
- Use Radix UI for accessible components

### Internationalization
- i18next for translations
- Locale files in `src/locales/`
- Support for English and Arabic
- RTL layout switching

## Deployment

### GitHub Actions (Automatic)
- Deploys to Firebase on push to main branch
- Configuration in `.github/workflows/deploy.yml`

### Manual Deployment
```bash
# Firebase deployment
firebase deploy

# Vercel deployment
vercel --prod

# Netlify deployment
netlify deploy --prod
```

### Environment Configuration
- Create `.env.local` for local development
- `VITE_API_URL` - API base URL (defaults to https://api.ncq.sa)
- `VITE_PURE_FRONTEND=true` - Enable pure frontend mode

## Common Tasks

### Running Tests
```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- Dashboard.test.tsx

# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage
```

### Code Quality Checks
```bash
# Run all checks before committing
npm run typecheck && npm run lint && npm run test
```

### Building for Different Environments
```bash
# Development build
npm run build -- --mode development

# Production build (default)
npm run build

# Preview build locally
npm run preview
```

## Important Conventions

- **No Backend Dependencies**: This is a pure frontend demo
- **Mock Everything**: All data should be mocked, no real API calls
- **Auto-Login**: App automatically logs in with demo credentials
- **Public Routes**: All routes are accessible without authentication
- **Responsive Design**: Ensure all features work on mobile devices
- **Performance**: Use lazy loading and code splitting for large components