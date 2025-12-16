import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { reportWebVitals } from '@/utils/performance'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: "Pargo's Chest - Treasure Collection",
  description: 'High-performance treasure management platform',
  keywords: ['treasure', 'collection', 'management'],
  authors: [{ name: "Pargo's Chest Team" }],
  openGraph: {
    title: "Pargo's Chest",
    description: 'High-performance treasure management platform',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

// Enable Web Vitals reporting in the browser
if (typeof window !== 'undefined') {
  reportWebVitals()
}
