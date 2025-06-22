import { Header } from './components/Header'
import { Hero } from './sections/Hero'
import { Products } from './sections/Products'
import { ProductsDemo } from './sections/ProductsDemo'
import { Features } from './sections/Features'
import { Services } from './sections/Services'
import { Pricing } from './sections/Pricing'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { QuickAccess } from './sections/QuickAccess'
import { About } from './sections/About'
import './i18n/config'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function App() {
  const { i18n } = useTranslation()
  const isDemoMode = window.location.search.includes('demo=true') || localStorage.getItem('demoMode') === 'true'

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <QuickAccess />
      {isDemoMode ? <ProductsDemo /> : <Products />}
      <Features />
      <Services />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}

export default App