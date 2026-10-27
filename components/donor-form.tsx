'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { BLOOD_GROUPS, DISTRICTS, UPAZILAS_BY_DISTRICT } from '@/lib/constants'
import type { FormState } from '@/app/actions/donors'
import type { Locale } from '@/lib/locale'
import { districtLabel } from '@/lib/district-label'
import { FormMessage } from './form-message'

type Defaults = {
  name?: string
  bloodGroup?: string
  phone?: string
  district?: string
  upazila?: string | null
  union?: string | null
  area?: string
  age?: string | null
  lastDonationDate?: string | null
  available?: boolean
}

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  defaults?: Defaults
  submitLabel: string
  showAvailability?: boolean
  locale?: Locale
}

export const inputClass =
  'w-full rounded-lg border border-input bg-card px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

export function DonorForm({ action, defaults, submitLabel, showAvailability, locale = 'bn' }: Props) {
  const en = locale === 'en'
  const [state, formAction, pending] = useActionState(action, undefined)
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedDistrict, setSelectedDistrict] = useState(defaults?.district ?? 'সাতক্ষীরা')
  const [selectedUpazila, setSelectedUpazila] = useState(defaults?.upazila ?? (defaults ? '' : 'কালীগঞ্জ'))
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (state?.success && !defaults) {
      formRef.current?.reset()
      setSelectedDistrict('সাতক্ষীরা')
      setSelectedUpazila('কালীগঞ্জ')
    }
  }, [state, defaults])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">{en ? 'Name (Bangla) *' : 'নাম (বাংলা) *'}</label>
        <input id="name" name="name" required minLength={2} maxLength={80} defaultValue={defaults?.name} className={inputClass} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="bloodGroup" className="text-sm font-medium">{en ? 'Blood group *' : 'রক্তের গ্রুপ *'}</label>
          <select id="bloodGroup" name="bloodGroup" required defaultValue={defaults?.bloodGroup ?? 'A+'} className={inputClass}>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">{en ? 'Phone number *' : 'মোবাইল নম্বর *'}</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            placeholder="01XXXXXXXXX"
            defaultValue={defaults?.phone}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="text-sm font-medium">{en ? 'Address' : 'ঠিকানা'}</label>
        <input id="address" name="address" maxLength={160} defaultValue={defaults?.area} placeholder={en ? 'Village / road / area' : 'গ্রাম / রোড / এলাকা'} className={inputClass} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="district" className="text-sm font-medium">{en ? 'District *' : 'জেলা *'}</label>
          <select
            id="district"
            name="district"
            required
            value={selectedDistrict}
            onChange={(event) => {
              setSelectedDistrict(event.target.value)
              setSelectedUpazila('')
            }}
            className={inputClass}
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{districtLabel(d, locale)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="upazila" className="text-sm font-medium">{en ? 'Upazila *' : 'উপজেলা *'}</label>
          <select id="upazila" name="upazila" required value={selectedUpazila} onChange={(event) => setSelectedUpazila(event.target.value)} className={inputClass}>
            <option value="" disabled>{en ? 'Choose upazila' : 'উপজেলা নির্বাচন করুন'}</option>
            {[...(UPAZILAS_BY_DISTRICT[selectedDistrict] ?? [])].sort((a, b) => a.localeCompare(b, 'bn')).map((upazila) => <option key={upazila} value={upazila}>{upazila}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="union" className="text-sm font-medium">{en ? 'Union (optional)' : 'ইউনিয়ন (ঐচ্ছিক)'}</label>
          <input id="union" name="union" maxLength={80} defaultValue={defaults?.union ?? ''} className={inputClass} />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="age" className="text-sm font-medium">{en ? 'Age (optional)' : 'বয়স (ঐচ্ছিক)'}</label>
          <input id="age" name="age" type="number" min="1" max="120" defaultValue={defaults?.age ?? ''} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lastDonationDate" className="text-sm font-medium">{en ? 'Last donation date' : 'শেষ রক্তদানের তারিখ'}</label>
        <input
          id="lastDonationDate"
          name="lastDonationDate"
          type="date"
          max={today}
          defaultValue={defaults?.lastDonationDate ?? ''}
          className={inputClass}
        />
      </div>

      {showAvailability && (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="available" defaultChecked={defaults?.available ?? true} className="size-4 accent-primary" />
          {en ? 'Available / active donor' : 'রক্ত দিতে ইচ্ছুক / সক্রিয়'}
        </label>
      )}

      <label className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm leading-6 text-foreground">
        <input type="checkbox" name="publicConsent" required className="mt-1 size-4 shrink-0 accent-primary" />
        <span>{en ? 'I confirm this donor agreed to show their name, phone number, address, and donation date publicly.' : 'আমি নিশ্চিত করছি, এই ডোনার তাঁর নাম, ফোন নম্বর, ঠিকানা ও রক্তদানের তারিখ সবার জন্য প্রকাশে সম্মতি দিয়েছেন।'}</span>
      </label>

      <FormMessage state={state} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? (en ? 'Please wait...' : 'অপেক্ষা করুন...') : submitLabel}
      </button>
    </form>
  )
}
