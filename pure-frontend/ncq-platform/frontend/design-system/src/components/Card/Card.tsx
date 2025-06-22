import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground',
  {
    variants: {
      variant: {
        default: 'border-border shadow-elevation-1',
        outlined: 'border-2 border-border',
        elevated: 'shadow-elevation-3 border-transparent',
        filled: 'bg-muted border-transparent',
        gradient: 'bg-gradient-to-br from-background to-muted border-transparent shadow-elevation-2',
        ncq: 'border-ncq-primary-200 bg-ncq-primary-50/30 shadow-elevation-2',
        saudi: 'border-saudi-green-200 bg-saudi-green-50/30 shadow-elevation-2',
        glass: 'bg-background/80 backdrop-blur-md border-border/50 shadow-elevation-2',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: 'cursor-pointer transition-all duration-200 hover:shadow-elevation-3 hover:scale-105',
        false: '',
      },
      size: {
        sm: 'max-w-sm',
        default: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      interactive: false,
      size: 'full',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, interactive, size, className }))}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }
>(({ className, as: Component = 'h3', ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// NCQ specific card components
const CardStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string | number
    label: string
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon?: React.ReactNode
  }
>(({ className, value, label, change, changeType = 'neutral', icon, ...props }, ref) => {
  const changeColorClass = {
    positive: 'text-ncq-success-600',
    negative: 'text-ncq-error-600',
    neutral: 'text-muted-foreground',
  }[changeType]

  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between space-y-0 pb-2', className)}
      {...props}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <p className={cn('text-xs', changeColorClass)}>
            {change}
          </p>
        )}
      </div>
      {icon && (
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      )}
    </div>
  )
})
CardStats.displayName = 'CardStats'

const CardMetric = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    value: string | number
    description?: string
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    icon?: React.ReactNode
    variant?: 'default' | 'compact'
  }
>(({
  className,
  title,
  value,
  description,
  trend = 'neutral',
  trendValue,
  icon,
  variant = 'default',
  ...props
}, ref) => {
  const trendIcon = {
    up: '↗',
    down: '↙',
    neutral: '→',
  }[trend]

  const trendColor = {
    up: 'text-ncq-success-600',
    down: 'text-ncq-error-600',
    neutral: 'text-muted-foreground',
  }[trend]

  if (variant === 'compact') {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between', className)}
        {...props}
      >
        <div className="flex items-center space-x-2">
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-semibold">{value}</span>
          {trendValue && (
            <span className={cn('text-xs', trendColor)}>
              {trendIcon} {trendValue}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn('space-y-2', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
          <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        </div>
        {trendValue && (
          <span className={cn('text-sm flex items-center space-x-1', trendColor)}>
            <span>{trendIcon}</span>
            <span>{trendValue}</span>
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
})
CardMetric.displayName = 'CardMetric'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardStats,
  CardMetric,
  cardVariants,
}