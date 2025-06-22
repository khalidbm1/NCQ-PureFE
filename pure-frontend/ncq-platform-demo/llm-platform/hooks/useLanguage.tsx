import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageStore {
  language: 'en' | 'ar'
  setLanguage: (lang: 'en' | 'ar') => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    'search': 'Search models, APIs...',
    'notifications.title': 'Notifications',
    'notifications.viewAll': 'View all notifications',
    'notifications.newModel': 'New AI model deployed',
    'notifications.rateLimit': 'API rate limit warning',
    'notifications.trainingComplete': 'Training completed',
    'user.name': 'John Doe',
    'user.role': 'Administrator',
    'menu.profile': 'Profile',
    'menu.settings': 'Settings',
    'menu.logout': 'Logout',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.models': 'AI Models',
    'sidebar.availableModels': 'Available Models',
    'sidebar.fineTuning': 'Fine-tuning',
    'sidebar.sandbox': 'Sandbox',
    'sidebar.apiKeys': 'API Keys',
    'sidebar.usage': 'Usage & Analytics',
    'sidebar.overview': 'Overview',
    'sidebar.costAnalytics': 'Cost Analytics',
    'sidebar.organization': 'Organization',
    'sidebar.team': 'Team Members',
    'sidebar.billing': 'Billing',
    'sidebar.documentation': 'Documentation',
    'sidebar.security': 'Security',
    'sidebar.needHelp': 'Need help?',
    'sidebar.contactSupport': 'Contact Support',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Overview',
    'dashboard.tokensUsed': 'Tokens Used',
    'dashboard.apiCalls': 'API Calls',
    'dashboard.activeModels': 'Active Models',
    'dashboard.totalCost': 'Total Cost',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.createApiKey': 'Create API Key',
    'dashboard.deployModel': 'Deploy Model',
    'dashboard.viewDocs': 'View Documentation',
    'dashboard.inviteTeam': 'Invite Team Member',
  },
  ar: {
    // Header
    'search': 'البحث عن النماذج، واجهات برمجة التطبيقات...',
    'notifications.title': 'الإشعارات',
    'notifications.viewAll': 'عرض جميع الإشعارات',
    'notifications.newModel': 'تم نشر نموذج ذكاء اصطناعي جديد',
    'notifications.rateLimit': 'تحذير من حد معدل واجهة برمجة التطبيقات',
    'notifications.trainingComplete': 'اكتمل التدريب',
    'user.name': 'جون دو',
    'user.role': 'مسؤول',
    'menu.profile': 'الملف الشخصي',
    'menu.settings': 'الإعدادات',
    'menu.logout': 'تسجيل الخروج',
    
    // Sidebar
    'sidebar.dashboard': 'لوحة التحكم',
    'sidebar.models': 'نماذج الذكاء الاصطناعي',
    'sidebar.availableModels': 'النماذج المتاحة',
    'sidebar.fineTuning': 'التدريب المخصص',
    'sidebar.sandbox': 'بيئة التجربة',
    'sidebar.apiKeys': 'مفاتيح API',
    'sidebar.usage': 'الاستخدام والتحليلات',
    'sidebar.overview': 'نظرة عامة',
    'sidebar.costAnalytics': 'تحليل التكاليف',
    'sidebar.organization': 'المنظمة',
    'sidebar.team': 'أعضاء الفريق',
    'sidebar.billing': 'الفوترة',
    'sidebar.documentation': 'الوثائق',
    'sidebar.security': 'الأمان',
    'sidebar.needHelp': 'هل تحتاج إلى مساعدة؟',
    'sidebar.contactSupport': 'تواصل مع الدعم',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بعودتك',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.tokensUsed': 'الرموز المستخدمة',
    'dashboard.apiCalls': 'استدعاءات API',
    'dashboard.activeModels': 'النماذج النشطة',
    'dashboard.totalCost': 'التكلفة الإجمالية',
    'dashboard.recentActivity': 'النشاط الأخير',
    'dashboard.quickActions': 'إجراءات سريعة',
    'dashboard.createApiKey': 'إنشاء مفتاح API',
    'dashboard.deployModel': 'نشر نموذج',
    'dashboard.viewDocs': 'عرض الوثائق',
    'dashboard.inviteTeam': 'دعوة عضو فريق',
  }
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = lang
        set({ language: lang })
      },
      toggleLanguage: () => {
        const newLang = get().language === 'en' ? 'ar' : 'en'
        get().setLanguage(newLang)
      },
      t: (key) => {
        const lang = get().language
        const keys = key.split('.')
        let value: any = translations[lang]
        
        for (const k of keys) {
          value = value?.[k]
        }
        
        return value || key
      }
    }),
    {
      name: 'language-storage',
    }
  )
)