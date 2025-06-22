'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'license_activated',
    title: 'License Activated',
    description: 'Blockchain license activated for Acme Corp',
    time: '2 minutes ago',
    icon: CheckCircle,
    color: 'text-green-600'
  },
  {
    id: 2,
    type: 'quota_exceeded',
    title: 'Quota Exceeded',
    description: 'API calls limit reached for TechStart Inc',
    time: '15 minutes ago',
    icon: AlertCircle,
    color: 'text-yellow-600'
  },
  {
    id: 3,
    type: 'license_revoked',
    title: 'License Revoked',
    description: 'IoT license revoked for TestCorp',
    time: '1 hour ago',
    icon: XCircle,
    color: 'text-red-600'
  },
  {
    id: 4,
    type: 'new_tenant',
    title: 'New Tenant Onboarded',
    description: 'Global Health Systems joined the platform',
    time: '3 hours ago',
    icon: Package,
    color: 'text-blue-600'
  },
]

export function RecentActivity() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}