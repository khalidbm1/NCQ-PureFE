# NCQ Platform - User Portal

A modern, responsive web application for smart hospitality and building management with AI-powered insights.

## 🚀 Quick Deploy

Deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ncq-platform)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/ncq-platform)

## Features

### 🔐 Authentication & Security
- Secure login and registration with JWT tokens
- Password strength validation
- Automatic token refresh
- Two-factor authentication support
- Remember me functionality

### 📊 Dashboard & Analytics
- Real-time statistics dashboard
- File upload/download tracking
- Storage usage monitoring
- API usage analytics
- Recent activity feed

### 📁 File Management
- Drag & drop file uploads
- File sharing with expiring links
- Public/private file visibility
- File type detection and icons
- Download tracking
- Storage quota management

### 👥 Team Collaboration
- Team member invitations
- Role-based access control
- Shared file spaces
- Activity notifications

### 🔑 Developer Tools
- API key management
- Usage analytics
- Rate limiting information
- Developer documentation

### 🎨 Modern UI/UX
- Dark/light mode toggle
- Responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Accessible components with Radix UI
- Toast notifications
- Loading states and error handling

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Form Validation**: React Hook Form + Zod
- **Notifications**: Sonner

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://api.ncq.sa
```

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (button, card, etc.)
│   ├── layout/         # Layout components (header, sidebar)
│   └── forms/          # Form components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── profile/        # Profile pages
├── services/           # API services
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── hooks/              # Custom React hooks
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/layout/Sidebar.tsx`

### API Integration

The app uses a centralized API service with automatic token refresh:

```typescript
import { apiService } from '../services/api'

// Example usage
const files = await apiService.getFiles()
const uploadResult = await apiService.uploadFile(file)
```

### State Management

User authentication state is managed with Zustand:

```typescript
import { useAuthStore } from '../stores/auth'

const { user, login, logout, isAuthenticated } = useAuthStore()
```

## Features in Detail

### Authentication Flow
- Login/Register with email validation
- JWT token storage with automatic refresh
- Protected routes with redirect
- Persistent sessions with localStorage

### File Management
- Multi-format file support
- Progress tracking for uploads
- File sharing with custom links
- Storage quota visualization
- File type icons and previews

### User Experience
- Responsive navigation with collapsible sidebar
- Dark mode with system preference detection
- Loading states and error boundaries
- Toast notifications for user feedback
- Smooth page transitions

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include responsive design considerations
4. Test on multiple screen sizes
5. Update documentation for new features

## License

Private - NCQ Platform © 2024