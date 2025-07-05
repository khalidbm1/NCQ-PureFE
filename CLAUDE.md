# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the NCQ Pure Frontend Platform - a multi-product SaaS demonstration system built with React and TypeScript. It's designed as a pure frontend with no backend dependencies, using mock data for all API interactions.

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Start development on specific port (3002)
npm run dev:port

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix  # Auto-fix issues

# Testing
npm run test
npm run test:ui  # Interactive UI
npm run test:coverage  # With coverage report
```

### Build & Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase (primary)
# Handled automatically via GitHub Actions on push to main

# Manual deployment options
npm run deploy:vercel
npm run deploy:netlify
```

## Architecture Overview

### Directory Structure
```
ncq-platform/frontend/user-portal/  # Main React app
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route-based page components
│   ├── services/      # API mock services
│   ├── store/         # Zustand state management
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
```

### Key Architectural Decisions

1. **Pure Frontend Architecture**: All API calls return mock data from `services/` directory. No actual backend integration.

2. **State Management**: Uses Zustand for global state (auth, theme, notifications). Local component state preferred for UI-specific state.

3. **Routing**: React Router v6 with lazy loading for code splitting. Protected routes handled via `ProtectedRoute` component.

4. **Styling**: Tailwind CSS with Radix UI headless components. Dark mode supported via CSS custom properties.

5. **3D Visualization**: Babylon.js integration in `Building3DView` component for IoT building management.

6. **Internationalization**: i18next configured for English/Arabic with RTL support.

## Working with Key Features

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/layout/Sidebar.tsx` if needed

### Mock API Services
- All API calls should go through `services/` directory
- Follow existing patterns for consistent mock responses
- Include realistic delays with `setTimeout`

### Component Development
- Use TypeScript interfaces for all props
- Follow existing component patterns in `src/components/`
- Utilize Radix UI components from `src/components/ui/`
- Import paths use `@/` alias for `src/`

### Auto-Login Feature
The app automatically logs in with demo credentials:
- Email: user@ncq.sa
- Password: user123
- Implemented in `src/pages/Login.tsx`

## Important Notes

- **Port Configuration**: Default dev port is 5173. Use `npm run dev:port` for port 3002.
- **TypeScript Strict Mode**: Enabled. All code must pass type checking.
- **ESLint**: Configured with max 0 warnings. Run `npm run lint` before committing.
- **Firebase Deployment**: Automatic via GitHub Actions. Manual deployment requires Firebase CLI.
- **Environment Variables**: Set `VITE_API_URL` in `.env.local` (defaults to https://api.ncq.sa)