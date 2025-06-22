# Smart Hospitality Guest Portal - Frontend

A modern, responsive guest portal for the Smart Hospitality platform built with Next.js, TypeScript, and Tailwind CSS. This application provides guests with IoT room controls, service requests, real-time notifications, and seamless check-in/check-out experiences.

## 🚀 Features

### Core Functionality
- **Guest Authentication**: Secure login/registration with NextAuth.js
- **Dashboard**: Personalized welcome screen with room information and quick actions
- **IoT Room Controls**: Real-time control of room devices (lights, temperature, curtains, TV)
- **Service Requests**: Easy ordering of room service, housekeeping, maintenance, and concierge services
- **Service Request Forms**: Built-in forms to submit new service requests
- **Online Check-in**: Simple flow to complete check-in with mock data
- **Real-time Notifications**: Socket.io integration for instant updates
- **Multi-language Support**: English and Arabic (RTL) support
- **Payment Integration**: NCQ Payment Gateway integration for additional services

### Smart Features
- **Weather Widget**: Current weather information and recommendations
- **Voice Control**: Voice commands for room controls (when enabled)
- **Biometric Authentication**: Fingerprint/Face ID support (mobile)
- **Offline Mode**: Limited functionality when offline
- **Progressive Web App**: Installable mobile experience

### User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Mode**: Automatic theme detection
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: WCAG 2.1 compliant
- **Performance**: Optimized with Next.js 15 and Turbopack

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: TanStack Query (React Query)
- **Real-time**: Socket.io Client
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on port 3001
- NCQ Payment Gateway running on port 8080 (optional)

## 🚀 Getting Started

### 1. Installation

```bash
# Navigate to frontend directory
cd "/Users/kh/Desktop/NCQ co/Products/Smart Hospitality/frontend"

# Install dependencies
npm install
```

### 2. Environment Setup

The environment is already configured in `.env.local`. You can modify it if needed:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=smart-hospitality-secret-key-2024
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_NCQ_PGW_URL=http://localhost:8080
```

### 3. Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Demo Credentials

Use these credentials to test the application:
- **Email**: demo@smarthotel.com
- **Password**: demo123

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
│   ├── useLanguage.ts    # Multi-language support
│   └── useSocket.ts      # Socket.io integration
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   ├── auth.ts          # Authentication utilities
│   ├── config.ts        # App configuration
│   └── utils.ts         # General utilities
└── types/               # TypeScript type definitions
    └── index.ts         # Main type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 Multi-language Support

The application supports English and Arabic with automatic RTL layout. Toggle between languages using the language selector in the navigation bar.

## 📱 Mobile Experience

The application is fully responsive and includes:
- Bottom navigation for mobile devices
- Touch-friendly controls
- Optimized layouts for small screens
- Progressive Web App capabilities

## 🎯 Key Components

### Dashboard
- **WelcomeHeader**: Personalized greeting with booking information
- **RoomCard**: Room status and quick device controls
- **QuickActions**: Service request shortcuts
- **WeatherWidget**: Current weather with recommendations
- **ServiceRequests**: Real-time service request tracking

### IoT Integration
- Real-time device status updates
- Temperature, lighting, and curtain controls
- TV and entertainment system integration
- Safety and security features

### Payment Integration
- NCQ Payment Gateway integration
- Multiple payment methods
- Loyalty points system
- Transaction history

## 🔐 Security Features

- JWT-based authentication
- Secure API communication
- Input validation and sanitization
- CSRF protection

## 🚀 Performance Features

- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization
- Caching strategies
- Bundle size optimization

## 📞 Support

This is a complete Smart Hospitality Guest Portal frontend that showcases modern web development practices and provides an excellent user experience for hotel guests.

For technical questions or support, please refer to the main project documentation.

## 🧪 Testing

Run unit tests with Vitest:
```bash
npm test
```

