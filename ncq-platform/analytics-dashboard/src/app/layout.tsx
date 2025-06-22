import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'NCQ Analytics Dashboard - Business Intelligence Platform',
  description: 'Comprehensive analytics and business intelligence dashboard for the NCQ platform ecosystem',
  keywords: 'NCQ, analytics, business intelligence, dashboard, data visualization, metrics, KPI, Saudi Arabia',
  authors: [{ name: 'NCQ Analytics Team' }],
  openGraph: {
    title: 'NCQ Analytics Dashboard',
    description: 'Real-time analytics and business intelligence for NCQ platform services',
    type: 'website',
    url: 'https://analytics.ncq.sa',
    images: [
      {
        url: 'https://analytics.ncq.sa/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NCQ Analytics Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ncq_sa',
    creator: '@ncq_analytics',
  },
  robots: {
    index: false, // Private analytics dashboard
    follow: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0051d5" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 antialiased`}>
        <Providers>
          <div className="min-h-screen">
            {children}
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}