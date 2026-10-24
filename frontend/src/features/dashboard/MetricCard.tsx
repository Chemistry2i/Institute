import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  note: string
  icon: LucideIcon
  tone: 'blue' | 'teal' | 'amber' | 'green'
}

export function MetricCard({ label, note, icon: Icon, tone }: MetricCardProps) {
  return (
    <article className="overview-item metric-card">
      <div className="metric-card-heading">
        <span className="metric-icon" data-tone={tone}>
          <Icon size={16} aria-hidden="true" />
        </span>
        <div className="overview-label">{label}</div>
      </div>
      <div className="overview-value" aria-label={`${label}: unavailable`}>--</div>
      <div className="overview-note">{note}</div>
    </article>
  )
}
