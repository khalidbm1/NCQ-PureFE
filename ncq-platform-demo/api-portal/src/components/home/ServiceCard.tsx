import Link from 'next/link';
import { cn } from '@/utils/cn';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/20/solid';

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  endpoints: number;
  version: string;
  status: 'stable' | 'beta' | 'deprecated';
}

interface ServiceCardProps {
  service: Service;
}

const statusConfig = {
  stable: {
    icon: CheckCircleIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    label: 'Stable',
  },
  beta: {
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    label: 'Beta',
  },
  deprecated: {
    icon: ClockIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    label: 'Deprecated',
  },
};

export function ServiceCard({ service }: ServiceCardProps) {
  const statusInfo = statusConfig[service.status];
  const StatusIcon = statusInfo.icon;
  const Icon = service.icon;

  return (
    <Link
      href={`/api-explorer?service=${service.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg text-white',
          service.color
        )}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className={cn(
          'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium border',
          statusInfo.bgColor,
          statusInfo.borderColor
        )}>
          <StatusIcon className={cn('h-3 w-3', statusInfo.color)} />
          <span className={statusInfo.color}>{statusInfo.label}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-ncq-blue dark:text-white dark:group-hover:text-ncq-lightBlue mb-2">
        {service.name}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {service.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>{service.endpoints} endpoints</span>
          <span>•</span>
          <span>Version {service.version}</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm font-medium text-ncq-blue group-hover:text-ncq-darkBlue dark:text-ncq-lightBlue">
          Explore
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}