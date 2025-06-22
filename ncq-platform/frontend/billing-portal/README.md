# NCQ Billing Portal

A modern React-based billing portal for the NCQ Platform, providing comprehensive billing and subscription management capabilities.

## Features

### 🏠 Dashboard
- Real-time subscription status overview
- Usage metrics with visual indicators
- Pending invoices and payment alerts
- Recent billing activity

### 📊 Subscriptions
- View current subscription details
- Upgrade/downgrade plans with real-time proration preview
- Cancel or reactivate subscriptions
- Subscription history tracking

### 🧾 Invoices
- Complete invoice management with filtering and search
- Download PDF invoices
- Pay outstanding invoices with saved payment methods
- Retry failed payments
- Invoice status tracking (draft, pending, paid, overdue, cancelled)

### 💳 Payment Methods
- Secure payment method management via Stripe
- Add/remove credit cards and other payment methods
- Set default payment method for auto-billing
- PCI-compliant card storage

### 📈 Usage Analytics
- Detailed usage tracking with interactive charts
- Usage alerts and threshold management
- Usage projections based on current consumption
- Export usage data in multiple formats
- Real-time usage monitoring with limits

### ⚙️ Settings
- Profile management (name, email, phone, company)
- Security settings (password change, 2FA)
- Notification preferences (email/SMS)
- Billing preferences and address management
- Account data export

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Payment Processing**: Stripe React components
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite
- **Styling**: Emotion (CSS-in-JS)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout with navigation
│   └── PrivateRoute.tsx # Protected route wrapper
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Billing overview dashboard
│   ├── Subscriptions.tsx # Subscription management
│   ├── Invoices.tsx    # Invoice management
│   ├── PaymentMethods.tsx # Payment method management
│   ├── Usage.tsx       # Usage analytics and monitoring
│   ├── Settings.tsx    # Account and billing settings
│   └── Login.tsx       # Authentication page
├── services/           # API service layer
│   ├── api.ts         # Base API configuration
│   ├── authService.ts # Authentication APIs
│   ├── subscriptionService.ts # Subscription management APIs
│   ├── invoiceService.ts # Invoice management APIs
│   ├── paymentService.ts # Payment processing APIs
│   └── usageService.ts # Usage tracking APIs
├── store/             # Redux store configuration
│   ├── index.ts       # Store setup and configuration
│   └── slices/        # Redux slices for different features
│       ├── authSlice.ts
│       ├── subscriptionSlice.ts
│       ├── invoiceSlice.ts
│       ├── paymentSlice.ts
│       └── usageSlice.ts
├── types/             # TypeScript type definitions
│   └── index.ts       # All application types
├── theme.ts           # Material-UI theme configuration
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Key Features Implementation

### Authentication & Security
- JWT token-based authentication
- Automatic token refresh
- Protected routes with role-based access
- Secure API communication with interceptors

### Payment Integration
- Stripe Elements for secure card input
- PCI DSS compliant payment processing
- Setup intents for card storage
- Payment intents for immediate charges
- Webhook handling for payment status updates

### Data Management
- Centralized state management with Redux Toolkit
- Optimistic updates for better UX
- Error handling and retry mechanisms
- Data caching and synchronization

### User Experience
- Responsive design for mobile and desktop
- Real-time updates and notifications
- Loading states and error handling
- Accessibility compliance (WCAG 2.1)
- Progressive web app features

### Analytics & Monitoring
- Usage tracking with multiple metrics
- Interactive charts and visualizations
- Threshold-based alerting system
- Data export capabilities
- Real-time usage monitoring

## Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_NAME=NCQ Billing Portal
VITE_APP_VERSION=1.0.0
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm run test
   ```

## API Integration

The billing portal integrates with the NCQ Platform backend APIs:

- **Authentication API**: `/auth/*`
- **Billing API**: `/billing/*`
- **Subscription API**: `/billing/subscription/*`
- **Payment API**: `/billing/payment-methods/*`
- **Usage API**: `/billing/usage/*`

## Security Considerations

- All API communications use HTTPS
- Payment card data is handled by Stripe (PCI compliant)
- JWT tokens are stored securely
- Input validation on all forms
- XSS protection with Content Security Policy
- CSRF protection with tokens

## Performance Optimizations

- Code splitting with lazy loading
- Image optimization and lazy loading
- Redux state normalization
- Memoized components and selectors
- Efficient re-rendering with React.memo
- Bundle size optimization

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

1. Follow the established code structure
2. Use TypeScript for type safety
3. Follow Material-UI design patterns
4. Write unit tests for new features
5. Ensure responsive design compliance

## License

Proprietary - NCQ Platform