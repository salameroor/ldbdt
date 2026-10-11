import { cookies } from 'next/headers'

export type Locale = 'bn' | 'en'

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get('lifedrop-locale')?.value
  return value === 'en' ? 'en' : 'bn'
}

const translations: Record<string, [string, string]> = {
  home: ['হোম', 'Home'],
  donors: ['ডোনার তালিকা', 'Donors'],
  addDonor: ['ডোনার যুক্ত করুন', 'Add donor'],
  search: ['রক্ত খুঁজুন', 'Request blood'],
  lastDonation: ['শেষ রক্তদান', 'Last donation'],
  about: ['আমাদের সম্পর্কে', 'About us'],
  contact: ['যোগাযোগ', 'Contact'],
  admin: ['অ্যাডমিন', 'Admin'],
  moderator: ['মডারেটর', 'Moderator'],
  adminLogin: ['অ্যাডমিন লগইন', 'Staff login'],
  menu: ['মেনু', 'Menu'],
  mainMenu: ['প্রধান মেনু', 'Main menu'],
  mobileMenu: ['মোবাইল মেনু', 'Mobile menu'],
  footerSlogan: ['রক্ত দিন, জীবন বাঁচান।', 'Give blood, save lives.'],
  brand: ['লাইফড্রপ রক্তদাতা দল', 'LifeDrop Blood Donor Team'],
  voluntary: ['স্বেচ্ছাসেবী রক্তদাতা দল', 'Voluntary Blood Donor Team'],
  tagline: ['এক ব্যাগ রক্ত, একাধিক জীবন বাঁচাতে পারে।', 'One bag of blood can save multiple lives.'],
  heroSummary: ['জরুরি রক্তের অনুরোধ · রক্তদাতা খুঁজুন · স্বেচ্ছায় রক্তদান করুন', 'Request blood · Find donors · Donate voluntarily'],
  findDonor: ['রক্তদাতা খুঁজুন', 'Find a donor'],
  registerDonor: ['রক্তদাতা হিসেবে নিবন্ধন', 'Register as a donor'],
  saveLives: ['জীবন বাঁচান', 'Save lives'],
  donorCount: ['জন ডোনার', 'donors'],
  nationwide: ['সারা বাংলাদেশ', 'Nationwide'],
  totalDonors: ['মোট ডোনার', 'Total donors'],
  newToday: ['আজকের নতুন ডোনার', 'New donors today'],
  readyToDonate: ['রক্ত দিতে প্রস্তুত', 'Ready to donate'],
  donorsByBlood: ['রক্তের গ্রুপ অনুযায়ী ডোনার', 'Donors by blood group'],
  people: ['জন', 'people'],
  importantInfo: ['গুরুত্বপূর্ণ তথ্য', 'Important information'],
  donorCaution: ['এখানে দেখানো ডোনারের তথ্যের ভিত্তিতে অনুমান করা হতে পারে। রক্তদাতার সাথে যোগাযোগ করে বর্তমান রক্ত দিতে প্রস্তুত কি নিশ্চিত করুন। জরুরি পরিস্থিতিতে নিকটস্থ হাসপাতাল বা ব্লাড ব্যাংকের সাথেও যোগাযোগ করুন।', 'Donor information shown here may be approximate. Contact the donor to confirm they are currently available to donate. In an emergency, also contact a nearby hospital or blood bank.'],
  donorDescription: ['নিবন্ধিত রক্তদাতাদের তালিকা', 'List of registered blood donors'],
  bloodGroup: ['রক্তের গ্রুপ', 'Blood group'],
  phone: ['মোবাইল', 'Phone'],
  area: ['এলাকা', 'Area'],
  status: ['অবস্থা', 'Status'],
  edit: ['এডিট', 'Edit'],
  name: ['নাম', 'Name'],
  ready: ['প্রস্তুত', 'Available'],
  waiting: ['অপেক্ষমাণ', 'Waiting'],
  noDonors: ['কোনো ডোনার পাওয়া যায়নি।', 'No donors found.'],
  loginToEdit: ['এডিট করতে লগইন করুন', 'Log in to edit'],
  addDonorTitle: ['নতুন ডোনার যুক্ত করুন', 'Add a new donor'],
  addDonorDescription: ['যে কোনো সদস্য নতুন রক্তদাতা যুক্ত করতে পারবেন।', 'Anyone can add a new blood donor.'],
  donorName: ['নাম (বাংলা) *', 'Name *'],
  bloodGroupRequired: ['রক্তের গ্রুপ *', 'Blood group *'],
  phoneRequired: ['মোবাইল নম্বর *', 'Phone number *'],
  address: ['ঠিকানা', 'Address'],
  addressPlaceholder: ['গ্রাম / রোড / এলাকা', 'Village / road / area'],
  district: ['জেলা *', 'District *'],
  upazila: ['উপজেলা *', 'Sub-district *'],
  selectUpazila: ['উপজেলা নির্বাচন করুন', 'Select sub-district'],
  donationDate: ['শেষ রক্তদানের তারিখ', 'Last donation date'],
  active: ['রক্ত দিতে ইচ্ছুক / সক্রিয়', 'Willing to donate / active'],
  submitDonor: ['ডোনার যুক্ত করুন', 'Add donor'],
  wait: ['অপেক্ষা করুন...', 'Please wait...'],
  searchTitle: ['রক্ত খুঁজুন', 'Find blood donors'],
  searchDescription: ['রক্তের গ্রুপ ও জেলা নির্বাচন করে রক্তদাতা খুঁজুন।', 'Choose a blood group and district to find donors.'],
  allGroups: ['সব গ্রুপ', 'All groups'],
  allDistricts: ['সব জেলা', 'All districts'],
  readyOnly: ['শুধু প্রস্তুত ডোনার', 'Available donors only'],
  searchButton: ['খুঁজুন', 'Search'],
  donorsFound: ['জন রক্তদাতা পাওয়া গেছে', 'donors found'],
  chooseFilters: ['খুঁজতে উপরের ফিল্টার নির্বাচন করে "খুঁজুন" চাপুন।', 'Choose filters above and press "Search" to find donors.'],
  contactDescription: ['জরুরি রক্তের প্রয়োজনে বা যেকোনো তথ্যের জন্য যোগাযোগ করুন।', 'Contact us for urgent blood needs or any information.'],
  hotline: ['হটলাইন', 'Hotline'],
  email: ['ইমেইল', 'Email'],
  aboutIntro: ['লাইফড্রপ রক্তদাতা দল (LifeDrop Blood Donor Team) একটি স্বেচ্ছাসেবী সংগঠন। জরুরি মুহূর্তে সঠিক রক্তের গ্রুপের রক্তদাতা খুঁজে পাওয়া সহজ করতেই আমাদের এই উদ্যোগ। আপনার এক ব্যাগ রক্ত একজন মানুষের নতুন জীবনের আশা হতে পারে।', 'LifeDrop Blood Donor Team is a volunteer organization. We make it easier to find the right blood group donor in an emergency. Your one bag of blood can give someone hope for a new life.'],
  volunteer: ['স্বেচ্ছাসেবা', 'Volunteering'],
  volunteerText: ['আমরা বিনামূল্যে, সম্পূর্ণ স্বেচ্ছায় রক্তদাতা ও রোগীর মধ্যে সংযোগ তৈরি করি।', 'We connect donors and patients for free, entirely through volunteering.'],
  everyone: ['সবার জন্য', 'For everyone'],
  everyoneText: ['ধর্ম, বর্ণ, দল নির্বিশেষে প্রয়োজনে সবার পাশে দাঁড়ানোই আমাদের লক্ষ্য।', 'Our goal is to stand beside everyone in need, regardless of religion, ethnicity, or affiliation.'],
  trust: ['বিশ্বস্ততা', 'Trust'],
  trustText: ['মডারেটররা নিয়মিত ডোনারের তথ্য যাচাই ও হালনাগাদ করেন।', 'Moderators regularly verify and update donor information.'],
  donationDescription: ['সাম্প্রতিক রক্তদানের তালিকা। রক্তদানের ৯০ দিন পর আবার রক্ত দেওয়া যায়।', 'Recent donations. You may donate blood again 90 days after your last donation.'],
  noDonationData: ['এখনো কোনো রক্তদানের তথ্য নেই।', 'No donation records yet.'],
}

export function t(locale: Locale, key: keyof typeof translations): string {
  return translations[key][locale === 'en' ? 1 : 0]
}

export function localeDate(value: string | Date | null, locale: Locale): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export function localeNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'bn-BD').format(value)
}

export function districtName(value: string, locale: Locale): string {
  if (locale === 'bn') return value
  return DISTRICT_EN[value] ?? value
}

const DISTRICT_EN: Record<string, string> = {
  ঢাকা: 'Dhaka',
  গাজীপুর: 'Gazipur',
  নারায়ণগঞ্জ: 'Narayanganj',
  টাঙ্গাইল: 'Tangail',
  মুন্সিগঞ্জ: 'Munshiganj',
  মানিকগঞ্জ: 'Manikganj',
  নরসিংদী: 'Narsingdi',
  কিশোরগঞ্জ: 'Kishoreganj',
  ফরিদপুর: 'Faridpur',
  গোপালগঞ্জ: 'Gopalganj',
  মাদারীপুর: 'Madaripur',
  শরীয়তপুর: 'Shariatpur',
  রাজবাড়ী: 'Rajbari',
  চট্টগ্রাম: 'Chattogram',
  কক্সবাজার: "Cox's Bazar",
  বান্দরবান: 'Bandarban',
  খাগড়াছড়ি: 'Khagrachhari',
  রাঙ্গামাটি: 'Rangamati',
}

export function upazilaName(value: string, locale: Locale): string {
  if (locale === 'bn') return value
  return UPAZILA_EN[value] ?? value
}

const UPAZILA_EN: Record<string, string> = {
  কালীগঞ্জ: 'Kaliganj',
  আশাশুনি: 'Assasuni',
  দেবহাটা: 'Debhata',
  কলারোয়া: 'Kalaroa',
}

export const languageNames = { bn: 'বাংলা', en: 'English' } as const
export const allDistrictNames = DISTRICT_EN
export const allUpazilaNames = UPAZILA_EN
export const translateUpazila = upazilaName
export const translateDistrict = districtName
export const translate = t
export const getCurrentLocale = getLocale
export type { Locale as SiteLocale }
