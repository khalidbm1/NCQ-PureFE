import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// Slices
import authSlice from './slices/authSlice'
import dashboardSlice from './slices/dashboardSlice'
import transactionSlice from './slices/transactionSlice'
import analyticsSlice from './slices/analyticsSlice'
import subscriptionSlice from './slices/subscriptionSlice'
import settingsSlice from './slices/settingsSlice'

// API Services
import { authApi } from './services/authApi'
import { transactionApi } from './services/transactionApi'
import { analyticsApi } from './services/analyticsApi'
import { merchantApi } from './services/merchantApi'
import { subscriptionApi } from './services/subscriptionApi'
import { settlementApi } from './services/settlementApi'
import { webhookApi } from './services/webhookApi'

export const store = configureStore({
  reducer: {
    // Feature slices
    auth: authSlice,
    dashboard: dashboardSlice,
    transactions: transactionSlice,
    analytics: analyticsSlice,
    subscriptions: subscriptionSlice,
    settings: settingsSlice,
    
    // API services
    [authApi.reducerPath]: authApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [merchantApi.reducerPath]: merchantApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [settlementApi.reducerPath]: settlementApi.reducer,
    [webhookApi.reducerPath]: webhookApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(authApi.middleware)
      .concat(transactionApi.middleware)
      .concat(analyticsApi.middleware)
      .concat(merchantApi.middleware)
      .concat(subscriptionApi.middleware)
      .concat(settlementApi.middleware)
      .concat(webhookApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Setup listeners for RTK Query
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export everything needed
export * from './slices/authSlice'
export * from './slices/dashboardSlice'
export * from './slices/transactionSlice'
export * from './slices/analyticsSlice'
export * from './slices/subscriptionSlice'
export * from './slices/settingsSlice'

export * from './services/authApi'
export * from './services/transactionApi'
export * from './services/analyticsApi'
export * from './services/merchantApi'
export * from './services/subscriptionApi'
export * from './services/settlementApi'
export * from './services/webhookApi'