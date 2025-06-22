export default {
  // Common
  common: {
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    search: 'بحث',
    filter: 'تصفية',
    actions: 'الإجراءات',
    status: 'الحالة',
    active: 'نشط',
    inactive: 'غير نشط',
    yes: 'نعم',
    no: 'لا',
    confirm: 'تأكيد',
    close: 'إغلاق',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    create: 'إنشاء',
    update: 'تحديث',
    view: 'عرض',
    download: 'تحميل',
    upload: 'رفع',
    refresh: 'تحديث',
    reset: 'إعادة تعيين',
    export: 'تصدير',
    import: 'استيراد',
    clear: 'مسح',
    apply: 'تطبيق',
    select: 'اختيار',
    selectAll: 'اختيار الكل',
    unselectAll: 'إلغاء اختيار الكل',
    required: 'مطلوب',
    optional: 'اختياري',
    success: 'نجح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات',
    noData: 'لا توجد بيانات متاحة',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    notifications: 'الإشعارات',
    newNotifications: '{{count}} إشعارات جديدة',
    markAllRead: 'وضع علامة مقروءة على الكل',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    home: 'الرئيسية',
    welcome: 'مرحباً',
    welcomeBack: 'مرحباً بعودتك',
    getStarted: 'ابدأ الآن',
    learnMore: 'اعرف المزيد',
    contactUs: 'اتصل بنا',
    help: 'مساعدة',
    support: 'الدعم'
  },

  // Authentication
  auth: {
    login: 'تسجيل الدخول',
    loginTitle: 'مرحباً بعودتك',
    loginSubtitle: 'الوصول إلى حسابك في منصة NCQ',
    register: 'تسجيل',
    registerTitle: 'إنشاء حساب',
    registerSubtitle: 'انضم إلى منصة NCQ اليوم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    companyName: 'اسم الشركة',
    phoneNumber: 'رقم الهاتف',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    loginButton: 'تسجيل الدخول',
    registerButton: 'إنشاء حساب',
    loggingIn: 'جاري تسجيل الدخول...',
    registering: 'جاري إنشاء الحساب...',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    registerError: 'فشل التسجيل. يرجى المحاولة مرة أخرى.',
    logout: 'تسجيل الخروج',
    logoutConfirm: 'هل أنت متأكد من تسجيل الخروج؟',
    sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.',
    unauthorized: 'وصول غير مصرح به',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    orContinueWith: 'أو تابع باستخدام',
    googleLogin: 'تابع مع جوجل',
    termsAgreement: 'بإنشاء حساب، فإنك توافق على',
    termsOfService: 'شروط الخدمة',
    and: 'و',
    privacyPolicy: 'سياسة الخصوصية'
  },

  // Navigation
  nav: {
    dashboard: 'لوحة التحكم',
    files: 'الملفات',
    payments: 'المدفوعات',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    products: {
      title: 'المنتجات',
      paymentGateway: 'بوابة الدفع',
      hospitalManagement: 'إدارة المستشفيات'
    }
  },

  // Dashboard
  dashboard: {
    title: 'لوحة التحكم',
    overview: 'نظرة عامة',
    welcomeMessage: 'مرحباً بعودتك، {{name}}!',
    quickStats: 'إحصائيات سريعة',
    recentActivity: 'النشاط الأخير',
    quickActions: 'إجراءات سريعة',
    stats: {
      totalTransactions: 'إجمالي المعاملات',
      monthlyRevenue: 'الإيرادات الشهرية',
      activeServices: 'الخدمات النشطة',
      pendingTasks: 'المهام المعلقة',
      storageUsed: 'التخزين المستخدم',
      apiCalls: 'استدعاءات API'
    },
    charts: {
      revenueOverview: 'نظرة عامة على الإيرادات',
      transactionVolume: 'حجم المعاملات',
      serviceUsage: 'استخدام الخدمة',
      performanceMetrics: 'مقاييس الأداء'
    },
    activities: {
      paymentReceived: 'تم استلام دفعة',
      fileUploaded: 'تم رفع ملف',
      reportGenerated: 'تم إنشاء تقرير',
      apiKeyCreated: 'تم إنشاء مفتاح API',
      settingsUpdated: 'تم تحديث الإعدادات'
    },
    subscription: {
      title: 'اشتراكك',
      plan: 'الخطة الحالية',
      usage: 'الاستخدام',
      billing: 'الفوترة التالية',
      upgrade: 'ترقية الخطة',
      manage: 'إدارة الاشتراك'
    }
  },

  // Files
  files: {
    title: 'الملفات',
    myFiles: 'ملفاتي',
    sharedWithMe: 'مشاركة معي',
    recent: 'الأخيرة',
    favorites: 'المفضلة',
    trash: 'سلة المهملات',
    uploadFile: 'رفع ملف',
    uploadFolder: 'رفع مجلد',
    newFolder: 'مجلد جديد',
    searchPlaceholder: 'البحث عن الملفات...',
    sortBy: 'ترتيب حسب',
    view: 'عرض',
    gridView: 'عرض الشبكة',
    listView: 'عرض القائمة',
    table: {
      name: 'الاسم',
      size: 'الحجم',
      type: 'النوع',
      modified: 'تم التعديل',
      owner: 'المالك',
      sharedWith: 'مشارك مع'
    },
    actions: {
      download: 'تحميل',
      share: 'مشاركة',
      rename: 'إعادة تسمية',
      move: 'نقل',
      copy: 'نسخ',
      delete: 'حذف',
      restore: 'استعادة',
      preview: 'معاينة',
      getLink: 'الحصول على رابط',
      properties: 'الخصائص'
    },
    empty: {
      title: 'لا توجد ملفات بعد',
      description: 'ارفع ملفك الأول للبدء',
      uploadButton: 'رفع ملف'
    },
    upload: {
      dragDrop: 'اسحب وأفلت الملفات هنا',
      or: 'أو',
      browse: 'تصفح الملفات',
      uploading: 'جاري الرفع...',
      uploadComplete: 'اكتمل الرفع',
      uploadFailed: 'فشل الرفع'
    }
  },

  // Payments
  payments: {
    title: 'المدفوعات',
    overview: 'نظرة عامة على المدفوعات',
    transactions: 'المعاملات',
    invoices: 'الفواتير',
    paymentMethods: 'طرق الدفع',
    billingAddress: 'عنوان الفوترة',
    stats: {
      totalPaid: 'إجمالي المدفوع',
      pending: 'معلق',
      lastPayment: 'آخر دفعة',
      nextPayment: 'الدفعة التالية'
    },
    transaction: {
      id: 'معرف المعاملة',
      date: 'التاريخ',
      amount: 'المبلغ',
      status: 'الحالة',
      method: 'الطريقة',
      description: 'الوصف',
      invoice: 'الفاتورة',
      statuses: {
        completed: 'مكتملة',
        pending: 'معلقة',
        failed: 'فاشلة',
        refunded: 'مستردة'
      }
    },
    invoice: {
      number: 'رقم الفاتورة',
      date: 'تاريخ الفاتورة',
      dueDate: 'تاريخ الاستحقاق',
      amount: 'المبلغ',
      status: 'الحالة',
      download: 'تحميل الفاتورة',
      pay: 'ادفع الآن',
      statuses: {
        paid: 'مدفوعة',
        unpaid: 'غير مدفوعة',
        overdue: 'متأخرة',
        draft: 'مسودة'
      }
    },
    methods: {
      addNew: 'إضافة طريقة دفع',
      card: 'بطاقة ائتمان/خصم',
      bank: 'تحويل بنكي',
      wallet: 'محفظة رقمية',
      cardEnding: 'البطاقة المنتهية بـ {{last4}}',
      expires: 'تنتهي {{date}}',
      setDefault: 'تعيين كافتراضي',
      remove: 'إزالة'
    }
  },

  // Analytics
  analytics: {
    title: 'التحليلات',
    overview: 'نظرة عامة على التحليلات',
    period: 'الفترة',
    compare: 'مقارنة',
    export: 'تصدير البيانات',
    metrics: {
      revenue: 'الإيرادات',
      transactions: 'المعاملات',
      avgTransaction: 'متوسط المعاملة',
      conversionRate: 'معدل التحويل',
      growthRate: 'معدل النمو',
      activeUsers: 'المستخدمون النشطون'
    },
    charts: {
      revenueByProduct: 'الإيرادات حسب المنتج',
      transactionsByStatus: 'المعاملات حسب الحالة',
      geographicDistribution: 'التوزيع الجغرافي',
      timeSeriesAnalysis: 'تحليل السلاسل الزمنية',
      topProducts: 'أفضل المنتجات',
      userActivity: 'نشاط المستخدم'
    },
    filters: {
      today: 'اليوم',
      yesterday: 'أمس',
      last7Days: 'آخر 7 أيام',
      last30Days: 'آخر 30 يوم',
      thisMonth: 'هذا الشهر',
      lastMonth: 'الشهر الماضي',
      custom: 'نطاق مخصص'
    }
  },

  // Settings
  settings: {
    title: 'الإعدادات',
    tabs: {
      profile: 'الملف الشخصي',
      security: 'الأمان',
      notifications: 'الإشعارات',
      api: 'مفاتيح API',
      billing: 'الفوترة',
      preferences: 'التفضيلات'
    },
    profile: {
      title: 'إعدادات الملف الشخصي',
      personalInfo: 'المعلومات الشخصية',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      company: 'الشركة',
      jobTitle: 'المسمى الوظيفي',
      bio: 'نبذة',
      avatar: 'صورة الملف الشخصي',
      changeAvatar: 'تغيير الصورة',
      removeAvatar: 'إزالة الصورة',
      saveChanges: 'حفظ التغييرات',
      changesSaved: 'تم حفظ التغييرات'
    },
    security: {
      title: 'إعدادات الأمان',
      password: 'كلمة المرور',
      changePassword: 'تغيير كلمة المرور',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
      passwordRequirements: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      twoFactor: 'المصادقة الثنائية',
      enable2FA: 'تفعيل المصادقة الثنائية',
      disable2FA: 'تعطيل المصادقة الثنائية',
      sessions: 'الجلسات النشطة',
      currentSession: 'الجلسة الحالية',
      terminateAll: 'إنهاء جميع الجلسات الأخرى'
    },
    notifications: {
      title: 'تفضيلات الإشعارات',
      email: 'إشعارات البريد الإلكتروني',
      push: 'الإشعارات الفورية',
      sms: 'إشعارات الرسائل القصيرة',
      categories: {
        security: 'تنبيهات الأمان',
        transactions: 'تحديثات المعاملات',
        marketing: 'التسويق والعروض',
        product: 'تحديثات المنتج',
        account: 'نشاط الحساب'
      },
      frequency: {
        realTime: 'فوري',
        daily: 'ملخص يومي',
        weekly: 'ملخص أسبوعي',
        never: 'أبداً'
      }
    },
    api: {
      title: 'إدارة مفاتيح API',
      description: 'إدارة مفاتيح API للوصول البرمجي',
      createKey: 'إنشاء مفتاح جديد',
      keyName: 'اسم المفتاح',
      permissions: 'الصلاحيات',
      created: 'تم الإنشاء',
      lastUsed: 'آخر استخدام',
      expires: 'ينتهي',
      actions: 'الإجراءات',
      regenerate: 'إعادة إنشاء',
      revoke: 'إلغاء',
      copyKey: 'نسخ المفتاح',
      keyCreated: 'تم إنشاء مفتاح API بنجاح',
      keyCopied: 'تم نسخ مفتاح API'
    },
    billing: {
      title: 'إعدادات الفوترة',
      currentPlan: 'الخطة الحالية',
      planDetails: 'تفاصيل الخطة',
      changePlan: 'تغيير الخطة',
      cancelPlan: 'إلغاء الخطة',
      paymentMethod: 'طريقة الدفع',
      billingHistory: 'سجل الفوترة',
      downloadInvoices: 'تحميل الفواتير',
      taxInfo: 'معلومات الضرائب',
      vatNumber: 'رقم ضريبة القيمة المضافة',
      billingEmail: 'بريد الفوترة الإلكتروني'
    },
    preferences: {
      title: 'التفضيلات',
      language: 'اللغة',
      timezone: 'المنطقة الزمنية',
      dateFormat: 'تنسيق التاريخ',
      currency: 'العملة',
      theme: 'المظهر',
      lightTheme: 'فاتح',
      darkTheme: 'داكن',
      systemTheme: 'النظام'
    }
  },

  // Products
  products: {
    paymentGateway: {
      title: 'بوابة الدفع',
      description: 'معالجة المدفوعات بأمان وكفاءة',
      features: {
        processing: 'معالجة المدفوعات',
        reports: 'تقارير المعاملات',
        refunds: 'إدارة المبالغ المستردة',
        disputes: 'حل النزاعات',
        integration: 'تكامل API'
      },
      stats: {
        processed: 'معالج اليوم',
        volume: 'حجم المعاملات',
        successRate: 'معدل النجاح',
        avgTime: 'متوسط وقت المعالجة'
      }
    },
    hospitalManagement: {
      title: 'إدارة المستشفيات',
      description: 'إدارة شاملة لمرافق الرعاية الصحية',
      modules: {
        patients: 'سجلات المرضى',
        appointments: 'المواعيد',
        billing: 'الفوترة الطبية',
        inventory: 'المخزون',
        reports: 'التقارير'
      },
      stats: {
        patients: 'المرضى النشطون',
        appointments: 'مواعيد اليوم',
        revenue: 'الإيرادات الشهرية',
        occupancy: 'إشغال الأسرّة'
      }
    }
  },

  // Help & Support
  help: {
    title: 'المساعدة والدعم',
    searchPlaceholder: 'البحث عن المساعدة...',
    categories: {
      gettingStarted: 'البدء',
      account: 'الحساب والفوترة',
      technical: 'الدعم الفني',
      api: 'توثيق API'
    },
    contactSupport: 'اتصل بالدعم',
    viewDocs: 'عرض التوثيق',
    submitTicket: 'إرسال تذكرة',
    faq: 'الأسئلة الشائعة'
  },

  // Error Messages
  errors: {
    generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    network: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
    notFound: 'الصفحة غير موجودة',
    unauthorized: 'غير مصرح لك بالوصول إلى هذا المورد',
    forbidden: 'الوصول محظور',
    serverError: 'خطأ في الخادم. يرجى المحاولة لاحقاً.',
    validation: 'يرجى التحقق من المدخلات والمحاولة مرة أخرى.'
  },

  // Success Messages
  success: {
    saved: 'تم حفظ التغييرات بنجاح',
    deleted: 'تم الحذف بنجاح',
    uploaded: 'تم رفع الملف بنجاح',
    sent: 'تم الإرسال بنجاح',
    copied: 'تم النسخ إلى الحافظة'
  }
}