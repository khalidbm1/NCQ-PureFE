'use client'

import React, { useState } from 'react'
import { useTenant } from '../../lib/context/tenant-context'
import { Button } from '../ui/Button'
import { Building2, ChevronDown, Plus, Settings, Users, CreditCard, BarChart3 } from 'lucide-react'

interface TenantSwitcherProps {
  className?: string
  showManageOptions?: boolean
}

export function TenantSwitcher({ className = '', showManageOptions = true }: TenantSwitcherProps) {
  const { 
    currentTenant, 
    userTenants, 
    currentMember,
    switchTenant, 
    isLoading,
    canManageSettings,
    canManageMembers,
    canManageBilling 
  } = useTenant()
  const [isOpen, setIsOpen] = useState(false)
  const [switching, setSwitching] = useState(false)

  const handleTenantSwitch = async (tenantId: string) => {
    if (tenantId === currentTenant?.id) {
      setIsOpen(false)
      return
    }

    try {
      setSwitching(true)
      await switchTenant(tenantId)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to switch tenant:', error)
    } finally {
      setSwitching(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-purple-600 bg-purple-100'
      case 'admin':
        return 'text-blue-600 bg-blue-100'
      case 'member':
        return 'text-green-600 bg-green-100'
      case 'viewer':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'suspended':
        return 'bg-red-500'
      case 'trialing':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  if (!currentTenant) {
    return (
      <div className={`text-center text-gray-500 ${className}`}>
        <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">No organization selected</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={switching}
        className="w-full justify-between text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {currentTenant.logo ? (
              <img
                src={currentTenant.logo}
                alt={currentTenant.name}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {currentTenant.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900 truncate">
                {currentTenant.name}
              </p>
              <div className={`h-2 w-2 rounded-full ${getStatusColor(currentTenant.subscription.status)}`} />
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(currentMember?.role || 'member')}`}>
                {currentMember?.role}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {currentTenant.subscription.plan}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Current Tenant Info */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{currentTenant.name}</p>
                <p className="text-sm text-gray-500">{currentTenant.description}</p>
              </div>
              {showManageOptions && (
                <div className="flex items-center space-x-1">
                  {canManageSettings() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false)
                        window.location.href = `/dashboard/organization/settings`
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                  {canManageMembers() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false)
                        window.location.href = `/dashboard/organization/members`
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  )}
                  {canManageBilling() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsOpen(false)
                        window.location.href = `/dashboard/organization/billing`
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false)
                      window.location.href = `/dashboard/organization/analytics`
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Other Tenants */}
          {userTenants.length > 1 && (
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Switch Organization
              </p>
              {userTenants
                .filter(tenant => tenant.id !== currentTenant.id)
                .map((tenant) => {
                  const memberRole = tenant.members?.find(m => m.userId === currentMember?.userId)?.role || 'member'
                  
                  return (
                    <button
                      key={tenant.id}
                      onClick={() => handleTenantSwitch(tenant.id)}
                      disabled={switching}
                      className="w-full flex items-center space-x-3 px-2 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <div className="flex-shrink-0">
                        {tenant.logo ? (
                          <img
                            src={tenant.logo}
                            alt={tenant.name}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {tenant.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 truncate">
                            {tenant.name}
                          </p>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(tenant.subscription.status)}`} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(memberRole)}`}>
                            {memberRole}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {tenant.subscription.plan}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
            </div>
          )}

          {/* Create New Organization */}
          <div className="border-t border-gray-100 p-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false)
                window.location.href = '/dashboard/organization/new'
              }}
              className="w-full justify-start"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}