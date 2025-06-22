'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

const services = [
  { name: 'License Service', status: 'healthy', uptime: '99.99%' },
  { name: 'Event Bus (Kafka)', status: 'healthy', uptime: '99.95%' },
  { name: 'Payment Gateway', status: 'healthy', uptime: '100%' },
  { name: 'Blockchain Node', status: 'warning', uptime: '98.5%' },
  { name: 'IoT Gateway', status: 'healthy', uptime: '99.9%' },
  { name: 'LLM Engine', status: 'healthy', uptime: '99.8%' },
]

export function SystemHealth() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">System Health</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {service.status === 'healthy' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : service.status === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="text-sm font-medium">{service.name}</span>
            </div>
            <span className="text-sm text-gray-500">{service.uptime}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm">
          <p className="font-medium text-gray-700">Overall System Status</p>
          <p className="text-green-600 font-semibold mt-1">All Systems Operational</p>
        </div>
      </div>
    </Card>
  )
}