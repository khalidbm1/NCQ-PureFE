# NCQ Platform - Router Configuration

Advanced React Router v6 implementation with lazy loading, protected routes, and micro-frontend support for the NCQ Platform.

## Features

- 🚀 **React Router v6** - Latest routing with data APIs
- 🔒 **Protected Routes** - Role-based access control
- 📦 **Code Splitting** - Automatic route-based lazy loading
- 🌐 **Micro-frontends** - Module Federation support
- 🌍 **i18n Ready** - Arabic RTL and English support
- 🎨 **Theme Support** - Light/Dark mode with system detection
- 🔄 **Progressive Enhancement** - Service worker updates
- 📱 **Responsive Layouts** - Mobile-first design

## Installation

```bash
npm install @ncq/router
```

## Quick Start

```tsx
import { AppRouter } from '@ncq/router'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root')!)
root.render(<AppRouter />)
```

## Usage

### Basic Setup

The router comes pre-configured with all necessary providers:

```tsx
// App.tsx
import { AppRouter } from '@ncq/router'

export default function App() {
  return <AppRouter />
}
```

### Protected Routes

Use the `ProtectedRoute` component to secure pages:

```tsx
import { ProtectedRoute } from '@ncq/router'

// In your route configuration
<Route
  path="/admin/*"
  element={
    <ProtectedRoute requiredRoles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### Programmatic Protection

```tsx
import { useProtectedRoute } from '@ncq/router'

function SecureComponent() {
  const { checkAccess } = useProtectedRoute({
    requiredRoles: ['admin'],
    requiredPermissions: ['users.manage']
  })

  const handleAction = () => {
    if (checkAccess()) {
      // Perform secure action
    }
  }
}
```

### Route Configuration

The router exports pre-configured paths:

```tsx
import { routePaths } from '@ncq/router'

// Navigate to dashboard
navigate(routePaths.dashboard.root)

// Navigate to specific feature
navigate(routePaths.features.payment)

// Dynamic routes
navigate(routePaths.auth.resetPassword('token123'))
```

### Layouts

Four layout components are provided:

1. **RootLayout** - Base layout with theme/language support
2. **DashboardLayout** - Main app layout with sidebar
3. **AdminLayout** - Admin-specific layout with security
4. **AuthLayout** - Authentication pages layout

### Context Hooks

#### Authentication

```tsx
import { useAuth } from '@ncq/router'

function Profile() {
  const { 
    user, 
    isAuthenticated, 
    hasRole, 
    hasPermission,
    logout 
  } = useAuth()

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {hasRole('admin') && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

#### Theme Management

```tsx
import { useTheme } from '@ncq/router'

function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      Current theme: {resolvedTheme}
    </button>
  )
}
```

#### Internationalization

```tsx
import { useLanguage, useTranslation } from '@ncq/router'

function LanguageSelector() {
  const { language, direction, toggleLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <div dir={direction}>
      <h1>{t('dashboard.welcome', { name: 'User' })}</h1>
      <button onClick={toggleLanguage}>
        {language === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  )
}
```

### Micro-frontends

Load micro-frontend applications dynamically:

```tsx
import { withMicroFrontend } from '@ncq/router'

// HOC approach
const PaymentApp = withMicroFrontend('payment')

// Manual loading
import { useMicroFrontend } from '@ncq/router'

function MicroFrontendLoader() {
  const { loadApp, isAppLoaded } = useMicroFrontend()
  const [Component, setComponent] = useState(null)

  useEffect(() => {
    loadApp('payment').then(module => {
      setComponent(() => module.default)
    })
  }, [])

  if (!Component) return <LoadingFallback />
  return <Component />
}
```

### Error Handling

The router includes comprehensive error handling:

```tsx
// Error boundaries are automatically applied
// Custom error fallback
<Route
  path="/risky"
  element={<RiskyComponent />}
  errorElement={<CustomErrorPage />}
/>

// Async error boundary wrapper
import { AsyncErrorBoundary } from '@ncq/router'

<AsyncErrorBoundary fallback={CustomErrorComponent}>
  <YourComponent />
</AsyncErrorBoundary>
```

### Loading States

Multiple loading components are provided:

```tsx
import { 
  LoadingFallback,
  PageLoadingSkeleton,
  CardLoadingSkeleton,
  TableLoadingSkeleton 
} from '@ncq/router'

// Basic spinner
<LoadingFallback size="lg" text="Loading data..." />

// Page skeleton
<PageLoadingSkeleton />

// Table skeleton with custom rows
<TableLoadingSkeleton rows={10} />
```

### Network Status

Monitor and display network connectivity:

```tsx
import { useOnlineStatus } from '@ncq/router'

function NetworkAwareComponent() {
  const isOnline = useOnlineStatus()

  if (!isOnline) {
    return <OfflineMessage />
  }

  return <OnlineContent />
}
```

### Update Management

Handle app updates gracefully:

```tsx
import { useUpdateCheck } from '@ncq/router'

function UpdateChecker() {
  const { updateAvailable, checking, checkForUpdate } = useUpdateCheck()

  return (
    <div>
      {updateAvailable && <UpdatePrompt />}
      <button onClick={checkForUpdate} disabled={checking}>
        Check for updates
      </button>
    </div>
  )
}
```

## Route Structure

```
/                          # Public home page
/auth
  /login                   # Login page
  /register               # Registration
  /forgot-password        # Password reset request
  /reset-password/:token  # Password reset form
  /two-factor            # 2FA verification

/dashboard                # Protected dashboard
  /analytics             # Analytics page
  /reports               # Reports page
  /profile               # User profile
  /settings              # Settings
  
  /payment/*             # Payment module
  /iot/*                 # IoT module
  /hospital/*            # Hospital module
  /blockchain/*          # Blockchain module
  /hospitality/*         # Hospitality module
  /ai/*                  # AI module

/admin                   # Admin area (role: admin)
  /users                 # User management
  /configuration         # System config
  /audit-logs           # Audit logs
  /monitoring           # Service monitoring

/403                    # Unauthorized
/404                    # Not found
/500                    # Server error
```

## Configuration

### Environment Variables

```bash
# Micro-frontend configuration
REACT_APP_ENABLE_MFE=true
REACT_APP_MFE_HOST=http://localhost:3000
REACT_APP_MFE_AUTH_URL=http://localhost:3001
REACT_APP_MFE_PAYMENT_URL=http://localhost:3002
REACT_APP_MFE_ANALYTICS_URL=http://localhost:3003

# App version (for update checks)
REACT_APP_VERSION=1.0.0
```

### TypeScript Support

Full TypeScript support with exported types:

```tsx
import type { 
  User, 
  AuthState,
  Theme,
  Language,
  MicroFrontendApp 
} from '@ncq/router'
```

## Advanced Features

### Custom Route Guards

```tsx
import { RouteGuard } from '@ncq/router'

function FeatureFlag({ children, feature }) {
  return (
    <RouteGuard
      requiredPermissions={[`feature.${feature}`]}
      fallback={<FeatureDisabled />}
    >
      {children}
    </RouteGuard>
  )
}
```

### Route Transitions

The router includes smooth transitions between routes:

```tsx
// Automatic progress bar on navigation
// Network status indicator
// Update prompts for new versions
// Scroll restoration on navigation
```

### Performance Optimizations

- Automatic code splitting for all routes
- Retry logic for failed module loads
- Intelligent preloading of critical routes
- Service worker integration for offline support

## Customization

### Adding New Routes

1. Create your page component:
```tsx
// src/pages/custom/MyPage.tsx
export default function MyPage() {
  return <div>My Custom Page</div>
}
```

2. Add lazy import:
```tsx
const MyPage = lazyWithRetry(() => import('../pages/custom/MyPage'))
```

3. Add route configuration:
```tsx
<Route path="/custom" element={<MyPage />} />
```

### Custom Layouts

Create custom layouts by extending the base layouts:

```tsx
import { DashboardLayout } from '@ncq/router'

function CustomLayout() {
  return (
    <DashboardLayout>
      <div className="custom-wrapper">
        <Outlet />
      </div>
    </DashboardLayout>
  )
}
```

## Best Practices

1. **Always use lazy loading** for page components
2. **Protect sensitive routes** with appropriate roles/permissions
3. **Handle loading and error states** for better UX
4. **Use route guards** for feature flags and A/B testing
5. **Leverage micro-frontends** for team autonomy
6. **Monitor route performance** with analytics

## Troubleshooting

### Common Issues

1. **Blank page on navigation**
   - Check if the route component is properly exported
   - Verify lazy import path is correct

2. **Protected route redirects**
   - Ensure user has required roles/permissions
   - Check authentication state is loaded

3. **Micro-frontend loading errors**
   - Verify remote entry URLs are correct
   - Check CORS configuration
   - Ensure shared dependencies match

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/NCQ-sa/ncq-platform/issues)
- Documentation: [Router Guide](https://docs.ncq.com/router)
- Team: platform@ncq.com