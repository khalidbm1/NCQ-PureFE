import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import paymentService from '../../services/paymentService'
import { PaymentMethod, CreatePaymentMethodData } from '../../types'

interface PaymentState {
  paymentMethods: PaymentMethod[]
  defaultPaymentMethod: PaymentMethod | null
  isLoading: boolean
  error: string | null
}

const initialState: PaymentState = {
  paymentMethods: [],
  defaultPaymentMethod: null,
  isLoading: false,
  error: null,
}

export const fetchPaymentMethods = createAsyncThunk(
  'payment/fetchMethods',
  async () => {
    const response = await paymentService.getPaymentMethods()
    return response
  }
)

export const addPaymentMethod = createAsyncThunk(
  'payment/addMethod',
  async (data: CreatePaymentMethodData) => {
    const response = await paymentService.addPaymentMethod(data)
    return response
  }
)

export const removePaymentMethod = createAsyncThunk(
  'payment/removeMethod',
  async (id: string) => {
    await paymentService.removePaymentMethod(id)
    return id
  }
)

export const setDefaultPaymentMethod = createAsyncThunk(
  'payment/setDefault',
  async (id: string) => {
    const response = await paymentService.setDefaultPaymentMethod(id)
    return response
  }
)

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payment methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false
        state.paymentMethods = action.payload
        state.defaultPaymentMethod = action.payload.find(pm => pm.isDefault) || null
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch payment methods'
      })
      // Add payment method
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods.push(action.payload)
        if (action.payload.isDefault) {
          state.defaultPaymentMethod = action.payload
        }
      })
      // Remove payment method
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload)
        if (state.defaultPaymentMethod?.id === action.payload) {
          state.defaultPaymentMethod = state.paymentMethods.find(pm => pm.isDefault) || null
        }
      })
      // Set default payment method
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods = state.paymentMethods.map(pm => ({
          ...pm,
          isDefault: pm.id === action.payload.id
        }))
        state.defaultPaymentMethod = action.payload
      })
  },
})

export const { clearError } = paymentSlice.actions
export default paymentSlice.reducer