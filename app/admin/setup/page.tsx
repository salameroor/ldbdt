import type { Metadata } from 'next'
import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { staffRoles } from '@/lib/db/schema'
import { setupAdmin } from '@/app/actions/staff'
import { AccountForm } from '@/components/account-form'
import { PageHeading } from '@/components/page-heading'

export const metadata: Metadata = { title: 'প্রথম অ্যাডমিন তৈরি | লাইফড্রপ' }

export default async function SetupPage() {
  const [admin] = await db.select({ id: staffRoles.userId }).from(staffRoles).where(eq(staffRoles.role, 'admin')).limit(1)

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <PageHeading title="প্রথম অ্যাডমিন তৈরি করুন" description="প্রজেক্টের ADMIN_SETUP_KEY দিয়ে একবারই অ্যাডমিন তৈরি করা যাবে।" />
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        {admin ? (
          <p className="text-center">
            অ্যাডমিন আগেই তৈরি হয়েছে।{' '}
            <Link href="/admin/login" className="font-medium text-primary hover:underline">লগইন করুন</Link>
          </p>
        ) : (
          <AccountForm action={setupAdmin} submitLabel="অ্যাডমিন তৈরি করুন" withSetupKey />
        )}
      </div>
      <p className="mt-4 text-center text-sm">
        <Link href="/admin/login" className="text-primary hover:underline">লগইন পেজে ফিরে যান</Link>
      </p>
    </div>
  )
}
