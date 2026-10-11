import { cache } from 'react'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { moderatorActivity, staffRoles } from '@/lib/db/schema'

export type StaffRole = 'admin' | 'moderator'
export type Staff = { id: string; name: string; email: string; role: StaffRole }

export const getStaff = cache(async (): Promise<Staff | null> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const [row] = await db
    .select({ role: staffRoles.role })
    .from(staffRoles)
    .where(eq(staffRoles.userId, session.user.id))
    .limit(1)
  if (!row) return null
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: row.role as StaffRole,
  }
})

export async function requireStaff() {
  const staff = await getStaff()
  if (!staff) throw new Error('Unauthorized')
  return staff
}

export async function requireAdmin() {
  const staff = await requireStaff()
  if (staff.role !== 'admin') throw new Error('Forbidden')
  return staff
}

export async function logActivity(staff: Staff, action: string, details: string) {
  await db.insert(moderatorActivity).values({
    id: crypto.randomUUID(),
    moderatorUserId: staff.id,
    moderatorName: staff.name,
    action,
    details,
  })
}
