import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NCQ API Portal - Comprehensive API Documentation',
  description: 'Explore and test NCQ platform APIs with our interactive documentation portal',
  keywords: 'NCQ, API, documentation, REST API, GraphQL, WebSocket, Saudi Arabia',
  authors: [{ name: 'NCQ Development Team' }],
  openGraph: {
    title: 'NCQ API Portal',
    description: 'Comprehensive API documentation for NCQ platform services',
    type: 'website',
    url: 'https://api.ncq.sa',
    images: [
      {
        url: 'https://api.ncq.sa/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NCQ API Portal',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}