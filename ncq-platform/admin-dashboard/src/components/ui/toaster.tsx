'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface Toast {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'info'
}

let addToast: (toast: Omit<Toast, 'id'>) => void

export function useToast() {
  return {
    toast: (toast: Omit<Toast, 'id'>) => {
      if (addToast) {
        addToast(toast)
      }
    },
  }
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    addToast = (toast) => {
      const id = Math.random().toString(36).substr(2, 9)
      setToasts((prev) => [...prev, { ...toast, id }])
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-sm
            ${toast.type === 'error' ? 'bg-red-50 text-red-900' :
              toast.type === 'success' ? 'bg-green-50 text-green-900' :
              'bg-white text-gray-900'}
          `}
        >
          <div className="flex-1">
            <h4 className="font-medium">{toast.title}</h4>
            {toast.description && (
              <p className="text-sm mt-1 opacity-80">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}