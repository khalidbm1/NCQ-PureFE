import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register } from './authSlice';
import api from '../../services/api';

interface Subscription {
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'suspended';
  planId: string | null;
  planName: string | null;
  planCode: string | null;
  expiresAt: string | null;
  trialEndsAt: string | null;
  canceledAt: string | null;
  currentUsersCount: number;
  currentPatientsCount: number;
  currentMonthAppointments: number;
  currentStorageUsedGb: number;
  limits: {
    maxUsers: number;
    maxPatients: number | null;
    maxAppointmentsPerMonth: number | null;
    storageLimitGb: number;
  };
}

interface UsageStats {
  users: {
    current: number;
    limit: number;
    percentage: number;
    nearLimit: boolean;
  };
  patients: {
    current: number;
    limit: number | null;
    percentage: number;
    nearLimit: boolean;
    unlimited: boolean;
  };
  appointments: {
    current: number;
    limit: number | null;
    percentage: number;
    nearLimit: boolean;
    unlimited: boolean;
  };
  storage: {
    current: number;
    limit: number;
    percentage: number;
    nearLimit: boolean;
  };
}

interface TenantState {
  tenant: {
    id: string;
    subdomain: string;
    name: string;
    subscription_status: string;
    subscription_expires_at?: string;
    days_until_expiry?: number;
    is_in_grace_period?: boolean;
  } | null;
  subscription: Subscription | null;
  usageStats: UsageStats | null;
  subscriptionWarning: {
    show: boolean;
    message: string;
    severity: 'warning' | 'error';
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenant: null,
  subscription: null,
  usageStats: null,
  subscriptionWarning: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchSubscription = createAsyncThunk(
  'tenant/fetchSubscription',
  async () => {
    const response = await api.get('/subscriptions/current');
    return response.data.subscription;
  }
);

export const fetchUsageStats = createAsyncThunk(
  'tenant/fetchUsageStats',
  async () => {
    const response = await api.get('/subscriptions/usage');
    return response.data.usage;
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  'tenant/updateSubscription',
  async ({ planId, billingPeriod }: { planId: string; billingPeriod: 'monthly' | 'annual' }) => {
    const response = await api.put('/subscriptions/update', { planId, billingPeriod });
    return response.data;
  }
);

export const cancelSubscription = createAsyncThunk(
  'tenant/cancelSubscription',
  async (atPeriodEnd: boolean = true) => {
    const response = await api.post('/subscriptions/cancel', { atPeriodEnd });
    return response.data;
  }
);

export const resumeSubscription = createAsyncThunk(
  'tenant/resumeSubscription',
  async () => {
    const response = await api.post('/subscriptions/resume');
    return response.data;
  }
);

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<TenantState['tenant']>) => {
      state.tenant = action.payload;
    },
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
    },
    setSubscriptionWarning: (state, action: PayloadAction<TenantState['subscriptionWarning']>) => {
      state.subscriptionWarning = action.payload;
    },
    clearSubscriptionWarning: (state) => {
      state.subscriptionWarning = null;
    },
    checkUsageLimits: (state) => {
      if (!state.subscription || !state.usageStats) return;
      
      // Check if any limits are near or exceeded
      const warnings: string[] = [];
      
      if (state.usageStats.users.nearLimit) {
        warnings.push(`User limit nearly reached (${state.usageStats.users.current}/${state.usageStats.users.limit})`);
      }
      
      if (state.usageStats.patients.nearLimit && !state.usageStats.patients.unlimited) {
        warnings.push(`Patient limit nearly reached (${state.usageStats.patients.current}/${state.usageStats.patients.limit})`);
      }
      
      if (state.usageStats.storage.nearLimit) {
        warnings.push(`Storage limit nearly reached (${state.usageStats.storage.current}GB/${state.usageStats.storage.limit}GB)`);
      }
      
      if (warnings.length > 0) {
        state.subscriptionWarning = {
          show: true,
          message: warnings.join('. '),
          severity: 'warning',
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Set tenant data when login/register succeeds
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.tenant = action.payload.tenant;
        
        // Check for subscription warnings
        if (action.payload.tenant.subscription_status === 'trial') {
          state.subscriptionWarning = {
            show: true,
            message: 'You are currently on a trial plan. Upgrade to continue using all features.',
            severity: 'warning',
          };
        } else if (action.payload.tenant.is_in_grace_period) {
          state.subscriptionWarning = {
            show: true,
            message: `Your subscription has expired. You have ${action.payload.tenant.days_until_expiry} days to update your payment method.`,
            severity: 'error',
          };
        }
      })
      .addCase(register.fulfilled, (state, action) => {
        state.tenant = action.payload.tenant;
      });
    
    // Fetch subscription
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.subscription = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch subscription';
      });
    
    // Fetch usage stats
    builder
      .addCase(fetchUsageStats.fulfilled, (state, action) => {
        state.usageStats = action.payload;
      });
    
    // Update subscription
    builder
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state) => {
        state.isLoading = false;
        // Subscription will be refetched
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update subscription';
      });
    
    // Cancel subscription
    builder
      .addCase(cancelSubscription.fulfilled, (state) => {
        // Update subscription status
        if (state.subscription) {
          state.subscription.status = 'canceled';
        }
      });
  },
});

export const { 
  setTenant, 
  setSubscription, 
  setSubscriptionWarning, 
  clearSubscriptionWarning,
  checkUsageLimits 
} = tenantSlice.actions;

export default tenantSlice.reducer;