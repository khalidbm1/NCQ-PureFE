import { Room, RoomStatus } from '@/lib/types'
import { RoomCard } from './RoomCard'

interface RoomGridProps {
  rooms: Room[]
  isLoading: boolean
  onRoomClick: (room: Room) => void
  onStatusUpdate: (roomId: string, status: RoomStatus) => void
}

export function RoomGrid({ rooms, isLoading, onRoomClick, onStatusUpdate }: RoomGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No rooms found matching your criteria</p>
      </div>
    )
  }

  // Group rooms by floor
  const roomsByFloor = rooms.reduce((acc, room) => {
    const floor = room.floor
    if (!acc[floor]) {
      acc[floor] = []
    }
    acc[floor].push(room)
    return acc
  }, {} as Record<number, Room[]>)

  return (
    <div className="space-y-8">
      {Object.entries(roomsByFloor)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([floor, floorRooms]) => (
          <div key={floor}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Floor {floor}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {floorRooms
                .sort((a, b) => a.number.localeCompare(b.number))
                .map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onClick={() => onRoomClick(room)}
                    onStatusUpdate={onStatusUpdate}
                  />
                ))}
            </div>
          </div>
        ))}
    </div>
  )
}