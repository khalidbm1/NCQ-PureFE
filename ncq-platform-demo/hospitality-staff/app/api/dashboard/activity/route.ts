import { NextResponse } from 'next/server'

export async function GET() {
  // Mock recent activity data
  const activities = [
    {
      id: '1',
      type: 'check_in',
      title: 'Guest Check-In',
      description: 'John Doe checked into Room 201',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: '2',
      type: 'task_completed',
      title: 'Cleaning Completed',
      description: 'Room 105 cleaning completed',
      user: 'Mike Chen',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: '3',
      type: 'maintenance',
      title: 'Maintenance Request',
      description: 'AC repair requested for Room 302',
      user: 'Tom Wilson',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: '4',
      type: 'check_out',
      title: 'Guest Check-Out',
      description: 'Jane Smith checked out of Room 415',
      user: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      id: '5',
      type: 'alert',
      title: 'Low Inventory Alert',
      description: 'Towels running low in housekeeping storage',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
  ]

  return NextResponse.json({ data: activities })
}