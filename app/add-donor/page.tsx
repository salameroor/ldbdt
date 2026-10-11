import type { Metadata } from 'next'
import { addDonor } from '@/app/actions/donors'
import { DonorForm } from '@/components/donor-form'
import { PageHeading } from '@/components/page-heading'
import { getLocale } from '@/lib/locale'

export const metadata: Metadata = { title: 'নতুন ডোনার যুক্ত করুন | লাইফড্রপ' }

export default async function AddDonorPage() {
  const en = (await getLocale()) === 'en'
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PageHeading title={en ? 'Add a new donor' : 'নতুন ডোনার যুক্ত করুন'} description={en ? 'Anyone can add a donor. Name, phone, address, and donation date will be public.' : 'যে কেউ ডোনার যুক্ত করতে পারবেন। নাম, ফোন, ঠিকানা ও রক্তদানের তারিখ সবার জন্য দৃশ্যমান থাকবে।'} />
      <DonorForm action={addDonor} submitLabel={en ? 'Add donor' : 'ডোনার যুক্ত করুন'} locale={en ? 'en' : 'bn'} />
    </div>
  )
}
