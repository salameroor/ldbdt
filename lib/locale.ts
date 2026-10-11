import { cookies } from 'next/headers'

export type Locale = 'bn' | 'en'

export async function getLocale(): Promise<Locale> {
  return (await cookies()).get('lifedrop-locale')?.value === 'en' ? 'en' : 'bn'
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-US').format(value)
}

export function formatDate(value: Date | string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}
