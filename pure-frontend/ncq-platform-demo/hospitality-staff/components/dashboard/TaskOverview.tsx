'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Badge } from '@/components/ui/Badge'
import { getPriorityColor } from '@/lib/utils'
import { Priority, TaskStatus } from '@/lib/types'

export function TaskOverview() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['task-overview'],
    queryFn: () => apiClient.housekeeping.getTasks({ limit: 5 }),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!tasks?.data || tasks.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pending tasks
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.data.map((task: any) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Room {task.room?.number} - {task.type.replace('_', ' ')}
            </p>
            <div className="flex items-center mt-1 space-x-2">
              <Badge
                variant={task.status === TaskStatus.COMPLETED ? 'success' : 'default'}
                size="sm"
              >
                {task.status}
              </Badge>
              <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority} priority
              </span>
              {task.assignee && (
                <span className="text-xs text-gray-500">
                  • {task.assignee.name}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {task.scheduledTime
                ? new Date(task.scheduledTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Not scheduled'}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}