import type { Metadata } from 'next'
import { HandHeart, ShieldCheck, Users } from 'lucide-react'
import { PageHeading } from '@/components/page-heading'
import { getLocale } from '@/lib/locale'

export const metadata: Metadata = { title: 'আমাদের সম্পর্কে | লাইফড্রপ রক্তদাতা দল' }

const VALUES = [
  { icon: HandHeart, title: 'স্বেচ্ছাসেবা', text: 'আমরা বিনামূল্যে, সম্পূর্ণ স্বেচ্ছায় রক্তদাতা ও রোগীর মধ্যে সংযোগ তৈরি করি।' },
  { icon: Users, title: 'সবার জন্য', text: 'ধর্ম, বর্ণ, দল নির্বিশেষে প্রয়োজনে সবার পাশে দাঁড়ানোই আমাদের লক্ষ্য।' },
  { icon: ShieldCheck, title: 'বিশ্বস্ততা', text: 'মডারেটররা নিয়মিত ডোনারের তথ্য যাচাই ও হালনাগাদ করেন।' },
]

export default async function AboutPage() {
  const en = (await getLocale()) === 'en'
  const englishValues = [
    { title: 'Volunteer service', text: 'We connect donors and patients completely free of charge and entirely through volunteering.' },
    { title: 'For everyone', text: 'Our goal is to stand beside everyone in need, regardless of religion, background, or affiliation.' },
    { title: 'Trust', text: 'Our moderators regularly verify and update donor information.' },
  ] as const
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeading title={en ? 'About us' : 'আমাদের সম্পর্কে'} />
      <div className="rounded-2xl border bg-card p-6 leading-relaxed shadow-sm">
        <p>
          {en ? 'LifeDrop Blood Donor Team helps people find donors with the right blood group in an emergency.' : 'লাইফড্রপ রক্তদাতা দল বাংলাদেশের স্বেচ্ছাসেবী রক্তদাতাদের একটি উন্মুক্ত তথ্যভাণ্ডার। জরুরি মুহূর্তে সঠিক রক্তের গ্রুপের ডোনার দ্রুত খুঁজে পাওয়াই আমাদের মূল উদ্দেশ্য।'}
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {VALUES.map((v, index) => {
          const translated = englishValues[index]
          return (
          <div key={v.title} className="rounded-2xl border bg-card p-5 shadow-sm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
              <v.icon className="size-5" aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-bold">{en ? translated.title : v.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{en ? translated.text : v.text}</p>
          </div>
          )
        })}
      </div>
      <section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-bold">{en ? 'Support' : 'সহযোগিতা'}</h2>
        <p className="mt-2 text-muted-foreground">{en ? 'Information and overall support' : 'তথ্য ও সার্বিক সহযোগিতা'}</p>
        <ul className="mt-4 flex flex-col gap-2 font-semibold">
          <li>{en ? 'Basantapur Development Foundation' : 'বসন্তপুর উন্নয়ন ফাউন্ডেশন'}</li><li>{en ? 'Amar Blood Donate Foundation' : 'আমার ব্লাড ডোনেট ফাউন্ডেশন'}</li><li>Hope Blood Donate Foundation</li>
        </ul>
      </section>
    </div>
  )
}
