'use client'

import { Tenant } from '@/hooks/useTenants'
import { formatDate } from '@/lib/utils'
import { MoreHorizontal, Edit, Trash, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface TenantTableProps {
  tenants: Tenant[]
  isLoading: boolean
}

export function TenantTable({ tenants, isLoading }: TenantTableProps) {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Licenses</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium">{tenant.name}</div>
              </td>
              <td className="py-3 px-4 text-gray-600">{tenant.email}</td>
              <td className="py-3 px-4 text-gray-600">
                <div>{tenant.contactPerson}</div>
                <div className="text-sm">{tenant.phone}</div>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tenant.licenses} active
                </span>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tenant.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : tenant.status === 'suspended'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {tenant.status}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600">
                {formatDate(tenant.createdAt)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}