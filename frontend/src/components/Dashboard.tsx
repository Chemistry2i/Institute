import { Badge, Button, Card, KpiCard } from './ui'
import { useAppContext } from '../app-context'
import { activities, enrolmentData, facultyData } from '../data'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChevronDown, ChevronRight, ClipboardList, CreditCard, Download, ExternalLink, GraduationCap, MoreHorizontal, Plus, ShieldCheck, UsersRound, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { role } = useAppContext()
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

function QuickAction({ label, icon: Icon, count }: { label: string; icon: typeof Plus; count?: string }) {
  return <button className="quick-action" onClick={() => toast.success(`${label} is ready to connect to your workflow.`)}><span className="quick-icon"><Icon size={16} /></span><span>{label}</span>{count && <Badge tone="warning">{count}</Badge>}<ChevronRight size={15} className="ms-auto" /></button>
}