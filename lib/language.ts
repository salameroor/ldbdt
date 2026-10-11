import { cookies } from 'next/headers'

export type Language = 'bn' | 'en'

export async function getLanguage(): Promise<Language> {
  const value = (await cookies()).get('lifedrop-language')?.value
  return value === 'en' ? 'en' : 'bn'
}

export function translate(language: Language, bengali: string, english: string) {
  return language === 'en' ? english : bengali
}

export const DISTRICT_NAMES_EN: Record<string, string> = {
  'ঢাকা': 'Dhaka', 'গাজীপুর': 'Gazipur', 'নারায়ণগঞ্জ': 'Narayanganj', 'টাঙ্গাইল': 'Tangail', 'মুন্সিগঞ্জ': 'Munshiganj', 'মানিকগঞ্জ': 'Manikganj', 'নরসিংদী': 'Narsingdi', 'কিশোরগঞ্জ': 'Kishoreganj', 'ফরিদপুর': 'Faridpur', 'গোপালগঞ্জ': 'Gopalganj', 'মাদারীপুর': 'Madaripur', 'শরীয়তপুর': 'Shariatpur', 'রাজবাড়ী': 'Rajbari', 'চট্টগ্রাম': 'Chattogram', 'কক্সবাজার': 'Cox\'s Bazar', 'বান্দরবান': 'Bandarban', 'খাগড়াছড়ি': 'Khagrachhari', 'রাঙ্গামাটি': 'Rangamati', 'কুমিল্লা': 'Cumilla', 'ব্রাহ্মণবাড়িয়া': 'Brahmanbaria', 'চাঁদপুর': 'Chandpur', 'লক্ষ্মীপুর': 'Lakshmipur', 'নোয়াখালী': 'Noakhali', 'ফেনী': 'Feni', 'খুলনা': 'Khulna', 'যশোর': 'Jashore', 'সাতক্ষীরা': 'Satkhira', 'ঝিনাইদহ': 'Jhenaidah', 'মাগুরা': 'Magura', 'নড়াইল': 'Narail', 'বাগেরহাট': 'Bagerhat', 'চুয়াডাঙ্গা': 'Chuadanga', 'কুষ্টিয়া': 'Kushtia', 'মেহেরপুর': 'Meherpur', 'রাজশাহী': 'Rajshahi', 'নওগাঁ': 'Naogaon', 'নাটোর': 'Natore', 'চাঁপাইনবাবগঞ্জ': 'Chapainawabganj', 'পাবনা': 'Pabna', 'সিরাজগঞ্জ': 'Sirajganj', 'বগুড়া': 'Bogura', 'জয়পুরহাট': 'Joypurhat', 'বরিশাল': 'Barishal', 'পিরোজপুর': 'Pirojpur', 'ঝালকাঠি': 'Jhalokati', 'ভোলা': 'Bhola', 'পটুয়াখালী': 'Patuakhali', 'বরগুনা': 'Barguna', 'সিলেট': 'Sylhet', 'মৌলভীবাজার': 'Moulvibazar', 'হবিগঞ্জ': 'Habiganj', 'সুনামগঞ্জ': 'Sunamganj', 'রংপুর': 'Rangpur', 'দিনাজপুর': 'Dinajpur', 'কুড়িগ্রাম': 'Kurigram', 'গাইবান্ধা': 'Gaibandha', 'লালমনিরহাট': 'Lalmonirhat', 'নীলফামারী': 'Nilphamari', 'পঞ্চগড়': 'Panchagarh', 'ঠাকুরগাঁও': 'Thakurgaon', 'ময়মনসিংহ': 'Mymensingh', 'জামালপুর': 'Jamalpur', 'নেত্রকোনা': 'Netrokona', 'শেরপুর': 'Sherpur',
}

export function formatDate(value: string | Date | null, language: Language) {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat(language === 'en' ? 'en-BD' : 'bn-BD', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(date)
}

export function formatNumber(value: number | string, language: Language) {
  return new Intl.NumberFormat(language === 'en' ? 'en-BD' : 'bn-BD').format(Number(value))
}

export function pluralDonors(count: number, language: Language) {
  return language === 'en' ? `${formatNumber(count, language)} donor${count === 1 ? '' : 's'}` : `${formatNumber(count, language)} জন রক্তদাতা`
}

export function translateStatus(ready: boolean, language: Language) {
  return ready ? (language === 'en' ? 'Ready' : 'প্রস্তুত') : (language === 'en' ? 'Waiting' : 'অপেক্ষমাণ')
}

export const DEFAULT_LANGUAGE: Language = 'bn'
export const LANGUAGE_COOKIE = 'lifedrop-language'

export const supportedLanguages = ['bn', 'en'] as const
export const labels = { bn: 'বাংলা', en: 'English' } as const
export const languageDisplayNames = { bn: 'বাংলা', en: 'English' } as const
export const languageOptions = [{ value: 'bn', label: 'বাংলা' }, { value: 'en', label: 'English' }] as const
