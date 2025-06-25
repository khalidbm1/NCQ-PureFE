import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        dashboard: 'Dashboard',
        files: 'My Files',
        upload: 'Upload',
        analytics: 'Analytics',
        smartBuildings: 'Smart Buildings',
        billing: 'Billing',
        apiKeys: 'API Keys',
        team: 'Team',
        settings: 'Settings',
        help: 'Help',
        logout: 'Logout',
        language: 'Language',
        welcome: 'Welcome back',
        search: 'Search...',
        notifications: 'Notifications',
        profile: 'Profile',
      },
      dashboard: {
        title: 'Dashboard',
        subtitle: 'Overview of your account activity',
        totalFiles: 'Total Files',
        storageUsed: 'Storage Used',
        activeProjects: 'Active Projects',
        teamMembers: 'Team Members',
        recentActivity: 'Recent Activity',
      },
      smartBuildings: {
        title: 'Smart Buildings',
        subtitle: 'Intelligent building management and automation platform',
        addBuilding: 'Add Building',
        activeBuildings: 'Active Buildings',
        energySavings: 'Energy Savings',
        connectedDevices: 'Connected Devices',
        activeAlerts: 'Active Alerts',
        buildingPortfolio: 'Building Portfolio',
        systemHealth: 'System Health',
        resourceUsage: 'Resource Usage',
      },
    },
  },
  ar: {
    translation: {
      common: {
        dashboard: 'لوحة التحكم',
        files: 'ملفاتي',
        upload: 'رفع',
        analytics: 'التحليلات',
        smartBuildings: 'المباني الذكية',
        billing: 'الفواتير',
        apiKeys: 'مفاتيح API',
        team: 'الفريق',
        settings: 'الإعدادات',
        help: 'المساعدة',
        logout: 'تسجيل الخروج',
        language: 'اللغة',
        welcome: 'مرحباً بعودتك',
        search: 'بحث...',
        notifications: 'الإشعارات',
        profile: 'الملف الشخصي',
      },
      dashboard: {
        title: 'لوحة التحكم',
        subtitle: 'نظرة عامة على نشاط حسابك',
        totalFiles: 'إجمالي الملفات',
        storageUsed: 'المساحة المستخدمة',
        activeProjects: 'المشاريع النشطة',
        teamMembers: 'أعضاء الفريق',
        recentActivity: 'النشاط الأخير',
      },
      smartBuildings: {
        title: 'المباني الذكية',
        subtitle: 'منصة إدارة وأتمتة المباني الذكية',
        addBuilding: 'إضافة مبنى',
        activeBuildings: 'المباني النشطة',
        energySavings: 'توفير الطاقة',
        connectedDevices: 'الأجهزة المتصلة',
        activeAlerts: 'التنبيهات النشطة',
        buildingPortfolio: 'محفظة المباني',
        systemHealth: 'صحة النظام',
        resourceUsage: 'استخدام الموارد',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;