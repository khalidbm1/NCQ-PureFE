import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Mock user response
  return NextResponse.json({
    id: '1',
    email: 'admin@hotel.com',
    name: 'Admin User',
    role: 'ADMIN',
    department: 'MANAGEMENT',
    permissions: [
      { id: '1', name: 'All Access', resource: '*', action: '*' }
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
  })
}