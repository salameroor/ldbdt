import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'ডোনার তালিকা | লাইফড্রপ রক্তদাতা দল' }

export default function DonorsPage() {
  redirect('/search?view=directory')
}
