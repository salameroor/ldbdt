export function SiteFooter({ locale }: { locale: 'bn' | 'en' }) {
  return (
    <footer className="mt-12 border-t bg-accent/60 py-8 text-center">
      <p className="font-semibold text-primary">{locale === 'bn' ? 'রক্ত দিন, জীবন বাঁচান।' : 'Donate blood, save lives.'}</p>
      <p className="mt-2 text-sm text-muted-foreground">© LifeDrop Blood Donor Team Bangladesh</p>
    </footer>
  )
}
