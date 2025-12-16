import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Video Vault - Your Personal Video Library',
  description: 'Save, organize, and retrieve your favorite videos with zero friction.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
