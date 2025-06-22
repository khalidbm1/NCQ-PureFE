import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface Tenant {
  id: string
  name: string
  email: string
  contactPerson?: string
  phone?: string
  createdAt: string
  licenses: number
  status: 'active' | 'suspended' | 'inactive'
}

export function useTenants() {
  return useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: '1',
          name: 'Acme Corporation',
          email: 'admin@acme.com',
          contactPerson: 'John Doe',
          phone: '+1-555-0123',
          createdAt: '2024-01-15',
          licenses: 5,
          status: 'active'
        },
        {
          id: '2',
          name: 'TechStart Inc',
          email: 'contact@techstart.com',
          contactPerson: 'Jane Smith',
          phone: '+1-555-0124',
          createdAt: '2024-01-20',
          licenses: 3,
          status: 'active'
        },
        {
          id: '3',
          name: 'Global Health Systems',
          email: 'info@globalhealth.com',
          contactPerson: 'Dr. Wilson',
          phone: '+1-555-0125',
          createdAt: '2024-02-01',
          licenses: 8,
          status: 'active'
        },
      ]
    },
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Partial<Tenant>) => {
      // Would POST to your API
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })
}