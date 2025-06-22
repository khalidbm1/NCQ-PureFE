/**
 * WebSocket hook for real-time features
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (type: string, data: any) => void;
  subscribe: (event: string, handler: (data: any) => void) => () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  connectionId: string | null;
}

export function useWebSocket(): UseWebSocketReturn {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const eventHandlersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());
  const reconnectAttemptsRef = useRef(0);
  
  const connect = useCallback(() => {
    if (!token || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    const ws = new WebSocket(`${wsUrl}/api/v1/ws/chat?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      
      // Send ping every 30 seconds to keep connection alive
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
      
      ws.onclose = () => {
        clearInterval(pingInterval);
      };
    };
    
    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        // Handle connection event
        if (message.type === 'connect') {
          setConnectionId(message.connection_id);
        }
        
        // Handle pong
        if (message.type === 'pong') {
          return;
        }
        
        // Emit to event handlers
        const handlers = eventHandlersRef.current.get(message.type);
        if (handlers) {
          handlers.forEach(handler => handler(message));
        }
        
        // Also emit to wildcard handlers
        const wildcardHandlers = eventHandlersRef.current.get('*');
        if (wildcardHandlers) {
          wildcardHandlers.forEach(handler => handler(message));
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to establish real-time connection',
        variant: 'destructive',
      });
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setConnectionId(null);
      wsRef.current = null;
      
      // Attempt reconnection with exponential backoff
      if (reconnectAttemptsRef.current < 5) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        reconnectAttemptsRef.current++;
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Attempting reconnection (${reconnectAttemptsRef.current})...`);
          connect();
        }, delay);
      }
    };
    
    wsRef.current = ws;
  }, [token]);
  
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);
  
  const sendMessage = useCallback((type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, ...data }));
    } else {
      console.warn('WebSocket not connected');
      toast({
        title: 'Connection Required',
        description: 'Please wait for connection to be established',
        variant: 'destructive',
      });
    }
  }, []);
  
  const subscribe = useCallback((event: string, handler: (data: any) => void) => {
    if (!eventHandlersRef.current.has(event)) {
      eventHandlersRef.current.set(event, new Set());
    }
    
    eventHandlersRef.current.get(event)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = eventHandlersRef.current.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          eventHandlersRef.current.delete(event);
        }
      }
    };
  }, []);
  
  const joinRoom = useCallback((roomId: string) => {
    sendMessage('join_room', { room_id: roomId });
  }, [sendMessage]);
  
  const leaveRoom = useCallback((roomId: string) => {
    sendMessage('leave_room', { room_id: roomId });
  }, [sendMessage]);
  
  return {
    isConnected,
    sendMessage,
    subscribe,
    joinRoom,
    leaveRoom,
    connectionId,
  };
}

// Typed event hooks for specific features
export function useTypingIndicator(roomId: string) {
  const { sendMessage, subscribe } = useWebSocket();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  useEffect(() => {
    const handleTyping = (data: any) => {
      if (data.room_id === roomId) {
        setTypingUsers(prev => new Set(prev).add(data.user_id));
        
        // Clear existing timeout
        const existingTimeout = typingTimeoutsRef.current.get(data.user_id);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }
        
        // Set new timeout to remove typing indicator
        const timeout = setTimeout(() => {
          setTypingUsers(prev => {
            const next = new Set(prev);
            next.delete(data.user_id);
            return next;
          });
          typingTimeoutsRef.current.delete(data.user_id);
        }, 3000);
        
        typingTimeoutsRef.current.set(data.user_id, timeout);
      }
    };
    
    const handleTypingStop = (data: any) => {
      if (data.room_id === roomId) {
        setTypingUsers(prev => {
          const next = new Set(prev);
          next.delete(data.user_id);
          return next;
        });
        
        const timeout = typingTimeoutsRef.current.get(data.user_id);
        if (timeout) {
          clearTimeout(timeout);
          typingTimeoutsRef.current.delete(data.user_id);
        }
      }
    };
    
    const unsubscribeTyping = subscribe('typing', handleTyping);
    const unsubscribeTypingStop = subscribe('typing_stop', handleTypingStop);
    
    return () => {
      unsubscribeTyping();
      unsubscribeTypingStop();
      
      // Clear all timeouts
      typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutsRef.current.clear();
    };
  }, [roomId, subscribe]);
  
  const sendTyping = useCallback((isTyping: boolean) => {
    sendMessage('typing', {
      room_id: roomId,
      is_typing: isTyping,
    });
  }, [roomId, sendMessage]);
  
  return {
    typingUsers: Array.from(typingUsers),
    sendTyping,
  };
}

export function usePresence(roomId: string) {
  const { subscribe } = useWebSocket();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  useEffect(() => {
    const handleUserJoin = (data: any) => {
      if (data.room_id === roomId) {
        setOnlineUsers(prev => [...new Set([...prev, data.user_id])]);
      }
    };
    
    const handleUserLeave = (data: any) => {
      if (data.room_id === roomId) {
        setOnlineUsers(prev => prev.filter(id => id !== data.user_id));
      }
    };
    
    const unsubscribeJoin = subscribe('user_join', handleUserJoin);
    const unsubscribeLeave = subscribe('user_leave', handleUserLeave);
    
    return () => {
      unsubscribeJoin();
      unsubscribeLeave();
    };
  }, [roomId, subscribe]);
  
  return { onlineUsers };
}