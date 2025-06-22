import Image from 'next/image'
import { useI18n } from '@/lib/i18n/useTranslation'

interface CurrencyProps {
  amount: string | number
  currency?: 'SAR' | 'USD'
  showSymbol?: boolean
  className?: string
  symbolClassName?: string
  showCurrencyCode?: boolean
}

export default function Currency({ 
  amount, 
  currency = 'SAR',
  showSymbol = true,
  className = '',
  symbolClassName = 'w-4 h-4',
  showCurrencyCode = false
}: CurrencyProps) {
  const { language } = useI18n()
  const isArabic = language === 'ar'
  
  const formattedAmount = typeof amount === 'number' 
    ? new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US', {
        style: currency === 'SAR' ? 'currency' : 'decimal',
        currency: currency === 'SAR' ? 'SAR' : undefined,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    : amount

  if (!showSymbol && !showCurrencyCode) {
    return <span className={className}>{formattedAmount}</span>
  }

  if (currency === 'USD') {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        {!isArabic && showSymbol && <span>$</span>}
        <span>{typeof amount === 'number' ? amount.toFixed(2) : amount}</span>
        {isArabic && showSymbol && <span>$</span>}
        {showCurrencyCode && <span className="text-xs text-gray-500">USD</span>}
      </span>
    )
  }

  // SAR currency handling
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {isArabic ? (
        <>
          <span>{formattedAmount}</span>
          {showSymbol && (
            <Image 
              src="/images/Saudi_Riyal_Symbol-1.png" 
              alt="ر.س"
              width={16}
              height={16}
              className={symbolClassName}
              onError={(e) => {
                // Fallback to text if image fails
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling!.textContent = 'ر.س'
              }}
            />
          )}
          <span style={{ display: 'none' }}></span>
          {showCurrencyCode && <span className="text-xs text-gray-500">SAR</span>}
        </>
      ) : (
        <>
          {showSymbol && (
            <Image 
              src="/images/Saudi_Riyal_Symbol-1.png" 
              alt="SAR"
              width={16}
              height={16}
              className={symbolClassName}
              onError={(e) => {
                // Fallback to text if image fails
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling!.textContent = 'SAR'
              }}
            />
          )}
          <span style={{ display: 'none' }}></span>
          <span>{formattedAmount}</span>
          {showCurrencyCode && <span className="text-xs text-gray-500">SAR</span>}
        </>
      )}
    </span>
  )
}