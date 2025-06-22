'use client'

import * as React from "react"

export interface ToastProps {
  id?: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const Toast = React.forwardRef<
  HTMLDivElement,
  ToastProps & React.HTMLAttributes<HTMLDivElement>
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`
        flex items-center justify-between space-x-4 rounded-md border p-4 shadow-lg transition-all
        ${variant === "destructive" 
          ? "border-red-500 bg-red-50 text-red-900" 
          : "border-gray-200 bg-white text-gray-900"
        }
        ${className}
      `}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

export const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`
        ml-auto h-4 w-4 rounded-sm opacity-70 transition-opacity hover:opacity-100
        ${className}
      `}
      {...props}
    >
      <span className="sr-only">Close</span>
      ✕
    </button>
  )
})
ToastClose.displayName = "ToastClose"

export const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`text-sm font-semibold ${className}`}
      {...props}
    />
  )
})
ToastTitle.displayName = "ToastTitle"

export const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`text-sm opacity-90 ${className}`}
      {...props}
    />
  )
})
ToastDescription.displayName = "ToastDescription"

export const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`
        ml-auto rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white
        hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400
        ${className}
      `}
      {...props}
    />
  )
})
ToastAction.displayName = "ToastAction"

export const ToastProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] ${className}`}
      {...props}
    />
  )
})
ToastProvider.displayName = "ToastProvider"

export const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] ${className}`}
      {...props}
    />
  )
})
ToastViewport.displayName = "ToastViewport"