'use server'

import { timingSafeEqual } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { complaints, moderatorActivity, staffRoles, user } from '@/lib/db/schema'
import { logActivity, requireAdmin } from '@/lib/staff'
import type { FormState } from './donors'

function parseAccount(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  if (!/^[\p{L}\p{N}_.\- ]{3,40}$/u.test(name)) return 'ইউজারনেম ৩-৪০ অক্ষরের হতে হবে।'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'সঠিক ইমেইল দিন।'
  if (password.length < 8) return 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।'
  return { name, email, password }
}

async function createAccount(data: { name: string; email: string; password: string }) {
  const [taken] = await db.select({ id: user.id }).from(user).where(eq(user.email, data.email)).limit(1)
  if (taken) return null
  const result = await auth.api.signUpEmail({ body: data })
  return result.user.id
}

function keyMatches(input: string) {
  const expected = process.env.ADMIN_SETUP_KEY ?? ''
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  return expected.length > 0 && a.length === b.length && timingSafeEqual(a, b)
}

export async function setupAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  const [existingAdmin] = await db
    .select({ id: staffRoles.userId })
    .from(staffRoles)
    .where(eq(staffRoles.role, 'admin'))
    .limit(1)
  if (existingAdmin) return { error: 'অ্যাডমিন আগেই তৈরি করা হয়েছে। লগইন করুন।' }

  if (!keyMatches(String(formData.get('setupKey') ?? ''))) {
    return { error: 'সেটআপ কী সঠিক নয়।' }
  }

  const parsed = parseAccount(formData)
  if (typeof parsed === 'string') return { error: parsed }

  try {
    const userId = await createAccount(parsed)
    if (!userId) return { error: 'এই ইমেইলে আগেই একটি অ্যাকাউন্ট আছে।' }
    await db.insert(staffRoles).values({ userId, role: 'admin' })
  } catch (error) {
    console.error('Admin setup failed', error)
    return { error: 'অ্যাডমিন তৈরি করা যায়নি। আবার চেষ্টা করুন।' }
  }
  return { success: 'অ্যাডমিন অ্যাকাউন্ট তৈরি হয়েছে। এখন লগইন করুন।' }
}

export async function createModerator(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin()
  const parsed = parseAccount(formData)
  if (typeof parsed === 'string') return { error: parsed }

  try {
    const userId = await createAccount(parsed)
    if (!userId) return { error: 'এই ইমেইলে আগেই একটি অ্যাকাউন্ট আছে।' }
    await db.insert(staffRoles).values({ userId, role: 'moderator' })
  } catch (error) {
    console.error('Create moderator failed', error)
    return { error: 'মডারেটর তৈরি করা যায়নি। আবার চেষ্টা করুন।' }
  }

  await logActivity(admin, 'moderator_created', parsed.name)
  revalidatePath('/admin')
  return { success: `মডারেটর "${parsed.name}" যুক্ত হয়েছে।` }
}

export async function removeModerator(userId: string) {
  const admin = await requireAdmin()
  const [target] = await db
    .select({ name: user.name, role: staffRoles.role })
    .from(staffRoles)
    .innerJoin(user, eq(user.id, staffRoles.userId))
    .where(eq(staffRoles.userId, userId))
    .limit(1)
  if (!target || target.role !== 'moderator') return

  await db.delete(staffRoles).where(eq(staffRoles.userId, userId))
  await db.delete(user).where(eq(user.id, userId))
  await logActivity(admin, 'moderator_removed', target.name)
  revalidatePath('/admin')
}

export async function deleteComplaint(id: string, _formData: FormData) {
  const admin = await requireAdmin()
  if (typeof id !== 'string' || id.length < 1 || id.length > 128) return

  const [deleted] = await db
    .delete(complaints)
    .where(eq(complaints.id, id))
    .returning({ name: complaints.name })
  if (!deleted) return

  await logActivity(admin, 'complaint_deleted', deleted.name)
  revalidatePath('/admin')
}

export async function deleteModeratorActivity(id: string, _formData: FormData) {
  const admin = await requireAdmin()
  if (typeof id !== 'string' || id.length < 1 || id.length > 128) return

  const [deleted] = await db
    .delete(moderatorActivity)
    .where(eq(moderatorActivity.id, id))
    .returning({ moderatorName: moderatorActivity.moderatorName, action: moderatorActivity.action })
  if (!deleted) return

  await logActivity(admin, 'activity_deleted', `${deleted.moderatorName}: ${deleted.action}`)
  revalidatePath('/admin')
}
