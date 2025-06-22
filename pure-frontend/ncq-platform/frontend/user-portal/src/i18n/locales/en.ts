export default {
  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    actions: 'Actions',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    create: 'Create',
    update: 'Update',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    refresh: 'Refresh',
    reset: 'Reset',
    export: 'Export',
    import: 'Import',
    clear: 'Clear',
    apply: 'Apply',
    select: 'Select',
    selectAll: 'Select All',
    unselectAll: 'Unselect All',
    required: 'Required',
    optional: 'Optional',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    noData: 'No data available',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    newNotifications: '{{count}} new notifications',
    markAllRead: 'Mark all as read',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    home: 'Home',
    welcome: 'Welcome',
    welcomeBack: 'Welcome back',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    contactUs: 'Contact Us',
    help: 'Help',
    support: 'Support'
  },

  // Authentication
  auth: {
    login: 'Login',
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Access your NCQ Platform account',
    register: 'Register',
    registerTitle: 'Create Account',
    registerSubtitle: 'Join NCQ Platform today',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    companyName: 'Company Name',
    phoneNumber: 'Phone Number',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loginButton: 'Login',
    registerButton: 'Create Account',
    loggingIn: 'Logging in...',
    registering: 'Creating account...',
    loginError: 'Invalid email or password',
    registerError: 'Registration failed. Please try again.',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    sessionExpired: 'Your session has expired. Please login again.',
    unauthorized: 'Unauthorized access',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    orContinueWith: 'Or continue with',
    googleLogin: 'Continue with Google',
    termsAgreement: 'By creating an account, you agree to our',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy'
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    files: 'Files',
    payments: 'Payments',
    analytics: 'Analytics',
    settings: 'Settings',
    products: {
      title: 'Products',
      paymentGateway: 'Payment Gateway',
      hospitalManagement: 'Hospital Management'
    }
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    overview: 'Overview',
    welcomeMessage: 'Welcome back, {{name}}!',
    quickStats: 'Quick Stats',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    stats: {
      totalTransactions: 'Total Transactions',
      monthlyRevenue: 'Monthly Revenue',
      activeServices: 'Active Services',
      pendingTasks: 'Pending Tasks',
      storageUsed: 'Storage Used',
      apiCalls: 'API Calls'
    },
    charts: {
      revenueOverview: 'Revenue Overview',
      transactionVolume: 'Transaction Volume',
      serviceUsage: 'Service Usage',
      performanceMetrics: 'Performance Metrics'
    },
    activities: {
      paymentReceived: 'Payment received',
      fileUploaded: 'File uploaded',
      reportGenerated: 'Report generated',
      apiKeyCreated: 'API key created',
      settingsUpdated: 'Settings updated'
    },
    subscription: {
      title: 'Your Subscription',
      plan: 'Current Plan',
      usage: 'Usage',
      billing: 'Next Billing',
      upgrade: 'Upgrade Plan',
      manage: 'Manage Subscription'
    }
  },

  // Files
  files: {
    title: 'Files',
    myFiles: 'My Files',
    sharedWithMe: 'Shared with Me',
    recent: 'Recent',
    favorites: 'Favorites',
    trash: 'Trash',
    uploadFile: 'Upload File',
    uploadFolder: 'Upload Folder',
    newFolder: 'New Folder',
    searchPlaceholder: 'Search files...',
    sortBy: 'Sort by',
    view: 'View',
    gridView: 'Grid View',
    listView: 'List View',
    table: {
      name: 'Name',
      size: 'Size',
      type: 'Type',
      modified: 'Modified',
      owner: 'Owner',
      sharedWith: 'Shared With'
    },
    actions: {
      download: 'Download',
      share: 'Share',
      rename: 'Rename',
      move: 'Move',
      copy: 'Copy',
      delete: 'Delete',
      restore: 'Restore',
      preview: 'Preview',
      getLink: 'Get Link',
      properties: 'Properties'
    },
    empty: {
      title: 'No files yet',
      description: 'Upload your first file to get started',
      uploadButton: 'Upload File'
    },
    upload: {
      dragDrop: 'Drag and drop files here',
      or: 'or',
      browse: 'Browse Files',
      uploading: 'Uploading...',
      uploadComplete: 'Upload complete',
      uploadFailed: 'Upload failed'
    }
  },

  // Payments
  payments: {
    title: 'Payments',
    overview: 'Payment Overview',
    transactions: 'Transactions',
    invoices: 'Invoices',
    paymentMethods: 'Payment Methods',
    billingAddress: 'Billing Address',
    stats: {
      totalPaid: 'Total Paid',
      pending: 'Pending',
      lastPayment: 'Last Payment',
      nextPayment: 'Next Payment'
    },
    transaction: {
      id: 'Transaction ID',
      date: 'Date',
      amount: 'Amount',
      status: 'Status',
      method: 'Method',
      description: 'Description',
      invoice: 'Invoice',
      statuses: {
        completed: 'Completed',
        pending: 'Pending',
        failed: 'Failed',
        refunded: 'Refunded'
      }
    },
    invoice: {
      number: 'Invoice Number',
      date: 'Invoice Date',
      dueDate: 'Due Date',
      amount: 'Amount',
      status: 'Status',
      download: 'Download Invoice',
      pay: 'Pay Now',
      statuses: {
        paid: 'Paid',
        unpaid: 'Unpaid',
        overdue: 'Overdue',
        draft: 'Draft'
      }
    },
    methods: {
      addNew: 'Add Payment Method',
      card: 'Credit/Debit Card',
      bank: 'Bank Transfer',
      wallet: 'Digital Wallet',
      cardEnding: 'Card ending in {{last4}}',
      expires: 'Expires {{date}}',
      setDefault: 'Set as Default',
      remove: 'Remove'
    }
  },

  // Analytics
  analytics: {
    title: 'Analytics',
    overview: 'Analytics Overview',
    period: 'Period',
    compare: 'Compare',
    export: 'Export Data',
    metrics: {
      revenue: 'Revenue',
      transactions: 'Transactions',
      avgTransaction: 'Avg. Transaction',
      conversionRate: 'Conversion Rate',
      growthRate: 'Growth Rate',
      activeUsers: 'Active Users'
    },
    charts: {
      revenueByProduct: 'Revenue by Product',
      transactionsByStatus: 'Transactions by Status',
      geographicDistribution: 'Geographic Distribution',
      timeSeriesAnalysis: 'Time Series Analysis',
      topProducts: 'Top Products',
      userActivity: 'User Activity'
    },
    filters: {
      today: 'Today',
      yesterday: 'Yesterday',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      custom: 'Custom Range'
    }
  },

  // Settings
  settings: {
    title: 'Settings',
    tabs: {
      profile: 'Profile',
      security: 'Security',
      notifications: 'Notifications',
      api: 'API Keys',
      billing: 'Billing',
      preferences: 'Preferences'
    },
    profile: {
      title: 'Profile Settings',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company',
      jobTitle: 'Job Title',
      bio: 'Bio',
      avatar: 'Profile Picture',
      changeAvatar: 'Change Avatar',
      removeAvatar: 'Remove Avatar',
      saveChanges: 'Save Changes',
      changesSaved: 'Your changes have been saved'
    },
    security: {
      title: 'Security Settings',
      password: 'Password',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      passwordRequirements: 'Password must be at least 8 characters',
      twoFactor: 'Two-Factor Authentication',
      enable2FA: 'Enable 2FA',
      disable2FA: 'Disable 2FA',
      sessions: 'Active Sessions',
      currentSession: 'Current Session',
      terminateAll: 'Terminate All Other Sessions'
    },
    notifications: {
      title: 'Notification Preferences',
      email: 'Email Notifications',
      push: 'Push Notifications',
      sms: 'SMS Notifications',
      categories: {
        security: 'Security Alerts',
        transactions: 'Transaction Updates',
        marketing: 'Marketing & Promotions',
        product: 'Product Updates',
        account: 'Account Activity'
      },
      frequency: {
        realTime: 'Real-time',
        daily: 'Daily Digest',
        weekly: 'Weekly Summary',
        never: 'Never'
      }
    },
    api: {
      title: 'API Key Management',
      description: 'Manage your API keys for programmatic access',
      createKey: 'Create New Key',
      keyName: 'Key Name',
      permissions: 'Permissions',
      created: 'Created',
      lastUsed: 'Last Used',
      expires: 'Expires',
      actions: 'Actions',
      regenerate: 'Regenerate',
      revoke: 'Revoke',
      copyKey: 'Copy Key',
      keyCreated: 'API key created successfully',
      keyCopied: 'API key copied to clipboard'
    },
    billing: {
      title: 'Billing Settings',
      currentPlan: 'Current Plan',
      planDetails: 'Plan Details',
      changePlan: 'Change Plan',
      cancelPlan: 'Cancel Plan',
      paymentMethod: 'Payment Method',
      billingHistory: 'Billing History',
      downloadInvoices: 'Download Invoices',
      taxInfo: 'Tax Information',
      vatNumber: 'VAT Number',
      billingEmail: 'Billing Email'
    },
    preferences: {
      title: 'Preferences',
      language: 'Language',
      timezone: 'Timezone',
      dateFormat: 'Date Format',
      currency: 'Currency',
      theme: 'Theme',
      lightTheme: 'Light',
      darkTheme: 'Dark',
      systemTheme: 'System'
    }
  },

  // Products
  products: {
    paymentGateway: {
      title: 'Payment Gateway',
      description: 'Process payments securely and efficiently',
      features: {
        processing: 'Payment Processing',
        reports: 'Transaction Reports',
        refunds: 'Refund Management',
        disputes: 'Dispute Resolution',
        integration: 'API Integration'
      },
      stats: {
        processed: 'Processed Today',
        volume: 'Transaction Volume',
        successRate: 'Success Rate',
        avgTime: 'Avg. Processing Time'
      }
    },
    hospitalManagement: {
      title: 'Hospital Management',
      description: 'Complete healthcare facility management',
      modules: {
        patients: 'Patient Records',
        appointments: 'Appointments',
        billing: 'Medical Billing',
        inventory: 'Inventory',
        reports: 'Reports'
      },
      stats: {
        patients: 'Active Patients',
        appointments: "Today's Appointments",
        revenue: 'Monthly Revenue',
        occupancy: 'Bed Occupancy'
      }
    }
  },

  // Help & Support
  help: {
    title: 'Help & Support',
    searchPlaceholder: 'Search for help...',
    categories: {
      gettingStarted: 'Getting Started',
      account: 'Account & Billing',
      technical: 'Technical Support',
      api: 'API Documentation'
    },
    contactSupport: 'Contact Support',
    viewDocs: 'View Documentation',
    submitTicket: 'Submit a Ticket',
    faq: 'Frequently Asked Questions'
  },

  // Error Messages
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    notFound: 'Page not found',
    unauthorized: 'You are not authorized to access this resource',
    forbidden: 'Access forbidden',
    serverError: 'Server error. Please try again later.',
    validation: 'Please check your input and try again.'
  },

  // Success Messages
  success: {
    saved: 'Changes saved successfully',
    deleted: 'Deleted successfully',
    uploaded: 'File uploaded successfully',
    sent: 'Sent successfully',
    copied: 'Copied to clipboard'
  }
}