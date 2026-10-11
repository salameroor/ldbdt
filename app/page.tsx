import Image from 'next/image'
import Link from 'next/link'
import { sql } from 'drizzle-orm'
import { Heart, HeartPulse, MapPin, ShieldCheck, Users } from 'lucide-react'
import { db } from '@/lib/db'
import { donors } from '@/lib/db/schema'
import { BLOOD_GROUPS, DONATION_GAP_DAYS } from '@/lib/constants'
import { formatNumber, getLocale } from '@/lib/locale'

export const dynamic = 'force-dynamic'

async function getStats() {
  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      today: sql<number>`count(*) filter (where ${donors.createdAt}::date = current_date)::int`,
      ready: sql<number>`count(*) filter (where ${donors.available} and (${donors.lastDonationDate} is null or ${donors.lastDonationDate} <= current_date - ${DONATION_GAP_DAYS}::int))::int`,
    })
    .from(donors)
  const groups = await db
    .select({ group: donors.bloodGroup, count: sql<number>`count(*)::int` })
    .from(donors)
    .groupBy(donors.bloodGroup)
  const byGroup = Object.fromEntries(groups.map((g) => [g.group, g.count]))
  return { ...totals, byGroup }
}

export default async function HomePage() {
  const [stats, locale] = await Promise.all([getStats(), getLocale()])
  const en = locale === 'en'

  const statCards = [
    { label: en ? 'Total donors' : 'মোট ডোনার', value: stats.total, icon: Users },
    { label: en ? 'New donors today' : 'আজকের নতুন ডোনার', value: stats.today, icon: HeartPulse },
    { label: en ? 'Ready to donate' : 'রক্ত দিতে প্রস্তুত', value: stats.ready, icon: ShieldCheck },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 pb-0 pt-6 sm:pb-0">
      <section className="relative isolate overflow-hidden rounded-[1.5rem] bg-white shadow-xl sm:rounded-[2rem]">
        <div className="relative hidden aspect-[2.91/1] sm:block">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ldbdt-dp87xWC8BhVDugXjGePPuZPOrMjaxq.png"
            alt="লাইফড্রপ রক্তদাতা দলের ব্যানার: এক ব্যাগ রক্ত, একাধিক জীবন বাঁচাতে পারে"
            width={1983}
            height={793}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="absolute left-0 top-[-16.5%] h-auto w-full max-w-none"
          />
          <div className="absolute left-[64%] top-[84%] z-10 flex h-[10%] w-[15%] items-center justify-center gap-1.5 rounded-full bg-[#b50929] px-1.5 text-[clamp(0.55rem,0.85vw,0.75rem)] font-semibold leading-none text-white">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{en ? 'Kaliganj, Satkhira' : 'কালিগঞ্জ, সাতক্ষীরা'}</span>
          </div>
          <Link href="/search" className="absolute left-[9%] top-[65%] z-10 h-[11%] w-[17%] rounded-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <span className="sr-only">রক্তদাতা খুঁজুন</span>
          </Link>
          <Link href="/add-donor" className="absolute left-[26%] top-[65%] z-10 h-[11%] w-[19%] rounded-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <span className="sr-only">{en ? 'Register as a donor' : 'রক্তদাতা হিসেবে নিবন্ধন করুন'}</span>
          </Link>
          {en && (
            <div className="absolute inset-y-0 left-0 z-20 flex w-[52%] flex-col justify-center bg-white px-[9%] text-slate-900">
              <p className="inline-flex w-fit rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">Voluntary Blood Donor Team</p>
              <h1 className="mt-4 text-5xl font-extrabold leading-tight">Life<span className="text-primary">Drop</span><span className="mt-1 block text-3xl">Blood Donor Team</span></h1>
              <p className="mt-3 text-xl font-semibold text-primary">One bag of blood can save many lives.</p>
              <p className="mt-3 text-sm">Request blood <span className="mx-2 text-primary">•</span> Find donors <span className="mx-2 text-primary">•</span> Donate voluntarily</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/search" className="rounded-full bg-primary px-5 py-3 font-semibold text-white">Find a donor</Link>
                <Link href="/add-donor" className="rounded-full border border-primary px-5 py-3 font-semibold text-slate-900">Register as donor</Link>
              </div>
            </div>
          )}
        </div>
        <div className="relative isolate flex min-h-[540px] flex-col overflow-hidden bg-[#fffafa] px-6 py-8 text-slate-900 sm:hidden">
          <Image
            src="/home-mobile-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[63%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.78)_48%,rgba(164,0,26,0.96)_78%)]" aria-hidden="true" />
          <div className="relative z-10 max-w-sm">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary backdrop-blur">
              <Heart className="size-4 fill-current" aria-hidden="true" />
              {en ? 'Voluntary Blood Donor Team' : 'স্বেচ্ছাসেবী রক্তদাতা দল'}
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-950">Life<span className="text-primary">Drop</span><span className="mt-1 block text-2xl">Blood Donor Team</span></h1>
            <p className="mt-4 text-2xl font-bold leading-snug text-slate-900">{en ? 'One bag of blood can save many lives.' : 'এক ব্যাগ রক্ত, একাধিক জীবন বাঁচাতে পারে।'}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{en ? 'Request blood · Find donors · Donate voluntarily' : 'জরুরি রক্তের অনুরোধ · রক্তদাতা খুঁজুন · স্বেচ্ছায় রক্তদান করুন'}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white shadow-md">
                <HeartPulse className="size-5" aria-hidden="true" />{en ? 'Find a donor' : 'রক্তদাতা খুঁজুন'}
              </Link>
              <Link href="/add-donor" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-white/70 px-5 py-3 font-semibold text-primary backdrop-blur-sm">
                <Users className="size-5" aria-hidden="true" />{en ? 'Register as a donor' : 'রক্তদাতা হিসেবে নিবন্ধন'}
              </Link>
            </div>
          </div>
          <div className="relative z-10 mt-auto flex items-center justify-center gap-2 border-t border-white/30 pt-4 text-center text-sm font-semibold text-white">
            <Heart className="size-4 fill-current" aria-hidden="true" />
            <span>{en ? 'Together, we can save lives' : 'একসাথে বাঁচাই মানুষের জীবন'}</span>
          </div>
        </div>
      </section>

      <section aria-label={en ? 'Statistics' : 'পরিসংখ্যান'} className="mt-8 grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm">
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
              <card.icon className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-3xl font-bold">{formatNumber(card.value, locale)}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <HeartPulse className="size-6 text-primary" aria-hidden="true" />
          {en ? 'Donors by blood group' : 'রক্তের গ্রুপ অনুযায়ী ডোনার'}
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {BLOOD_GROUPS.map((group) => (
            <Link
              key={group}
              href={`/search?group=${encodeURIComponent(group)}`}
              className="rounded-2xl border bg-card p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <p className="text-3xl font-bold text-primary">{group}</p>
              <p className="mt-1 text-sm text-muted-foreground">{`${formatNumber(stats.byGroup[group] ?? 0, locale)} ${en ? 'donors' : 'জন'}`}</p>
            </Link>
          ))}
        </div>
      </section>

      <aside aria-labelledby="important-notice-title" className="mt-10 mb-[-1.5rem] rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm sm:mb-0 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800" aria-hidden="true">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h2 id="important-notice-title" className="text-lg font-bold">{en ? 'Important information' : 'গুরুত্বপূর্ণ তথ্য'}</h2>
            <p className="mt-2 text-sm leading-7 text-amber-950/85">
              {en ? 'Donor availability shown here may be estimated. Contact the donor to confirm they are currently ready to donate. In an emergency, also contact your nearest hospital or blood bank.' : 'এখানে দেখানো ডোনারের তথ্যের ভিত্তিতে অনুমান করা হতে পারে। রক্তদাতার সাথে যোগাযোগ করে বর্তমান রক্ত দিতে প্রস্তুত কি নিশ্চিত করুন। জরুরি পরিস্থিতিতে নিকটস্থ হাসপাতাল বা ব্লাড ব্যাংকের সাথেও যোগাযোগ করুন।'}
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
