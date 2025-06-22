import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import subscriptionService from '../../services/subscriptionService'
import { Subscription, Plan, CreateSubscriptionData, UpdateSubscriptionData } from '../../types'

interface SubscriptionState {
  currentSubscription: Subscription | null
  plans: Plan[]
  loading: boolean
  error: string | null
}

const initialState: SubscriptionState = {
  currentSubscription: null,
  plans: [],
  loading: false,
  error: null,
}

export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrent',
  async () => {
    const response = await subscriptionService.getCurrentSubscription()
    return response
  }
)

export const fetchPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async () => {
    const response = await subscriptionService.getPlans()
    return response
  }
)

export const createSubscription = createAsyncThunk(
  'subscription/create',
  async (data: CreateSubscriptionData) => {
    const response = await subscriptionService.createSubscription(data)
    return response
  }
)

export const updateSubscription = createAsyncThunk(
  'subscription/update',
  async ({ id, data }: { id: string; data: UpdateSubscriptionData }) => {
    const response = await subscriptionService.updateSubscription(id, data)
    return response
  }
)

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (id: string) => {
    const response = await subscriptionService.cancelSubscription(id)
    return response
  }
)

export const reactivateSubscription = createAsyncThunk(
  'subscription/reactivate',
  async (id: string) => {
    const response = await subscriptionService.reactivateSubscription(id)
    return response
  }
)

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current subscription
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.loading = false
        state.currentSubscription = action.payload
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch subscription'
      })
      // Fetch plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false
        state.plans = action.payload
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch plans'
      })
      // Create subscription
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload
      })
      // Update subscription
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload
      })
      // Cancel subscription
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload
      })
      // Reactivate subscription
      .addCase(reactivateSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload
      })
  },
})

export const { clearError } = subscriptionSlice.actions
export default subscriptionSlice.reducer