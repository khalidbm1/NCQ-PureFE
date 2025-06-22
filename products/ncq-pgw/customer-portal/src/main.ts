import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import './style.css'

// i18n configuration
import en from './locales/en.json'
import ar from './locales/ar.json'

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ar
  }
})

// Toast configuration
const toastOptions = {
  position: 'top-right' as const,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  toastDefaults: {
    success: {
      timeout: 3000,
      hideProgressBar: true,
    },
    error: {
      timeout: 7000,
      hideProgressBar: false,
    },
    warning: {
      timeout: 5000,
      hideProgressBar: false,
    },
    info: {
      timeout: 4000,
      hideProgressBar: true,
    }
  }
}

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast, toastOptions)

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error)
  console.error('Error info:', info)
  
  // You could send this to an error reporting service
  if (import.meta.env.PROD) {
    // Report to error tracking service
  }
}

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  if (import.meta.env.DEV) {
    console.warn('Vue warning:', msg)
    console.warn('Trace:', trace)
  }
}

// Global properties
app.config.globalProperties.$formatCurrency = (amount: number, currency = 'SAR') => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount / 100) // Convert from halalas
}

app.config.globalProperties.$formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

app.config.globalProperties.$formatDateTime = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Mount the app
app.mount('#app')

// Development helpers
if (import.meta.env.DEV) {
  // Expose app instance for debugging
  window.__VUE_APP__ = app
  
  // Log app initialization
  console.log('🚀 NCQ Customer Portal initialized')
  console.log('📍 Environment:', import.meta.env.MODE)
  console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1')
}