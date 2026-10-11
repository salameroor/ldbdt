import Link from 'next/link'
import { Droplet } from 'lucide-react'
import { getStaff } from '@/lib/staff'
import { NavLinks } from './nav-links'

export async function SiteHeader({ locale }: { locale: 'bn' | 'en' }) {
  const staff = await getStaff()

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center text-primary">
            <Droplet className="size-7 fill-primary" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-sm font-bold text-primary sm:text-lg">লাইফড্রপ রক্তদাতা দল</span>
            <span className="whitespace-nowrap text-xs text-muted-foreground sm:text-base">LifeDrop Blood Donor Team</span>
          </span>
        </Link>
        <NavLinks locale={locale} staff={staff ? { name: staff.name, role: staff.role } : null} />
      </div>
    </header>
  )
}
