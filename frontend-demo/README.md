# NCQ Platform Demo

An interactive frontend demonstration of the NCQ Platform, showcasing all major modules with realistic mock data and engaging user interactions.

## 🚀 Features

- **Interactive Tour**: Guided walkthrough using React Joyride
- **Sticky Note Credentials**: Easy access to demo login information
- **Real-time Simulations**: Live data updates and mock API responses
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Themes**: Professional styling with Tailwind CSS
- **Rich Animations**: Smooth transitions with Framer Motion
- **Chart Visualizations**: Interactive charts with Recharts

## 🏗️ Platform Modules

### 1. Dashboard
- Real-time metrics and KPIs
- Revenue trends and analytics
- System health monitoring
- Recent activity feeds

### 2. Payment Gateway
- Multi-channel payment processing
- mada, Visa, Mastercard support
- Transaction monitoring
- Fraud detection simulation

### 3. Hospital Management
- Patient management system
- Appointment scheduling
- Vital signs monitoring
- Financial analytics

### 4. Smart Hospitality
- Hotel management platform
- IoT device integration
- Guest experience optimization
- Room availability tracking

### 5. IoT Platform
- Device monitoring and control
- Real-time sensor data
- Alert management
- Device distribution mapping

### 6. AI/LLM Platform
- Language model interactions
- Model performance analytics
- AI playground with parameters
- Conversation history

## 🎯 Demo Features

### Interactive Tour
- Automatic guided tour for new users
- Highlights key features and functionality
- Can be restarted at any time
- Customizable tour steps

### Mock Data & Simulations
- Realistic business data
- Live chart updates
- Simulated API responses
- Dynamic status changes

### User Experience
- Tooltips for enhanced usability
- Toast notifications for feedback
- Smooth animations and transitions
- Intuitive navigation

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Tour**: React Joyride
- **Icons**: React Icons (Feather)
- **Build Tool**: Vite
- **State Management**: Zustand

## 🚦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5173`

4. **Start Interactive Tour**
   The tour will automatically start on first visit

## 📋 Demo Credentials

Use these credentials for testing different user roles:

- **Admin User**: admin@ncq.sa / Demo@2024
- **Hospital Manager**: hospital.manager@demo.com / Hospital@123
- **Hotel Manager**: hotel.manager@demo.com / Hotel@123
- **Payment Merchant**: merchant@demo.com / Merchant@123
- **Test Card (mada)**: 4400 0000 0000 0008 / 12/25, CVV: 123

## 🎨 Customization

### Tour Steps
Edit `src/App.tsx` to modify tour steps:

```typescript
const tourSteps: Step[] = [
  {
    target: '.tour-welcome',
    content: 'Your custom message here',
    placement: 'center',
  },
  // Add more steps...
]
```

### Mock Data
Update mock data in each page component to reflect your specific use case.

### Styling
Customize colors and themes in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      }
    }
  }
}
```

## 📱 Mobile Responsive

The demo is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔧 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📈 Performance

- Lazy loading for optimal performance
- Optimized bundle splitting
- Efficient state management
- Minimal re-renders

## 🎭 Demo Tips

1. **Start with the Landing Page** for best experience
2. **Use the Interactive Tour** to understand features
3. **Click the Sticky Note** for easy credential access
4. **Try different modules** to see various capabilities
5. **Interact with charts and data** for live updates

## 🤝 For Stakeholders

This demo showcases:
- **Technical Capabilities**: Modern tech stack and architecture
- **User Experience**: Intuitive design and interactions
- **Business Value**: Comprehensive platform features
- **Scalability**: Modular and extensible design
- **Professional Quality**: Production-ready interface

## 📞 Support

For questions or customizations, contact the NCQ development team.

---

**NCQ Platform Demo** - Showcasing the future of integrated business solutions.