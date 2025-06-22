import { Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  const footerLinks = {
    products: [
      { name: t('footer.products.payment'), href: '#' },
      { name: t('footer.products.blockchain'), href: '#' },
      { name: t('footer.products.hospital'), href: '#' },
      { name: t('footer.products.iot'), href: '#' },
      { name: t('footer.products.hospitality'), href: '#' },
      { name: t('footer.products.llm'), href: '#' },
    ],
    company: [
      { name: t('footer.company.about'), href: '#about' },
      { name: t('footer.company.careers'), href: '#' },
      { name: t('footer.company.press'), href: '#' },
      { name: t('footer.company.blog'), href: '#' },
      { name: t('footer.company.contact'), href: '#contact' },
    ],
    resources: [
      { name: t('footer.resources.docs'), href: '#' },
      { name: t('footer.resources.api'), href: '#' },
      { name: t('footer.resources.guides'), href: '#' },
      { name: t('footer.resources.community'), href: '#' },
      { name: t('footer.resources.support'), href: '#' },
    ],
    legal: [
      { name: t('footer.legal.privacy'), href: '#' },
      { name: t('footer.legal.terms'), href: '#' },
      { name: t('footer.legal.security'), href: '#' },
      { name: t('footer.legal.compliance'), href: '#' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'YouTube', href: '#' },
  ]
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">NCQ Platform</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.products.title')}</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.company.title')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.resources.title')}</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.legal.title')}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with ❤️ in Saudi Arabia</span>
              <div className="flex items-center space-x-2">
                <img
                  src="https://flagcdn.com/w40/sa.png"
                  alt="Saudi Arabia Flag"
                  className="w-6 h-4"
                />
                <span className="text-gray-400 text-sm">🇸🇦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}