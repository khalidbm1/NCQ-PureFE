'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { RoomGrid } from '@/components/rooms/RoomGrid'
import { RoomFilters } from '@/components/rooms/RoomFilters'
import { RoomDetailModal } from '@/components/rooms/RoomDetailModal'
import { Button } from '@/components/ui/Button'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Room, RoomStatus, RoomType } from '@/lib/types'

export default function RoomsPage() {
  const [filters, setFilters] = useState({
    status: null as RoomStatus | null,
    type: null as RoomType | null,
    floor: null as number | null,
    search: '',
  })
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { data: rooms, isLoading, refetch } = useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => apiClient.rooms.getAll(filters),
  })

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room)
    setIsDetailOpen(true)
  }

  const handleStatusUpdate = async (roomId: string, status: RoomStatus) => {
    await apiClient.rooms.updateStatus(roomId, status)
    refetch()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Room Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage room statuses, assignments, and maintenance
            </p>
          </div>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </div>

        {/* Filters */}
        <RoomFilters filters={filters} onFiltersChange={setFilters} />

        {/* Room Grid */}
        <RoomGrid
          rooms={rooms?.data || []}
          isLoading={isLoading}
          onRoomClick={handleRoomClick}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Room Detail Modal */}
        <RoomDetailModal
          room={selectedRoom}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false)
            setSelectedRoom(null)
          }}
          onUpdate={() => refetch()}
        />
      </div>
    </DashboardLayout>
  )
}