import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faGraduationCap, faMoon, faBars, faSun, faXmark } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getNavigationForRole } from '../../config/access'
import { roleProfiles, type RoleId } from '../../config/roles'
import '../../App.css'

export interface AppShellContext {
  roleId: RoleId
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [roleId, setRoleId] = useState<RoleId>('institutionHead')
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  )
  const location = useLocation()
  const visibleNavigation = getNavigationForRole(roleId)
  const activePage = visibleNavigation.find((item) => item.path === location.pathname)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="app-shell">
      <aside className={`sidebar${menuOpen ? ' is-open' : ''}`}>
        <NavLink className="brand" to="/" aria-label="ACMIS overview">
          <span className="brand-mark"><FontAwesomeIcon icon={faGraduationCap} aria-hidden="true" /></span>
          <span>
            <span className="brand-name">ACMIS</span>
            <span className="brand-caption">Academic Management</span>
          </span>
        </NavLink>

        <nav className="primary-nav" aria-label="Main navigation">
          {['Workspace', 'Academic', 'Student services', 'Administration'].map((group) => {
            const groupItems = visibleNavigation.filter((item) => item.group === group)
            if (groupItems.length === 0) return null
            return (
              <div className="nav-group" key={group}>
                <p className="nav-label">{group}</p>
                {groupItems.map(({ icon, label, path }) => (
                  <NavLink
                    key={path}
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    to={path}
                    end={path === '/'}
                    onClick={() => setMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={icon} aria-hidden="true" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          Frontend foundation<br />
          Backend connection pending
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-start">
            <button
              className="mobile-menu-button"
              type="button"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} aria-hidden="true" />
            </button>
            <span className="breadcrumb">ACMIS&nbsp; / &nbsp;{activePage?.label ?? 'Overview'}</span>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Notifications unavailable until sign in is connected" disabled>
              <FontAwesomeIcon icon={faBell} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
            >
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} aria-hidden="true" />
            </button>
            <label className="role-preview">
              <span>Preview role</span>
              <select
                aria-label="Preview dashboard as role"
                value={roleId}
                onChange={(event) => {
                  const selectedRoleId = event.target.value
                  if (Object.hasOwn(roleProfiles, selectedRoleId)) {
                    setRoleId(selectedRoleId as RoleId)
                  }
                }}
              >
                {Object.entries(roleProfiles).map(([id, profile]) => (
                  <option key={id} value={id}>{profile.label}</option>
                ))}
              </select>
            </label>
          </div>
        </header>
        <main className="page-content">
          <Outlet context={{ roleId } satisfies AppShellContext} />
        </main>
      </div>
    </div>
  )
}