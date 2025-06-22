export const translations = {
  en: {
    common: {
      backToHome: "Back to Home"
    },
    brand: {
      name: "NCQ LLM",
      tagline: "Neural Cognitive Query Platform",
      description: "Next-generation multimodal AI platform"
    },
    nav: {
      playground: "Playground",
      docs: "API Docs",
      pricing: "Pricing",
      dashboard: "Dashboard",
      getStarted: "Get Started",
      signIn: "Sign In",
      signOut: "Sign Out"
    },
    auth: {
      login: {
        title: "Sign in to your account",
        email: "Email Address",
        password: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        signIn: "Sign In",
        signingIn: "Signing in...",
        orContinueWith: "Or continue with",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        invalidCredentials: "Invalid email or password"
      },
      signup: {
        title: "Create your account",
        fullName: "Full Name",
        email: "Email Address",
        password: "Password",
        passwordHelp: "Must be at least 8 characters with uppercase, lowercase, and numbers",
        company: "Company (Optional)",
        agreeToTerms: "I agree to the",
        termsOfService: "Terms of Service",
        and: "and",
        privacyPolicy: "Privacy Policy",
        createAccount: "Create Account",
        creatingAccount: "Creating Account...",
        orSignUpWith: "Or sign up with",
        haveAccount: "Already have an account?",
        signIn: "Sign in",
        passwordError: "Password must contain uppercase, lowercase, and numbers",
        termsError: "Please agree to the terms and conditions"
      },
      forgotPassword: {
        title: "Forgot your password?",
        subtitle: "Enter your email address and we'll send you a link to reset your password.",
        email: "Email Address",
        emailPlaceholder: "you@example.com",
        submit: "Send Reset Link",
        backToLogin: "Back to login",
        successTitle: "Check your email",
        successMessage: "We've sent a password reset link to {email}"
      }
    },
    dashboard: {
      sidebar: {
        overview: "Overview",
        apiKeys: "API Keys",
        usage: "Usage Analytics",
        billing: "Billing & Subscription",
        models: "Model Catalog",
        sandbox: "Sandbox",
        settings: "Settings",
        teamManagement: "Team Management",
        profileSettings: "Profile Settings"
      },
      overview: {
        title: "Dashboard Overview",
        subtitle: "Monitor your API usage and performance metrics",
        stats: {
          tokensUsed: "Total Tokens Used",
          of: "of",
          apiRequests: "API Requests",
          thisMonth: "this month",
          activeConcurrent: "Active Concurrent",
          jobsRunning: "jobs running",
          avgResponseTime: "Avg Response Time",
          p95Latency: "P95 latency",
          capacityUtilized: "capacity utilized",
          vsLastMonth: "vs last month",
          improvement: "improvement"
        },
        charts: {
          tokenUsageTrend: "Token Usage Trend",
          modelUsage: "Model Usage",
          recentActivity: "Recent API Activity"
        },
        table: {
          model: "Model",
          tokensUsed: "Tokens Used",
          status: "Status",
          time: "Time",
          success: "success",
          failed: "failed",
          minAgo: "min ago"
        }
      },
      apiKeys: {
        title: "API Keys",
        subtitle: "Manage your API keys for accessing NCQ LLM services",
        stats: {
          activeKeys: "Active Keys",
          totalKeys: "Total Keys Created",
          lastUsage: "Last Key Usage",
          today: "Today"
        },
        table: {
          label: "Label",
          apiKey: "API Key",
          created: "Created",
          lastUsed: "Last Used",
          status: "Status",
          actions: "Actions",
          active: "active",
          revoked: "revoked",
          never: "Never",
          revoke: "Revoke"
        },
        createKey: {
          button: "Create New Key",
          title: "Create New API Key",
          labelField: "Key Label",
          labelPlaceholder: "e.g., Production App",
          labelHelp: "A descriptive label to help you identify this key",
          important: "Important",
          warning: "Make sure to copy your API key after creation. For security reasons, we won't show it again.",
          cancel: "Cancel",
          create: "Create Key",
          successTitle: "New API key created successfully!",
          successMessage: "Make sure to copy your key now. You won't be able to see it again.",
          copyAndClose: "Copy & Close"
        },
        revokeKey: {
          title: "Revoke API Key",
          message: "Are you sure you want to revoke this API key? This action cannot be undone and any applications using this key will stop working immediately.",
          cancel: "Cancel",
          revoke: "Revoke Key"
        }
      },
      subscription: {
        plan: "Plan",
        included: "included",
        tokensPerMonth: "tokens/month",
        upgrade: "Upgrade",
        tokensUsed: "tokens used",
        basic: "Basic Plan",
        premium: "Premium Plan",
        scale: "Scale Plan",
        enterprise: "Enterprise Plan"
      },
      pricing: {
        currency: "SAR",
        perMonth: "/month",
        perThousandTokens: "/1K tokens",
        basic: {
          price: "37",
          tokens: "100,000",
          overage: "0.10"
        },
        premium: {
          price: "94",
          tokens: "250,000",
          overage: "0.08"
        },
        scale: {
          price: "281.50",
          tokens: "500,000",
          overage: "0.06",
          perUnit: "per unit"
        }
      },
      payment: {
        selectPaymentMethod: "Select Payment Method",
        paymentMethods: {
          card: "Credit/Debit Card",
          mada: "MADA Card",
          stcPay: "STC Pay",
          bankTransfer: "Bank Transfer (SADAD)",
          applePay: "Apple Pay"
        },
        cardDetails: "Card Details",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvv: "CVV",
        cardholderName: "Cardholder Name",
        mobileNumber: "Mobile Number",
        selectBank: "Select your bank",
        total: "Total",
        subtotal: "Subtotal",
        processingFee: "Processing Fee",
        paySecurely: "Pay Securely",
        securedBy: "Secured by NCQ Payment Gateway",
        ncqBankAccount: "All payments are transferred to NCQ bank account"
      },
      billing: {
        title: "Billing & Subscription",
        subtitle: "Manage your subscription and payment methods",
        currentPlan: {
          title: "Current Plan",
          subtitle: "Your active subscription details"
        },
        paymentMethods: {
          title: "Payment Methods",
          subtitle: "Manage your saved payment methods",
          add: "Add Payment Method"
        },
        invoices: {
          title: "Billing History",
          subtitle: "Download your previous invoices",
          date: "Date",
          amount: "Amount",
          status: "Status",
          actions: "Actions"
        },
        plan: "Plan",
        status: "Status",
        active: "Active",
        nextBilling: "Next Billing",
        features: "Features",
        perMonth: "per month",
        expires: "Expires",
        default: "Default",
        remove: "Remove",
        paid: "Paid",
        download: "Download",
        plans: {
          title: "Available Plans"
        },
        month: "month",
        currentPlan: "Current Plan",
        upgrade: "Upgrade"
      }
    },
    languages: {
      en: "English",
      ar: "العربية"
    },
    hero: {
      title: "Multimodal AI for Every Application",
      subtitle: "Process text, images, audio, and documents with state-of-the-art AI models. One API for all your AI needs.",
      tryNow: "Try it now",
      selectModel: "Select Model",
      generateResponse: "Generate Response",
      addFiles: "Add Files"
    },
    models: {
      text: {
        name: "Text",
        description: "Chat, summarize, analyze"
      },
      image: {
        name: "Images", 
        description: "Understand & generate"
      },
      audio: {
        name: "Audio",
        description: "Transcribe & synthesize"
      },
      document: {
        name: "Documents",
        description: "Extract & process"
      }
    },
    modelSelection: {
      title: "Available Models",
      llava: "LLaVA - Vision & Language",
      whisper: "Whisper - Speech Recognition",
      llama: "LLaMA 2 - Text Generation",
      claude: "Claude - Advanced Reasoning",
      gpt4: "GPT-4 - General Purpose",
      custom: "Custom Fine-tuned Model"
    }
  },
  ar: {
    common: {
      backToHome: "العودة إلى الصفحة الرئيسية"
    },
    brand: {
      name: "NCQ LLM",
      tagline: "منصة الاستعلام المعرفي العصبي",
      description: "منصة الذكاء الاصطناعي متعددة الوسائط من الجيل التالي"
    },
    nav: {
      playground: "ساحة التجارب",
      docs: "وثائق API",
      pricing: "الأسعار",
      dashboard: "لوحة التحكم",
      getStarted: "ابدأ الآن",
      signIn: "تسجيل الدخول",
      signOut: "تسجيل الخروج"
    },
    auth: {
      login: {
        title: "تسجيل الدخول إلى حسابك",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        rememberMe: "تذكرني",
        forgotPassword: "نسيت كلمة المرور؟",
        signIn: "تسجيل الدخول",
        signingIn: "جاري تسجيل الدخول...",
        orContinueWith: "أو المتابعة باستخدام",
        noAccount: "ليس لديك حساب؟",
        signUp: "إنشاء حساب",
        invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      },
      signup: {
        title: "إنشاء حسابك",
        fullName: "الاسم الكامل",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        passwordHelp: "يجب أن تكون 8 أحرف على الأقل مع أحرف كبيرة وصغيرة وأرقام",
        company: "الشركة (اختياري)",
        agreeToTerms: "أوافق على",
        termsOfService: "شروط الخدمة",
        and: "و",
        privacyPolicy: "سياسة الخصوصية",
        createAccount: "إنشاء حساب",
        creatingAccount: "جاري إنشاء الحساب...",
        orSignUpWith: "أو التسجيل باستخدام",
        haveAccount: "لديك حساب بالفعل؟",
        signIn: "تسجيل الدخول",
        passwordError: "يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة وأرقام",
        termsError: "يرجى الموافقة على الشروط والأحكام"
      },
      forgotPassword: {
        title: "نسيت كلمة المرور؟",
        subtitle: "أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور.",
        email: "البريد الإلكتروني",
        emailPlaceholder: "you@example.com",
        submit: "إرسال رابط إعادة التعيين",
        backToLogin: "العودة لتسجيل الدخول",
        successTitle: "تحقق من بريدك الإلكتروني",
        successMessage: "لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى {email}"
      }
    },
    dashboard: {
      sidebar: {
        overview: "نظرة عامة",
        apiKeys: "مفاتيح API",
        usage: "تحليلات الاستخدام",
        billing: "الفوترة والاشتراك",
        models: "كتالوج النماذج",
        sandbox: "بيئة التجربة",
        settings: "الإعدادات",
        teamManagement: "إدارة الفريق",
        profileSettings: "إعدادات الملف الشخصي"
      },
      overview: {
        title: "نظرة عامة على لوحة التحكم",
        subtitle: "مراقبة استخدام API الخاص بك ومقاييس الأداء",
        stats: {
          tokensUsed: "إجمالي الرموز المستخدمة",
          of: "من",
          apiRequests: "طلبات API",
          thisMonth: "هذا الشهر",
          activeConcurrent: "نشط متزامن",
          jobsRunning: "مهام قيد التشغيل",
          avgResponseTime: "متوسط وقت الاستجابة",
          p95Latency: "زمن الاستجابة P95",
          capacityUtilized: "السعة المستخدمة",
          vsLastMonth: "مقابل الشهر الماضي",
          improvement: "تحسن"
        },
        charts: {
          tokenUsageTrend: "اتجاه استخدام الرموز",
          modelUsage: "استخدام النموذج",
          recentActivity: "نشاط API الأخير"
        },
        table: {
          model: "النموذج",
          tokensUsed: "الرموز المستخدمة",
          status: "الحالة",
          time: "الوقت",
          success: "نجح",
          failed: "فشل",
          minAgo: "دقيقة مضت"
        }
      },
      apiKeys: {
        title: "مفاتيح API",
        subtitle: "إدارة مفاتيح API الخاصة بك للوصول إلى خدمات NCQ LLM",
        stats: {
          activeKeys: "المفاتيح النشطة",
          totalKeys: "إجمالي المفاتيح المُنشأة",
          lastUsage: "آخر استخدام للمفتاح",
          today: "اليوم"
        },
        table: {
          label: "التسمية",
          apiKey: "مفتاح API",
          created: "تاريخ الإنشاء",
          lastUsed: "آخر استخدام",
          status: "الحالة",
          actions: "الإجراءات",
          active: "نشط",
          revoked: "ملغى",
          never: "أبداً",
          revoke: "إلغاء"
        },
        createKey: {
          button: "إنشاء مفتاح جديد",
          title: "إنشاء مفتاح API جديد",
          labelField: "تسمية المفتاح",
          labelPlaceholder: "مثال: تطبيق الإنتاج",
          labelHelp: "تسمية وصفية لمساعدتك في تحديد هذا المفتاح",
          important: "مهم",
          warning: "تأكد من نسخ مفتاح API الخاص بك بعد الإنشاء. لأسباب أمنية، لن نعرضه مرة أخرى.",
          cancel: "إلغاء",
          create: "إنشاء مفتاح",
          successTitle: "تم إنشاء مفتاح API جديد بنجاح!",
          successMessage: "تأكد من نسخ مفتاحك الآن. لن تتمكن من رؤيته مرة أخرى.",
          copyAndClose: "نسخ وإغلاق"
        },
        revokeKey: {
          title: "إلغاء مفتاح API",
          message: "هل أنت متأكد من رغبتك في إلغاء مفتاح API هذا؟ لا يمكن التراجع عن هذا الإجراء وستتوقف أي تطبيقات تستخدم هذا المفتاح عن العمل فوراً.",
          cancel: "إلغاء",
          revoke: "إلغاء المفتاح"
        }
      },
      subscription: {
        plan: "الخطة",
        included: "مضمن",
        tokensPerMonth: "رمز/شهر",
        upgrade: "ترقية",
        tokensUsed: "رمز مستخدم",
        basic: "الخطة الأساسية",
        premium: "الخطة المميزة",
        scale: "خطة التوسع",
        enterprise: "خطة المؤسسات"
      },
      pricing: {
        currency: "ر.س",
        perMonth: "/شهر",
        perThousandTokens: "/1000 رمز",
        basic: {
          price: "37",
          tokens: "100,000",
          overage: "0.10"
        },
        premium: {
          price: "94",
          tokens: "250,000",
          overage: "0.08"
        },
        scale: {
          price: "281.50",
          tokens: "500,000",
          overage: "0.06",
          perUnit: "لكل وحدة"
        }
      },
      payment: {
        selectPaymentMethod: "اختر طريقة الدفع",
        paymentMethods: {
          card: "بطاقة ائتمان/خصم",
          mada: "بطاقة مدى",
          stcPay: "STC Pay",
          bankTransfer: "تحويل بنكي (سداد)",
          applePay: "Apple Pay"
        },
        cardDetails: "تفاصيل البطاقة",
        cardNumber: "رقم البطاقة",
        expiryDate: "تاريخ الانتهاء",
        cvv: "رمز الأمان",
        cardholderName: "اسم حامل البطاقة",
        mobileNumber: "رقم الجوال",
        selectBank: "اختر البنك",
        total: "المجموع",
        subtotal: "المجموع الفرعي",
        processingFee: "رسوم المعالجة",
        paySecurely: "ادفع بأمان",
        securedBy: "محمي بواسطة بوابة الدفع NCQ",
        ncqBankAccount: "جميع المدفوعات تُحول إلى حساب بنك NCQ"
      },
      billing: {
        title: "الفوترة والاشتراك",
        subtitle: "إدارة اشتراكك وطرق الدفع",
        currentPlan: {
          title: "الخطة الحالية",
          subtitle: "تفاصيل اشتراكك النشط"
        },
        paymentMethods: {
          title: "طرق الدفع",
          subtitle: "إدارة طرق الدفع المحفوظة",
          add: "إضافة طريقة دفع"
        },
        invoices: {
          title: "سجل الفواتير",
          subtitle: "تحميل فواتيرك السابقة",
          date: "التاريخ",
          amount: "المبلغ",
          status: "الحالة",
          actions: "الإجراءات"
        },
        plan: "الخطة",
        status: "الحالة",
        active: "نشط",
        nextBilling: "الفوترة التالية",
        features: "المميزات",
        perMonth: "شهرياً",
        expires: "ينتهي في",
        default: "افتراضي",
        remove: "إزالة",
        paid: "مدفوع",
        download: "تحميل",
        plans: {
          title: "الخطط المتاحة"
        },
        month: "شهر",
        currentPlan: "الخطة الحالية",
        upgrade: "ترقية"
      }
    },
    languages: {
      en: "English",
      ar: "العربية"
    },
    hero: {
      title: "الذكاء الاصطناعي متعدد الوسائط لكل تطبيق",
      subtitle: "معالجة النصوص والصور والصوت والمستندات باستخدام نماذج الذكاء الاصطناعي الأكثر تطوراً. واجهة برمجية واحدة لجميع احتياجاتك من الذكاء الاصطناعي.",
      tryNow: "جربه الآن",
      selectModel: "اختر النموذج",
      generateResponse: "توليد الاستجابة",
      addFiles: "إضافة ملفات"
    },
    models: {
      text: {
        name: "نص",
        description: "محادثة، تلخيص، تحليل"
      },
      image: {
        name: "صور", 
        description: "فهم وتوليد"
      },
      audio: {
        name: "صوت",
        description: "نسخ وتركيب"
      },
      document: {
        name: "مستندات",
        description: "استخراج ومعالجة"
      }
    },
    modelSelection: {
      title: "النماذج المتاحة",
      llava: "LLaVA - الرؤية واللغة",
      whisper: "Whisper - التعرف على الكلام",
      llama: "LLaMA 2 - توليد النص",
      claude: "Claude - الاستدلال المتقدم",
      gpt4: "GPT-4 - الأغراض العامة",
      custom: "نموذج مخصص مدرب"
    }
  }
}