'use client'

import { useActionState, useEffect, useRef } from 'react'
import type { FormState } from '@/app/actions/donors'
import { FormMessage } from './form-message'
import { inputClass } from './donor-form'

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  submitLabel: string
  withSetupKey?: boolean
}

export function AccountForm({ action, submitLabel, withSetupKey }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) formRef.current?.reset()
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {withSetupKey && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="setupKey" className="text-sm font-medium">সেটআপ কী (ADMIN_SETUP_KEY)</label>
          <input id="setupKey" name="setupKey" type="password" required className={inputClass} />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="acc-name" className="text-sm font-medium">ইউজারনেম</label>
        <input id="acc-name" name="name" required minLength={3} maxLength={40} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="acc-email" className="text-sm font-medium">ইমেইল</label>
        <input id="acc-email" name="email" type="email" required autoComplete="off" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="acc-password" className="text-sm font-medium">পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)</label>
        <input id="acc-password" name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
      </div>
      <FormMessage state={state} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? 'অপেক্ষা করুন...' : submitLabel}
      </button>
    </form>
  )
}
