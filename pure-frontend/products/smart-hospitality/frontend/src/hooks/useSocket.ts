import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '@/lib/config';
import { SocketEvent } from '@/types';

interface UseSocketOptions {
  enabled?: boolean;
  roomId?: string;
  onDeviceUpdate?: (data: any) => void;
  onRoomStatusUpdate?: (data: any) => void;
  onServiceRequestUpdate?: (data: any) => void;
  onNotification?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useSocket = (options: UseSocketOptions = {}) => {
  const {
    enabled = true,
    roomId,
    onDeviceUpdate,
    onRoomStatusUpdate,
    onServiceRequestUpdate,
    onNotification,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Get access token for authentication
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Create socket connection
    const socket = io(config.wsUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      retries: 3,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setConnectionError(null);
      onConnect?.();

      // Join room if roomId is provided
      if (roomId) {
        socket.emit(config.socketEvents.joinRoom, { roomId });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionError(error.message);
      onError?.(error);
    });

    // Event handlers for different types of updates
    socket.on(config.socketEvents.deviceUpdate, (data) => {
      console.log('Device update received:', data);
      onDeviceUpdate?.(data);
    });

    socket.on(config.socketEvents.roomStatusUpdate, (data) => {
      console.log('Room status update received:', data);
      onRoomStatusUpdate?.(data);
    });

    socket.on(config.socketEvents.serviceRequestUpdate, (data) => {
      console.log('Service request update received:', data);
      onServiceRequestUpdate?.(data);
    });

    socket.on(config.socketEvents.notification, (data) => {
      console.log('Notification received:', data);
      onNotification?.(data);
    });

    // Cleanup on unmount
    return () => {
      if (roomId) {
        socket.emit(config.socketEvents.leaveRoom, { roomId });
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, roomId]);

  // Emit events
  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  // Join room
  const joinRoom = (newRoomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(config.socketEvents.joinRoom, { roomId: newRoomId });
    }
  };

  // Leave room
  const leaveRoom = (oldRoomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(config.socketEvents.leaveRoom, { roomId: oldRoomId });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    emit,
    joinRoom,
    leaveRoom,
  };
};

// Custom hook for device updates
export const useDeviceUpdates = (roomId?: string) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { isConnected } = useSocket({
    roomId,
    onDeviceUpdate: (data) => {
      setDevices(prevDevices => {
        const updatedDevices = [...prevDevices];
        const deviceIndex = updatedDevices.findIndex(d => d.id === data.deviceId);
        
        if (deviceIndex >= 0) {
          updatedDevices[deviceIndex] = { ...updatedDevices[deviceIndex], ...data };
        } else {
          updatedDevices.push(data);
        }
        
        return updatedDevices;
      });
      setLastUpdate(new Date());
    },
  });

  return {
    devices,
    lastUpdate,
    isConnected,
  };
};

// Custom hook for service request updates
export const useServiceRequestUpdates = () => {
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { isConnected } = useSocket({
    onServiceRequestUpdate: (data) => {
      setServiceRequests(prevRequests => {
        const updatedRequests = [...prevRequests];
        const requestIndex = updatedRequests.findIndex(r => r.id === data.id);
        
        if (requestIndex >= 0) {
          updatedRequests[requestIndex] = { ...updatedRequests[requestIndex], ...data };
        } else {
          updatedRequests.push(data);
        }
        
        return updatedRequests;
      });
      setLastUpdate(new Date());
    },
  });

  return {
    serviceRequests,
    lastUpdate,
    isConnected,
  };
};

// Custom hook for real-time notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { isConnected } = useSocket({
    onNotification: (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 50)); // Keep only latest 50
      setUnreadCount(prev => prev + 1);
    },
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
  };
};

// Custom hook for room status updates
export const useRoomStatus = (roomId?: string) => {
  const [roomStatus, setRoomStatus] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { isConnected } = useSocket({
    roomId,
    onRoomStatusUpdate: (data) => {
      setRoomStatus(data);
      setLastUpdate(new Date());
    },
  });

  return {
    roomStatus,
    lastUpdate,
    isConnected,
  };
};