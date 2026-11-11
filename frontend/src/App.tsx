import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'
import Swal from 'sweetalert2'
import {
  ArrowRight,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Command,
  Download,
  CreditCard,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  GraduationCap,
  LogOut,
  Menu,
  LockKeyhole,
  Mail,
  Moon,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  UsersRound,
  X,
  Zap,
} from 'lucide-react'
import { Badge, Button, Card, KpiCard, LoadingSpinner } from './components/ui'
import { AppProvider, defaultColors, useAppContext, type ThemeColors } from './app-context'
import { Dashboard } from './components/Dashboard'
import { AcademicStructureRoute } from './components/AcademicStructure'
import { FilterModal, FormModal, ModuleWorkspace } from './components/ModuleWorkspace'
import { ModuleLanding, OperationalModuleRoute } from './components/OperationalModule'
import { Sidebar } from './components/Sidebar'
import { SettingsPage as SettingsWorkspace } from './components/SettingsPage'
import { StudentInformation } from './components/StudentInformation'
import { UsersRolesPage } from './components/UsersRolesPage'
import {
  admissionsItems,
  attendanceItems,
  examinationItems,
  financeItems,
  genericOperationalGroups,
  institutionDefaults,
  moduleIcons,
  moduleRows,
  pageMeta,
  registrationItems,
  roles,
  studentManagementItems,
  timetablingItems,
  type Permission,
  type RoleName,
} from './data'
import './styles.css'

function App() {
  return <BrowserRouter><AppProvider><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/*" element={<Shell />} />
  </Routes><Toaster position="bottom-right" toastOptions={{ duration: 3200, style: { fontFamily: 'Poppins, sans-serif', borderRadius: '12px' } }} /></AppProvider></BrowserRouter>
}

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); toast.success('Demo sign-in successful.'); navigate('/') }
  return <div className="login-page"><div className="login-brand"><div className="brand-mark"><span>T</span><i /></div><div><div className="brand-name">TIMS<span>admin</span></div><div className="brand-caption">Institution operations</div></div></div><div className="login-layout"><section className="login-aside"><div className="eyebrow">Tertiary institution management</div><h1>Keep the semester moving.</h1><p>A calm, governed operating layer for admissions, academics, finance, student services, and institutional decisions.</p><div className="login-aside-list"><div><span><ShieldCheck size={15} /></span><div><strong>Permission-led by design</strong><small>Roles and access stay visible at every step.</small></div></div><div><span><Zap size={15} /></span><div><strong>One institutional view</strong><small>Connect academic and operational work in one place.</small></div></div><div><span><Building2 size={15} /></span><div><strong>Built for your campus</strong><small>Configure identity, periods, policies, and colour tokens.</small></div></div></div><div className="login-aside-foot"><span>Peculiar Metropolitan Institute</span><span>© 2025 TIMS Admin</span></div></section><section className="login-card"><div className="login-card-heading"><div className="login-icon"><LockKeyhole size={19} /></div><div><h2>Sign in to TIMS</h2><p>Use your institutional account to continue.</p></div></div><form onSubmit={submit} className="login-form"><label>Institutional email<div className="login-input"><Mail size={16} /><input type="email" defaultValue="sarah.nansubuga@mmi.ac.ug" placeholder="name@institution.ac.ug" required /></div></label><label>Password<div className="login-input"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} defaultValue="password" placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label><div className="login-options"><label className="remember-option"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> <span>Remember this device</span></label><button type="button" className="login-link" onClick={() => toast.success('Password recovery workflow opened.')}>Forgot password?</button></div><Button className="login-submit" type="submit">Sign in <ArrowRight size={15} /></Button></form><div className="login-demo-note"><CircleHelp size={15} /><span>Frontend demo mode: sign-in is simulated and no credentials are stored.</span></div></section></div></div>
}

function Shell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { role, mode, setMode } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const currentMeta = location.pathname === '/' ? { eyebrow: 'Institution overview', title: 'Good morning, Sarah', description: 'Here is what needs your attention across the institution today.' } : pageMeta[location.pathname] ?? pageMeta['/students']

  return <div className={`shell ${collapsed ? 'shell-collapsed' : ''}`}>
    <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} role={role} onCollapsedChange={setCollapsed} onMobileClose={() => setMobileOpen(false)} />
    <main className="main-panel">
      <header className="topbar">
        <div className="topbar-left"><button className="mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{currentMeta.title}</strong></div></div>
        <div className="topbar-actions">
          <div className="topbar-search"><Search size={17} /><input aria-label="Search institution" placeholder="Search anything" /><kbd>⌘ K</kbd></div>
          <button className="icon-button" aria-label="Help"><CircleHelp size={19} /></button>
          <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><span /></button>
          <button className="theme-toggle" aria-label="Toggle dark mode" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>{mode === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button>
          <button className="header-user" onClick={() => navigate('/settings')}><span className="mini-avatar">SN</span><ChevronDown size={14} /></button>
        </div>
      </header>
      <div className="content-wrap">
        <div className="page-intro"><div><div className="eyebrow">{currentMeta.eyebrow}</div><h1>{currentMeta.title}</h1><p>{currentMeta.description}</p></div><div className="page-intro-actions"><span className="live-chip"><i /> Live data preview</span><button className="icon-button only-desktop" aria-label="Panel options"><SlidersHorizontal size={18} /></button></div></div>
        <RouteTransitionLoader />
        <RoutesOutlet />
      </div>
    </main>
  </div>
}

function AdmissionsRoute() {
  const { pathname } = useLocation()

  if (pathname === '/admissions') return <ModuleLanding basePath="/admissions" items={admissionsItems} steps={[
    { label: 'Application pipeline', href: '/admissions/application-pipeline' },
    { label: 'Applicant review', href: '/admissions/applicant-review' },
    { label: 'Document verification', href: '/admissions/document-verification' },
    { label: 'Offers & decisions', href: '/admissions/offers-decisions' },
  ]} />
  return <ModuleWorkspace path={pathname} />
}

function StudentManagementRoute() {
  const { pathname } = useLocation()

  if (pathname === '/students') return <ModuleLanding basePath="/students" items={studentManagementItems} steps={[
    { label: 'Student directory', href: '/students/directory' },
    { label: 'Placement data', href: '/students/placement' },
    { label: 'Lifecycle', href: '/students/lifecycle' },
    { label: 'Documents', href: '/students/documents' },
  ]} />
  if (pathname === '/students/directory') return <StudentInformation />
  if (pathname === '/students/placement') return <StudentPlacementPage />
  if (pathname === '/students/lifecycle') return <StudentLifecyclePage />
  if (pathname === '/students/documents') return <StudentDocumentsPage />

  return <ModuleWorkspace path={pathname} />
}

function RoutesOutlet() {
  return <div className="route-content"><Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/admissions/*" element={<AdmissionsRoute />} />
    <Route path="/students/*" element={<StudentManagementRoute />} />
    <Route path="/academics/*" element={<AcademicStructureRoute />} />
    <Route path="/registration/*" element={<OperationalModuleRoute basePath="/registration" items={registrationItems} />} />
    <Route path="/examinations/*" element={<OperationalModuleRoute basePath="/examinations" items={examinationItems} />} />
    <Route path="/finance/*" element={<OperationalModuleRoute basePath="/finance" items={financeItems} />} />
    <Route path="/timetabling/*" element={<OperationalModuleRoute basePath="/timetabling" items={timetablingItems} />} />
    <Route path="/attendance/*" element={<OperationalModuleRoute basePath="/attendance" items={attendanceItems} />} />
    {genericOperationalGroups.map(({ basePath, items }) => <Route key={basePath} path={`${basePath}/*`} element={<OperationalModuleRoute basePath={basePath} items={items} />} />)}
    <Route path="/users" element={<UsersRolesPage />} />
    <Route path="/settings/*" element={<SettingsWorkspace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></div>
}

function RouteTransitionLoader() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 260)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  if (!loading) return null

  return <div className="route-transition-loader" role="status" aria-live="polite">
    <div className="route-transition-card">
      <LoadingSpinner size="md" label="Loading module" />
      <span>Loading module…</span>
    </div>
  </div>
}

function StudentsPage() {
  return <StudentInformation />
}

function UsersPage() {
  const { role, setRole, can } = useAppContext()
  if (!can('users.manage')) return <PermissionEmpty />
  return <><div className="module-toolbar"><div className="toolbar-search"><Search size={16} /><input placeholder="Search users or roles" /></div><div className="toolbar-actions"><Button variant="outline" size="sm"><Download size={15} /> Export matrix</Button><Button size="sm" onClick={() => toast.success('Invite workflow opened.')}><Plus size={15} /> Invite user</Button></div></div><div className="users-layout"><Card className="roles-card"><div className="table-card-head"><div><h2>Role templates</h2><p>Permission-led access definitions</p></div><ShieldCheck size={19} className="header-icon" /></div><div className="role-list">{roles.map((item) => <button className={`role-list-item ${item.name === role ? 'selected' : ''}`} key={item.name} onClick={() => { setRole(item.name); toast.success(`Previewing ${item.name}`) }}><span className="role-avatar" style={{ background: item.color }}>{item.shortName}</span><span><strong>{item.name}</strong><small>{item.permissions.length} permissions</small></span><ChevronRight size={16} /></button>)}</div></Card><Card className="permission-card"><div className="table-card-head"><div><div className="eyebrow">Currently previewing</div><h2>{role}</h2><p>Use this matrix to review what the selected role can access.</p></div><Badge tone="success">Active template</Badge></div><div className="permission-grid">{['View dashboard', 'Review admissions', 'Manage student records', 'Edit curriculum', 'Approve registration', 'Process examinations', 'View finance', 'Export reports', 'Manage users', 'Configure settings'].map((permission) => <div className="permission-row" key={permission}><span className="permission-check"><ShieldCheck size={13} /></span><span>{permission}</span><span className="permission-state">Granted</span></div>)}</div><div className="permission-note"><CircleHelp size={16} /><span>Frontend guards are active for this preview. Server-side enforcement should mirror these permission IDs when the API is connected.</span></div></Card></div></>
}

function SettingsPage() {
  const { colors, setColors, mode, setMode, can } = useAppContext()
  const [draft, setDraft] = useState(colors)
  if (!can('settings.manage')) return <PermissionEmpty />
  const updateColor = (key: keyof ThemeColors, value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const save = () => { setColors(draft); toast.success('Institution theme saved locally.') }
  const reset = async () => { const result = await Swal.fire({ title: 'Reset theme colours?', text: 'This will restore the TIMS institutional palette.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Reset colours', cancelButtonText: 'Keep current', confirmButtonColor: '#174A84' }); if (result.isConfirmed) { setDraft(defaultColors); setColors(defaultColors); toast.success('Theme restored to the institutional palette.') } }
  return <div className="settings-layout"><div className="settings-nav"><div className="settings-nav-title">Settings</div>{['Institution identity', 'Theme & appearance', 'Academic calendar', 'Notifications', 'Roles & permissions'].map((item, index) => <button className={`settings-nav-item ${index === 1 ? 'active' : ''}`} key={item}>{index === 1 ? <SlidersHorizontal size={16} /> : <Settings2 size={16} />}{item}<ChevronRight size={14} className="ms-auto" /></button>)}</div><div className="settings-content"><Card className="settings-card"><div className="settings-card-heading"><div><div className="eyebrow">Interface system</div><h2>Theme & appearance</h2><p>Set the visual language your teams will use every day. Changes are saved locally in this frontend preview.</p></div><div className="settings-preview-mark"><div className="brand-mark"><span>T</span><i /></div></div></div><div className="settings-section"><div className="settings-section-heading"><div><h3>Color tokens</h3><p>Customize semantic colors without changing component code.</p></div><Badge tone="info">Admin only</Badge></div><div className="color-grid">{(Object.keys(draft) as Array<keyof ThemeColors>).map((key) => <label className="color-field" key={key}><span><i className="color-swatch" style={{ background: draft[key] }} />{key[0].toUpperCase() + key.slice(1)}</span><div className="color-input-wrap"><input type="color" value={draft[key]} onChange={(event) => updateColor(key, event.target.value)} aria-label={`${key} color`} /><input value={draft[key]} onChange={(event) => updateColor(key, event.target.value)} aria-label={`${key} hex value`} /></div></label>)}</div></div><div className="settings-section"><div className="settings-section-heading"><div><h3>Interface mode</h3><p>Choose the default viewing mode for your workspace.</p></div></div><div className="mode-options"><button className={`mode-option ${mode === 'light' ? 'selected' : ''}`} onClick={() => setMode('light')}><Sun size={18} /><span><strong>Light mode</strong><small>Bright, clear, and print-friendly</small></span>{mode === 'light' && <span className="mode-selected" />}</button><button className={`mode-option ${mode === 'dark' ? 'selected' : ''}`} onClick={() => setMode('dark')}><Moon size={18} /><span><strong>Dark mode</strong><small>Reduced glare for late sessions</small></span>{mode === 'dark' && <span className="mode-selected" />}</button></div></div><div className="settings-actions"><Button variant="ghost" onClick={() => setDraft(colors)}>Discard changes</Button><Button variant="outline" onClick={() => void reset()}>Reset palette</Button><Button onClick={save}>Save appearance</Button></div></Card><Card className="institution-card"><div className="table-card-head"><div><h2>Institution identity</h2><p>Shown across headers, reports, and official views.</p></div><Building2 size={20} className="header-icon" /></div><div className="identity-block"><div className="identity-logo">M</div><div><strong>{institutionDefaults.name}</strong><span>{institutionDefaults.type} · {institutionDefaults.location}</span><small>{institutionDefaults.address}</small></div><Button variant="outline" size="sm">Change logo</Button></div><div className="identity-fields"><label>Institution name<input value={institutionDefaults.name} readOnly /></label><label>Short name<input value={institutionDefaults.shortName} readOnly /></label><label>Contact email<input value={institutionDefaults.email} readOnly /></label><label>Phone number<input value={institutionDefaults.phone} readOnly /></label></div><div className="settings-footnote"><CircleHelp size={15} /><span>Institution identity settings are demo values in this frontend-only phase and are ready to connect to a configuration API.</span></div></Card></div></div>
}

function PermissionEmpty() {
  const navigate = useNavigate()
  return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to this workspace. Switch the RBAC preview role or ask an administrator to grant the required permission.</p><Button onClick={() => navigate('/users')}>Review access matrix</Button></Card>
}

export default App
