import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { asc, desc, eq } from 'drizzle-orm'
import { Activity, MessageSquareText, ShieldCheck, UserPlus, UserRound, Users } from 'lucide-react'
import { db } from '@/lib/db'
import { complaints, moderatorActivity, staffRoles, user } from '@/lib/db/schema'
import { getStaff } from '@/lib/staff'
import { ACTION_LABELS, formatBnDateTime, toBn } from '@/lib/constants'
import { createModerator, deleteComplaint, deleteModeratorActivity, removeModerator } from '@/app/actions/staff'
import { AccountForm } from '@/components/account-form'
import { AdminDeleteButton } from '@/components/admin-delete-button'
import { SignOutButton } from '@/components/sign-out-button'

export const metadata: Metadata = { title: 'ড্যাশবোর্ড | লাইফড্রপ' }

export default async function AdminPage() {
  const staff = await getStaff()
  if (!staff) redirect('/admin/login')
  const isAdmin = staff.role === 'admin'

  const [members, activity, complaintList] = await Promise.all([
    isAdmin
      ? db
          .select({ id: user.id, name: user.name, email: user.email, role: staffRoles.role, createdAt: staffRoles.createdAt })
          .from(staffRoles)
          .innerJoin(user, eq(user.id, staffRoles.userId))
          .orderBy(asc(staffRoles.role), asc(staffRoles.createdAt))
      : Promise.resolve([]),
    db
      .select()
      .from(moderatorActivity)
      .where(isAdmin ? undefined : eq(moderatorActivity.moderatorUserId, staff.id))
      .orderBy(desc(moderatorActivity.createdAt))
      .limit(100),
    db.select().from(complaints).orderBy(desc(complaints.createdAt)).limit(100),
  ])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <section className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
            {isAdmin ? <ShieldCheck className="size-6" aria-hidden="true" /> : <UserRound className="size-6" aria-hidden="true" />}
          </span>
          <div>
            <p className="text-sm text-muted-foreground">স্বাগতম,</p>
            <h1 className="text-xl font-bold">{staff.name}</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? 'অ্যাডমিন' : 'মডারেটর'} • {staff.email}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/add-donor" className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            ডোনার যুক্ত করুন
          </Link>
          <Link href="/donors" className="rounded-lg border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary">
            ডোনার এডিট করুন
          </Link>
          <SignOutButton />
        </div>
      </section>

      {isAdmin && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <UserPlus className="size-5 text-primary" aria-hidden="true" />
              নতুন মডারেটর যুক্ত করুন
            </h2>
            <AccountForm action={createModerator} submitLabel="মডারেটর যুক্ত করুন" />
          </section>

          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <Users className="size-5 text-primary" aria-hidden="true" />
              অ্যাডমিন ও মডারেটর ({toBn(members.length)})
            </h2>
            <ul className="flex flex-col divide-y">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-semibold">
                      <span className="truncate">{m.name}</span>
                      <span
                        className={
                          m.role === 'admin'
                            ? 'rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground'
                            : 'rounded bg-accent px-1.5 py-0.5 text-xs text-accent-foreground'
                        }
                      >
                        {m.role === 'admin' ? 'অ্যাডমিন' : 'মডারেটর'}
                      </span>
                    </p>
                    <p className="truncate text-sm text-muted-foreground">{m.email}</p>
                  </div>
                  {m.role === 'moderator' && (
                    <form action={removeModerator.bind(null, m.id)}>
                      <button
                        type="submit"
                        className="rounded-md border border-destructive/40 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                      >
                        সরান
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <MessageSquareText className="size-5 text-primary" aria-hidden="true" />
          অভিযোগ ও মতামত ({toBn(complaintList.length)})
        </h2>
        {complaintList.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">এখনো কোনো অভিযোগ বা মতামত আসেনি।</p>
        ) : (
          <ul className="flex flex-col divide-y">
            {complaintList.map((complaint) => (
              <li key={complaint.id} className="flex flex-col gap-1.5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{complaint.name}</p>
                  <div className="flex items-center gap-2">
                    <time className="text-xs text-muted-foreground" dateTime={complaint.createdAt.toISOString()}>
                      {formatBnDateTime(complaint.createdAt)}
                    </time>
                    {isAdmin && (
                      <AdminDeleteButton
                        action={deleteComplaint.bind(null, complaint.id)}
                        confirmation="এই অভিযোগ বা মতামতটি মুছে ফেলতে চান?"
                        label="মুছুন"
                      />
                    )}
                  </div>
                </div>
                <a href={`tel:${complaint.phone}`} className="w-fit text-sm font-medium text-primary hover:underline">
                  {complaint.phone}
                </a>
                <p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">{complaint.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Activity className="size-5 text-primary" aria-hidden="true" />
          {isAdmin ? 'মডারেটরদের কার্যক্রম' : 'আমার কার্যক্রম'}
        </h2>
        {activity.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">এখনো কোনো কার্যক্রম নেই।</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-accent/70 text-accent-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-semibold">ইউজারনেম</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">কাজ</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">বিস্তারিত</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">সময়</th>
                  {isAdmin && <th scope="col" className="px-3 py-2.5 font-semibold">ব্যবস্থা</th>}
                </tr>
              </thead>
              <tbody>
                {activity.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-3 py-2.5 font-medium">{a.moderatorName}</td>
                    <td className="px-3 py-2.5">{ACTION_LABELS[a.action] ?? a.action}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{a.details}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-muted-foreground">{formatBnDateTime(a.createdAt)}</td>
                    {isAdmin && (
                      <td className="px-3 py-2.5">
                        <AdminDeleteButton
                          action={deleteModeratorActivity.bind(null, a.id)}
                          confirmation="এই কার্যক্রমের রেকর্ডটি মুছে ফেলতে চান?"
                          label="মুছুন"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
