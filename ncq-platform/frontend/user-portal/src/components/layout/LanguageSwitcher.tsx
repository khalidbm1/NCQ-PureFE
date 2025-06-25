import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lng
  }

  return (
    <select
      id="language-switcher"
      name="language"
      aria-label="Language"
      onChange={(e) => changeLanguage(e.target.value)}
      value={i18n.language}
      className="rounded-md border border-input bg-background px-2 py-1 text-sm"
    >
      <option value="en">EN</option>
      <option value="ar">AR</option>
    </select>
  )
}
