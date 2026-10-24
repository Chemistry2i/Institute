import { lazy, Suspense } from 'react'
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  CalendarCheck2,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
} from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import { getNavigationForRole } from '../../config/access'
import { roleProfiles } from '../../config/roles'
import type { AppShellContext } from '../../components/layout/AppShell'
import { MetricCard } from '../dashboard/MetricCard'

const ActivityChart = lazy(async () => {
  const module = await import('../dashboard/ActivityChart')
  return { default: module.ActivityChart }
})

const metricIcons = [ClipboardList, CalendarCheck2, FileCheck2, Award] as const
const metricTones = ['blue', 'teal', 'amber', 'green'] as const
const trendData: Array<{ period: string; value: number }> = []

export function AcademicRegistrarDashboard() {
  const { roleId } = useOutletContext<AppShellContext>()
  const profile = roleProfiles[roleId]
  const registrarLinks = getNavigationForRole(roleId).filter((item) => item.path !== '/')

  return (
    <section aria-labelledby="registrar-dashboard-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Academic administration · Institution-wide</p>
          <h1 className="page-title" id="registrar-dashboard-title">Academic Registrar</h1>
          <p className="page-description">Coordinate records, registration, examination processing and completion reviews.</p>
        </div>
        <span className="system-status"><span className="status-dot" />API not connected</span>
      </div>

      <div className="overview-grid" aria-label="Registrar metrics unavailable">
        {profile.metrics.map((label, index) => (
          <MetricCard
            key={label}
            label={label}
            note="Awaiting academic records API"
            icon={metricIcons[index]}
            tone={metricTones[index]}
          />
        ))}
      </div>

      <div className="registrar-dashboard-grid">
        <section className="surface-panel registrar-queue" aria-labelledby="registrar-queue-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="registrar-queue-title">Academic review queues</h2>
              <p className="panel-subtitle">Priority work across the registrar’s scope</p>
            </div>
            <ClipboardCheck className="panel-heading-icon" size={17} aria-hidden="true" />
          </div>
          <div className="registrar-queue-list">
            {[
              { label: 'Admissions awaiting review', path: '/admissions', icon: ClipboardList },
              { label: 'Registrations requiring approval', path: '/registration', icon: CalendarCheck2 },
              { label: 'Results awaiting approval', path: '/results', icon: FileCheck2 },
              { label: 'Graduation checks to complete', path: '/graduation', icon: Award },
            ].map(({ label, path, icon: Icon }) => (
              <Link className="registrar-queue-link" key={path} to={path}>
                <span className="quick-action-icon"><Icon size={14} aria-hidden="true" /></span>
                <span>{label}</span>
                <span className="queue-value" aria-label="Count unavailable">--</span>
                <ArrowRight className="quick-action-arrow" size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="surface-panel registrar-shortcuts" aria-labelledby="registrar-shortcuts-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="registrar-shortcuts-title">Registrar workspaces</h2>
              <p className="panel-subtitle">Pages available to this role</p>
            </div>
            <BookOpenCheck className="panel-heading-icon" size={17} aria-hidden="true" />
          </div>
          <div className="registrar-shortcut-grid">
            {registrarLinks.map(({ icon: Icon, label, path }) => (
              <Link className="registrar-shortcut" key={path} to={path}>
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="surface-panel registrar-trend" aria-labelledby="registrar-trend-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="registrar-trend-title">Academic processing</h2>
              <p className="panel-subtitle">Application, registration and results activity</p>
            </div>
          </div>
          <Suspense fallback={<div className="analytics-chart chart-loading" role="status">Loading chart…</div>}>
            <ActivityChart
              data={trendData}
              accessibleLabel="Academic processing chart has no data because the API is not connected"
              emptyTitle="No processing data yet"
              emptyDescription="Activity appears here when connected to academic services."
            />
          </Suspense>
        </section>

        <section className="surface-panel registrar-responsibilities" aria-labelledby="registrar-responsibilities-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="registrar-responsibilities-title">Role responsibilities</h2>
              <p className="panel-subtitle">Within the configured approval scope</p>
            </div>
          </div>
          <ul className="responsibility-list">
            {profile.responsibilities.map((responsibility) => (
              <li key={responsibility}><span>{responsibility}</span><ArrowRight size={13} aria-hidden="true" /></li>
            ))}
          </ul>
        </section>
      </div>

      <div className="module-notice" role="note">
        <ClipboardCheck size={18} aria-hidden="true" />
        <p>
          <strong>Registrar workspace preview</strong>
          Counts, records and approvals are blank until loaded from permission-checked services. Approval authority must be configured by the institution.
        </p>
      </div>
    </section>
  )
}
