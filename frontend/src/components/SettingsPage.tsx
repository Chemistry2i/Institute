import { useState, type ReactNode } from 'react'
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Building2, CalendarDays, CircleHelp, Mail, Moon, Settings2, ShieldCheck, SlidersHorizontal, Sun, UsersRound } from 'lucide-react'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { useAppContext, defaultColors, type ThemeColors } from '../app-context'
import { institutionDefaults, roles } from '../data'
import { Badge, Button, Card } from './ui'

const settingsSections = [
  { path: 'identity', label: 'Institution identity', icon: Building2 },
  { path: 'appearance', label: 'Theme & appearance', icon: SlidersHorizontal },
  { path: 'calendar', label: 'Academic calendar', icon: CalendarDays },
  { path: 'notifications', label: 'Notifications', icon: Mail },
  { path: 'roles', label: 'Roles & permissions', icon: ShieldCheck },
]

export function SettingsPage() {
  const { pathname } = useLocation()
  const { can } = useAppContext()
  const sectionPath = pathname.split('/').pop() ?? ''
  const section = settingsSections.find((entry) => entry.path === sectionPath)

  if (!can('settings.manage')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to institution settings.</p></Card>
  if (pathname === '/settings') return <Navigate to="/settings/identity" replace />
  if (!section) return <Navigate to="/settings/identity" replace />

  return <div className="settings-layout">
    <nav className="settings-nav" aria-label="Settings sections">
      <div className="settings-nav-title">Settings</div>
      {settingsSections.map((entry) => {
        const Icon = entry.icon
        return <NavLink key={entry.path} to={`/settings/${entry.path}`} className={({ isActive }) => `settings-nav-item ${isActive ? 'active' : ''}`}>
          <Icon size={16} /><span>{entry.label}</span>
        </NavLink>
      })}
    </nav>
    <div className="settings-content" aria-live="polite">
      {section.path === 'identity' && <InstitutionIdentitySettings />}
      {section.path === 'appearance' && <AppearanceSettings />}
      {section.path === 'calendar' && <AcademicCalendarSettings />}
      {section.path === 'notifications' && <NotificationSettings />}
      {section.path === 'roles' && <RoleSettings />}
    </div>
  </div>
}

function SettingsPanel({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <Card className="settings-card">
    <div className="settings-card-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div></div>
    {children}
  </Card>
}

function InstitutionIdentitySettings() {
  const [identity, setIdentity] = useState({
    name: institutionDefaults.name,
    shortName: institutionDefaults.shortName,
    location: institutionDefaults.location,
    email: institutionDefaults.email,
    phone: institutionDefaults.phone,
    address: institutionDefaults.address,
  })

  const update = (key: keyof typeof identity, value: string) => setIdentity((current) => ({ ...current, [key]: value }))

  return <SettingsPanel eyebrow="Institution profile" title="Institution identity" description="Maintain the identity and contact details used across official views.">
    <div className="identity-block"><div className="identity-logo">{identity.shortName.slice(0, 1)}</div><div><strong>{identity.name}</strong><span>{institutionDefaults.type} · {identity.location}</span><small>{identity.address}</small></div><Button variant="outline" size="sm" onClick={() => toast.success('Logo upload is ready to connect.')}>Change logo</Button></div>
    <div className="identity-fields">
      <label>Institution name<input value={identity.name} onChange={(event) => update('name', event.target.value)} /></label>
      <label>Short name<input value={identity.shortName} onChange={(event) => update('shortName', event.target.value)} /></label>
      <label>Location<input value={identity.location} onChange={(event) => update('location', event.target.value)} /></label>
      <label>Contact email<input type="email" value={identity.email} onChange={(event) => update('email', event.target.value)} /></label>
      <label>Phone number<input value={identity.phone} onChange={(event) => update('phone', event.target.value)} /></label>
      <label>Postal address<input value={identity.address} onChange={(event) => update('address', event.target.value)} /></label>
    </div>
    <div className="settings-info-grid">
      <div><span>Institution type</span><strong>{institutionDefaults.type}</strong></div>
      <div><span>Campuses</span><strong>{institutionDefaults.campusCount}</strong></div>
      <div><span>Accreditation status</span><strong>{institutionDefaults.accreditation}</strong></div>
    </div>
    <div className="settings-actions"><Button onClick={() => toast.success('Institution identity saved in this preview.')}>Save identity</Button></div>
  </SettingsPanel>
}

function AppearanceSettings() {
  const { colors, setColors, mode, setMode } = useAppContext()
  const [draft, setDraft] = useState(colors)
  const updateColor = (key: keyof ThemeColors, value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const save = () => { setColors(draft); toast.success('Institution theme saved locally.') }
  const reset = async () => {
    const result = await Swal.fire({ title: 'Reset theme colours?', text: 'This will restore the TIMS institutional palette.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Reset colours', cancelButtonText: 'Keep current', confirmButtonColor: '#174A84' })
    if (result.isConfirmed) { setDraft(defaultColors); setColors(defaultColors); toast.success('Theme restored to the institutional palette.') }
  }

  return <SettingsPanel eyebrow="Interface system" title="Theme & appearance" description="Set the visual language teams use throughout their workspace.">
    <div className="settings-theme-preview" aria-label="Current theme preview"><span className="theme-preview-primary" /><span className="theme-preview-secondary" /><div><strong>Workspace preview</strong><small>Buttons, links, status accents, and KPI tones follow these tokens.</small></div></div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Color tokens</h3><p>Customize semantic colors without changing component code.</p></div><Badge tone="info">Admin only</Badge></div>
      <div className="color-grid">{(Object.keys(draft) as Array<keyof ThemeColors>).map((key) => <label className="color-field" key={key}><span><i className="color-swatch" style={{ background: draft[key] }} />{key[0].toUpperCase() + key.slice(1)}</span><div className="color-input-wrap"><input type="color" value={draft[key]} onChange={(event) => updateColor(key, event.target.value)} aria-label={`${key} color`} /><input value={draft[key]} onChange={(event) => updateColor(key, event.target.value)} aria-label={`${key} hex value`} /></div></label>)}</div>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Interface mode</h3><p>Choose the default viewing mode for your workspace.</p></div></div>
      <div className="mode-options"><button className={`mode-option ${mode === 'light' ? 'selected' : ''}`} onClick={() => setMode('light')}><Sun size={18} /><span><strong>Light mode</strong><small>Bright and print-friendly</small></span>{mode === 'light' && <span className="mode-selected" />}</button><button className={`mode-option ${mode === 'dark' ? 'selected' : ''}`} onClick={() => setMode('dark')}><Moon size={18} /><span><strong>Dark mode</strong><small>Reduced glare for late sessions</small></span>{mode === 'dark' && <span className="mode-selected" />}</button></div>
    </div>
    <div className="settings-actions"><Button variant="ghost" onClick={() => setDraft(colors)}>Discard changes</Button><Button variant="outline" onClick={() => void reset()}>Reset palette</Button><Button onClick={save}>Save appearance</Button></div>
  </SettingsPanel>
}

function AcademicCalendarSettings() {
  const [academicYear, setAcademicYear] = useState('2026/27')
  const [semester, setSemester] = useState('Semester II')
  const [startDate, setStartDate] = useState('2026-08-01')
  const [endDate, setEndDate] = useState('2026-12-18')
  const [registrationOpen, setRegistrationOpen] = useState('2026-07-20')
  const [registrationDeadline, setRegistrationDeadline] = useState('2026-08-21')
  const [addDropDeadline, setAddDropDeadline] = useState('2026-09-04')
  const [examinationStart, setExaminationStart] = useState('2026-11-23')
  const [resultsDeadline, setResultsDeadline] = useState('2027-01-08')

  return <SettingsPanel eyebrow="Academic configuration" title="Academic calendar" description="Configure the active academic year, semester, teaching dates, registration windows, and result milestones.">
    <div className="identity-fields">
      <label>Academic year<input value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} /></label>
      <label>Active semester<select value={semester} onChange={(event) => setSemester(event.target.value)}><option>Semester I</option><option>Semester II</option><option>Summer term</option></select></label>
      <label>Period start<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
      <label>Period end<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Term milestones</h3><p>Keep registration and assessment dates aligned to the academic period.</p></div></div>
      <div className="identity-fields">
        <label>Registration opens<input type="date" value={registrationOpen} onChange={(event) => setRegistrationOpen(event.target.value)} /></label>
        <label>Registration deadline<input type="date" value={registrationDeadline} onChange={(event) => setRegistrationDeadline(event.target.value)} /></label>
        <label>Add/drop deadline<input type="date" value={addDropDeadline} onChange={(event) => setAddDropDeadline(event.target.value)} /></label>
        <label>Examinations begin<input type="date" value={examinationStart} onChange={(event) => setExaminationStart(event.target.value)} /></label>
        <label>Results due<input type="date" value={resultsDeadline} onChange={(event) => setResultsDeadline(event.target.value)} /></label>
      </div>
    </div>
    <div className="settings-footnote"><CalendarDays size={15} /><span>Current preview period: {academicYear} · {semester}. Date changes will be preview-only until connected to the academic calendar API.</span></div>
    <div className="settings-actions"><Button onClick={() => toast.success('Academic calendar saved in this preview.')}>Save calendar</Button></div>
  </SettingsPanel>
}

function NotificationSettings() {
  const [channels, setChannels] = useState({ email: true, inApp: true, sms: false, weeklyDigest: true })
  const [categories, setCategories] = useState({ admissions: true, registration: true, finance: false, academic: true, welfare: true, system: true })
  const [quietStart, setQuietStart] = useState('21:00')
  const [quietEnd, setQuietEnd] = useState('07:00')
  const channelOptions = [
    { key: 'email', label: 'Email notifications', detail: 'Operational updates and assigned tasks' },
    { key: 'inApp', label: 'In-app notifications', detail: 'Approvals, alerts, and workflow changes' },
    { key: 'sms', label: 'SMS for urgent alerts', detail: 'Time-sensitive student and system alerts' },
    { key: 'weeklyDigest', label: 'Weekly summary', detail: 'A digest of activity and outstanding work' },
  ] as const
  const categoryOptions = [
    { key: 'admissions', label: 'Admissions decisions and applicant follow-up' },
    { key: 'registration', label: 'Registration approvals and deadlines' },
    { key: 'finance', label: 'Finance exceptions and payment reconciliation' },
    { key: 'academic', label: 'Teaching, assessments, and results' },
    { key: 'welfare', label: 'Student support assignments' },
    { key: 'system', label: 'System health and integration failures' },
  ] as const

  return <SettingsPanel eyebrow="Workspace preferences" title="Notifications" description="Choose delivery channels, operational categories, and quiet hours for this workspace.">
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Delivery channels</h3><p>Select where operational updates should be delivered.</p></div></div>
      <div className="notification-preferences">{channelOptions.map((option) => <label className="notification-preference" key={option.key}><span><strong>{option.label}</strong><small>{option.detail}</small></span><input type="checkbox" checked={channels[option.key]} onChange={(event) => setChannels((current) => ({ ...current, [option.key]: event.target.checked }))} /></label>)}</div>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Notification categories</h3><p>Choose the areas that should generate notifications.</p></div></div>
      <div className="notification-category-grid">{categoryOptions.map((option) => <label className="notification-category" key={option.key}><input type="checkbox" checked={categories[option.key]} onChange={(event) => setCategories((current) => ({ ...current, [option.key]: event.target.checked }))} /><span>{option.label}</span></label>)}</div>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Quiet hours</h3><p>Urgent system alerts are not affected.</p></div></div><div className="identity-fields"><label>Start time<input type="time" value={quietStart} onChange={(event) => setQuietStart(event.target.value)} /></label><label>End time<input type="time" value={quietEnd} onChange={(event) => setQuietEnd(event.target.value)} /></label></div></div>
    <div className="settings-actions"><Button onClick={() => toast.success('Notification preferences saved in this preview.')}>Save preferences</Button></div>
  </SettingsPanel>
}

function RoleSettings() {
  const navigate = useNavigate()
  const { role: activeRole } = useAppContext()
  return <SettingsPanel eyebrow="Access governance" title="Roles & permissions" description="Review permission-led access templates and who can manage them.">
    <div className="settings-role-summary"><span className="settings-role-icon"><UsersRound size={20} /></span><div><strong>{roles.length} role templates configured</strong><p>Current access preview: {activeRole}. Permissions are evaluated by module access ID.</p></div></div>
    <div className="settings-role-list">{roles.slice(0, 6).map((roleTemplate) => <div className="settings-role-row" key={roleTemplate.name}><span className="role-avatar" style={{ background: roleTemplate.color }}>{roleTemplate.shortName}</span><span><strong>{roleTemplate.name}</strong><small>{roleTemplate.permissions.length} permissions</small></span><Badge tone={roleTemplate.name === activeRole ? 'success' : 'neutral'}>{roleTemplate.name === activeRole ? 'Current preview' : 'Template'}</Badge></div>)}</div>
    <div className="permission-note"><CircleHelp size={16} /><span>Permission checks are active in the frontend preview. API authorization should enforce the same access boundaries.</span></div>
    <div className="settings-actions"><Button onClick={() => navigate('/users')}>Open users & roles</Button><Button variant="outline" onClick={() => toast.success('Access review task created in this preview.')}>Request access review</Button></div>
  </SettingsPanel>
}