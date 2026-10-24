import { lazy } from 'react'
import {
  Activity,
  ArrowRight,
  BookOpen,
  CircleHelp,
  ClipboardCheck,
  ListChecks,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { getNavigationForRole } from '../../config/access'
import { roleProfiles } from '../../config/roles'
import type { AppShellContext } from '../../components/layout/AppShell'
import { MetricCard } from './MetricCard'

const ActivityChart = lazy(async () => {
  const module = await import('./ActivityChart')
  return { default: module.ActivityChart }
})

const SuperAdministratorDashboard = lazy(async () => {
  const module = await import('./SuperAdministratorDashboard')
  return { default: module.SuperAdministratorDashboard }
})

const AcademicRegistrarDashboard = lazy(async () => {
  const module = await import('../registrar/AcademicRegistrarDashboard')
  return { default: module.AcademicRegistrarDashboard }
})

const metricVisuals = [
  { icon: UsersRound, tone: 'blue' },
  { icon: BookOpen, tone: 'teal' },
  { icon: ClipboardCheck, tone: 'amber' },
  { icon: WalletCards, tone: 'green' },
] as const

const emptyTrendData: Array<{ period: string; value: number }> = []

export function DashboardPage() {
  const { roleId } = useOutletContext<AppShellContext>()

  if (roleId === 'superAdministrator') {
    return <SuperAdministratorDashboard />
  }

  if (roleId === 'academicRegistrar') {
    return <AcademicRegistrarDashboard />
  }

  const profile = roleProfiles[roleId]
  const roleNavigation = getNavigationForRole(roleId)

  return (
    <section aria-labelledby="overview-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{profile.scope}</p>
          <h1 className="page-title" id="overview-title">{profile.label} dashboard</h1>
          <p className="page-description">{profile.description}</p>
        </div>
        <span className="system-status"><span className="status-dot" />Preview · API not connected</span>
      </div>

      <div className="overview-grid" aria-label="Role dashboard metrics unavailable">
        {profile.metrics.map((label, index) => (
          <MetricCard
            key={label}
            label={label}
            note="Live value unavailable"
            icon={metricVisuals[index].icon}
            tone={metricVisuals[index].tone}
          />
        ))}
      </div>

      <div className="dashboard-lower">
        <section className="surface-panel" aria-labelledby="trend-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="trend-title">Activity trends</h2>
              <p className="panel-subtitle">Recent activity within the assigned scope</p>
            </div>
            <Activity className="panel-heading-icon" size={17} aria-hidden="true" />
          </div>
          <ActivityChart
            data={emptyTrendData}
            accessibleLabel="Activity trend has no data because the API is not connected"
            emptyTitle="No activity data yet"
            emptyDescription="Connect an API to show trends."
          />
        </section>

        <section className="surface-panel" aria-labelledby="access-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="responsibilities-title">Role responsibilities</h2>
              <p className="panel-subtitle">Typical work in your assigned scope</p>
            </div>
            <ListChecks className="panel-heading-icon" size={17} aria-hidden="true" />
          </div>
          <ul className="responsibility-list">
            {profile.responsibilities.map((responsibility) => (
              <li key={responsibility}><span>{responsibility}</span><ArrowRight size={14} aria-hidden="true" /></li>
            ))}
          </ul>
        </section>

        <section className="surface-panel" aria-labelledby="quick-actions-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="quick-actions-title">Quick actions</h2>
              <p className="panel-subtitle">Available workspaces for this role</p>
            </div>
          </div>
          <div className="quick-actions-list">
            {roleNavigation.filter((item) => item.path !== '/').slice(0, 5).map(({ icon: Icon, label, path }) => (
              <Link className="quick-action" key={path} to={path}>
                <span className="quick-action-icon"><Icon size={14} aria-hidden="true" /></span>
                <span>{label}</span>
                <ArrowRight className="quick-action-arrow" size={13} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="module-notice" role="note">
        <CircleHelp size={18} aria-hidden="true" />
        <p>
          <strong>Role dashboard preview</strong>
          This preview changes frontend navigation only. The backend must authenticate the user and enforce these permissions before any protected data or action is available.
        </p>
      </div>
    </section>
  )
}