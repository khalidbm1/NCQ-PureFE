import { formatRelativeTime } from '@/lib/utils'

interface Activity {
  id: string
  type: 'check_in' | 'check_out' | 'task_completed' | 'maintenance' | 'alert'
  title: string
  description: string
  user?: string
  timestamp: Date
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'check_in':
        return '🏨'
      case 'check_out':
        return '👋'
      case 'task_completed':
        return '✅'
      case 'maintenance':
        return '🔧'
      case 'alert':
        return '⚠️'
      default:
        return '📝'
    }
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent activity to display
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {idx !== activities.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-400 mt-1">by {activity.user}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-gray-500">
                    <time dateTime={activity.timestamp.toISOString()}>
                      {formatRelativeTime(activity.timestamp)}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}