'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTenant } from '../../../../lib/context/tenant-context'
import { Card } from '../../../../components/ui/Card'
import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function NewOrganizationPage() {
  const router = useRouter()
  const { createTenant } = useTenant()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    plan: 'free'
  })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [slugError, setSlugError] = useState('')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
    }))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = generateSlug(e.target.value)
    setFormData(prev => ({ ...prev, slug }))
    setSlugError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Organization name is required')
      return false
    }

    if (!formData.slug.trim()) {
      setError('Organization slug is required')
      return false
    }

    if (formData.slug.length < 3) {
      setSlugError('Slug must be at least 3 characters long')
      return false
    }

    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      setSlugError('Slug can only contain lowercase letters, numbers, and hyphens')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSlugError('')

    if (!validateForm()) return

    try {
      setIsCreating(true)
      const tenant = await createTenant({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        plan: formData.plan as any
      })
      
      // Redirect to the new organization dashboard
      router.push('/dashboard/organization')
    } catch (err: any) {
      console.error('Failed to create organization:', err)
      if (err.message?.includes('slug')) {
        setSlugError('This slug is already taken. Please choose a different one.')
      } else {
        setError(err.message || 'Failed to create organization. Please try again.')
      }
    } finally {
      setIsCreating(false)
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        '1,000 requests/month',
        '10,000 tokens/month',
        'Basic models',
        'Community support'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '$29',
      description: 'For small teams and projects',
      features: [
        '50,000 requests/month',
        '500,000 tokens/month',
        'All models',
        'Email support',
        'Usage analytics'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$99',
      description: 'For growing businesses',
      features: [
        '200,000 requests/month',
        '2,000,000 tokens/month',
        'All models',
        'Priority support',
        'Advanced analytics',
        'Team management'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$299',
      description: 'For large organizations',
      features: [
        'Unlimited requests',
        'Unlimited tokens',
        'All models',
        'Dedicated support',
        'Custom models',
        'SOC 2 compliance'
      ]
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Organization</h1>
            <p className="text-gray-600 mt-2">
              Set up a new organization to start using NCQ LLM services
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Organization Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Organization Details</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="My Company"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The display name for your organization
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Slug *
                </label>
                <Input
                  value={formData.slug}
                  onChange={handleSlugChange}
                  placeholder="my-company"
                  required
                />
                {slugError && (
                  <p className="text-xs text-red-600 mt-1">{slugError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Used in URLs and API endpoints. Only lowercase letters, numbers, and hyphens.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your organization..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Plan Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
                    formData.plan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={formData.plan === plan.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                      className="sr-only"
                    />
                    
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Terms and Create Button */}
          <Card className="p-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                By creating an organization, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !formData.name || !formData.slug}
                  className="min-w-32"
                >
                  {isCreating ? 'Creating...' : 'Create Organization'}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}