export const translations = {
  en: {
    common: {
      appName: 'NCQ Payment Gateway',
      welcome: 'Welcome',
      logout: 'Logout',
      settings: 'Settings',
      profile: 'Profile',
      search: 'Search transactions, merchants...',
      notifications: 'Notifications',
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode'
    },
    navigation: {
      overview: 'Overview',
      transactions: 'Transactions',
      analytics: 'Analytics',
      settlements: 'Settlements',
      subscriptions: 'Subscriptions',
      paymentMethods: 'Payment Methods',
      security: 'Security',
      apiKeys: 'API Keys',
      webhooks: 'Webhooks',
      settings: 'Settings',
      merchants: 'Merchants',
      systemAnalytics: 'System Analytics',
      administration: 'Administration'
    },
    dashboard: {
      title: 'Dashboard Overview',
      totalRevenue: 'Total Revenue',
      transactions: 'Transactions',
      activeSubscriptions: 'Active Subscriptions',
      successRate: 'Success Rate',
      recentTransactions: 'Recent Transactions',
      viewAll: 'View All',
      status: 'Status',
      amount: 'Amount',
      date: 'Date',
      merchantId: 'Merchant ID'
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      createAccount: 'Create an account',
      alreadyHaveAccount: 'Already have an account?'
    }
  },
  ar: {
    common: {
      appName: 'بوابة دفع NCQ',
      welcome: 'مرحباً',
      logout: 'تسجيل الخروج',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      search: 'البحث عن المعاملات، التجار...',
      notifications: 'الإشعارات',
      language: 'اللغة',
      darkMode: 'الوضع الليلي',
      lightMode: 'الوضع النهاري'
    },
    navigation: {
      overview: 'نظرة عامة',
      transactions: 'المعاملات',
      analytics: 'التحليلات',
      settlements: 'التسويات',
      subscriptions: 'الاشتراكات',
      paymentMethods: 'طرق الدفع',
      security: 'الأمان',
      apiKeys: 'مفاتيح API',
      webhooks: 'Webhooks',
      settings: 'الإعدادات',
      merchants: 'التجار',
      systemAnalytics: 'تحليلات النظام',
      administration: 'الإدارة'
    },
    dashboard: {
      title: 'نظرة عامة على لوحة التحكم',
      totalRevenue: 'إجمالي الإيرادات',
      transactions: 'المعاملات',
      activeSubscriptions: 'الاشتراكات النشطة',
      successRate: 'معدل النجاح',
      recentTransactions: 'المعاملات الأخيرة',
      viewAll: 'عرض الكل',
      status: 'الحالة',
      amount: 'المبلغ',
      date: 'التاريخ',
      merchantId: 'معرف التاجر'
    },
    auth: {
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'هل نسيت كلمة المرور؟',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      createAccount: 'إنشاء حساب جديد',
      alreadyHaveAccount: 'هل لديك حساب بالفعل؟'
    }
  }
}

export type TranslationKey = keyof typeof translations.en