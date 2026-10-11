import Link from 'next/link'
import { Pencil, Phone } from 'lucide-react'
import type { Donor } from '@/lib/db/schema'
import { isReadyToDonate } from '@/lib/constants'
import { formatDate, type Locale } from '@/lib/locale'
import { districtLabel } from '@/lib/district-label'

type Props = { donors: Donor[]; canEdit: boolean; emptyText?: string; locale?: Locale }

export function DonorTable({ donors, canEdit, emptyText, locale = 'bn' }: Props) {
  const en = locale === 'en'
  const emptyMessage = emptyText ?? (en ? 'No donors found.' : 'কোনো ডোনার পাওয়া যায়নি।')
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-accent/70 text-accent-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">{en ? 'Name' : 'নাম'}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{en ? 'Blood group' : 'রক্তের গ্রুপ'}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{en ? 'Phone' : 'মোবাইল'}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{en ? 'Area' : 'এলাকা'}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{en ? 'Last donation' : 'শেষ রক্তদান'}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{en ? 'Status' : 'অবস্থা'}</th>
            <th scope="col" className="px-4 py-3 font-semibold">{en ? 'Edit' : 'এডিট'}</th>
          </tr>
        </thead>
        <tbody>
          {donors.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">{emptyMessage}</td>
            </tr>
          ) : (
            donors.map((d) => {
              const ready = isReadyToDonate(d.lastDonationDate, d.available)
              return (
                <tr key={d.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-accent px-2 py-1 font-bold text-primary">{d.bloodGroup}</span>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`tel:${d.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
                      <Phone className="size-3.5" aria-hidden="true" />
                      {d.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {d.area === d.district ? districtLabel(d.district, locale) : `${d.area}, ${districtLabel(d.district, locale)}`}
                  </td>
                  <td className="px-4 py-3">{d.lastDonationDate ? formatDate(d.lastDonationDate, locale) : '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        ready
                          ? 'rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary'
                          : 'rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'
                      }
                    >
                      {ready ? (en ? 'Ready' : 'প্রস্তুত') : (en ? 'Waiting' : 'অপেক্ষমাণ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <Link
                        href={`/donors/${d.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:border-primary hover:text-primary"
                      >
                        <Pencil className="size-3" aria-hidden="true" />
                        {en ? 'Edit' : 'এডিট'}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground" title={en ? 'Log in to edit' : 'এডিট করতে লগইন করুন'}>—</span>
                    )}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
