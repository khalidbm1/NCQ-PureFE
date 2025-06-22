'use client'

import { useI18n } from '@/lib/i18n/useTranslation'
import Currency from '@/components/ui/Currency'

export default function TestPage() {
  const { t, language, setLanguage } = useI18n()
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Currency Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Language Selector</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-4 py-2 rounded ${language === 'ar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              العربية
            </button>
          </div>
          <p className="mt-4">Current language: {language}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Currency Display Tests</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Basic Plan Price:</p>
              <p className="text-2xl font-bold">
                <Currency amount={37} />
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Premium Plan Price:</p>
              <p className="text-2xl font-bold">
                <Currency amount={94} />
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Scale Plan Price:</p>
              <p className="text-2xl font-bold">
                <Currency amount={281.50} />
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Large Amount:</p>
              <p className="text-2xl font-bold">
                <Currency amount={1234567.89} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}