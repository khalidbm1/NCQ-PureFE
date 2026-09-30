# NCQ Pure Frontend Platform

A collection of pure frontend demos for NCQ's SaaS products and platform, deployed on Firebase with automatic CI/CD.

🔗 **Live Demo**: [https://ncq-pure-frontend.web.app](https://ncq-pure-frontend.web.app)

## 🎯 Overview

This repository contains pure frontend implementations of various NCQ SaaS products designed for demonstration purposes. All applications feature:

- ✅ No authentication required (auto-login with demo credentials)
- 🎨 Modern, responsive UI with dark mode support
- 🌐 Multi-language support (English & Arabic)
- 🚀 Interactive demos with mock data
- 📱 Mobile-friendly design
- 🎭 Guided user journeys and tutorials

## 📦 Available Products

### 1. **User Portal** 
- File management system
- Upload & share functionality
- Analytics dashboard
- API key management
- Team collaboration features

### 2. **Admin Dashboard**
- Enterprise management interface
- Tenant administration
- User management
- Payment processing
- System analytics

### 3. **Hospital Management System** (Coming Soon)
- Patient management
- Appointment scheduling
- Medical records
- Healthcare analytics

### 4. **IoT Platform** 
- Device monitoring
- Real-time telemetry
- Automation rules
- Device provisioning

### 5. **Financial Dashboard**
- Revenue projections
- Financial analytics
- Multi-product analysis
- KSA market insights

## 🔐 Demo Credentials

All applications auto-login with these demo credentials:

```
Email: user@ncq.sa
Password: user123
API Key: demo-api-key-12345
```

A collapsible credentials panel is available in the bottom-right corner of each application for easy access.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NCQ-sa/Pure-frontend.git
cd Pure-frontend
```

2. Install dependencies for a specific product:
```bash
# User Portal
cd ncq-platform-demo/user-portal
npm install

# Admin Dashboard
cd ncq-platform-demo/admin-dashboard
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🚢 Deployment

### Automatic Deployment

The project is configured with GitHub Actions for automatic deployment to Firebase on every push to the `main` branch.

### Manual Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Deploy to Firebase:
```bash
firebase deploy
```

## 🏗️ Project Structure

```
NCQ-pure-FE/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── ncq-platform-demo/
│   ├── user-portal/           # User portal application
│   ├── admin-dashboard/       # Admin dashboard application
│   └── hospital-management/   # Hospital management system
├── core-technologies/
│   ├── blockchain/           # Blockchain demos
│   └── iot-platform/         # IoT platform demos
├── financial/                # Financial dashboard
├── firebase.json            # Firebase hosting configuration
└── README.md               # This file
```

## 🎨 Features

### Interactive User Journeys
Each application includes guided tours that help users understand the platform features:
- File Management Workflow
- API Integration Journey
- Team Collaboration Tutorial

### Mock Data & Simulations
- Realistic file uploads with progress tracking
- Interactive analytics with dynamic charts
- Simulated API responses
- Real-time data updates

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Adaptive layouts

## 🛠️ Technologies Used

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Headless UI components
- **React Router** - Navigation
- **Zustand** - State management
- **Firebase** - Hosting & deployment
- **GitHub Actions** - CI/CD

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in each product directory:

```env
VITE_API_URL=https://api.ncq.sa
VITE_FIREBASE_PROJECT_ID=ncq-pure-frontend
```

### Firebase Configuration

The Firebase configuration is stored in:
- `firebase.json` - Hosting configuration
- `.firebaserc` - Project settings

## 📄 License

This project is proprietary software owned by Khalid bin Ibrahim Al-Muhanna, licensed to NCQ Solutions.

## 🤝 Support

For support, email support@ncq.sa or visit our [documentation](https://docs.ncq.sa).

---

Built with ❤️ by NCQ Solutions