import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { donors } from '@/lib/db/schema'
import { getStaff } from '@/lib/staff'
import { deleteDonor, updateDonor } from '@/app/actions/donors'
import { DonorForm } from '@/components/donor-form'
import { PageHeading } from '@/components/page-heading'

export default async function EditDonorPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await getStaff()
  if (!staff) redirect('/admin/login')

  const { id } = await params
  const [donor] = await db.select().from(donors).where(eq(donors.id, id)).limit(1)
  if (!donor) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PageHeading title="ডোনারের তথ্য আপডেট করুন" description={`${donor.name} — ${donor.bloodGroup} · তথ্য ফোন নম্বরসহ সবার জন্য দৃশ্যমান।`} />
      <DonorForm
        action={updateDonor.bind(null, donor.id)}
        defaults={{ ...donor, area: donor.area === donor.district ? '' : donor.area }}
        submitLabel="পরিবর্তন সংরক্ষণ করুন"
        showAvailability
      />
      {staff && (
        <form action={deleteDonor.bind(null, donor.id)} className="mt-4">
          <button
            type="submit"
            className="w-full rounded-lg border border-destructive/40 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            এই ডোনার মুছে ফেলুন
          </button>
        </form>
      )}
    </div>
  )
}
