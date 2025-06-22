import { Room, RoomStatus } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { getRoomStatusColor } from '@/lib/utils'
import {
  UserGroupIcon,
  WifiIcon,
  TvIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

interface RoomCardProps {
  room: Room
  onClick: () => void
  onStatusUpdate: (roomId: string, status: RoomStatus) => void
}

export function RoomCard({ room, onClick, onStatusUpdate }: RoomCardProps) {
  const statusColors = {
    AVAILABLE: 'border-green-300 bg-green-50',
    OCCUPIED: 'border-red-300 bg-red-50',
    RESERVED: 'border-blue-300 bg-blue-50',
    CLEANING: 'border-yellow-300 bg-yellow-50',
    MAINTENANCE: 'border-orange-300 bg-orange-50',
    BLOCKED: 'border-gray-300 bg-gray-50',
  }

  const quickActions = {
    AVAILABLE: [
      { label: 'Reserve', status: RoomStatus.RESERVED },
      { label: 'Block', status: RoomStatus.BLOCKED },
    ],
    OCCUPIED: [
      { label: 'Check Out', status: RoomStatus.CLEANING },
    ],
    RESERVED: [
      { label: 'Check In', status: RoomStatus.OCCUPIED },
      { label: 'Cancel', status: RoomStatus.AVAILABLE },
    ],
    CLEANING: [
      { label: 'Mark Clean', status: RoomStatus.AVAILABLE },
      { label: 'Maintenance', status: RoomStatus.MAINTENANCE },
    ],
    MAINTENANCE: [
      { label: 'Complete', status: RoomStatus.CLEANING },
    ],
    BLOCKED: [
      { label: 'Unblock', status: RoomStatus.AVAILABLE },
    ],
  }

  return (
    <div
      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
        statusColors[room.status]
      }`}
      onClick={onClick}
    >
      {/* Room number and type */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Room {room.number}
          </h3>
          <p className="text-sm text-gray-600">{room.type}</p>
        </div>
        <Badge variant={room.status === RoomStatus.AVAILABLE ? 'success' : 'default'}>
          {room.status}
        </Badge>
      </div>

      {/* Room features */}
      <div className="flex items-center space-x-3 mb-3 text-gray-500">
        <div className="flex items-center text-sm">
          <UserGroupIcon className="h-4 w-4 mr-1" />
          {room.currentOccupancy}/{room.maxOccupancy}
        </div>
        {room.features?.includes('WiFi') && <WifiIcon className="h-4 w-4" />}
        {room.features?.includes('TV') && <TvIcon className="h-4 w-4" />}
      </div>

      {/* Cleaning status */}
      <div className="flex items-center text-sm text-gray-600 mb-3">
        <SparklesIcon className="h-4 w-4 mr-1" />
        <span className={getRoomStatusColor(room.cleaningStatus)}>
          {room.cleaningStatus}
        </span>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions[room.status]?.map((action) => (
          <button
            key={action.status}
            onClick={(e) => {
              e.stopPropagation()
              onStatusUpdate(room.id, action.status)
            }}
            className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Rate */}
      <div className="absolute top-4 right-4 text-sm font-semibold text-gray-900">
        ${room.rate}/night
      </div>
    </div>
  )
}