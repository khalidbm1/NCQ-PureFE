import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { MerchantLayout } from '@/components/layout/MerchantLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NCQ Payment Gateway - Merchant Portal',
  description: 'Manage your payments, view analytics, and integrate with NCQ Payment Gateway',
  keywords: 'payment gateway, merchant portal, saudi arabia, ncq, payment processing, analytics',
  authors: [{ name: 'NCQ Technologies' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <MerchantLayout>
            {children}
          </MerchantLayout>
        </Providers>
      </body>
    </html>
  )
}