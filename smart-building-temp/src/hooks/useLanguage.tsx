import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
// Router is not needed for this hook

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface TranslationType {
  t: (key: string, params?: Record<string, any>) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

// Translation keys
const translations = {
  en: {
    // Common
    search: 'Search...',
    notifications: {
      title: 'Notifications',
      viewAll: 'View all notifications',
      newBooking: 'New booking confirmed',
      checkIn: 'Guest checked in',
      maintenance: 'Maintenance completed',
    },
    user: {
      name: 'Guest',
      role: 'Hotel Guest',
    },
    menu: {
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
    },
    // Sidebar
    sidebar: {
      main: 'Main',
      operations: 'Operations',
      management: 'Management',
      dashboard: 'Dashboard',
      reservations: 'Reservations',
      guests: 'Guests',
      rooms: 'Rooms',
      frontDesk: 'Front Desk',
      housekeeping: 'Housekeeping',
      billing: 'Billing',
      messages: 'Messages',
      analytics: 'Analytics',
      settings: 'Settings',
    },
    'common.welcome': 'Welcome',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
    'common.retry': 'Retry',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.room_control': 'Room Control',
    'nav.services': 'Services',
    'nav.profile': 'Profile',
    'nav.notifications': 'Notifications',
    'nav.checkin': 'Check In',
    'nav.checkout': 'Check Out',
    'nav.settings': 'Settings',
    'nav.help': 'Help',
    'nav.logout': 'Logout',

    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.first_name': 'First Name',
    'auth.last_name': 'Last Name',
    'auth.phone': 'Phone Number',
    'auth.forgot_password': 'Forgot Password?',
    'auth.remember_me': 'Remember Me',
    'auth.login_success': 'Login successful',
    'auth.login_error': 'Login failed. Please check your credentials.',
    'auth.register_success': 'Registration successful',
    'auth.register_error': 'Registration failed. Please try again.',

    // Dashboard
    'dashboard.good_morning': 'Good Morning',
    'dashboard.good_afternoon': 'Good Afternoon',
    'dashboard.good_evening': 'Good Evening',
    'dashboard.welcome_back': 'Welcome back, {name}',
    'dashboard.room_number': 'Room {number}',
    'dashboard.current_weather': 'Current Weather',
    'dashboard.quick_actions': 'Quick Actions',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.upcoming_services': 'Upcoming Services',

    // Room Control
    'room.temperature': 'Temperature',
    'room.lighting': 'Lighting',
    'room.curtains': 'Curtains',
    'room.air_conditioning': 'Air Conditioning',
    'room.tv': 'Television',
    'room.music': 'Music',
    'room.do_not_disturb': 'Do Not Disturb',
    'room.housekeeping_needed': 'Housekeeping Needed',
    'room.open': 'Open',
    'room.close': 'Close',
    'room.on': 'On',
    'room.off': 'Off',
    'room.increase': 'Increase',
    'room.decrease': 'Decrease',

    // Services
    'services.room_service': 'Room Service',
    'services.housekeeping': 'Housekeeping',
    'services.maintenance': 'Maintenance',
    'services.concierge': 'Concierge',
    'services.spa': 'Spa Services',
    'services.laundry': 'Laundry',
    'services.request_service': 'Request Service',
    'services.service_description': 'Service Description',
    'services.special_instructions': 'Special Instructions',
    'services.preferred_time': 'Preferred Time',
    'services.urgent': 'Urgent',
    'services.service_requested': 'Service requested successfully',
    'services.request_error': 'Failed to request service',

    // Check-in/Check-out
    'checkin.title': 'Check In',
    'checkin.booking_confirmation': 'Booking Confirmation',
    'checkin.upload_id': 'Upload ID Document',
    'checkin.signature': 'Digital Signature',
    'checkin.additional_guests': 'Additional Guests',
    'checkin.special_requests': 'Special Requests',
    'checkin.estimated_arrival': 'Estimated Arrival Time',
    'checkin.complete': 'Complete Check-in',
    'checkin.success': 'Check-in completed successfully',
    'checkout.title': 'Check Out',
    'checkout.feedback': 'Feedback',
    'checkout.rating': 'Rating',
    'checkout.comments': 'Comments',
    'checkout.additional_charges': 'Additional Charges',
    'checkout.key_card_returned': 'Key Card Returned',
    'checkout.complete': 'Complete Check-out',
    'checkout.success': 'Check-out completed successfully',

    // Profile
    'profile.personal_info': 'Personal Information',
    'profile.preferences': 'Preferences',
    'profile.language': 'Language',
    'profile.notifications': 'Notifications',
    'profile.loyalty_points': 'Loyalty Points',
    'profile.membership_tier': 'Membership Tier',
    'profile.dietary_restrictions': 'Dietary Restrictions',
    'profile.room_preferences': 'Room Preferences',
    'profile.bed_type': 'Bed Type',
    'profile.pillow_type': 'Pillow Type',
    'profile.smoking_preference': 'Smoking Preference',
    'profile.update_success': 'Profile updated successfully',
    'profile.update_error': 'Failed to update profile',

    // Payments
    'payment.total': 'Total',
    'payment.method': 'Payment Method',
    'payment.card': 'Credit/Debit Card',
    'payment.cash': 'Cash',
    'payment.points': 'Loyalty Points',
    'payment.bank_transfer': 'Bank Transfer',
    'payment.processing': 'Processing payment...',
    'payment.success': 'Payment successful',
    'payment.error': 'Payment failed',
    'payment.history': 'Payment History',

    // Notifications
    'notifications.mark_read': 'Mark as Read',
    'notifications.mark_all_read': 'Mark All as Read',
    'notifications.no_notifications': 'No notifications',
    'notifications.new': 'New',

    // Errors
    'error.network': 'Network error. Please check your connection.',
    'error.server': 'Server error. Please try again later.',
    'error.unauthorized': 'Unauthorized. Please log in again.',
    'error.not_found': 'Resource not found.',
    'error.validation': 'Validation error. Please check your input.',
    'error.generic': 'An unexpected error occurred.',

    // Weather
    'weather.sunny': 'Sunny',
    'weather.cloudy': 'Cloudy',
    'weather.rainy': 'Rainy',
    'weather.snowy': 'Snowy',
    'weather.temperature_unit': '°C',
    'weather.humidity': 'Humidity',
    'weather.wind_speed': 'Wind Speed',
  },
  ar: {
    // Common
    search: 'بحث...',
    notifications: {
      title: 'الإشعارات',
      viewAll: 'عرض جميع الإشعارات',
      newBooking: 'تم تأكيد حجز جديد',
      checkIn: 'تم تسجيل وصول الضيف',
      maintenance: 'تمت الصيانة',
    },
    user: {
      name: 'ضيف',
      role: 'ضيف الفندق',
    },
    menu: {
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
    },
    // Sidebar
    sidebar: {
      main: 'الرئيسية',
      operations: 'العمليات',
      management: 'الإدارة',
      dashboard: 'لوحة التحكم',
      reservations: 'الحجوزات',
      guests: 'الضيوف',
      rooms: 'الغرف',
      frontDesk: 'الاستقبال',
      housekeeping: 'التنظيف',
      billing: 'الفواتير',
      messages: 'الرسائل',
      analytics: 'التحليلات',
      settings: 'الإعدادات',
    },
    'common.welcome': 'مرحباً',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.close': 'إغلاق',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.ok': 'موافق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.submit': 'إرسال',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.refresh': 'تحديث',
    'common.retry': 'إعادة المحاولة',

    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.room_control': 'التحكم في الغرفة',
    'nav.services': 'الخدمات',
    'nav.profile': 'الملف الشخصي',
    'nav.notifications': 'الإشعارات',
    'nav.checkin': 'تسجيل الوصول',
    'nav.checkout': 'تسجيل المغادرة',
    'nav.settings': 'الإعدادات',
    'nav.help': 'المساعدة',
    'nav.logout': 'تسجيل الخروج',

    // Authentication
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirm_password': 'تأكيد كلمة المرور',
    'auth.first_name': 'الاسم الأول',
    'auth.last_name': 'اسم العائلة',
    'auth.phone': 'رقم الهاتف',
    'auth.forgot_password': 'نسيت كلمة المرور؟',
    'auth.remember_me': 'تذكرني',
    'auth.login_success': 'تم تسجيل الدخول بنجاح',
    'auth.login_error': 'فشل في تسجيل الدخول. يرجى التحقق من بياناتك.',
    'auth.register_success': 'تم إنشاء الحساب بنجاح',
    'auth.register_error': 'فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى.',

    // Dashboard
    'dashboard.good_morning': 'صباح الخير',
    'dashboard.good_afternoon': 'مساء الخير',
    'dashboard.good_evening': 'مساء الخير',
    'dashboard.welcome_back': 'مرحباً بعودتك، {name}',
    'dashboard.room_number': 'غرفة رقم {number}',
    'dashboard.current_weather': 'الطقس الحالي',
    'dashboard.quick_actions': 'إجراءات سريعة',
    'dashboard.recent_activity': 'النشاط الأخير',
    'dashboard.upcoming_services': 'الخدمات القادمة',

    // Room Control
    'room.temperature': 'درجة الحرارة',
    'room.lighting': 'الإضاءة',
    'room.curtains': 'الستائر',
    'room.air_conditioning': 'تكييف الهواء',
    'room.tv': 'التلفزيون',
    'room.music': 'الموسيقى',
    'room.do_not_disturb': 'عدم الإزعاج',
    'room.housekeeping_needed': 'تنظيف الغرفة مطلوب',
    'room.open': 'فتح',
    'room.close': 'إغلاق',
    'room.on': 'تشغيل',
    'room.off': 'إيقاف',
    'room.increase': 'زيادة',
    'room.decrease': 'تقليل',

    // Services
    'services.room_service': 'خدمة الغرف',
    'services.housekeeping': 'خدمة التنظيف',
    'services.maintenance': 'الصيانة',
    'services.concierge': 'البوابة',
    'services.spa': 'خدمات السبا',
    'services.laundry': 'خدمة الغسيل',
    'services.request_service': 'طلب خدمة',
    'services.service_description': 'وصف الخدمة',
    'services.special_instructions': 'تعليمات خاصة',
    'services.preferred_time': 'الوقت المفضل',
    'services.urgent': 'عاجل',
    'services.service_requested': 'تم طلب الخدمة بنجاح',
    'services.request_error': 'فشل في طلب الخدمة',

    // Check-in/Check-out
    'checkin.title': 'تسجيل الوصول',
    'checkin.booking_confirmation': 'تأكيد الحجز',
    'checkin.upload_id': 'رفع الهوية',
    'checkin.signature': 'التوقيع الرقمي',
    'checkin.additional_guests': 'ضيوف إضافيون',
    'checkin.special_requests': 'طلبات خاصة',
    'checkin.estimated_arrival': 'وقت الوصول المتوقع',
    'checkin.complete': 'إكمال تسجيل الوصول',
    'checkin.success': 'تم تسجيل الوصول بنجاح',
    'checkout.title': 'تسجيل المغادرة',
    'checkout.feedback': 'التقييم',
    'checkout.rating': 'التقييم',
    'checkout.comments': 'التعليقات',
    'checkout.additional_charges': 'رسوم إضافية',
    'checkout.key_card_returned': 'تم إرجاع بطاقة المفتاح',
    'checkout.complete': 'إكمال تسجيل المغادرة',
    'checkout.success': 'تم تسجيل المغادرة بنجاح',

    // Profile
    'profile.personal_info': 'المعلومات الشخصية',
    'profile.preferences': 'التفضيلات',
    'profile.language': 'اللغة',
    'profile.notifications': 'الإشعارات',
    'profile.loyalty_points': 'نقاط الولاء',
    'profile.membership_tier': 'مستوى العضوية',
    'profile.dietary_restrictions': 'القيود الغذائية',
    'profile.room_preferences': 'تفضيلات الغرفة',
    'profile.bed_type': 'نوع السرير',
    'profile.pillow_type': 'نوع الوسادة',
    'profile.smoking_preference': 'تفضيل التدخين',
    'profile.update_success': 'تم تحديث الملف بنجاح',
    'profile.update_error': 'فشل في تحديث الملف',

    // Payments
    'payment.total': 'المجموع',
    'payment.method': 'طريقة الدفع',
    'payment.card': 'بطاقة ائتمان/خصم',
    'payment.cash': 'نقدي',
    'payment.points': 'نقاط الولاء',
    'payment.bank_transfer': 'حوالة بنكية',
    'payment.processing': 'جاري معالجة الدفع...',
    'payment.success': 'تم الدفع بنجاح',
    'payment.error': 'فشل الدفع',
    'payment.history': 'تاريخ المدفوعات',

    // Notifications
    'notifications.mark_read': 'تحديد كمقروء',
    'notifications.mark_all_read': 'تحديد الكل كمقروء',
    'notifications.no_notifications': 'لا توجد إشعارات',
    'notifications.new': 'جديد',

    // Errors
    'error.network': 'خطأ في الشبكة. يرجى التحقق من الاتصال.',
    'error.server': 'خطأ في الخادم. يرجى المحاولة لاحقاً.',
    'error.unauthorized': 'غير مصرح. يرجى تسجيل الدخول مرة أخرى.',
    'error.not_found': 'المورد غير موجود.',
    'error.validation': 'خطأ في التحقق. يرجى مراجعة المدخلات.',
    'error.generic': 'حدث خطأ غير متوقع.',

    // Weather
    'weather.sunny': 'مشمس',
    'weather.cloudy': 'غائم',
    'weather.rainy': 'ممطر',
    'weather.snowy': 'مثلج',
    'weather.temperature_unit': '°م',
    'weather.humidity': 'الرطوبة',
    'weather.wind_speed': 'سرعة الرياح',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const isRTL = language === 'ar';

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Update HTML direction when language changes
  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    // Navigate through nested keys
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        translation = translations[language][key as keyof typeof translations[typeof language]] || key;
        break;
      }
    }
    
    // If translation is not a string, return the key
    if (typeof translation !== 'string') {
      return key;
    }
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): TranslationType & { isRTL: boolean } => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  const toggleLanguage = () => {
    context.setLanguage(context.language === 'en' ? 'ar' : 'en');
  };
  
  return {
    t: context.t,
    language: context.language,
    setLanguage: context.setLanguage,
    isRTL: context.isRTL,
    toggleLanguage,
  };
};

// Utility hook for formatting numbers based on language
export const useNumberFormat = () => {
  const { language } = useLanguage();
  
  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    const locale = language === 'ar' ? 'ar-SA' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(num);
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    const locale = language === 'ar' ? 'ar-SA' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return { formatNumber, formatCurrency };
};

// Utility hook for formatting dates based on language
export const useDateFormat = () => {
  const { language } = useLanguage();
  
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const locale = language === 'ar' ? 'ar-SA' : 'en-US';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  };

  const formatTime = (date: Date | string) => {
    return formatDate(date, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (date: Date | string) => {
    return formatDate(date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return { formatDate, formatTime, formatDateTime };
};