import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import subscriptionReducer from './slices/subscriptionSlice'
import invoiceReducer from './slices/invoiceSlice'
import paymentReducer from './slices/paymentSlice'
import usageReducer from './slices/usageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subscriptionReducer,
    invoice: invoiceReducer,
    payment: paymentReducer,
    usage: usageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/checkAuth/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch