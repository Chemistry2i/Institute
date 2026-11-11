import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { moduleRows } from '../data'
import { demoDataChangedEvent, readModuleRows } from '../demo-store'
import { Card } from './ui'

type OverviewChartProfile = {
  title: string
  description: string
  seriesLabel: string
  values: Array<{ label: string; value: number }>
}

const overviewChartProfiles: Record<string, OverviewChartProfile> = {
  '/admissions': { title: 'Intake conversion', description: 'Applicants progressing from submission to first enrollment', seriesLabel: 'Applicants', values: [{ label: 'Applied', value: 968 }, { label: 'Reviewed', value: 342 }, { label: 'Offers', value: 186 }, { label: 'Accepted', value: 122 }, { label: 'Enrolled', value: 68 }] },
  '/students': { title: 'Student distribution', description: 'Active student population by study year', seriesLabel: 'Students', values: [{ label: 'Year 1', value: 714 }, { label: 'Year 2', value: 688 }, { label: 'Year 3', value: 612 }, { label: 'Year 4+', value: 648 }, { label: 'Other', value: 184 }] },
  '/academics': { title: 'Academic structure', description: 'Configured units across the academic hierarchy', seriesLabel: 'Records', values: [{ label: 'Faculties', value: 3 }, { label: 'Departments', value: 10 }, { label: 'Programmes', value: 3 }, { label: 'Courses', value: 86 }, { label: 'Curricula', value: 12 }] },
  '/registration': { title: 'Registration progress', description: 'Student records by current registration stage', seriesLabel: 'Students', values: [{ label: 'Started', value: 2184 }, { label: 'Complete', value: 1862 }, { label: 'In progress', value: 176 }, { label: 'Awaiting approval', value: 146 }] },
  '/timetabling': { title: 'Venue utilization', description: 'Scheduled teaching capacity by campus', seriesLabel: 'Utilization %', values: [{ label: 'Main campus', value: 88 }, { label: 'East campus', value: 76 }, { label: 'North campus', value: 69 }, { label: 'Labs', value: 84 }] },
  '/attendance': { title: 'Participation by faculty', description: 'Average class attendance in the current teaching period', seriesLabel: 'Attendance %', values: [{ label: 'Computing', value: 84 }, { label: 'Business', value: 86 }, { label: 'Education', value: 79 }, { label: 'Health', value: 81 }, { label: 'Other', value: 82 }] },
  '/examinations': { title: 'Results readiness', description: 'Course units moving through marks and approval', seriesLabel: 'Course units', values: [{ label: 'Scheduled', value: 184 }, { label: 'Marks entered', value: 151 }, { label: 'Moderated', value: 92 }, { label: 'Ready to publish', value: 18 }] },
  '/finance': { title: 'Collections trend', description: 'Monthly fee collection against billed value', seriesLabel: 'UGX millions', values: [{ label: 'Jul', value: 412 }, { label: 'Aug', value: 684 }, { label: 'Sep', value: 735 }, { label: 'Oct', value: 812 }, { label: 'Nov', value: 906 }] },
  '/scholarships': { title: 'Awards by funding area', description: 'Current student awards across major funding areas', seriesLabel: 'Students', values: [{ label: 'Education', value: 28 }, { label: 'Merit', value: 21 }, { label: 'Need-based', value: 18 }, { label: 'Research', value: 9 }, { label: 'Other', value: 6 }] },
  '/learning': { title: 'Learning activity', description: 'Course spaces, resources, and assessment activity', seriesLabel: 'Items', values: [{ label: 'Course spaces', value: 86 }, { label: 'Resources', value: 1248 }, { label: 'Assignments', value: 214 }, { label: 'Submissions', value: 1842 }] },
  '/library': { title: 'Circulation activity', description: 'Weekly loans and returns across library locations', seriesLabel: 'Items', values: [{ label: 'Mon', value: 64 }, { label: 'Tue', value: 82 }, { label: 'Wed', value: 76 }, { label: 'Thu', value: 94 }, { label: 'Fri', value: 58 }] },
  '/staff': { title: 'Staff by faculty', description: 'Current staff distribution and workload coverage', seriesLabel: 'Staff', values: [{ label: 'Computing', value: 54 }, { label: 'Business', value: 48 }, { label: 'Education', value: 62 }, { label: 'Health', value: 51 }, { label: 'Administration', value: 31 }] },
  '/accommodation': { title: 'Residence occupancy', description: 'Occupied beds as a share of available capacity', seriesLabel: 'Occupancy %', values: [{ label: 'North Hall', value: 92 }, { label: 'East Hall', value: 78 }, { label: 'South Hall', value: 84 }, { label: 'Graduate house', value: 68 }] },
  '/internship': { title: 'Placement pipeline', description: 'Students moving from application to approved placement', seriesLabel: 'Students', values: [{ label: 'Seeking', value: 214 }, { label: 'Matched', value: 188 }, { label: 'Placed', value: 156 }, { label: 'Logbook active', value: 142 }] },
  '/welfare': { title: 'Support workload', description: 'Open support work by service type, shown in aggregate', seriesLabel: 'Cases', values: [{ label: 'Appointments', value: 32 }, { label: 'Follow-ups', value: 41 }, { label: 'Referrals', value: 8 }, { label: 'Other tasks', value: 17 }] },
  '/graduation': { title: 'Clearance completion', description: 'Candidate clearance by graduation requirement', seriesLabel: 'Candidates', values: [{ label: 'Academic', value: 172 }, { label: 'Finance', value: 168 }, { label: 'Library', value: 176 }, { label: 'All clear', value: 154 }] },
  '/communications': { title: 'Delivery by channel', description: 'Recent campaign delivery success', seriesLabel: 'Delivered %', values: [{ label: 'Email', value: 98 }, { label: 'SMS', value: 94 }, { label: 'In-app', value: 99 }, { label: 'Push', value: 91 }] },
  '/quality': { title: 'Improvement actions', description: 'Actions by current review state', seriesLabel: 'Actions', values: [{ label: 'Open', value: 14 }, { label: 'In progress', value: 28 }, { label: 'Verified', value: 46 }, { label: 'Overdue', value: 6 }] },
  '/procurement': { title: 'Requisition pipeline', description: 'Purchasing activity by current workflow stage', seriesLabel: 'Requisitions', values: [{ label: 'Submitted', value: 18 }, { label: 'Approved', value: 12 }, { label: 'Sourcing', value: 8 }, { label: 'Ordered', value: 24 }, { label: 'Received', value: 42 }] },
  '/reports': { title: 'Report freshness', description: 'Saved institutional reports by last refresh', seriesLabel: 'Reports', values: [{ label: 'Today', value: 18 }, { label: 'This week', value: 42 }, { label: 'Older', value: 6 }, { label: 'Scheduled', value: 12 }] },
  '/administration': { title: 'Platform operations', description: 'Jobs and connectors by current health state', seriesLabel: 'Services', values: [{ label: 'Healthy', value: 12 }, { label: 'Running', value: 8 }, { label: 'Needs review', value: 2 }, { label: 'Failed', value: 0 }] },
}

const chartColors = ['var(--primary)', 'var(--secondary)', 'var(--warning)', 'var(--info)', '#7c3aed']

export function ModuleOverviewCharts({ path }: { path: string }) {
  const profile = overviewChartProfiles[path]
  const [rows, setRows] = useState(() => readModuleRows(path, moduleRows[path] ?? []))

  useEffect(() => {
    const refresh = (event?: Event) => {
      const changedPaths = (event as CustomEvent<{ paths?: string[] }> | undefined)?.detail?.paths
      if (!changedPaths || changedPaths.includes(path)) setRows(readModuleRows(path, moduleRows[path] ?? []))
    }
    refresh()
    window.addEventListener(demoDataChangedEvent, refresh)
    return () => window.removeEventListener(demoDataChangedEvent, refresh)
  }, [path])

  if (!profile) return null

  const statusCounts = rows.reduce<Record<string, number>>((counts, row) => {
    const status = row.status || 'Unspecified'
    counts[status] = (counts[status] ?? 0) + 1
    return counts
  }, {})
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  const statusTotal = statusData.reduce((total, item) => total + item.value, 0)

  return <section className="module-overview-analytics" aria-label={`${path.slice(1)} overview analytics`}>
    <Card className="module-overview-chart-card">
      <div className="card-header"><div><h2>{profile.title}</h2><p>{profile.description}</p></div></div>
      <div className="module-overview-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={profile.values} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'Poppins' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'Poppins' }} />
        <Tooltip formatter={(value) => [`${value}`, profile.seriesLabel]} contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'Poppins', fontSize: 11 }} />
        <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={38} />
      </BarChart></ResponsiveContainer></div>
    </Card>
    <Card className="module-overview-chart-card">
      <div className="card-header"><div><h2>Work queue status</h2><p>{statusTotal} preview records by current state</p></div></div>
      {statusData.length > 0 ? <div className="module-overview-status-chart"><div className="module-overview-donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={47} outerRadius={69} paddingAngle={3} stroke="none">{statusData.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'Poppins', fontSize: 11 }} /></PieChart></ResponsiveContainer><div className="module-overview-donut-center"><strong>{statusTotal}</strong><span>records</span></div></div><div className="module-overview-legend">{statusData.map((item, index) => <div key={item.name}><span><i style={{ background: chartColors[index % chartColors.length] }} />{item.name}</span><strong>{item.value}</strong></div>)}</div></div> : <p className="settings-muted-copy">No queue status data available.</p>}
    </Card>
  </section>
}
