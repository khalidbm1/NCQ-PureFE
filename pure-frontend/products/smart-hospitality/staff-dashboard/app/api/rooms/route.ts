import { NextRequest, NextResponse } from 'next/server'
import { Room, RoomStatus, RoomType, CleaningStatus } from '@/lib/types'

// Mock room data
const mockRooms: Room[] = [
  {
    id: '1',
    number: '101',
    floor: 1,
    type: RoomType.STANDARD,
    status: RoomStatus.AVAILABLE,
    cleaningStatus: CleaningStatus.CLEAN,
    features: ['WiFi', 'TV', 'Air Conditioning'],
    maxOccupancy: 2,
    currentOccupancy: 0,
    rate: 150,
    lastCleaned: new Date('2024-01-10T10:00:00'),
  },
  {
    id: '2',
    number: '102',
    floor: 1,
    type: RoomType.DELUXE,
    status: RoomStatus.OCCUPIED,
    cleaningStatus: CleaningStatus.CLEAN,
    features: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
    maxOccupancy: 3,
    currentOccupancy: 2,
    rate: 200,
    lastCleaned: new Date('2024-01-10T11:00:00'),
  },
  {
    id: '3',
    number: '103',
    floor: 1,
    type: RoomType.STANDARD,
    status: RoomStatus.CLEANING,
    cleaningStatus: CleaningStatus.CLEANING,
    features: ['WiFi', 'TV'],
    maxOccupancy: 2,
    currentOccupancy: 0,
    rate: 150,
  },
  {
    id: '4',
    number: '201',
    floor: 2,
    type: RoomType.SUITE,
    status: RoomStatus.RESERVED,
    cleaningStatus: CleaningStatus.INSPECTED,
    features: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi'],
    maxOccupancy: 4,
    currentOccupancy: 0,
    rate: 350,
    lastCleaned: new Date('2024-01-09T14:00:00'),
  },
  {
    id: '5',
    number: '202',
    floor: 2,
    type: RoomType.DELUXE,
    status: RoomStatus.MAINTENANCE,
    cleaningStatus: CleaningStatus.DIRTY,
    features: ['WiFi', 'TV', 'Air Conditioning'],
    maxOccupancy: 3,
    currentOccupancy: 0,
    rate: 200,
    notes: 'Air conditioning repair needed',
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')
  const floor = searchParams.get('floor')
  const search = searchParams.get('search')

  let filteredRooms = [...mockRooms]

  // Apply filters
  if (status) {
    filteredRooms = filteredRooms.filter((room) => room.status === status)
  }
  if (type) {
    filteredRooms = filteredRooms.filter((room) => room.type === type)
  }
  if (floor) {
    filteredRooms = filteredRooms.filter((room) => room.floor === parseInt(floor))
  }
  if (search) {
    filteredRooms = filteredRooms.filter((room) =>
      room.number.toLowerCase().includes(search.toLowerCase())
    )
  }

  return NextResponse.json({ data: filteredRooms })
}

export async function POST(request: NextRequest) {
  const room = await request.json()
  
  // In a real app, this would save to database
  const newRoom: Room = {
    ...room,
    id: Date.now().toString(),
    currentOccupancy: 0,
    cleaningStatus: CleaningStatus.CLEAN,
  }

  return NextResponse.json({ data: newRoom }, { status: 201 })
}