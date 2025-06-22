# NCQ IoT Platform Dashboard

A modern, real-time dashboard for monitoring and controlling IoT devices in the NCQ Platform.

## Features

- **Real-time Monitoring**: Live telemetry data streaming via WebSocket
- **Device Management**: Add, configure, and control IoT devices
- **Interactive Visualizations**: Charts and graphs for telemetry data
- **Automation Rules**: Create and manage device automation
- **Multi-tenant Support**: Complete tenant isolation
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Automatic theme switching

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **React Query** for data fetching
- **WebSocket** for real-time updates
- **Radix UI** for accessible components

## Getting Started

### Prerequisites

- Node.js 18+
- IoT Service running on port 3003
- Valid NCQ Platform credentials

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3005`

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3003
VITE_WS_URL=ws://localhost:3003/ws
VITE_AUTH_URL=http://localhost:3001
```

## Pages

### Dashboard
- Overview of all devices and system status
- Real-time telemetry trends
- Recent alerts and notifications
- Device type distribution

### Devices
- List all registered devices
- Add new devices
- Update device status
- Delete devices
- Filter by type and status

### Device Detail
- Individual device information
- Real-time telemetry streaming
- Historical data charts
- Device commands and controls
- Configuration management

### Telemetry
- Query historical telemetry data
- Export data in various formats
- Advanced filtering options
- Data aggregation tools

### Automation
- Create automation rules
- Trigger-action workflows
- Rule management
- Execution history

### Analytics
- Advanced data analytics
- Custom dashboards
- Predictive insights
- Anomaly detection

## Real-time Features

### WebSocket Integration

The dashboard maintains a persistent WebSocket connection for:
- Live telemetry updates
- Device status changes
- Alert notifications
- Command responses

### Subscription Topics

```javascript
// Tenant-wide topics
tenant/{tenantId}/telemetry
tenant/{tenantId}/alerts
tenant/{tenantId}/device_status

// Device-specific topics
device/{deviceId}/telemetry
device/{deviceId}/status
device/{deviceId}/alerts
```

## UI Components

### Cards
- Stats cards with real-time updates
- Device cards with status indicators
- Alert cards with severity levels

### Charts
- Line charts for time-series data
- Area charts for aggregated metrics
- Bar charts for comparisons
- Pie charts for distributions

### Tables
- Sortable device lists
- Filterable telemetry data
- Paginated results

### Forms
- Device registration
- Automation rule builder
- Settings configuration

## Development

### Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React contexts (Auth, WebSocket)
├── hooks/           # Custom React hooks
├── layouts/         # Page layouts
├── lib/            # Utilities and helpers
├── pages/          # Page components
├── services/       # API services
└── types/          # TypeScript definitions
```

### Key Components

1. **WebSocketContext**: Manages real-time connection
2. **AuthContext**: Handles authentication state
3. **Dashboard**: Main overview page
4. **DeviceList**: Device management interface
5. **TelemetryChart**: Real-time data visualization

### API Integration

```typescript
// Device API
GET    /api/v1/devices
POST   /api/v1/devices
GET    /api/v1/devices/:id
PATCH  /api/v1/devices/:id
DELETE /api/v1/devices/:id

// Telemetry API
GET    /api/v1/telemetry/query
GET    /api/v1/telemetry/device/:id
POST   /api/v1/telemetry/export

// Automation API
GET    /api/v1/automation/rules
POST   /api/v1/automation/rules
PATCH  /api/v1/automation/rules/:id
DELETE /api/v1/automation/rules/:id
```

## Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## Deployment

### Build for Production

```bash
npm run build
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### Environment-specific Builds

```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## Performance Optimization

- Lazy loading for routes
- Memoization for expensive computations
- Virtual scrolling for large lists
- Debounced search inputs
- Optimistic UI updates
- Request deduplication

## Security

- JWT token authentication
- Secure WebSocket connections
- CORS configuration
- Input validation
- XSS protection
- Rate limiting

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Part of the NCQ Platform - see main LICENSE file