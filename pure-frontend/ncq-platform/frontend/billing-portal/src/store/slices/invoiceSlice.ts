import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import invoiceService from '../../services/invoiceService'
import { Invoice, InvoiceFilters } from '../../types'

interface InvoiceState {
  invoices: Invoice[]
  currentInvoice: Invoice | null
  totalCount: number
  loading: boolean
  error: string | null
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  totalCount: 0,
  loading: false,
  error: null,
}

export const fetchInvoices = createAsyncThunk(
  'invoice/fetchAll',
  async (filters?: InvoiceFilters) => {
    const response = await invoiceService.getInvoices(filters)
    return response
  }
)

export const fetchInvoiceById = createAsyncThunk(
  'invoice/fetchById',
  async (id: string) => {
    const response = await invoiceService.getInvoiceById(id)
    return response
  }
)

export const downloadInvoice = createAsyncThunk(
  'invoice/download',
  async (id: string) => {
    const response = await invoiceService.downloadInvoice(id)
    return response
  }
)

export const payInvoice = createAsyncThunk(
  'invoice/pay',
  async ({ id, paymentMethodId }: { id: string; paymentMethodId: string }) => {
    const response = await invoiceService.payInvoice(id, paymentMethodId)
    return response
  }
)

export const retryPayment = createAsyncThunk(
  'invoice/retryPayment',
  async (id: string) => {
    const response = await invoiceService.retryPayment(id)
    return response
  }
)

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload.data
        state.totalCount = action.payload.total
        state.pagination = {
          currentPage: action.payload.currentPage || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.total || 0,
        }
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch invoices'
      })
      // Fetch invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false
        state.currentInvoice = action.payload
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch invoice'
      })
      // Pay invoice
      .addCase(payInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
        if (state.currentInvoice?.id === action.payload.id) {
          state.currentInvoice = action.payload
        }
      })
      // Retry payment
      .addCase(retryPayment.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
        if (state.currentInvoice?.id === action.payload.id) {
          state.currentInvoice = action.payload
        }
      })
  },
})

export const { clearError } = invoiceSlice.actions
export default invoiceSlice.reducer