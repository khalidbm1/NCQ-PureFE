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
    arabic: 'العربية'
  },

  // Authentication
  auth: {
    login: 'تسجيل الدخول',
    loginTitle: 'دخول المسؤول',
    loginSubtitle: 'الوصول إلى لوحة تحكم منصة NCQ',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    loginButton: 'تسجيل الدخول',
    loggingIn: 'جاري تسجيل الدخول...',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    logout: 'تسجيل الخروج',
    logoutConfirm: 'هل أنت متأكد من تسجيل الخروج؟',
    sessionExpired: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.',
    unauthorized: 'وصول غير مصرح به'
  },

  // Sidebar Navigation
  sidebar: {
    dashboard: 'لوحة التحكم',
    users: 'المستخدمون',
    analytics: 'التحليلات',
    billing: 'الفوترة',
    products: {
      title: 'المنتجات',
      paymentGateway: 'بوابة الدفع',
      hospitalManagement: 'إدارة المستشفيات',
      blockchain: 'بلوك تشين طبي',
      iot: 'منصة إنترنت الأشياء',
      hospitality: 'الضيافة الذكية'
    },
    settings: {
      title: 'الإعدادات',
      general: 'عام',
      security: 'الأمان',
      notifications: 'الإشعارات',
      api: 'إدارة API',
      audit: 'سجلات التدقيق'
    },
    support: {
      title: 'الدعم',
      tickets: 'التذاكر',
      documentation: 'التوثيق',
      help: 'مركز المساعدة'
    }
  },

  // Dashboard
  dashboard: {
    title: 'لوحة التحكم',
    welcome: 'مرحباً بعودتك، {{name}}!',
    overview: 'نظرة عامة على المنصة',
    stats: {
      totalUsers: 'إجمالي المستخدمين',
      activeSubscriptions: 'الاشتراكات النشطة',
      monthlyRevenue: 'الإيرادات الشهرية',
      systemHealth: 'صحة النظام'
    },
    recentActivity: 'النشاط الأخير',
    quickActions: 'إجراءات سريعة',
    charts: {
      userGrowth: 'نمو المستخدمين',
      revenueOverTime: 'الإيرادات عبر الزمن',
      productUsage: 'استخدام المنتج',
      systemMetrics: 'مقاييس النظام'
    },
    filters: {
      today: 'اليوم',
      week: 'هذا الأسبوع',
      month: 'هذا الشهر',
      quarter: 'هذا الربع',
      year: 'هذا العام',
      custom: 'نطاق مخصص'
    }
  },

  // Users Management
  users: {
    title: 'إدارة المستخدمين',
    totalUsers: 'إجمالي المستخدمين',
    activeUsers: 'المستخدمون النشطون',
    newUsers: 'المستخدمون الجدد',
    searchPlaceholder: 'البحث عن المستخدمين بالاسم أو البريد الإلكتروني أو المعرف...',
    filters: {
      all: 'جميع المستخدمين',
      active: 'نشط',
      inactive: 'غير نشط',
      pending: 'معلق',
      suspended: 'موقوف'
    },
    table: {
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      subscription: 'الاشتراك',
      lastActive: 'آخر نشاط',
      dateJoined: 'تاريخ الانضمام',
      status: 'الحالة',
      actions: 'الإجراءات'
    },
    actions: {
      view: 'عرض التفاصيل',
      edit: 'تعديل المستخدم',
      suspend: 'إيقاف',
      activate: 'تفعيل',
      delete: 'حذف',
      resetPassword: 'إعادة تعيين كلمة المرور',
      sendEmail: 'إرسال بريد إلكتروني',
      viewActivity: 'عرض النشاط'
    },
    roles: {
      admin: 'مسؤول',
      user: 'مستخدم',
      moderator: 'مشرف',
      viewer: 'مشاهد'
    },
    createUser: 'إنشاء مستخدم',
    editUser: 'تعديل مستخدم',
    userDetails: 'تفاصيل المستخدم',
    confirmDelete: 'هل أنت متأكد من حذف هذا المستخدم؟',
    confirmSuspend: 'هل أنت متأكد من إيقاف هذا المستخدم؟',
    userCreated: 'تم إنشاء المستخدم بنجاح',
    userUpdated: 'تم تحديث المستخدم بنجاح',
    userDeleted: 'تم حذف المستخدم بنجاح'
  },

  // Analytics
  analytics: {
    title: 'التحليلات',
    overview: 'نظرة عامة على التحليلات',
    metrics: {
      pageViews: 'مشاهدات الصفحة',
      uniqueVisitors: 'الزوار الفريدون',
      bounceRate: 'معدل الارتداد',
      avgSessionDuration: 'متوسط مدة الجلسة',
      conversionRate: 'معدل التحويل',
      activeUsers: 'المستخدمون النشطون'
    },
    charts: {
      traffic: 'نظرة عامة على حركة المرور',
      userEngagement: 'تفاعل المستخدمين',
      deviceBreakdown: 'توزيع الأجهزة',
      geographicDistribution: 'التوزيع الجغرافي',
      topPages: 'أفضل الصفحات',
      referralSources: 'مصادر الإحالة'
    },
    export: {
      title: 'تصدير التحليلات',
      format: 'التنسيق',
      dateRange: 'نطاق التاريخ',
      pdf: 'تقرير PDF',
      excel: 'جدول Excel',
      csv: 'ملف CSV'
    }
  },

  // Billing
  billing: {
    title: 'الفوترة والاشتراكات',
    revenue: {
      title: 'نظرة عامة على الإيرادات',
      total: 'إجمالي الإيرادات',
      recurring: 'الإيرادات المتكررة',
      oneTime: 'الإيرادات لمرة واحدة',
      pending: 'المدفوعات المعلقة'
    },
    subscriptions: {
      title: 'إدارة الاشتراكات',
      active: 'الاشتراكات النشطة',
      trial: 'المستخدمون التجريبيون',
      expired: 'منتهية الصلاحية',
      cancelled: 'ملغاة'
    },
    transactions: {
      title: 'المعاملات الأخيرة',
      id: 'معرف المعاملة',
      user: 'المستخدم',
      amount: 'المبلغ',
      status: 'الحالة',
      date: 'التاريخ',
      method: 'طريقة الدفع',
      invoice: 'الفاتورة'
    },
    plans: {
      title: 'خطط الاشتراك',
      starter: 'البداية',
      professional: 'الاحترافية',
      enterprise: 'المؤسسات',
      custom: 'مخصص',
      features: 'المميزات',
      price: 'السعر',
      billing: 'الفوترة',
      monthly: 'شهري',
      yearly: 'سنوي',
      users: 'المستخدمون',
      storage: 'التخزين',
      support: 'الدعم'
    },
    actions: {
      viewInvoice: 'عرض الفاتورة',
      downloadInvoice: 'تحميل الفاتورة',
      refund: 'استرداد',
      cancelSubscription: 'إلغاء الاشتراك',
      upgradeSubscription: 'ترقية الاشتراك'
    }
  },

  // Settings
  settings: {
    title: 'الإعدادات',
    general: {
      title: 'الإعدادات العامة',
      companyName: 'اسم الشركة',
      companyEmail: 'بريد الشركة الإلكتروني',
      timezone: 'المنطقة الزمنية',
      currency: 'العملة',
      dateFormat: 'تنسيق التاريخ',
      language: 'اللغة',
      theme: 'المظهر'
    },
    security: {
      title: 'إعدادات الأمان',
      twoFactor: 'المصادقة الثنائية',
      sessions: 'الجلسات النشطة',
      apiKeys: 'مفاتيح API',
      ipWhitelist: 'قائمة IP البيضاء',
      passwordPolicy: 'سياسة كلمة المرور',
      loginAttempts: 'الحد الأقصى لمحاولات تسجيل الدخول',
      sessionTimeout: 'مهلة الجلسة'
    },
    notifications: {
      title: 'إعدادات الإشعارات',
      email: 'إشعارات البريد الإلكتروني',
      push: 'الإشعارات الفورية',
      sms: 'إشعارات الرسائل القصيرة',
      events: {
        newUser: 'تسجيل مستخدم جديد',
        payment: 'استلام دفعة',
        error: 'أخطاء النظام',
        security: 'تنبيهات الأمان'
      }
    },
    api: {
      title: 'إدارة API',
      keys: 'مفاتيح API',
      createKey: 'إنشاء مفتاح API',
      keyName: 'اسم المفتاح',
      permissions: 'الصلاحيات',
      rateLimit: 'حد المعدل',
      expiresAt: 'ينتهي في',
      lastUsed: 'آخر استخدام',
      revoke: 'إلغاء',
      documentation: 'توثيق API'
    },
    audit: {
      title: 'سجلات التدقيق',
      user: 'المستخدم',
      action: 'الإجراء',
      resource: 'المورد',
      timestamp: 'الطابع الزمني',
      ip: 'عنوان IP',
      userAgent: 'وكيل المستخدم',
      details: 'التفاصيل',
      filters: {
        allActions: 'جميع الإجراءات',
        create: 'إنشاء',
        update: 'تحديث',
        delete: 'حذف',
        login: 'تسجيل دخول',
        logout: 'تسجيل خروج'
      }
    }
  },

  // Support
  support: {
    tickets: {
      title: 'تذاكر الدعم',
      id: 'معرف التذكرة',
      subject: 'الموضوع',
      status: 'الحالة',
      priority: 'الأولوية',
      category: 'الفئة',
      createdBy: 'أنشأها',
      assignedTo: 'مُسندة إلى',
      created: 'تم الإنشاء',
      updated: 'آخر تحديث',
      statuses: {
        open: 'مفتوحة',
        pending: 'معلقة',
        resolved: 'محلولة',
        closed: 'مغلقة'
      },
      priorities: {
        low: 'منخفضة',
        medium: 'متوسطة',
        high: 'عالية',
        urgent: 'عاجلة'
      },
      categories: {
        technical: 'تقني',
        billing: 'الفوترة',
        general: 'عام',
        feature: 'طلب ميزة'
      },
      actions: {
        view: 'عرض التذكرة',
        reply: 'رد',
        assign: 'إسناد',
        close: 'إغلاق',
        reopen: 'إعادة فتح'
      }
    }
  },

  // Products
  products: {
    paymentGateway: {
      title: 'بوابة الدفع',
      transactions: 'المعاملات',
      volume: 'حجم المعاملات',
      successRate: 'معدل النجاح',
      failedTransactions: 'المعاملات الفاشلة',
      refunds: 'المبالغ المستردة',
      disputes: 'النزاعات'
    },
    hospitalManagement: {
      title: 'إدارة المستشفيات',
      hospitals: 'المستشفيات',
      clinics: 'العيادات',
      patients: 'المرضى',
      appointments: 'المواعيد',
      doctors: 'الأطباء',
      records: 'السجلات الطبية'
    },
    blockchain: {
      title: 'السجلات الطبية بالبلوك تشين',
      records: 'السجلات',
      institutions: 'المؤسسات',
      verifications: 'التحققات',
      accessLogs: 'سجلات الوصول',
      consents: 'الموافقات'
    },
    iot: {
      title: 'منصة إنترنت الأشياء',
      devices: 'الأجهزة المتصلة',
      dataPoints: 'نقاط البيانات',
      alerts: 'التنبيهات',
      automations: 'الأتمتة',
      uptime: 'متوسط وقت التشغيل'
    },
    hospitality: {
      title: 'الضيافة الذكية',
      hotels: 'الفنادق',
      rooms: 'الغرف',
      bookings: 'الحجوزات',
      occupancy: 'معدل الإشغال',
      revenue: 'الإيرادات',
      guestSatisfaction: 'رضا الضيوف'
    }
  },

  // Modals & Alerts
  modals: {
    confirm: {
      title: 'تأكيد الإجراء',
      message: 'هل أنت متأكد من المتابعة؟'
    },
    delete: {
      title: 'تأكيد الحذف',
      message: 'لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد؟'
    },
    success: {
      title: 'نجاح',
      message: 'تمت العملية بنجاح'
    },
    error: {
      title: 'خطأ',
      message: 'حدث خطأ. يرجى المحاولة مرة أخرى.'
    }
  },

  // Footer
  footer: {
    copyright: '© 2024 منصة NCQ. جميع الحقوق محفوظة.',
    version: 'الإصدار {{version}}',
    terms: 'شروط الخدمة',
    privacy: 'سياسة الخصوصية',
    contact: 'اتصل بالدعم'
  }
}