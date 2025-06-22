import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Smartphone, Mail, Key, Fingerprint, ArrowLeft, RefreshCw } from 'lucide-react';
import { MFAType, MFAChallenge as MFAChallengeType, MFAVerification } from '../../types/auth.types';
import { Button } from '@ncq/design-system';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const mfaSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must contain only numbers'),
});

interface MFAChallengeProps {
  challenge: MFAChallengeType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const MFAChallenge: React.FC<MFAChallengeProps> = ({
  challenge,
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { verifyMfa, resendMfa, isLoading } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [canResend, setCanResend] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [codeValues, setCodeValues] = useState<string[]>(new Array(6).fill(''));

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<{ code: string }>({
    resolver: zodResolver(mfaSchema),
  });

  useEffect(() => {
    // Calculate time remaining
    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(challenge.expiresAt).getTime() - Date.now()) / 1000)
      );
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        toast.error(t('auth.mfaExpired'));
        onCancel?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    // Enable resend after 30 seconds
    const resendTimeout = setTimeout(() => setCanResend(true), 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(resendTimeout);
    };
  }, [challenge.expiresAt, t, onCancel]);

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newValues = [...codeValues];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newValues[index + i] = char;
        }
      });
      setCodeValues(newValues);
      setValue('code', newValues.join(''));
      
      // Focus last input or next empty
      const nextIndex = Math.min(index + pastedCode.length, 5);
      codeInputRefs.current[nextIndex]?.focus();
    } else {
      // Single character input
      const newValues = [...codeValues];
      newValues[index] = value;
      setCodeValues(newValues);
      setValue('code', newValues.join(''));

      // Auto-focus next input
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeValues[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: { code: string }) => {
    try {
      const verification: MFAVerification = {
        challengeId: challenge.challengeId,
        code: data.code,
      };

      await verifyMfa(verification);
      toast.success(t('auth.mfaSuccess'));
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || t('auth.mfaFailed'));
      
      // Clear code on error
      setCodeValues(new Array(6).fill(''));
      codeInputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      setCanResend(false);
      await resendMfa(challenge.challengeId);
      toast.success(t('auth.mfaResent'));
      
      // Reset timer
      setTimeout(() => setCanResend(true), 30000);
    } catch (error: any) {
      toast.error(t('auth.mfaResendFailed'));
      setCanResend(true);
    }
  };

  const handleBiometricVerification = async () => {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new TextEncoder().encode(challenge.challengeId),
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname,
        } as any,
      });

      if (credential) {
        const verification: MFAVerification = {
          challengeId: challenge.challengeId,
          biometricData: JSON.stringify(credential),
        };

        await verifyMfa(verification);
        toast.success(t('auth.mfaSuccess'));
        onSuccess?.();
      }
    } catch (error) {
      toast.error(t('auth.biometricFailed'));
    }
  };

  const getIcon = () => {
    switch (challenge.type) {
      case MFAType.SMS:
        return <Smartphone className="h-12 w-12 text-primary-600" />;
      case MFAType.EMAIL:
        return <Mail className="h-12 w-12 text-primary-600" />;
      case MFAType.TOTP:
        return <Key className="h-12 w-12 text-primary-600" />;
      case MFAType.BIOMETRIC:
        return <Fingerprint className="h-12 w-12 text-primary-600" />;
    }
  };

  const getTitle = () => {
    switch (challenge.type) {
      case MFAType.SMS:
        return t('auth.mfaSmsTitle');
      case MFAType.EMAIL:
        return t('auth.mfaEmailTitle');
      case MFAType.TOTP:
        return t('auth.mfaTotpTitle');
      case MFAType.BIOMETRIC:
        return t('auth.mfaBiometricTitle');
    }
  };

  const getDescription = () => {
    switch (challenge.type) {
      case MFAType.SMS:
        return t('auth.mfaSmsDescription', { destination: challenge.maskedDestination });
      case MFAType.EMAIL:
        return t('auth.mfaEmailDescription', { destination: challenge.maskedDestination });
      case MFAType.TOTP:
        return t('auth.mfaTotpDescription');
      case MFAType.BIOMETRIC:
        return t('auth.mfaBiometricDescription');
    }
  };

  return (
    <div className="space-y-6" data-testid="mfa-challenge">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center mb-4">
          {getIcon()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getTitle()}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {getDescription()}
        </p>
      </div>

      {challenge.type === MFAType.BIOMETRIC ? (
        <div className="space-y-4">
          <Button
            fullWidth
            onClick={handleBiometricVerification}
            loading={isLoading}
            icon={<Fingerprint className="h-5 w-5" />}
          >
            {t('auth.verifyBiometric')}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('auth.mfaCodeLabel')}
            </label>
            <div className="flex justify-center space-x-2" dir="ltr">
              {codeValues.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => (codeInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleCodeInput(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  disabled={isLoading}
                  autoComplete="off"
                />
              ))}
            </div>
            {errors.code && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                {errors.code.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600 dark:text-gray-400">
              {t('auth.mfaExpires', { 
                minutes: Math.floor(timeRemaining / 60),
                seconds: timeRemaining % 60 
              })}
            </div>
            {canResend && (
              <button
                type="button"
                onClick={handleResend}
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 flex items-center"
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {t('auth.mfaResend')}
              </button>
            )}
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading || codeValues.join('').length !== 6}
            >
              {t('auth.verify')}
            </Button>

            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onCancel}
              disabled={isLoading}
              icon={<ArrowLeft className="h-5 w-5" />}
            >
              {t('auth.backToLogin')}
            </Button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.mfaTrouble')}{' '}
        <a href="/support" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
          {t('auth.contactSupport')}
        </a>
      </div>
    </div>
  );
};