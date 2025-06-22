import Link from 'next/link';
import { cn } from '@/utils/cn';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/20/solid';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  endpoints: number;
  version: string;
  status: 'stable' | 'beta' | 'deprecated';
  href?: string;
  className?: string;
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

export function ServiceCard({
  id,
  name,
  description,
  icon: Icon,
  endpoints,
  version,
  status,
  href,
  className,
}: ServiceCardProps) {
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;
  const cardHref = href || `/api-explorer?service=${id}`;

  return (
    <Link
      href={cardHref}
      className={cn(
        'group relative block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-ncq-blue to-ncq-lightBlue">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-ncq-blue dark:text-white dark:group-hover:text-ncq-lightBlue">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Version {version}
            </p>
          </div>
        </div>
        
        <div className={cn(
          'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
          statusInfo.bgColor,
          statusInfo.borderColor,
          'border'
        )}>
          <StatusIcon className={cn('h-3 w-3', statusInfo.color)} />
          <span className={statusInfo.color}>{statusInfo.label}</span>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
        {description}
      </p>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>{endpoints} endpoints</span>
          <span>•</span>
          <span>REST API</span>
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