import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Hind_Siliguri } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const hind = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
})

export const metadata: Metadata = {
  title: 'লাইফড্রপ রক্তদাতা দল | LifeDrop Blood Donor Team',
  description:
    'স্বেচ্ছায় রক্তদান করুন, একটি জীবন বাঁচান। LifeDrop Blood Donor Team — রক্তদাতা খুঁজুন ও নিবন্ধন করুন।',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#c8102e',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = (await cookies()).get('lifedrop-locale')?.value === 'en' ? 'en' : 'bn'

  return (
    <html lang={locale} className={`${hind.variable} bg-background`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
