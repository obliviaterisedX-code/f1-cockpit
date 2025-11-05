import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navbar } from '@/components/navbar'  // ✅ import the new navbar

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'F1 Cockpit Simulator',
  description: 'Red Bull Racing F1 interactive cockpit simulator with tasks',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        {/* ✅ Shared Navbar */}
        <Navbar />
        {/* ✅ Page content */}
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
