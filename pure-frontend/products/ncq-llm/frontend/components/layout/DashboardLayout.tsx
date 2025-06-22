'use client'

import { useState, useEffect } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    // Check if language is stored in localStorage
    const storedLang = localStorage.getItem('language')
    if (storedLang) {
      setLanguage(storedLang)
      document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = storedLang
    }
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header onMenuClick={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} language={language} />

      {/* Main content */}
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out pt-16",
          "lg:ml-64", // Push content right on desktop when sidebar is visible
          className
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}