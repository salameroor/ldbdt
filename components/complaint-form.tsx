'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitComplaint } from '@/app/actions/complaints'
import type { FormState } from '@/app/actions/donors'
import type { Locale } from '@/lib/locale'
import { FormMessage } from './form-message'

const inputClass = 'w-full rounded-lg border border-input bg-card px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

export function ComplaintForm({ locale }: { locale: Locale }) {
  const en = locale === 'en'
  const [state, formAction, pending] = useActionState<FormState, FormData>(submitComplaint, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="complaint-name" className="text-sm font-medium">{en ? 'Name' : 'আপনার নাম'}</label>
          <input
            id="complaint-name"
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="complaint-phone" className="text-sm font-medium">{en ? 'Phone number' : 'মোবাইল নম্বর'}</label>
          <input
            id="complaint-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            pattern="(\+?88)?01[3-9][0-9]{8}"
            maxLength={14}
            placeholder={en ? '01XXXXXXXXX' : '01XXXXXXXXX'}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="complaint-message" className="text-sm font-medium">{en ? 'Complaint or feedback' : 'অভিযোগ বা মতামত'}</label>
        <textarea
          id="complaint-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className={`${inputClass} resize-y`}
        />
      </div>
      <FormMessage state={state} />
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (en ? 'Sending…' : 'পাঠানো হচ্ছে…') : (en ? 'Send message' : 'পাঠান')}
      </button>
    </form>
  )
}
