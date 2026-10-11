import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { staffRoles } from '@/lib/db/schema'
import { getStaff } from '@/lib/staff'
import { LoginForm } from '@/components/login-form'
import { PageHeading } from '@/components/page-heading'

export const metadata: Metadata = { title: 'অ্যাডমিন লগইন | লাইফড্রপ' }

export default async function LoginPage() {
  if (await getStaff()) redirect('/admin')
  const [admin] = await db.select({ id: staffRoles.userId }).from(staffRoles).where(eq(staffRoles.role, 'admin')).limit(1)

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <PageHeading title="অ্যাডমিন / মডারেটর লগইন" description="শুধুমাত্র অনুমোদিত সদস্যদের জন্য।" />
      <LoginForm />
      {!admin && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          এখনো অ্যাডমিন তৈরি হয়নি?{' '}
          <Link href="/admin/setup" className="font-medium text-primary underline-offset-4 hover:underline">
            প্রথম অ্যাডমিন তৈরি করুন
          </Link>
        </p>
      )}
    </div>
  )
}
