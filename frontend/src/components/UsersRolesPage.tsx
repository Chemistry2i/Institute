import { useMemo, useState } from 'react'
import { Download, Search, ShieldCheck, UsersRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../app-context'
import { adminNavigationItems, navigationItems, roles, type Permission, type RoleName } from '../data'
import { Badge, Button, Card } from './ui'

const permissionLabels: Record<Permission, string> = {
  'dashboard.view': 'View institutional dashboard',
  'admissions.view': 'Review admissions and matriculation',
  'students.view': 'View and manage student records',
  'academics.view': 'Manage academic structure',
  'registration.view': 'Manage registration and enrollment',
  'timetabling.view': 'Manage teaching schedules',
  'attendance.view': 'Manage attendance records',
  'examinations.view': 'Manage assessments and results',
  'finance.view': 'View finance and student accounts',
  'scholarships.view': 'Manage scholarships and sponsors',
  'learning.view': 'Manage learning resources',
  'library.view': 'Manage library services',
  'staff.view': 'Manage staff and HR',
  'accommodation.view': 'Manage residences and accommodation',
  'internship.view': 'Manage internships and research',
  'welfare.view': 'Manage restricted student support',
  'graduation.view': 'Manage graduation and alumni',
  'communications.view': 'Manage institutional communications',
  'quality.view': 'Manage quality assurance',
  'procurement.view': 'Manage procurement and inventory',
  'administration.manage': 'Manage system administration and audit',
  'reports.view': 'View and export reports',
  'users.manage': 'Manage users and roles',
  'settings.manage': 'Manage institution settings',
}

const allPermissions = [...navigationItems, ...adminNavigationItems]

export function UsersRolesPage() {
  const { role, setRole } = useAppContext()
  const [query, setQuery] = useState('')
  const [comparisonRole, setComparisonRole] = useState<RoleName>('Academic Registrar')
  const currentRole = roles.find((item) => item.name === role) ?? roles[0]
  const comparedRole = roles.find((item) => item.name === comparisonRole) ?? roles[0]
  const filteredRoles = roles.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()))
  const permissionMetrics = useMemo(() => ({
    granted: currentRole.permissions.length,
    total: allPermissions.length,
    privileged: currentRole.permissions.filter((permission) => ['users.manage', 'settings.manage', 'administration.manage'].includes(permission)).length,
  }), [currentRole])

  const exportMatrix = () => {
    const matrix = allPermissions.map((item) => ({
      permission: item.permission,
      label: permissionLabels[item.permission],
      selectedRoleGranted: currentRole.permissions.includes(item.permission),
      comparisonRoleGranted: comparedRole.permissions.includes(item.permission),
    }))
    const blob = new Blob([JSON.stringify({ role: currentRole.name, comparisonRole: comparedRole.name, matrix }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentRole.shortName.toLowerCase()}-permission-matrix.json`
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    toast.success('Permission matrix exported.')
  }

  return <>
    <div className="module-toolbar">
      <label className="toolbar-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles and templates" aria-label="Search roles" /></label>
      <div className="toolbar-actions"><Button type="button" variant="outline" size="sm" onClick={exportMatrix}><Download size={15} /> Export matrix</Button><Button type="button" size="sm" onClick={() => toast.success('Invite workflow is ready for account-service integration.')}><UsersRound size={15} /> Invite user</Button></div>
    </div>
    <div className="users-layout">
      <Card className="roles-card"><div className="table-card-head"><div><h2>Role templates</h2><p>{filteredRoles.length} of {roles.length} templates</p></div><ShieldCheck size={19} className="header-icon" /></div><div className="role-list">{filteredRoles.map((item) => <button type="button" className={`role-list-item ${item.name === role ? 'selected' : ''}`} key={item.name} onClick={() => { setRole(item.name); toast.success(`Previewing ${item.name}`) }}><span className="role-avatar" style={{ background: item.color }}>{item.shortName}</span><span><strong>{item.name}</strong><small>{item.description}</small><small>{item.permissions.length} of {allPermissions.length} permissions granted</small></span><span aria-hidden="true">›</span></button>)}</div></Card>
  <Card className="permission-card"><div className="table-card-head"><div><div className="eyebrow">Currently previewing</div><h2>{currentRole.name}</h2><p>{permissionMetrics.granted} permissions granted · {permissionMetrics.privileged} privileged grants</p></div><Badge tone="success">Active template</Badge></div>
        <div className="role-comparison-control"><label>Compare with<select value={comparisonRole} onChange={(event) => setComparisonRole(event.target.value as RoleName)}>{roles.map((item) => <option key={item.name}>{item.name}</option>)}</select></label></div>
        <div className="permission-grid">{allPermissions.map((item) => {
          const granted = currentRole.permissions.includes(item.permission)
          const comparisonGranted = comparedRole.permissions.includes(item.permission)
          return <div className={`permission-row ${granted ? '' : 'permission-row-denied'}`} key={item.permission}><span className={`permission-check ${granted ? '' : 'permission-check-denied'}`}><ShieldCheck size={13} /></span><span><strong>{permissionLabels[item.permission]}</strong><small>{item.permission}</small></span><span className={`permission-state ${granted ? '' : 'permission-state-denied'}`}>{granted ? 'Granted' : 'Not granted'}</span><span className="permission-comparison-state">{comparisonGranted ? 'Compare: yes' : 'Compare: no'}</span></div>
        })}</div>
        <div className="permission-note"><ShieldCheck size={16} /><span>This preview uses the same permission IDs as navigation. Server-side authorization must enforce these grants when the API is connected.</span></div>
      </Card>
    </div>
  </>
}
