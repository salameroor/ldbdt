import Link from 'next/link'
import { CalendarCheck2, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { Donor } from '@/lib/db/schema'
import { isReadyToDonate } from '@/lib/constants'
import { formatDate, type Locale } from '@/lib/locale'
import { districtLabel } from '@/lib/district-label'
import { unionName, upazilaName } from '@/lib/i18n'
import { updateLastDonationDate } from '@/app/actions/donors'
import { DonorDateUpdateForm } from './donor-date-update-form'

type Props = { donors: Donor[]; showEditAction: boolean; locale: Locale; emptyText: string }

function whatsappHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const number = digits.startsWith('880') ? digits : digits.startsWith('0') ? `88${digits}` : digits
  return `https://wa.me/${number}`
}

export function DonorResultCards({ donors, showEditAction, locale, emptyText }: Props) {
  const en = locale === 'en'

  if (donors.length === 0) {
    return <p className="rounded-2xl border border-dashed bg-card px-4 py-10 text-center text-muted-foreground">{emptyText}</p>
  }

  return (
    <ul className="flex flex-col gap-4 sm:gap-5">
      {donors.map((donor) => {
        const ready = isReadyToDonate(donor.lastDonationDate, donor.available)
        const location = [donor.union ? unionName(donor.union, locale) : null, donor.upazila ? upazilaName(donor.upazila, locale) : null, districtLabel(donor.district, locale), donor.area === donor.district ? null : donor.area].filter(Boolean).join(', ')

        return (
          <li key={donor.id} className="rounded-[24px] border border-[#eadfdf] bg-white p-4 shadow-[0_2px_8px_rgba(72,35,35,0.08)] sm:rounded-[26px] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <h2 className="min-w-0 pt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">{donor.name}</h2>
              <span className="shrink-0 rounded-2xl bg-primary px-4 py-2.5 text-lg font-bold text-primary-foreground shadow-sm sm:px-6 sm:py-3.5 sm:text-xl">{donor.bloodGroup}</span>
            </div>

            <div className="mt-4 flex items-start gap-3 text-muted-foreground sm:mt-5">
              <MapPin className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <span className="text-base leading-7 sm:text-lg">{location}</span>
            </div>
            <p className="mt-2 text-base leading-7 text-muted-foreground sm:text-lg">
              <span className="font-semibold text-foreground">{en ? 'Last donation:' : 'শেষ রক্তদান:'}</span>{' '}
              {donor.lastDonationDate ? formatDate(donor.lastDonationDate, locale) : (en ? 'Not provided' : 'তথ্য নেই')}
            </p>

            <a href={`tel:${donor.phone}`} className="mt-3 inline-flex min-h-11 items-center gap-3 text-lg font-medium text-foreground hover:text-primary sm:text-xl">
              <Phone className="size-5 shrink-0" aria-hidden="true" />
              <span>{donor.phone}</span>
            </a>

            {showEditAction ? (
              <Link
                href={`/donors/${donor.id}/edit`}
                className="mt-4 inline-flex min-h-12 items-center gap-3 rounded-2xl border border-[#eadfdf] px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary sm:px-5 sm:text-base"
              >
                <CalendarCheck2 className="size-5" aria-hidden="true" />
                {en ? 'Edit all donor information' : 'ডোনারের সব তথ্য সম্পাদনা করুন'}
              </Link>
            ) : (
              <DonorDateUpdateForm
                action={updateLastDonationDate.bind(null, donor.id, locale)}
                donorId={donor.id}
                lastDonationDate={donor.lastDonationDate}
                locale={locale}
              />
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-4 py-2 text-sm font-semibold ${ready ? 'bg-secondary/10 text-secondary' : 'bg-[#fff0d7] text-[#79581f]'}`}>
                {ready ? (en ? '🟢 Available' : '🟢 Available') : (en ? '🔴 Not Available' : '🔴 Not Available')}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
              <a href={`tel:${donor.phone}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-3 py-3 font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:w-auto sm:min-w-36 sm:px-5">
                <Phone className="size-5" aria-hidden="true" />
                {en ? 'Call' : 'কল'}
              </a>
              <a href={whatsappHref(donor.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#25D366] bg-[#25D366] px-3 py-3 font-semibold text-white shadow-sm transition hover:border-[#20BD5A] hover:bg-[#20BD5A] sm:w-auto sm:min-w-44 sm:px-5">
                <MessageCircle className="size-5" aria-hidden="true" />
                WhatsApp
                <span className="sr-only">{en ? 'opens in a new tab' : 'নতুন ট্যাবে খুলবে'}</span>
              </a>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
