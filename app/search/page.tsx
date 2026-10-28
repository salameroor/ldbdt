import type { Metadata } from 'next'
import { and, desc, eq, ilike, isNotNull, or, type SQL } from 'drizzle-orm'
import Link from 'next/link'
import { db } from '@/lib/db'
import { donors } from '@/lib/db/schema'
import { BLOOD_GROUPS, DISTRICTS, UPAZILAS_BY_DISTRICT, getUnions } from '@/lib/constants'
import { formatNumber, getLocale } from '@/lib/locale'
import { getStaff } from '@/lib/staff'
import { districtLabel } from '@/lib/district-label'
import { unionName, upazilaName } from '@/lib/i18n'
import { DonorResultCards } from '@/components/donor-result-cards'
import { PageHeading } from '@/components/page-heading'
import { inputClass } from '@/components/donor-form'

export const metadata: Metadata = {
  title: 'রক্ত খুঁজুন | লাইফড্রপ রক্তদাতা দল',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

type SearchParams = Promise<{ q?: string; group?: string; district?: string; upazila?: string; union?: string; available?: string; view?: string; offset?: string }>

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, locale, staff] = await Promise.all([searchParams, getLocale(), getStaff()])
  const en = locale === 'en'
  const view = params.view === 'directory' || params.view === 'recent' ? params.view : 'search'
  const query = (params.q ?? '').trim().slice(0, 80)
  const group = (BLOOD_GROUPS as readonly string[]).includes(params.group ?? '') ? params.group! : ''
  const availableOnly = params.available === '1'
  const district = params.district === undefined ? '' : (DISTRICTS as readonly string[]).includes(params.district) ? params.district : ''
  const upazila = district && (UPAZILAS_BY_DISTRICT[district] ?? []).includes(params.upazila ?? '') ? params.upazila! : ''
  const union = (params.union ?? '').trim().slice(0, 80)
  const unionOptions = getUnions(upazila)
  const filters: SQL[] = []
  if (group) filters.push(eq(donors.bloodGroup, group))
  if (district) filters.push(eq(donors.district, district))
  if (upazila) filters.push(eq(donors.upazila, upazila))
  if (union) filters.push(eq(donors.union, union))
  if (availableOnly) filters.push(eq(donors.available, true))
  if (query) {
    const searchable = `%${query}%`
    filters.push(or(
      ilike(donors.name, searchable),
      ilike(donors.phone, searchable),
      ilike(donors.area, searchable),
      ilike(donors.district, searchable),
      ilike(donors.upazila, searchable),
      ilike(donors.union, searchable),
    )!)
  }
  if (view === 'recent') filters.push(isNotNull(donors.lastDonationDate))

  const searched = view !== 'search' || Boolean(query || group || district || upazila || union || availableOnly)
  const offset = Math.max(0, Number.parseInt(params.offset ?? '0', 10) || 0)
  const rows = searched
    ? await db.select().from(donors).where(filters.length ? and(...filters) : undefined).orderBy(view === 'recent' ? desc(donors.lastDonationDate) : desc(donors.createdAt)).limit(16).offset(offset)
    : []
  const hasMore = rows.length > 15
  const results = rows.slice(0, 15)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <PageHeading
        title={view === 'directory' ? (en ? 'Donor directory' : 'ডোনার তালিকা') : view === 'recent' ? (en ? 'Recent donations' : 'শেষ রক্তদান') : (en ? 'Find blood donors' : 'রক্ত খুঁজুন')}
        description={view === 'recent' ? (en ? 'Donors sorted by their most recent donation date. Contact each donor to confirm availability.' : 'ডোনারের সর্বশেষ রক্তদানের তারিখ অনুযায়ী সাজানো তালিকা। যোগাযোগ করে প্রস্তুতি নিশ্চিত করুন।') : view === 'directory' ? (en ? 'Browse registered blood donors.' : 'নিবন্ধিত রক্তদাতাদের তালিকা দেখুন।') : (en ? 'Choose a blood group and district to find donors.' : 'রক্তের গ্রুপ ও জেলা নির্বাচন করে রক্তদাতা খুঁজুন।')}
      />

      <nav aria-label={en ? 'Donor views' : 'ডোনার তালিকার ধরন'} className="mb-5 flex flex-wrap gap-2">
        {([
          ['search', en ? 'Find donors' : 'রক্ত খুঁজুন'],
          ['directory', en ? 'All donors' : 'সব ডোনার'],
          ['recent', en ? 'Recent donations' : 'শেষ রক্তদান'],
        ] as const).map(([key, label]) => (
          <Link key={key} href={`/search?view=${key}`} aria-current={view === key ? 'page' : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${view === key ? 'bg-primary text-primary-foreground shadow-sm' : 'border bg-card text-foreground hover:border-primary/40 hover:text-primary'}`}>
            {label}
          </Link>
        ))}
      </nav>

      <form method="get" className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#eadfdf] bg-card p-4 shadow-[0_2px_8px_rgba(72,35,35,0.06)] sm:mb-6 sm:gap-4 sm:p-5 md:flex-row md:items-end">
        <input type="hidden" name="view" value={view} />
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="q" className="text-sm font-medium">{en ? 'Name, phone, or address' : 'নাম, নাম্বার বা ঠিকানা'}</label>
          <input id="q" name="q" defaultValue={query} placeholder={en ? 'Search by name, phone, or address' : 'নাম, নাম্বার বা ঠিকানা দিয়ে খুঁজুন'} className={inputClass} />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="group" className="text-sm font-medium">{en ? 'Blood group' : 'রক্তের গ্রুপ'}</label>
          <select id="group" name="group" defaultValue={group} className={inputClass}>
            <option value="">{en ? 'All groups' : 'সব গ্রুপ'}</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="district" className="text-sm font-medium">{en ? 'District' : 'জেলা'}</label>
          <select id="district" name="district" defaultValue={district} className={inputClass}>
            <option value="">{en ? 'All districts' : 'সব জেলা'}</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{districtLabel(d, locale)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="upazila" className="text-sm font-medium">{en ? 'Upazila' : 'উপজেলা'}</label>
          <select id="upazila" name="upazila" defaultValue={upazila} className={inputClass}>
            <option value="">{en ? 'All upazilas' : 'সব উপজেলা'}</option>
            {[...(UPAZILAS_BY_DISTRICT[district] ?? [])].sort((a, b) => a.localeCompare(b, 'bn')).map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="union" className="text-sm font-medium">{en ? 'Union' : 'ইউনিয়ন'}</label>
          <select id="union" name="union" defaultValue={union} className={inputClass}>
            <option value="">{en ? 'All unions' : 'সব ইউনিয়ন'}</option>
            {unionOptions.map((value) => <option key={value} value={value}>{unionName(value, locale)}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium">
          <input type="checkbox" name="available" value="1" defaultChecked={availableOnly} className="size-4 accent-primary" />
          {en ? 'Available only' : 'শুধু প্রস্তুত ডোনার'}
        </label>
        <button type="submit" className="min-h-11 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          {en ? 'Search' : 'খুঁজুন'}
        </button>
      </form>

      {searched ? (
        <>
          <p className="mb-3 text-sm font-medium text-muted-foreground">{en ? `${formatNumber(results.length, locale)} donors found` : `${formatNumber(results.length, locale)} জন ডোনার পাওয়া গেছে`}</p>
          <DonorResultCards
            donors={results}
            showEditAction={Boolean(staff)}
            locale={locale}
            emptyText={view === 'recent' ? (en ? 'No donors have a last-donation date yet.' : 'কোনো ডোনারের শেষ রক্তদানের তথ্য নেই।') : en ? 'No donors found for these filters.' : 'এই ফিল্টারে কোনো ডোনার পাওয়া যায়নি।'}
          />
          {hasMore && <Link className="mt-6 block rounded-xl border bg-card px-4 py-3 text-center font-semibold text-primary hover:bg-muted" href={`/search?view=${view}&q=${encodeURIComponent(query)}&group=${encodeURIComponent(group)}&district=${encodeURIComponent(district)}&upazila=${encodeURIComponent(upazila)}&union=${encodeURIComponent(union)}&available=${availableOnly ? '1' : ''}&offset=${offset + 15}`}>{en ? 'Load 15 more donors' : 'আরও ১৫ জন ডোনারের তালিকা দেখুন'}</Link>}
        </>
      ) : (
        <p className="rounded-2xl border border-dashed bg-card px-4 py-10 text-center text-muted-foreground">
          {en ? 'Select a filter above and click "Search" to find donors.' : 'খুঁজতে উপরের ফিল্টার নির্বাচন করে “খুঁজুন” চাপুন।'}
        </p>
      )}
    </div>
  )
}
