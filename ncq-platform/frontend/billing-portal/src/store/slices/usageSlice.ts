import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import usageService from '../../services/usageService'
import { UsageData, UsageMetrics, UsagePeriod } from '../../types'

interface UsageState {
  currentUsage: UsageData | null
  usageHistory: UsageMetrics[]
  isLoading: boolean
  error: string | null
}

const initialState: UsageState = {
  currentUsage: null,
  usageHistory: [],
  isLoading: false,
  error: null,
}

export const fetchCurrentUsage = createAsyncThunk(
  'usage/fetchCurrent',
  async () => {
    const response = await usageService.getCurrentUsage()
    return response
  }
)

export const fetchUsageHistory = createAsyncThunk(
  'usage/fetchHistory',
  async (period: UsagePeriod) => {
    const response = await usageService.getUsageHistory(period)
    return response
  }
)

const usageSlice = createSlice({
  name: 'usage',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current usage
      .addCase(fetchCurrentUsage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCurrentUsage.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUsage = action.payload
      })
      .addCase(fetchCurrentUsage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch usage data'
      })
      // Fetch usage history
      .addCase(fetchUsageHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsageHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.usageHistory = action.payload
      })
      .addCase(fetchUsageHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch usage history'
      })
  },
})

export const { clearError } = usageSlice.actions
export default usageSlice.reducer