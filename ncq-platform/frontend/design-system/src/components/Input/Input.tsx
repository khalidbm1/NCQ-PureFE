import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input',
        filled: 'bg-muted border-transparent focus-visible:bg-background',
        outlined: 'border-2 border-input',
        underlined: 'border-0 border-b-2 border-input rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary',
        ncq: 'border-ncq-primary-300 focus-visible:ring-ncq-primary-500',
        saudi: 'border-saudi-green-300 focus-visible:ring-saudi-green-500',
        error: 'border-ncq-error-500 focus-visible:ring-ncq-error-500',
        success: 'border-ncq-success-500 focus-visible:ring-ncq-success-500',
        warning: 'border-ncq-warning-500 focus-visible:ring-ncq-warning-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
        xl: 'h-14 px-5 text-lg',
      },
      state: {
        default: '',
        error: 'border-ncq-error-500 focus-visible:ring-ncq-error-500',
        success: 'border-ncq-success-500 focus-visible:ring-ncq-success-500',
        warning: 'border-ncq-warning-500 focus-visible:ring-ncq-warning-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  description?: string
  error?: string
  success?: string
  warning?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
  isLoading?: boolean
  isRequired?: boolean
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      variant,
      size,
      state,
      type = 'text',
      label,
      description,
      error,
      success,
      warning,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      isLoading,
      isRequired,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9)
    
    // Determine the state based on validation messages
    const currentState = error ? 'error' : success ? 'success' : warning ? 'warning' : state

    const hasLeftContent = leftIcon || leftAddon
    const hasRightContent = rightIcon || rightAddon || isLoading

    const inputElement = (
      <div className="relative">
        {hasLeftContent && (
          <div className="absolute left-0 top-0 h-full flex items-center">
            {leftAddon ? (
              <div className="px-3 text-sm text-muted-foreground border-r border-input">
                {leftAddon}
              </div>
            ) : leftIcon ? (
              <div className="pl-3">
                <div className="h-4 w-4 text-muted-foreground">{leftIcon}</div>
              </div>
            ) : null}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            inputVariants({ variant, size, state: currentState }),
            {
              'pl-10': leftIcon && !leftAddon,
              'pl-16': leftAddon,
              'pr-10': (rightIcon || isLoading) && !rightAddon,
              'pr-16': rightAddon,
            },
            className
          )}
          ref={ref}
          id={inputId}
          disabled={disabled || isLoading}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            description || error || success || warning
              ? `${inputId}-description`
              : undefined
          }
          aria-required={isRequired}
          {...props}
        />
        
        {hasRightContent && (
          <div className="absolute right-0 top-0 h-full flex items-center">
            {rightAddon ? (
              <div className="px-3 text-sm text-muted-foreground border-l border-input">
                {rightAddon}
              </div>
            ) : isLoading ? (
              <div className="pr-3">
                <svg
                  className="h-4 w-4 animate-spin text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : rightIcon ? (
              <div className="pr-3">
                <div className="h-4 w-4 text-muted-foreground">{rightIcon}</div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    )

    if (!label && !description && !error && !success && !warning) {
      return inputElement
    }

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {isRequired && <span className="text-ncq-error-500 ml-1">*</span>}
          </label>
        )}
        {inputElement}
        {(description || error || success || warning) && (
          <div id={`${inputId}-description`} className="space-y-1">
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {error && (
              <p className="text-sm text-ncq-error-600 flex items-center space-x-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </p>
            )}
            {success && (
              <p className="text-sm text-ncq-success-600 flex items-center space-x-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{success}</span>
              </p>
            )}
            {warning && (
              <p className="text-sm text-ncq-warning-600 flex items-center space-x-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{warning}</span>
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Specialized input components
const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'leftIcon' | 'type'>>(
  ({ placeholder = 'Search...', ...props }, ref) => (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder}
      leftIcon={
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      {...props}
    />
  )
)
SearchInput.displayName = 'SearchInput'

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'rightIcon' | 'type'>>(
  (props, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        }
        {...props}
      />
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { Input, SearchInput, PasswordInput, inputVariants }