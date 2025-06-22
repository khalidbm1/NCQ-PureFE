# NCQ LLM Platform Authentication Integration

This document outlines the changes made to integrate the NCQ LLM frontend with the NCQ Platform authentication system.

## Overview

The NCQ LLM frontend has been updated to use the centralized NCQ Platform authentication service instead of its own JWT-based authentication. This provides seamless single sign-on (SSO) across all NCQ services and centralized user management.

## Key Changes

### 1. Platform Auth Client (`lib/platform-auth.ts`)
- **New File**: Created a comprehensive platform authentication client
- **Features**:
  - Platform login/signup with email/password
  - SSO integration with Google and GitHub
  - Automatic token refresh and management
  - Permission-based access control
  - Service-to-service authentication
  - Tenant-aware operations

### 2. Updated Auth Service (`lib/auth.ts`)
- **Complete Rewrite**: Replaced NextAuth-based authentication
- **Features**:
  - Wraps platform auth client with LLM-specific functionality
  - Manages user subscription data
  - Handles LLM service permissions
  - Integrates with platform user management

### 3. Updated Auth Store (`lib/store/auth.ts`)
- **Enhanced Functionality**: Added platform authentication methods
- **New Features**:
  - SSO login methods for Google and GitHub
  - Platform session management
  - Automatic token refresh
  - Error handling for platform-specific errors

### 4. Updated Authentication Pages

#### Login Page (`app/auth/login/page.tsx`)
- **SSO Integration**: Added functional Google and GitHub login buttons
- **Platform Authentication**: Uses platform auth service instead of NextAuth

#### Signup Page (`app/auth/signup/page.tsx`)
- **SSO Integration**: Added functional Google and GitHub signup buttons
- **Platform Registration**: Creates platform user account

#### SSO Callback Pages
- **New Files**:
  - `app/auth/callback/google/page.tsx`
  - `app/auth/callback/github/page.tsx`
- **Functionality**: Handle OAuth callbacks from SSO providers

### 5. Updated Providers (`components/providers.tsx`)
- **Removed NextAuth**: Replaced SessionProvider with custom PlatformAuthProvider
- **Enhanced**: Added authentication initialization and loading states
- **Error Handling**: Improved error handling for authentication failures

### 6. Updated API Client (`lib/api/client.ts`)
- **Platform Headers**: Automatically adds platform authentication headers
- **Service Context**: Includes service name and tenant information
- **Enhanced Error Handling**: Platform-specific error responses
- **Token Refresh**: Integrated with platform token refresh

### 7. Updated Middleware (`middleware.ts`)
- **Platform Tokens**: Checks for platform authentication tokens
- **Enhanced Routing**: Improved protected route handling
- **SSO Support**: Allows SSO callback routes

### 8. Updated Configuration (`lib/config.ts`)
- **Platform URLs**: Added platform service URLs
- **Enhanced Endpoints**: Comprehensive API endpoint configuration
- **Feature Flags**: Added feature toggles for different functionality
- **Service Config**: LLM service-specific configuration

## Environment Variables

### Required Environment Variables
```env
# Platform Configuration
NEXT_PUBLIC_PLATFORM_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_PLATFORM_API_GATEWAY=http://localhost:8080
NEXT_PUBLIC_LLM_BACKEND_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_SSO=true
NEXT_PUBLIC_ENABLE_WS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_BILLING=true
NEXT_PUBLIC_ENABLE_TRAINING=true
```

## Authentication Flow

### 1. Email/Password Login
1. User enters credentials on login page
2. Platform auth client sends request to platform auth service
3. Platform returns user data and tokens
4. LLM service enriches user data with subscription info
5. User is redirected to dashboard

### 2. SSO Login (Google/GitHub)
1. User clicks SSO button
2. Platform auth client requests SSO URL
3. User is redirected to OAuth provider
4. OAuth provider redirects to callback page
5. Callback page exchanges code for tokens
6. User is authenticated and redirected to dashboard

### 3. Token Management
- Access tokens are automatically refreshed when expired
- Platform handles token storage and security
- Service-to-service tokens are managed automatically

## Permission System

### LLM Service Permissions
- `llm:read` - Read access to models and data
- `llm:write` - Create/modify LLM resources
- `llm:admin` - Administrative access
- `llm:billing` - Billing and subscription management
- `llm:training` - Model training and fine-tuning

### Permission Checks
```typescript
import { hasLLMPermission } from '@/lib/auth'

// Check if user can access models
if (hasLLMPermission('read')) {
  // Allow model access
}

// Check if user can manage billing
if (hasLLMPermission('billing')) {
  // Show billing interface
}
```

## API Integration

### Headers
All API requests now include:
- `Authorization: Bearer <platform_token>`
- `X-Service-Name: ncq-llm`
- `X-API-Version: v1`
- `X-Tenant-ID: <tenant_id>`
- `X-User-ID: <user_id>`
- `X-User-Role: <user_role>`

### Error Handling
- 401 errors trigger automatic token refresh
- 403 errors show permission denied messages
- 429 errors show rate limit messages

## Migration Guide

### For Existing Users
1. Existing JWT tokens will be invalidated
2. Users will be redirected to platform login
3. User data will be migrated to platform system
4. Subscriptions will be preserved

### For Developers
1. Remove NextAuth dependencies
2. Update authentication calls to use new auth store
3. Use platform auth utilities for permission checks
4. Update API calls to use new endpoints

## Security Features

### Token Security
- Short-lived access tokens (15 minutes)
- Secure refresh token rotation
- HttpOnly cookies for sensitive data
- CSRF protection

### Permission System
- Role-based access control
- Fine-grained permissions
- Tenant isolation
- Service-specific scopes

### Audit Trail
- All authentication events logged
- Permission changes tracked
- API access monitored

## Backward Compatibility

### Deprecated Features
- NextAuth session management
- JWT token storage in localStorage
- Legacy API endpoints

### Migration Path
- Old authentication methods will continue to work during transition
- New features require platform authentication
- Gradual migration of existing users

## Testing

### Test Accounts
- Development environment includes test accounts
- SSO testing with test OAuth applications
- Permission testing across different roles

### Integration Tests
- Authentication flows
- Token refresh scenarios
- Permission enforcement
- API security

## Monitoring

### Metrics
- Authentication success/failure rates
- Token refresh frequency
- Permission denial counts
- API response times

### Alerts
- Authentication service downtime
- High error rates
- Security violations
- Performance degradation

## Support

### Documentation
- Platform auth API documentation
- Integration guides
- Troubleshooting guides

### Contact
- Platform team for auth service issues
- LLM team for service-specific issues
- DevOps team for infrastructure issues