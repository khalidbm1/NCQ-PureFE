import { useTheme } from '../contexts/ThemeContext';

// Translation keys and their values in English and Arabic
const translations = {
  en: {
    // Common
    common: {
      search: 'Search...',
      settings: 'Settings',
      logout: 'Logout',
      profile: 'Profile',
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
    },
    // Navigation
    navigation: {
      dashboard: 'Dashboard',
      patients: 'Patients',
      appointments: 'Appointments',
      doctors: 'Doctors',
      staff: 'Staff Management',
      medicalRecords: 'Medical Records',
      prescriptions: 'Prescriptions',
      labTests: 'Lab Tests',
      billing: 'Billing',
      insurance: 'Insurance',
      inventory: 'Inventory',
      reports: 'Reports',
      subscription: 'Subscription',
      settings: 'Settings',
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome back',
      todayAppointments: "Today's Appointments",
      totalPatients: 'Total Patients',
      activeDoctors: 'Active Doctors',
      pendingBills: 'Pending Bills',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      newPatient: 'New Patient',
      newAppointment: 'New Appointment',
      viewReports: 'View Reports',
    },
    // Patients
    patients: {
      title: 'Patients',
      addPatient: 'Add Patient',
      searchPatients: 'Search patients...',
      patientId: 'Patient ID',
      name: 'Name',
      age: 'Age',
      gender: 'Gender',
      phone: 'Phone',
      email: 'Email',
      lastVisit: 'Last Visit',
      actions: 'Actions',
    },
  },
  ar: {
    // Common
    common: {
      search: 'بحث...',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
      language: 'اللغة',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      close: 'إغلاق',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
      warning: 'تحذير',
      info: 'معلومات',
    },
    // Navigation
    navigation: {
      dashboard: 'لوحة التحكم',
      patients: 'المرضى',
      appointments: 'المواعيد',
      doctors: 'الأطباء',
      staff: 'إدارة الموظفين',
      medicalRecords: 'السجلات الطبية',
      prescriptions: 'الوصفات الطبية',
      labTests: 'التحاليل المخبرية',
      billing: 'الفواتير',
      insurance: 'التأمين',
      inventory: 'المخزون',
      reports: 'التقارير',
      subscription: 'الاشتراك',
      settings: 'الإعدادات',
    },
    // Dashboard
    dashboard: {
      welcome: 'مرحباً بعودتك',
      todayAppointments: 'مواعيد اليوم',
      totalPatients: 'إجمالي المرضى',
      activeDoctors: 'الأطباء النشطون',
      pendingBills: 'الفواتير المعلقة',
      recentActivity: 'النشاط الأخير',
      quickActions: 'إجراءات سريعة',
      newPatient: 'مريض جديد',
      newAppointment: 'موعد جديد',
      viewReports: 'عرض التقارير',
    },
    // Patients
    patients: {
      title: 'المرضى',
      addPatient: 'إضافة مريض',
      searchPatients: 'البحث عن المرضى...',
      patientId: 'رقم المريض',
      name: 'الاسم',
      age: 'العمر',
      gender: 'الجنس',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      lastVisit: 'آخر زيارة',
      actions: 'الإجراءات',
    },
  },
};

export const useTranslation = () => {
  const { language } = useTheme();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};