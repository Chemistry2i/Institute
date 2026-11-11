import { createContext, useCallback, useContext, useEffect, useState, type Dispatch, type MouseEvent as ReactMouseEvent, type ReactNode, type SetStateAction } from 'react'
import { Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Building2, CalendarDays, CircleHelp, DatabaseBackup, FileCheck2, Mail, Moon, PlugZap, Settings2, ShieldCheck, SlidersHorizontal, Sun, UsersRound } from 'lucide-react'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { useAppContext, defaultColors, type ThemeColors } from '../app-context'
import { adminNavigationItems, institutionDefaults, navigationItems, roles, type Permission, type RoleName } from '../data'
import { Badge, Button, Card } from './ui'

type SettingsSaveState = 'idle' | 'saving' | 'saved' | 'error'
type SettingsWorkflow = (key: string, dirty: boolean) => void
type SettingsDraft<T extends object> = {
  draft: T
  setDraft: Dispatch<SetStateAction<T>>
  isDirty: boolean
  saveState: SettingsSaveState
  saveError: string
  save: (validate?: (value: T) => string | null, apply?: (value: T) => void) => Promise<boolean>
  discard: () => void
}

const SettingsWorkflowContext = createContext<SettingsWorkflow | null>(null)

function readSavedSettings<T extends object>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`tims-settings-${key}`)
    return { ...fallback, ...JSON.parse(saved ?? 'null') } as T
  } catch {
    return fallback
  }
}

function readDraftSettings<T extends object>(key: string, savedValue: T): T {
  try {
    const draft = localStorage.getItem(`tims-settings-draft-${key}`)
    return draft ? { ...savedValue, ...JSON.parse(draft) } as T : savedValue
  } catch {
    return savedValue
  }
}

function useSettingsDraft<T extends object>(key: string, initialValue: T): SettingsDraft<T> {
  const reportDirty = useContext(SettingsWorkflowContext)
  const [savedValue, setSavedValue] = useState(() => readSavedSettings(key, initialValue))
  const [draft, setDraft] = useState(() => readDraftSettings(key, readSavedSettings(key, initialValue)))
  const [saveState, setSaveState] = useState<SettingsSaveState>('idle')
  const [saveError, setSaveError] = useState('')
  const isDirty = JSON.stringify(draft) !== JSON.stringify(savedValue)

  useEffect(() => {
    reportDirty?.(key, isDirty)
    try {
      if (isDirty) localStorage.setItem(`tims-settings-draft-${key}`, JSON.stringify(draft))
      else localStorage.removeItem(`tims-settings-draft-${key}`)
    } catch {
      setSaveError('The draft could not be stored in this browser.')
      setSaveState('error')
    }
  }, [draft, isDirty, key, reportDirty])

  const save = async (validate?: (value: T) => string | null, apply?: (value: T) => void) => {
    const validationError = validate?.(draft)
    if (validationError) {
      setSaveError(validationError)
      setSaveState('error')
      return false
    }

    setSaveState('saving')
    setSaveError('')
    await new Promise((resolve) => window.setTimeout(resolve, 320))
    try {
      localStorage.setItem(`tims-settings-${key}`, JSON.stringify(draft))
      localStorage.removeItem(`tims-settings-draft-${key}`)
      apply?.(draft)
      setSavedValue(draft)
      setSaveState('saved')
      return true
    } catch {
      setSaveError('Settings could not be saved in this browser. Check available storage and retry.')
      setSaveState('error')
      return false
    }
  }

  const discard = () => {
    setDraft(savedValue)
    setSaveError('')
    setSaveState('idle')
    try { localStorage.removeItem(`tims-settings-draft-${key}`) } catch { /* The in-memory draft is still restored. */ }
  }

  return { draft, setDraft, isDirty, saveState, saveError, save, discard }
}

const settingsSections = [
  { path: 'identity', label: 'Institution identity', icon: Building2 },
  { path: 'appearance', label: 'Theme & appearance', icon: SlidersHorizontal },
  { path: 'calendar', label: 'Academic calendar', icon: CalendarDays },
  { path: 'notifications', label: 'Notifications', icon: Mail },
  { path: 'roles', label: 'Roles & permissions', icon: ShieldCheck },
  { path: 'security', label: 'Security policy', icon: ShieldCheck },
  { path: 'defaults', label: 'System defaults', icon: Settings2 },
  { path: 'integrations', label: 'Integrations', icon: PlugZap },
  { path: 'backups', label: 'Backups & restore', icon: DatabaseBackup },
]

export function SettingsPage() {
  const { pathname } = useLocation()
  const { can } = useAppContext()
  const [dirtySections, setDirtySections] = useState<string[]>([])
  const sectionPath = pathname.split('/').pop() ?? ''
  const section = settingsSections.find((entry) => entry.path === sectionPath)
  const reportDirty = useCallback<SettingsWorkflow>((key, dirty) => setDirtySections((current) => {
    const next = new Set(current)
    if (dirty) next.add(key)
    else next.delete(key)
    const updated = Array.from(next)
    return updated.length === current.length && updated.every((item) => current.includes(item)) ? current : updated
  }), [])

  useEffect(() => {
    if (dirtySections.length === 0) return
    const warnBeforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warnBeforeUnload)
    return () => window.removeEventListener('beforeunload', warnBeforeUnload)
  }, [dirtySections.length])

  const guardNavigation = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (dirtySections.length > 0 && !window.confirm('Unsaved settings drafts are stored in this browser. Leave this section?')) event.preventDefault()
  }

  if (!can('settings.manage')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to institution settings.</p></Card>
  if (pathname === '/settings') return <Navigate to="/settings/identity" replace />
  if (!section) return <Navigate to="/settings/identity" replace />

  return <SettingsWorkflowContext.Provider value={reportDirty}><div className="settings-layout">
    <nav className="settings-nav" aria-label="Settings sections">
      <div className="settings-nav-title">Settings</div>
      {dirtySections.length > 0 && <div className="settings-unsaved-note" role="status">Unsaved draft{dirtySections.length > 1 ? 's' : ''}: {dirtySections.map((key) => settingsSections.find((entry) => entry.path === key)?.label ?? key).join(', ')}</div>}
      {settingsSections.map((entry) => {
        const Icon = entry.icon
        return <NavLink key={entry.path} to={`/settings/${entry.path}`} onClick={guardNavigation} className={({ isActive }) => `settings-nav-item ${isActive ? 'active' : ''}`}>
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
      {section.path === 'security' && <SecuritySettings />}
      {section.path === 'defaults' && <SystemDefaultsSettings />}
      {section.path === 'integrations' && <IntegrationSettings />}
      {section.path === 'backups' && <BackupSettings />}
    </div>
  </div></SettingsWorkflowContext.Provider>
}

function SettingsPanel({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <Card className="settings-card">
    <div className="settings-card-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div></div>
    {children}
  </Card>
}

function SettingsActions({ isDirty, saveState, saveError, onSave, onDiscard }: { isDirty: boolean; saveState: SettingsSaveState; saveError: string; onSave: () => void; onDiscard: () => void }) {
  return <>
    {saveError && <div className="settings-form-message settings-form-error" role="alert">{saveError}</div>}
    {saveState === 'saved' && <div className="settings-form-message settings-form-success" role="status">Changes saved in this browser preview.</div>}
    <div className="settings-actions"><Button variant="ghost" onClick={onDiscard} disabled={!isDirty || saveState === 'saving'}>Discard changes</Button><Button onClick={onSave} loading={saveState === 'saving'} disabled={!isDirty || saveState === 'saving'}>{saveState === 'saving' ? 'Saving' : 'Save changes'}</Button></div>
  </>
}

function InstitutionIdentitySettings() {
  const { draft, setDraft, isDirty, saveState, saveError, save, discard } = useSettingsDraft('identity', {
    name: institutionDefaults.name,
    shortName: institutionDefaults.shortName,
    location: institutionDefaults.location,
    email: institutionDefaults.email,
    phone: institutionDefaults.phone,
    address: institutionDefaults.address,
    timezone: 'Africa/Kampala',
    locale: 'en-UG',
    currency: 'UGX',
    logoDataUrl: '',
    campuses: [
      { id: 'main', name: 'Main campus', location: 'Kampala', active: true },
      { id: 'east', name: 'East campus', location: 'Jinja', active: true },
    ],
  })

  const update = (key: 'name' | 'shortName' | 'location' | 'email' | 'phone' | 'address' | 'timezone' | 'locale' | 'currency', value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const updateCampus = (id: string, key: 'name' | 'location' | 'active', value: string | boolean) => setDraft((current) => ({
    ...current,
    campuses: current.campuses.map((campus) => campus.id === id ? { ...campus, [key]: value } : campus),
  }))
  const addCampus = () => setDraft((current) => ({
    ...current,
    campuses: [...current.campuses, { id: `campus-${Date.now()}`, name: '', location: '', active: true }],
  }))
  const removeCampus = (id: string) => setDraft((current) => ({ ...current, campuses: current.campuses.filter((campus) => campus.id !== id) }))
  const [logoError, setLogoError] = useState('')
  const replaceLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 500_000) { setLogoError('Choose an image smaller than 500 KB.'); return }
    const reader = new FileReader()
    reader.onload = () => setDraft((current) => ({ ...current, logoDataUrl: String(reader.result ?? '') }))
    reader.onerror = () => setLogoError('The selected logo could not be read.')
    reader.readAsDataURL(file)
    setLogoError('')
  }
  const saveIdentity = () => void save((value) => {
    if (!value.name.trim() || !value.shortName.trim()) return 'Institution name and short name are required.'
    if (!/^\S+@\S+\.\S+$/.test(value.email)) return 'Enter a valid institutional contact email.'
    if (!value.campuses.length || value.campuses.some((campus) => !campus.name.trim() || !campus.location.trim())) return 'Each campus needs a name and location.'
    return null
  })

  return <SettingsPanel eyebrow="Institution profile" title="Institution identity" description="Maintain the identity and contact details used across official views.">
    <div className="identity-block"><div className="identity-logo">{draft.logoDataUrl ? <img src={draft.logoDataUrl} alt="Institution logo preview" /> : draft.shortName.slice(0, 1)}</div><div><strong>{draft.name}</strong><span>{institutionDefaults.type} · {draft.location}</span><small>{draft.address}</small></div><label className="settings-upload-button">Replace logo<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={replaceLogo} /></label></div>
    {logoError && <div className="settings-form-message settings-form-error" role="alert">{logoError}</div>}
    <div className="identity-fields">
      <label>Institution name<input value={draft.name} onChange={(event) => update('name', event.target.value)} /></label>
      <label>Short name<input value={draft.shortName} onChange={(event) => update('shortName', event.target.value)} /></label>
      <label>Location<input value={draft.location} onChange={(event) => update('location', event.target.value)} /></label>
      <label>Contact email<input type="email" value={draft.email} onChange={(event) => update('email', event.target.value)} /></label>
      <label>Phone number<input value={draft.phone} onChange={(event) => update('phone', event.target.value)} /></label>
      <label>Postal address<input value={draft.address} onChange={(event) => update('address', event.target.value)} /></label>
      <label>Timezone<select value={draft.timezone} onChange={(event) => update('timezone', event.target.value)}><option>Africa/Kampala</option><option>Africa/Nairobi</option><option>UTC</option></select></label>
      <label>Locale<select value={draft.locale} onChange={(event) => update('locale', event.target.value)}><option value="en-UG">English (Uganda)</option><option value="en-KE">English (Kenya)</option><option value="en-GB">English (United Kingdom)</option></select></label>
      <label>Currency<select value={draft.currency} onChange={(event) => update('currency', event.target.value)}><option value="UGX">UGX · Ugandan Shilling</option><option value="KES">KES · Kenyan Shilling</option><option value="USD">USD · US Dollar</option></select></label>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Campuses</h3><p>Manage campus locations used throughout institutional workflows.</p></div><Button variant="outline" size="sm" onClick={addCampus}>Add campus</Button></div>
      <div className="settings-campus-list">{draft.campuses.map((campus) => <div className="settings-campus-row" key={campus.id}><label>Campus name<input value={campus.name} onChange={(event) => updateCampus(campus.id, 'name', event.target.value)} /></label><label>Location<input value={campus.location} onChange={(event) => updateCampus(campus.id, 'location', event.target.value)} /></label><label className="settings-inline-toggle"><input type="checkbox" checked={campus.active} onChange={(event) => updateCampus(campus.id, 'active', event.target.checked)} /> Active</label><Button variant="ghost" size="sm" onClick={() => removeCampus(campus.id)}>Remove</Button></div>)}</div>
    </div>
    <div className="settings-info-grid">
      <div><span>Institution type</span><strong>{institutionDefaults.type}</strong></div>
      <div><span>Campuses</span><strong>{draft.campuses.length}</strong></div>
      <div><span>Accreditation status</span><strong>{institutionDefaults.accreditation}</strong></div>
    </div>
    <SettingsActions isDirty={isDirty} saveState={saveState} saveError={saveError} onSave={saveIdentity} onDiscard={discard} />
  </SettingsPanel>
}

function AppearanceSettings() {
  const { colors, setColors, mode, setMode } = useAppContext()
  const { draft, setDraft, isDirty, saveState, saveError, save, discard } = useSettingsDraft('appearance', { colors, mode })
  const updateColor = (key: keyof ThemeColors, value: string) => setDraft((current) => ({ ...current, colors: { ...current.colors, [key]: value } }))
  const saveAppearance = () => void save(undefined, (value) => { setColors(value.colors); setMode(value.mode) })
  const reset = async () => {
    const result = await Swal.fire({ title: 'Reset theme colours?', text: 'This will restore the TIMS institutional palette.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Reset colours', cancelButtonText: 'Keep current', confirmButtonColor: '#174A84' })
    if (result.isConfirmed) setDraft((current) => ({ ...current, colors: defaultColors }))
  }

  return <SettingsPanel eyebrow="Interface system" title="Theme & appearance" description="Set the visual language teams use throughout their workspace.">
    <div className="settings-theme-preview" aria-label="Current theme preview"><span className="theme-preview-primary" style={{ background: draft.colors.primary }} /><span className="theme-preview-secondary" style={{ background: draft.colors.secondary }} /><div><strong>Workspace preview</strong><small>Buttons, links, status accents, and KPI tones follow these tokens.</small></div></div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Color tokens</h3><p>Customize semantic colors without changing component code.</p></div><Badge tone="info">Admin only</Badge></div>
      <div className="color-grid">{(Object.keys(draft.colors) as Array<keyof ThemeColors>).map((key) => <label className="color-field" key={key}><span><i className="color-swatch" style={{ background: draft.colors[key] }} />{key[0].toUpperCase() + key.slice(1)}</span><div className="color-input-wrap"><input type="color" value={draft.colors[key]} onChange={(event) => updateColor(key, event.target.value)} aria-label={`${key} color`} /><input value={draft.colors[key]} onChange={(event) => updateColor(key, event.target.value)} aria-label={`${key} hex value`} /></div></label>)}</div>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Interface mode</h3><p>Choose the default viewing mode for your workspace.</p></div></div>
      <div className="mode-options"><button className={`mode-option ${draft.mode === 'light' ? 'selected' : ''}`} onClick={() => setDraft((current) => ({ ...current, mode: 'light' }))}><Sun size={18} /><span><strong>Light mode</strong><small>Bright and print-friendly</small></span>{draft.mode === 'light' && <span className="mode-selected" />}</button><button className={`mode-option ${draft.mode === 'dark' ? 'selected' : ''}`} onClick={() => setDraft((current) => ({ ...current, mode: 'dark' }))}><Moon size={18} /><span><strong>Dark mode</strong><small>Reduced glare for late sessions</small></span>{draft.mode === 'dark' && <span className="mode-selected" />}</button></div>
    </div>
    <div className="settings-actions"><Button variant="outline" onClick={() => void reset()}>Reset palette</Button></div>
    <SettingsActions isDirty={isDirty} saveState={saveState} saveError={saveError} onSave={saveAppearance} onDiscard={discard} />
  </SettingsPanel>
}

function AcademicCalendarSettings() {
  const { draft, setDraft, isDirty, saveState, saveError, save, discard } = useSettingsDraft('calendar', {
    academicYear: '2026/27',
    activeTermId: 'semester-2',
    terms: [
      { id: 'semester-1', name: 'Semester I', start: '2026-02-02', end: '2026-06-26', registrationOpen: '2026-01-05', registrationDeadline: '2026-02-13', addDropDeadline: '2026-02-27', examinationStart: '2026-06-01', resultsDeadline: '2026-07-10' },
      { id: 'semester-2', name: 'Semester II', start: '2026-08-03', end: '2026-12-18', registrationOpen: '2026-07-06', registrationDeadline: '2026-08-21', addDropDeadline: '2026-09-04', examinationStart: '2026-11-23', resultsDeadline: '2027-01-08' },
    ],
    holidays: [{ id: 'holiday-1', name: 'Independence Day', date: '2026-10-09' }],
  })
  const addTerm = () => setDraft((current) => ({ ...current, terms: [...current.terms, { id: `term-${Date.now()}`, name: '', start: '', end: '', registrationOpen: '', registrationDeadline: '', addDropDeadline: '', examinationStart: '', resultsDeadline: '' }] }))
  const updateTerm = (id: string, key: string, value: string) => setDraft((current) => ({ ...current, terms: current.terms.map((term) => term.id === id ? { ...term, [key]: value } : term) }))
  const removeTerm = (id: string) => setDraft((current) => ({ ...current, terms: current.terms.filter((term) => term.id !== id), activeTermId: current.activeTermId === id ? '' : current.activeTermId }))
  const addHoliday = () => setDraft((current) => ({ ...current, holidays: [...current.holidays, { id: `holiday-${Date.now()}`, name: '', date: '' }] }))
  const validate = (value: typeof draft) => {
    if (!/^\d{4}\/\d{2}$/.test(value.academicYear)) return 'Academic year must use the YYYY/YY format.'
    if (!value.terms.length) return 'Add at least one academic term.'
    const sorted = [...value.terms].sort((a, b) => a.start.localeCompare(b.start))
    if (sorted.some((term) => !term.name.trim() || !term.start || !term.end || term.start >= term.end)) return 'Each term needs a name and a valid start and end date.'
    if (sorted.some((term, index) => index > 0 && term.start <= sorted[index - 1].end)) return 'Academic terms cannot overlap.'
    if (!value.terms.some((term) => term.id === value.activeTermId)) return 'Select an active term.'
    if (value.holidays.some((holiday) => !holiday.name.trim() || !holiday.date)) return 'Each holiday needs a name and date.'
    return null
  }

  return <SettingsPanel eyebrow="Academic configuration" title="Academic calendar" description="Configure the active academic year, semester, teaching dates, registration windows, and result milestones.">
    <div className="identity-fields">
      <label>Academic year<input value={draft.academicYear} onChange={(event) => setDraft((current) => ({ ...current, academicYear: event.target.value }))} /></label>
      <label>Active term<select value={draft.activeTermId} onChange={(event) => setDraft((current) => ({ ...current, activeTermId: event.target.value }))}>{draft.terms.map((term) => <option value={term.id} key={term.id}>{term.name || 'Untitled term'}</option>)}</select></label>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Academic terms</h3><p>Term dates are checked for invalid ranges and overlaps before saving.</p></div><Button variant="outline" size="sm" onClick={addTerm}>Add term</Button></div>
      <div className="settings-term-list">{draft.terms.map((term) => <div className="settings-term-card" key={term.id}>
        <div className="settings-term-heading"><label>Term name<input value={term.name} onChange={(event) => updateTerm(term.id, 'name', event.target.value)} /></label><Button variant="ghost" size="sm" onClick={() => removeTerm(term.id)}>Remove term</Button></div>
        <div className="identity-fields">
          <label>Start date<input type="date" value={term.start} onChange={(event) => updateTerm(term.id, 'start', event.target.value)} /></label><label>End date<input type="date" value={term.end} onChange={(event) => updateTerm(term.id, 'end', event.target.value)} /></label>
          <label>Registration opens<input type="date" value={term.registrationOpen} onChange={(event) => updateTerm(term.id, 'registrationOpen', event.target.value)} /></label><label>Registration deadline<input type="date" value={term.registrationDeadline} onChange={(event) => updateTerm(term.id, 'registrationDeadline', event.target.value)} /></label>
          <label>Add/drop deadline<input type="date" value={term.addDropDeadline} onChange={(event) => updateTerm(term.id, 'addDropDeadline', event.target.value)} /></label><label>Examinations begin<input type="date" value={term.examinationStart} onChange={(event) => updateTerm(term.id, 'examinationStart', event.target.value)} /></label>
          <label>Results due<input type="date" value={term.resultsDeadline} onChange={(event) => updateTerm(term.id, 'resultsDeadline', event.target.value)} /></label>
        </div>
      </div>)}</div>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Holidays</h3><p>Institution-wide dates are shown on calendar previews.</p></div><Button variant="outline" size="sm" onClick={addHoliday}>Add holiday</Button></div>
      <div className="settings-holiday-list">{draft.holidays.map((holiday) => <div className="settings-holiday-row" key={holiday.id}><label>Holiday<input value={holiday.name} onChange={(event) => setDraft((current) => ({ ...current, holidays: current.holidays.map((item) => item.id === holiday.id ? { ...item, name: event.target.value } : item) }))} /></label><label>Date<input type="date" value={holiday.date} onChange={(event) => setDraft((current) => ({ ...current, holidays: current.holidays.map((item) => item.id === holiday.id ? { ...item, date: event.target.value } : item) }))} /></label><Button variant="ghost" size="sm" onClick={() => setDraft((current) => ({ ...current, holidays: current.holidays.filter((item) => item.id !== holiday.id) }))}>Remove</Button></div>)}</div>
    </div>
    <div className="settings-footnote"><CalendarDays size={15} /><span>Calendar values are saved locally for this preview and will be ready for the academic calendar API.</span></div>
    <SettingsActions isDirty={isDirty} saveState={saveState} saveError={saveError} onSave={() => void save(validate)} onDiscard={discard} />
  </SettingsPanel>
}

function NotificationSettings() {
  const { draft, setDraft, isDirty, saveState, saveError, save, discard } = useSettingsDraft('notifications', {
    channels: { email: true, inApp: true, sms: false, weeklyDigest: true },
    categories: { admissions: true, registration: true, finance: false, academic: true, welfare: true, system: true },
    recipients: { admissions: 'Admissions Officer', registration: 'Academic Registrar', finance: 'Finance Officer', academic: 'Academic Registrar', welfare: 'Welfare Officer', system: 'ICT Administrator' },
    quietStart: '21:00',
    quietEnd: '07:00',
    templates: [
      { id: 'template-deadline', name: 'Deadline reminder', channel: 'Email', subject: 'Action required: upcoming deadline', active: true },
      { id: 'template-alert', name: 'Urgent operational alert', channel: 'In-app', subject: 'Urgent update from TIMS', active: true },
    ],
  })
  const [testStatus, setTestStatus] = useState('')
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
  const validate = (value: typeof draft) => {
    if (value.quietStart === value.quietEnd) return 'Quiet hours must have different start and end times.'
    if (!Object.values(value.recipients).every((recipient) => recipient.trim())) return 'Each enabled category needs a recipient rule.'
    if (value.templates.some((template) => !template.name.trim() || !template.subject.trim())) return 'Each notification template needs a name and subject.'
    return null
  }
  const sendTest = async () => {
    setTestStatus('Sending test preview…')
    await new Promise((resolve) => window.setTimeout(resolve, 450))
    setTestStatus('Test notification delivered to the current preview inbox.')
  }

  return <SettingsPanel eyebrow="Workspace preferences" title="Notifications" description="Choose delivery channels, operational categories, recipients, templates, and quiet hours.">
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Delivery channels</h3><p>Select where operational updates should be delivered.</p></div></div>
      <div className="notification-preferences">{channelOptions.map((option) => <label className="notification-preference" key={option.key}><span><strong>{option.label}</strong><small>{option.detail}</small></span><input type="checkbox" checked={draft.channels[option.key]} onChange={(event) => setDraft((current) => ({ ...current, channels: { ...current.channels, [option.key]: event.target.checked } }))} /></label>)}</div>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Notification categories</h3><p>Choose the areas that should generate notifications.</p></div></div>
      <div className="notification-category-grid">{categoryOptions.map((option) => <div className="notification-category" key={option.key}><label><input type="checkbox" checked={draft.categories[option.key]} onChange={(event) => setDraft((current) => ({ ...current, categories: { ...current.categories, [option.key]: event.target.checked } }))} /><span>{option.label}</span></label><select value={draft.recipients[option.key]} onChange={(event) => setDraft((current) => ({ ...current, recipients: { ...current.recipients, [option.key]: event.target.value } }))}><option>Admissions Officer</option><option>Academic Registrar</option><option>Finance Officer</option><option>Welfare Officer</option><option>ICT Administrator</option></select></div>)}</div>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Message templates</h3><p>Preview approved message subjects and channel routing.</p></div></div><div className="settings-template-list">{draft.templates.map((template) => <div className="settings-template-row" key={template.id}><label>Template name<input value={template.name} onChange={(event) => setDraft((current) => ({ ...current, templates: current.templates.map((item) => item.id === template.id ? { ...item, name: event.target.value } : item) }))} /></label><label>Channel<select value={template.channel} onChange={(event) => setDraft((current) => ({ ...current, templates: current.templates.map((item) => item.id === template.id ? { ...item, channel: event.target.value } : item) }))}><option>Email</option><option>SMS</option><option>In-app</option></select></label><label>Subject<input value={template.subject} onChange={(event) => setDraft((current) => ({ ...current, templates: current.templates.map((item) => item.id === template.id ? { ...item, subject: event.target.value } : item) }))} /></label></div>)}</div></div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Quiet hours</h3><p>Urgent system alerts are not affected.</p></div></div><div className="identity-fields"><label>Start time<input type="time" value={draft.quietStart} onChange={(event) => setDraft((current) => ({ ...current, quietStart: event.target.value }))} /></label><label>End time<input type="time" value={draft.quietEnd} onChange={(event) => setDraft((current) => ({ ...current, quietEnd: event.target.value }))} /></label></div></div>
    <div className="settings-actions"><Button variant="outline" onClick={() => void sendTest()}><Mail size={14} /> Send test notification</Button></div>
    {testStatus && <div className="settings-form-message settings-form-success" role="status">{testStatus}</div>}
    <SettingsActions isDirty={isDirty} saveState={saveState} saveError={saveError} onSave={() => void save(validate)} onDiscard={discard} />
  </SettingsPanel>
}

function SecuritySettings() {
  const { draft, setDraft, isDirty, saveState, saveError, save, discard } = useSettingsDraft('security', {
    enforceMfaForAdministrators: true,
    sessionTimeoutMinutes: 30,
    idleWarningMinutes: 5,
    maxFailedAttempts: 5,
    lockoutMinutes: 15,
    minimumPasswordLength: 12,
    requireNumber: true,
    requireSymbol: true,
    privilegedActionReview: true,
  })
  const validate = (value: typeof draft) => {
    if (value.sessionTimeoutMinutes < 5 || value.sessionTimeoutMinutes > 720) return 'Session timeout must be between 5 and 720 minutes.'
    if (value.idleWarningMinutes < 1 || value.idleWarningMinutes >= value.sessionTimeoutMinutes) return 'Idle warning must be shorter than the session timeout.'
    if (value.maxFailedAttempts < 3 || value.maxFailedAttempts > 20) return 'Failed sign-in limit must be between 3 and 20 attempts.'
    if (value.minimumPasswordLength < 8 || value.minimumPasswordLength > 64) return 'Password length must be between 8 and 64 characters.'
    return null
  }
  const toggle = (key: 'enforceMfaForAdministrators' | 'requireNumber' | 'requireSymbol' | 'privilegedActionReview', checked: boolean) => setDraft((current) => ({ ...current, [key]: checked }))

  return <SettingsPanel eyebrow="Access governance" title="Security policy" description="Configure frontend-preview defaults for sessions, password guidance, and privileged actions. Authentication enforcement will be connected later.">
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Sign-in and sessions</h3><p>These controls describe the policy that the future authentication service should enforce.</p></div></div>
      <div className="settings-toggle-list">
        <label className="settings-toggle-row"><span><strong>Require MFA for administrators</strong><small>Apply multi-factor authentication to privileged roles.</small></span><input type="checkbox" checked={draft.enforceMfaForAdministrators} onChange={(event) => toggle('enforceMfaForAdministrators', event.target.checked)} /></label>
        <label className="settings-toggle-row"><span><strong>Review privileged actions</strong><small>Require a second review for high-impact administrative actions.</small></span><input type="checkbox" checked={draft.privilegedActionReview} onChange={(event) => toggle('privilegedActionReview', event.target.checked)} /></label>
      </div>
      <div className="identity-fields"><label>Session timeout (minutes)<input type="number" min="5" max="720" value={draft.sessionTimeoutMinutes} onChange={(event) => setDraft((current) => ({ ...current, sessionTimeoutMinutes: Number(event.target.value) }))} /></label><label>Idle warning (minutes before timeout)<input type="number" min="1" value={draft.idleWarningMinutes} onChange={(event) => setDraft((current) => ({ ...current, idleWarningMinutes: Number(event.target.value) }))} /></label><label>Failed attempts before lockout<input type="number" min="3" max="20" value={draft.maxFailedAttempts} onChange={(event) => setDraft((current) => ({ ...current, maxFailedAttempts: Number(event.target.value) }))} /></label><label>Lockout duration (minutes)<input type="number" min="1" value={draft.lockoutMinutes} onChange={(event) => setDraft((current) => ({ ...current, lockoutMinutes: Number(event.target.value) }))} /></label></div>
    </div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Password guidance</h3><p>Set complexity recommendations for the future identity provider.</p></div></div><div className="identity-fields"><label>Minimum password length<input type="number" min="8" max="64" value={draft.minimumPasswordLength} onChange={(event) => setDraft((current) => ({ ...current, minimumPasswordLength: Number(event.target.value) }))} /></label></div><div className="settings-toggle-list"><label className="settings-toggle-row"><span><strong>Require a number</strong></span><input type="checkbox" checked={draft.requireNumber} onChange={(event) => toggle('requireNumber', event.target.checked)} /></label><label className="settings-toggle-row"><span><strong>Require a symbol</strong></span><input type="checkbox" checked={draft.requireSymbol} onChange={(event) => toggle('requireSymbol', event.target.checked)} /></label></div></div>
    <div className="settings-footnote"><ShieldCheck size={15} /><span>Frontend preview only: passwords, sessions, MFA challenges, and lockouts are not enforced until an authentication service is connected.</span></div>
    <SettingsActions isDirty={isDirty} saveState={saveState} saveError={saveError} onSave={() => void save(validate)} onDiscard={discard} />
  </SettingsPanel>
}

function SystemDefaultsSettings() {
  const { draft, setDraft, isDirty, saveState, saveError, save, discard } = useSettingsDraft('defaults', {
    studentIdFormat: 'STU-{YY}-{FAC}-{SEQ}',
    applicationIdFormat: 'APP-{YY}-{SEQ}',
    staffIdFormat: 'STF-{DEPT}-{SEQ}',
    defaultAcademicYear: '2026/27',
    defaultTerm: 'Semester II',
    gradingScale: 'Undergraduate 0–100',
    attendanceThreshold: 75,
    maximumCreditUnits: 24,
    documentRetentionYears: 7,
    auditRetentionYears: 10,
  })
  const update = (key: keyof typeof draft, value: string | number) => setDraft((current) => ({ ...current, [key]: value }))
  const validate = (value: typeof draft) => {
    if (![value.studentIdFormat, value.applicationIdFormat, value.staffIdFormat].every((format) => format.includes('{SEQ}'))) return 'Every identifier format must include a {SEQ} token.'
    if (!/^\d{4}\/\d{2}$/.test(value.defaultAcademicYear)) return 'Academic year must use the YYYY/YY format.'
    if (value.attendanceThreshold < 0 || value.attendanceThreshold > 100) return 'Attendance threshold must be between 0 and 100 percent.'
    if (value.maximumCreditUnits < 1 || value.maximumCreditUnits > 60) return 'Maximum credit units must be between 1 and 60.'
    if (value.documentRetentionYears < 1 || value.auditRetentionYears < 1) return 'Retention periods must be at least one year.'
    return null
  }

  return <SettingsPanel eyebrow="Platform configuration" title="System defaults" description="Define institution-wide identifier formats, academic defaults, and retention periods without editing operational records.">
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Record identifiers</h3><p>Use {`{YY}`}, {`{FAC}`}, {`{DEPT}`}, and {`{SEQ}`} tokens.</p></div></div><div className="identity-fields"><label>Student ID format<input value={draft.studentIdFormat} onChange={(event) => update('studentIdFormat', event.target.value)} /></label><label>Application ID format<input value={draft.applicationIdFormat} onChange={(event) => update('applicationIdFormat', event.target.value)} /></label><label>Staff ID format<input value={draft.staffIdFormat} onChange={(event) => update('staffIdFormat', event.target.value)} /></label></div></div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Academic defaults</h3><p>Defaults used when creating new academic periods and records.</p></div></div><div className="identity-fields"><label>Default academic year<input value={draft.defaultAcademicYear} onChange={(event) => update('defaultAcademicYear', event.target.value)} /></label><label>Default term<select value={draft.defaultTerm} onChange={(event) => update('defaultTerm', event.target.value)}><option>Semester I</option><option>Semester II</option><option>Summer term</option></select></label><label>Default grading scale<select value={draft.gradingScale} onChange={(event) => update('gradingScale', event.target.value)}><option>Undergraduate 0–100</option><option>Diploma 0–100</option><option>Postgraduate 4-point GPA</option></select></label><label>Attendance threshold (%)<input type="number" min="0" max="100" value={draft.attendanceThreshold} onChange={(event) => update('attendanceThreshold', Number(event.target.value))} /></label><label>Maximum credit units<input type="number" min="1" max="60" value={draft.maximumCreditUnits} onChange={(event) => update('maximumCreditUnits', Number(event.target.value))} /></label></div></div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Data retention</h3><p>Retention policy settings are previews until connected to data governance services.</p></div></div><div className="identity-fields"><label>Student document retention (years)<input type="number" min="1" value={draft.documentRetentionYears} onChange={(event) => update('documentRetentionYears', Number(event.target.value))} /></label><label>Audit event retention (years)<input type="number" min="1" value={draft.auditRetentionYears} onChange={(event) => update('auditRetentionYears', Number(event.target.value))} /></label></div></div>
    <SettingsActions isDirty={isDirty} saveState={saveState} saveError={saveError} onSave={() => void save(validate)} onDiscard={discard} />
  </SettingsPanel>
}

function IntegrationSettings() {
  const { draft, setDraft, isDirty, saveState, saveError, save, discard } = useSettingsDraft('integrations', {
    connectors: [
      { id: 'sis', name: 'Student information system', category: 'Core records', enabled: true, endpoint: 'https://sis.mmi.ac.ug/api', mode: 'Live preview' },
      { id: 'email', name: 'Email delivery', category: 'Communications', enabled: true, endpoint: 'https://mail.mmi.ac.ug/api', mode: 'Live preview' },
      { id: 'sms', name: 'SMS gateway', category: 'Communications', enabled: false, endpoint: '', mode: 'Test' },
      { id: 'payments', name: 'Payment gateway', category: 'Finance', enabled: false, endpoint: '', mode: 'Test' },
    ],
  })
  const [testing, setTesting] = useState<string[]>([])
  const [testResults, setTestResults] = useState<Record<string, string>>({})
  const updateConnector = (id: string, key: 'enabled' | 'endpoint' | 'mode', value: string | boolean) => setDraft((current) => ({
    ...current,
    connectors: current.connectors.map((connector) => connector.id === id ? { ...connector, [key]: value } : connector),
  }))
  const testConnection = async (id: string) => {
    setTesting((current) => [...current, id])
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    const connector = draft.connectors.find((item) => item.id === id)
    setTesting((current) => current.filter((value) => value !== id))
    setTestResults((current) => ({ ...current, [id]: connector?.endpoint ? 'Connection test passed in preview.' : 'Add an endpoint before testing this connector.' }))
  }
  const validate = (value: typeof draft) => {
    for (const connector of value.connectors.filter((item) => item.enabled)) {
      if (!connector.endpoint.trim()) return `${connector.name} needs an endpoint before it can be enabled.`
      try {
        const url = new URL(connector.endpoint)
        if (url.protocol !== 'https:') return `${connector.name} must use a secure HTTPS endpoint.`
      } catch {
        return `${connector.name} has an invalid endpoint URL.`
      }
    }
    return null
  }

  return <SettingsPanel eyebrow="Platform connectivity" title="Integrations" description="Configure connector endpoints, enablement, and preview connection checks. Credentials are intentionally not stored in this frontend.">
    <div className="integration-list">{draft.connectors.map((connector) => <section className="integration-card" key={connector.id}>
      <div className="integration-heading"><div><div className="eyebrow">{connector.category}</div><h3>{connector.name}</h3></div><label className="settings-inline-toggle"><input type="checkbox" checked={connector.enabled} onChange={(event) => updateConnector(connector.id, 'enabled', event.target.checked)} /> Enabled</label></div>
      <div className="identity-fields"><label>HTTPS endpoint<input type="url" placeholder="https://service.institution.ac.ug/api" value={connector.endpoint} onChange={(event) => updateConnector(connector.id, 'endpoint', event.target.value)} /></label><label>Environment<select value={connector.mode} onChange={(event) => updateConnector(connector.id, 'mode', event.target.value)}><option>Live preview</option><option>Test</option><option>Disabled</option></select></label></div>
      <div className="integration-actions"><Button variant="outline" size="sm" loading={testing.includes(connector.id)} onClick={() => void testConnection(connector.id)}><PlugZap size={14} /> Test connection</Button><Badge tone={connector.enabled ? 'success' : 'neutral'}>{connector.enabled ? 'Enabled' : 'Disabled'}</Badge></div>
      {testResults[connector.id] && <p className="integration-test-result" role="status">{testResults[connector.id]}</p>}
    </section>)}</div>
    <div className="settings-footnote"><PlugZap size={15} /><span>Connection checks are simulated. API credentials should be stored in a secured backend vault, never in browser storage.</span></div>
    <SettingsActions isDirty={isDirty} saveState={saveState} saveError={saveError} onSave={() => void save(validate)} onDiscard={discard} />
  </SettingsPanel>
}

type BackupSnapshot = { id: string; createdAt: string; filename: string; size: number }
type SettingsBackupFile = { product: 'TIMS Admin'; schemaVersion: number; exportedAt: string; entries: Record<string, string> }

function BackupSettings() {
  const { draft, setDraft, isDirty, saveState, saveError, save, discard } = useSettingsDraft('backups', {
    automated: true,
    frequency: 'Weekly',
    retainCount: 12,
    includeDrafts: false,
  })
  const [history, setHistory] = useState<BackupSnapshot[]>(() => {
    try { return JSON.parse(localStorage.getItem('tims-settings-backup-history') ?? '[]') as BackupSnapshot[] } catch { return [] }
  })
  const [creating, setCreating] = useState(false)
  const [backupMessage, setBackupMessage] = useState('')

  const validate = (value: typeof draft) => value.retainCount < 1 || value.retainCount > 100
    ? 'Retained backup count must be between 1 and 100.'
    : null

  const createBackup = async () => {
    setCreating(true)
    setBackupMessage('')
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    try {
      const entries: Record<string, string> = {}
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index)
        if (!key || key === 'tims-settings-backup-history') continue
        const isSettingsValue = key.startsWith('tims-settings-') && (draft.includeDrafts || !key.startsWith('tims-settings-draft-'))
        if (isSettingsValue || key === 'tims-colors' || key === 'tims-mode') {
          const value = localStorage.getItem(key)
          if (value !== null) entries[key] = value
        }
      }
      const exportedAt = new Date().toISOString()
      const filename = `tims-settings-backup-${exportedAt.slice(0, 10)}.json`
      const file: SettingsBackupFile = { product: 'TIMS Admin', schemaVersion: 1, exportedAt, entries }
      const contents = JSON.stringify(file, null, 2)
      const blob = new Blob([contents], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
      const snapshot: BackupSnapshot = { id: `${Date.now()}`, createdAt: exportedAt, filename, size: blob.size }
      const nextHistory = [snapshot, ...history].slice(0, draft.retainCount)
      localStorage.setItem('tims-settings-backup-history', JSON.stringify(nextHistory))
      setHistory(nextHistory)
      setBackupMessage('Settings backup downloaded successfully.')
    } catch {
      setBackupMessage('Backup could not be created. Check available browser storage and try again.')
    } finally {
      setCreating(false)
    }
  }

  const restoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBackupMessage('')
    if (file.size > 5_000_000) { setBackupMessage('Backup files must be smaller than 5 MB.'); return }
    try {
      const parsed = JSON.parse(await file.text()) as Partial<SettingsBackupFile>
      const validEntries = parsed.entries && typeof parsed.entries === 'object' && !Array.isArray(parsed.entries)
        && Object.entries(parsed.entries).every(([key, value]) => (key.startsWith('tims-settings-') && key !== 'tims-settings-backup-history' || key === 'tims-colors' || key === 'tims-mode') && typeof value === 'string')
      if (parsed.product !== 'TIMS Admin' || parsed.schemaVersion !== 1 || !validEntries) {
        setBackupMessage('This file is not a supported TIMS settings backup.')
        return
      }
      const entries = parsed.entries as Record<string, string>
      const settingCount = Object.keys(entries).length
      const result = await Swal.fire({ title: 'Restore settings backup?', text: `This file contains ${settingCount} settings values from ${parsed.exportedAt ?? 'an unknown date'}. Current local settings will be replaced and the page will reload.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Restore backup', cancelButtonText: 'Cancel', confirmButtonColor: '#174A84' })
      if (!result.isConfirmed) return
      const allowedKeys = Object.keys(localStorage).filter((key) => key.startsWith('tims-settings-') && key !== 'tims-settings-backup-history' || key === 'tims-colors' || key === 'tims-mode')
      for (const key of allowedKeys) localStorage.removeItem(key)
      for (const [key, value] of Object.entries(entries)) {
        if ((key.startsWith('tims-settings-') && key !== 'tims-settings-backup-history') || key === 'tims-colors' || key === 'tims-mode') localStorage.setItem(key, value)
      }
      window.location.reload()
    } catch {
      setBackupMessage('The backup file could not be read as valid JSON.')
    } finally {
      event.target.value = ''
    }
  }

  const removeSnapshot = (id: string) => {
    const nextHistory = history.filter((snapshot) => snapshot.id !== id)
    setHistory(nextHistory)
    localStorage.setItem('tims-settings-backup-history', JSON.stringify(nextHistory))
  }

  return <SettingsPanel eyebrow="Data protection" title="Backups & restore" description="Export local settings, configure a preview schedule, and restore an approved JSON backup.">
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Automated backup policy</h3><p>Schedule and retention controls are saved locally for this frontend preview.</p></div></div><div className="settings-toggle-list"><label className="settings-toggle-row"><span><strong>Enable scheduled backups</strong><small>Record the desired schedule for the future backup service.</small></span><input type="checkbox" checked={draft.automated} onChange={(event) => setDraft((current) => ({ ...current, automated: event.target.checked }))} /></label></div><div className="identity-fields"><label>Frequency<select value={draft.frequency} onChange={(event) => setDraft((current) => ({ ...current, frequency: event.target.value }))}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label><label>Retain copies<input type="number" min="1" max="100" value={draft.retainCount} onChange={(event) => setDraft((current) => ({ ...current, retainCount: Number(event.target.value) }))} /></label></div><label className="settings-inline-toggle"><input type="checkbox" checked={draft.includeDrafts} onChange={(event) => setDraft((current) => ({ ...current, includeDrafts: event.target.checked }))} /> Include unsaved local drafts</label></div>
    <div className="settings-backup-actions"><Button onClick={() => void createBackup()} loading={creating}><DatabaseBackup size={15} /> Download settings backup</Button><label className="settings-upload-button"><FileCheck2 size={14} /> Restore from JSON<input type="file" accept="application/json,.json" onChange={(event) => void restoreBackup(event)} /></label></div>
    {backupMessage && <div className="settings-form-message" role="status">{backupMessage}</div>}
    <SettingsActions isDirty={isDirty} saveState={saveState} saveError={saveError} onSave={() => void save(validate)} onDiscard={discard} />
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Backup history</h3><p>History is local to this browser and does not contain the backup file itself.</p></div></div>{history.length ? <div className="settings-backup-history">{history.map((snapshot) => <div className="settings-backup-row" key={snapshot.id}><div><strong>{snapshot.filename}</strong><small>{new Date(snapshot.createdAt).toLocaleString()} · {(snapshot.size / 1024).toFixed(1)} KB</small></div><Button variant="ghost" size="sm" onClick={() => removeSnapshot(snapshot.id)}>Remove</Button></div>)}</div> : <p className="settings-muted-copy">No settings backups have been created in this browser.</p>}</div>
    <div className="settings-footnote"><CircleHelp size={15} /><span>This exports TIMS settings and theme preferences only. It does not back up student, finance, or academic records; those require secured server-side backup services.</span></div>
  </SettingsPanel>
}

function RoleSettings() {
  const navigate = useNavigate()
  const { role: activeRole, setRole } = useAppContext()
  const [query, setQuery] = useState('')
  const [compareRole, setCompareRole] = useState<RoleName>('Academic Registrar')
  const permissionItems = [...navigationItems, ...adminNavigationItems]
  const visibleRoles = roles.filter((roleTemplate) => `${roleTemplate.name} ${roleTemplate.description}`.toLowerCase().includes(query.toLowerCase()))
  const primaryTemplate = roles.find((item) => item.name === activeRole) ?? roles[0]
  const comparedTemplate = roles.find((item) => item.name === compareRole) ?? roles[0]
  return <SettingsPanel eyebrow="Access governance" title="Roles & permissions" description="Review permission-led access templates and who can manage them.">
    <div className="settings-role-summary"><span className="settings-role-icon"><UsersRound size={20} /></span><div><strong>{roles.length} role templates configured</strong><p>Current access preview: {activeRole}. Permissions are evaluated by module access ID.</p></div></div>
    <div className="settings-role-toolbar"><label className="toolbar-search"><UsersRound size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all role templates" aria-label="Search role templates" /></label><label>Compare with<select value={compareRole} onChange={(event) => setCompareRole(event.target.value as RoleName)}>{roles.map((roleTemplate) => <option key={roleTemplate.name}>{roleTemplate.name}</option>)}</select></label></div>
    <div className="settings-role-list">{visibleRoles.map((roleTemplate) => <button type="button" className={`settings-role-row ${roleTemplate.name === activeRole ? 'selected' : ''}`} key={roleTemplate.name} onClick={() => setRole(roleTemplate.name)}><span className="role-avatar" style={{ background: roleTemplate.color }}>{roleTemplate.shortName}</span><span><strong>{roleTemplate.name}</strong><small>{roleTemplate.description}</small></span><Badge tone={roleTemplate.name === activeRole ? 'success' : 'neutral'}>{roleTemplate.permissions.length} grants</Badge></button>)}</div>
    <div className="settings-section"><div className="settings-section-heading"><div><h3>Permission comparison</h3><p>{primaryTemplate.name} compared with {comparedTemplate.name}</p></div></div><div className="settings-permission-matrix"><div className="settings-permission-row settings-permission-header"><strong>Module permission</strong><strong>{primaryTemplate.shortName}</strong><strong>{comparedTemplate.shortName}</strong></div>{permissionItems.map((item) => <div className="settings-permission-row" key={item.permission}><span>{item.label}</span><span>{primaryTemplate.permissions.includes(item.permission) ? 'Granted' : 'Not granted'}</span><span>{comparedTemplate.permissions.includes(item.permission) ? 'Granted' : 'Not granted'}</span></div>)}</div></div>
    <div className="permission-note"><CircleHelp size={16} /><span>Permission checks are active in the frontend preview. API authorization should enforce the same access boundaries.</span></div>
    <div className="settings-actions"><Button onClick={() => navigate('/users')}>Open users & roles</Button><Button variant="outline" onClick={() => toast.success('Access review task created in this preview.')}>Request access review</Button></div>
  </SettingsPanel>
}