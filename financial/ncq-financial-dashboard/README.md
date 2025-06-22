# NCQ Financial Dashboard

A modern, interactive financial dashboard for NCQ products with real-time data visualization and analysis.

## Features

- 📊 **Interactive Charts** - Line graphs, pie charts, and bar charts with smooth animations
- 🎨 **Modern UI** - Minimal corporate design with dark/light mode support
- 💱 **Currency Support** - Toggle between SAR and USD with automatic conversion
- ✏️ **Editable Data** - Dynamic data editing with automatic recalculation
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🚀 **Fast Performance** - Built with Vite and React for optimal speed

## Products Covered

1. **NCQ Payment Gateway (PGW)** - Digital payment processing solution
2. **NCQ LLM Platform** - Arabic-first AI platform for enterprises
3. **Smart Hospitality** - IoT-powered smart building management

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd ncq-financial-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Navigation

- **Introduction** - Welcome page with overview
- **Dashboard Overview** - Main dashboard with key metrics
- **Products** - Individual product analysis pages
- **Financial Analysis** - Detailed financial documents
- **Revenue Projections** - Market analysis and projections
- **Compare Products** - Side-by-side product comparison
- **Data Settings** - Manage and reset financial data

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Currency Conversion

- Base currency: SAR (Saudi Riyal)
- Exchange rate: 1 USD = 3.75 SAR
- Toggle currency display using the currency buttons throughout the app

## Data Management

- Data is stored in localStorage for persistence
- Edit pricing by clicking "Edit Pricing" on product pages
- Reset all data to defaults in the Settings page
- Changes are automatically saved

## License

Private and confidential for NCQ use only.