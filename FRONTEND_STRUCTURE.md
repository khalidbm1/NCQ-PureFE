# NCQ Frontend Architecture Overview

This document provides a comprehensive guide to all frontend projects in the NCQ ecosystem. All frontend code has been consolidated into this `pure-frontend` directory for easier development and maintenance.

## Table of Contents
1. [Directory Structure](#directory-structure)
2. [Frontend Projects Overview](#frontend-projects-overview)
3. [Technology Stack](#technology-stack)
4. [Development Setup](#development-setup)
5. [Port Assignments](#port-assignments)
6. [Shared Components and Dependencies](#shared-components-and-dependencies)
7. [Development Guidelines](#development-guidelines)

## Directory Structure

```
pure-frontend/
├── frontend-demo/                    # Demo frontend application
├── ncq-platform-demo/               # Complete demo suite
│   ├── admin-dashboard/             # Admin control panel
│   ├── api-portal/                  # API documentation portal
│   ├── hospital-management/         # Hospital management system
│   ├── hospitality-staff/           # Hospitality staff management
│   ├── iot-platform/                # IoT device management
│   ├── landing-page/                # Main landing page
│   ├── llm-platform/                # LLM/AI platform interface
│   ├── payment-admin/               # Payment admin dashboard
│   ├── payment-gateway/             # Payment gateway interface
│   ├── payment-merchant/            # Merchant dashboard
│   ├── smart-hospitality/           # Smart hospitality guest app
│   └── user-portal/                 # User-facing portal
├── ncq-platform/                    # Core platform frontends
│   ├── admin-dashboard/             # Platform administration
│   ├── analytics-dashboard/         # Analytics and reporting
│   └── frontend/                    # Core frontend modules
│       ├── admin-dashboard/
│       ├── billing-portal/
│       ├── landing-page/
│       ├── user-portal/
│       ├── design-system/           # Shared component library
│       ├── router/                  # Micro-frontend router
│       └── shared/                  # Shared utilities
├── products/                        # Product-specific frontends
│   ├── hospital-management/
│   ├── ncq-llm/
│   ├── ncq-pgw/                     # Payment Gateway
│   └── smart-hospitality/
├── shared-services/                 # Shared service frontends
│   ├── affiliate-system/
│   └── support-system/
├── core-technologies/               # Core tech frontends
│   ├── blockchain/
│   └── iot-platform/
├── financial/                       # Financial dashboards
│   └── ncq-financial-dashboard/
├── demo/                           # Demo applications
└── frontend/                       # Legacy frontend directory
```

## Frontend Projects Overview

### 1. Frontend Demo (`frontend-demo/`)
- **Purpose**: Showcase and demonstration of NCQ platform capabilities
- **Framework**: React + Vite + TypeScript
- **Features**: Interactive demos of all platform features

### 2. NCQ Platform Demo Suite (`ncq-platform-demo/`)

#### Admin Dashboard
- **Purpose**: Central administration panel for platform management
- **Framework**: React + Vite + TypeScript
- **Key Features**: User management, tenant administration, system monitoring

#### API Portal
- **Purpose**: Developer portal for API documentation and testing
- **Framework**: Next.js 14 + TypeScript
- **Key Features**: API explorer, SDK downloads, interactive documentation

#### Hospital Management System
- **Purpose**: Complete hospital operations management
- **Framework**: React + TypeScript
- **Key Features**: Patient records, appointments, billing, prescriptions

#### Hospitality Staff App
- **Purpose**: Staff management for hospitality industry
- **Framework**: Next.js 14 + TypeScript
- **Key Features**: Room management, housekeeping tasks, guest services

#### IoT Platform
- **Purpose**: IoT device management and monitoring
- **Framework**: React + Vite + TypeScript
- **Key Features**: Device provisioning, real-time monitoring, automation rules

#### LLM Platform
- **Purpose**: AI/LLM service management interface
- **Framework**: Next.js 14 + TypeScript
- **Key Features**: Model management, API keys, usage analytics, sandbox

#### Payment Gateway
- **Purpose**: Payment processing and management
- **Framework**: React + Vite + TypeScript
- **Key Features**: Transaction management, merchant tools, analytics

#### Smart Hospitality
- **Purpose**: Guest-facing hospitality application
- **Framework**: Next.js 14 + TypeScript
- **Key Features**: Room controls, service requests, check-in/out

### 3. Core Platform (`ncq-platform/`)
- **Design System**: Shared component library using Tailwind CSS
- **Router**: Micro-frontend orchestration
- **Shared**: Common utilities and authentication logic

### 4. Products (`products/`)
Individual product frontends with specialized features for each vertical.

### 5. Shared Services (`shared-services/`)
Cross-platform services like affiliate management and support systems.

## Technology Stack

### Common Technologies
- **TypeScript**: Type-safe development across all projects
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand/Redux**: State management
- **React Query/SWR**: Data fetching and caching
- **Axios**: HTTP client

### Framework Distribution
```
React + Vite:
- Admin dashboards
- IoT platform
- Payment gateway
- Landing pages

Next.js:
- API portal
- LLM platform
- Smart hospitality
- Hospitality staff
- Payment admin/merchant
```

## Development Setup

### Prerequisites
```bash
# Node.js 18+ and npm/yarn
node --version  # Should be 18.x or higher
npm --version   # Should be 8.x or higher
```

### Quick Start
Since node_modules are included, you can start any project immediately:

```bash
# Example: Start the admin dashboard
cd ncq-platform-demo/admin-dashboard
npm run dev

# Example: Start the LLM platform
cd ncq-platform-demo/llm-platform
npm run dev
```

### Fresh Installation (if needed)
```bash
# Remove existing node_modules
rm -rf node_modules

# Install dependencies
npm install

# Start development server
npm run dev
```

## Port Assignments

To avoid conflicts when running multiple frontends simultaneously:

```
Frontend Demo:              http://localhost:3000
Admin Dashboard:            http://localhost:3001
API Portal:                 http://localhost:3002
Hospital Management:        http://localhost:3003
Hospitality Staff:          http://localhost:3004
IoT Platform:              http://localhost:3005
Landing Page:              http://localhost:3006
LLM Platform:              http://localhost:3007
Payment Admin:             http://localhost:3008
Payment Gateway:           http://localhost:3009
Payment Merchant:          http://localhost:3010
Smart Hospitality:         http://localhost:3011
User Portal:               http://localhost:3012
Financial Dashboard:       http://localhost:3013
Analytics Dashboard:       http://localhost:3014
Billing Portal:            http://localhost:3015
```

## Shared Components and Dependencies

### Design System (`ncq-platform/frontend/design-system/`)
- Button, Card, Input, Badge components
- Consistent theming and styling
- Tailwind configuration

### Common Patterns
1. **Authentication**: Shared auth context and guards
2. **API Client**: Centralized API configuration
3. **Internationalization**: Arabic/English support
4. **Theme**: Light/Dark mode support
5. **Error Handling**: Consistent error boundaries

### Shared Dependencies
- `@ncq/design-system`: Internal component library
- `@ncq/shared-utils`: Common utilities
- `@ncq/api-client`: Standardized API client

## Development Guidelines

### Code Style
1. **TypeScript**: Strict mode enabled
2. **ESLint**: Consistent linting rules
3. **Prettier**: Code formatting
4. **Naming Conventions**:
   - Components: PascalCase
   - Utilities: camelCase
   - Constants: UPPER_SNAKE_CASE

### Component Structure
```typescript
// Example component structure
src/
├── components/
│   ├── common/          # Shared components
│   ├── features/        # Feature-specific components
│   └── ui/             # Pure UI components
├── hooks/              # Custom React hooks
├── services/           # API services
├── stores/             # State management
├── types/              # TypeScript types
└── utils/              # Utility functions
```

### State Management
- **Local State**: useState for component-level state
- **Global State**: Zustand for app-level state
- **Server State**: React Query/SWR for API data

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Building for Production
```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## Inter-Frontend Communication

### Shared Authentication
All frontends use a centralized authentication service:
- JWT tokens stored in httpOnly cookies
- Automatic token refresh
- Single sign-on (SSO) support

### Cross-Origin Communication
For frontends that need to communicate:
- PostMessage API for iframe communication
- Shared localStorage with domain restrictions
- WebSocket connections for real-time updates

## Deployment

### Docker Support
Each frontend includes Docker configuration:
```bash
# Build Docker image
docker build -t ncq-frontend-name .

# Run container
docker run -p 3000:3000 ncq-frontend-name
```

### Environment Variables
Create `.env.local` for each project:
```env
NEXT_PUBLIC_API_URL=https://api.ncq.sa
NEXT_PUBLIC_WS_URL=wss://ws.ncq.sa
NEXT_PUBLIC_TENANT_ID=default
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on specific port
   lsof -ti:3000 | xargs kill
   ```

2. **Module Resolution Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build Errors**
   - Check TypeScript errors: `npm run type-check`
   - Verify environment variables
   - Clear build cache: `rm -rf .next dist`

## Contributing

1. Create feature branch from `main`
2. Follow naming convention: `feature/module-name`
3. Write tests for new features
4. Update documentation
5. Submit PR with description

## Support

For questions or issues:
- Internal Wiki: [Internal documentation link]
- Slack: #frontend-dev
- Email: frontend-team@ncq.sa

---

Last Updated: June 2025
Maintained by: NCQ Frontend Team