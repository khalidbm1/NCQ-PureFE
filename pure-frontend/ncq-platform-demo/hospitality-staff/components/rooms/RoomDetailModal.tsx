'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Room, RoomStatus, CleaningStatus } from '@/lib/types'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api/client'

interface RoomDetailModalProps {
  room: Room | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function RoomDetailModal({ room, isOpen, onClose, onUpdate }: RoomDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  if (!room) return null

  const handleStatusUpdate = async (status: RoomStatus) => {
    setIsUpdating(true)
    try {
      await apiClient.rooms.updateStatus(room.id, status)
      toast.success('Room status updated successfully')
      onUpdate()
      onClose()
    } catch (error) {
      toast.error('Failed to update room status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCleaningStatusUpdate = async (status: CleaningStatus) => {
    setIsUpdating(true)
    try {
      await apiClient.rooms.update(room.id, { cleaningStatus: status })
      toast.success('Cleaning status updated successfully')
      onUpdate()
    } catch (error) {
      toast.error('Failed to update cleaning status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Room ${room.number} Details`} size="lg">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Room Type</label>
            <p className="mt-1 text-sm text-gray-900">{room.type}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Floor</label>
            <p className="mt-1 text-sm text-gray-900">Floor {room.floor}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Rate</label>
            <p className="mt-1 text-sm text-gray-900">{formatCurrency(room.rate)}/night</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Occupancy</label>
            <p className="mt-1 text-sm text-gray-900">
              {room.currentOccupancy}/{room.maxOccupancy} guests
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-500">Room Status</label>
          <div className="mt-2 flex items-center space-x-2">
            <Badge
              variant={room.status === RoomStatus.AVAILABLE ? 'success' : 'default'}
              size="md"
            >
              {room.status}
            </Badge>
            <select
              value={room.status}
              onChange={(e) => handleStatusUpdate(e.target.value as RoomStatus)}
              disabled={isUpdating}
              className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {Object.values(RoomStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cleaning Status */}
        <div>
          <label className="text-sm font-medium text-gray-500">Cleaning Status</label>
          <div className="mt-2 flex items-center space-x-2">
            <Badge
              variant={room.cleaningStatus === CleaningStatus.CLEAN ? 'success' : 'warning'}
              size="md"
            >
              {room.cleaningStatus}
            </Badge>
            <select
              value={room.cleaningStatus}
              onChange={(e) => handleCleaningStatusUpdate(e.target.value as CleaningStatus)}
              disabled={isUpdating}
              className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {Object.values(CleaningStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Features */}
        {room.features && room.features.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-500">Features</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {room.features.map((feature) => (
                <Badge key={feature} variant="info" size="sm">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Maintenance Info */}
        <div className="grid grid-cols-2 gap-4">
          {room.lastCleaned && (
            <div>
              <label className="text-sm font-medium text-gray-500">Last Cleaned</label>
              <p className="mt-1 text-sm text-gray-900">
                {formatDateTime(room.lastCleaned)}
              </p>
            </div>
          )}
          {room.lastMaintenance && (
            <div>
              <label className="text-sm font-medium text-gray-500">Last Maintenance</label>
              <p className="mt-1 text-sm text-gray-900">
                {formatDateTime(room.lastMaintenance)}
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        {room.notes && (
          <div>
            <label className="text-sm font-medium text-gray-500">Notes</label>
            <p className="mt-1 text-sm text-gray-900">{room.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button>Edit Room</Button>
        </div>
      </div>
    </Modal>
  )
}