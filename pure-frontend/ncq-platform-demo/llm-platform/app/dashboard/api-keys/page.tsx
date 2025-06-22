'use client'

import { useState } from 'react'
import { 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Check,
  AlertCircle,
  Calendar,
  Activity
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'

interface ApiKey {
  id: string
  label: string
  key: string
  createdAt: string
  lastUsed: string | null
  status: 'active' | 'revoked'
}

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    label: 'Production App',
    key: 'ncq_live_1234567890abcdef',
    createdAt: '2025-05-15',
    lastUsed: '2025-06-01',
    status: 'active'
  },
  {
    id: '2',
    label: 'Development Environment',
    key: 'ncq_test_abcdef1234567890',
    createdAt: '2025-05-20',
    lastUsed: '2025-05-30',
    status: 'active'
  },
  {
    id: '3',
    label: 'Mobile App (Deprecated)',
    key: 'ncq_live_oldkey123456789',
    createdAt: '2025-04-10',
    lastUsed: '2025-05-01',
    status: 'revoked'
  }
]

export default function ApiKeysPage() {
  const { t, language } = useI18n()
  const isRTL = language === 'ar'
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null)
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [newKeyLabel, setNewKeyLabel] = useState('')
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)

  const handleCopyKey = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKeyId(keyId)
    setTimeout(() => setCopiedKeyId(null), 2000)
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 4)
  }

  const handleCreateKey = () => {
    if (!newKeyLabel.trim()) return

    const newKey: ApiKey = {
      id: String(Date.now()),
      label: newKeyLabel,
      key: `ncq_live_${Math.random().toString(36).substring(2, 18)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      status: 'active'
    }

    setApiKeys([newKey, ...apiKeys])
    setNewlyCreatedKey(newKey.key)
    setNewKeyLabel('')
    setShowCreateModal(false)
  }

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' } : key
    ))
    setShowRevokeModal(null)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.apiKeys.title')}</h1>
        <p className="text-gray-600 mt-1">{t('dashboard.apiKeys.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.apiKeys.stats.activeKeys')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {apiKeys.filter(key => key.status === 'active').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.apiKeys.stats.totalKeys')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{apiKeys.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.apiKeys.stats.lastUsage')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{t('dashboard.apiKeys.stats.today')}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Newly Created Key Alert */}
      {newlyCreatedKey && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">{t('dashboard.apiKeys.createKey.successTitle')}</p>
              <p className="text-sm text-green-700 mt-1">
                {t('dashboard.apiKeys.createKey.successMessage')}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <code className="bg-white px-3 py-1 rounded border border-green-300 text-sm font-mono">
                  {newlyCreatedKey}
                </code>
                <button
                  onClick={() => {
                    handleCopyKey(newlyCreatedKey, 'new')
                    setNewlyCreatedKey(null)
                  }}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  {t('dashboard.apiKeys.createKey.copyAndClose')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.apiKeys.title')}</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            {t('dashboard.apiKeys.createKey.button')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('dashboard.apiKeys.table.label')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('dashboard.apiKeys.table.apiKey')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('dashboard.apiKeys.table.created')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('dashboard.apiKeys.table.lastUsed')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('dashboard.apiKeys.table.status')}
                </th>
                <th className={`px-6 py-3 ${isRTL ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('dashboard.apiKeys.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id} className={apiKey.status === 'revoked' ? 'opacity-60' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{apiKey.label}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-gray-600">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={apiKey.status === 'revoked'}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={apiKey.status === 'revoked'}
                      >
                        {copiedKeyId === apiKey.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {apiKey.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {apiKey.lastUsed || t('dashboard.apiKeys.table.never')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      apiKey.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {t(`dashboard.apiKeys.table.${apiKey.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {apiKey.status === 'active' && (
                      <button
                        onClick={() => setShowRevokeModal(apiKey.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        {t('dashboard.apiKeys.table.revoke')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.apiKeys.createKey.title')}</h3>
              
              <div className="mb-4">
                <label htmlFor="keyLabel" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.apiKeys.createKey.labelField')}
                </label>
                <input
                  id="keyLabel"
                  type="text"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder={t('dashboard.apiKeys.createKey.labelPlaceholder')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t('dashboard.apiKeys.createKey.labelHelp')}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">{t('dashboard.apiKeys.createKey.important')}</p>
                    <p className="text-yellow-700 mt-1">
                      {t('dashboard.apiKeys.createKey.warning')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {t('dashboard.apiKeys.createKey.cancel')}
                </button>
                <button
                  onClick={handleCreateKey}
                  disabled={!newKeyLabel.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('dashboard.apiKeys.createKey.create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Key Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowRevokeModal(null)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.apiKeys.revokeKey.title')}</h3>
              
              <p className="text-gray-600 mb-6">
                {t('dashboard.apiKeys.revokeKey.message')}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRevokeModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {t('dashboard.apiKeys.revokeKey.cancel')}
                </button>
                <button
                  onClick={() => handleRevokeKey(showRevokeModal)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  {t('dashboard.apiKeys.revokeKey.revoke')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}