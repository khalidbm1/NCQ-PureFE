import { NextRequest, NextResponse } from 'next/server'
import { HousekeepingTask, TaskType, TaskStatus, Priority } from '@/lib/types'

// Mock housekeeping tasks
const mockTasks: HousekeepingTask[] = [
  {
    id: '1',
    roomId: '1',
    room: {
      id: '1',
      number: '101',
      floor: 1,
      type: 'STANDARD' as any,
      status: 'OCCUPIED' as any,
      cleaningStatus: 'DIRTY' as any,
      features: ['WiFi', 'TV'],
      maxOccupancy: 2,
      currentOccupancy: 2,
      rate: 150,
    },
    type: TaskType.DAILY_CLEANING,
    priority: Priority.HIGH,
    status: TaskStatus.PENDING,
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    estimatedDuration: 30,
    notes: 'Guest checking out at 11 AM',
  },
  {
    id: '2',
    roomId: '3',
    room: {
      id: '3',
      number: '103',
      floor: 1,
      type: 'STANDARD' as any,
      status: 'CLEANING' as any,
      cleaningStatus: 'CLEANING' as any,
      features: ['WiFi', 'TV'],
      maxOccupancy: 2,
      currentOccupancy: 0,
      rate: 150,
    },
    assignedTo: '10',
    assignee: {
      id: '10',
      name: 'Maria Garcia',
      email: 'maria@hotel.com',
      role: 'HOUSEKEEPING' as any,
      department: 'HOUSEKEEPING' as any,
      permissions: [],
      isActive: true,
      createdAt: new Date(),
    },
    type: TaskType.DAILY_CLEANING,
    priority: Priority.MEDIUM,
    status: TaskStatus.IN_PROGRESS,
    startedAt: new Date(Date.now() - 1000 * 60 * 15), // Started 15 minutes ago
    estimatedDuration: 30,
  },
  {
    id: '3',
    roomId: '4',
    room: {
      id: '4',
      number: '201',
      floor: 2,
      type: 'SUITE' as any,
      status: 'RESERVED' as any,
      cleaningStatus: 'INSPECTED' as any,
      features: ['WiFi', 'TV', 'Mini Bar'],
      maxOccupancy: 4,
      currentOccupancy: 0,
      rate: 350,
    },
    type: TaskType.DEEP_CLEANING,
    priority: Priority.LOW,
    status: TaskStatus.PENDING,
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    estimatedDuration: 60,
    notes: 'VIP guest arriving tomorrow',
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const status = searchParams.get('status')
  const limit = searchParams.get('limit')

  let filteredTasks = [...mockTasks]

  // Apply filters
  if (status) {
    filteredTasks = filteredTasks.filter((task) => task.status === status)
  }

  if (limit) {
    filteredTasks = filteredTasks.slice(0, parseInt(limit))
  }

  return NextResponse.json({ data: filteredTasks })
}

export async function POST(request: NextRequest) {
  const task = await request.json()
  
  const newTask: HousekeepingTask = {
    ...task,
    id: Date.now().toString(),
    status: TaskStatus.PENDING,
    estimatedDuration: task.estimatedDuration || 30,
  }

  return NextResponse.json({ data: newTask }, { status: 201 })
}