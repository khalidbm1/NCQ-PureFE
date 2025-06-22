import { createRouter, createWebHistory } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'

// Layout components
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Auth pages
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import VerifyEmail from '@/views/auth/VerifyEmail.vue'

// Dashboard pages
import Dashboard from '@/views/dashboard/Dashboard.vue'
import Subscriptions from '@/views/dashboard/Subscriptions.vue'
import SubscriptionDetails from '@/views/dashboard/SubscriptionDetails.vue'
import PaymentHistory from '@/views/dashboard/PaymentHistory.vue'
import PaymentMethods from '@/views/dashboard/PaymentMethods.vue'
import Profile from '@/views/dashboard/Profile.vue'
import Support from '@/views/dashboard/Support.vue'

// Subscription management
import CancelSubscription from '@/views/subscription/CancelSubscription.vue'
import UpdateSubscription from '@/views/subscription/UpdateSubscription.vue'
import PauseSubscription from '@/views/subscription/PauseSubscription.vue'

// Payment flows
import PaymentSuccess from '@/views/payment/PaymentSuccess.vue'
import PaymentFailure from '@/views/payment/PaymentFailure.vue'
import PaymentPending from '@/views/payment/PaymentPending.vue'

// Error pages
import NotFound from '@/views/error/NotFound.vue'
import Unauthorized from '@/views/error/Unauthorized.vue'
import ServerError from '@/views/error/ServerError.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth routes
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login,
          meta: { 
            title: 'Sign In',
            requiresGuest: true 
          }
        },
        {
          path: 'register',
          name: 'Register',
          component: Register,
          meta: { 
            title: 'Create Account',
            requiresGuest: true 
          }
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: ForgotPassword,
          meta: { 
            title: 'Reset Password',
            requiresGuest: true 
          }
        },
        {
          path: 'verify-email',
          name: 'VerifyEmail',
          component: VerifyEmail,
          meta: { 
            title: 'Verify Email',
            requiresGuest: true 
          }
        },
        {
          path: '',
          redirect: '/auth/login'
        }
      ]
    },

    // Dashboard routes
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard,
          meta: { 
            title: 'Dashboard',
            icon: 'home'
          }
        },
        {
          path: 'subscriptions',
          name: 'Subscriptions',
          component: Subscriptions,
          meta: { 
            title: 'My Subscriptions',
            icon: 'refresh'
          }
        },
        {
          path: 'subscriptions/:id',
          name: 'SubscriptionDetails',
          component: SubscriptionDetails,
          meta: { 
            title: 'Subscription Details',
            hideFromNav: true
          }
        },
        {
          path: 'payment-history',
          name: 'PaymentHistory',
          component: PaymentHistory,
          meta: { 
            title: 'Payment History',
            icon: 'credit-card'
          }
        },
        {
          path: 'payment-methods',
          name: 'PaymentMethods',
          component: PaymentMethods,
          meta: { 
            title: 'Payment Methods',
            icon: 'credit-card'
          }
        },
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
          meta: { 
            title: 'Profile Settings',
            icon: 'user'
          }
        },
        {
          path: 'support',
          name: 'Support',
          component: Support,
          meta: { 
            title: 'Help & Support',
            icon: 'support'
          }
        }
      ]
    },

    // Subscription management routes
    {
      path: '/subscription',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: ':id/cancel',
          name: 'CancelSubscription',
          component: CancelSubscription,
          meta: { 
            title: 'Cancel Subscription',
            hideFromNav: true
          }
        },
        {
          path: ':id/update',
          name: 'UpdateSubscription',
          component: UpdateSubscription,
          meta: { 
            title: 'Update Subscription',
            hideFromNav: true
          }
        },
        {
          path: ':id/pause',
          name: 'PauseSubscription',
          component: PauseSubscription,
          meta: { 
            title: 'Pause Subscription',
            hideFromNav: true
          }
        }
      ]
    },

    // Payment result routes
    {
      path: '/payment',
      children: [
        {
          path: 'success',
          name: 'PaymentSuccess',
          component: PaymentSuccess,
          meta: { 
            title: 'Payment Successful',
            hideFromNav: true
          }
        },
        {
          path: 'failure',
          name: 'PaymentFailure',
          component: PaymentFailure,
          meta: { 
            title: 'Payment Failed',
            hideFromNav: true
          }
        },
        {
          path: 'pending',
          name: 'PaymentPending',
          component: PaymentPending,
          meta: { 
            title: 'Payment Pending',
            hideFromNav: true
          }
        }
      ]
    },

    // Error routes
    {
      path: '/error',
      children: [
        {
          path: '401',
          name: 'Unauthorized',
          component: Unauthorized,
          meta: { 
            title: 'Unauthorized',
            hideFromNav: true
          }
        },
        {
          path: '500',
          name: 'ServerError',
          component: ServerError,
          meta: { 
            title: 'Server Error',
            hideFromNav: true
          }
        }
      ]
    },

    // Root redirect
    {
      path: '/',
      redirect: '/dashboard'
    },

    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { 
        title: 'Page Not Found',
        hideFromNav: true
      }
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const customerStore = useCustomerStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = customerStore.isAuthenticated

  // Set page title
  document.title = to.meta.title 
    ? `${to.meta.title} - NCQ Customer Portal` 
    : 'NCQ Customer Portal'

  // Handle authentication requirements
  if (requiresAuth && !isAuthenticated) {
    // Try to restore session from token
    const token = localStorage.getItem('ncq_customer_token')
    if (token) {
      try {
        await customerStore.verifyToken()
        if (customerStore.isAuthenticated) {
          next()
          return
        }
      } catch (error) {
        console.error('Token verification failed:', error)
        localStorage.removeItem('ncq_customer_token')
      }
    }
    
    // Redirect to login with return URL
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Redirect authenticated users away from guest pages
  if (requiresGuest && isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  // Handle email verification requirement
  if (isAuthenticated && customerStore.customer && !customerStore.customer.emailVerified) {
    const allowedRoutes = ['VerifyEmail', 'Dashboard', 'Profile']
    if (!allowedRoutes.includes(to.name as string)) {
      next({ name: 'VerifyEmail' })
      return
    }
  }

  next()
})

// After navigation
router.afterEach((to, from) => {
  // Scroll to top on route change
  if (to.path !== from.path) {
    window.scrollTo(0, 0)
  }

  // Track page views (if analytics is enabled)
  if (import.meta.env.VITE_ANALYTICS_ENABLED === 'true') {
    // Track page view
    gtag?.('event', 'page_view', {
      page_title: to.meta.title,
      page_location: window.location.href,
      page_path: to.path
    })
  }
})

// Error handling
router.onError((error) => {
  console.error('Router error:', error)
  
  // Handle specific error types
  if (error.message.includes('Loading chunk')) {
    // Handle dynamic import failures (often due to deployment updates)
    window.location.reload()
    return
  }
  
  // Redirect to server error page for other errors
  router.push({ name: 'ServerError' })
})

export default router

// Export route names for type safety
export const RouteNames = {
  // Auth
  Login: 'Login',
  Register: 'Register',
  ForgotPassword: 'ForgotPassword',
  VerifyEmail: 'VerifyEmail',
  
  // Dashboard
  Dashboard: 'Dashboard',
  Subscriptions: 'Subscriptions',
  SubscriptionDetails: 'SubscriptionDetails',
  PaymentHistory: 'PaymentHistory',
  PaymentMethods: 'PaymentMethods',
  Profile: 'Profile',
  Support: 'Support',
  
  // Subscription management
  CancelSubscription: 'CancelSubscription',
  UpdateSubscription: 'UpdateSubscription',
  PauseSubscription: 'PauseSubscription',
  
  // Payment results
  PaymentSuccess: 'PaymentSuccess',
  PaymentFailure: 'PaymentFailure',
  PaymentPending: 'PaymentPending',
  
  // Error pages
  NotFound: 'NotFound',
  Unauthorized: 'Unauthorized',
  ServerError: 'ServerError',
} as const

export type RouteNameType = typeof RouteNames[keyof typeof RouteNames]