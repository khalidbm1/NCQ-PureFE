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
    arabic: 'العربية'
  },

  // Authentication
  auth: {
    login: 'Login',
    loginTitle: 'Admin Login',
    loginSubtitle: 'Access your NCQ Platform admin dashboard',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    loginError: 'Invalid email or password',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to logout?',
    sessionExpired: 'Your session has expired. Please login again.',
    unauthorized: 'Unauthorized access'
  },

  // Sidebar Navigation
  sidebar: {
    dashboard: 'Dashboard',
    users: 'Users',
    analytics: 'Analytics',
    billing: 'Billing',
    products: {
      title: 'Products',
      paymentGateway: 'Payment Gateway',
      hospitalManagement: 'Hospital Management',
      blockchain: 'Blockchain Medical',
      iot: 'IoT Platform',
      hospitality: 'Smart Hospitality'
    },
    settings: {
      title: 'Settings',
      general: 'General',
      security: 'Security',
      notifications: 'Notifications',
      api: 'API Management',
      audit: 'Audit Logs'
    },
    support: {
      title: 'Support',
      tickets: 'Tickets',
      documentation: 'Documentation',
      help: 'Help Center'
    }
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back, {{name}}!',
    overview: 'Platform Overview',
    stats: {
      totalUsers: 'Total Users',
      activeSubscriptions: 'Active Subscriptions',
      monthlyRevenue: 'Monthly Revenue',
      systemHealth: 'System Health'
    },
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    charts: {
      userGrowth: 'User Growth',
      revenueOverTime: 'Revenue Over Time',
      productUsage: 'Product Usage',
      systemMetrics: 'System Metrics'
    },
    filters: {
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      quarter: 'This Quarter',
      year: 'This Year',
      custom: 'Custom Range'
    }
  },

  // Users Management
  users: {
    title: 'Users Management',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    newUsers: 'New Users',
    searchPlaceholder: 'Search users by name, email, or ID...',
    filters: {
      all: 'All Users',
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      suspended: 'Suspended'
    },
    table: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      subscription: 'Subscription',
      lastActive: 'Last Active',
      dateJoined: 'Date Joined',
      status: 'Status',
      actions: 'Actions'
    },
    actions: {
      view: 'View Details',
      edit: 'Edit User',
      suspend: 'Suspend',
      activate: 'Activate',
      delete: 'Delete',
      resetPassword: 'Reset Password',
      sendEmail: 'Send Email',
      viewActivity: 'View Activity'
    },
    roles: {
      admin: 'Admin',
      user: 'User',
      moderator: 'Moderator',
      viewer: 'Viewer'
    },
    createUser: 'Create User',
    editUser: 'Edit User',
    userDetails: 'User Details',
    confirmDelete: 'Are you sure you want to delete this user?',
    confirmSuspend: 'Are you sure you want to suspend this user?',
    userCreated: 'User created successfully',
    userUpdated: 'User updated successfully',
    userDeleted: 'User deleted successfully'
  },

  // Analytics
  analytics: {
    title: 'Analytics',
    overview: 'Analytics Overview',
    metrics: {
      pageViews: 'Page Views',
      uniqueVisitors: 'Unique Visitors',
      bounceRate: 'Bounce Rate',
      avgSessionDuration: 'Avg. Session Duration',
      conversionRate: 'Conversion Rate',
      activeUsers: 'Active Users'
    },
    charts: {
      traffic: 'Traffic Overview',
      userEngagement: 'User Engagement',
      deviceBreakdown: 'Device Breakdown',
      geographicDistribution: 'Geographic Distribution',
      topPages: 'Top Pages',
      referralSources: 'Referral Sources'
    },
    export: {
      title: 'Export Analytics',
      format: 'Format',
      dateRange: 'Date Range',
      pdf: 'PDF Report',
      excel: 'Excel Spreadsheet',
      csv: 'CSV File'
    }
  },

  // Billing
  billing: {
    title: 'Billing & Subscriptions',
    revenue: {
      title: 'Revenue Overview',
      total: 'Total Revenue',
      recurring: 'Recurring Revenue',
      oneTime: 'One-time Revenue',
      pending: 'Pending Payments'
    },
    subscriptions: {
      title: 'Subscription Management',
      active: 'Active Subscriptions',
      trial: 'Trial Users',
      expired: 'Expired',
      cancelled: 'Cancelled'
    },
    transactions: {
      title: 'Recent Transactions',
      id: 'Transaction ID',
      user: 'User',
      amount: 'Amount',
      status: 'Status',
      date: 'Date',
      method: 'Payment Method',
      invoice: 'Invoice'
    },
    plans: {
      title: 'Subscription Plans',
      starter: 'Starter',
      professional: 'Professional',
      enterprise: 'Enterprise',
      custom: 'Custom',
      features: 'Features',
      price: 'Price',
      billing: 'Billing',
      monthly: 'Monthly',
      yearly: 'Yearly',
      users: 'Users',
      storage: 'Storage',
      support: 'Support'
    },
    actions: {
      viewInvoice: 'View Invoice',
      downloadInvoice: 'Download Invoice',
      refund: 'Refund',
      cancelSubscription: 'Cancel Subscription',
      upgradeSubscription: 'Upgrade Subscription'
    }
  },

  // Settings
  settings: {
    title: 'Settings',
    general: {
      title: 'General Settings',
      companyName: 'Company Name',
      companyEmail: 'Company Email',
      timezone: 'Timezone',
      currency: 'Currency',
      dateFormat: 'Date Format',
      language: 'Language',
      theme: 'Theme'
    },
    security: {
      title: 'Security Settings',
      twoFactor: 'Two-Factor Authentication',
      sessions: 'Active Sessions',
      apiKeys: 'API Keys',
      ipWhitelist: 'IP Whitelist',
      passwordPolicy: 'Password Policy',
      loginAttempts: 'Max Login Attempts',
      sessionTimeout: 'Session Timeout'
    },
    notifications: {
      title: 'Notification Settings',
      email: 'Email Notifications',
      push: 'Push Notifications',
      sms: 'SMS Notifications',
      events: {
        newUser: 'New User Registration',
        payment: 'Payment Received',
        error: 'System Errors',
        security: 'Security Alerts'
      }
    },
    api: {
      title: 'API Management',
      keys: 'API Keys',
      createKey: 'Create API Key',
      keyName: 'Key Name',
      permissions: 'Permissions',
      rateLimit: 'Rate Limit',
      expiresAt: 'Expires At',
      lastUsed: 'Last Used',
      revoke: 'Revoke',
      documentation: 'API Documentation'
    },
    audit: {
      title: 'Audit Logs',
      user: 'User',
      action: 'Action',
      resource: 'Resource',
      timestamp: 'Timestamp',
      ip: 'IP Address',
      userAgent: 'User Agent',
      details: 'Details',
      filters: {
        allActions: 'All Actions',
        create: 'Create',
        update: 'Update',
        delete: 'Delete',
        login: 'Login',
        logout: 'Logout'
      }
    }
  },

  // Support
  support: {
    tickets: {
      title: 'Support Tickets',
      id: 'Ticket ID',
      subject: 'Subject',
      status: 'Status',
      priority: 'Priority',
      category: 'Category',
      createdBy: 'Created By',
      assignedTo: 'Assigned To',
      created: 'Created',
      updated: 'Last Updated',
      statuses: {
        open: 'Open',
        pending: 'Pending',
        resolved: 'Resolved',
        closed: 'Closed'
      },
      priorities: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent'
      },
      categories: {
        technical: 'Technical',
        billing: 'Billing',
        general: 'General',
        feature: 'Feature Request'
      },
      actions: {
        view: 'View Ticket',
        reply: 'Reply',
        assign: 'Assign',
        close: 'Close',
        reopen: 'Reopen'
      }
    }
  },

  // Products
  products: {
    paymentGateway: {
      title: 'Payment Gateway',
      transactions: 'Transactions',
      volume: 'Transaction Volume',
      successRate: 'Success Rate',
      failedTransactions: 'Failed Transactions',
      refunds: 'Refunds',
      disputes: 'Disputes'
    },
    hospitalManagement: {
      title: 'Hospital Management',
      hospitals: 'Hospitals',
      clinics: 'Clinics',
      patients: 'Patients',
      appointments: 'Appointments',
      doctors: 'Doctors',
      records: 'Medical Records'
    },
    blockchain: {
      title: 'Blockchain Medical Records',
      records: 'Records',
      institutions: 'Institutions',
      verifications: 'Verifications',
      accessLogs: 'Access Logs',
      consents: 'Consents'
    },
    iot: {
      title: 'IoT Platform',
      devices: 'Connected Devices',
      dataPoints: 'Data Points',
      alerts: 'Alerts',
      automations: 'Automations',
      uptime: 'Average Uptime'
    },
    hospitality: {
      title: 'Smart Hospitality',
      hotels: 'Hotels',
      rooms: 'Rooms',
      bookings: 'Bookings',
      occupancy: 'Occupancy Rate',
      revenue: 'Revenue',
      guestSatisfaction: 'Guest Satisfaction'
    }
  },

  // Modals & Alerts
  modals: {
    confirm: {
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed?'
    },
    delete: {
      title: 'Delete Confirmation',
      message: 'This action cannot be undone. Are you sure?'
    },
    success: {
      title: 'Success',
      message: 'Operation completed successfully'
    },
    error: {
      title: 'Error',
      message: 'An error occurred. Please try again.'
    }
  },

  // Footer
  footer: {
    copyright: '© 2024 NCQ Platform. All rights reserved.',
    version: 'Version {{version}}',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    contact: 'Contact Support'
  }
}