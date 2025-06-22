import { NextRequest, NextResponse } from 'next/server'
import { RevenueData } from '@/lib/types'
import { subDays } from 'date-fns'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  // Generate mock revenue data for the last 7 days
  const data: RevenueData[] = []
  const days = 7
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const roomRevenue = 8000 + Math.random() * 4000 // $8,000-$12,000
    const foodBeverageRevenue = 2000 + Math.random() * 2000 // $2,000-$4,000
    const otherRevenue = 500 + Math.random() * 1500 // $500-$2,000
    
    data.push({
      date,
      roomRevenue,
      foodBeverageRevenue,
      otherRevenue,
      totalRevenue: roomRevenue + foodBeverageRevenue + otherRevenue,
    })
  }

  return NextResponse.json({ data })
}