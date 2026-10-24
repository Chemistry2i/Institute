import {
  Activity,
  ArrowRight,
  ClipboardList,
  HeartPulse,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { lazy } from 'react'
import { Link } from 'react-router-dom'
import { hasPermission } from '../../config/access'
import { roleProfiles } from '../../config/roles'
import type { AppShellContext } from '../../components/layout/AppShell'
import { useOutletContext } from 'react-router-dom'
import { MetricCard } from './MetricCard'

const ActivityChart = lazy(async () => {
  const module = await import('./ActivityChart')
  return { default: module.ActivityChart }
})

const actions = [
  { label: 'Review security and audit events', path: '/audit', permission: 'audit.read' as const, icon: ShieldCheck },
  { label: 'Configure institution settings', path: '/settings', permission: 'system.configure' as const, icon: ClipboardList },
  { label: 'Manage user access', path: '/settings', permission: 'users.manage' as const, icon: UsersRound },
  { label: 'Review integrations and health', path: '/settings', permission: 'system.health.read' as const, icon: HeartPulse },
]

const activityData: Array<{ period: string; value: number }> = []

export function SuperAdministratorDashboard() {
  const { roleId } = useOutletContext<AppShellContext>()
  const profile = roleProfiles[roleId]

  return (
    <section aria-labelledby="overview-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Institution-wide operations</p>
          <h1 className="page-title" id="overview-title">Super Administrator dashboard</h1>
          <p className="page-description">System configuration, access oversight and operational health.</p>
        </div>
        <span className="system-status"><span className="status-dot" />Preview · API not connected</span>
      </div>

      <div className="overview-grid" aria-label="System metrics unavailable">
        <MetricCard label={profile.metrics[0]} note="Awaiting account service" icon={UsersRound} tone="blue" />
        <MetricCard label={profile.metrics[1]} note="Awaiting configuration service" icon={ClipboardList} tone="teal" />
        <MetricCard label={profile.metrics[2]} note="Awaiting audit service" icon={ShieldCheck} tone="amber" />
        <MetricCard label={profile.metrics[3]} note="Awaiting health checks" icon={HeartPulse} tone="green" />
      </div>

      <div className="dashboard-lower super-admin-panels">
        <section className="surface-panel analytics-panel" aria-labelledby="activity-chart-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="activity-chart-title">System activity</h2>
              <p className="panel-subtitle">Audited administrative events over time</p>
            </div>
            <Activity className="panel-heading-icon" size={17} aria-hidden="true" />
          </div>
          <ActivityChart
            data={activityData}
            accessibleLabel="System activity chart has no data because the audit API is not connected"
            emptyTitle="No activity data yet"
            emptyDescription="Connect the audit API to populate this chart."
          />
        </section>

        <section className="surface-panel quick-actions-panel" aria-labelledby="quick-actions-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="quick-actions-title">Quick actions</h2>
              <p className="panel-subtitle">Available to this preview role</p>
            </div>
          </div>
          <div className="quick-actions-list">
            {actions.filter((action) => hasPermission(roleId, action.permission)).map(({ icon: Icon, label, path }) => (
              <Link className="quick-action" key={label} to={path}>
                <span className="quick-action-icon"><Icon size={15} aria-hidden="true" /></span>
                <span>{label}</span>
                <ArrowRight className="quick-action-arrow" size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="module-notice" role="note">
        <ShieldCheck size={18} aria-hidden="true" />
        <p>
          <strong>Operational data is not connected</strong>
          Metrics, audit activity and system health are intentionally blank until they come from permission-checked backend services.
        </p>
      </div>
    </section>
  )
}
