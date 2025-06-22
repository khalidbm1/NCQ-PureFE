import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { getDeviceFingerprint } from '../../services/deviceFingerprint';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

// Mock dependencies
jest.mock('../../hooks/useAuth');
jest.mock('../../services/deviceFingerprint');
jest.mock('react-hot-toast');

// Initialize i18n for tests
i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        auth: {
          email: 'Email',
          emailPlaceholder: 'Enter your email',
          password: 'Password',
          passwordPlaceholder: 'Enter your password',
          login: 'Login',
          loginSuccess: 'Login successful',
          rememberMe: 'Remember me',
          forgotPassword: 'Forgot password?',
          loginWithBiometric: 'Login with biometric',
          orContinueWith: 'Or continue with',
          socialLoginComingSoon: 'Coming soon',
          noAccount: "Don't have an account?",
          signUp: 'Sign up',
          showPassword: 'Show password',
          hidePassword: 'Hide password',
          biometricFailed: 'Biometric authentication failed',
          sessionTimeoutWarning: 'Session timeout warning',
          accountLocked: 'Account locked for {{minutes}} minutes',
        },
      },
    },
  },
});

const createWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
};

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockLoginWithBiometric = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnMfaRequired = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loginWithBiometric: mockLoginWithBiometric,
      isLoading: false,
    });
    (getDeviceFingerprint as jest.Mock).mockResolvedValue('mock-fingerprint');
  });

  it('renders login form with all fields', () => {
    render(
      <LoginForm onSuccess={mockOnSuccess} onMfaRequired={mockOnMfaRequired} />,
      { wrapper: createWrapper }
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('validates email field', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper });

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Login');

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper });

    const submitButton = screen.getByText('Login');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm />, { wrapper: createWrapper });

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByLabelText('Show password');
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      user: { id: '1', email: 'test@ncq.sa' },
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 3600,
      requiresMfa: false,
    });

    render(
      <LoginForm onSuccess={mockOnSuccess} onMfaRequired={mockOnMfaRequired} />,
      { wrapper: createWrapper }
    );

    await user.type(screen.getByLabelText('Email'), 'test@ncq.sa');
    await user.type(screen.getByLabelText('Password'), 'Test123!@#');
    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@ncq.sa',
        password: 'Test123!@#',
        rememberMe: false,
        deviceFingerprint: 'mock-fingerprint',
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles MFA requirement', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      requiresMfa: true,
      mfaChallenge: {
        challengeId: 'challenge-123',
        type: 'SMS',
        expiresAt: new Date(Date.now() + 300000),
        maskedDestination: '*****567',
      },
    });

    render(
      <LoginForm onSuccess={mockOnSuccess} onMfaRequired={mockOnMfaRequired} />,
      { wrapper: createWrapper }
    );

    await user.type(screen.getByLabelText('Email'), 'test@ncq.sa');
    await user.type(screen.getByLabelText('Password'), 'Test123!@#');
    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockOnMfaRequired).toHaveBeenCalledWith('challenge-123');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('handles login error', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue({
      message: 'Invalid credentials',
      messageAr: 'بيانات اعتماد غير صالحة',
      code: 'INVALID_CREDENTIALS',
    });

    render(<LoginForm />, { wrapper: createWrapper });

    await user.type(screen.getByLabelText('Email'), 'test@ncq.sa');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('handles account lockout', async () => {
    const user = userEvent.setup();
    const lockoutTime = new Date(Date.now() + 15 * 60 * 1000);
    
    mockLogin.mockRejectedValue({
      message: 'Account locked',
      code: 'ACCOUNT_LOCKED',
      lockoutTime,
    });

    render(<LoginForm />, { wrapper: createWrapper });

    await user.type(screen.getByLabelText('Email'), 'test@ncq.sa');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('disables form during loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loginWithBiometric: mockLoginWithBiometric,
      isLoading: true,
    });

    render(<LoginForm />, { wrapper: createWrapper });

    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Password')).toBeDisabled();
    expect(screen.getByLabelText('Remember me')).toBeDisabled();
    expect(screen.getByText('Login')).toBeDisabled();
  });

  it('shows biometric login when available', async () => {
    // Mock WebAuthn API
    Object.defineProperty(navigator, 'credentials', {
      value: {
        get: jest.fn().mockResolvedValue({ id: 'credential-id' }),
      },
      configurable: true,
    });

    render(<LoginForm allowBiometric={true} />, { wrapper: createWrapper });

    await waitFor(() => {
      expect(screen.getByText('Login with biometric')).toBeInTheDocument();
    });
  });

  it('handles biometric login', async () => {
    const user = userEvent.setup();
    
    Object.defineProperty(navigator, 'credentials', {
      value: {
        get: jest.fn().mockResolvedValue({ id: 'credential-id' }),
      },
      configurable: true,
    });

    mockLoginWithBiometric.mockResolvedValue({
      user: { id: '1', email: 'test@ncq.sa' },
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 3600,
      requiresMfa: false,
    });

    render(
      <LoginForm allowBiometric={true} onSuccess={mockOnSuccess} />,
      { wrapper: createWrapper }
    );

    await waitFor(() => {
      expect(screen.getByText('Login with biometric')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Login with biometric'));

    await waitFor(() => {
      expect(mockLoginWithBiometric).toHaveBeenCalledWith('mock-fingerprint');
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('respects remember me checkbox', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({
      user: { id: '1', email: 'test@ncq.sa' },
      accessToken: 'token',
      refreshToken: 'refresh',
      expiresIn: 3600,
      requiresMfa: false,
    });

    render(<LoginForm />, { wrapper: createWrapper });

    await user.type(screen.getByLabelText('Email'), 'test@ncq.sa');
    await user.type(screen.getByLabelText('Password'), 'Test123!@#');
    await user.click(screen.getByLabelText('Remember me'));
    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@ncq.sa',
        password: 'Test123!@#',
        rememberMe: true,
        deviceFingerprint: 'mock-fingerprint',
      });
    });
  });
});