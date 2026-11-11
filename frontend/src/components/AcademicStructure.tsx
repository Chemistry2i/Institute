import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronRight, CircleHelp, Minus, Plus } from 'lucide-react'
import { academicStructureItems, moduleKpis, type NavigationItem } from '../data'
import { useAppContext } from '../app-context'
import { Card, KpiCard } from './ui'
import { ModuleWorkspace } from './ModuleWorkspace'

const areaGroups = [
  { title: 'Institution & organisation', hrefs: ['/academics/institutions', '/academics/faculties', '/academics/departments'] },
  { title: 'Academic offering', hrefs: ['/academics/programmes', '/academics/courses', '/academics/curricula'] },
  { title: 'Calendar & grading rules', hrefs: ['/academics/calendar', '/academics/grading'] },
]

type AcademicItem = typeof academicStructureItems[number]

export function AcademicStructureNav({ item, items, collapsed, onNavigate }: {
  item: NavigationItem
  items: AcademicItem[]
  collapsed: boolean
  onNavigate: () => void
}) {
  const location = useLocation()
  const [open, setOpen] = useState(location.pathname.startsWith('/academics'))
  const Icon = item.icon
  const active = location.pathname.startsWith('/academics')
  const DisclosureIcon = open ? Minus : Plus

  if (collapsed) {
    return <NavLink to="/academics" onClick={onNavigate} title={item.label} aria-label={item.label} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
      <Icon size={18} strokeWidth={1.8} />
    </NavLink>
  }

  return <div className={`academic-nav-group ${active ? 'academic-nav-group-active' : ''}`}>
    <button className={`nav-item academic-nav-trigger ${active ? 'academic-nav-trigger-active' : ''}`} type="button" aria-expanded={open} aria-controls="academic-structure-links" onClick={() => setOpen((value) => !value)}>
      <Icon size={18} strokeWidth={1.8} />
      <span>{item.label}</span>
      <DisclosureIcon size={14} className="academic-nav-disclosure" aria-hidden="true" />
    </button>
    {open && <div className="academic-subnav" id="academic-structure-links">
      {items.map((subItem) => { const SubIcon = subItem.icon; return <NavLink key={subItem.href} to={subItem.href} onClick={onNavigate} className={({ isActive }) => `academic-subnav-item ${isActive ? 'academic-subnav-item-active' : ''}`}>
        <SubIcon size={14} strokeWidth={1.8} aria-hidden="true" />
        <span>{subItem.label}</span>
      </NavLink> })}
    </div>}
  </div>
}

export function AcademicStructureRoute() {
  const { pathname } = useLocation()
  return pathname === '/academics' ? <AcademicStructureOverview /> : <ModuleWorkspace path={pathname} />
}

function AcademicStructureOverview() {
  const { can } = useAppContext()
  if (!can('academics.view')) return <Card className="permission-empty"><div className="permission-empty-icon"><CircleHelp size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to academic structure.</p></Card>

  return <div className="academic-overview">
    <div className="stats-grid module-kpi-strip">
      {(moduleKpis['/academics'] ?? []).map((metric) => <KpiCard key={metric.label} {...metric} />)}
    </div>
    <section className="academic-hierarchy" aria-label="Academic structure hierarchy">
      {[
        { label: 'Institution', href: '/academics/institutions' },
        { label: 'Faculty or school', href: '/academics/faculties' },
        { label: 'Department', href: '/academics/departments' },
        { label: 'Programme', href: '/academics/programmes' },
        { label: 'Course units', href: '/academics/courses' },
      ].map((step, index, steps) => <div className="academic-hierarchy-step" key={step.href}>
        <Link to={step.href}>{step.label}</Link>
        {index < steps.length - 1 && <ChevronRight size={15} aria-hidden="true" />}
      </div>)}
    </section>
    {areaGroups.map((group) => <section className="academic-area-group" key={group.title}>
      <div className="academic-area-heading"><h2>{group.title}</h2><span>{group.hrefs.length} areas</span></div>
      <div className="academic-area-grid">
        {group.hrefs.map((href) => {
          const area = academicStructureItems.find((entry) => entry.href === href)
          if (!area) return null
          const AreaIcon = area.icon
          return <Link className="academic-area-link" to={area.href} key={area.href}>
            <span className="academic-area-icon"><AreaIcon size={17} /></span>
            <span className="academic-area-copy"><strong>{area.label}</strong><small>{area.description}</small></span>
            <ChevronRight size={16} className="academic-area-arrow" />
          </Link>
        })}
      </div>
    </section>)}
  </div>
}