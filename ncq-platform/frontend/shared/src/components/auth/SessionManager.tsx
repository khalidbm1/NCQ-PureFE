import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Smartphone, Tablet, Globe, MapPin, Clock, Trash2, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Button, Card, Badge } from '@ncq/design-system';
import { useAuth } from '../../hooks/useAuth';
import { SessionInfo } from '../../types/auth.types';
import toast from 'react-hot-toast';

interface SessionManagerProps {
  onClose?: () => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { sessions, terminateSession } = useAuth();
  const [terminatingSessions, setTerminatingSessions] = useState<Set<string>>(new Set());
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  useEffect(() => {
    // Get current session ID from sessionStorage
    const sessionId = sessionStorage.getItem('session_id');
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, []);

  const handleTerminateSession = async (sessionId: string) => {
    const isCurrentSession = sessionId === currentSessionId;
    
    const confirmed = window.confirm(
      isCurrentSession
        ? t('auth.sessions.confirmTerminateCurrent')
        : t('auth.sessions.confirmTerminate')
    );

    if (!confirmed) return;

    setTerminatingSessions(prev => new Set(prev).add(sessionId));

    try {
      await terminateSession(sessionId);
      
      if (isCurrentSession) {
        toast.success(t('auth.sessions.currentTerminated'));
        // Will be redirected to login by terminateSession
      } else {
        toast.success(t('auth.sessions.terminated'));
      }
    } catch (error) {
      toast.error(t('auth.sessions.terminateFailed'));
    } finally {
      setTerminatingSessions(prev => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  };

  const getDeviceIcon = (device: string) => {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes('mobile') || deviceLower.includes('iphone') || deviceLower.includes('android')) {
      return <Smartphone className="h-5 w-5" />;
    }
    if (deviceLower.includes('tablet') || deviceLower.includes('ipad')) {
      return <Tablet className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const getDeviceType = (deviceInfo: SessionInfo['deviceInfo']) => {
    const { device, os, browser } = deviceInfo;
    return `${device} • ${os} • ${browser}`;
  };

  const formatLastActivity = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: i18n.language === 'ar' ? ar : enUS,
    });
  };

  const activeSessions = sessions.filter(s => s.isActive);
  const inactiveSessions = sessions.filter(s => !s.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('auth.sessions.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.sessions.description')}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">{t('common.close')}</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('auth.sessions.active')} ({activeSessions.length})
        </h3>

        {activeSessions.map((session) => {
          const isCurrent = session.id === currentSessionId;
          
          return (
            <Card key={session.id} className={isCurrent ? 'ring-2 ring-primary-500' : ''}>
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {getDeviceIcon(session.deviceInfo.device)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {getDeviceType(session.deviceInfo)}
                        </p>
                        {isCurrent && (
                          <Badge variant="success" size="sm">
                            {t('auth.sessions.current')}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Globe className="h-4 w-4 mr-1" />
                          <span>{session.deviceInfo.ip}</span>
                        </div>
                        {session.deviceInfo.location && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{session.deviceInfo.location}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{t('auth.sessions.lastActive')}: {formatLastActivity(session.lastActivity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      loading={terminatingSessions.has(session.id)}
                      disabled={terminatingSessions.has(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t('auth.sessions.terminate')}</span>
                    </Button>
                  )}
                </div>
                
                {isCurrent && (
                  <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="flex items-center text-sm text-primary-700 dark:text-primary-300">
                      <Shield className="h-4 w-4 mr-2" />
                      {t('auth.sessions.currentDevice')}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {activeSessions.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('auth.sessions.noActive')}
          </p>
        )}
      </div>

      {inactiveSessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('auth.sessions.inactive')} ({inactiveSessions.length})
          </h3>

          {inactiveSessions.map((session) => (
            <Card key={session.id} className="opacity-60">
              <div className="p-4 sm:p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {getDeviceIcon(session.deviceInfo.device)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getDeviceType(session.deviceInfo)}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Globe className="h-4 w-4 mr-1" />
                        <span>{session.deviceInfo.ip}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{t('auth.sessions.expired')}: {formatLastActivity(session.expiresAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('auth.sessions.securityTip')}
        </p>
        {activeSessions.length > 1 && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm(t('auth.sessions.confirmTerminateAll'))) {
                activeSessions.forEach(session => {
                  if (session.id !== currentSessionId) {
                    handleTerminateSession(session.id);
                  }
                });
              }
            }}
          >
            {t('auth.sessions.terminateAll')}
          </Button>
        )}
      </div>
    </div>
  );
};