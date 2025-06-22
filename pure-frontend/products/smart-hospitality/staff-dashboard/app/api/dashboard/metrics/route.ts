import { NextResponse } from 'next/server'
import { DashboardMetrics } from '@/lib/types'

export async function GET() {
  // Mock dashboard metrics
  const metrics: DashboardMetrics = {
    occupancyRate: 78,
    averageDailyRate: 189.50,
    revPAR: 147.81,
    totalRevenue: 45320,
    totalRooms: 120,
    occupiedRooms: 94,
    availableRooms: 26,
    checkInsToday: 12,
    checkOutsToday: 8,
    pendingTasks: 15,
    maintenanceRequests: 3,
    guestSatisfaction: 4.5,
  }

  return NextResponse.json({ data: metrics })
}