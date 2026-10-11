'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Language = 'bn' | 'en'

const LanguageContext = createContext<{ language: Language; setLanguage: (value: Language) => void } | null>(null)

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode; initialLanguage: Language }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  const setLanguage = (value: Language) => {
    setLanguageState(value)
    document.cookie = `lifedrop_language=${value}; Path=/; Max-Age=31536000; SameSite=Lax`
    document.documentElement.lang = value
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

export function BilingualText({ bn, en, className }: { bn: string; en: string; className?: string }) {
  const { language } = useLanguage()
  return <span className={className}>{language === 'bn' ? bn : en}</span>
}

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  return (
    <div className={`inline-flex items-center rounded-full border bg-background p-1 ${className}`} role="group" aria-label="Choose language">
      <button
        type="button"
        aria-pressed={language === 'bn'}
        onClick={() => setLanguage('bn')}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${language === 'bn' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >বাংলা</button>
      <button
        type="button"
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en')}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >English</button>
    </div>
  )
}

export function translateMessage(message: string | undefined, language: Language) {
  if (!message || language === 'bn') return message
  const translations: Record<string, string> = {
    'নাম কমপক্ষে ২ অক্ষরের হতে হবে।': 'Name must be at least 2 characters.',
    'সঠিক মোবাইল নম্বর দিন।': 'Enter a valid mobile number.',
    'সঠিক রক্তের গ্রুপ নির্বাচন করুন।': 'Select a valid blood group.',
    'সঠিক জেলা নির্বাচন করুন।': 'Select a valid district.',
    'নির্বাচিত জেলার সঠিক উপজেলা নির্বাচন করুন।': 'Select a valid upazila for the selected district.',
    'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত।': 'This mobile number is already registered.',
    'ডোনার সফলভাবে যুক্ত হয়েছে।': 'Donor added successfully.',
    'ডোনারের তথ্য সফলভাবে আপডেট হয়েছে।': 'Donor information updated successfully.',
    'ডোনারটি সফলভাবে মুছে ফেলা হয়েছে।': 'Donor deleted successfully.',
    'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।': 'Something went wrong. Please try again.',
  }
  return translations[message] ?? message
}

export type { Language }

export function districtLabel(value: string, language: Language) {
  if (language === 'bn') return value
  const translations: Record<string, string> = {
    ঢাকা: 'Dhaka', গাজীপুর: 'Gazipur', নারায়ণগঞ্জ: 'Narayanganj', টাঙ্গাইল: 'Tangail', মুন্সিগঞ্জ: 'Munshiganj', মানিকগঞ্জ: 'Manikganj', নরসিংদী: 'Narsingdi', কিশোরগঞ্জ: 'Kishoreganj', ফরিদপুর: 'Faridpur', গোপালগঞ্জ: 'Gopalganj', মাদারীপুর: 'Madaripur', শরীয়তপুর: 'Shariatpur', রাজবাড়ী: 'Rajbari',
    চট্টগ্রাম: 'Chattogram', কক্সবাজার: 'Cox\'s Bazar', বান্দরবান: 'Bandarban', খাগড়াছড়ি: 'Khagrachhari', রাঙ্গামাটি: 'Rangamati', কুমিল্লা: 'Cumilla', ব্রাহ্মণবাড়িয়া: 'Brahmanbaria', চাঁদপুর: 'Chandpur', লক্ষ্মীপুর: 'Lakshmipur', নোয়াখালী: 'Noakhali', ফেনী: 'Feni',
    খুলনা: 'Khulna', যশোর: 'Jashore', সাতক্ষীরা: 'Satkhira', ঝিনাইদহ: 'Jhenaidah', মাগুরা: 'Magura', নড়াইল: 'Narail', বাগেরহাট: 'Bagerhat', চুয়াডাঙ্গা: 'Chuadanga', কুষ্টিয়া: 'Kushtia', মেহেরপুর: 'Meherpur',
    রাজশাহী: 'Rajshahi', নওগাঁ: 'Naogaon', নাটোর: 'Natore', চাঁপাইনবাবগঞ্জ: 'Chapainawabganj', পাবনা: 'Pabna', সিরাজগঞ্জ: 'Sirajganj', বগুড়া: 'Bogura', জয়পুরহাট: 'Joypurhat',
    বরিশাল: 'Barishal', পিরোজপুর: 'Pirojpur', ঝালকাঠি: 'Jhalokati', ভোলা: 'Bhola', পটুয়াখালী: 'Patuakhali', বরগুনা: 'Barguna',
    সিলেট: 'Sylhet', মৌলভীবাজার: 'Moulvibazar', হবিগঞ্জ: 'Habiganj', সুনামগঞ্জ: 'Sunamganj',
    রংপুর: 'Rangpur', দিনাজপুর: 'Dinajpur', কুড়িগ্রাম: 'Kurigram', গাইবান্ধা: 'Gaibandha', লালমনিরহাট: 'Lalmonirhat', নীলফামারী: 'Nilphamari', পঞ্চগড়: 'Panchagarh', ঠাকুরগাঁও: 'Thakurgaon',
    ময়মনসিংহ: 'Mymensingh', জামালপুর: 'Jamalpur', নেত্রকোনা: 'Netrokona', শেরপুর: 'Sherpur',
  }
  return translations[value] ?? value
}

export function bloodGroupName(value: string, language: Language) {
  if (language === 'bn') return value
  return `${value} blood group`
}

export function pageTranslation(bn: string, language: Language) {
  if (language === 'bn') return bn
  const translations: Record<string, string> = {
    'হোম': 'Home', 'ডোনার তালিকা': 'Donor Directory', 'ডোনার যুক্ত করুন': 'Add a Donor', 'নতুন ডোনার যুক্ত করুন': 'Register as a Donor',
    'রক্ত খুঁজুন': 'Find Blood', 'শেষ রক্তদান': 'Recent Donations', 'আমাদের সম্পর্কে': 'About Us', 'যোগাযোগ': 'Contact',
    'অ্যাডমিন / মডারেটর লগইন': 'Admin / Moderator Login', 'অ্যাডমিন লগইন': 'Admin Login',
    'মোট ডোনার': 'Total Donors', 'আজকের নতুন ডোনার': 'New Donors Today', 'রক্ত দিতে প্রস্তুত': 'Ready to Donate',
    'রক্তের গ্রুপ অনুযায়ী ডোনার': 'Find Donors by Blood Group', 'গুরুত্বপূর্ণ তথ্য': 'Important Information',
    'রক্ত দিন, জীবন বাঁচান।': 'Donate blood, save lives.', 'প্রস্তুত': 'Ready', 'অপেক্ষমাণ': 'Waiting period',
    'নাম': 'Name', 'রক্তের গ্রুপ': 'Blood Group', 'মোবাইল': 'Phone', 'মোবাইল নম্বর': 'Phone Number', 'এলাকা': 'Area', 'অবস্থা': 'Status', 'এডিট': 'Edit',
    'প্রধান মেনু': 'Main menu', 'মোবাইল মেনু': 'Mobile menu', 'মেনু': 'Menu', 'অ্যাডমিন': 'Admin', 'মডারেটর': 'Moderator',
    'হটলাইন': 'Hotline', 'ইমেইল': 'Email', 'ঠিকানা': 'Address',
    'জরুরি রক্তের প্রয়োজনে বা যেকোনো তথ্যের জন্য যোগাযোগ করুন।': 'For urgent blood requests or more information, please contact us.',
    'এক ব্যাগ রক্ত, একাধিক জীবন বাঁচাতে পারে।': 'One bag of blood can save multiple lives.',
    'জরুরি রক্তের অনুরোধ': 'Request Blood', 'রক্তদাতা খুঁজুন': 'Find a Donor', 'স্বেচ্ছায় রক্তদান করুন': 'Donate Voluntarily',
    'স্বেচ্ছাসেবী রক্তদাতা দল': 'Volunteer Blood Donor Team', 'রক্তদাতা হিসেবে নিবন্ধন': 'Register as a Donor', 'জীবন বাঁচান': 'Save Lives', 'সারা বাংলাদেশ': 'Across Bangladesh',
    'ডোনার সফলভাবে যুক্ত হয়েছে।': 'Donor added successfully.',
  }
  return translations[bn] ?? bn
}

export function formatNumber(value: number, language: Language) {
  return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : 'en-US').format(value)
}

export function formatDistrictName(value: string, language: Language) {
  return districtLabel(value, language)
}

export function translateRole(value: string, language: Language) {
  if (language === 'bn') return value
  return value === 'অ্যাডমিন' ? 'Admin' : value === 'মডারেটর' ? 'Moderator' : value
}

export function translateContactLabel(value: string, language: Language) {
  return pageTranslation(value, language)
}

export function translateSearch(value: string, language: Language) {
  return pageTranslation(value, language)
}

export function translateForm(value: string, language: Language) {
  if (language === 'bn') return value
  const forms: Record<string, string> = {
    'নাম (বাংলা) *': 'Name *', 'রক্তের গ্রুপ *': 'Blood Group *', 'মোবাইল নম্বর *': 'Phone Number *', 'ঠিকানা': 'Address', 'গ্রাম / রোড / এলাকা': 'Village / Road / Area',
    'জেলা *': 'District *', 'উপজেলা *': 'Upazila *', 'উপজেলা নির্বাচন করুন': 'Select upazila', 'শেষ রক্তদানের তারিখ': 'Last Donation Date', 'রক্ত দিতে ইচ্ছুক / সক্রিয়': 'Available to donate / Active',
    'অপেক্ষা করুন...': 'Please wait...', 'ডোনার যুক্ত করুন': 'Add Donor', 'আপডেট করুন': 'Update Donor', 'ডোনার আপডেট করুন': 'Update Donor',
  }
  return forms[value] ?? value
}

export function formatDate(value: Date | string | null | undefined, language: Language) {
  if (!value) return language === 'bn' ? 'তথ্য নেই' : 'Not provided'
  const date = new Date(value)
  return new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}
