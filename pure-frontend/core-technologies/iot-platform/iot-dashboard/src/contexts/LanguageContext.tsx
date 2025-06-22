import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    devices: 'Devices',
    telemetry: 'Telemetry',
    automation: 'Automation',
    analytics: 'Analytics',
    settings: 'Settings',
    logout: 'Logout',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Dashboard
    iotPlatform: 'IoT Platform',
    totalDevices: 'Total Devices',
    activeDevices: 'Active Devices',
    totalTelemetry: 'Total Telemetry',
    automationRules: 'Automation Rules',
    recentActivity: 'Recent Activity',
    systemHealth: 'System Health',
    
    // Devices
    deviceName: 'Device Name',
    deviceType: 'Device Type',
    status: 'Status',
    lastSeen: 'Last Seen',
    actions: 'Actions',
    online: 'Online',
    offline: 'Offline',
    addDevice: 'Add Device',
    
    // Settings
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemDefault: 'System Default',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    devices: 'الأجهزة',
    telemetry: 'القياس عن بُعد',
    automation: 'الأتمتة',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    
    // Common
    search: 'بحث',
    filter: 'تصفية',
    refresh: 'تحديث',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    close: 'إغلاق',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجاح',
    
    // Dashboard
    iotPlatform: 'منصة إنترنت الأشياء',
    totalDevices: 'إجمالي الأجهزة',
    activeDevices: 'الأجهزة النشطة',
    totalTelemetry: 'إجمالي القياسات',
    automationRules: 'قواعد الأتمتة',
    recentActivity: 'النشاط الأخير',
    systemHealth: 'صحة النظام',
    
    // Devices
    deviceName: 'اسم الجهاز',
    deviceType: 'نوع الجهاز',
    status: 'الحالة',
    lastSeen: 'آخر ظهور',
    actions: 'الإجراءات',
    online: 'متصل',
    offline: 'غير متصل',
    addDevice: 'إضافة جهاز',
    
    // Settings
    language: 'اللغة',
    theme: 'المظهر',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    systemDefault: 'افتراضي النظام',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('iot-language')
    return (saved as Language) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('iot-language', language)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}