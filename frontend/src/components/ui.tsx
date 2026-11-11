import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { LoaderCircle, Search, TrendingUp, type LucideIcon } from 'lucide-react'

export function Button({ className, variant = 'primary', size = 'md', loading = false, loadingLabel = 'Loading', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' | 'soft' | 'danger'; size?: 'sm' | 'md'; loading?: boolean; loadingLabel?: string }) {
  return <button className={cn('ui-button', `ui-button-${variant}`, `ui-button-${size}`, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
    {loading && <LoadingSpinner size="sm" label={loadingLabel} />}
    {children}
  </button>
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('ui-card', className)} {...props} />
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; className?: string }) {
  return <span className={cn('ui-badge', `ui-badge-${tone}`, className)}>{children}</span>
}

export function KpiCard({ label, value, detail, icon: Icon, tone, change, className }: {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone: 'blue' | 'teal' | 'purple' | 'amber'
  change?: string
  className?: string
}) {
  return <Card className={cn('stat-card', 'kpi-card', className)}>
    <div className={`stat-icon stat-icon-${tone}`}><Icon size={19} /></div>
    <div className="stat-label">{label}</div>
    <div className="stat-value-row"><strong>{value}</strong>{change && <span className="stat-change"><TrendingUp size={13} /> {change}</span>}</div>
    <div className="stat-detail">{detail}</div>
  </Card>
}

export function LoadingSpinner({ label = 'Loading', size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`loading-spinner loading-spinner-${size}`} role="status" aria-label={label}>
    <LoaderCircle aria-hidden="true" />
  </span>
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('skeleton', className)} aria-hidden="true" {...props} />
}

export function KpiSkeleton() {
  return <Card className="stat-card kpi-card kpi-skeleton" aria-hidden="true">
    <Skeleton className="skeleton-icon" />
    <Skeleton className="skeleton-label" />
    <Skeleton className="skeleton-value" />
    <Skeleton className="skeleton-detail" />
  </Card>
}

export function TableSkeleton({ rows = 5, columns = 5, label = 'Loading records' }: { rows?: number; columns?: number; label?: string }) {
  return <div className="table-responsive skeleton-table-wrap" aria-busy="true">
    <table className="data-table skeleton-table" aria-hidden="true">
      <thead><tr>{Array.from({ length: columns }, (_, index) => <th key={index}><Skeleton className="skeleton-table-head" /></th>)}</tr></thead>
      <tbody>{Array.from({ length: rows }, (_, row) => <tr key={row}>{Array.from({ length: columns }, (_, column) => <td key={column}><Skeleton className={`skeleton-table-cell skeleton-table-cell-${column % 3}`} /></td>)}</tr>)}</tbody>
    </table>
    <div className="skeleton-loading-label"><LoadingSpinner size="sm" label={label} /><span>{label}</span></div>
  </div>
}

export function EmptyState({ title, description, actionLabel = 'Refresh', onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return <Card className="empty-state-panel">
    <div className="empty-state-icon"><Search size={18} /></div>
    <h3>{title}</h3>
    <p>{description}</p>
    {onAction && <Button variant="outline" size="sm" onClick={onAction}>{actionLabel}</Button>}
  </Card>
}

export function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry?: () => void }) {
  return <Card className="error-state-panel">
    <div className="error-state-icon"><LoaderCircle size={18} /></div>
    <h3>{title}</h3>
    <p>{description}</p>
    {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>}
  </Card>
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
