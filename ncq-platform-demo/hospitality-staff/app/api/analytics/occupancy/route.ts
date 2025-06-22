import { NextRequest, NextResponse } from 'next/server'
import { OccupancyData } from '@/lib/types'
import { subDays, format } from 'date-fns'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  // Generate mock occupancy data for the last 30 days
  const data: OccupancyData[] = []
  const days = 30
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const totalRooms = 120
    const baseOccupancy = 65 + Math.random() * 20 // 65-85% occupancy
    const occupiedRooms = Math.floor((baseOccupancy / 100) * totalRooms)
    
    data.push({
      date,
      occupiedRooms,
      totalRooms,
      occupancyRate: Math.round((occupiedRooms / totalRooms) * 100),
    })
  }

  return NextResponse.json({ data })
}