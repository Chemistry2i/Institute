import type { LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../app-context'
import { adminNavigationItems, moduleKpis, navigationItems, pageMeta } from '../data'
import { ModuleWorkspace } from './ModuleWorkspace'
import { Card, KpiCard } from './ui'

type OperationalArea = {
  label: string
  href: string
  icon: LucideIcon
  description: string
}

type ModuleLandingProps = {
  basePath: string
  items: OperationalArea[]
  steps?: Array<{ label: string; href: string }>
}

export function OperationalModuleRoute({ basePath, items, steps }: ModuleLandingProps) {
  const { pathname } = useLocation()
  return pathname === basePath
    ? <ModuleLanding basePath={basePath} items={items} steps={steps} />
    : <ModuleWorkspace path={pathname} />
}

export function ModuleLanding({ basePath, items, steps }: ModuleLandingProps) {
  const { can } = useAppContext()
  const permission = [...navigationItems, ...adminNavigationItems].find((item) => item.href === basePath)?.permission
  const meta = pageMeta[basePath]

  if (permission && !can(permission)) return <Card className="permission-empty"><h2>Permission required</h2><p>Your current role does not have access to this module.</p></Card>

  return <div className="academic-overview">
    <div className="stats-grid module-kpi-strip">
      {(moduleKpis[basePath] ?? []).map((metric) => <KpiCard key={metric.label} {...metric} />)}
    </div>
    {steps && <section className="academic-hierarchy" aria-label={`${meta.title} workflow`}>
      {steps.map((step, index) => <div className="academic-hierarchy-step" key={step.href}>
        <Link to={step.href}>{step.label}</Link>
        {index < steps.length - 1 && <span aria-hidden="true">›</span>}
      </div>)}
    </section>}
    <section className="academic-area-group">
      <div className="academic-area-heading"><h2>{meta.title} work areas</h2><span>{items.length - 1} areas</span></div>
      <div className="academic-area-grid">
        {items.filter((area) => area.href !== basePath).map((area) => {
          const AreaIcon = area.icon
          return <Link className="academic-area-link" to={area.href} key={area.href}>
            <span className="academic-area-icon"><AreaIcon size={17} /></span>
            <span className="academic-area-copy"><strong>{area.label}</strong><small>{area.description}</small></span>
          </Link>
        })}
      </div>
    </section>
  </div>
}