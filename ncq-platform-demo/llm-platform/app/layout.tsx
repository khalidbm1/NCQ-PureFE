import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NCQ LLM Platform',
  description: 'Multi-tenant LLM platform with learning capabilities',
  keywords: ['LLM', 'AI', 'Machine Learning', 'Natural Language Processing'],
  authors: [{ name: 'NCQ Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://llm.ncq.com',
    siteName: 'NCQ LLM Platform',
    title: 'NCQ LLM Platform',
    description: 'Enterprise-grade multi-tenant LLM platform',
    images: [
      {
        url: 'https://llm.ncq.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NCQ LLM Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NCQ LLM Platform',
    description: 'Enterprise-grade multi-tenant LLM platform',
    images: ['https://llm.ncq.com/og-image.png'],
    creator: '@ncq_platform',
  },
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
          {children}
          <Toaster />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}