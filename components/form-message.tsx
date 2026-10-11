import type { FormState } from '@/app/actions/donors'

export function FormMessage({ state }: { state: FormState }) {
  if (!state?.error && !state?.success) return null
  return (
    <p
      role={state.error ? 'alert' : 'status'}
      className={
        state.error
          ? 'rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'
          : 'rounded-lg bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary'
      }
    >
      {state.error ?? state.success}
    </p>
  )
}
