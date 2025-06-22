import { NextRequest, NextResponse } from 'next/server'
import { User, UserRole, Department } from '@/lib/types'

// Mock user database
const mockUsers = [
  {
    id: '1',
    email: 'admin@hotel.com',
    password: 'admin123',
    name: 'Admin User',
    role: UserRole.ADMIN,
    department: Department.MANAGEMENT,
    permissions: [
      { id: '1', name: 'All Access', resource: '*', action: '*' }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'manager@hotel.com',
    password: 'manager123',
    name: 'Manager User',
    role: UserRole.MANAGER,
    department: Department.MANAGEMENT,
    permissions: [
      { id: '2', name: 'Manage Rooms', resource: 'rooms', action: '*' },
      { id: '3', name: 'Manage Staff', resource: 'staff', action: '*' },
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    email: 'frontdesk@hotel.com',
    password: 'frontdesk123',
    name: 'Front Desk Staff',
    role: UserRole.FRONT_DESK,
    department: Department.FRONT_OFFICE,
    permissions: [
      { id: '4', name: 'Manage Guests', resource: 'guests', action: '*' },
      { id: '5', name: 'View Rooms', resource: 'rooms', action: 'read' },
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    email: 'housekeeping@hotel.com',
    password: 'housekeeping123',
    name: 'Housekeeping Staff',
    role: UserRole.HOUSEKEEPING,
    department: Department.HOUSEKEEPING,
    permissions: [
      { id: '6', name: 'Manage Tasks', resource: 'tasks', action: '*' },
      { id: '7', name: 'Update Rooms', resource: 'rooms', action: 'update' },
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate mock token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}