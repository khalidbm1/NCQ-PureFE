<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div class="flex items-center space-x-4">
          <div class="loading-spinner w-8 h-8"></div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ loadingMessage }}</h3>
            <p class="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main app content -->
    <RouterView />

    <!-- Global modals -->
    <Teleport to="body">
      <!-- Confirmation modal -->
      <ConfirmationModal
        v-if="showConfirmationModal"
        :title="confirmationModal.title"
        :message="confirmationModal.message"
        :confirm-text="confirmationModal.confirmText"
        :cancel-text="confirmationModal.cancelText"
        :is-destructive="confirmationModal.isDestructive"
        @confirm="handleConfirmation(true)"
        @cancel="handleConfirmation(false)"
      />

      <!-- Payment modal -->
      <PaymentModal
        v-if="showPaymentModal"
        :subscription="paymentModalData.subscription"
        :amount="paymentModalData.amount"
        @success="handlePaymentSuccess"
        @close="closePaymentModal"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { useNotificationStore } from '@/stores/notification'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import PaymentModal from '@/components/modals/PaymentModal.vue'

// Stores
const customerStore = useCustomerStore()
const notificationStore = useNotificationStore()

// Global loading state
const isLoading = ref(false)
const loadingMessage = ref('')

// Global modals
const showConfirmationModal = ref(false)
const confirmationModal = ref({
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  isDestructive: false,
  onConfirm: () => {},
  onCancel: () => {},
})

const showPaymentModal = ref(false)
const paymentModalData = ref({
  subscription: null as any,
  amount: 0,
})

// Global loading computed
const globalLoading = computed(() => customerStore.isLoading || notificationStore.isLoading)

// Initialize app
onMounted(async () => {
  try {
    setLoading(true, 'Initializing application...')
    
    // Initialize customer data if authenticated
    const token = localStorage.getItem('ncq_customer_token')
    if (token) {
      await customerStore.initializeCustomer()
    }
    
    // Initialize notifications
    await notificationStore.fetchNotifications()
    
  } catch (error) {
    console.error('App initialization error:', error)
  } finally {
    setLoading(false)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  notificationStore.cleanup()
})

// Global loading helpers
const setLoading = (loading: boolean, message = '') => {
  isLoading.value = loading
  loadingMessage.value = message
}

// Global confirmation modal helper
const showConfirmation = (options: {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel?: () => void
}) => {
  confirmationModal.value = {
    title: options.title,
    message: options.message,
    confirmText: options.confirmText || 'Confirm',
    cancelText: options.cancelText || 'Cancel',
    isDestructive: options.isDestructive || false,
    onConfirm: options.onConfirm,
    onCancel: options.onCancel || (() => {}),
  }
  showConfirmationModal.value = true
}

const handleConfirmation = (confirmed: boolean) => {
  if (confirmed) {
    confirmationModal.value.onConfirm()
  } else {
    confirmationModal.value.onCancel()
  }
  showConfirmationModal.value = false
}

// Global payment modal helpers
const showPayment = (subscription: any, amount: number) => {
  paymentModalData.value = { subscription, amount }
  showPaymentModal.value = true
}

const handlePaymentSuccess = (result: any) => {
  // Handle successful payment
  customerStore.refreshSubscriptions()
  notificationStore.addNotification({
    type: 'success',
    title: 'Payment Successful',
    message: 'Your payment has been processed successfully.',
  })
  closePaymentModal()
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  paymentModalData.value = { subscription: null, amount: 0 }
}

// Provide global helpers to child components
const provide = {
  setLoading,
  showConfirmation,
  showPayment,
}

// Error handling
const handleGlobalError = (error: any) => {
  console.error('Global error:', error)
  
  notificationStore.addNotification({
    type: 'error',
    title: 'An Error Occurred',
    message: error.message || 'Something went wrong. Please try again.',
  })
}

// Keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  // Escape key to close modals
  if (event.key === 'Escape') {
    if (showConfirmationModal.value) {
      handleConfirmation(false)
    }
    if (showPaymentModal.value) {
      closePaymentModal()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('error', handleGlobalError)
  window.addEventListener('unhandledrejection', (event) => {
    handleGlobalError(event.reason)
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('error', handleGlobalError)
  window.removeEventListener('unhandledrejection', handleGlobalError)
})

// Expose helpers globally
Object.assign(globalThis, provide)
</script>

<style>
/* Global app styles */
#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Loading overlay animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Notification animations */
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-leave-active {
  transition: all 0.5s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive breakpoints reminder */
/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px */
</style>