'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Metric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format: 'number' | 'currency' | 'percentage' | 'duration';
  category: string;
  timestamp: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ServiceMetrics {
  serviceId: string;
  serviceName: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  uptime: number;
  requestCount: number;
  errorRate: number;
  avgResponseTime: number;
  lastUpdated: string;
}

export interface AnalyticsData {
  metrics: Metric[];
  serviceMetrics: ServiceMetrics[];
  timeSeriesData: Record<string, TimeSeriesData[]>;
  lastUpdated: string;
}

interface AnalyticsContextType {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getMetricsByCategory: (category: string) => Metric[];
  getServiceStatus: (serviceId: string) => ServiceMetrics | null;
  getTimeSeriesData: (metricId: string, timeRange?: string) => TimeSeriesData[];
  subscribeToRealTimeUpdates: (enabled: boolean) => void;
  isRealTimeEnabled: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Mock data for development
const mockMetrics: Metric[] = [
  {
    id: 'total_users',
    name: 'Total Users',
    value: 12543,
    previousValue: 11892,
    change: 5.47,
    changeType: 'increase',
    format: 'number',
    category: 'users',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'active_sessions',
    name: 'Active Sessions',
    value: 2847,
    previousValue: 2654,
    change: 7.27,
    changeType: 'increase',
    format: 'number',
    category: 'users',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'total_revenue',
    name: 'Total Revenue',
    value: 145679.32,
    previousValue: 134521.45,
    change: 8.29,
    changeType: 'increase',
    format: 'currency',
    category: 'revenue',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'conversion_rate',
    name: 'Conversion Rate',
    value: 3.24,
    previousValue: 2.98,
    change: 8.72,
    changeType: 'increase',
    format: 'percentage',
    category: 'conversion',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'avg_response_time',
    name: 'Avg Response Time',
    value: 245,
    previousValue: 289,
    change: -15.22,
    changeType: 'decrease',
    format: 'duration',
    category: 'performance',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'api_requests',
    name: 'API Requests',
    value: 89432,
    previousValue: 76543,
    change: 16.83,
    changeType: 'increase',
    format: 'number',
    category: 'api',
    timestamp: new Date().toISOString(),
  },
];

const mockServiceMetrics: ServiceMetrics[] = [
  {
    serviceId: 'auth',
    serviceName: 'Authentication Service',
    status: 'online',
    uptime: 99.87,
    requestCount: 15432,
    errorRate: 0.12,
    avgResponseTime: 89,
    lastUpdated: new Date().toISOString(),
  },
  {
    serviceId: 'payment',
    serviceName: 'Payment Gateway',
    status: 'online',
    uptime: 99.95,
    requestCount: 8976,
    errorRate: 0.05,
    avgResponseTime: 156,
    lastUpdated: new Date().toISOString(),
  },
  {
    serviceId: 'iot',
    serviceName: 'IoT Platform',
    status: 'degraded',
    uptime: 98.23,
    requestCount: 23456,
    errorRate: 1.23,
    avgResponseTime: 234,
    lastUpdated: new Date().toISOString(),
  },
  {
    serviceId: 'hospital',
    serviceName: 'Hospital Management',
    status: 'online',
    uptime: 99.91,
    requestCount: 6789,
    errorRate: 0.08,
    avgResponseTime: 123,
    lastUpdated: new Date().toISOString(),
  },
  {
    serviceId: 'blockchain',
    serviceName: 'Blockchain Network',
    status: 'maintenance',
    uptime: 95.45,
    requestCount: 4321,
    errorRate: 0.23,
    avgResponseTime: 345,
    lastUpdated: new Date().toISOString(),
  },
  {
    serviceId: 'hospitality',
    serviceName: 'Smart Hospitality',
    status: 'online',
    uptime: 99.78,
    requestCount: 9876,
    errorRate: 0.15,
    avgResponseTime: 198,
    lastUpdated: new Date().toISOString(),
  },
];

function generateTimeSeriesData(days: number = 30): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      timestamp: date.toISOString(),
      value: Math.floor(Math.random() * 1000) + 500,
      label: date.toLocaleDateString(),
    });
  }
  
  return data;
}

const mockTimeSeriesData: Record<string, TimeSeriesData[]> = {
  total_users: generateTimeSeriesData(),
  active_sessions: generateTimeSeriesData(),
  total_revenue: generateTimeSeriesData(),
  api_requests: generateTimeSeriesData(),
};

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const refreshData = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, this would fetch from your analytics API
      const analyticsData: AnalyticsData = {
        metrics: mockMetrics,
        serviceMetrics: mockServiceMetrics,
        timeSeriesData: mockTimeSeriesData,
        lastUpdated: new Date().toISOString(),
      };

      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricsByCategory = (category: string): Metric[] => {
    if (!data) return [];
    return data.metrics.filter(metric => metric.category === category);
  };

  const getServiceStatus = (serviceId: string): ServiceMetrics | null => {
    if (!data) return null;
    return data.serviceMetrics.find(service => service.serviceId === serviceId) || null;
  };

  const getTimeSeriesData = (metricId: string, timeRange?: string): TimeSeriesData[] => {
    if (!data) return [];
    const seriesData = data.timeSeriesData[metricId] || [];
    
    if (!timeRange) return seriesData;
    
    // Filter by time range
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case '24h':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        return seriesData;
    }
    
    return seriesData.filter(point => new Date(point.timestamp) >= cutoffDate);
  };

  const subscribeToRealTimeUpdates = (enabled: boolean) => {
    setIsRealTimeEnabled(enabled);
    
    if (enabled) {
      // In a real implementation, this would establish WebSocket connection
      console.log('Real-time updates enabled');
    } else {
      // Disconnect WebSocket
      console.log('Real-time updates disabled');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRealTimeEnabled && isAuthenticated) {
      // Refresh data every 30 seconds when real-time is enabled
      interval = setInterval(refreshData, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRealTimeEnabled, isAuthenticated]);

  return (
    <AnalyticsContext.Provider
      value={{
        data,
        isLoading,
        error,
        refreshData,
        getMetricsByCategory,
        getServiceStatus,
        getTimeSeriesData,
        subscribeToRealTimeUpdates,
        isRealTimeEnabled,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}