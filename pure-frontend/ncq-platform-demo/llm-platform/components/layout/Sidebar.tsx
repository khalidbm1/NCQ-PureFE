import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Brain,
  Home,
  Key,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  FileText,
  Code,
  Database,
  Sparkles,
  Shield,
  ChevronDown,
  ChevronRight,
  Layers,
  MessageSquare,
  Activity,
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  language?: string
}

interface MenuItem {
  id: string
  label: string
  labelAr: string
  icon: React.ElementType
  href?: string
  children?: MenuItem[]
}

export function Sidebar({ isOpen, onClose, language = 'en' }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['models'])

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      icon: Home,
      href: '/dashboard'
    },
    {
      id: 'models',
      label: 'AI Models',
      labelAr: 'نماذج الذكاء الاصطناعي',
      icon: Brain,
      children: [
        {
          id: 'models-list',
          label: 'Available Models',
          labelAr: 'النماذج المتاحة',
          icon: Layers,
          href: '/dashboard/models'
        },
        {
          id: 'fine-tuning',
          label: 'Fine-tuning',
          labelAr: 'التدريب المخصص',
          icon: Sparkles,
          href: '/dashboard/fine-tuning'
        },
        {
          id: 'sandbox',
          label: 'Sandbox',
          labelAr: 'بيئة التجربة',
          icon: Code,
          href: '/dashboard/sandbox'
        }
      ]
    },
    {
      id: 'api-keys',
      label: 'API Keys',
      labelAr: 'مفاتيح API',
      icon: Key,
      href: '/dashboard/api-keys'
    },
    {
      id: 'usage',
      label: 'Usage & Analytics',
      labelAr: 'الاستخدام والتحليلات',
      icon: BarChart3,
      children: [
        {
          id: 'usage-overview',
          label: 'Overview',
          labelAr: 'نظرة عامة',
          icon: Activity,
          href: '/dashboard/usage'
        },
        {
          id: 'cost-analytics',
          label: 'Cost Analytics',
          labelAr: 'تحليل التكاليف',
          icon: DollarSign,
          href: '/dashboard/cost-analytics'
        }
      ]
    },
    {
      id: 'organization',
      label: 'Organization',
      labelAr: 'المنظمة',
      icon: Users,
      children: [
        {
          id: 'team',
          label: 'Team Members',
          labelAr: 'أعضاء الفريق',
          icon: Users,
          href: '/dashboard/team'
        },
        {
          id: 'org-billing',
          label: 'Billing',
          labelAr: 'الفوترة',
          icon: CreditCard,
          href: '/dashboard/billing'
        },
        {
          id: 'org-settings',
          label: 'Settings',
          labelAr: 'الإعدادات',
          icon: Settings,
          href: '/dashboard/organization/settings'
        }
      ]
    },
    {
      id: 'documentation',
      label: 'Documentation',
      labelAr: 'الوثائق',
      icon: FileText,
      href: '/docs'
    },
    {
      id: 'security',
      label: 'Security',
      labelAr: 'الأمان',
      icon: Shield,
      href: '/dashboard/security'
    },
    {
      id: 'settings',
      label: 'Settings',
      labelAr: 'الإعدادات',
      icon: Settings,
      href: '/dashboard/settings'
    }
  ]

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    if (onClose) onClose()
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isActive = pathname === item.href
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0
    const Icon = item.icon

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else if (item.href) {
              handleNavigation(item.href)
            }
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
            depth > 0 && "ml-6"
          )}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-left">
            {language === 'ar' ? item.labelAr : item.label}
          </span>
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </button>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1"
          >
            {item.children.map(child => renderMenuItem(child, depth + 1))}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">NCQ LLM</span>
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'هل تحتاج إلى مساعدة؟' : 'Need help?'}
              </p>
              <button className="text-sm font-medium text-primary hover:text-primary/80">
                {language === 'ar' ? 'تواصل مع الدعم' : 'Contact Support'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}