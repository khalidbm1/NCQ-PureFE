'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useWebSocket } from './WebSocketContext'
import { useDispatch } from 'react-redux'
import { addNotification } from '@/store/slices/notificationSlice'

interface NotificationContextType {
  // Add any notification-specific methods here
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { subscribe } = useWebSocket()
  const dispatch = useDispatch()

  useEffect(() => {
    // Subscribe to different types of notifications
    const unsubscribeTransaction = subscribe('transaction_update', (data) => {
      dispatch(addNotification({
        id: `tx-${Date.now()}`,
        type: 'transaction',
        title: 'Transaction Update',
        message: `Transaction ${data.transactionId} is now ${data.status}`,
        timestamp: new Date().toISOString(),
        read: false,
        severity: data.status === 'failed' ? 'error' : 'info',
        actionUrl: `/transactions/${data.transactionId}`,
      }))
    })

    const unsubscribeCompliance = subscribe('compliance_alert', (data) => {
      dispatch(addNotification({
        id: `comp-${Date.now()}`,
        type: 'compliance',
        title: 'Compliance Alert',
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
        severity: data.severity,
        actionUrl: '/compliance',
      }))
    })

    const unsubscribeSystem = subscribe('system_alert', (data) => {
      dispatch(addNotification({
        id: `sys-${Date.now()}`,
        type: 'system',
        title: 'System Alert',
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
        severity: data.severity,
        actionUrl: '/system/health',
      }))
    })

    return () => {
      unsubscribeTransaction()
      unsubscribeCompliance()
      unsubscribeSystem()
    }
  }, [subscribe, dispatch])

  const value: NotificationContextType = {
    // Add any notification-specific methods here
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}