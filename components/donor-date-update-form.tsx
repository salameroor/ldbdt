'use client'

import { useActionState } from 'react'
import type { FormState } from '@/app/actions/donors'
import type { Locale } from '@/lib/locale'
import { FormMessage } from './form-message'

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  donorId: string
  lastDonationDate: string | null
  locale: Locale
}

export function DonorDateUpdateForm({ action, donorId, lastDonationDate, locale }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const en = locale === 'en'
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form action={formAction} className="mt-4 grid gap-2 rounded-2xl border border-[#eadfdf] bg-[#fffafa] p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor={`lastDonationDate-${donorId}`} className="text-sm font-semibold text-foreground">
          {en ? 'Update last donation date' : 'শেষ রক্তদানের তারিখ বদলান'}
        </label>
        <input
          id={`lastDonationDate-${donorId}`}
          name="lastDonationDate"
          type="date"
          max={today}
          required
          defaultValue={lastDonationDate ?? ''}
          className="min-h-11 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:shrink-0"
      >
        {pending ? (en ? 'Saving…' : 'সংরক্ষণ হচ্ছে…') : (en ? 'Update date' : 'তারিখ আপডেট')}
      </button>
      <div className="sm:col-span-2">
        <FormMessage state={state} />
      </div>
    </form>
  )
}
