'use client'

import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface TaskCalendarProps {
  schedule: any[]
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function TaskCalendar({ schedule, selectedDate, onDateChange }: TaskCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getTasksForDay = (day: Date) => {
    return schedule.filter((task) => isSameDay(new Date(task.scheduledTime), day))
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day) => {
            const tasks = getTasksForDay(day)
            const isSelected = isSameDay(day, selectedDate)
            const isCurrentDay = isToday(day)

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateChange(day)}
                className={cn(
                  'bg-white p-2 min-h-[80px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500',
                  isSelected && 'bg-primary-50 hover:bg-primary-100',
                  isCurrentDay && 'font-semibold'
                )}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={cn(
                      'text-sm',
                      isSelected && 'text-primary-900',
                      !isSelected && isCurrentDay && 'text-primary-600',
                      !isSelected && !isCurrentDay && 'text-gray-900'
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {tasks.length > 0 && (
                    <div className="mt-1 space-y-1">
                      <div className="text-xs text-gray-600">
                        {tasks.length} task{tasks.length > 1 ? 's' : ''}
                      </div>
                      {tasks.slice(0, 2).map((task, idx) => (
                        <div
                          key={idx}
                          className="text-xs truncate px-1 py-0.5 bg-primary-100 text-primary-700 rounded"
                        >
                          {task.room?.number}
                        </div>
                      ))}
                      {tasks.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{tasks.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div className="border-t p-4">
        <h3 className="font-medium text-gray-900 mb-3">
          Tasks for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        {getTasksForDay(selectedDate).length === 0 ? (
          <p className="text-sm text-gray-500">No tasks scheduled for this day</p>
        ) : (
          <div className="space-y-2">
            {getTasksForDay(selectedDate).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Room {task.room?.number} - {task.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.assignee?.name || 'Unassigned'}
                  </p>
                </div>
                <span className="text-xs text-gray-600">
                  {format(new Date(task.scheduledTime), 'h:mm a')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}