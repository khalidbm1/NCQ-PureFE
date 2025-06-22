'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Tenant, User, TenantMember } from '../types'
import { apiClient } from '../api/client'

interface TenantContextType {
  currentTenant: Tenant | null
  userTenants: Tenant[]
  currentMember: TenantMember | null
  isLoading: boolean
  error: string | null
  switchTenant: (tenantId: string) => Promise<void>
  refreshTenant: () => Promise<void>
  createTenant: (data: CreateTenantData) => Promise<Tenant>
  updateTenant: (tenantId: string, data: Partial<Tenant>) => Promise<Tenant>
  deleteTenant: (tenantId: string) => Promise<void>
  hasPermission: (permission: string) => boolean
  isOwner: () => boolean
  isAdmin: () => boolean
  canManageMembers: () => boolean
  canManageBilling: () => boolean
  canManageSettings: () => boolean
}

interface CreateTenantData {
  name: string
  slug: string
  description?: string
  plan?: string
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  children: ReactNode
  user?: User
}

export function TenantProvider({ children, user }: TenantProviderProps) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [userTenants, setUserTenants] = useState<Tenant[]>([])
  const [currentMember, setCurrentMember] = useState<TenantMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize tenant context
  useEffect(() => {
    if (user) {
      initializeTenantContext()
    }
  }, [user])

  const initializeTenantContext = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get user's tenants
      const tenants = await apiClient.get<Tenant[]>('/tenants/user-tenants')
      setUserTenants(tenants)

      // Get current tenant from localStorage or use first tenant
      const savedTenantId = localStorage.getItem('currentTenantId')
      let targetTenant = null

      if (savedTenantId) {
        targetTenant = tenants.find(t => t.id === savedTenantId)
      }

      if (!targetTenant && tenants.length > 0) {
        targetTenant = tenants[0]
      }

      if (targetTenant) {
        await switchTenant(targetTenant.id)
      }
    } catch (err) {
      console.error('Failed to initialize tenant context:', err)
      setError('Failed to load tenant information')
    } finally {
      setIsLoading(false)
    }
  }

  const switchTenant = async (tenantId: string) => {
    try {
      setError(null)
      
      // Find tenant in user's tenants
      const tenant = userTenants.find(t => t.id === tenantId)
      if (!tenant) {
        throw new Error('Tenant not found')
      }

      // Get detailed tenant information
      const detailedTenant = await apiClient.get<Tenant>(`/tenants/${tenantId}`)
      
      // Get user's membership in this tenant
      const member = await apiClient.get<TenantMember>(`/tenants/${tenantId}/members/me`)

      setCurrentTenant(detailedTenant)
      setCurrentMember(member)
      
      // Save to localStorage
      localStorage.setItem('currentTenantId', tenantId)
      
      // Update API client headers with tenant context
      apiClient.setTenantContext(tenantId)
    } catch (err) {
      console.error('Failed to switch tenant:', err)
      setError('Failed to switch organization')
      throw err
    }
  }

  const refreshTenant = async () => {
    if (!currentTenant) return

    try {
      const updatedTenant = await apiClient.get<Tenant>(`/tenants/${currentTenant.id}`)
      const updatedMember = await apiClient.get<TenantMember>(`/tenants/${currentTenant.id}/members/me`)
      
      setCurrentTenant(updatedTenant)
      setCurrentMember(updatedMember)
    } catch (err) {
      console.error('Failed to refresh tenant:', err)
      setError('Failed to refresh organization data')
    }
  }

  const createTenant = async (data: CreateTenantData): Promise<Tenant> => {
    try {
      const tenant = await apiClient.post<Tenant>('/tenants', data)
      
      // Refresh user tenants
      const updatedTenants = await apiClient.get<Tenant[]>('/tenants/user-tenants')
      setUserTenants(updatedTenants)
      
      // Switch to new tenant
      await switchTenant(tenant.id)
      
      return tenant
    } catch (err) {
      console.error('Failed to create tenant:', err)
      throw err
    }
  }

  const updateTenant = async (tenantId: string, data: Partial<Tenant>): Promise<Tenant> => {
    try {
      const updatedTenant = await apiClient.patch<Tenant>(`/tenants/${tenantId}`, data)
      
      if (currentTenant?.id === tenantId) {
        setCurrentTenant(updatedTenant)
      }
      
      // Update in user tenants list
      setUserTenants(prev => 
        prev.map(t => t.id === tenantId ? updatedTenant : t)
      )
      
      return updatedTenant
    } catch (err) {
      console.error('Failed to update tenant:', err)
      throw err
    }
  }

  const deleteTenant = async (tenantId: string): Promise<void> => {
    try {
      await apiClient.delete(`/tenants/${tenantId}`)
      
      // Remove from user tenants
      const updatedTenants = userTenants.filter(t => t.id !== tenantId)
      setUserTenants(updatedTenants)
      
      // If deleting current tenant, switch to another one
      if (currentTenant?.id === tenantId) {
        if (updatedTenants.length > 0) {
          await switchTenant(updatedTenants[0].id)
        } else {
          setCurrentTenant(null)
          setCurrentMember(null)
          localStorage.removeItem('currentTenantId')
        }
      }
    } catch (err) {
      console.error('Failed to delete tenant:', err)
      throw err
    }
  }

  // Permission helpers
  const hasPermission = (permission: string): boolean => {
    if (!currentMember) return false
    return currentMember.permissions.includes(permission) || currentMember.role === 'owner'
  }

  const isOwner = (): boolean => {
    return currentMember?.role === 'owner'
  }

  const isAdmin = (): boolean => {
    return currentMember?.role === 'owner' || currentMember?.role === 'admin'
  }

  const canManageMembers = (): boolean => {
    return hasPermission('manage_members') || isAdmin()
  }

  const canManageBilling = (): boolean => {
    return hasPermission('manage_billing') || isOwner()
  }

  const canManageSettings = (): boolean => {
    return hasPermission('manage_settings') || isAdmin()
  }

  const value: TenantContextType = {
    currentTenant,
    userTenants,
    currentMember,
    isLoading,
    error,
    switchTenant,
    refreshTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    hasPermission,
    isOwner,
    isAdmin,
    canManageMembers,
    canManageBilling,
    canManageSettings,
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

// API client extension for tenant context
declare module '../api/client' {
  interface ApiClient {
    setTenantContext(tenantId: string): void
  }
}

// Extend API client with tenant context
const originalClient = apiClient as any
originalClient.setTenantContext = function(tenantId: string) {
  this.client.defaults.headers['X-Tenant-ID'] = tenantId
}