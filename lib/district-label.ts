import type { Locale } from '@/lib/locale'

const EN: Record<string, string> = {
  ঢাকা: 'Dhaka', গাজীপুর: 'Gazipur', নারায়ণগঞ্জ: 'Narayanganj', সাতক্ষীরা: 'Satkhira', খুলনা: 'Khulna', যশোর: 'Jashore', চট্টগ্রাম: 'Chattogram', রাজশাহী: 'Rajshahi', বরিশাল: 'Barishal', সিলেট: 'Sylhet', রংপুর: 'Rangpur', ময়মনসিংহ: 'Mymensingh', কুমিল্লা: 'Cumilla', কক্সবাজার: "Cox's Bazar",
}

export function districtLabel(value: string, locale: Locale) {
  return locale === 'en' ? EN[value] ?? value : value
}
