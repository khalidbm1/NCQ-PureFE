# NCQ Frontend Testing Guide

## Overview

The NCQ frontend uses Jest as the primary testing framework with React Testing Library for component testing and Cypress for E2E testing.

## Test Structure

```
frontend/
├── jest.config.js           # Root Jest configuration
├── jest.config.base.js      # Base configuration for all projects
├── jest.setup.js            # Global test setup
├── __mocks__/              # Global mocks
├── cypress/                # E2E tests
│   ├── e2e/               # E2E test specs
│   ├── support/           # Custom commands and utilities
│   └── fixtures/          # Test data
├── apps/
│   └── */
│       ├── jest.config.js # App-specific Jest config
│       └── src/**/*.test.tsx
└── libs/
    └── */
        ├── jest.config.js # Library-specific Jest config
        └── src/**/*.test.ts
```

## Running Tests

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run tests for specific workspace
npm test -- --selectProjects=design-system
```

### E2E Tests

```bash
# Open Cypress UI
npm run e2e

# Run E2E tests headlessly
npm run e2e:headless

# Run specific E2E test
npm run e2e:headless -- --spec "cypress/e2e/auth.cy.ts"
```

## Writing Tests

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### API Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import * as api from '@/services/api';

jest.mock('@/services/api');

describe('UserProfile', () => {
  it('should load user data', async () => {
    const mockUser = { id: '1', name: 'Test User' };
    (api.getUser as jest.Mock).mockResolvedValue(mockUser);
    
    render(<UserProfile userId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });
});
```

## Test Utilities

### Custom Render

Use the custom render from `@ncq/test-utils` for components that need providers:

```typescript
import { render } from '@ncq/test-utils';
import { Dashboard } from './Dashboard';

test('renders dashboard', () => {
  render(<Dashboard />, {
    router: { pathname: '/dashboard' }
  });
});
```

### Mock Data Factories

```typescript
import { createMockUser, createMockPayment } from '@ncq/test-utils';

const user = createMockUser({
  email: 'custom@ncq.sa'
});

const payment = createMockPayment({
  amount: 500.00,
  status: 'COMPLETED'
});
```

### Accessibility Testing

```typescript
import { render } from '@ncq/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<LoginForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Coverage Requirements

- **Global**: 80% minimum coverage
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

Coverage reports are generated in `coverage/` directory.

## Best Practices

### 1. Test Organization

- One test file per component/module
- Group related tests with `describe`
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Component Testing

- Test user interactions, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Avoid testing internal state
- Mock external dependencies

### 3. Async Testing

```typescript
// ✅ Good
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// ❌ Bad
setTimeout(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, 1000);
```

### 4. Mock Management

```typescript
// Setup file or test file
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### 5. E2E Best Practices

- Use data-testid for E2E selectors
- Create reusable commands
- Use fixtures for test data
- Run against a test environment

## Debugging Tests

### Debug Output

```typescript
import { screen, debug } from '@testing-library/react';

test('debug example', () => {
  render(<Component />);
  
  // Print the DOM
  screen.debug();
  
  // Print specific element
  screen.debug(screen.getByRole('button'));
});
```

### VS Code Debugging

1. Add breakpoint in test
2. Run "Jest: Debug" from command palette
3. Or use launch configuration:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--watchAll=false"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Common Issues

### 1. Module Resolution

If imports fail in tests:
```javascript
// jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### 2. CSS Modules

CSS imports are mocked by default:
```javascript
moduleNameMapper: {
  '\\.(css|less|scss)$': 'identity-obj-proxy',
}
```

### 3. Next.js Image

Next/Image is mocked in jest.setup.js to return a regular img element.

### 4. Environment Variables

Set test environment variables:
```javascript
// jest.setup.js
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000';
```

## CI Integration

Tests run automatically on:
- Pull requests
- Pushes to main/develop
- Pre-commit hooks (optional)

Failed tests block merging and deployment.