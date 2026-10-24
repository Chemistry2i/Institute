import { useEffect, useState } from 'react'
import { Bell, GraduationCap, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, X } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { getNavigationForRole } from '../../config/access'
import { roleProfiles, type RoleId } from '../../config/roles'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { SimulationStatusBar } from '../../features/registrar/simulation/SimulationStatusBar'
import '../../App.css'

export interface AppShellContext {
  roleId: RoleId
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [roleId, setRoleId] = useState<RoleId>('institutionHead')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const location = useLocation()
  const visibleNavigation = getNavigationForRole(roleId)
  const activePage = visibleNavigation.find((item) => item.path === location.pathname)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className={`app-shell${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
      <aside className={`sidebar${menuOpen ? ' is-open' : ''}`}>
        <NavLink className="brand" to="/" aria-label="ACMIS overview">
          <span className="brand-mark"><GraduationCap size={20} aria-hidden="true" /></span>
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
                {groupItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                    key={path}
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    to={path}
                    end={path === '/'}
                      aria-label={label}
                      title={sidebarCollapsed ? label : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={15} aria-hidden="true" />
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
              className="desktop-sidebar-toggle icon-button"
              type="button"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!sidebarCollapsed}
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} aria-hidden="true" /> : <PanelLeftClose size={16} aria-hidden="true" />}
            </button>
            <button
              className="mobile-menu-button"
              type="button"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
            <span className="breadcrumb">ACMIS&nbsp; / &nbsp;{activePage?.label ?? 'Overview'}</span>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Notifications unavailable until sign in is connected" disabled>
              <Bell size={16} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
            </button>
            <div className="role-preview">
              <span>Preview role</span>
              <Select
                value={roleId}
                onValueChange={(selectedRoleId) => {
                  if (Object.hasOwn(roleProfiles, selectedRoleId)) {
                    setRoleId(selectedRoleId as RoleId)
                  }
                }}
              >
                <SelectTrigger aria-label="Preview dashboard as role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleProfiles).map(([id, profile]) => (
                    <SelectItem key={id} value={id}>{profile.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        <SimulationStatusBar />
        <main className="page-content">
          <Outlet context={{ roleId } satisfies AppShellContext} />
        </main>
      </div>
    </div>
  )
}