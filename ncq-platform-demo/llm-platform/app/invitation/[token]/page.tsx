'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { invitationsApi } from '../../../lib/api/tenants'
import { TenantInvitation } from '../../../lib/types'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { 
  Building2, 
  Mail, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Shield,
  Users,
  Eye,
  Calendar
} from 'lucide-react'

export default function InvitationPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [invitation, setInvitation] = useState<TenantInvitation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (token) {
      loadInvitation()
    }
  }, [token])

  const loadInvitation = async () => {
    try {
      setIsLoading(true)
      const data = await invitationsApi.getInvitationByToken(token)
      setInvitation(data)
    } catch (err: any) {
      console.error('Failed to load invitation:', err)
      setError(err.message || 'Failed to load invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptInvitation = async () => {
    try {
      setIsProcessing(true)
      setError('')
      
      const result = await invitationsApi.acceptInvitation(token)
      setSuccess('Invitation accepted successfully!')
      
      // Redirect to organization dashboard after a delay
      setTimeout(() => {
        router.push('/dashboard/organization')
      }, 2000)
    } catch (err: any) {
      console.error('Failed to accept invitation:', err)
      setError(err.message || 'Failed to accept invitation')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectInvitation = async () => {
    if (!confirm('Are you sure you want to reject this invitation?')) return

    try {
      setIsProcessing(true)
      setError('')
      
      await invitationsApi.rejectInvitation(token)
      setSuccess('Invitation rejected.')
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error('Failed to reject invitation:', err)
      setError(err.message || 'Failed to reject invitation')
    } finally {
      setIsProcessing(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-6 w-6 text-blue-600" />
      case 'member': return <Users className="h-6 w-6 text-green-600" />
      case 'viewer': return <Eye className="h-6 w-6 text-gray-600" />
      default: return <Users className="h-6 w-6 text-gray-600" />
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Can manage organization settings, members, and billing'
      case 'member':
        return 'Can use API services and view organization data'
      case 'viewer':
        return 'Can view organization data and usage statistics'
      default:
        return 'Basic organization access'
    }
  }

  const isExpired = invitation ? new Date(invitation.expiresAt) < new Date() : false

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Invitation</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-600 mb-4">{success}</p>
          <div className="animate-pulse text-blue-600">
            Redirecting you to the organization dashboard...
          </div>
        </Card>
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invitation Not Found</h3>
          <p className="text-gray-600 mb-4">
            This invitation may have been revoked or does not exist.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  if (invitation.status !== 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Invitation {invitation.status === 'accepted' ? 'Already Accepted' : 'Expired'}
          </h3>
          <p className="text-gray-600 mb-4">
            {invitation.status === 'accepted' 
              ? 'This invitation has already been accepted.'
              : 'This invitation has expired or been revoked.'
            }
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invitation Expired</h3>
          <p className="text-gray-600 mb-4">
            This invitation expired on {new Date(invitation.expiresAt).toLocaleDateString()}.
            Please contact the organization administrator for a new invitation.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Invitation</h1>
          <p className="text-gray-600 mt-2">
            You've been invited to join an organization on NCQ LLM
          </p>
        </div>

        {/* Invitation Details */}
        <Card className="p-6 mb-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Join Organization
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700">Invited Email</span>
              </div>
              <span className="text-sm text-gray-900">{invitation.email}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                {getRoleIcon(invitation.role)}
                <span className="text-sm font-medium text-gray-700 ml-3">Role</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {invitation.role}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {getRoleDescription(invitation.role)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700">Invited By</span>
              </div>
              <span className="text-sm text-gray-900">{invitation.invitedBy}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-sm font-medium text-gray-700">Expires</span>
              </div>
              <span className="text-sm text-gray-900">
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleAcceptInvitation}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Accepting...' : 'Accept Invitation'}
          </Button>
          
          <Button
            onClick={handleRejectInvitation}
            disabled={isProcessing}
            variant="outline"
            className="w-full"
          >
            {isProcessing ? 'Rejecting...' : 'Reject Invitation'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By accepting this invitation, you agree to NCQ LLM's{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}