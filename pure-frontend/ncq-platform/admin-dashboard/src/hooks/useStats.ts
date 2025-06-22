import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Stats {
  totalTenants: number
  activeLicenses: number
  monthlyRevenue: number
  apiCallsToday: number
}

export function useStats() {
  return useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: async () => {
      // This would normally fetch from your API
      // For now, return mock data
      return {
        totalTenants: 142,
        activeLicenses: 387,
        monthlyRevenue: 48750,
        apiCallsToday: 125000,
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}