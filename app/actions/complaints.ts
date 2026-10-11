'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { complaints } from '@/lib/db/schema'
import type { FormState } from '@/app/actions/donors'

export async function submitComplaint(_prev: FormState, formData: FormData): Promise<FormState> {
  const en = formData.get('locale') === 'en'
  const name = String(formData.get('name') ?? '').trim()
  const rawPhone = String(formData.get('phone') ?? '').trim().replace(/[\s()-]/g, '')
  const message = String(formData.get('message') ?? '').trim()

  if (name.length < 2 || name.length > 80) {
    return { error: en ? 'Enter a name between 2 and 80 characters.' : '২ থেকে ৮০ অক্ষরের মধ্যে নাম লিখুন।' }
  }
  if (!/^(\+?88)?01[3-9]\d{8}$/.test(rawPhone)) {
    return { error: en ? 'Enter a valid Bangladesh mobile number.' : 'সঠিক বাংলাদেশি মোবাইল নম্বর লিখুন।' }
  }
  if (message.length < 10 || message.length > 2000) {
    return { error: en ? 'Your message must be between 10 and 2,000 characters.' : '১০ থেকে ২,০০০ অক্ষরের মধ্যে অভিযোগ বা মতামত লিখুন।' }
  }

  await db.insert(complaints).values({
    id: crypto.randomUUID(),
    name,
    phone: rawPhone.replace(/^\+?88/, ''),
    message,
  })

  revalidatePath('/admin')
  return { success: en ? 'Your message was sent. Thank you.' : 'আপনার অভিযোগ বা মতামত পাঠানো হয়েছে। ধন্যবাদ।' }
}
