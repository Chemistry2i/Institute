interface LoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({ label = 'Loading' }: LoadingSpinnerProps) {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label={label}>
      <span className="spinner-border loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}