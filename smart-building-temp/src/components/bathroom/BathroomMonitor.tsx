/**
 * Smart Bathroom Monitoring Component
 * Tracks occupancy, cleanliness, and supplies
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bath,
  Users,
  Droplets,
  Wind,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Star,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  SmartBathroom,
  BathroomStatus,
  BathroomType,
  CleanlinessLevel,
  SupplyItem,
  SupplyLevel
} from '@/types/iot';
import { getIoTService } from '@/services/iot-service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format, formatDistanceToNow } from 'date-fns';

interface BathroomMonitorProps {
  floor?: number;
  onIssueReport?: (bathroomId: string) => void;
}

export function BathroomMonitor({ floor, onIssueReport }: BathroomMonitorProps) {
  const [bathrooms, setBathrooms] = useState<SmartBathroom[]>([]);
  const [selectedBathroom, setSelectedBathroom] = useState<SmartBathroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportingIssue, setReportingIssue] = useState<string | null>(null);

  const iotService = getIoTService();

  useEffect(() => {
    loadBathroomData();
    
    // Subscribe to real-time updates
    iotService.subscribe('bathroom:update', handleBathroomUpdate);
    iotService.subscribe('bathroom:alert', handleBathroomAlert);
    
    const interval = setInterval(loadBathroomData, 30000); // Refresh every 30s
    
    return () => {
      clearInterval(interval);
      iotService.unsubscribe('bathroom:update');
      iotService.unsubscribe('bathroom:alert');
    };
  }, [floor]);

  const loadBathroomData = async () => {
    try {
      const data = await iotService.getBathrooms(floor);
      setBathrooms(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load bathroom data:', error);
      setLoading(false);
    }
  };

  const handleBathroomUpdate = (data: any) => {
    setBathrooms(prev => 
      prev.map(b => b.id === data.id ? { ...b, ...data } : b)
    );
  };

  const handleBathroomAlert = (alert: any) => {
    // Handle alerts (low supplies, maintenance needed, etc.)
    console.log('Bathroom alert:', alert);
  };

  const handleReportIssue = async (bathroomId: string, issue: string) => {
    setReportingIssue(bathroomId);
    try {
      await iotService.reportBathroomIssue(bathroomId, {
        type: issue,
        description: `${issue} reported via monitoring system`,
        urgent: issue === 'out_of_order'
      });
      
      onIssueReport?.(bathroomId);
      await loadBathroomData();
    } catch (error) {
      console.error('Failed to report issue:', error);
    }
    setReportingIssue(null);
  };

  const handleRequestCleaning = async (bathroomId: string) => {
    try {
      await iotService.requestCleaning(bathroomId, 'normal');
      await loadBathroomData();
    } catch (error) {
      console.error('Failed to request cleaning:', error);
    }
  };

  const getBathroomIcon = (type: BathroomType) => {
    switch (type) {
      case BathroomType.MENS:
        return '🚹';
      case BathroomType.WOMENS:
        return '🚺';
      case BathroomType.FAMILY:
        return '👨‍👩‍👧';
      case BathroomType.ACCESSIBLE:
        return '♿';
      default:
        return '🚻';
    }
  };

  const getStatusColor = (status: BathroomStatus) => {
    switch (status) {
      case BathroomStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case BathroomStatus.OCCUPIED:
        return 'bg-blue-100 text-blue-800';
      case BathroomStatus.CLEANING:
        return 'bg-yellow-100 text-yellow-800';
      case BathroomStatus.MAINTENANCE:
        return 'bg-orange-100 text-orange-800';
      case BathroomStatus.OUT_OF_ORDER:
        return 'bg-red-100 text-red-800';
    }
  };

  const getCleanlinessIcon = (level: CleanlinessLevel) => {
    switch (level) {
      case CleanlinessLevel.CLEAN:
        return <Star className="h-4 w-4 text-green-500" />;
      case CleanlinessLevel.ACCEPTABLE:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case CleanlinessLevel.NEEDS_ATTENTION:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case CleanlinessLevel.DIRTY:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getSupplyIcon = (item: SupplyItem) => {
    switch (item) {
      case SupplyItem.SOAP:
        return <Droplets className="h-4 w-4" />;
      case SupplyItem.PAPER_TOWELS:
        return <Package className="h-4 w-4" />;
      case SupplyItem.TOILET_PAPER:
        return <Package className="h-4 w-4" />;
      case SupplyItem.SANITIZER:
        return <Droplets className="h-4 w-4" />;
      case SupplyItem.AIR_FRESHENER:
        return <Wind className="h-4 w-4" />;
    }
  };

  const getSupplyLevelColor = (level: number) => {
    if (level > 70) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Calculate statistics
  const stats = {
    total: bathrooms.length,
    available: bathrooms.filter(b => b.status === BathroomStatus.AVAILABLE).length,
    occupied: bathrooms.filter(b => b.status === BathroomStatus.OCCUPIED).length,
    needsCleaning: bathrooms.filter(b => 
      b.cleanliness.level === CleanlinessLevel.NEEDS_ATTENTION || 
      b.cleanliness.level === CleanlinessLevel.DIRTY
    ).length,
    lowSupplies: bathrooms.filter(b => 
      b.supplies.some(s => s.level < 30)
    ).length
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bath className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold">Bathroom Monitoring</h2>
        </div>
        
        <Badge variant="default">
          Floor {floor || 'All'}
        </Badge>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Bath className="h-8 w-8 text-gray-400 opacity-50" />
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
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
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
              <p className="text-sm text-gray-500">Occupied</p>
              <p className="text-2xl font-bold text-blue-600">{stats.occupied}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500 opacity-50" />
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
              <p className="text-sm text-gray-500">Need Cleaning</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.needsCleaning}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 opacity-50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Supplies</p>
              <p className="text-2xl font-bold text-red-600">{stats.lowSupplies}</p>
            </div>
            <Package className="h-8 w-8 text-red-500 opacity-50" />
          </div>
        </motion.div>
      </div>

      {/* Bathroom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bathrooms.map((bathroom) => (
          <motion.div
            key={bathroom.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className={`
              bg-white rounded-lg shadow-lg p-4 cursor-pointer
              ${selectedBathroom?.id === bathroom.id ? 'ring-2 ring-blue-500' : ''}
            `}
            onClick={() => setSelectedBathroom(bathroom)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getBathroomIcon(bathroom.type)}</span>
                <div>
                  <p className="font-medium">{bathroom.location.zone}</p>
                  <p className="text-sm text-gray-500">
                    Floor {bathroom.location.floor}
                  </p>
                </div>
              </div>
              <Badge 
                className={getStatusColor(bathroom.status)}
                variant="default"
              >
                {bathroom.status}
              </Badge>
            </div>

            {/* Occupancy */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {bathroom.occupancy.current}/{bathroom.occupancy.maximum}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {getCleanlinessIcon(bathroom.cleanliness.level)}
                <span className="text-sm capitalize">
                  {bathroom.cleanliness.level}
                </span>
              </div>
            </div>

            {/* Supplies */}
            <div className="space-y-2">
              {bathroom.supplies
                .filter(s => s.level < 50)
                .slice(0, 3)
                .map((supply) => (
                  <div key={supply.item} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getSupplyIcon(supply.item)}
                      <span className="text-sm capitalize">
                        {supply.item.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${getSupplyLevelColor(supply.level)}`}>
                      {supply.level}%
                    </span>
                  </div>
                ))}
            </div>

            {/* Actions */}
            {bathroom.cleanliness.level === CleanlinessLevel.NEEDS_ATTENTION && (
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRequestCleaning(bathroom.id);
                }}
              >
                Request Cleaning
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Bathroom Details */}
      {selectedBathroom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {selectedBathroom.location.zone} Details
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBathroom(null)}
            >
              ×
            </Button>
          </div>

          {/* Cleanliness Info */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Cleanliness Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Current Level</span>
                <div className="flex items-center space-x-2">
                  {getCleanlinessIcon(selectedBathroom.cleanliness.level)}
                  <span className="font-medium capitalize">
                    {selectedBathroom.cleanliness.level}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Last Cleaned</span>
                <span className="font-medium">
                  {formatDistanceToNow(selectedBathroom.cleanliness.lastCleaned)} ago
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Next Scheduled</span>
                <span className="font-medium">
                  {format(selectedBathroom.cleanliness.nextScheduled, 'HH:mm')}
                </span>
              </div>
            </div>
          </div>

          {/* Supplies Detail */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Supply Levels</h4>
            <div className="space-y-3">
              {selectedBathroom.supplies.map((supply) => (
                <div key={supply.item}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      {getSupplyIcon(supply.item)}
                      <span className="text-sm capitalize">
                        {supply.item.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${getSupplyLevelColor(supply.level)}`}>
                      {supply.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        supply.level > 70 ? 'bg-green-500' :
                        supply.level > 30 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${supply.level}%` }}
                    />
                  </div>
                  {supply.level < 30 && (
                    <p className="text-xs text-red-600 mt-1">
                      Refill needed - Empty by {format(supply.estimatedEmpty, 'MMM dd')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={reportingIssue === selectedBathroom.id}
              onClick={() => handleReportIssue(selectedBathroom.id, 'dirty')}
            >
              Report Dirty
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={reportingIssue === selectedBathroom.id}
              onClick={() => handleReportIssue(selectedBathroom.id, 'no_supplies')}
            >
              Report No Supplies
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={reportingIssue === selectedBathroom.id}
              onClick={() => handleReportIssue(selectedBathroom.id, 'maintenance')}
            >
              Report Maintenance
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={reportingIssue === selectedBathroom.id}
              onClick={() => handleReportIssue(selectedBathroom.id, 'out_of_order')}
            >
              Mark Out of Order
            </Button>
          </div>

          {/* Maintenance History */}
          {selectedBathroom.maintenance.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-2">Recent Maintenance</h4>
              <div className="space-y-2">
                {selectedBathroom.maintenance.slice(0, 3).map((record, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{record.type}</span>
                      <span className="text-gray-500">
                        {formatDistanceToNow(record.reportedAt)} ago
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}