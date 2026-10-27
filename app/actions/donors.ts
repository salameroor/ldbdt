'use server'

import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { donors } from '@/lib/db/schema'
import { BLOOD_GROUPS, DISTRICTS, UPAZILAS_BY_DISTRICT, getUnions } from '@/lib/constants'
import { getStaff, logActivity, requireStaff } from '@/lib/staff'
import type { Locale } from '@/lib/locale'

export type FormState = { error?: string; success?: string } | undefined

function normalizeBangladeshPhone(rawPhone: string): string | null {
  const asciiPhone = rawPhone.replace(/[০-৯٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0)
    return String(code - (code >= 0x09e6 ? 0x09e6 : 0x0660))
  })
  let digits = asciiPhone.replace(/\D/g, '')
  if (digits.startsWith('0088')) digits = digits.slice(4)
  else if (digits.startsWith('88')) digits = digits.slice(2)
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null
}

function isDonorPhoneConflict(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  const databaseError = error as { code?: unknown; constraint?: unknown; cause?: unknown }
  if (databaseError.code === '23505') {
    return !databaseError.constraint || databaseError.constraint === 'donors_phone_unique_idx'
  }
  return databaseError.cause ? isDonorPhoneConflict(databaseError.cause) : false
}

type DonorInput = {
  name: string
  bloodGroup: string
  phone: string
  district: string
  upazila: string
  union: string | null
  area: string
  age: string | null
  lastDonationDate: string | null
  available: boolean
}

function parseDonor(formData: FormData): DonorInput | string {
  if (formData.get('publicConsent') !== 'on') return 'ডোনারের তথ্য প্রকাশের সম্মতি নিশ্চিত করুন।'

  const name = String(formData.get('name') ?? '').trim()
  const bloodGroup = String(formData.get('bloodGroup') ?? '')
  const phone = normalizeBangladeshPhone(String(formData.get('phone') ?? ''))
  const district = String(formData.get('district') ?? '')
  const upazila = String(formData.get('upazila') ?? '').trim()
  const union = String(formData.get('union') ?? '').trim()
  const address = String(formData.get('address') ?? '').trim()
  const age = String(formData.get('age') ?? '').trim()
  const lastDonationRaw = String(formData.get('lastDonationDate') ?? '').trim()
  const availableRaw = formData.get('available')

  if (name.length < 2 || name.length > 80) return 'সঠিক নাম লিখুন।'
  if (!(BLOOD_GROUPS as readonly string[]).includes(bloodGroup)) return 'রক্তের গ্রুপ নির্বাচন করুন।'
  if (!phone) return 'সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)।'
  if (!(DISTRICTS as readonly string[]).includes(district)) return 'জেলা নির্বাচন করুন।'
  if (!(UPAZILAS_BY_DISTRICT[district] ?? []).includes(upazila)) return 'নির্বাচিত জেলার সঠিক উপজেলা নির্বাচন করুন।'
  const validUnions = getUnions(upazila)
  if (union && !validUnions.includes(union)) return 'নির্বাচিত উপজেলার সঠিক ইউনিয়ন নির্বাচন করুন।'
  if (union.length > 80 || address.length > 160) return 'ঠিকানা অনেক বড় হয়ে গেছে।'
  if (age && (!/^\d{1,3}$/.test(age) || Number(age) < 1 || Number(age) > 120)) return 'বয়স সঠিক নয়।'

  let lastDonationDate: string | null = null
  if (lastDonationRaw) {
    const d = new Date(lastDonationRaw)
    if (Number.isNaN(d.getTime()) || d.getTime() > Date.now()) return 'শেষ রক্তদানের তারিখ সঠিক নয়।'
    lastDonationDate = lastDonationRaw
  }

  return {
    name,
    bloodGroup,
    phone,
    district,
    upazila,
    union: union || null,
    area: address || district,
    age: age || null,
    lastDonationDate,
    available: availableRaw === null ? true : availableRaw === 'on',
  }
}

export async function addDonor(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseDonor(formData)
  if (typeof parsed === 'string') return { error: parsed }
  const upazila = String(formData.get('upazila') ?? '')
  if (!(UPAZILAS_BY_DISTRICT[parsed.district] ?? []).includes(upazila)) {
    return { error: 'নির্বাচিত জেলার সঠিক উপজেলা নির্বাচন করুন।' }
  }

  const existing = await db
    .select({ id: donors.id })
    .from(donors)
    .where(eq(donors.phone, parsed.phone))
    .limit(1)
  if (existing.length) return { error: 'এই নাম্বার দিয়ে ইতিমধ্যে ডোনার যুক্ত আছে।' }

  const staff = await getStaff()
  try {
    await db.insert(donors).values({
      id: crypto.randomUUID(),
      ...parsed,
      createdByUserId: staff?.id ?? 'public',
    })
  } catch (error) {
    if (isDonorPhoneConflict(error)) {
      return { error: 'এই নাম্বার দিয়ে ইতিমধ্যে ডোনার যুক্ত আছে।' }
    }
    throw error
  }
  if (staff) await logActivity(staff, 'donor_created', `${parsed.name} (${parsed.bloodGroup})`)

  revalidatePath('/', 'layout')
  return { success: 'ডোনার সফলভাবে যুক্ত হয়েছে। ধন্যবাদ!' }
}

export async function updateLastDonationDate(
  id: string,
  locale: Locale,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const en = locale === 'en'
  const date = String(formData.get('lastDonationDate') ?? '').trim()
  const parsedDate = new Date(`${date}T00:00:00.000Z`)
  const today = new Date().toISOString().slice(0, 10)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date || date > today) {
    return { error: en ? 'Enter a valid donation date that is not in the future.' : 'ভবিষ্যতের তারিখ নয়—সঠিক রক্তদানের তারিখ দিন।' }
  }

  const [updated] = await db
    .update(donors)
    .set({ lastDonationDate: date, updatedAt: new Date() })
    .where(eq(donors.id, id))
    .returning({ name: donors.name, bloodGroup: donors.bloodGroup })
  if (!updated) return { error: en ? 'Donor not found.' : 'ডোনার পাওয়া যায়নি।' }

  const staff = await getStaff()
  if (staff) await logActivity(staff, 'donor_date_updated', `${updated.name} (${updated.bloodGroup}): ${date}`)

  revalidatePath('/', 'layout')
  return { success: en ? 'Donation date updated.' : 'শেষ রক্তদানের তারিখ আপডেট হয়েছে।' }
}

export async function updateDonor(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const staff = await requireStaff()
  const parsed = parseDonor(formData)
  if (typeof parsed === 'string') return { error: parsed }

  const duplicate = await db
    .select({ id: donors.id })
    .from(donors)
    .where(and(eq(donors.phone, parsed.phone), ne(donors.id, id)))
    .limit(1)
  if (duplicate.length) return { error: 'এই নাম্বার দিয়ে ইতিমধ্যে ডোনার যুক্ত আছে।' }

  let updated: { id: string }[]
  try {
    updated = await db
      .update(donors)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(donors.id, id))
      .returning({ id: donors.id })
  } catch (error) {
    if (isDonorPhoneConflict(error)) return { error: 'এই মোবাইল নম্বরে আরেকজন ডোনার নিবন্ধিত আছেন।' }
    throw error
  }
  if (!updated.length) return { error: 'ডোনার পাওয়া যায়নি।' }

  if (staff) await logActivity(staff, 'donor_updated', `${parsed.name} (${parsed.bloodGroup})`)
  revalidatePath('/', 'layout')
  redirect('/search?view=directory')
}

export async function deleteDonor(id: string) {
  const staff = await requireStaff()
  const [removed] = await db
    .delete(donors)
    .where(eq(donors.id, id))
    .returning({ name: donors.name, bloodGroup: donors.bloodGroup })
  if (removed) await logActivity(staff, 'donor_deleted', `${removed.name} (${removed.bloodGroup})`)
  revalidatePath('/', 'layout')
  redirect('/donors')
}
