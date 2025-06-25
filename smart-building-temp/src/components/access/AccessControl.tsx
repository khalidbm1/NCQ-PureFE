/**
 * Access Control Management Component
 * Handles doors, gates, and security access
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Key, 
  DoorOpen, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  Activity,
  Lock,
  Unlock
} from 'lucide-react';
import { 
  AccessLog, 
  AccessPermission, 
  AccessLevel,
  AccessAction,
  AccessResult,
  Location
} from '@/types/iot';
import { getIoTService } from '@/services/iot-service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';

interface AccessControlProps {
  location?: Location;
  userId?: string;
}

export function AccessControl({ location, userId }: AccessControlProps) {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [permissions, setPermissions] = useState<AccessPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
  const [isGrantingAccess, setIsGrantingAccess] = useState(false);

  const iotService = getIoTService();

  useEffect(() => {
    loadAccessData();
    
    // Subscribe to real-time access events
    iotService.subscribe('access:log', handleNewAccessLog);
    
    return () => {
      iotService.unsubscribe('access:log');
    };
  }, [location, userId]);

  const loadAccessData = async () => {
    try {
      const logs = await iotService.getAccessLogs({
        location,
        userId,
        dateFrom: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        dateTo: new Date()
      });
      
      setAccessLogs(logs);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load access logs:', error);
      setLoading(false);
    }
  };

  const handleNewAccessLog = (log: AccessLog) => {
    setAccessLogs(prev => [log, ...prev]);
  };

  const handleGrantAccess = async () => {
    setIsGrantingAccess(true);
    try {
      await iotService.grantAccess(userId!, {
        areas: ['main-entrance', 'floor-' + (location?.floor || 1)],
        level: AccessLevel.GUEST,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
      
      // Refresh data
      await loadAccessData();
    } catch (error) {
      console.error('Failed to grant access:', error);
    }
    setIsGrantingAccess(false);
  };

  const handleDoorControl = async (doorId: string, action: 'open' | 'lock') => {
    try {
      if (action === 'open') {
        await iotService.openDoor(doorId, true);
      } else {
        // Lock door logic
        await iotService.controlDevice(doorId, { command: 'lock' });
      }
    } catch (error) {
      console.error('Failed to control door:', error);
    }
  };

  const getActionIcon = (action: AccessAction) => {
    switch (action) {
      case AccessAction.ENTRY:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case AccessAction.EXIT:
        return <XCircle className="h-4 w-4 text-blue-500" />;
      case AccessAction.ATTEMPT:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case AccessAction.OVERRIDE:
        return <Shield className="h-4 w-4 text-purple-500" />;
    }
  };

  const getResultBadge = (result: AccessResult) => {
    switch (result) {
      case AccessResult.GRANTED:
        return <Badge variant="default">Granted</Badge>;
      case AccessResult.DENIED:
        return <Badge variant="destructive">Denied</Badge>;
      case AccessResult.TIMEOUT:
        return <Badge variant="secondary">Timeout</Badge>;
      case AccessResult.ERROR:
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Access Control Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Access Control</h2>
        </div>
        
        {userId && (
          <Button
            onClick={handleGrantAccess}
            disabled={isGrantingAccess}
            size="sm"
          >
            <Key className="h-4 w-4 mr-2" />
            Grant Temporary Access
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Access</p>
              <p className="text-2xl font-bold">{accessLogs.length}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Granted</p>
              <p className="text-2xl font-bold text-green-600">
                {accessLogs.filter(log => log.result === AccessResult.GRANTED).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Denied</p>
              <p className="text-2xl font-bold text-red-600">
                {accessLogs.filter(log => log.result === AccessResult.DENIED).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500 opacity-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">
                {new Set(accessLogs.map(log => log.userId)).size}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDoorControl('main-entrance', 'open')}
          >
            <Unlock className="h-4 w-4 mr-2" />
            Open Main Entrance
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDoorControl('emergency-exit', 'open')}
          >
            <DoorOpen className="h-4 w-4 mr-2" />
            Emergency Exit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDoorControl('all', 'lock')}
          >
            <Lock className="h-4 w-4 mr-2" />
            Lock All Doors
          </Button>
        </div>
      </div>

      {/* Access Logs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-medium">Recent Access Logs</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {accessLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No access logs found
            </div>
          ) : (
            accessLogs.slice(0, 10).map((log) => (
              <motion.div
                key={log.timestamp.toString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedLog(log)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getActionIcon(log.action)}
                    <div>
                      <p className="font-medium">{log.userId}</p>
                      <p className="text-sm text-gray-500">
                        {log.location.area} - {log.location.zone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getResultBadge(log.result)}
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(log.timestamp, 'HH:mm:ss')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(log.timestamp, 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedLog === log && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t space-y-2 text-sm"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500">Device:</span>
                        <span className="ml-2 font-medium">{log.device}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Floor:</span>
                        <span className="ml-2 font-medium">{log.location.floor}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
        
        {accessLogs.length > 10 && (
          <div className="p-4 border-t text-center">
            <Button variant="ghost" size="sm">
              View all {accessLogs.length} logs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}