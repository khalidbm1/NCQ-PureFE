'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addNotification } from '@/store/slices/notificationSlice'
import { useSnackbar } from 'notistack'

interface WebSocketContextType {
  isConnected: boolean
  sendMessage: (type: string, data: any) => void
  subscribe: (event: string, callback: (data: any) => void) => () => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws'

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const { token } = useSelector((state: RootState) => state.auth)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map())
  const isConnectedRef = useRef(false)

  useEffect(() => {
    if (token) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [token])

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const ws = new WebSocket(`${WS_URL}?token=${token}`)

      ws.onopen = () => {
        console.log('WebSocket connected')
        isConnectedRef.current = true
        clearTimeout(reconnectTimeoutRef.current)
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        isConnectedRef.current = false
        wsRef.current = null

        // Reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (token) {
            connect()
          }
        }, 5000)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  const disconnect = () => {
    clearTimeout(reconnectTimeoutRef.current)
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    isConnectedRef.current = false
  }

  const handleMessage = (message: any) => {
    const { type, data } = message

    // Handle system notifications
    if (type === 'notification') {
      dispatch(addNotification({
        id: data.id || Date.now().toString(),
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        read: false,
        severity: data.severity || 'info',
        actionUrl: data.actionUrl,
      }))

      // Show snackbar for important notifications
      if (data.severity === 'error' || data.severity === 'warning') {
        enqueueSnackbar(data.message, { variant: data.severity })
      }
    }

    // Notify listeners
    const listeners = listenersRef.current.get(type)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }

  const sendMessage = (type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  const subscribe = (event: string, callback: (data: any) => void) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set())
    }
    listenersRef.current.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const listeners = listenersRef.current.get(event)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          listenersRef.current.delete(event)
        }
      }
    }
  }

  const value: WebSocketContextType = {
    isConnected: isConnectedRef.current,
    sendMessage,
    subscribe,
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}