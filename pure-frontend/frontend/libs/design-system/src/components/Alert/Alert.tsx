import React from 'react';
import { cn } from '../../utils/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
}

const variantClasses: Record<NonNullable<AlertProps['variant']>, string> = {
  info: 'bg-blue-50 text-blue-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  error: 'bg-red-50 text-red-700',
};

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  children,
  ...props
}) => (
  <div role="alert" className={cn('rounded-md p-4', variantClasses[variant], className)} {...props}>
    {children}
  </div>
);

Alert.displayName = 'Alert';
