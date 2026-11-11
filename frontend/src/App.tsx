import { useState } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
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
  TrendingUp,
  UsersRound,
  X,
  Zap,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Button, Card } from './components/ui'
import { AppProvider, defaultColors, useAppContext, type ThemeColors } from './app-context'
import { AcademicStructureNav, AcademicStructureRoute } from './components/AcademicStructure'
import { FilterModal, FormModal, ModuleWorkspace } from './components/ModuleWorkspace'
import {
  academicStructureItems,
  activities,
  adminNavigationItems,
  enrolmentData,
  facultyData,
  institutionDefaults,
  moduleIcons,
  moduleRows,
  navigationItems,
  pageMeta,
  roles,
  students,
  type Permission,
  type RoleName,
} from './data'
import './styles.css'

function App() {
  return <BrowserRouter><AppProvider><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<Shell />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admissions" element={<ModuleWorkspace path="/admissions" />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/academics/*" element={<AcademicStructureRoute />} />
      <Route path="/registration" element={<ModuleWorkspace path="/registration" />} />
      <Route path="/timetabling" element={<ModuleWorkspace path="/timetabling" />} />
      <Route path="/attendance" element={<ModuleWorkspace path="/attendance" />} />
      <Route path="/examinations" element={<ModuleWorkspace path="/examinations" />} />
      <Route path="/finance" element={<ModuleWorkspace path="/finance" />} />
      <Route path="/scholarships" element={<ModuleWorkspace path="/scholarships" />} />
      <Route path="/learning" element={<ModuleWorkspace path="/learning" />} />
      <Route path="/library" element={<ModuleWorkspace path="/library" />} />
      <Route path="/staff" element={<ModuleWorkspace path="/staff" />} />
      <Route path="/accommodation" element={<ModuleWorkspace path="/accommodation" />} />
      <Route path="/internship" element={<ModuleWorkspace path="/internship" />} />
      <Route path="/welfare" element={<ModuleWorkspace path="/welfare" />} />
      <Route path="/graduation" element={<ModuleWorkspace path="/graduation" />} />
      <Route path="/communications" element={<ModuleWorkspace path="/communications" />} />
      <Route path="/quality" element={<ModuleWorkspace path="/quality" />} />
      <Route path="/procurement" element={<ModuleWorkspace path="/procurement" />} />
      <Route path="/reports" element={<ModuleWorkspace path="/reports" />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/administration" element={<ModuleWorkspace path="/administration" />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes><Toaster position="bottom-right" toastOptions={{ duration: 3200, style: { fontFamily: 'Poppins, sans-serif', borderRadius: '12px' } }} /></AppProvider></BrowserRouter>
}

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); toast.success('Demo sign-in successful.'); navigate('/') }
  return <div className="login-page"><div className="login-brand"><div className="brand-mark"><span>T</span><i /></div><div><div className="brand-name">TIMS<span>admin</span></div><div className="brand-caption">Institution operations</div></div></div><div className="login-layout"><section className="login-aside"><div className="eyebrow">Tertiary institution management</div><h1>Keep the semester moving.</h1><p>A calm, governed operating layer for admissions, academics, finance, student services, and institutional decisions.</p><div className="login-aside-list"><div><span><ShieldCheck size={15} /></span><div><strong>Permission-led by design</strong><small>Roles and access stay visible at every step.</small></div></div><div><span><Zap size={15} /></span><div><strong>One institutional view</strong><small>Connect academic and operational work in one place.</small></div></div><div><span><Building2 size={15} /></span><div><strong>Built for your campus</strong><small>Configure identity, periods, policies, and colour tokens.</small></div></div></div><div className="login-aside-foot"><span>Makerere Metropolitan Institute</span><span>© 2025 TIMS Admin</span></div></section><section className="login-card"><div className="login-card-heading"><div className="login-icon"><LockKeyhole size={19} /></div><div><h2>Sign in to TIMS</h2><p>Use your institutional account to continue.</p></div></div><form onSubmit={submit} className="login-form"><label>Institutional email<div className="login-input"><Mail size={16} /><input type="email" defaultValue="sarah.nansubuga@mmi.ac.ug" placeholder="name@institution.ac.ug" required /></div></label><label>Password<div className="login-input"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} defaultValue="password" placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label><div className="login-options"><label className="remember-option"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> <span>Remember this device</span></label><button type="button" className="login-link" onClick={() => toast.success('Password recovery workflow opened.')}>Forgot password?</button></div><Button className="login-submit" type="submit">Sign in <ArrowRight size={15} /></Button></form><div className="login-demo-note"><CircleHelp size={15} /><span>Frontend demo mode: sign-in is simulated and no credentials are stored.</span></div></section></div></div>
}

function Shell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [modulesOpen, setModulesOpen] = useState(true)
  const { role, setRole, can, mode, setMode } = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()
  const currentMeta = location.pathname === '/' ? { eyebrow: 'Institution overview', title: 'Good morning, Sarah', description: 'Here is what needs your attention across the institution today.' } : pageMeta[location.pathname] ?? pageMeta['/students']
  const visibleMain = navigationItems.filter((item) => can(item.permission))
  const visibleAdmin = adminNavigationItems.filter((item) => can(item.permission))

  const handleRoleChange = (nextRole: RoleName) => {
    setRole(nextRole)
    toast.success(`Previewing ${nextRole} permissions`)
  }

  return <div className={`shell ${collapsed ? 'shell-collapsed' : ''}`}>
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark"><span>T</span><i /></div>
        {!collapsed && <div><div className="brand-name">TIMS<span>admin</span></div><div className="brand-caption">Institution operations</div></div>}
        <button className="sidebar-close d-lg-none" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
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
          {visibleMain.map((item) => item.href === '/academics'
            ? <AcademicStructureNav key={item.href} item={item} items={academicStructureItems} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />
            : <NavItem key={item.href} item={item} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />)}
        </nav>}
        {visibleAdmin.length > 0 && <>
          <div className="sidebar-section-label sidebar-section-admin">Administration</div>
          <nav className="sidebar-nav" aria-label="Administration navigation">{visibleAdmin.map((item) => <NavItem key={item.href} item={item} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} />)}</nav>
        </>}
      </div>
      {!collapsed && <div className="sidebar-status"><div className="status-dot" /><div><strong>All systems operational</strong><span>Last checked 2 min ago</span></div></div>}
      <div className="sidebar-profile">
        <div className="profile-avatar">SN</div>
        {!collapsed && <div className="profile-copy"><strong>Sarah Nansubuga</strong><span>{role}</span></div>}
        {!collapsed && <button className="profile-more" aria-label="Profile actions" onClick={() => navigate('/settings')}><MoreHorizontal size={18} /></button>}
      </div>
      {collapsed && <button className="collapse-button" onClick={() => setCollapsed(false)} aria-label="Expand navigation"><ChevronRight size={18} /></button>}
    </aside>
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
        <RoutesOutlet />
      </div>
    </main>
  </div>
}

function NavItem({ item, collapsed, onNavigate }: { item: typeof navigationItems[number]; collapsed: boolean; onNavigate: () => void }) {
  const Icon = item.icon
  return <NavLink to={item.href} onClick={onNavigate} className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`} title={collapsed ? item.label : undefined}><Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>{item.badge && !collapsed && <small>{item.badge}</small>}</NavLink>
}

function RoutesOutlet() {
  return <div className="route-content"><Routes><Route path="/" element={<Dashboard />} /><Route path="/admissions" element={<ModuleWorkspace path="/admissions" />} /><Route path="/students" element={<StudentsPage />} /><Route path="/academics/*" element={<AcademicStructureRoute />} /><Route path="/registration" element={<ModuleWorkspace path="/registration" />} /><Route path="/timetabling" element={<ModuleWorkspace path="/timetabling" />} /><Route path="/attendance" element={<ModuleWorkspace path="/attendance" />} /><Route path="/examinations" element={<ModuleWorkspace path="/examinations" />} /><Route path="/finance" element={<ModuleWorkspace path="/finance" />} /><Route path="/scholarships" element={<ModuleWorkspace path="/scholarships" />} /><Route path="/learning" element={<ModuleWorkspace path="/learning" />} /><Route path="/library" element={<ModuleWorkspace path="/library" />} /><Route path="/staff" element={<ModuleWorkspace path="/staff" />} /><Route path="/accommodation" element={<ModuleWorkspace path="/accommodation" />} /><Route path="/internship" element={<ModuleWorkspace path="/internship" />} /><Route path="/welfare" element={<ModuleWorkspace path="/welfare" />} /><Route path="/graduation" element={<ModuleWorkspace path="/graduation" />} /><Route path="/communications" element={<ModuleWorkspace path="/communications" />} /><Route path="/quality" element={<ModuleWorkspace path="/quality" />} /><Route path="/procurement" element={<ModuleWorkspace path="/procurement" />} /><Route path="/reports" element={<ModuleWorkspace path="/reports" />} /><Route path="/users" element={<UsersPage />} /><Route path="/administration" element={<ModuleWorkspace path="/administration" />} /><Route path="/settings" element={<SettingsPage />} /><Route path="*" element={<Dashboard />} /></Routes></div>
}

function Dashboard() {
  const { role } = useAppContext()
  return <>
    <div className="role-banner"><div className="role-banner-icon"><ShieldCheck size={18} /></div><div><strong>RBAC preview active</strong><span>You are viewing the workspace as <b>{role}</b>. Permissions are ready to connect to your authentication service.</span></div><button className="role-banner-link">View access matrix <ExternalLink size={14} /></button></div>
    <section className="stats-grid">
      <StatCard label="Total students" value="2,846" change="12.8%" tone="blue" icon={UsersRound} detail="vs. last academic year" />
      <StatCard label="Fees collected" value="UGX 4.82B" change="8.4%" tone="teal" icon={CreditCard} detail="of UGX 6.1B billed" />
      <StatCard label="Applications" value="968" change="24.6%" tone="purple" icon={ClipboardList} detail="August 2025 intake" />
      <StatCard label="Graduation ready" value="184" change="6.2%" tone="amber" icon={GraduationCap} detail="pending final clearance" />
    </section>
    <section className="dashboard-grid dashboard-grid-main">
      <Card className="chart-card enrolment-card"><div className="card-header"><div><h2>Enrolment movement</h2><p>Active students and new applications over the last 12 months</p></div><button className="card-menu" aria-label="Chart options"><MoreHorizontal size={18} /></button></div><div className="legend-row"><span><i className="legend-dot legend-blue" /> Active students</span><span><i className="legend-dot legend-teal" /> Applications</span><span className="chart-period">2025 <ChevronDown size={14} /></span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={enrolmentData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="studentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient><linearGradient id="appFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.16} /><stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'Poppins' }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'Poppins' }} /><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontFamily: 'Poppins', fontSize: 12 }} /><Area type="monotone" dataKey="students" stroke="var(--primary)" strokeWidth={2.5} fill="url(#studentFill)" /><Area type="monotone" dataKey="applications" stroke="var(--secondary)" strokeWidth={2.5} fill="url(#appFill)" /></AreaChart></ResponsiveContainer></div></Card>
      <Card className="chart-card faculty-card"><div className="card-header"><div><h2>Students by faculty</h2><p>Current active enrolment</p></div><button className="card-menu" aria-label="Chart options"><MoreHorizontal size={18} /></button></div><div className="donut-area"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={facultyData} innerRadius={65} outerRadius={92} paddingAngle={3} dataKey="value" stroke="none">{facultyData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontFamily: 'Poppins', fontSize: 12 }} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>2,846</strong><span>students</span></div></div><div className="faculty-legend">{facultyData.map((entry) => <div key={entry.name}><span><i style={{ background: entry.color }} />{entry.name}</span><strong>{entry.value}%</strong></div>)}</div></Card>
    </section>
    <section className="dashboard-grid dashboard-grid-bottom"><Card className="activity-card"><div className="card-header"><div><h2>Today at a glance</h2><p>Recent activity across your workspace</p></div><Button variant="ghost" size="sm">View all <ExternalLink size={14} /></Button></div><div className="activity-list">{activities.map((item) => { const Icon = item.icon; return <div className="activity-item" key={item.title}><div className={`activity-icon activity-${item.tone}`}><Icon size={16} /></div><div className="activity-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><time>{item.time}</time></div> })}</div></Card><Card className="quick-card"><div className="card-header"><div><h2>Quick actions</h2><p>Common tasks for this role</p></div><Zap size={18} className="quick-bolt" /></div><div className="quick-actions"><QuickAction label="Add student record" icon={Plus} /><QuickAction label="Review applications" icon={ClipboardList} count="24" /><QuickAction label="Export a report" icon={Download} /><QuickAction label="Manage access" icon={ShieldCheck} /></div></Card></section>
  </>
}

function StatCard({ label, value, change, detail, icon: Icon, tone }: { label: string; value: string; change: string; detail: string; icon: typeof UsersRound; tone: string }) {
  return <Card className="stat-card"><div className={`stat-icon stat-icon-${tone}`}><Icon size={19} /></div><div className="stat-label">{label}</div><div className="stat-value-row"><strong>{value}</strong><span className="stat-change"><TrendingUp size={13} /> {change}</span></div><div className="stat-detail">{detail}</div></Card>
}

function QuickAction({ label, icon: Icon, count }: { label: string; icon: typeof Plus; count?: string }) {
  return <button className="quick-action" onClick={() => toast.success(`${label} is ready to connect to your workflow.`)}><span className="quick-icon"><Icon size={16} /></span><span>{label}</span>{count && <Badge tone="warning">{count}</Badge>}<ChevronRight size={15} className="ms-auto" /></button>
}

function StudentsPage() {
  const { can } = useAppContext()
  const [modal, setModal] = useState<'create' | 'filters' | null>(null)
  if (!can('students.view')) return <PermissionEmpty />
  return <><div className="module-toolbar"><div className="toolbar-search"><Search size={16} /><input placeholder="Search by name, student ID, or programme" /></div><div className="toolbar-actions"><Button variant="outline" size="sm" onClick={() => setModal('filters')}><Filter size={15} /> Filters <Badge tone="info">2</Badge></Button><Button size="sm" onClick={() => setModal('create')}><Plus size={15} /> Add student</Button></div></div><Card className="module-table-card"><div className="table-card-head"><div className="module-title"><div className="module-title-icon module-icon-teal"><UsersRound size={19} /></div><div><h2>Student directory</h2><p>2,846 active records across 3 campuses</p></div></div><Button variant="ghost" size="sm" onClick={() => toast.success('Student import workflow opened.')}>Import records</Button></div><div className="table-responsive"><table className="data-table"><thead><tr><th>Student</th><th>Programme</th><th>Year</th><th>Status</th><th>Account balance</th><th>Last activity</th><th aria-label="Actions" /></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><div className="table-person"><span className="table-avatar table-avatar-photo">{student.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><div><strong>{student.name}</strong><small>{student.id}</small></div></div></td><td>{student.programme}</td><td>{student.year}</td><td><StatusBadge status={student.status} /></td><td className={student.balance === 'UGX 0' ? 'balance-clear' : ''}>{student.balance}</td><td>{student.lastSeen}</td><td><button className="row-more" aria-label={`More actions for ${student.name}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing 1–5 of 2,846 students</span><div className="pagination"><button aria-label="Previous page"><ChevronLeft size={15} /></button><button className="page-active">1</button><button>2</button><button>3</button><span>…</span><button>285</button><button aria-label="Next page"><ChevronRight size={15} /></button></div></div></Card>{modal === 'create' && <FormModal meta={{ title: 'Student' }} onClose={() => setModal(null)} />}{modal === 'filters' && <FilterModal onClose={() => setModal(null)} />}</>
}

function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().includes('missing') || status.toLowerCase().includes('attention') || status.toLowerCase().includes('hold') ? 'warning' : status.toLowerCase().includes('review') || status.toLowerCase().includes('draft') ? 'info' : status.toLowerCase().includes('published') || status.toLowerCase().includes('accepted') || status.toLowerCase().includes('active') || status.toLowerCase().includes('approved') || status.toLowerCase().includes('ready') || status.toLowerCase().includes('clear') || status.toLowerCase().includes('track') || status.toLowerCase().includes('posted') ? 'success' : 'neutral'
  return <Badge tone={tone}>{status}</Badge>
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
