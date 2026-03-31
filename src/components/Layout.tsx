import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  )
}
