import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/shared/api/client'
import toast from 'react-hot-toast'

// Types
export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MERCHANT' | 'SUPPORT'
  merchantId?: string
  permissions: string[]
  isActive: boolean
  lastLoginAt: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  loginAttempts: number
  lockoutUntil: number | null
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  merchantName: string
  businessType: string
  phoneNumber: string
}

interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('ncq_token'),
  refreshToken: localStorage.getItem('ncq_refresh_token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lockoutUntil: null,
}

// Async thunks
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    
    // Store tokens
    localStorage.setItem('ncq_token', response.data.token)
    localStorage.setItem('ncq_refresh_token', response.data.refreshToken)
    
    if (credentials.rememberMe) {
      localStorage.setItem('ncq_remember_email', credentials.email)
    } else {
      localStorage.removeItem('ncq_remember_email')
    }
    
    toast.success(`Welcome back, ${response.data.user.name}!`)
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed'
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData)
    
    // Store tokens
    localStorage.setItem('ncq_token', response.data.token)
    localStorage.setItem('ncq_refresh_token', response.data.refreshToken)
    
    toast.success('Account created successfully! Welcome to NCQ!')
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed'
    toast.error(message)
    return rejectWithValue(message)
  }
})

export const refreshAuthToken = createAsyncThunk<
  { token: string; user: User },
  void,
  { rejectValue: string }
>('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('ncq_refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await apiClient.post<{ token: string; user: User }>('/auth/refresh', {
      refreshToken
    })
    
    localStorage.setItem('ncq_token', response.data.token)
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message || 'Token refresh failed'
    return rejectWithValue(message)
  }
})

export const verifyToken = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('auth/verify', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{ user: User }>('/auth/me')
    return response.data.user
  } catch (error: any) {
    const message = error.response?.data?.message || 'Token verification failed'
    return rejectWithValue(message)
  }
})

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('ncq_refresh_token')
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken })
    }
  } catch (error) {
    // Continue with logout even if API call fails
  } finally {
    // Clear local storage
    localStorage.removeItem('ncq_token')
    localStorage.removeItem('ncq_refresh_token')
    toast.success('Logged out successfully')
  }
})

export const forgotPassword = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>('auth/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email })
    toast.success('Password reset instructions sent to your email')
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to send reset email'
    toast.error(message)
    return rejectWithValue(message)
  }
})

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0
      state.lockoutUntil = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.loginAttempts = 0
        state.lockoutUntil = null
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Login failed'
        state.loginAttempts += 1
        
        // Lock account after 5 failed attempts
        if (state.loginAttempts >= 5) {
          state.lockoutUntil = Date.now() + (15 * 60 * 1000) // 15 minutes
        }
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Registration failed'
      })

    // Token refresh
    builder
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        localStorage.removeItem('ncq_token')
        localStorage.removeItem('ncq_refresh_token')
      })

    // Token verification
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        localStorage.removeItem('ncq_token')
        localStorage.removeItem('ncq_refresh_token')
      })

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.error = null
      })

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Failed to send reset email'
      })
  },
})

export const { clearError, resetLoginAttempts, updateUser, setLoadingState } = authSlice.actions

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading

export default authSlice.reducer