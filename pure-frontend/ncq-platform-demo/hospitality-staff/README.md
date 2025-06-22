# Smart Hospitality Staff Dashboard

A comprehensive hotel management system for staff operations, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Core Functionality

- **Role-Based Access Control (RBAC)**
  - Admin, Manager, Front Desk, Housekeeping, Maintenance roles
  - Permission-based feature access
  - Secure authentication system

- **Property Overview Dashboard**
  - Real-time occupancy metrics
  - Revenue tracking and analytics
  - Task and activity monitoring
  - Quick action shortcuts

- **Room Management**
  - Visual room grid with status indicators
  - Quick status updates (Available, Occupied, Cleaning, etc.)
  - Floor-based organization
  - Advanced filtering and search
  - Detailed room information modal

- **Guest Management**
  - Guest profiles and preferences
  - Check-in/check-out workflows
  - Reservation management
  - Guest history tracking

- **Housekeeping Management**
  - Task creation and assignment
  - Priority-based task queue
  - Schedule calendar view
  - Supply tracking
  - Performance monitoring

- **Maintenance Tracking**
  - Work order management
  - Request prioritization
  - Technician assignment
  - Cost tracking
  - Parts inventory

- **IoT Device Monitoring**
  - Real-time device status
  - Remote control capabilities
  - Alert management
  - Energy usage tracking

- **Analytics & Reporting**
  - Occupancy trends
  - Revenue analysis
  - Staff performance metrics
  - Custom report generation

- **Inventory Management**
  - Supply level tracking
  - Automatic reorder alerts
  - Usage analytics
  - Vendor management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd "/Users/kh/Desktop/NCQ co/Products/Smart Hospitality/staff-dashboard"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

- **Admin**: admin@hotel.com / admin123
- **Manager**: manager@hotel.com / manager123
- **Front Desk**: frontdesk@hotel.com / frontdesk123
- **Housekeeping**: housekeeping@hotel.com / housekeeping123

## Project Structure

```
staff-dashboard/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── rooms/             # Room management
│   ├── guests/            # Guest management
│   ├── housekeeping/      # Housekeeping tasks
│   ├── maintenance/       # Maintenance requests
│   ├── analytics/         # Analytics & reports
│   ├── inventory/         # Inventory management
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard widgets
│   ├── rooms/            # Room components
│   ├── housekeeping/     # Task components
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and libraries
│   ├── api/              # API client
│   ├── stores/           # Zustand stores
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
└── public/               # Static assets
```

## Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios
- **Data Fetching**: TanStack Query
- **Charts**: Chart.js with react-chartjs-2
- **UI Components**: Headless UI, Heroicons
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Real-time**: Socket.io Client
- **Date Handling**: date-fns
- **Animations**: Framer Motion

## Key Features Implementation

### Authentication Flow
- JWT-based authentication
- Persistent sessions with Zustand
- Protected routes
- Role-based navigation

### Real-time Updates
- WebSocket integration for live updates
- Notification system
- Activity feed
- Device status monitoring

### Performance Optimizations
- Code splitting
- Lazy loading
- Optimistic updates
- Response caching

## API Integration

The dashboard includes mock API endpoints for development. In production, replace these with your actual backend API:

1. Update `API_BASE_URL` in `/lib/api/client.ts`
2. Configure authentication endpoints
3. Set up WebSocket connection
4. Configure CORS settings

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_WS_URL=wss://your-websocket-url.com
```

### Deploy to Vercel

```bash
vercel deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software for Smart Hospitality systems.