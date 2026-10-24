import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleInfo, faListCheck } from '@fortawesome/free-solid-svg-icons'
import { useOutletContext } from 'react-router-dom'
import { getNavigationForRole } from '../../config/access'
import { roleProfiles } from '../../config/roles'
import type { AppShellContext } from '../../components/layout/AppShell'

export function DashboardPage() {
  const { roleId } = useOutletContext<AppShellContext>()
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
        {profile.metrics.map((label) => (
          <article className="overview-item" key={label}>
            <div className="overview-label">{label}</div>
            <div className="overview-value" aria-label={`${label}: unavailable`}>--</div>
            <div className="overview-note">Live value unavailable</div>
          </article>
        ))}
      </div>

      <div className="dashboard-lower">
        <section className="surface-panel" aria-labelledby="responsibilities-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="responsibilities-title">Role responsibilities</h2>
              <p className="panel-subtitle">Typical work within the assigned scope</p>
            </div>
            <FontAwesomeIcon className="panel-heading-icon" icon={faListCheck} aria-hidden="true" />
          </div>
          <ul className="responsibility-list">
            {profile.responsibilities.map((responsibility) => (
              <li key={responsibility}>
                <span>{responsibility}</span>
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-panel" aria-labelledby="access-title">
          <div className="panel-heading">
            <div>
              <h2 className="panel-title" id="access-title">Available workspaces</h2>
              <p className="panel-subtitle">Based on this role preview</p>
            </div>
          </div>
          <ul className="workspace-list">
            {roleNavigation.filter((item) => item.path !== '/').map(({ icon, label, path }) => (
              <li key={path}>
                <span className="workspace-item-icon"><FontAwesomeIcon icon={icon} aria-hidden="true" /></span>
                <span>{label}</span>
                <FontAwesomeIcon className="workspace-arrow" icon={faArrowRight} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="module-notice" role="note">
        <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
        <p>
          <strong>Role dashboard preview</strong>
          This preview changes frontend navigation only. The backend must authenticate the user and enforce these permissions before any protected data or action is available.
        </p>
      </div>
    </section>
  )
}