# NCQ Design System

A comprehensive design system for the NCQ Platform, built with React, TypeScript, and Tailwind CSS. Includes a complete component library with Storybook documentation and support for both Arabic RTL and English LTR layouts.

## Features

- 🎨 **Complete Component Library** - Pre-built, accessible React components
- 🌍 **Multi-language Support** - Arabic RTL and English LTR layouts
- 🇸🇦 **Saudi-themed Components** - Components styled with Saudi green and gold colors
- 🎯 **NCQ Brand Integration** - Components using NCQ brand colors and styling
- 📱 **Responsive Design** - Mobile-first approach with breakpoint utilities
- ♿ **Accessibility First** - WCAG 2.1 AA compliant components
- 🎭 **Dark Mode Support** - Built-in light and dark theme variants
- 📖 **Storybook Documentation** - Interactive component documentation
- 🔧 **TypeScript Support** - Full type safety and IntelliSense
- 🎨 **Customizable Theming** - CSS variables and design tokens

## Installation

```bash
npm install @ncq/design-system
# or
yarn add @ncq/design-system
# or
pnpm add @ncq/design-system
```

## Quick Start

### 1. Import Styles

Import the CSS file in your app's root file:

```tsx
import '@ncq/design-system/styles/globals.css'
```

### 2. Use Components

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@ncq/design-system'

function App() {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Welcome to NCQ</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="ncq">Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

### 3. Configure Tailwind CSS

Add the design system to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@ncq/design-system/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Your custom theme extensions
    },
  },
  plugins: [],
}
```

## Components

### Core Components

- **Button** - Versatile button with multiple variants and states
- **Card** - Flexible content container with specialized variants
- **Input** - Form input with validation states and icons
- **Badge** - Status and labeling component with multiple styles

### Specialized Components

- **CardStats** - Statistics display card
- **CardMetric** - Metric display with trends
- **StatusBadge** - Status indicators
- **PriorityBadge** - Priority level indicators
- **SearchInput** - Search input with icon
- **PasswordInput** - Password input with visibility toggle

### Layout Components

- **Container** - Responsive container with max-width constraints
- **Stack** - Vertical and horizontal stacking
- **Grid** - Responsive grid layouts
- **Flex** - Flexible box layouts

### Form Components

- **FormField** - Form field wrapper with validation
- **FormLabel** - Accessible form labels
- **FormMessage** - Error and help text display

### Feedback Components

- **Alert** - Status and notification alerts
- **Toast** - Temporary notification messages
- **Loading** - Loading states and spinners
- **Skeleton** - Content placeholders

## Variants and Themes

### NCQ Brand Variants

```tsx
<Button variant="ncq">NCQ Primary</Button>
<Button variant="ncq-outline">NCQ Outline</Button>
<Button variant="ncq-ghost">NCQ Ghost</Button>
<Card variant="ncq">NCQ Card</Card>
```

### Saudi-themed Variants

```tsx
<Button variant="saudi">Saudi Button</Button>
<Card variant="saudi">Saudi Card</Card>
<Badge variant="saudi">Saudi Badge</Badge>
```

### Status Variants

```tsx
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="error">Error</Button>
<Badge variant="success-soft">Success</Badge>
```

## RTL Support

The design system includes full RTL (Right-to-Left) support for Arabic layouts:

```tsx
// RTL Layout
<div dir="rtl" className="rtl">
  <Button rightIcon={<ArrowRight className="rtl:rotate-180" />}>
    التالي
  </Button>
</div>

// LTR Layout
<div dir="ltr" className="ltr">
  <Button rightIcon={<ArrowRight />}>
    Next
  </Button>
</div>
```

## Responsive Design

Components are built with mobile-first responsive design:

```tsx
<Card className="w-full sm:w-96 lg:w-[500px]">
  <CardContent className="p-4 sm:p-6">
    <Button className="w-full sm:w-auto">
      Responsive Button
    </Button>
  </CardContent>
</Card>
```

## Dark Mode

Enable dark mode by adding the `dark` class to your root element:

```tsx
<html className="dark">
  {/* Your app content */}
</html>
```

Components automatically adapt to dark mode using CSS variables.

## Customization

### Design Tokens

The design system uses CSS variables for easy customization:

```css
:root {
  --ncq-primary-500: #0ea5e9;
  --ncq-secondary-500: #64748b;
  --saudi-green-500: #22c55e;
  --saudi-gold-500: #f59e0b;
}
```

### Custom Variants

Extend component variants using the `cn` utility:

```tsx
import { Button, cn } from '@ncq/design-system'

const CustomButton = ({ className, ...props }) => (
  <Button
    className={cn(
      'bg-purple-500 hover:bg-purple-600 text-white',
      className
    )}
    {...props}
  />
)
```

## Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/NCQ-sa/ncq-platform.git
cd ncq-platform/NCQ\ Platform/frontend/design-system

# Install dependencies
npm install

# Start Storybook development server
npm run storybook

# Build the library
npm run build

# Run tests
npm test
```

### Scripts

- `npm run build` - Build the library
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run type-check` - Type check TypeScript

## Storybook

View the interactive component documentation:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006` where you can:

- Browse all components
- Test different variants and props
- View component documentation
- Test RTL/LTR layouts
- Switch between light/dark themes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-component`
3. Make your changes and add tests
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -am 'Add new component'`
7. Push to the branch: `git push origin feature/new-component`
8. Submit a pull request

### Component Guidelines

When creating new components:

1. **Accessibility First** - Ensure WCAG 2.1 AA compliance
2. **RTL Support** - Test with Arabic content and RTL layout
3. **TypeScript** - Provide full type definitions
4. **Responsive** - Design mobile-first
5. **Documentation** - Add comprehensive Storybook stories
6. **Testing** - Include unit tests
7. **Brand Variants** - Support NCQ and Saudi themes

## License

MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

For questions and support:

- GitHub Issues: [Create an issue](https://github.com/NCQ-sa/ncq-platform/issues)
- Email: design-system@ncq.com
- Documentation: [Storybook](https://ncq-design-system.vercel.app)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes and version history.