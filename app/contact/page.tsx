import type { Metadata } from 'next'
import { Mail, MapPin, Phone, UsersRound } from 'lucide-react'
import { PageHeading } from '@/components/page-heading'
import { ComplaintForm } from '@/components/complaint-form'
import { getLocale } from '@/lib/locale'

export const metadata: Metadata = { title: 'যোগাযোগ | লাইফড্রপ রক্তদাতা দল' }

const ITEMS = [
  { icon: Phone, labelBn: 'হটলাইন', labelEn: 'Hotline', valueBn: '01307070404', valueEn: '01307070404', actionBn: 'এখনই কল করুন', actionEn: 'Call now', href: 'tel:01307070404', external: false },
  { icon: Mail, labelBn: 'ইমেইল', labelEn: 'Email', valueBn: 'ldbdt@mbox.re', valueEn: 'ldbdt@mbox.re', actionBn: 'ইমেইল পাঠান', actionEn: 'Send email', href: 'mailto:ldbdt@mbox.re', external: false },
  { icon: MapPin, labelBn: 'ঠিকানা', labelEn: 'Address', valueBn: 'কালীগঞ্জ, সাতক্ষীরা', valueEn: 'Kaliganj, Satkhira', actionBn: 'স্থানীয় সহায়তা', actionEn: 'Local support', external: false },
  { icon: UsersRound, labelBn: 'ফেসবুক পেজ', labelEn: 'Facebook page', valueBn: 'লাইফড্রপ রক্তদাতা দল', valueEn: 'LifeDrop Blood Donor Team', actionBn: 'ফেসবুকে দেখুন', actionEn: 'Visit Facebook', href: 'https://facebook.com/profile.php?id=61594656516445', external: true },
]

export default async function ContactPage() {
  const en = (await getLocale()) === 'en'

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeading
        title={en ? 'Contact us' : 'যোগাযোগ'}
        description={en ? 'Get in touch for urgent blood needs or any information.' : 'জরুরি রক্তের প্রয়োজনে বা যেকোনো তথ্যের জন্য যোগাযোগ করুন।'}
      />
      <section aria-label={en ? 'Contact options' : 'যোগাযোগের মাধ্যম'} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ITEMS.map((item) => {
          const content = (
            <>
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-medium text-muted-foreground">{en ? item.labelEn : item.labelBn}</p>
              <p className="mt-1 break-words font-semibold text-foreground">{en ? (item.valueEn ?? item.valueBn) : (item.valueBn ?? item.valueEn)}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                {en ? item.actionEn : item.actionBn}
              </p>
            </>
          )

          return item.href ? (
            <a
              key={item.labelBn}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {content}
            </a>
          ) : (
            <div key={item.labelBn} className="rounded-2xl border bg-card p-5 shadow-sm">
              {content}
            </div>
          )
        })}
      </section>
      <section className="mt-8 rounded-2xl border bg-card p-5 shadow-sm md:p-6" aria-labelledby="complaint-heading">
        <div className="mb-5">
          <h2 id="complaint-heading" className="text-xl font-bold">{en ? 'Send a complaint or feedback' : 'অভিযোগ বা মতামত জানান'}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {en
              ? 'Your name and phone number are only visible to admins and moderators.'
              : 'আপনার নাম ও ফোন নম্বর শুধু অ্যাডমিন ও মডারেটর দেখতে পারবেন।'}
          </p>
        </div>
        <ComplaintForm locale={en ? 'en' : 'bn'} />
      </section>
    </div>
  )
}
