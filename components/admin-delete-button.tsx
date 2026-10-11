'use client'

type AdminDeleteButtonProps = {
  action: (formData: FormData) => void | Promise<void>
  confirmation: string
  label: string
}

export function AdminDeleteButton({ action, confirmation, label }: AdminDeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmation)) event.preventDefault()
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 px-2.5 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
      >
        {label}
      </button>
    </form>
  )
}
