import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LumaSkin - AI-Powered Skincare Analysis',
  description: 'Advanced AI skin analysis and personalized skincare recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} light`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
