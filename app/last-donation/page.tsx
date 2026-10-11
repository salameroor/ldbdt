import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'শেষ রক্তদান | লাইফড্রপ রক্তদাতা দল' }

export default function LastDonationPage() {
  redirect('/search?view=recent')
}
