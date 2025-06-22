import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // NCQ specific variants
        ncq: 'border-transparent bg-ncq-primary-500 text-white',
        'ncq-outline': 'border-ncq-primary-500 text-ncq-primary-500 bg-transparent',
        'ncq-soft': 'border-transparent bg-ncq-primary-100 text-ncq-primary-800',
        saudi: 'border-transparent bg-saudi-green-500 text-white',
        'saudi-outline': 'border-saudi-green-500 text-saudi-green-500 bg-transparent',
        'saudi-soft': 'border-transparent bg-saudi-green-100 text-saudi-green-800',
        success: 'border-transparent bg-ncq-success-500 text-white',
        'success-outline': 'border-ncq-success-500 text-ncq-success-500 bg-transparent',
        'success-soft': 'border-transparent bg-ncq-success-100 text-ncq-success-800',
        warning: 'border-transparent bg-ncq-warning-500 text-white',
        'warning-outline': 'border-ncq-warning-500 text-ncq-warning-500 bg-transparent',
        'warning-soft': 'border-transparent bg-ncq-warning-100 text-ncq-warning-800',
        error: 'border-transparent bg-ncq-error-500 text-white',
        'error-outline': 'border-ncq-error-500 text-ncq-error-500 bg-transparent',
        'error-soft': 'border-transparent bg-ncq-error-100 text-ncq-error-800',
        info: 'border-transparent bg-blue-500 text-white',
        'info-outline': 'border-blue-500 text-blue-500 bg-transparent',
        'info-soft': 'border-transparent bg-blue-100 text-blue-800',
        gradient: 'border-transparent bg-gradient-to-r from-ncq-primary-500 to-ncq-accent-500 text-white',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-md',
        pill: 'rounded-full px-4',
      },
      interactive: {
        true: 'cursor-pointer hover:opacity-80 transition-opacity',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
      interactive: false,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  closable?: boolean
  onClose?: () => void
  dot?: boolean
  count?: number
  maxCount?: number
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      interactive,
      leftIcon,
      rightIcon,
      closable,
      onClose,
      dot,
      count,
      maxCount = 99,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = interactive || closable || !!onClick

    // Handle count badge
    if (typeof count === 'number') {
      const displayCount = count > maxCount ? `${maxCount}+` : count.toString()
      
      return (
        <div className="relative inline-flex">
          {children}
          <span
            className={cn(
              'absolute -top-2 -right-2 inline-flex items-center justify-center',
              count === 0 ? 'hidden' : '',
              dot 
                ? 'h-2 w-2 rounded-full bg-ncq-error-500' 
                : 'min-w-[1.25rem] h-5 px-1 rounded-full bg-ncq-error-500 text-white text-xs font-medium'
            )}
          >
            {!dot && displayCount}
          </span>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape, interactive: isInteractive, className }))}
        onClick={onClick}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
        {closable && (
          <button
            type="button"
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            onClick={(e) => {
              e.stopPropagation()
              onClose?.()
            }}
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

// Status Badge component for common status indicators
const StatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & {
    status: 'online' | 'offline' | 'busy' | 'away' | 'pending' | 'active' | 'inactive' | 'approved' | 'rejected' | 'draft'
    showDot?: boolean
  }
>(({ status, showDot = true, children, ...props }, ref) => {
  const statusConfig = {
    online: { variant: 'success' as const, label: 'Online', color: 'bg-ncq-success-500' },
    offline: { variant: 'secondary' as const, label: 'Offline', color: 'bg-gray-400' },
    busy: { variant: 'error' as const, label: 'Busy', color: 'bg-ncq-error-500' },
    away: { variant: 'warning' as const, label: 'Away', color: 'bg-ncq-warning-500' },
    pending: { variant: 'warning-soft' as const, label: 'Pending', color: 'bg-ncq-warning-500' },
    active: { variant: 'success-soft' as const, label: 'Active', color: 'bg-ncq-success-500' },
    inactive: { variant: 'secondary' as const, label: 'Inactive', color: 'bg-gray-400' },
    approved: { variant: 'success' as const, label: 'Approved', color: 'bg-ncq-success-500' },
    rejected: { variant: 'error' as const, label: 'Rejected', color: 'bg-ncq-error-500' },
    draft: { variant: 'secondary' as const, label: 'Draft', color: 'bg-gray-400' },
  }

  const config = statusConfig[status]
  
  return (
    <Badge
      ref={ref}
      variant={config.variant}
      leftIcon={
        showDot ? (
          <span className={cn('h-2 w-2 rounded-full', config.color)} />
        ) : undefined
      }
      {...props}
    >
      {children || config.label}
    </Badge>
  )
})
StatusBadge.displayName = 'StatusBadge'

// Priority Badge component
const PriorityBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & {
    priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent'
  }
>(({ priority, children, ...props }, ref) => {
  const priorityConfig = {
    low: { variant: 'success-soft' as const, label: 'Low' },
    medium: { variant: 'warning-soft' as const, label: 'Medium' },
    high: { variant: 'warning' as const, label: 'High' },
    critical: { variant: 'error' as const, label: 'Critical' },
    urgent: { variant: 'error' as const, label: 'Urgent' },
  }

  const config = priorityConfig[priority]
  
  return (
    <Badge
      ref={ref}
      variant={config.variant}
      {...props}
    >
      {children || config.label}
    </Badge>
  )
})
PriorityBadge.displayName = 'PriorityBadge'

export { Badge, StatusBadge, PriorityBadge, badgeVariants }