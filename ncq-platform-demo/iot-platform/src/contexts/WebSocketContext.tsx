import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import { useToast } from '@/components/ui/use-toast'

interface WebSocketContextType {
  isConnected: boolean
  subscribe: (topic: string, handler: (data: any) => void) => void
  unsubscribe: (topic: string) => void
  send: (type: string, payload?: any) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  subscribe: () => {},
  unsubscribe: () => {},
  send: () => {},
})

export const useWebSocket = () => useContext(WebSocketContext)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { token, tenantId } = useAuth()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<NodeJS.Timeout>()
  const pingInterval = useRef<NodeJS.Timeout>()
  const subscribers = useRef<Map<string, Set<(data: any) => void>>>(new Map())
  const messageQueue = useRef<any[]>([])

  const connect = useCallback(() => {
    if (!token || ws.current?.readyState === WebSocket.OPEN) return

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
      window.location.host
    }/ws`

    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)

      // Authenticate
      ws.current?.send(
        JSON.stringify({
          type: 'auth',
          payload: { token },
        })
      )

      // Process queued messages
      while (messageQueue.current.length > 0) {
        const message = messageQueue.current.shift()
        ws.current?.send(JSON.stringify(message))
      }

      // Start ping interval
      pingInterval.current = setInterval(() => {
        send('ping')
      }, 30000)
    }

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        handleMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason)
      setIsConnected(false)

      // Clear ping interval
      if (pingInterval.current) {
        clearInterval(pingInterval.current)
      }

      // Reconnect after delay
      if (event.code !== 1000) {
        // Not a normal closure
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...')
          connect()
        }, 5000)
      }
    }
  }, [token])

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current)
    }
    if (pingInterval.current) {
      clearInterval(pingInterval.current)
    }
    if (ws.current) {
      ws.current.close(1000, 'Client disconnect')
      ws.current = null
    }
    setIsConnected(false)
  }, [])

  const handleMessage = (message: any) => {
    switch (message.type) {
      case 'welcome':
        console.log('WebSocket welcome:', message.payload)
        break

      case 'auth_success':
        console.log('WebSocket authenticated')
        // Subscribe to default topics
        send('subscribe', {
          topics: [
            `tenant/${tenantId}/telemetry`,
            `tenant/${tenantId}/alerts`,
            `tenant/${tenantId}/device_status`,
            'dashboard:telemetry',
            'dashboard:alerts',
          ],
        })
        break

      case 'error':
        console.error('WebSocket error:', message.payload)
        toast({
          title: 'Connection Error',
          description: message.payload.error,
          variant: 'destructive',
        })
        break

      case 'telemetry':
        notifySubscribers('telemetry', message.payload)
        notifySubscribers(`device:${message.payload.deviceId}:telemetry`, message.payload)
        break

      case 'telemetry_batch':
        notifySubscribers('telemetry:batch', message.payload)
        break

      case 'alert':
        notifySubscribers('alerts', message.payload)
        notifySubscribers('dashboard:alerts', message.payload)
        break

      case 'device_status':
        notifySubscribers('device:status', message.payload)
        notifySubscribers(`device:${message.payload.deviceId}:status`, message.payload)
        break

      case 'automation_event':
        notifySubscribers('automation:event', message.payload)
        break

      case 'pong':
        // Heartbeat response
        break

      default:
        // Generic message handling
        notifySubscribers(message.type, message.payload)
    }
  }

  const notifySubscribers = (topic: string, data: any) => {
    const handlers = subscribers.current.get(topic)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in subscriber for topic ${topic}:`, error)
        }
      })
    }
  }

  const subscribe = useCallback((topic: string, handler: (data: any) => void) => {
    if (!subscribers.current.has(topic)) {
      subscribers.current.set(topic, new Set())
    }
    subscribers.current.get(topic)!.add(handler)

    // If subscribing to a new device topic, send subscription to server
    if (topic.startsWith('device:') && isConnected) {
      const deviceId = topic.split(':')[1]
      send('subscribe', {
        topics: [`device/${deviceId}/telemetry`, `device/${deviceId}/status`],
      })
    }

    // Return unsubscribe function
    return () => unsubscribe(topic)
  }, [isConnected])

  const unsubscribe = useCallback((topic: string) => {
    subscribers.current.delete(topic)

    // If unsubscribing from a device topic, notify server
    if (topic.startsWith('device:') && isConnected) {
      const deviceId = topic.split(':')[1]
      send('unsubscribe', {
        topics: [`device/${deviceId}/telemetry`, `device/${deviceId}/status`],
      })
    }
  }, [isConnected])

  const send = useCallback((type: string, payload?: any) => {
    const message = {
      type,
      payload,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    } else {
      // Queue message for when connection is restored
      messageQueue.current.push(message)
    }
  }, [])

  // Connect when token is available
  useEffect(() => {
    if (token) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [token, connect, disconnect])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, disconnect after a delay
        reconnectTimeout.current = setTimeout(() => {
          if (document.hidden) {
            disconnect()
          }
        }, 60000) // Disconnect after 1 minute hidden
      } else {
        // Page is visible again
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current)
        }
        if (!isConnected && token) {
          connect()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [connect, disconnect, isConnected, token])

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe, send }}>
      {children}
    </WebSocketContext.Provider>
  )
}