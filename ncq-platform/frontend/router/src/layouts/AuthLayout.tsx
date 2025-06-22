import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Moon, Sun, Globe } from 'lucide-react'
import { Button } from '@ncq/design-system/components/Button'
import { routePaths } from '../router/AppRouter'

export function AuthLayout() {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()

  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        {/* Theme and language toggles */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Globe className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to={routePaths.home} className="inline-flex items-center gap-3">
              <img src="/logo.svg" alt="NCQ" className="h-12 w-12" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                NCQ Platform
              </span>
            </Link>
          </div>

          {/* Auth content */}
          <React.Suspense 
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ncq-primary-600"></div>
              </div>
            }
          >
            <Outlet />
          </React.Suspense>

          {/* Footer links */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center gap-4">
              <a href="/privacy" className="hover:text-gray-900 dark:hover:text-white">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-gray-900 dark:hover:text-white">
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
              </a>
              <span>•</span>
              <a href="/support" className="hover:text-gray-900 dark:hover:text-white">
                {language === 'ar' ? 'الدعم' : 'Support'}
              </a>
            </div>
            <div className="mt-4">
              © 2024 NCQ. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Feature showcase */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-ncq-primary-500 to-ncq-primary-700 dark:from-ncq-primary-600 dark:to-ncq-primary-800">
        <div className="flex flex-col justify-center px-12 text-white">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-6">
              {language === 'ar' 
                ? 'مرحباً بك في منصة NCQ' 
                : 'Welcome to NCQ Platform'
              }
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {language === 'ar' ? 'أداء فائق' : 'Lightning Fast'}
                  </h3>
                  <p className="text-white/80">
                    {language === 'ar' 
                      ? 'استمتع بأداء استثنائي مع بنية تحتية محسّنة للسرعة'
                      : 'Experience exceptional performance with our optimized infrastructure'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {language === 'ar' ? 'أمان متقدم' : 'Enterprise Security'}
                  </h3>
                  <p className="text-white/80">
                    {language === 'ar' 
                      ? 'حماية بياناتك بأحدث معايير الأمان العالمية'
                      : 'Your data is protected with industry-leading security standards'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {language === 'ar' ? 'تكامل عالمي' : 'Global Integration'}
                  </h3>
                  <p className="text-white/80">
                    {language === 'ar' 
                      ? 'تكامل سلس مع جميع الأنظمة والخدمات العالمية'
                      : 'Seamlessly integrate with all your favorite tools and services'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-white/70">
                  {language === 'ar' ? 'وقت التشغيل' : 'Uptime'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-white/70">
                  {language === 'ar' ? 'المستخدمين' : 'Users'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/70">
                  {language === 'ar' ? 'الدعم' : 'Support'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}