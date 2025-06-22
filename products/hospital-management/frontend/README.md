# Hospital Management SaaS - Frontend

A modern React-based frontend for the Hospital Management SaaS platform.

## Features Implemented

### Core Features
- ✅ **Multi-tenant Authentication**: JWT-based login with subdomain support
- ✅ **Role-based Access Control**: Admin, Doctor, Nurse, Receptionist roles
- ✅ **Responsive Dashboard**: Real-time statistics and charts
- ✅ **Patient Management**: Complete CRUD operations with advanced UI
- ✅ **Appointment Scheduling**: Calendar integration (in progress)
- ✅ **Doctor Management**: Staff profiles and schedules

### Technical Stack
- **React 18** with TypeScript
- **Material-UI (MUI) v5** for components
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **Formik + Yup** for form handling
- **Axios** for API calls
- **Chart.js** for data visualization

## Development Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on http://localhost:5000

### Installation
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application
```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Sidebar, Footer
│   ├── Dashboard/      # Dashboard widgets
│   └── Common/         # Shared components
├── pages/              # Page components
│   ├── Login.tsx       # Multi-tenant login
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Patients/       # Patient management
│   ├── Appointments/   # Appointment scheduling
│   └── Doctors/        # Doctor management
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   └── index.ts        # Store setup
├── services/           # API service layer
│   ├── api.ts          # Axios instance
│   └── auth.ts         # Auth helpers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## Key Components

### Patient Management
The patient management module includes:
- **Patient List**: DataGrid with search, filter, and pagination
- **Patient Dialog**: Create/Edit patient with comprehensive form
- **Patient Details**: View full patient information with tabs for:
  - Overview (personal, contact, emergency info)
  - Medical History
  - Prescriptions
  - Lab Results
  - Billing

### Authentication Flow
1. User enters subdomain (tenant identifier)
2. Login with email/password
3. JWT tokens stored in localStorage
4. Auto-refresh token mechanism
5. Role-based route protection

### State Management
Redux Toolkit slices:
- `authSlice`: Authentication state
- `patientSlice`: Patient data and operations
- `appointmentSlice`: Appointment scheduling
- `doctorSlice`: Doctor profiles
- `notificationSlice`: Toast notifications
- `tenantSlice`: Tenant configuration

## API Integration

### Base Configuration
```typescript
// src/services/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Authentication Headers
```typescript
// Automatically added to all requests
headers: {
  'Authorization': `Bearer ${token}`,
  'X-Tenant-ID': tenantId
}
```

## Styling Guidelines

### Theme Configuration
- Primary Color: `#1976d2` (Blue)
- Secondary Color: `#dc004e` (Red)
- Success: `#4caf50`
- Warning: `#ff9800`
- Error: `#f44336`

### Component Styling
- Use MUI's `sx` prop for component-specific styles
- Use `styled` for reusable styled components
- Follow Material Design principles

## Performance Optimizations
- React.memo for expensive components
- Lazy loading for routes
- Virtualized lists for large datasets
- Optimistic UI updates
- Request debouncing for search

## Testing
```bash
# Unit tests
npm test

# Test coverage
npm test -- --coverage

# E2E tests (coming soon)
npm run test:e2e
```

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Stripe public key

### Docker Deployment
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

## Contributing
1. Create feature branch
2. Make changes with proper TypeScript types
3. Write/update tests
4. Run linter and formatter
5. Submit PR with description

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend allows frontend origin
2. **Token expiry**: Check token refresh mechanism
3. **Type errors**: Run `npm run lint` to check types
4. **Build failures**: Clear cache with `rm -rf node_modules/.cache`

## Future Enhancements
- [ ] Real-time notifications with WebSockets
- [ ] Offline mode with service workers
- [ ] Progressive Web App (PWA) support
- [ ] Internationalization (i18n)
- [ ] Dark mode theme
- [ ] Advanced reporting module
- [ ] Video consultation integration