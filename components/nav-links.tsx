'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, UserRound, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/', bn: 'হোম', en: 'Home' },
  { href: '/add-donor', bn: 'ডোনার যুক্ত করুন', en: 'Add donor' },
  { href: '/search', bn: 'রক্ত খুঁজুন', en: 'Find donors' },
  { href: '/about', bn: 'আমাদের সম্পর্কে', en: 'About us' },
  { href: '/contact', bn: 'যোগাযোগ', en: 'Contact' },
]

type Props = { locale: 'bn' | 'en'; staff: { name: string; role: 'admin' | 'moderator' } | null }

function LanguageOptions({ locale }: { locale: 'bn' | 'en' }) {
  const setLanguage = (value: 'bn' | 'en') => {
    document.cookie = `lifedrop-locale=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
    window.location.reload()
  }

  return (
    <div role="group" aria-label="Choose language" className="inline-flex items-center rounded-full border border-border bg-background p-1">
      <button type="button" onClick={() => setLanguage('bn')} aria-pressed={locale === 'bn'} className={cn('rounded-full px-3 py-1.5 text-xs font-semibold transition-colors', locale === 'bn' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent')}>বাংলা</button>
      <button type="button" onClick={() => setLanguage('en')} aria-pressed={locale === 'en'} className={cn('rounded-full px-3 py-1.5 text-xs font-semibold transition-colors', locale === 'en' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent')}>English</button>
    </div>
  )
}

export function NavLinks({ locale, staff }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const staffLink = staff ? (
    <Link
      href="/admin"
      onClick={() => setOpen(false)}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      <UserRound className="size-4" aria-hidden="true" />
      <span className="max-w-32 truncate">{staff.name}</span>
      <span className="rounded bg-primary-foreground/20 px-1.5 text-xs">
        {staff.role === 'admin' ? (locale === 'bn' ? 'অ্যাডমিন' : 'Admin') : (locale === 'bn' ? 'মডারেটর' : 'Moderator')}
      </span>
    </Link>
  ) : (
    <Link
      href="/admin/login"
      onClick={() => setOpen(false)}
      className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
    >
      {locale === 'bn' ? 'অ্যাডমিন লগইন' : 'Admin login'}
    </Link>
  )

  return (
    <>
      <nav aria-label={locale === 'bn' ? 'প্রধান মেনু' : 'Main menu'} className="hidden items-center gap-1 lg:flex">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? 'page' : undefined}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
              isActive(link.href) && 'bg-accent text-accent-foreground',
            )}
          >
            {link[locale]}
          </Link>
        ))}
        <LanguageOptions locale={locale} />
        <div className="ml-1">{staffLink}</div>
      </nav>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex size-10 items-center justify-center rounded-lg border lg:hidden"
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        <span className="sr-only">{locale === 'bn' ? 'মেনু' : 'Menu'}</span>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label={locale === 'bn' ? 'মোবাইল মেনু' : 'Mobile menu'}
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b bg-card p-4 shadow-lg lg:hidden"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'rounded-lg px-3 py-2.5 font-medium hover:bg-accent',
                isActive(link.href) && 'bg-accent text-accent-foreground',
              )}
            >
              {link[locale]}
            </Link>
          ))}
          <div className="mt-2 flex flex-wrap items-center gap-3"><LanguageOptions locale={locale} />{staffLink}</div>
        </nav>
      )}
    </>
  )
}
