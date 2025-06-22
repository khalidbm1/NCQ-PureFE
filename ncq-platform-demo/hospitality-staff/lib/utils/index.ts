import { format, formatDistance, formatRelative, isToday, isYesterday } from 'date-fns'

export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string, formatStr = 'MMM dd, yyyy') {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr)
}

export function formatDateTime(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MMM dd, yyyy HH:mm')
}

export function formatRelativeTime(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isToday(dateObj)) {
    return format(dateObj, 'HH:mm')
  } else if (isYesterday(dateObj)) {
    return `Yesterday ${format(dateObj, 'HH:mm')}`
  } else {
    return formatRelative(dateObj, new Date())
  }
}

export function formatTimeAgo(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true })
}

export function calculateOccupancyRate(occupied: number, total: number) {
  if (total === 0) return 0
  return Math.round((occupied / total) * 100)
}

export function calculateRevPAR(revenue: number, availableRooms: number) {
  if (availableRooms === 0) return 0
  return revenue / availableRooms
}

export function getRoomStatusColor(status: string) {
  const colors = {
    AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    OCCUPIED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    RESERVED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    CLEANING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    MAINTENANCE: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    BLOCKED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  }
  return colors[status] || colors.BLOCKED
}

export function getPriorityColor(priority: string) {
  const colors = {
    LOW: 'text-green-600 dark:text-green-400',
    MEDIUM: 'text-yellow-600 dark:text-yellow-400',
    HIGH: 'text-orange-600 dark:text-orange-400',
    URGENT: 'text-red-600 dark:text-red-400',
  }
  return colors[priority] || colors.MEDIUM
}

export function getTaskStatusColor(status: string) {
  const colors = {
    PENDING: 'bg-gray-100 text-gray-800',
    ASSIGNED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    VERIFIED: 'bg-green-200 text-green-900',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] || colors.PENDING
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function generateRoomNumber(floor: number, number: number) {
  return `${floor}${number.toString().padStart(2, '0')}`
}

export function calculateStayDuration(checkIn: Date | string, checkOut: Date | string) {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
  
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export function generateInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}