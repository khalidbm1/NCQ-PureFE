'use client';

import { useLanguage } from '@/hooks/useLanguage';

export function LoadingScreen() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <div className="loading-dots mb-6">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <h2 className="text-2xl font-semibold text-green-700 mb-2">
          Smart Building
        </h2>
        <p className="text-green-600">
          {t('common.loading')}
        </p>
      </div>
    </div>
  );
}