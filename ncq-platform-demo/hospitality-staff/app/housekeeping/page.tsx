'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TaskList } from '@/components/housekeeping/TaskList'
import { TaskCalendar } from '@/components/housekeeping/TaskCalendar'
import { CreateTaskModal } from '@/components/housekeeping/CreateTaskModal'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { PlusIcon, CalendarIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { TaskStatus } from '@/lib/types'
import toast from 'react-hot-toast'

export default function HousekeepingPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { data: tasks, refetch } = useQuery({
    queryKey: ['housekeeping-tasks', selectedDate],
    queryFn: () => apiClient.housekeeping.getTasks({ date: selectedDate.toISOString() }),
  })

  const { data: schedule } = useQuery({
    queryKey: ['housekeeping-schedule', selectedDate],
    queryFn: () => apiClient.housekeeping.getSchedule(selectedDate.toISOString()),
  })

  const assignTaskMutation = useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) =>
      apiClient.housekeeping.assignTask(taskId, userId),
    onSuccess: () => {
      toast.success('Task assigned successfully')
      refetch()
    },
  })

  const completeTaskMutation = useMutation({
    mutationFn: ({ taskId, notes }: { taskId: string; notes?: string }) =>
      apiClient.housekeeping.completeTask(taskId, notes),
    onSuccess: () => {
      toast.success('Task completed successfully')
      refetch()
    },
  })

  const taskStats = {
    total: tasks?.data?.length || 0,
    pending: tasks?.data?.filter((t: any) => t.status === TaskStatus.PENDING).length || 0,
    inProgress: tasks?.data?.filter((t: any) => t.status === TaskStatus.IN_PROGRESS).length || 0,
    completed: tasks?.data?.filter((t: any) => t.status === TaskStatus.COMPLETED).length || 0,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Housekeeping Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage cleaning tasks, schedules, and staff assignments
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900">{taskStats.total}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-semibold text-yellow-600">{taskStats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-semibold text-blue-600">{taskStats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600">{taskStats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === 'list'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ListBulletIcon className="h-4 w-4 mr-1.5" />
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === 'calendar'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CalendarIcon className="h-4 w-4 mr-1.5" />
            Calendar View
          </button>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <TaskList
            tasks={tasks?.data || []}
            onAssign={(taskId, userId) => assignTaskMutation.mutate({ taskId, userId })}
            onComplete={(taskId, notes) => completeTaskMutation.mutate({ taskId, notes })}
          />
        ) : (
          <TaskCalendar
            schedule={schedule?.data || []}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        )}

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => {
            refetch()
            setIsCreateOpen(false)
          }}
        />
      </div>
    </DashboardLayout>
  )
}