'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut()
        router.push('/admin/login')
        router.refresh()
      }}
      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
    >
      <LogOut className="size-4" aria-hidden="true" />
      লগআউট
    </button>
  )
}
