import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Fingerprint, Smartphone, Mail, Shield } from 'lucide-react';
import { LoginCredentials, MFAType } from '../../types/auth.types';
import { Button } from '@ncq/design-system';
import { useAuth } from '../../hooks/useAuth';
import { getDeviceFingerprint } from '../../services/deviceFingerprint';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

interface LoginFormProps {
  onSuccess?: () => void;
  onMfaRequired?: (challengeId: string) => void;
  allowBiometric?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onMfaRequired,
  allowBiometric = true,
}) => {
  const { t, i18n } = useTranslation();
  const { login, loginWithBiometric, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  useEffect(() => {
    // Get device fingerprint
    getDeviceFingerprint().then(setDeviceFingerprint);

    // Check biometric availability
    if (allowBiometric && 'credentials' in navigator) {
      navigator.credentials
        .get({
          publicKey: {
            challenge: new Uint8Array(32),
            timeout: 60000,
            userVerification: 'preferred',
            rpId: window.location.hostname,
          } as any,
        })
        .then(() => setBiometricAvailable(true))
        .catch(() => setBiometricAvailable(false));
    }

    // Set initial focus
    setFocus('email');

    // Session timeout warning
    const warningTime = 5 * 60 * 1000; // 5 minutes before timeout
    const timeout = setTimeout(() => {
      toast.error(t('auth.sessionTimeoutWarning'));
    }, warningTime);

    setSessionTimeout(timeout);

    return () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, [allowBiometric, setFocus, t, sessionTimeout]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const response = await login({
        ...data,
        deviceFingerprint,
      });

      if (response.requiresMfa && response.mfaChallenge) {
        onMfaRequired?.(response.mfaChallenge.challengeId);
      } else {
        toast.success(t('auth.loginSuccess'));
        onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = i18n.language === 'ar' 
        ? error.messageAr || error.message 
        : error.message;
      
      toast.error(errorMessage);

      // Handle account lockout
      if (error.code === 'ACCOUNT_LOCKED' && error.lockoutTime) {
        const lockoutMinutes = Math.ceil(
          (new Date(error.lockoutTime).getTime() - Date.now()) / 60000
        );
        toast.error(
          t('auth.accountLocked', { minutes: lockoutMinutes })
        );
      }
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const response = await loginWithBiometric(deviceFingerprint);
      
      if (response.requiresMfa) {
        onMfaRequired?.(response.mfaChallenge!.challengeId);
      } else {
        toast.success(t('auth.loginSuccess'));
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(t('auth.biometricFailed'));
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
      data-testid="login-form"
      autoComplete="on"
    >
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('auth.email')}
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          autoComplete="username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder={t('auth.emailPlaceholder')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {t('auth.password')}
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder={t('auth.passwordPlaceholder')}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            {...register('rememberMe')}
            type="checkbox"
            id="remember-me"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label 
            htmlFor="remember-me" 
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            {t('auth.rememberMe')}
          </label>
        </div>

        <a 
          href="/forgot-password" 
          className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          {t('auth.forgotPassword')}
        </a>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
        >
          {t('auth.login')}
        </Button>

        {biometricAvailable && (
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleBiometricLogin}
            disabled={isLoading}
            icon={<Fingerprint className="h-5 w-5" />}
          >
            {t('auth.loginWithBiometric')}
          </Button>
        )}
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
              {t('auth.orContinueWith')}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => toast.info(t('auth.socialLoginComingSoon'))}
          >
            <Shield className="h-5 w-5" />
            <span className="sr-only">Sign in with Nafath</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => toast.info(t('auth.socialLoginComingSoon'))}
          >
            <Smartphone className="h-5 w-5" />
            <span className="sr-only">Sign in with Absher</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => toast.info(t('auth.socialLoginComingSoon'))}
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Sign in with Email Link</span>
          </Button>
        </div>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t('auth.noAccount')}{' '}
          <a 
            href="/register" 
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            {t('auth.signUp')}
          </a>
        </span>
      </div>
    </form>
  );
};