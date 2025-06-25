'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLanguage, useDateFormat } from '@/hooks/useLanguage';
import { apiClient } from '@/lib/api';
import { getColorByStatus } from '@/lib/utils';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Utensils,
  ConciergeBell,
  Wrench,
  Shirt,
  Phone,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ServiceRequestForm } from '@/components/guest/ServiceRequestForm';
import { useState } from 'react';

export function ServiceRequests() {
  const { t } = useLanguage();
  const { formatTime } = useDateFormat();
  const [showForm, setShowForm] = useState(false);

  const { data: serviceRequestsData, isLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: () => apiClient.getServiceRequests(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const serviceRequests = serviceRequestsData?.data || [];

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'room-service':
        return Utensils;
      case 'housekeeping':
        return ConciergeBell;
      case 'maintenance':
        return Wrench;
      case 'laundry':
        return Shirt;
      case 'concierge':
        return Phone;
      case 'spa':
        return Star;
      default:
        return ConciergeBell;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in-progress':
        return Clock;
      case 'pending':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Service Requests
        </h2>
        <Button
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(true)}
        >
          New Request
        </Button>
      </div>

      {serviceRequests.length === 0 ? (
        <div className="text-center py-8">
          <ConciergeBell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No service requests
          </h3>
          <p className="text-gray-500 mb-4">
            You haven't made any service requests yet.
          </p>
          <Button
            variant="outline"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowForm(true)}
          >
            Request Service
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {serviceRequests.map((request, index) => {
            const ServiceIcon = getServiceIcon(request.type);
            const StatusIcon = getStatusIcon(request.status);
            
            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Service Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <ServiceIcon className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 capitalize">
                        {request.type.replace('-', ' ')}
                      </h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorByStatus(request.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {request.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Requested {formatTime(request.createdAt)}
                      </div>

                      {request.estimatedCompletion && (
                        <div className="text-xs text-primary-600">
                          ETA: {formatTime(request.estimatedCompletion)}
                        </div>
                      )}
                    </div>

                    {/* Priority Indicator */}
                    {request.priority === 'urgent' && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {t('services.urgent')}
                        </span>
                      </div>
                    )}

                    {/* Cost Information */}
                    {request.cost && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        Cost: ${request.cost}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm">
                      Modify
                    </Button>
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}

                {request.status === 'completed' && !request.cost && (
                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      Rate Service
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Activity Summary */}
      {serviceRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {serviceRequests.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {serviceRequests.filter(r => r.status === 'in-progress').length}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {serviceRequests.filter(r => r.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </motion.div>
      )}
      {showForm && (
        <div className="mt-6">
          <ServiceRequestForm onSuccess={() => setShowForm(false)} />
        </div>
      )}
    </motion.div>
  );
}