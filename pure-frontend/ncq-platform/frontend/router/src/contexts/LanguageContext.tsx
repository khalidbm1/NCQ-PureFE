import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { IntlProvider, createIntl, createIntlCache } from 'react-intl'

type Language = 'en' | 'ar'
type Direction = 'ltr' | 'rtl'

interface LanguageContextType {
  language: Language
  direction: Direction
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (id: string, values?: Record<string, any>) => string
  formatNumber: (value: number) => string
  formatCurrency: (value: number, currency?: string) => string
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_KEY = 'ncq_language'

// Messages for different languages
const messages = {
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.refresh': 'Refresh',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    
    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.rememberMe': 'Remember me',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signInWith': 'Or sign in with',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back, {name}!',
    'dashboard.overview': 'Overview',
    'dashboard.analytics': 'Analytics',
    'dashboard.reports': 'Reports',
    'dashboard.settings': 'Settings',
    'dashboard.profile': 'Profile',
    
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.payments': 'Payments',
    'nav.iot': 'IoT Devices',
    'nav.hospital': 'Hospital',
    'nav.blockchain': 'Blockchain',
    'nav.hospitality': 'Hospitality',
    'nav.ai': 'AI Platform',
    'nav.admin': 'Admin',
  },
  ar: {
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.refresh': 'تحديث',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.submit': 'إرسال',
    'common.confirm': 'تأكيد',
    'common.close': 'إغلاق',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'auth.register': 'إنشاء حساب',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.resetPassword': 'إعادة تعيين كلمة المرور',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.rememberMe': 'تذكرني',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.signInWith': 'أو سجل الدخول باستخدام',
    
    // Dashboard
    'dashboard.title': 'لوحة القيادة',
    'dashboard.welcome': 'مرحباً بعودتك، {name}!',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.analytics': 'التحليلات',
    'dashboard.reports': 'التقارير',
    'dashboard.settings': 'الإعدادات',
    'dashboard.profile': 'الملف الشخصي',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة القيادة',
    'nav.payments': 'المدفوعات',
    'nav.iot': 'أجهزة IoT',
    'nav.hospital': 'المستشفى',
    'nav.blockchain': 'بلوكشين',
    'nav.hospitality': 'الضيافة',
    'nav.ai': 'منصة الذكاء الاصطناعي',
    'nav.admin': 'الإدارة',
  },
}

// Create intl cache
const cache = createIntlCache()

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY) as Language
    return saved || 'en'
  })

  const direction = language === 'ar' ? 'rtl' : 'ltr'

  // Create intl instance
  const intl = createIntl(
    {
      locale: language,
      messages: messages[language],
      defaultLocale: 'en',
    },
    cache
  )

  // Apply language and direction to document
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
    
    // Update body font for Arabic
    if (language === 'ar') {
      document.body.style.fontFamily = "'Noto Sans Arabic', 'Segoe UI', system-ui, sans-serif"
    } else {
      document.body.style.fontFamily = "'Inter', 'Segoe UI', system-ui, sans-serif"
    }
  }, [language, direction])

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem(LANGUAGE_KEY, newLanguage)
  }, [])

  const toggleLanguage = useCallback(() => {
    const newLanguage = language === 'en' ? 'ar' : 'en'
    setLanguage(newLanguage)
  }, [language, setLanguage])

  const t = useCallback((id: string, values?: Record<string, any>) => {
    return intl.formatMessage({ id }, values)
  }, [intl])

  const formatNumber = useCallback((value: number) => {
    return intl.formatNumber(value)
  }, [intl])

  const formatCurrency = useCallback((value: number, currency = 'SAR') => {
    return intl.formatNumber(value, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [intl])

  const formatDate = useCallback((
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ) => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
    return intl.formatDate(dateObj, options)
  }, [intl])

  const value: LanguageContextType = {
    language,
    direction,
    setLanguage,
    toggleLanguage,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
  }

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider
        locale={language}
        messages={messages[language]}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Custom hook for translations
export function useTranslation() {
  const { t } = useLanguage()
  return { t }
}