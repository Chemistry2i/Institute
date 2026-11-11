import { Badge, Button, Card, KpiCard } from './ui'
import { useAppContext } from '../app-context'
import { activities, adminNavigationItems, enrolmentData, facultyData, moduleKpis, moduleRows, navigationItems, type Permission, type RoleName } from '../data'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BookOpen as BookOpenIcon, CalendarDays as CalendarDaysIcon, ChevronDown, ChevronRight, ClipboardList, CreditCard, Download, ExternalLink, FileText as FileTextIcon, GraduationCap, MoreHorizontal, Plus, ShieldCheck, UsersRound, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

type RoleWorkspaceConfig = {
  title: string
  description: string
  metrics: Array<{ label: string; value: string; detail: string; icon: typeof UsersRound; tone: 'blue' | 'teal' | 'purple' | 'amber' }>
  queue: Array<{ label: string; status: string }>
  actions: Array<{ label: string; href: string; permission: Permission; icon: typeof Plus }>
}

const roleWorkspaces: Partial<Record<RoleName, RoleWorkspaceConfig>> = {
  Student: {
    title: 'My student workspace', description: 'A personal view of course registration, results, attendance, and account tasks.',
    metrics: [
      { label: 'Course units', value: '6', detail: 'Current semester', icon: BookOpenIcon, tone: 'blue' },
      { label: 'Attendance', value: '92%', detail: 'Current teaching period', icon: CalendarDaysIcon, tone: 'teal' },
      { label: 'Account balance', value: 'UGX 680K', detail: 'Review your fee account', icon: CreditCard, tone: 'amber' },
      { label: 'Results available', value: '4', detail: 'Published course units', icon: GraduationCap, tone: 'purple' },
    ],
    queue: [{ label: 'Registration', status: 'Open' }, { label: 'CSC 204 attendance', status: '92%' }, { label: 'Fee account statement', status: 'Ready' }],
    actions: [
      { label: 'Register for courses', href: '/registration/course-registration', permission: 'registration.view', icon: ClipboardList },
      { label: 'View results', href: '/examinations', permission: 'examinations.view', icon: GraduationCap },
      { label: 'View fee account', href: '/finance/accounts', permission: 'finance.view', icon: CreditCard },
    ],
  },
  'Parent / Sponsor': {
    title: 'Sponsor workspace', description: 'Review linked student account information and sponsorship activity.',
    metrics: [
      { label: 'Linked accounts', value: '1', detail: 'Explicitly linked students', icon: UsersRound, tone: 'blue' },
      { label: 'Balance due', value: 'UGX 680K', detail: 'Current account preview', icon: CreditCard, tone: 'amber' },
      { label: 'Payments this term', value: '2', detail: 'Recent account activity', icon: ShieldCheck, tone: 'teal' },
      { label: 'Statements ready', value: '1', detail: 'Available for review', icon: FileTextIcon, tone: 'purple' },
    ],
    queue: [{ label: 'Fee statement', status: 'Ready' }, { label: 'Payment confirmation', status: 'Posted' }],
    actions: [{ label: 'Open linked account', href: '/finance/accounts', permission: 'finance.view', icon: CreditCard }],
  },
  Lecturer: {
    title: 'Teaching workspace', description: 'Prioritize teaching delivery, assessment, and assigned student work.',
    metrics: [
      { label: 'Course units', value: '6', detail: 'Assigned this semester', icon: BookOpenIcon, tone: 'blue' },
      { label: 'Marks pending', value: '3', detail: 'Course submissions to review', icon: ClipboardList, tone: 'amber' },
      { label: 'Results ready', value: '2', detail: 'Awaiting faculty approval', icon: ShieldCheck, tone: 'teal' },
      { label: 'Teaching load', value: '18 hrs', detail: 'Weekly contact hours', icon: CalendarDaysIcon, tone: 'purple' },
    ],
    queue: [{ label: 'CSC 204 marks', status: 'Under review' }, { label: 'BBA 310 results', status: 'Ready to approve' }, { label: 'Course resources', status: 'Updated' }],
    actions: [
      { label: 'Review assessments', href: '/examinations/marks-entry', permission: 'examinations.view', icon: ClipboardList },
      { label: 'View academic structure', href: '/academics/courses', permission: 'academics.view', icon: BookOpenIcon },
    ],
  },
  'Class Tutor': {
    title: 'Tutor workspace', description: 'Follow assigned cohorts, attendance concerns, and student support tasks.',
    metrics: [
      { label: 'Assigned students', value: '42', detail: 'Current tutor group', icon: UsersRound, tone: 'blue' },
      { label: 'Attendance alerts', value: '5', detail: 'Need advisor follow-up', icon: CalendarDaysIcon, tone: 'amber' },
      { label: 'Support follow-ups', value: '3', detail: 'Open assigned tasks', icon: ShieldCheck, tone: 'purple' },
      { label: 'Registers today', value: '4', detail: 'Scheduled class sessions', icon: ClipboardList, tone: 'teal' },
    ],
    queue: [{ label: 'Low attendance cases', status: '5 open' }, { label: 'Student support follow-ups', status: '3 open' }],
    actions: [
      { label: 'Review attendance alerts', href: '/attendance/alerts', permission: 'attendance.view', icon: CalendarDaysIcon },
      { label: 'Open student directory', href: '/students/directory', permission: 'students.view', icon: UsersRound },
      { label: 'Review welfare follow-ups', href: '/welfare/follow-up', permission: 'welfare.view', icon: ShieldCheck },
    ],
  },
  'Admissions Officer': {
    title: 'Admissions workspace', description: 'Work applicant review, verification, offers, and matriculation queues.',
    metrics: [
      { label: 'Applications', value: '968', detail: 'Current intake', icon: ClipboardList, tone: 'blue' },
      { label: 'Under review', value: '342', detail: 'Faculty decision queue', icon: UsersRound, tone: 'amber' },
      { label: 'Offers accepted', value: '122', detail: 'Ready for matriculation', icon: ShieldCheck, tone: 'teal' },
      { label: 'Matriculation ready', value: '68', detail: 'Clearance completed', icon: GraduationCap, tone: 'purple' },
    ],
    queue: [{ label: 'Applications awaiting review', status: '342' }, { label: 'Document verification', status: '42 missing' }, { label: 'Enrollment clearance', status: '34 open' }],
    actions: [
      { label: 'Review application pipeline', href: '/admissions/application-pipeline', permission: 'admissions.view', icon: ClipboardList },
      { label: 'Process matriculation', href: '/admissions/matriculation', permission: 'admissions.view', icon: GraduationCap },
      { label: 'Verify documents', href: '/admissions/document-verification', permission: 'admissions.view', icon: FileTextIcon },
    ],
  },
  'Academic Registrar': {
    title: 'Registrar workspace', description: 'Coordinate enrollment, academic records, approvals, and student progression.',
    metrics: [
      { label: 'Registration complete', value: '85%', detail: 'Current semester cohort', icon: GraduationCap, tone: 'blue' },
      { label: 'Awaiting approvals', value: '146', detail: 'Across registrar queues', icon: ClipboardList, tone: 'amber' },
      { label: 'Matriculation ready', value: '68', detail: 'Accepted intake applicants', icon: UsersRound, tone: 'teal' },
      { label: 'Credit exceptions', value: '38', detail: 'Need policy review', icon: ShieldCheck, tone: 'purple' },
    ],
    queue: [{ label: 'Late registration requests', status: '24 pending' }, { label: 'Credit-load exceptions', status: '38 open' }, { label: 'Matriculation clearances', status: '34 in review' }],
    actions: [
      { label: 'Review registration approvals', href: '/registration/approvals', permission: 'registration.view', icon: ClipboardList },
      { label: 'Review enrollment pipeline', href: '/admissions/matriculation', permission: 'admissions.view', icon: GraduationCap },
      { label: 'Manage academic periods', href: '/academics/calendar', permission: 'academics.view', icon: CalendarDaysIcon },
    ],
  },
  'Finance Officer': {
    title: 'Finance workspace', description: 'Prioritize billing, unmatched payments, student accounts, and approvals.',
    metrics: [
      { label: 'Fees billed', value: 'UGX 5.14B', detail: 'Current semester', icon: CreditCard, tone: 'blue' },
      { label: 'Collected', value: 'UGX 3.86B', detail: '75% of billed fees', icon: ShieldCheck, tone: 'teal' },
      { label: 'Unmatched payments', value: 'UGX 186M', detail: 'Reconciliation queue', icon: ClipboardList, tone: 'amber' },
      { label: 'Refunds pending', value: '6', detail: 'Approval required', icon: FileTextIcon, tone: 'purple' },
    ],
    queue: [{ label: 'Unmatched payments', status: 'UGX 186M' }, { label: 'Refund approvals', status: '6 pending' }, { label: 'Student account holds', status: '82 open' }],
    actions: [
      { label: 'Review reconciliation', href: '/finance/reconciliation', permission: 'finance.view', icon: CreditCard },
      { label: 'Review student accounts', href: '/finance/accounts', permission: 'finance.view', icon: UsersRound },
      { label: 'Manage billing', href: '/finance/billing', permission: 'finance.view', icon: ClipboardList },
    ],
  },
  'Examination Officer': {
    title: 'Examinations workspace', description: 'Monitor marks entry, moderation, approvals, and results publication.',
    metrics: [
      { label: 'Assessments', value: '184', detail: 'Current semester', icon: ClipboardList, tone: 'blue' },
      { label: 'Marks complete', value: '82%', detail: 'Across course units', icon: FileTextIcon, tone: 'teal' },
      { label: 'Moderation queue', value: '26', detail: 'Awaiting review', icon: ShieldCheck, tone: 'amber' },
      { label: 'Ready to publish', value: '18', detail: 'Approved result sets', icon: GraduationCap, tone: 'purple' },
    ],
    queue: [{ label: 'Missing marks', status: '12 courses' }, { label: 'Moderation', status: '26 open' }, { label: 'Publication approvals', status: '9 pending' }],
    actions: [
      { label: 'Review marks entry', href: '/examinations/marks-entry', permission: 'examinations.view', icon: FileTextIcon },
      { label: 'Open moderation queue', href: '/examinations/moderation', permission: 'examinations.view', icon: ShieldCheck },
      { label: 'Manage result releases', href: '/examinations/publication', permission: 'examinations.view', icon: GraduationCap },
    ],
  },
}

export function Dashboard() {
  const { role, can } = useAppContext()
  const roleWorkspace = roleWorkspaces[role] ?? (role === 'Super Administrator' ? undefined : buildRoleWorkspace(role, can))
  if (roleWorkspace) return <RoleDashboard role={role} config={roleWorkspace} />
  return <>
    <div className="role-banner"><div className="role-banner-icon"><ShieldCheck size={18} /></div><div><strong>RBAC preview active</strong><span>You are viewing the workspace as <b>{role}</b>. Permissions are ready to connect to your authentication service.</span></div><button className="role-banner-link">View access matrix <ExternalLink size={14} /></button></div>
    <section className="stats-grid">
      <KpiCard label="Total students" value="2,846" change="12.8%" tone="blue" icon={UsersRound} detail="vs. last academic year" />
      <KpiCard label="Fees collected" value="UGX 4.82B" change="8.4%" tone="teal" icon={CreditCard} detail="of UGX 6.1B billed" />
      <KpiCard label="Applications" value="968" change="24.6%" tone="purple" icon={ClipboardList} detail="August 2025 intake" />
      <KpiCard label="Graduation ready" value="184" change="6.2%" tone="amber" icon={GraduationCap} detail="pending final clearance" />
    </section>
    <section className="dashboard-grid dashboard-grid-main">
      <Card className="chart-card enrolment-card">
        <div className="card-header"><div><h2>Enrolment movement</h2><p>Active students and new applications over the last 12 months</p></div><button className="card-menu" aria-label="Chart options"><MoreHorizontal size={18} /></button></div>
        <div className="legend-row"><span><i className="legend-dot legend-blue" /> Active students</span><span><i className="legend-dot legend-teal" /> Applications</span><span className="chart-period">2025 <ChevronDown size={14} /></span></div>
        <div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={enrolmentData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="studentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient>
            <linearGradient id="appFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.16} /><stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'Poppins' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'Poppins' }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontFamily: 'Poppins', fontSize: 12 }} />
          <Area type="monotone" dataKey="students" stroke="var(--primary)" strokeWidth={2.5} fill="url(#studentFill)" />
          <Area type="monotone" dataKey="applications" stroke="var(--secondary)" strokeWidth={2.5} fill="url(#appFill)" />
        </AreaChart></ResponsiveContainer></div>
      </Card>
      <Card className="chart-card faculty-card">
        <div className="card-header"><div><h2>Students by faculty</h2><p>Current active enrolment</p></div><button className="card-menu" aria-label="Chart options"><MoreHorizontal size={18} /></button></div>
        <div className="donut-area"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={facultyData} innerRadius={65} outerRadius={92} paddingAngle={3} dataKey="value" stroke="none">{facultyData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontFamily: 'Poppins', fontSize: 12 }} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>2,846</strong><span>students</span></div></div>
        <div className="faculty-legend">{facultyData.map((entry) => <div key={entry.name}><span><i style={{ background: entry.color }} />{entry.name}</span><strong>{entry.value}%</strong></div>)}</div>
      </Card>
    </section>
    <section className="dashboard-grid dashboard-grid-bottom">
      <Card className="activity-card"><div className="card-header"><div><h2>Today at a glance</h2><p>Recent activity across your workspace</p></div><Button variant="ghost" size="sm">View all <ExternalLink size={14} /></Button></div><div className="activity-list">{activities.map((item) => { const Icon = item.icon; return <div className="activity-item" key={item.title}><div className={`activity-icon activity-${item.tone}`}><Icon size={16} /></div><div className="activity-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><time>{item.time}</time></div> })}</div></Card>
      <Card className="quick-card"><div className="card-header"><div><h2>Quick actions</h2><p>Common tasks for this role</p></div><Zap size={18} className="quick-bolt" /></div><div className="quick-actions"><QuickAction label="Add student record" icon={Plus} /><QuickAction label="Review applications" icon={ClipboardList} count="24" /><QuickAction label="Export a report" icon={Download} /><QuickAction label="Manage access" icon={ShieldCheck} /></div></Card>
    </section>
  </>
}

function buildRoleWorkspace(role: RoleName, can: (permission: Permission) => boolean): RoleWorkspaceConfig {
  const permittedModules = [...navigationItems, ...adminNavigationItems]
    .filter((item) => item.href !== '/' && can(item.permission))
  const metrics = permittedModules.flatMap((item) => moduleKpis[item.href] ?? []).slice(0, 4)
  const queue = permittedModules.flatMap((item) => (moduleRows[item.href] ?? [])
    .filter((row) => /attention|pending|review|missing|hold/i.test(row.status))
    .map((row) => ({ label: `${item.label}: ${row.applicant}`, status: row.status })))
    .slice(0, 5)

  return {
    title: `${role} workspace`,
    description: 'A role-specific view built from the modules and actions available to this permission profile.',
    metrics: metrics.length ? metrics : [{ label: 'Assigned modules', value: `${permittedModules.length}`, detail: 'Available to this role', icon: UsersRound, tone: 'blue' }],
    queue: queue.length ? queue : [{ label: 'Assigned module work', status: 'No flagged preview records' }],
    actions: permittedModules.slice(0, 6).map((item) => ({ label: `Open ${item.label}`, href: item.href, permission: item.permission, icon: item.icon })),
  }
}

function RoleDashboard({ role, config }: { role: RoleName; config: RoleWorkspaceConfig }) {
  const { can } = useAppContext()
  const actions = config.actions.filter((action) => can(action.permission))
  return <>
    <div className="role-banner"><div className="role-banner-icon"><ShieldCheck size={18} /></div><div><strong>{config.title}</strong><span>You are previewing the <b>{role}</b> workspace. Data shown here is a local frontend preview.</span></div></div>
    <section className="stats-grid">{config.metrics.map((metric) => <KpiCard key={metric.label} {...metric} />)}</section>
    <section className="dashboard-grid dashboard-grid-bottom role-dashboard-grid">
      <Card className="activity-card"><div className="card-header"><div><h2>Priority work</h2><p>Items for this role to review</p></div><ShieldCheck size={18} className="header-icon" /></div><div className="role-dashboard-queue">{config.queue.map((item) => <div className="role-dashboard-queue-row" key={item.label}><span>{item.label}</span><strong>{item.status}</strong></div>)}</div></Card>
      <Card className="quick-card"><div className="card-header"><div><h2>Role actions</h2><p>Available in this workspace</p></div><Zap size={18} className="quick-bolt" /></div><div className="quick-actions">{actions.map((action) => { const ActionIcon = action.icon; return <Link className="quick-action" key={action.href} to={action.href}><span className="quick-icon"><ActionIcon size={16} /></span><span>{action.label}</span><ChevronRight size={15} className="ms-auto" /></Link> })}</div></Card>
    </section>
  </>
}

function QuickAction({ label, icon: Icon, count }: { label: string; icon: typeof Plus; count?: string }) {
  return <button className="quick-action" onClick={() => toast.success(`${label} is ready to connect to your workflow.`)}><span className="quick-icon"><Icon size={16} /></span><span>{label}</span>{count && <Badge tone="warning">{count}</Badge>}<ChevronRight size={15} className="ms-auto" /></button>
}