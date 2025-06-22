'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  ConciergeBell, 
  Utensils, 
  Shirt, 
  Wrench,
  Phone,
  Car,
  Sparkles,
  ShoppingBag 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function QuickActions() {
  const { t } = useLanguage();

  const actions = [
    {
      id: 'room-service',
      label: t('services.room_service'),
      icon: Utensils,
      color: 'bg-green-500',
      description: 'Order food & beverages',
    },
    {
      id: 'housekeeping',
      label: t('services.housekeeping'),
      icon: ConciergeBell,
      color: 'bg-blue-500',
      description: 'Request cleaning service',
    },
    {
      id: 'laundry',
      label: t('services.laundry'),
      icon: Shirt,
      color: 'bg-purple-500',
      description: 'Laundry & dry cleaning',
    },
    {
      id: 'maintenance',
      label: t('services.maintenance'),
      icon: Wrench,
      color: 'bg-orange-500',
      description: 'Report issues',
    },
    {
      id: 'concierge',
      label: t('services.concierge'),
      icon: Phone,
      color: 'bg-indigo-500',
      description: 'Get local recommendations',
    },
    {
      id: 'transport',
      label: 'Transportation',
      icon: Car,
      color: 'bg-gray-500',
      description: 'Book rides & transfers',
    },
    {
      id: 'spa',
      label: t('services.spa'),
      icon: Sparkles,
      color: 'bg-pink-500',
      description: 'Book spa treatments',
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: ShoppingBag,
      color: 'bg-red-500',
      description: 'Browse hotel shop',
    },
  ];

  const handleActionClick = (actionId: string) => {
    // This would navigate to the specific service page or open a modal
    console.log('Action clicked:', actionId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {t('dashboard.quick_actions')}
        </h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleActionClick(action.id)}
              className="group p-4 rounded-xl border-2 border-gray-100 hover:border-primary-200 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {action.label}
                </h3>
                
                <p className="text-xs text-gray-500 leading-tight">
                  {action.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Emergency Contact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-800">Emergency Contact</h3>
            <p className="text-sm text-red-600">24/7 assistance available</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            leftIcon={<Phone className="h-4 w-4" />}
          >
            Call Now
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}