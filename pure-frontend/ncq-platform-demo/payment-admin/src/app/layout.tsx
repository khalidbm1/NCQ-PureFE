import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { AdminLayout } from '@/components/layout/AdminLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NCQ Payment Gateway Admin Portal',
  description: 'Comprehensive administrative interface for NCQ Payment Gateway management',
  keywords: 'payment gateway, admin portal, saudi arabia, ncq, payment processing',
  authors: [{ name: 'NCQ Technologies' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  robots: 'noindex, nofollow', // Admin portal should not be indexed
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
          <AdminLayout>
            {children}
          </AdminLayout>
        </Providers>
      </body>
    </html>
  )
}