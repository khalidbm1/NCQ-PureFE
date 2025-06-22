import { useState } from 'react'
import { HousekeepingTask, TaskStatus, Priority } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDateTime, getPriorityColor, getTaskStatusColor } from '@/lib/utils'
import {
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface TaskListProps {
  tasks: HousekeepingTask[]
  onAssign: (taskId: string, userId: string) => void
  onComplete: (taskId: string, notes?: string) => void
}

export function TaskList({ tasks, onAssign, onComplete }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [completionNotes, setCompletionNotes] = useState('')

  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(task)
    return acc
  }, {} as Record<TaskStatus, HousekeepingTask[]>)

  const handleComplete = (taskId: string) => {
    onComplete(taskId, completionNotes)
    setCompletionNotes('')
    setSelectedTask(null)
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([status, statusTasks]) => (
        <div key={status}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {status.replace('_', ' ')} ({statusTasks.length})
          </h3>
          <div className="space-y-3">
            {statusTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Room {task.room?.number} - {task.type.replace('_', ' ')}
                      </h4>
                      <Badge
                        variant={task.priority === Priority.URGENT ? 'danger' : 'default'}
                        size="sm"
                      >
                        <span className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </span>
                      </Badge>
                      <Badge
                        variant={task.status === TaskStatus.COMPLETED ? 'success' : 'default'}
                        size="sm"
                      >
                        {task.status}
                      </Badge>
                    </div>

                    <div className="mt-2 space-y-1">
                      {task.scheduledTime && (
                        <div className="flex items-center text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Scheduled: {formatDateTime(task.scheduledTime)}
                        </div>
                      )}
                      {task.assignee && (
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="h-4 w-4 mr-1" />
                          Assigned to: {task.assignee.name}
                        </div>
                      )}
                      {task.notes && (
                        <p className="text-sm text-gray-600 mt-1">{task.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center space-x-2">
                      {task.status === TaskStatus.PENDING && (
                        <Button
                          size="sm"
                          onClick={() => {
                            // In a real app, this would open an assignment modal
                            const userId = prompt('Enter user ID to assign:')
                            if (userId) onAssign(task.id, userId)
                          }}
                        >
                          Assign
                        </Button>
                      )}
                      {task.status === TaskStatus.ASSIGNED && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onAssign(task.id, task.assignedTo!)}
                        >
                          Start Task
                        </Button>
                      )}
                      {task.status === TaskStatus.IN_PROGRESS && (
                        <>
                          {selectedTask === task.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="Completion notes..."
                                value={completionNotes}
                                onChange={(e) => setCompletionNotes(e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleComplete(task.id)}
                              >
                                Complete
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedTask(null)
                                  setCompletionNotes('')
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setSelectedTask(task.id)}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Complete Task
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Priority indicator */}
                  {task.priority === Priority.URGENT && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 ml-3" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No housekeeping tasks scheduled
        </div>
      )}
    </div>
  )
}