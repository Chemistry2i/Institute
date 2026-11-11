import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, CalendarDays, Check, ClipboardCheck, Download, Eye, FileText, GraduationCap, Mail, Plus, Search, ShieldCheck, Upload, UserRound, UsersRound, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../app-context'
import { addMatriculatedStudent, readMatriculatedStudents } from '../demo-store'
import { Badge, Button, Card, EmptyState, KpiCard } from './ui'
import { ModalShell } from './ModuleWorkspace'

type ApplicationStage = 'Submitted' | 'Screening' | 'Faculty review' | 'Documents pending' | 'Offer issued' | 'Accepted' | 'Waitlisted' | 'Declined' | 'Rejected' | 'Enrolled'
type DocumentState = 'Missing' | 'Received' | 'Verified'
type ApplicationDocument = { name: string; status: DocumentState; fileName: string }
type Application = {
  id: string
  name: string
  email: string
  phone: string
  programme: string
  intake: string
  stage: ApplicationStage
  documents: ApplicationDocument[]
  identityVerified: boolean
  feesCleared: boolean
  studentId: string
  history: string[]
}

const storageKey = 'tims-demo-admissions-applications'
const requiredDocuments = ['Identity document', 'Academic transcript']
const initialApplications: Application[] = [
  { id: 'APP-2026-1001', name: 'Annette Muwonge', email: 'annette@example.com', phone: '+256 700 000 101', programme: 'BSc Computer Science', intake: 'August 2026', stage: 'Submitted', documents: requiredDocuments.map((name) => ({ name, status: 'Received', fileName: `${name.toLowerCase().replace(/ /g, '-')}.pdf` })), identityVerified: false, feesCleared: false, studentId: '', history: ['Application submitted online'] },
  { id: 'APP-2026-1002', name: 'Benard Sserunjogi', email: 'benard@example.com', phone: '+256 700 000 102', programme: 'Bachelor of Business Administration', intake: 'August 2026', stage: 'Faculty review', documents: requiredDocuments.map((name) => ({ name, status: 'Verified', fileName: `${name.toLowerCase().replace(/ /g, '-')}.pdf` })), identityVerified: false, feesCleared: false, studentId: '', history: ['Application submitted online', 'Passed initial screening'] },
  { id: 'APP-2026-1003', name: 'Patricia Kintu', email: 'patricia@example.com', phone: '+256 700 000 103', programme: 'Bachelor of Education', intake: 'August 2026', stage: 'Documents pending', documents: [{ name: requiredDocuments[0], status: 'Verified', fileName: 'national-id.pdf' }, { name: requiredDocuments[1], status: 'Missing', fileName: '' }], identityVerified: false, feesCleared: false, studentId: '', history: ['Application submitted online', 'Documents requested'] },
  { id: 'APP-2026-1004', name: 'Joseph Kasozi', email: 'joseph@example.com', phone: '+256 700 000 104', programme: 'BSc Information Technology', intake: 'August 2026', stage: 'Accepted', documents: requiredDocuments.map((name) => ({ name, status: 'Verified', fileName: `${name.toLowerCase().replace(/ /g, '-')}.pdf` })), identityVerified: true, feesCleared: true, studentId: '', history: ['Application submitted online', 'Offer issued', 'Offer accepted'] },
]

function readApplications(): Application[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (Array.isArray(saved) && saved.every((item) => item && typeof item.id === 'string' && Array.isArray(item.documents) && Array.isArray(item.history))) return saved as Application[]
  } catch {
    toast.error('Saved admissions data could not be read. Showing the demo records.')
  }
  return initialApplications
}

function stageTone(stage: ApplicationStage): 'neutral' | 'success' | 'warning' | 'info' | 'danger' {
  if (stage === 'Enrolled' || stage === 'Accepted') return 'success'
  if (stage === 'Rejected' || stage === 'Declined') return 'danger'
  if (stage === 'Documents pending' || stage === 'Waitlisted') return 'warning'
  if (stage === 'Faculty review' || stage === 'Offer issued' || stage === 'Screening') return 'info'
  return 'neutral'
}

export function AdmissionsOverview() {
  const { can } = useAppContext()
  const navigate = useNavigate()
  const [applications] = useState(readApplications)
  if (!can('admissions.view')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to admissions operations.</p></Card>
  const active = applications.filter((app) => !['Enrolled', 'Declined', 'Rejected'].includes(app.stage))
  const steps = [
    { title: 'Apply online', detail: 'Applicant submits programme and contact details.', href: '/admissions/online-application', icon: Plus },
    { title: 'Review & verify', detail: 'Screen applications and verify supporting documents.', href: '/admissions/applicant-review', icon: ClipboardCheck },
    { title: 'Offer & accept', detail: 'Issue a decision and capture the applicant response.', href: '/admissions/offers-decisions', icon: BadgeCheck },
    { title: 'Matriculate', detail: 'Complete clearance and create the student record.', href: '/admissions/matriculation', icon: GraduationCap },
  ]
  return <>
    <section className="stats-grid module-kpi-strip" aria-label="Admissions pipeline summary">
      <KpiCard label="Applications" value={`${applications.length}`} detail="In this local demo workflow" tone="blue" icon={UsersRound} />
      <KpiCard label="In review" value={`${applications.filter((app) => ['Submitted', 'Screening', 'Faculty review', 'Documents pending'].includes(app.stage)).length}`} detail="Screening, faculty, or documents" tone="amber" icon={ClipboardCheck} />
      <KpiCard label="Offers & accepted" value={`${applications.filter((app) => ['Offer issued', 'Accepted'].includes(app.stage)).length}`} detail="Awaiting matriculation" tone="teal" icon={BadgeCheck} />
      <KpiCard label="Enrolled" value={`${applications.filter((app) => app.stage === 'Enrolled').length}`} detail="Converted to student records" tone="purple" icon={GraduationCap} />
    </section>
    <Card className="admissions-flow-card">
      <div className="table-card-head"><div><h2>Application-to-student workflow</h2><p>Each step updates the same application record through to the student directory.</p></div><Badge tone="info">Frontend demo</Badge></div>
      <div className="admissions-flow-grid">{steps.map(({ title, detail, href, icon: Icon }, index) => <button type="button" className="admissions-flow-step" key={href} onClick={() => navigate(href)}><span className="admissions-flow-icon"><Icon size={17} /></span><span className="admissions-flow-copy"><small>STEP {index + 1}</small><strong>{title}</strong><span>{detail}</span></span></button>)}</div>
      <div className="admissions-flow-note"><ShieldCheck size={15} /><span>Online applications, decisions, and clearance are stored in this browser. A production rollout still needs a backend, secure applicant authentication, real document storage, payment verification, and notifications.</span></div>
    </Card>
    <section className="admissions-shortcuts">
      <div className="academic-area-heading"><h2>Admissions work areas</h2><span>{active.length} active applications</span></div>
      <div className="academic-area-grid">{[
        ['Application pipeline', '/admissions/application-pipeline', ClipboardCheck],
        ['Applicant review', '/admissions/applicant-review', UserRound],
        ['Document verification', '/admissions/document-verification', FileText],
        ['Offers & decisions', '/admissions/offers-decisions', BadgeCheck],
        ['Enrollment & matriculation', '/admissions/matriculation', GraduationCap],
        ['Online application portal', '/admissions/online-application', Plus],
      ].map(([label, href, Icon]) => {
        const AreaIcon = Icon as typeof ClipboardCheck
        return <button type="button" className="academic-area-link admissions-shortcut" key={href as string} onClick={() => navigate(href as string)}><span className="academic-area-icon"><AreaIcon size={17} /></span><span className="academic-area-copy"><strong>{label as string}</strong><small>Open this workflow</small></span></button>
      })}</div>
    </section>
  </>
}

export function AdmissionsWorkflowPage({ path }: { path: string }) {
  const { can } = useAppContext()
  const [applications, setApplications] = useState(readApplications)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Application | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [documentsOpen, setDocumentsOpen] = useState<Application | null>(null)

  if (!can('admissions.view')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to admissions operations.</p></Card>

  const headings: Record<string, { title: string; intro: string }> = {
    '/admissions/application-pipeline': { title: 'Application pipeline', intro: 'Track each applicant from submission through admission decision.' },
    '/admissions/applicant-review': { title: 'Applicant review', intro: 'Screen applicants and advance suitable candidates for faculty review.' },
    '/admissions/document-verification': { title: 'Document verification', intro: 'Receive and verify applicant documents before a decision is finalized.' },
    '/admissions/offers-decisions': { title: 'Offers & decisions', intro: 'Issue offers, record responses, manage waitlists, and close decisions.' },
    '/admissions/matriculation': { title: 'Enrollment & matriculation', intro: 'Complete identity and fee clearance, then create the student record.' },
  }
  const heading = headings[path] ?? headings['/admissions/application-pipeline']
  const searchTerm = search.trim().toLowerCase()
  const filtered = applications.filter((app) => {
    const matchesSearch = `${app.id} ${app.name} ${app.email} ${app.programme} ${app.stage}`.toLowerCase().includes(searchTerm)
    if (!matchesSearch) return false
    if (path === '/admissions/applicant-review') return ['Submitted', 'Screening', 'Faculty review'].includes(app.stage)
    if (path === '/admissions/document-verification') return app.documents.some((doc) => doc.status !== 'Verified') || app.stage === 'Documents pending'
    if (path === '/admissions/offers-decisions') return ['Faculty review', 'Offer issued', 'Accepted', 'Waitlisted', 'Declined'].includes(app.stage)
    if (path === '/admissions/matriculation') return ['Accepted', 'Enrolled'].includes(app.stage)
    return true
  })

  const persist = (next: Application[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      setApplications(next)
      return true
    } catch {
      toast.error('Admissions changes could not be saved in this browser.')
      return false
    }
  }
  const updateApplication = (id: string, patch: Partial<Application>, event: string, closeDialog = true) => {
    const updatedApplication = applications.find((app) => app.id === id)
    if (!updatedApplication) return
    const updated = { ...updatedApplication, ...patch, history: [event, ...updatedApplication.history] }
    const next = applications.map((app) => app.id === id ? updated : app)
    if (persist(next)) {
      if (closeDialog) {
        setSelected(null)
        setDocumentsOpen(null)
      } else {
        setSelected(updated)
      }
      toast.success(event)
    }
  }
  const submitApplication = (details: Pick<Application, 'name' | 'email' | 'phone' | 'programme' | 'intake'>) => {
    const id = `APP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    const nextApp: Application = {
      ...details, id, stage: 'Submitted',
      documents: requiredDocuments.map((name) => ({ name, status: 'Missing', fileName: '' })),
      identityVerified: false, feesCleared: false, studentId: '',
      history: ['Application submitted online'],
    }
    if (persist([nextApp, ...applications])) {
      setCreateOpen(false)
      toast.success(`Application submitted. Reference: ${id}`)
    }
  }
  const matriculate = (app: Application) => {
    if (!app.identityVerified || !app.feesCleared || !app.documents.every((doc) => doc.status === 'Verified')) {
      toast.error('Complete identity, fee, and document clearance before enrollment.')
      return
    }
    const created = addMatriculatedStudent({ reference: app.id, applicant: app.name, programme: `${app.programme} · ${app.intake}`, status: 'Enrolled' })
    if (!created) {
      toast.error('A student record already exists for this applicant.')
      return
    }
    const studentId = readMatriculatedStudents().find((entry) => entry.student.name.toLowerCase() === app.name.toLowerCase())?.student.id ?? ''
    updateApplication(app.id, { stage: 'Enrolled', studentId }, `Matriculated as ${studentId}`)
  }
  const exportApplications = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), applications: filtered }, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${path.split('/').pop()}-applications.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    toast.success(`${filtered.length} applications exported.`)
  }

  return <>
    <section className="stats-grid student-kpi-grid" aria-label={`${heading.title} metrics`}>
      <KpiCard label="In this view" value={`${filtered.length}`} detail="Applications matching this queue" tone="blue" icon={UsersRound} />
      <KpiCard label="Needs action" value={`${filtered.filter((app) => app.stage !== 'Enrolled').length}`} detail="Pending workflow action" tone="amber" icon={CalendarDays} />
      <KpiCard label="Documents verified" value={`${filtered.filter((app) => app.documents.every((doc) => doc.status === 'Verified')).length}`} detail="All required documents checked" tone="teal" icon={BadgeCheck} />
      <KpiCard label="Enrolled" value={`${filtered.filter((app) => app.stage === 'Enrolled').length}`} detail="Student record created" tone="purple" icon={GraduationCap} />
    </section>
    <div className="admissions-page-heading"><div><div className="eyebrow">Admissions operations</div><h2>{heading.title}</h2><p>{heading.intro}</p></div></div>
    <div className="module-toolbar student-toolbar">
      <label className="toolbar-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applicants, references, programmes" aria-label="Search applications" /></label>
      <div className="toolbar-actions">
        <Button type="button" variant="outline" size="sm" onClick={exportApplications}><Download size={14} /> Export queue</Button>
        {path === '/admissions/application-pipeline' && <Button type="button" size="sm" onClick={() => setCreateOpen(true)}><Plus size={14} /> Add application</Button>}
      </div>
    </div>
    {filtered.length === 0 ? <EmptyState title="No applications in this queue" description="Try another search or check a different admissions workflow." /> : <Card className="module-table-card student-directory-card">
      <div className="table-card-head"><div><div className="module-title"><div className="module-title-icon module-icon-teal"><GraduationCap size={19} /></div><div><h2>{heading.title}</h2><p>{filtered.length} matching applications</p></div></div></div><span className="student-directory-hint">Shared application records</span></div>
      <div className="table-responsive"><table className="data-table student-table">
        <thead><tr><th>Application</th><th>Applicant</th><th>Programme</th><th>Intake</th><th>Documents</th><th>Stage</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((app) => <tr key={app.id}>
          <td className="reference-code">{app.id}</td><td><div className="table-person"><div><strong>{app.name}</strong><small>{app.email}</small></div></div></td><td>{app.programme}</td><td>{app.intake}</td><td>{app.documents.filter((doc) => doc.status === 'Verified').length}/{app.documents.length} verified</td><td><Badge tone={stageTone(app.stage)}>{app.stage}</Badge></td>
          <td><div className="student-row-actions">
            <button type="button" className="student-action-button" onClick={() => setSelected(app)}><Eye size={12} />Details</button>
            {path === '/admissions/applicant-review' && <button type="button" className="student-action-button" onClick={() => setSelected(app)}><ClipboardCheck size={12} />Review</button>}
            {path === '/admissions/document-verification' && <button type="button" className="student-action-button" onClick={() => setDocumentsOpen(app)}><FileText size={12} />Verify</button>}
            {path === '/admissions/offers-decisions' && <button type="button" className="student-action-button" onClick={() => setSelected(app)}><BadgeCheck size={12} />Decision</button>}
            {path === '/admissions/matriculation' && app.stage !== 'Enrolled' && <button type="button" className="student-action-button" onClick={() => setSelected(app)}><GraduationCap size={12} />Clearance</button>}
          </div></td>
        </tr>)}</tbody>
      </table></div>
    </Card>}
    {selected && <ApplicationActionDialog application={selected} path={path} onClose={() => setSelected(null)} onStageChange={(stage, history) => updateApplication(selected.id, { stage }, history)} onClearanceChange={(patch) => updateApplication(selected.id, patch, 'Matriculation clearance updated', false)} onMatriculate={() => matriculate(selected)} />}
    {documentsOpen && <ApplicationDocumentsDialog application={documentsOpen} onClose={() => setDocumentsOpen(null)} onSave={(documents) => {
      const allVerified = documents.every((doc) => doc.status === 'Verified')
      updateApplication(documentsOpen.id, { documents, stage: allVerified ? 'Faculty review' : 'Documents pending' }, allVerified ? 'All required documents verified' : 'Document verification updated')
    }} />}
    {createOpen && <ApplicationCreateDialog onClose={() => setCreateOpen(false)} onSubmit={submitApplication} />}
  </>
}

export function OnlineApplicationPage() {
  const [applications, setApplications] = useState(readApplications)
  const [reference, setReference] = useState('')
  const [tracked, setTracked] = useState<Application | null>(null)
  const [mode, setMode] = useState<'apply' | 'track'>('apply')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const application: Application = {
      id: `APP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      name: String(form.get('name')).trim(), email: String(form.get('email')).trim(),
      phone: String(form.get('phone')).trim(), programme: String(form.get('programme')),
      intake: String(form.get('intake')), stage: 'Submitted',
      documents: requiredDocuments.map((name) => ({ name, status: 'Missing', fileName: '' })),
      identityVerified: false, feesCleared: false, studentId: '', history: ['Application submitted online'],
    }
    try {
      const next = [application, ...applications]
      localStorage.setItem(storageKey, JSON.stringify(next))
      setApplications(next)
      setTracked(application)
      setMode('track')
      toast.success(`Application submitted. Save your reference: ${application.id}`)
    } catch {
      toast.error('Application could not be saved in this browser. Please retry.')
    }
  }
  const track = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = applications.find((app) => app.id.toLowerCase() === reference.trim().toLowerCase())
    setTracked(found ?? null)
    if (!found) toast.error('No application matches that reference.')
  }
  const updateTracked = (updated: Application, message: string) => {
    try {
      const next = applications.map((app) => app.id === updated.id ? updated : app)
      localStorage.setItem(storageKey, JSON.stringify(next))
      setApplications(next)
      setTracked(updated)
      toast.success(message)
    } catch {
      toast.error('Application update could not be saved in this browser.')
    }
  }
  const uploadApplicantDocument = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !tracked) return
    if (file.size > 10_000_000) {
      toast.error('Demo uploads must be smaller than 10 MB.')
      event.target.value = ''
      return
    }
    const documents = tracked.documents.map((doc, currentIndex) => currentIndex === index ? { ...doc, fileName: file.name, status: 'Received' as const } : doc)
    const application = { ...tracked, documents, stage: 'Documents pending' as const, history: [`${file.name} received`, ...tracked.history] }
    updateTracked(application, `${file.name} attached to the application.`)
    event.target.value = ''
  }
  const respondToOffer = (accepted: boolean) => {
    if (!tracked) return
    const stage = accepted ? 'Accepted' : 'Declined'
    updateTracked({ ...tracked, stage, history: [`Applicant ${accepted ? 'accepted' : 'declined'} the offer`, ...tracked.history] }, `Offer ${accepted ? 'accepted' : 'declined'}.`)
  }
  return <div className="online-application-wrap">
    <Card className="online-application-card">
      <div className="online-application-brand"><span className="online-application-mark"><GraduationCap size={20} /></span><div><div className="eyebrow">Applicant portal · Frontend demo</div><h2>Apply to Peculiar Metropolitan Institute</h2><p>Submit an application or check progress with your reference number.</p></div></div>
      <div className="student-profile-tabs" role="tablist" aria-label="Applicant portal actions"><button type="button" role="tab" aria-selected={mode === 'apply'} className={mode === 'apply' ? 'active' : ''} onClick={() => { setMode('apply'); setTracked(null) }}><Plus size={13} />New application</button><button type="button" role="tab" aria-selected={mode === 'track'} className={mode === 'track' ? 'active' : ''} onClick={() => setMode('track')}><Search size={13} />Track application</button></div>
      {mode === 'apply' ? <form className="online-application-form" onSubmit={submit}>
        <label>Full legal name<input name="name" autoComplete="name" required /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
        <label>Phone number<input name="phone" type="tel" autoComplete="tel" required /></label>
        <label>Programme<select name="programme" defaultValue="" required><option value="" disabled>Select a programme</option><option>BSc Computer Science</option><option>BSc Information Technology</option><option>Bachelor of Business Administration</option><option>Bachelor of Education</option><option>Diploma in Business</option></select></label>
        <label>Intake<select name="intake" defaultValue="August 2026"><option>August 2026</option><option>January 2027</option><option>August 2027</option></select></label>
        <div className="online-application-info"><ShieldCheck size={14} /><span>Supporting documents can be uploaded after submission. Your reference number is required to track progress.</span></div>
        <Button type="submit"><Plus size={14} />Submit application</Button>
      </form> : <form className="online-track-form" onSubmit={track}><label>Application reference<input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="e.g. APP-2026-123456" required /></label><Button type="submit"><Search size={14} />Find application</Button></form>}
      {tracked && <div className="online-track-result" role="status"><div className="online-track-result-head"><div><small>APPLICATION REFERENCE</small><strong>{tracked.id}</strong></div><Badge tone={stageTone(tracked.stage)}>{tracked.stage}</Badge></div><p>{tracked.name} · {tracked.programme} · {tracked.intake}</p>
        {tracked.stage === 'Offer issued' && <div className="online-offer-response"><strong>Your admission offer is ready.</strong><div><Button type="button" onClick={() => respondToOffer(true)}><Check size={14} />Accept offer</Button><Button type="button" variant="outline" onClick={() => respondToOffer(false)}><X size={14} />Decline</Button></div></div>}
        {!['Accepted', 'Declined', 'Rejected', 'Enrolled'].includes(tracked.stage) && <div className="online-applicant-documents"><strong>Supporting documents</strong>{tracked.documents.map((doc, index) => <div className="online-applicant-document" key={doc.name}><span><FileText size={14} />{doc.name}<small>{doc.fileName || doc.status}</small></span><label className="student-action-button"><Upload size={12} />Upload<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => uploadApplicantDocument(index, event)} /></label></div>)}<small>Files are not uploaded to a server in this demo.</small></div>}
        <ol>{tracked.history.slice(0, 5).map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ol><p className="online-track-contact"><Mail size={13} /> Updates to {tracked.email}</p></div>}
      <p className="online-demo-disclaimer">Demo only: applications are stored in this browser. No real account, payment, or document upload is processed.</p>
    </Card>
  </div>
}

function ApplicationCreateDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (details: Pick<Application, 'name' | 'email' | 'phone' | 'programme' | 'intake'>) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSubmit({ name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), phone: String(data.get('phone')).trim(), programme: String(data.get('programme')).trim(), intake: String(data.get('intake')) })
  }
  return <ModalShell title="Create application" description="Record an application received by the admissions office." onClose={onClose} footer={<><Button type="button" variant="ghost" onClick={onClose}><X size={14} />Cancel</Button><Button type="submit" form="admissions-create-form"><Plus size={14} />Create application</Button></>}>
    <form id="admissions-create-form" className="modal-form-grid" onSubmit={submit}><label>Applicant name<input name="name" required /></label><label>Email<input name="email" type="email" required /></label><label>Phone<input name="phone" type="tel" required /></label><label>Programme<input name="programme" required /></label><label className="modal-form-wide">Intake<select name="intake"><option>August 2026</option><option>January 2027</option><option>August 2027</option></select></label></form>
  </ModalShell>
}

function ApplicationActionDialog({ application, path, onClose, onStageChange, onClearanceChange, onMatriculate }: { application: Application; path: string; onClose: () => void; onStageChange: (stage: ApplicationStage, history: string) => void; onClearanceChange: (patch: Partial<Application>) => void; onMatriculate: () => void }) {
  const isReview = path === '/admissions/applicant-review'
  const isOffer = path === '/admissions/offers-decisions'
  const isMatriculation = path === '/admissions/matriculation'
  const nextStage = (stage: ApplicationStage, message: string) => onStageChange(stage, message)
  const issueOffer = () => nextStage('Offer issued', 'Admission offer issued')
  const acceptOffer = () => nextStage('Accepted', 'Offer accepted by applicant')
  const decisionActions = isReview
    ? <><Button type="button" variant="outline" onClick={() => nextStage('Documents pending', 'Requested outstanding documents')}><FileText size={14} />Request documents</Button><Button type="button" variant="outline" onClick={() => nextStage('Rejected', 'Application declined at review')}><X size={14} />Reject</Button><Button type="button" onClick={() => nextStage('Faculty review', 'Passed initial screening; sent to faculty')}><Check size={14} />Pass to faculty</Button></>
    : isOffer
      ? ['Accepted', 'Declined'].includes(application.stage) ? null : <><Button type="button" variant="outline" onClick={() => nextStage('Waitlisted', 'Applicant added to waitlist')}><CalendarDays size={14} />Waitlist</Button>{application.stage === 'Offer issued' ? <><Button type="button" variant="outline" onClick={() => nextStage('Declined', 'Offer declined by applicant')}><X size={14} />Decline</Button><Button type="button" onClick={acceptOffer}><Check size={14} />Record acceptance</Button></> : <Button type="button" onClick={issueOffer}><BadgeCheck size={14} />Issue offer</Button>}</>
      : null
  return <ModalShell title={isMatriculation ? 'Matriculation clearance' : isReview ? 'Applicant review' : isOffer ? 'Offer decision' : 'Application details'} description={`${application.id} · ${application.name}`} onClose={onClose} footer={<><Button type="button" variant="ghost" onClick={onClose}><X size={14} />Close</Button>{decisionActions}{isMatriculation && application.stage !== 'Enrolled' && <Button type="button" onClick={onMatriculate}><GraduationCap size={14} />Enroll student</Button>}</>}>
    <div className="student-profile-content">
      <section className="student-profile-section"><div className="student-section-heading"><UserRound size={15} /><h3>Applicant record</h3></div><dl className="student-detail-grid"><div className="student-detail-field"><dt>Email</dt><dd>{application.email}</dd></div><div className="student-detail-field"><dt>Phone</dt><dd>{application.phone || 'Not provided'}</dd></div><div className="student-detail-field"><dt>Programme</dt><dd>{application.programme}</dd></div><div className="student-detail-field"><dt>Intake</dt><dd>{application.intake}</dd></div><div className="student-detail-field"><dt>Current stage</dt><dd><Badge tone={stageTone(application.stage)}>{application.stage}</Badge></dd></div>{application.studentId && <div className="student-detail-field"><dt>Student ID</dt><dd>{application.studentId}</dd></div>}</dl></section>
      {isMatriculation && <section className="student-profile-section"><div className="student-section-heading"><ShieldCheck size={15} /><h3>Pre-enrollment clearance</h3></div><div className="admissions-clearance-list"><label><input type="checkbox" checked={application.identityVerified} onChange={(event) => onClearanceChange({ identityVerified: event.target.checked })} /> Identity verified</label><label><input type="checkbox" checked={application.feesCleared} onChange={(event) => onClearanceChange({ feesCleared: event.target.checked })} /> Initial fees confirmed</label><span>{application.documents.filter((doc) => doc.status === 'Verified').length}/{application.documents.length} required documents verified</span></div><p className="modal-info"><GraduationCap size={14} />Enrollment is enabled only after identity, fees, and all required documents are cleared.</p></section>}
      <section className="student-profile-section"><div className="student-section-heading"><CalendarDays size={15} /><h3>Application history</h3></div><ol className="admissions-history">{application.history.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ol></section>
    </div>
  </ModalShell>
}

function ApplicationDocumentsDialog({ application, onClose, onSave }: { application: Application; onClose: () => void; onSave: (documents: ApplicationDocument[]) => void }) {
  const [documents, setDocuments] = useState(application.documents)
  const update = (index: number, patch: Partial<ApplicationDocument>) => {
    const document = documents[index]
    if (patch.status === 'Verified' && !document.fileName) {
      toast.error('Attach the document before marking it verified.')
      return
    }
    setDocuments((current) => current.map((doc, currentIndex) => currentIndex === index ? { ...doc, ...patch } : doc))
  }
  const upload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 10_000_000) {
      toast.error('Demo uploads must be smaller than 10 MB.')
      event.target.value = ''
      return
    }
    update(index, { status: 'Received', fileName: file.name })
    event.target.value = ''
    toast.success(`${file.name} attached to the demo record.`)
  }
  return <ModalShell title="Verify applicant documents" description={`${application.name} · ${application.id}`} onClose={onClose} footer={<><Button type="button" variant="ghost" onClick={onClose}><X size={14} />Cancel</Button><Button type="button" onClick={() => onSave(documents)}><Check size={14} />Save verification</Button></>}>
    <div className="admissions-document-list">{documents.map((doc, index) => <div className="admissions-document-row" key={doc.name}><div className="admissions-document-copy"><FileText size={16} /><span><strong>{doc.name}</strong><small>{doc.fileName || 'No file attached'}</small></span></div><select aria-label={`${doc.name} verification status`} value={doc.status} onChange={(event) => update(index, { status: event.target.value as DocumentState })}><option>Missing</option><option>Received</option><option>Verified</option></select><label className="student-action-button admissions-upload-button"><Upload size={12} />Upload<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => upload(index, event)} /></label></div>)}<p className="modal-info"><ShieldCheck size={14} />Only file names and verification status are saved locally; the file contents are not uploaded or retained.</p></div>
  </ModalShell>
}
