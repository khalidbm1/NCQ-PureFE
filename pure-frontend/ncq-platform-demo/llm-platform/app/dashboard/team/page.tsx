'use client'

import { useState } from 'react'
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  MoreVertical,
  Check,
  X,
  AlertCircle,
  UserPlus,
  Crown,
  Clock
} from 'lucide-react'
import { useI18n } from '@/lib/i18n/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/lib/store/auth'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  status: 'active' | 'pending'
  joinedAt: string
  lastActive: string
}

export default function TeamPage() {
  const { t, language } = useI18n()
  const { user } = useAuthStore()
  const isRTL = language === 'ar'
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showMemberMenu, setShowMemberMenu] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')
  const [inviteError, setInviteError] = useState('')
  
  // Mock team data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: user?.name || 'Current User',
      email: user?.email || 'user@example.com',
      role: 'owner',
      status: 'active',
      joinedAt: '2025-01-01',
      lastActive: 'Now'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'admin',
      status: 'active',
      joinedAt: '2025-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '3',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@example.com',
      role: 'member',
      status: 'active',
      joinedAt: '2025-02-01',
      lastActive: '1 day ago'
    },
    {
      id: '4',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'member',
      status: 'pending',
      joinedAt: '2025-02-20',
      lastActive: 'Never'
    }
  ])
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'member': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const handleInvite = () => {
    setInviteError('')
    
    if (!inviteEmail || !inviteEmail.includes('@')) {
      setInviteError('Please enter a valid email address')
      return
    }
    
    // Check if already exists
    if (teamMembers.some(m => m.email === inviteEmail)) {
      setInviteError('This user is already a team member')
      return
    }
    
    // Add new pending member
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: 'Never'
    }
    
    setTeamMembers([...teamMembers, newMember])
    setInviteEmail('')
    setInviteRole('member')
    setShowInviteModal(false)
  }
  
  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id))
    setShowMemberMenu(null)
  }
  
  const handleChangeRole = (id: string, newRole: 'admin' | 'member') => {
    setTeamMembers(teamMembers.map(m => 
      m.id === id ? { ...m, role: newRole } : m
    ))
    setShowMemberMenu(null)
  }
  
  const handleResendInvite = (id: string) => {
    // Mock resend invite
    console.log('Resending invite to:', id)
    setShowMemberMenu(null)
  }
  
  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.team.title')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.team.subtitle')}</p>
        </div>
        
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          {t('dashboard.team.inviteMember')}
        </Button>
      </div>
      
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('dashboard.team.stats.totalMembers')}
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {teamMembers.filter(m => m.status === 'active').length} {t('dashboard.team.stats.active')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('dashboard.team.stats.pendingInvites')}
              </CardTitle>
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('dashboard.team.stats.awaitingAcceptance')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('dashboard.team.stats.roles')}
              </CardTitle>
              <Shield className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <span>{teamMembers.filter(m => m.role === 'admin').length} {t('dashboard.team.roles.admins')}</span>
              <span>{teamMembers.filter(m => m.role === 'member').length} {t('dashboard.team.roles.members')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.team.members')}</CardTitle>
          <CardDescription>{t('dashboard.team.membersDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.team.table.member')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.team.table.role')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.team.table.status')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.team.table.joined')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.team.table.lastActive')}
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                    {t('dashboard.team.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
                        {t(`dashboard.team.roles.${member.role}`)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {t(`dashboard.team.status.${member.status}`)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {member.joinedAt}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {member.lastActive === 'Now' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        {member.lastActive}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {member.role !== 'owner' && (
                        <div className="relative">
                          <button
                            onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {showMemberMenu === member.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                              {member.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleResendInvite(member.id)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                  >
                                    {t('dashboard.team.actions.resendInvite')}
                                  </button>
                                  <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                  >
                                    {t('dashboard.team.actions.cancelInvite')}
                                  </button>
                                </>
                              ) : (
                                <>
                                  {member.role === 'member' && (
                                    <button
                                      onClick={() => handleChangeRole(member.id, 'admin')}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                    >
                                      {t('dashboard.team.actions.makeAdmin')}
                                    </button>
                                  )}
                                  {member.role === 'admin' && (
                                    <button
                                      onClick={() => handleChangeRole(member.id, 'member')}
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                    >
                                      {t('dashboard.team.actions.removAdmin')}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                  >
                                    {t('dashboard.team.actions.removeMember')}
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowInviteModal(false)} />
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.team.invite.title')}</h3>
              
              {inviteError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-800">{inviteError}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('dashboard.team.invite.email')}
                  </label>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('dashboard.team.invite.role')}
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  >
                    <option value="member">{t('dashboard.team.roles.member')}</option>
                    <option value="admin">{t('dashboard.team.roles.admin')}</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {inviteRole === 'admin' 
                      ? t('dashboard.team.invite.adminDescription')
                      : t('dashboard.team.invite.memberDescription')
                    }
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  {t('dashboard.team.invite.cancel')}
                </Button>
                <Button
                  onClick={handleInvite}
                  className="flex-1"
                >
                  {t('dashboard.team.invite.send')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}