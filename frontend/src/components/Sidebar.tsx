import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight, MoreHorizontal, X, type LucideIcon } from 'lucide-react'
import { useAppContext } from '../app-context'
import {
  academicStructureItems,
  admissionsItems,
  adminNavigationItems,
  examinationItems,
  financeItems,
  institutionDefaults,
  navigationItems,
  registrationItems,
  studentManagementItems,
  type NavigationItem,
  type RoleName,
} from '../data'
import { AcademicStructureNav } from './AcademicStructure'

type SidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  role: RoleName
  onCollapsedChange: (collapsed: boolean) => void
  onMobileClose: () => void
}

type SubNavigationItem = {
  label: string
  href: string
  icon: LucideIcon
}

export function Sidebar({ collapsed, mobileOpen, role, onCollapsedChange, onMobileClose }: SidebarProps) {
  const [modulesOpen, setModulesOpen] = useState(true)
  const { can } = useAppContext()
  const navigate = useNavigate()
  const visibleMain = navigationItems.filter((item) => can(item.permission))
  const visibleAdmin = adminNavigationItems.filter((item) => can(item.permission))

  return <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
    <div className="sidebar-brand">
      <div className="brand-mark"><span>T</span><i /></div>
      {!collapsed && <div><div className="brand-name">TIMS<span>admin</span></div><div className="brand-caption">Institution operations</div></div>}
      <button className="sidebar-close d-lg-none" onClick={onMobileClose} aria-label="Close navigation"><X size={18} /></button>
    </div>
    <div className="institution-switcher">
      <div className="institution-avatar">M</div>
      {!collapsed && <div className="institution-details"><strong>{institutionDefaults.shortName} Campus</strong><span>{institutionDefaults.activeTerm}</span></div>}
      {!collapsed && <ChevronDown size={15} className="text-muted" />}
    </div>
    <div className="sidebar-scroll">
      <div className="sidebar-section-toggle-wrap">
        <button className="sidebar-section-toggle" type="button" aria-expanded={modulesOpen} onClick={() => setModulesOpen((open) => !open)}>
          <span className="sidebar-section-label">Modules</span>
          {!collapsed && <ChevronDown size={14} className={modulesOpen ? 'sidebar-chevron-open' : ''} />}
        </button>
      </div>
      {modulesOpen && <nav className="sidebar-nav" aria-label="Module navigation">
        {visibleMain.map((item) => {
          if (item.href === '/admissions') {
            return <ModuleNavigationGroup key={item.href} item={item} items={admissionsItems} collapsed={collapsed} onNavigate={onMobileClose} />
          }
          if (item.href === '/academics') {
            return <AcademicStructureNav key={item.href} item={item} items={academicStructureItems} collapsed={collapsed} onNavigate={onMobileClose} />
          }
          if (item.href === '/students') {
            return <ModuleNavigationGroup key={item.href} item={item} items={studentManagementItems} collapsed={collapsed} onNavigate={onMobileClose} />
          }
          if (item.href === '/registration') {
            return <ModuleNavigationGroup key={item.href} item={item} items={registrationItems} collapsed={collapsed} onNavigate={onMobileClose} />
          }
          if (item.href === '/examinations') {
            return <ModuleNavigationGroup key={item.href} item={item} items={examinationItems} collapsed={collapsed} onNavigate={onMobileClose} />
          }
          if (item.href === '/finance') {
            return <ModuleNavigationGroup key={item.href} item={item} items={financeItems} collapsed={collapsed} onNavigate={onMobileClose} />
          }
          return <NavItem key={item.href} item={item} collapsed={collapsed} onNavigate={onMobileClose} />
        })}
      </nav>}
      {visibleAdmin.length > 0 && <>
        <div className="sidebar-section-label sidebar-section-admin">Administration</div>
        <nav className="sidebar-nav" aria-label="Administration navigation">{visibleAdmin.map((item) => <NavItem key={item.href} item={item} collapsed={collapsed} onNavigate={onMobileClose} />)}</nav>
      </>}
    </div>
    {!collapsed && <div className="sidebar-status"><div className="status-dot" /><div><strong>All systems operational</strong><span>Last checked 2 min ago</span></div></div>}
    <div className="sidebar-profile">
      <div className="profile-avatar">SN</div>
      {!collapsed && <div className="profile-copy"><strong>Sarah Nansubuga</strong><span>{role}</span></div>}
      {!collapsed && <button className="profile-more" aria-label="Profile actions" onClick={() => navigate('/settings')}><MoreHorizontal size={18} /></button>}
    </div>
    {collapsed && <button className="collapse-button" onClick={() => onCollapsedChange(false)} aria-label="Expand navigation"><ChevronRight size={18} /></button>}
  </aside>
}

function NavItem({ item, collapsed, onNavigate }: { item: NavigationItem; collapsed: boolean; onNavigate: () => void }) {
  const Icon = item.icon
  return <NavLink to={item.href} onClick={onNavigate} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`} title={collapsed ? item.label : undefined}>
    <Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>{item.badge && !collapsed && <small>{item.badge}</small>}
  </NavLink>
}

function ModuleNavigationGroup({ item, items, collapsed, onNavigate }: {
  item: NavigationItem
  items: SubNavigationItem[]
  collapsed: boolean
  onNavigate: () => void
}) {
  const location = useLocation()
  const [open, setOpen] = useState(location.pathname.startsWith(item.href))
  const Icon = item.icon
  const active = location.pathname.startsWith(item.href)
  const linksId = `${item.href.slice(1).replace(/\//g, '-')}-links`

  if (collapsed) {
    return <NavLink to={item.href} onClick={onNavigate} title={item.label} aria-label={item.label} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
      <Icon size={18} strokeWidth={1.8} />
    </NavLink>
  }

  return <div className={`academic-nav-group ${active ? 'academic-nav-group-active' : ''}`}>
    <button className={`nav-item academic-nav-trigger ${active ? 'academic-nav-trigger-active' : ''}`} type="button" aria-expanded={open} aria-controls={linksId} onClick={() => setOpen((value) => !value)}>
      <Icon size={18} strokeWidth={1.8} />
      <span>{item.label}</span>
      <ChevronDown size={14} className={open ? 'academic-nav-chevron-open' : ''} />
    </button>
    {open && <div className="academic-subnav" id={linksId}>
      {items.map((subItem) => { const SubIcon = subItem.icon; return <NavLink key={subItem.href} to={subItem.href} onClick={onNavigate} className={({ isActive }) => `academic-subnav-item ${isActive ? 'academic-subnav-item-active' : ''}`}>
        <SubIcon size={14} strokeWidth={1.8} aria-hidden="true" />
        <span>{subItem.label}</span>
      </NavLink> })}
    </div>}
  </div>
}