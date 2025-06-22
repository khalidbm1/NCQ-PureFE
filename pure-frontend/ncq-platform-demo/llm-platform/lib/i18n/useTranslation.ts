'use client'

import { create } from 'zustand'
import { translations } from './translations'

type Language = 'en' | 'ar'

interface I18nStore {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const useI18n = create<I18nStore>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const { language } = get()
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }
}))