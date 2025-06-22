import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { ApiClient } from '@/shared/api/client'

// Types
export interface DashboardMetrics {
  totalRevenue: number
  totalTransactions: number
  successRate: number
  averageTransactionValue: number
  activeSubscriptions: number
  pendingSettlements: number
  monthlyGrowth: number
  todayRevenue: number
  todayTransactions: number
  topPaymentMethods: PaymentMethodMetric[]
  recentTransactions: RecentTransaction[]
  revenueChart: ChartDataPoint[]
  transactionChart: ChartDataPoint[]
}

export interface PaymentMethodMetric {
  method: string
  count: number
  volume: number
  percentage: number
}

export interface RecentTransaction {
  id: string
  amount: number
  currency: string
  paymentMethod: string
  status: string
  createdAt: string
  merchantReference: string
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface RealTimeMetric {
  transactionsPerMinute: number
  activeUsers: number
  systemHealth: 'healthy' | 'warning' | 'critical'
  responseTime: number
  errorRate: number
  timestamp: string
}

export interface DashboardState {
  metrics: DashboardMetrics | null
  realTimeMetrics: RealTimeMetric | null
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
  selectedDateRange: {
    start: string
    end: string
    preset: 'today' | '7days' | '30days' | '90days' | 'custom'
  }
  autoRefresh: boolean
  refreshInterval: number
}

// Initial state
const initialState: DashboardState = {
  metrics: null,
  realTimeMetrics: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  selectedDateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0], // today
    preset: '30days'
  },
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
}

// Async thunks
export const fetchDashboardMetrics = createAsyncThunk<
  DashboardMetrics,
  { dateRange?: { start: string; end: string } },
  { rejectValue: string }
>('dashboard/fetchMetrics', async ({ dateRange }, { rejectWithValue }) => {
  try {
    const params = dateRange ? {
      startDate: dateRange.start,
      endDate: dateRange.end
    } : {}
    
    const response = await ApiClient.get<DashboardMetrics>('/analytics/dashboard', { params })
    return response
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard metrics')
  }
})

export const fetchRealTimeMetrics = createAsyncThunk<
  RealTimeMetric,
  void,
  { rejectValue: string }
>('dashboard/fetchRealTimeMetrics', async (_, { rejectWithValue }) => {
  try {
    const response = await ApiClient.get<RealTimeMetric>('/analytics/realtime')
    return response
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch real-time metrics')
  }
})

export const refreshDashboard = createAsyncThunk<
  { metrics: DashboardMetrics; realTime: RealTimeMetric },
  void,
  { rejectValue: string }
>('dashboard/refresh', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { dashboard: DashboardState }
    const { selectedDateRange } = state.dashboard
    
    const [metricsResponse, realTimeResponse] = await Promise.all([
      ApiClient.get<DashboardMetrics>('/analytics/dashboard', {
        params: {
          startDate: selectedDateRange.start,
          endDate: selectedDateRange.end
        }
      }),
      ApiClient.get<RealTimeMetric>('/analytics/realtime')
    ])
    
    return {
      metrics: metricsResponse,
      realTime: realTimeResponse
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to refresh dashboard')
  }
})

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{
      start: string
      end: string
      preset: 'today' | '7days' | '30days' | '90days' | 'custom'
    }>) => {
      state.selectedDateRange = action.payload
    },
    
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload
    },
    
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload
    },
    
    updateRealTimeMetric: (state, action: PayloadAction<Partial<RealTimeMetric>>) => {
      if (state.realTimeMetrics) {
        state.realTimeMetrics = { ...state.realTimeMetrics, ...action.payload }
      }
    },
    
    clearError: (state) => {
      state.error = null
    },
    
    resetDashboard: () => initialState,
  },
  
  extraReducers: (builder) => {
    // Fetch dashboard metrics
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false
        state.metrics = action.payload
        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to fetch dashboard metrics'
      })

    // Fetch real-time metrics
    builder
      .addCase(fetchRealTimeMetrics.fulfilled, (state, action) => {
        state.realTimeMetrics = action.payload
      })
      .addCase(fetchRealTimeMetrics.rejected, (state, action) => {
        // Don't set loading/error for real-time metrics to avoid disrupting UX
        console.warn('Failed to fetch real-time metrics:', action.payload)
      })

    // Refresh dashboard
    builder
      .addCase(refreshDashboard.pending, (state) => {
        // Don't set loading to true for refresh to avoid flickering
        state.error = null
      })
      .addCase(refreshDashboard.fulfilled, (state, action) => {
        state.metrics = action.payload.metrics
        state.realTimeMetrics = action.payload.realTime
        state.lastUpdated = new Date().toISOString()
        state.error = null
      })
      .addCase(refreshDashboard.rejected, (state, action) => {
        state.error = action.payload || 'Failed to refresh dashboard'
      })
  },
})

export const {
  setDateRange,
  setAutoRefresh,
  setRefreshInterval,
  updateRealTimeMetric,
  clearError,
  resetDashboard,
} = dashboardSlice.actions

// Selectors
export const selectDashboard = (state: { dashboard: DashboardState }) => state.dashboard
export const selectDashboardMetrics = (state: { dashboard: DashboardState }) => state.dashboard.metrics
export const selectRealTimeMetrics = (state: { dashboard: DashboardState }) => state.dashboard.realTimeMetrics
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.isLoading
export const selectDateRange = (state: { dashboard: DashboardState }) => state.dashboard.selectedDateRange

// Helper functions for date range presets
export const getDateRangePreset = (preset: 'today' | '7days' | '30days' | '90days') => {
  const end = new Date().toISOString().split('T')[0]
  let start: string
  
  switch (preset) {
    case 'today':
      start = end
      break
    case '7days':
      start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case '30days':
      start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case '90days':
      start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    default:
      start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }
  
  return { start, end, preset }
}

export default dashboardSlice.reducer