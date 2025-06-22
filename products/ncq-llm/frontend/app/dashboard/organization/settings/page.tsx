'use client'

import React, { useState, useEffect } from 'react'
import { useTenant } from '../../../../lib/context/tenant-context'
import { tenantsApi } from '../../../../lib/api/tenants'
import { TenantSettings } from '../../../../lib/types'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { 
  Save, 
  Upload, 
  Shield, 
  Bell, 
  Palette, 
  Server,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function OrganizationSettingsPage() {
  const { currentTenant, refreshTenant, canManageSettings } = useTenant()
  const [settings, setSettings] = useState<TenantSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (currentTenant) {
      loadSettings()
    }
  }, [currentTenant])

  const loadSettings = async () => {
    if (!currentTenant) return

    try {
      setIsLoading(true)
      const data = await tenantsApi.getTenantSettings(currentTenant.id)
      setSettings(data)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!currentTenant || !settings) return

    try {
      setSaving(true)
      await tenantsApi.updateTenantSettings(currentTenant.id, settings)
      await refreshTenant()
      setSuccessMessage('Settings saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = (updates: Partial<TenantSettings>) => {
    if (!settings) return
    setSettings({ ...settings, ...updates })
  }

  const updateNestedSettings = (section: keyof TenantSettings, updates: any) => {
    if (!settings) return
    setSettings({
      ...settings,
      [section]: { ...settings[section], ...updates }
    })
  }

  if (!canManageSettings()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to manage organization settings.</p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!settings || !currentTenant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Not Found</h3>
          <p className="text-gray-600">Unable to load organization settings.</p>
        </Card>
      </div>
    )
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Server },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-gray-600">Manage your organization's configuration and preferences.</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <Input
                        value={currentTenant.name}
                        onChange={(e) => {
                          // Note: This would need to update tenant, not settings
                          console.log('Update tenant name:', e.target.value)
                        }}
                        placeholder="Enter organization name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Model
                      </label>
                      <select
                        value={settings.defaultModel}
                        onChange={(e) => updateSettings({ defaultModel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {settings.allowedModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Rate Limit (requests/minute)
                      </label>
                      <Input
                        type="number"
                        value={settings.apiRateLimit}
                        onChange={(e) => updateSettings({ apiRateLimit: parseInt(e.target.value) })}
                        min="1"
                        max="10000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Retention (days)
                      </label>
                      <Input
                        type="number"
                        value={settings.dataRetentionDays}
                        onChange={(e) => updateSettings({ dataRetentionDays: parseInt(e.target.value) })}
                        min="1"
                        max="365"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Allowed Models</h4>
                  <div className="space-y-2">
                    {['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'llama-2'].map((model) => (
                      <label key={model} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.allowedModels.includes(model)}
                          onChange={(e) => {
                            const models = e.target.checked
                              ? [...settings.allowedModels, model]
                              : settings.allowedModels.filter(m => m !== model)
                            updateSettings({ allowedModels: models })
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{model}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding & Appearance</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.customBranding.primaryColor || '#3B82F6'}
                          onChange={(e) => updateNestedSettings('customBranding', { 
                            primaryColor: e.target.value 
                          })}
                          className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                        />
                        <Input
                          value={settings.customBranding.primaryColor || '#3B82F6'}
                          onChange={(e) => updateNestedSettings('customBranding', { 
                            primaryColor: e.target.value 
                          })}
                          placeholder="#3B82F6"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <Input
                        value={settings.customBranding.logoUrl || ''}
                        onChange={(e) => updateNestedSettings('customBranding', { 
                          logoUrl: e.target.value 
                        })}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Favicon URL
                      </label>
                      <Input
                        value={settings.customBranding.faviconUrl || ''}
                        onChange={(e) => updateNestedSettings('customBranding', { 
                          faviconUrl: e.target.value 
                        })}
                        placeholder="https://example.com/favicon.ico"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Require Multi-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Require all members to enable MFA</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.securitySettings.requireMfa}
                          onChange={(e) => updateNestedSettings('securitySettings', { 
                            requireMfa: e.target.checked 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Allow API Keys</h4>
                        <p className="text-sm text-gray-500">Allow members to create API keys</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.securitySettings.allowApiKeys}
                          onChange={(e) => updateNestedSettings('securitySettings', { 
                            allowApiKeys: e.target.checked 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <Input
                        type="number"
                        value={settings.securitySettings.sessionTimeout}
                        onChange={(e) => updateNestedSettings('securitySettings', { 
                          sessionTimeout: parseInt(e.target.value) 
                        })}
                        min="5"
                        max="1440"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IP Whitelist
                      </label>
                      <textarea
                        value={settings.securitySettings.ipWhitelist.join('\n')}
                        onChange={(e) => updateNestedSettings('securitySettings', { 
                          ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim()) 
                        })}
                        placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter one IP address or CIDR block per line. Leave empty to allow all IPs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive important updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notificationSettings.emailNotifications}
                          onChange={(e) => updateNestedSettings('notificationSettings', { 
                            emailNotifications: e.target.checked 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Quota Warnings</h4>
                        <p className="text-sm text-gray-500">Get notified when approaching limits</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notificationSettings.quotaWarnings}
                          onChange={(e) => updateNestedSettings('notificationSettings', { 
                            quotaWarnings: e.target.checked 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Usage Reports</h4>
                        <p className="text-sm text-gray-500">Receive monthly usage summaries</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notificationSettings.usageReports}
                          onChange={(e) => updateNestedSettings('notificationSettings', { 
                            usageReports: e.target.checked 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                onClick={saveSettings}
                disabled={isSaving}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}