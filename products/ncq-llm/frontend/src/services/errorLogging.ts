/**
 * Frontend error logging service
 */

interface ErrorLogData {
  message: string;
  stack?: string;
  componentStack?: string;
  errorInfo?: any;
  userAgent: string;
  url: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
}

interface NetworkError extends ErrorLogData {
  type: 'network_error';
  status?: number;
  endpoint?: string;
  method?: string;
}

interface JavaScriptError extends ErrorLogData {
  type: 'javascript_error';
  filename?: string;
  lineno?: number;
  colno?: number;
}

interface UserAction {
  type: 'user_action';
  action: string;
  element?: string;
  timestamp: string;
  url: string;
}

class ErrorLoggingService {
  private queue: (ErrorLogData | NetworkError | JavaScriptError)[] = [];
  private isOnline = navigator.onLine;
  private maxQueueSize = 50;
  private flushInterval = 5000; // 5 seconds
  private sessionId: string;
  private userId?: string;
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
    this.startPeriodicFlush();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventListeners() {
    // Network status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flush();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Global error handlers
    window.addEventListener('error', (event) => {
      this.logJavaScriptError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
        stack: event.reason?.stack,
        errorInfo: { type: 'unhandled_promise_rejection', reason: event.reason },
      });
    });

    // Page visibility for flushing on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });

    // Flush before page unload
    window.addEventListener('beforeunload', () => {
      this.flush(true); // Synchronous flush
    });
  }

  private startPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public logError(errorData: Partial<ErrorLogData>) {
    const fullErrorData: ErrorLogData = {
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      componentStack: errorData.componentStack,
      errorInfo: errorData.errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
      ...errorData,
    };

    this.addToQueue(fullErrorData);
    
    // Immediate flush for critical errors
    if (this.isCriticalError(errorData.message || '')) {
      this.flush();
    }
  }

  public logNetworkError(errorData: Partial<NetworkError>) {
    const fullErrorData: NetworkError = {
      type: 'network_error',
      message: errorData.message || 'Network error occurred',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
      ...errorData,
    };

    this.addToQueue(fullErrorData);
  }

  public logJavaScriptError(errorData: Partial<JavaScriptError>) {
    const fullErrorData: JavaScriptError = {
      type: 'javascript_error',
      message: errorData.message || 'JavaScript error occurred',
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
      ...errorData,
    };

    this.addToQueue(fullErrorData);
  }

  public logUserAction(action: Omit<UserAction, 'timestamp' | 'url'>) {
    const userAction: UserAction = {
      ...action,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // Store user actions in session storage for context
    try {
      const actions = JSON.parse(sessionStorage.getItem('user_actions') || '[]');
      actions.push(userAction);
      
      // Keep only last 20 actions
      if (actions.length > 20) {
        actions.splice(0, actions.length - 20);
      }
      
      sessionStorage.setItem('user_actions', JSON.stringify(actions));
    } catch (error) {
      console.warn('Failed to store user action:', error);
    }
  }

  private addToQueue(errorData: ErrorLogData | NetworkError | JavaScriptError) {
    this.queue.push(errorData);
    
    // Limit queue size
    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift(); // Remove oldest entry
    }
  }

  private isCriticalError(message: string): boolean {
    const criticalKeywords = [
      'chunk load error',
      'script error',
      'network error',
      'cors',
      'authentication',
      'authorization',
    ];
    
    return criticalKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  public async flush(synchronous = false) {
    if (this.queue.length === 0 || !this.isOnline) {
      return;
    }

    const errors = [...this.queue];
    this.queue = [];

    const payload = {
      errors,
      sessionInfo: {
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      },
      userActions: this.getUserActions(),
    };

    try {
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      if (synchronous && 'sendBeacon' in navigator) {
        // Use sendBeacon for synchronous sending during page unload
        navigator.sendBeacon(
          '/api/v1/logging/frontend-errors',
          JSON.stringify(payload)
        );
      } else {
        const response = await fetch('/api/v1/logging/frontend-errors', options);
        
        if (!response.ok) {
          // Re-queue errors if sending failed
          this.queue.unshift(...errors);
          console.warn('Failed to send error logs to server');
        }
      }
    } catch (error) {
      // Re-queue errors if sending failed
      this.queue.unshift(...errors);
      console.warn('Failed to send error logs:', error);
    }
  }

  private getUserActions(): UserAction[] {
    try {
      return JSON.parse(sessionStorage.getItem('user_actions') || '[]');
    } catch {
      return [];
    }
  }

  public getQueueSize(): number {
    return this.queue.length;
  }

  public clearQueue() {
    this.queue = [];
  }

  public destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Global instance
export const errorLogger = new ErrorLoggingService();

// Utility functions
export const logError = (error: Error | string, context?: any) => {
  if (typeof error === 'string') {
    errorLogger.logError({ message: error, errorInfo: context });
  } else {
    errorLogger.logError({
      message: error.message,
      stack: error.stack,
      errorInfo: context,
    });
  }
};

export const logNetworkError = (
  endpoint: string,
  method: string,
  status?: number,
  message?: string
) => {
  errorLogger.logNetworkError({
    endpoint,
    method,
    status,
    message: message || `Network error: ${method} ${endpoint}`,
  });
};

export const logUserAction = (action: string, element?: string) => {
  errorLogger.logUserAction({
    type: 'user_action',
    action,
    element,
  });
};

// React hook for error logging
export const useErrorLogging = () => {
  React.useEffect(() => {
    // Set user ID if available
    // This should be called when user context is available
    const user = getCurrentUser(); // Implement this based on your auth system
    if (user) {
      errorLogger.setUserId(user.id);
    }
  }, []);

  return {
    logError,
    logNetworkError,
    logUserAction,
    getQueueSize: () => errorLogger.getQueueSize(),
    flush: () => errorLogger.flush(),
  };
};

// Placeholder for current user - implement based on your auth system
function getCurrentUser() {
  // This should return the current user from your auth context/store
  return null;
}

// Export service instance
export default errorLogger;
