import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';

// Mock router
const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
  router?: Partial<NextRouter>;
}

// All providers wrapper
const AllTheProviders: React.FC<AllTheProvidersProps> = ({ 
  children, 
  router = {} 
}) => {
  const testQueryClient = createTestQueryClient();
  const testRouter = { ...mockRouter, ...router };

  return (
    <RouterContext.Provider value={testRouter}>
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </RouterContext.Provider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    router?: Partial<NextRouter>;
  }
) => {
  const { router, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders router={router}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Utility functions for testing
export const waitForLoadingToFinish = () =>
  screen.findByText((content, element) => {
    if (!element) return false;
    return !element.className?.includes('loading');
  });

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  firstNameAr: 'اختبار',
  lastNameAr: 'مستخدم',
  phoneNumber: '0501234567',
  nationalId: '1234567890',
  roles: ['USER'],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockPayment = (overrides = {}) => ({
  id: '1',
  amount: 100.0,
  currency: 'SAR',
  status: 'PENDING',
  paymentMethod: 'CARD',
  description: 'Test payment',
  merchantReference: 'TEST-001',
  createdAt: new Date().toISOString(),
  ...overrides,
});

// Custom matchers
export const toHaveNoViolations = (received: any) => {
  const pass = received.violations.length === 0;
  
  if (pass) {
    return {
      message: () => 'expected accessibility violations',
      pass: true,
    };
  } else {
    return {
      message: () => 
        `expected no accessibility violations but received:\n${received.violations
          .map((v: any) => `${v.id}: ${v.description}`)
          .join('\n')}`,
      pass: false,
    };
  }
};

// Setup custom matchers
expect.extend({ toHaveNoViolations });