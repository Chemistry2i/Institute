import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, BadgeCheck, BookOpen, Building2, CalendarDays, Check, ChevronLeft, ChevronRight, ClipboardCheck, Clock3, Download, Eye, FileText, Filter, Globe2, GraduationCap, Mail, MapPin, Phone, Plus, Search, ShieldCheck, Trash2, Upload, UserRound, UsersRound, X, type LucideIcon } from 'lucide-react'
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js/min'
import toast from 'react-hot-toast'
import { useAppContext } from '../app-context'
import { type StudentProfileData } from '../data'
import { addMatriculatedStudent, readMatriculatedStudents } from '../demo-store'
import { Badge, Button, Card, EmptyState, KpiCard } from './ui'
import { ModalShell } from './ModuleWorkspace'

type ApplicationStage = 'Submitted' | 'Screening' | 'Faculty review' | 'Documents pending' | 'Offer issued' | 'Accepted' | 'Waitlisted' | 'Declined' | 'Rejected' | 'Enrolled'
type DocumentState = 'Missing' | 'Received' | 'Verified'
type ApplicationDocument = { name: string; status: DocumentState; fileName: string; required: boolean }
type AcademicResult = { subject: string; grade: string; examinationBody: string }
type Application = {
  id: string
  name: string
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  phoneCountry?: CountryCode
  phoneNumber?: string
  programme: string
  intake: string
  stage: ApplicationStage
  documents: ApplicationDocument[]
  identityVerified: boolean
  feesCleared: boolean
  studentId: string
  history: string[]
  dateOfBirth?: string
  gender?: string
  nationality?: string
  address?: string
  district?: string
  location?: string
  nextOfKin?: { firstName: string; middleName: string; lastName: string; relationship: string; phone: string; phoneCountry?: CountryCode; phoneNumber?: string; email: string }
  previousEducation?: Array<{ institution: string; qualification: string; completionYear: string }>
  academicResults?: AcademicResult[]
  secondChoice?: string
  studyMode?: string
}

type ApplicationDraft = Pick<Application, 'email' | 'programme' | 'intake'> & {
  phoneCountry: CountryCode
  phoneNumber: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  nationality: string
  district: string
  location: string
  nextOfKin: Omit<NonNullable<Application['nextOfKin']>, 'phone' | 'phoneCountry' | 'phoneNumber'> & {
    phoneCountry: CountryCode
    phoneNumber: string
  }
  institution: string
  qualification: string
  completionYear: string
  academicResults: AcademicResult[]
  secondChoice: string
  studyMode: string
  documents: ApplicationDocument[]
}

const storageKey = 'tims-demo-admissions-applications'
const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })
const phoneCountries = getCountries()
  .map((code) => ({ code, name: countryNames.of(code) ?? code, callingCode: getCountryCallingCode(code) }))
  .sort((left, right) => left.name.localeCompare(right.name))
const ugandanDistricts = [
  'Abim', 'Adjumani', 'Agago', 'Alebtong', 'Amolatar', 'Amudat', 'Amuria', 'Amuru', 'Apac', 'Arua',
  'Budaka', 'Bududa', 'Bugiri', 'Bugweri', 'Buhweju', 'Buikwe', 'Bukedea', 'Bukomansimbi', 'Bukwo',
  'Bulambuli', 'Buliisa', 'Bundibugyo', 'Bunyangabu', 'Bushenyi', 'Busia', 'Butaleja', 'Butambala',
  'Butebo', 'Buvuma', 'Buyende', 'Dokolo', 'Gomba', 'Gulu', 'Hoima', 'Ibanda', 'Iganga', 'Isingiro',
  'Jinja', 'Kaabong', 'Kabale', 'Kabarole', 'Kaberamaido', 'Kagadi', 'Kakumiro', 'Kalaki', 'Kalangala',
  'Kaliro', 'Kalungu', 'Kampala', 'Kamuli', 'Kamwenge', 'Kanungu', 'Kapchorwa', 'Kapelebyong', 'Karenga',
  'Kasanda', 'Kasese', 'Katakwi', 'Kayunga', 'Kazo', 'Kibaale', 'Kiboga', 'Kibuku', 'Kikuube', 'Kiruhura',
  'Kiryandongo', 'Kisoro', 'Kitagwenda', 'Kitgum', 'Koboko', 'Kole', 'Kotido', 'Kumi', 'Kwania', 'Kween',
  'Kyankwanzi', 'Kyegegwa', 'Kyenjojo', 'Kyotera', 'Lamwo', 'Lira', 'Luuka', 'Luwero', 'Lwengo', 'Lyantonde',
  'Madi-Okollo', 'Manafwa', 'Maracha', 'Masaka', 'Masindi', 'Mayuge', 'Mbale', 'Mbarara', 'Mitooma',
  'Mityana', 'Moroto', 'Moyo', 'Mpigi', 'Mubende', 'Mukono', 'Nabilatuk', 'Nakapiripirit', 'Nakaseke',
  'Nakasongola', 'Namayingo', 'Namisindwa', 'Namutumba', 'Napak', 'Nebbi', 'Ngora', 'Ntoroko', 'Ntungamo',
  'Nwoya', 'Obongi', 'Omoro', 'Otuke', 'Oyam', 'Pader', 'Pakwach', 'Pallisa', 'Rakai', 'Rubanda', 'Rubirizi',
  'Rukiga', 'Rukungiri', 'Rwampara', 'Sembabule', 'Serere', 'Sheema', 'Sironko', 'Soroti', 'Terego', 'Tororo',
  'Wakiso', 'Yumbe', 'Zombo',
]
const formatPhone = (country: CountryCode, number: string) => `+${getCountryCallingCode(country)} ${number.trim()}`
const requiredDocuments = ['Identity document', 'Academic certificate', 'Academic transcript']
const initialDocuments = requiredDocuments.map((name) => ({ name, status: 'Received' as const, fileName: `${name.toLowerCase().replace(/ /g, '-')}.pdf`, required: true }))
const splitName = (name: string) => {
  const [firstName = '', ...remaining] = name.trim().split(/\s+/)
  const lastName = remaining.pop() ?? ''
  return { firstName, middleName: remaining.join(' '), lastName }
}
const initialApplications: Application[] = [
  { id: 'APP-2026-1001', name: 'Annette Muwonge', ...splitName('Annette Muwonge'), email: 'annette@example.com', phone: '+256 700 000 101', programme: 'BSc Computer Science', intake: 'August 2026', stage: 'Submitted', documents: initialDocuments, identityVerified: false, feesCleared: false, studentId: '', history: ['Application submitted online'] },
  { id: 'APP-2026-1002', name: 'Benard Sserunjogi', ...splitName('Benard Sserunjogi'), email: 'benard@example.com', phone: '+256 700 000 102', programme: 'Bachelor of Business Administration', intake: 'August 2026', stage: 'Faculty review', documents: initialDocuments.map((doc) => ({ ...doc, status: 'Verified' })), identityVerified: false, feesCleared: false, studentId: '', history: ['Application submitted online', 'Passed initial screening'] },
  { id: 'APP-2026-1003', name: 'Patricia Kintu', ...splitName('Patricia Kintu'), email: 'patricia@example.com', phone: '+256 700 000 103', programme: 'Bachelor of Education', intake: 'August 2026', stage: 'Documents pending', documents: [...initialDocuments.map((doc, index) => ({ ...doc, status: index === 1 ? 'Missing' as const : 'Verified' as const, fileName: index === 1 ? '' : doc.fileName }))], identityVerified: false, feesCleared: false, studentId: '', history: ['Application submitted online', 'Documents requested'] },
  { id: 'APP-2026-1004', name: 'Joseph Kasozi', ...splitName('Joseph Kasozi'), email: 'joseph@example.com', phone: '+256 700 000 104', programme: 'BSc Information Technology', intake: 'August 2026', stage: 'Accepted', documents: initialDocuments.map((doc) => ({ ...doc, status: 'Verified' })), identityVerified: true, feesCleared: true, studentId: '', history: ['Application submitted online', 'Offer issued', 'Offer accepted'] },
]

function readApplications(): Application[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (Array.isArray(saved) && saved.every((item) => item && typeof item.id === 'string' && Array.isArray(item.documents) && Array.isArray(item.history))) {
      return (saved as Array<Application & { nextOfKin?: Application['nextOfKin'] & { name?: string } }>).map((application) => {
        const applicantName = application.name || ''
        const applicantParts = splitName(applicantName)
        const kinName = application.nextOfKin?.name ?? ''
        const kinParts = splitName(kinName)
        const firstName = application.firstName || applicantParts.firstName
        const middleName = application.middleName ?? applicantParts.middleName
        const lastName = application.lastName || applicantParts.lastName
        return {
          ...application,
          firstName,
          middleName,
          lastName,
          name: application.name || [firstName, middleName, lastName].filter(Boolean).join(' '),
          nextOfKin: application.nextOfKin ? {
            ...application.nextOfKin,
            firstName: application.nextOfKin.firstName || kinParts.firstName,
            middleName: application.nextOfKin.middleName ?? kinParts.middleName,
            lastName: application.nextOfKin.lastName || kinParts.lastName,
          } : undefined,
          documents: application.documents.map((document) => ({ ...document, required: document.required ?? true })),
        }
      })
    }
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

function allowedStageChanges(stage: ApplicationStage): ApplicationStage[] {
  const transitions: Partial<Record<ApplicationStage, ApplicationStage[]>> = {
    Submitted: ['Screening', 'Documents pending', 'Rejected'],
    Screening: ['Faculty review', 'Documents pending', 'Rejected'],
    'Faculty review': ['Offer issued', 'Waitlisted', 'Documents pending', 'Rejected'],
    'Documents pending': ['Screening', 'Faculty review', 'Rejected'],
    'Offer issued': ['Accepted', 'Declined', 'Waitlisted'],
    Waitlisted: ['Offer issued', 'Rejected'],
  }
  return [stage, ...(transitions[stage] ?? [])]
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
  const [stageFilter, setStageFilter] = useState<ApplicationStage | 'All'>('All')
  const [intakeFilter, setIntakeFilter] = useState('All')
  const [programmeFilter, setProgrammeFilter] = useState('All')
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
  const isPipeline = path === '/admissions/application-pipeline'
  const pipelineStages: ApplicationStage[] = ['Submitted', 'Screening', 'Faculty review', 'Documents pending', 'Offer issued', 'Accepted', 'Waitlisted', 'Declined', 'Rejected', 'Enrolled']
  const intakes = [...new Set(applications.map((application) => application.intake).filter(Boolean))].sort()
  const programmes = [...new Set(applications.map((application) => application.programme).filter(Boolean))].sort()
  const matchesPipelineSearch = (app: Application) => `${app.id} ${app.name} ${app.email} ${app.programme} ${app.stage}`.toLowerCase().includes(searchTerm)
  const stageCounts = pipelineStages.map((stage) => ({
    stage,
    count: applications.filter((app) => matchesPipelineSearch(app) && (intakeFilter === 'All' || app.intake === intakeFilter) && (programmeFilter === 'All' || app.programme === programmeFilter) && app.stage === stage).length,
  }))
  const filtered = applications.filter((app) => {
    if (!matchesPipelineSearch(app)) return false
    if (isPipeline && intakeFilter !== 'All' && app.intake !== intakeFilter) return false
    if (isPipeline && programmeFilter !== 'All' && app.programme !== programmeFilter) return false
    if (isPipeline && stageFilter !== 'All' && app.stage !== stageFilter) return false
    if (path === '/admissions/applicant-review') return ['Submitted', 'Screening', 'Faculty review'].includes(app.stage)
    if (path === '/admissions/document-verification') return app.documents.some((doc) => doc.status !== 'Verified') || app.stage === 'Documents pending'
    if (path === '/admissions/offers-decisions') return ['Faculty review', 'Offer issued', 'Accepted', 'Waitlisted', 'Declined'].includes(app.stage)
    if (path === '/admissions/matriculation') return ['Accepted', 'Enrolled'].includes(app.stage)
    return true
  })
  const needsAction = filtered.filter((app) => ['Submitted', 'Screening', 'Faculty review', 'Documents pending', 'Offer issued', 'Accepted', 'Waitlisted'].includes(app.stage)).length

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
  const changePipelineStage = (application: Application, stage: ApplicationStage) => {
    if (application.stage === stage) return
    if (!allowedStageChanges(application.stage).includes(stage)) {
      toast.error('That stage change is not available from the current application stage.')
      return
    }
    updateApplication(application.id, { stage }, `Stage changed from ${application.stage} to ${stage}`)
  }
  const submitApplication = (details: Pick<Application, 'firstName' | 'middleName' | 'lastName' | 'email' | 'phone' | 'programme' | 'intake'>) => {
    const id = `APP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    const nextApp: Application = {
      ...details,
      name: [details.firstName, details.middleName, details.lastName].filter(Boolean).join(' '),
      id, stage: 'Submitted',
      documents: requiredDocuments.map((name) => ({ name, status: 'Missing', fileName: '', required: true })),
      identityVerified: false, feesCleared: false, studentId: '',
      history: ['Application submitted online'],
    }
    if (persist([nextApp, ...applications])) {
      setCreateOpen(false)
      toast.success(`Application submitted. Reference: ${id}`)
    }
  }
  const matriculate = (app: Application) => {
    if (!app.identityVerified || !app.feesCleared || !app.documents.filter((doc) => doc.required).every((doc) => doc.status === 'Verified')) {
      toast.error('Complete identity, fee, and document clearance before enrollment.')
      return
    }
    const profile: Partial<StudentProfileData> = {
      campus: 'Main campus',
      faculty: 'Pending faculty assignment',
      department: 'Pending department assignment',
      semester: app.intake,
      intake: app.intake,
      email: app.email,
      phone: app.phone,
      phoneCountry: app.phoneCountry,
      phoneNumber: app.phoneNumber,
      firstName: app.firstName,
      middleName: app.middleName,
      lastName: app.lastName,
      dateOfBirth: app.dateOfBirth ?? '',
      gender: app.gender ?? 'Not specified',
      nationality: app.nationality ?? '',
      address: app.address ?? '',
      district: app.district ?? '',
      location: app.location ?? app.address ?? '',
      nextOfKin: app.nextOfKin ? {
        ...app.nextOfKin,
        name: [app.nextOfKin.firstName, app.nextOfKin.middleName, app.nextOfKin.lastName].filter(Boolean).join(' '),
      } : { name: 'Not provided', relationship: 'Not provided', phone: '', email: '' },
      previousEducation: app.previousEducation ?? [],
      academicResults: app.academicResults ?? [],
      secondChoiceProgramme: app.secondChoice ?? '',
      studyMode: app.studyMode ?? '',
      statusHistory: [{ date: new Date().toLocaleDateString('en-GB'), status: 'Active', detail: `Matriculated from application ${app.id}.` }],
      documents: app.documents.map((document) => ({
        name: document.name,
        status: document.status === 'Missing' ? 'Pending' : document.status,
        updated: document.fileName || 'Not uploaded',
      })),
    }
    const created = addMatriculatedStudent({ reference: app.id, applicant: app.name, programme: `${app.programme} · ${app.intake}`, status: 'Enrolled' }, profile)
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
  const exportPipelineCsv = () => {
    const escapeCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
    const rows = [
      ['Reference', 'Applicant', 'Email', 'Phone', 'Programme', 'Intake', 'Stage', 'Verified documents', 'Required documents'],
      ...filtered.map((app) => [
        app.id, app.name, app.email, app.phone, app.programme, app.intake, app.stage,
        app.documents.filter((document) => document.required && document.status === 'Verified').length,
        app.documents.filter((document) => document.required).length,
      ]),
    ]
    const csv = `\uFEFF${rows.map((row) => row.map(escapeCell).join(',')).join('\r\n')}`
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'application-pipeline.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    toast.success(`${filtered.length} applications exported as CSV.`)
  }

  return <>
    <section className="stats-grid student-kpi-grid" aria-label={`${heading.title} metrics`}>
      <KpiCard label="In this view" value={`${filtered.length}`} detail="Applications matching this queue" tone="blue" icon={UsersRound} />
      <KpiCard label="Needs action" value={`${needsAction}`} detail="Pending workflow action" tone="amber" icon={CalendarDays} />
      <KpiCard label="Documents verified" value={`${filtered.filter((app) => app.documents.filter((doc) => doc.required).every((doc) => doc.status === 'Verified')).length}`} detail="All required documents checked" tone="teal" icon={BadgeCheck} />
      <KpiCard label="Enrolled" value={`${filtered.filter((app) => app.stage === 'Enrolled').length}`} detail="Student record created" tone="purple" icon={GraduationCap} />
    </section>
    <div className="admissions-page-heading"><div><div className="eyebrow">Admissions operations</div><h2>{heading.title}</h2><p>{heading.intro}</p></div></div>
    {isPipeline && <section className="application-pipeline-stage-list" aria-label="Filter applications by stage">
      <button type="button" className={`application-pipeline-stage${stageFilter === 'All' ? ' active' : ''}`} onClick={() => setStageFilter('All')} aria-pressed={stageFilter === 'All'}>
        <span className="application-pipeline-stage-name">All applications</span><strong>{applications.filter((app) => matchesPipelineSearch(app) && (intakeFilter === 'All' || app.intake === intakeFilter) && (programmeFilter === 'All' || app.programme === programmeFilter)).length}</strong>
      </button>
      {stageCounts.map(({ stage, count }) => <button type="button" className={`application-pipeline-stage${stageFilter === stage ? ' active' : ''}`} key={stage} onClick={() => setStageFilter((current) => current === stage ? 'All' : stage)} aria-pressed={stageFilter === stage}>
        <span className="application-pipeline-stage-name">{stage}</span><strong>{count}</strong>
      </button>)}
    </section>}
    <div className="module-toolbar student-toolbar admissions-workflow-toolbar">
      <label className="toolbar-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applicants, references, programmes" aria-label="Search applications" /></label>
      {isPipeline && <div className="application-pipeline-filters">
        <label className="application-pipeline-filter"><span className="application-pipeline-filter-icon"><CalendarDays size={14} /></span><select value={intakeFilter} onChange={(event) => setIntakeFilter(event.target.value)} aria-label="Filter applications by intake"><option value="All">All intakes</option>{intakes.map((intake) => <option key={intake}>{intake}</option>)}</select></label>
        <label className="application-pipeline-filter"><span className="application-pipeline-filter-icon"><GraduationCap size={14} /></span><select value={programmeFilter} onChange={(event) => setProgrammeFilter(event.target.value)} aria-label="Filter applications by programme"><option value="All">All programmes</option>{programmes.map((programme) => <option key={programme}>{programme}</option>)}</select></label>
        {(stageFilter !== 'All' || intakeFilter !== 'All' || programmeFilter !== 'All' || search) && <Button type="button" variant="ghost" size="sm" onClick={() => { setStageFilter('All'); setIntakeFilter('All'); setProgrammeFilter('All'); setSearch('') }}><X size={13} />Clear</Button>}
      </div>}
      <div className="toolbar-actions">
        {isPipeline && <Button type="button" variant="outline" size="sm" onClick={exportPipelineCsv}><Download size={14} /> Export CSV</Button>}
        <Button type="button" variant="outline" size="sm" onClick={exportApplications}><Download size={14} /> Export JSON</Button>
        {path === '/admissions/application-pipeline' && <Button type="button" size="sm" onClick={() => setCreateOpen(true)}><Plus size={14} /> Add application</Button>}
      </div>
    </div>
    {filtered.length === 0 ? <EmptyState title={isPipeline ? 'No matching applications' : 'No applications in this queue'} description={isPipeline ? 'Adjust your search or filters, or add a new application.' : 'Try another search or check a different admissions workflow.'} actionLabel="Clear filters" onAction={isPipeline ? () => { setStageFilter('All'); setIntakeFilter('All'); setProgrammeFilter('All'); setSearch('') } : undefined} /> : <Card className="module-table-card student-directory-card">
      <div className="table-card-head"><div><div className="module-title"><div className="module-title-icon module-icon-teal"><GraduationCap size={19} /></div><div><h2>{heading.title}</h2><p>{filtered.length} matching applications</p></div></div></div><span className="student-directory-hint">Shared application records</span></div>
      <div className="table-responsive"><table className="data-table student-table">
        <thead><tr><th>Application</th><th>Applicant</th><th>Programme</th><th>Intake</th><th>Documents</th><th>Stage</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((app) => <tr key={app.id}>
          <td className="reference-code">{app.id}</td><td><div className="table-person"><div><strong>{app.name}</strong><small>{app.email}</small></div></div></td><td>{app.programme}</td><td>{app.intake}</td><td>{app.documents.filter((doc) => doc.required && doc.status === 'Verified').length}/{app.documents.filter((doc) => doc.required).length} verified</td><td>{isPipeline ? <select className="application-pipeline-row-stage" aria-label={`Change stage for ${app.name}`} title="Available stages follow the admissions workflow. Every change is added to application history." value={app.stage} disabled={allowedStageChanges(app.stage).length === 1} onChange={(event) => changePipelineStage(app, event.target.value as ApplicationStage)}>{allowedStageChanges(app.stage).map((stage) => <option key={stage}>{stage}</option>)}</select> : <Badge tone={stageTone(app.stage)}>{app.stage}</Badge>}</td>
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
      const allVerified = documents.filter((doc) => doc.required).every((doc) => doc.status === 'Verified')
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
  const submitApplication = (draft: ApplicationDraft) => {
    const application: Application = {
      id: `APP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      firstName: draft.firstName.trim(), middleName: draft.middleName.trim(), lastName: draft.lastName.trim(),
      name: [draft.firstName, draft.middleName, draft.lastName].filter(Boolean).join(' '),
      email: draft.email.trim(), phone: formatPhone(draft.phoneCountry, draft.phoneNumber),
      phoneCountry: draft.phoneCountry, phoneNumber: draft.phoneNumber.trim(),
      programme: draft.programme, intake: draft.intake, stage: 'Submitted',
      documents: draft.documents, identityVerified: false, feesCleared: false,
      studentId: '', history: ['Application submitted online'],
      dateOfBirth: draft.dateOfBirth, gender: draft.gender, nationality: draft.nationality,
      district: draft.district, location: draft.location, address: draft.location,
      nextOfKin: {
        ...draft.nextOfKin,
        phone: formatPhone(draft.nextOfKin.phoneCountry, draft.nextOfKin.phoneNumber),
        phoneNumber: draft.nextOfKin.phoneNumber.trim(),
      },
      previousEducation: [{ institution: draft.institution, qualification: draft.qualification, completionYear: draft.completionYear }],
      academicResults: draft.academicResults, secondChoice: draft.secondChoice, studyMode: draft.studyMode,
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
      {mode === 'apply' ? <OnlineApplicationWizard onSubmit={submitApplication} /> : <form className="online-track-form" onSubmit={track}><label>Application reference<input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="e.g. APP-2026-123456" required /></label><Button type="submit"><Search size={14} />Find application</Button></form>}
      {tracked && <div className="online-track-result" role="status"><div className="online-track-result-head"><div><small>APPLICATION REFERENCE</small><strong>{tracked.id}</strong></div><Badge tone={stageTone(tracked.stage)}>{tracked.stage}</Badge></div><p>{tracked.name} · {tracked.programme} · {tracked.intake}</p>
        {tracked.stage === 'Offer issued' && <div className="online-offer-response"><strong>Your admission offer is ready.</strong><div><Button type="button" onClick={() => respondToOffer(true)}><Check size={14} />Accept offer</Button><Button type="button" variant="outline" onClick={() => respondToOffer(false)}><X size={14} />Decline</Button></div></div>}
        {!['Accepted', 'Declined', 'Rejected', 'Enrolled'].includes(tracked.stage) && <div className="online-applicant-documents"><strong>Supporting documents</strong>{tracked.documents.map((doc, index) => <div className="online-applicant-document" key={doc.name}><span><FileText size={14} />{doc.name}<small>{doc.fileName || doc.status}</small></span><label className="student-action-button"><Upload size={12} />Upload<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => uploadApplicantDocument(index, event)} /></label></div>)}<small>Files are not uploaded to a server in this demo.</small></div>}
        <ol>{tracked.history.slice(0, 5).map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ol><p className="online-track-contact"><Mail size={13} /> Updates to {tracked.email}</p></div>}
      <p className="online-demo-disclaimer">Demo only: applications are stored in this browser. No real account, payment, or document upload is processed.</p>
    </Card>
  </div>
}

function OnlineApplicationWizard({ onSubmit }: { onSubmit: (draft: ApplicationDraft) => void }) {
  const [step, setStep] = useState(0)
  const [declarationAccepted, setDeclarationAccepted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [draft, setDraft] = useState<ApplicationDraft>({
    firstName: '', middleName: '', lastName: '', email: '', phoneCountry: 'UG', phoneNumber: '', programme: '', intake: 'August 2026',
    dateOfBirth: '', gender: '', nationality: 'Uganda', district: '', location: '',
    nextOfKin: { firstName: '', middleName: '', lastName: '', relationship: '', phoneCountry: 'UG', phoneNumber: '', email: '' },
    institution: '', qualification: '', completionYear: '',
    academicResults: [{ subject: '', grade: '', examinationBody: 'UNEB' }],
    secondChoice: '', studyMode: 'Day',
    documents: [...requiredDocuments.map((name) => ({ name, status: 'Missing' as const, fileName: '', required: true })), { name: 'Passport photo', status: 'Missing', fileName: '', required: false }],
  })
  const update = <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const updateNextOfKin = <K extends keyof ApplicationDraft['nextOfKin']>(key: K, value: ApplicationDraft['nextOfKin'][K]) => setDraft((current) => ({ ...current, nextOfKin: { ...current.nextOfKin, [key]: value } }))
  const updateName = (key: 'firstName' | 'middleName' | 'lastName', value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const updateResult = (index: number, patch: Partial<AcademicResult>) => setDraft((current) => ({ ...current, academicResults: current.academicResults.map((result, currentIndex) => currentIndex === index ? { ...result, ...patch } : result) }))
  const updateDocument = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 10_000_000) {
      toast.error('Demo uploads must be smaller than 10 MB.')
      event.target.value = ''
      return
    }
    update('documents', draft.documents.map((document, currentIndex) => currentIndex === index ? { ...document, status: 'Received', fileName: file.name } : document))
    event.target.value = ''
    toast.success(`${file.name} attached to your application draft.`)
  }
  const continueStep = () => {
    if (!formRef.current?.reportValidity()) return
    if (step === 1 && !draft.academicResults.some((result) => result.subject.trim() && result.grade.trim())) {
      toast.error('Add at least one subject and grade from your prior results.')
      return
    }
    if (step === 3 && draft.documents.some((document) => document.required && !document.fileName)) {
      toast.error('Attach each required document before continuing.')
      return
    }
    setStep((current) => Math.min(current + 1, 4))
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current?.reportValidity()) return
    if (!declarationAccepted) {
      toast.error('Confirm the declaration before submitting your application.')
      return
    }
    onSubmit(draft)
  }
  const steps = ['Personal details', 'Education & results', 'Programme choice', 'Documents', 'Review & submit']

  return <div className="application-wizard">
    <ol className="application-stepper" aria-label="Application steps">
      {steps.map((label, index) => <li className={`${index === step ? 'current' : ''} ${index < step ? 'complete' : ''}`} key={label}>
        <button type="button" aria-current={index === step ? 'step' : undefined} disabled={index > step} onClick={() => setStep(index)}><span>{index < step ? <Check size={13} /> : index + 1}</span><small>{label}</small></button>
      </li>)}
    </ol>
    <form id="online-application-form" ref={formRef} className="online-application-form application-step-form" onSubmit={submit}>
      {step === 0 && <section className="application-step-content">
        <div className="application-section-heading"><h3>Personal and contact details</h3><p>Enter your legal identity and a reliable contact address.</p></div>
        <ApplicationField label="First name" icon={UserRound}><input autoComplete="given-name" value={draft.firstName} onChange={(event) => updateName('firstName', event.target.value)} required /></ApplicationField>
        <ApplicationField label="Middle name" icon={UserRound} optional><input autoComplete="additional-name" value={draft.middleName} onChange={(event) => updateName('middleName', event.target.value)} /></ApplicationField>
        <ApplicationField label="Last name" icon={UserRound}><input autoComplete="family-name" value={draft.lastName} onChange={(event) => updateName('lastName', event.target.value)} required /></ApplicationField>
        <ApplicationField label="Email address" icon={Mail}><input type="email" autoComplete="email" value={draft.email} onChange={(event) => update('email', event.target.value)} required /></ApplicationField>
        <ApplicationField label="Phone number"><div className="application-phone-fields"><select aria-label="Phone country calling code" value={draft.phoneCountry} onChange={(event) => update('phoneCountry', event.target.value as CountryCode)} required>{phoneCountries.map((country) => <option key={country.code} value={country.code}>{country.code} +{country.callingCode} · {country.name}</option>)}</select><input type="tel" autoComplete="tel-national" inputMode="tel" placeholder="e.g. 700 123 456" aria-label="Phone number" value={draft.phoneNumber} onChange={(event) => update('phoneNumber', event.target.value)} required /></div></ApplicationField>
        <ApplicationField label="Date of birth" icon={CalendarDays}><input type="date" value={draft.dateOfBirth} onChange={(event) => update('dateOfBirth', event.target.value)} required /></ApplicationField>
        <ApplicationField label="Gender" icon={UserRound}><select value={draft.gender} onChange={(event) => update('gender', event.target.value)} required><option value="">Select gender</option><option>Female</option><option>Male</option></select></ApplicationField>
        <ApplicationField label="Nationality" icon={Globe2}><select autoComplete="country-name" value={draft.nationality} onChange={(event) => update('nationality', event.target.value)} required><option value="">Select country</option>{phoneCountries.map((country) => <option key={country.code}>{country.name}</option>)}</select></ApplicationField>
        <ApplicationField label="District" icon={Building2}><select autoComplete="address-level1" value={draft.district} onChange={(event) => update('district', event.target.value)} required><option value="">Select district</option>{ugandanDistricts.map((district) => <option key={district}>{district}</option>)}</select></ApplicationField>
        <ApplicationField label="Location (village, town or area)" icon={MapPin}><input autoComplete="address-level2" value={draft.location} onChange={(event) => update('location', event.target.value)} required /></ApplicationField>
        <div className="application-subsection-heading"><h4>Next of kin / emergency contact</h4></div>
        <ApplicationField label="First name" icon={UsersRound}><input value={draft.nextOfKin.firstName} onChange={(event) => updateNextOfKin('firstName', event.target.value)} required /></ApplicationField>
        <ApplicationField label="Middle name" icon={UsersRound} optional><input value={draft.nextOfKin.middleName} onChange={(event) => updateNextOfKin('middleName', event.target.value)} /></ApplicationField>
        <ApplicationField label="Last name" icon={UsersRound}><input value={draft.nextOfKin.lastName} onChange={(event) => updateNextOfKin('lastName', event.target.value)} required /></ApplicationField>
        <ApplicationField label="Relationship" icon={UsersRound}><select value={draft.nextOfKin.relationship} onChange={(event) => updateNextOfKin('relationship', event.target.value)} required><option value="">Select relationship</option><option>Parent</option><option>Guardian</option><option>Spouse</option><option>Sibling</option><option>Relative</option><option>Other</option></select></ApplicationField>
        <ApplicationField label="Phone number"><div className="application-phone-fields"><select aria-label="Next of kin country calling code" value={draft.nextOfKin.phoneCountry} onChange={(event) => updateNextOfKin('phoneCountry', event.target.value as CountryCode)} required>{phoneCountries.map((country) => <option key={country.code} value={country.code}>{country.code} +{country.callingCode} · {country.name}</option>)}</select><input type="tel" autoComplete="tel-national" inputMode="tel" placeholder="e.g. 700 123 456" aria-label="Next of kin phone number" value={draft.nextOfKin.phoneNumber} onChange={(event) => updateNextOfKin('phoneNumber', event.target.value)} required /></div></ApplicationField>
        <ApplicationField label="Email address" icon={Mail} optional><input type="email" value={draft.nextOfKin.email} onChange={(event) => updateNextOfKin('email', event.target.value)} /></ApplicationField>
      </section>}
      {step === 1 && <section className="application-step-content">
        <div className="application-section-heading"><h3>Previous education and results</h3><p>Record the qualification you are applying with and your subject grades.</p></div>
        <ApplicationField label="School or examination institution" icon={Building2} className="application-field-wide"><input value={draft.institution} onChange={(event) => update('institution', event.target.value)} required /></ApplicationField>
        <ApplicationField label="Highest qualification" icon={GraduationCap}><select value={draft.qualification} onChange={(event) => update('qualification', event.target.value)} required><option value="">Select qualification</option><option>Uganda Advanced Certificate of Education (UACE)</option><option>Uganda Certificate of Education (UCE)</option><option>Diploma</option><option>Degree</option><option>Other equivalent qualification</option></select></ApplicationField>
        <ApplicationField label="Year completed" icon={CalendarDays}><input type="number" min="1980" max={new Date().getFullYear()} value={draft.completionYear} onChange={(event) => update('completionYear', event.target.value)} required /></ApplicationField>
        <div className="application-subsection-heading application-field-wide"><div><h4>Academic results</h4><p>Add the subjects and grades from your results slip.</p></div><Button type="button" variant="outline" size="sm" onClick={() => update('academicResults', [...draft.academicResults, { subject: '', grade: '', examinationBody: 'UNEB' }])}><Plus size={13} />Add subject</Button></div>
        {draft.academicResults.map((result, index) => <div className="application-result-row application-field-wide" key={index}>
          <ApplicationField label="Subject" icon={BookOpen}><input value={result.subject} onChange={(event) => updateResult(index, { subject: event.target.value })} required /></ApplicationField>
          <ApplicationField label="Grade" icon={Award}><select value={result.grade} onChange={(event) => updateResult(index, { grade: event.target.value })} required><option value="">Select grade</option>{['A', 'B', 'C', 'D', 'E', 'O', 'F', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Distinction', 'Credit', 'Pass'].map((grade) => <option key={grade}>{grade}</option>)}</select></ApplicationField>
          <ApplicationField label="Exam body" icon={Building2}><select value={result.examinationBody} onChange={(event) => updateResult(index, { examinationBody: event.target.value })} required><option>UNEB</option><option>KNEC</option><option>NECTA</option><option>Cambridge</option><option>Other</option></select></ApplicationField>
          <button type="button" className="application-remove-result" aria-label={`Remove result ${index + 1}`} disabled={draft.academicResults.length === 1} onClick={() => update('academicResults', draft.academicResults.filter((_, currentIndex) => currentIndex !== index))}><Trash2 size={14} /></button>
        </div>)}
      </section>}
      {step === 2 && <section className="application-step-content">
        <div className="application-section-heading"><h3>Programme and intake selection</h3><p>Choose your preferred course and intake. Your first choice is used for admission review.</p></div>
        <ApplicationField label="First-choice programme" icon={GraduationCap} className="application-field-wide"><select value={draft.programme} onChange={(event) => update('programme', event.target.value)} required><option value="">Select a programme</option><option>BSc Computer Science</option><option>BSc Information Technology</option><option>Bachelor of Business Administration</option><option>Bachelor of Education</option><option>Diploma in Business</option></select></ApplicationField>
        <ApplicationField label="Second-choice programme" icon={GraduationCap} optional><select value={draft.secondChoice} onChange={(event) => update('secondChoice', event.target.value)}><option value="">No second choice</option><option>BSc Computer Science</option><option>BSc Information Technology</option><option>Bachelor of Business Administration</option><option>Bachelor of Education</option><option>Diploma in Business</option></select></ApplicationField>
        <ApplicationField label="Intake" icon={CalendarDays}><select value={draft.intake} onChange={(event) => update('intake', event.target.value)} required><option>August 2026</option><option>January 2027</option><option>August 2027</option></select></ApplicationField>
        <ApplicationField label="Study mode" icon={Clock3}><select value={draft.studyMode} onChange={(event) => update('studyMode', event.target.value)} required><option>Day</option><option>Evening</option><option>Weekend</option><option>Distance</option></select></ApplicationField>
      </section>}
      {step === 3 && <section className="application-step-content">
        <div className="application-section-heading"><h3>Supporting documents</h3><p>Attach readable scans or photos. Required documents are marked; files are not uploaded to a server in this demo.</p></div>
        {draft.documents.map((document, index) => <div className="application-upload-row" key={document.name}>
          <div className="application-upload-label"><FileText size={17} /><span><strong>{document.name}{document.required && <em>Required</em>}</strong><small>{document.fileName || 'PDF, JPG or PNG · max 10 MB'}</small></span></div>
          <label className="student-action-button application-file-picker"><Upload size={13} />{document.fileName ? 'Replace file' : 'Choose file'}<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => updateDocument(index, event)} /></label>
        </div>)}
        <div className="online-application-info"><ShieldCheck size={14} /><span>Only document names and statuses are saved in your browser. The file contents are not retained; production needs secure document storage.</span></div>
      </section>}
      {step === 4 && <section className="application-step-content">
        <div className="application-section-heading"><h3>Review your application</h3><p>Check your details before sending this application to admissions.</p></div>
        <div className="application-review-grid">
          <section><h4>Personal details</h4><dl><dt>First name</dt><dd>{draft.firstName}</dd><dt>Middle name</dt><dd>{draft.middleName || 'Not provided'}</dd><dt>Last name</dt><dd>{draft.lastName}</dd><dt>Email / phone</dt><dd>{draft.email} · {formatPhone(draft.phoneCountry, draft.phoneNumber)}</dd><dt>Date of birth</dt><dd>{draft.dateOfBirth}</dd><dt>Nationality</dt><dd>{draft.nationality}</dd><dt>District</dt><dd>{draft.district}</dd><dt>Location</dt><dd>{draft.location}</dd><dt>Next of kin</dt><dd>{[draft.nextOfKin.firstName, draft.nextOfKin.middleName, draft.nextOfKin.lastName].filter(Boolean).join(' ')} · {draft.nextOfKin.relationship} · {formatPhone(draft.nextOfKin.phoneCountry, draft.nextOfKin.phoneNumber)}</dd></dl></section>
          <section><h4>Education and programme</h4><dl><dt>Prior qualification</dt><dd>{draft.qualification} · {draft.institution} · {draft.completionYear}</dd><dt>Results recorded</dt><dd>{draft.academicResults.map((result) => `${result.subject}: ${result.grade}`).join(' · ')}</dd><dt>First choice</dt><dd>{draft.programme}</dd><dt>Second choice</dt><dd>{draft.secondChoice || 'None'}</dd><dt>Intake / mode</dt><dd>{draft.intake} · {draft.studyMode}</dd></dl></section>
          <section className="application-review-documents"><h4>Documents</h4>{draft.documents.map((document) => <p key={document.name}><FileText size={13} />{document.name}: {document.fileName || 'Not attached'}{document.required && !document.fileName && <em>Required</em>}</p>)}</section>
        </div>
        <label className="application-declaration"><input type="checkbox" checked={declarationAccepted} onChange={(event) => setDeclarationAccepted(event.target.checked)} required /><span>I confirm that the information and results provided are accurate and authorize the institution to verify them.</span></label>
      </section>}
    </form>
    <div className="application-step-actions">
      <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}><ChevronLeft size={14} />Previous</Button>
      <span>Step {step + 1} of {steps.length}</span>
      {step < 4 ? <Button type="button" onClick={continueStep}>Continue<ChevronRight size={14} /></Button> : <Button type="submit" form="online-application-form"><Check size={14} />Submit application</Button>}
    </div>
  </div>
}

function ApplicationField({ label, icon: Icon, children, className = '', optional = false }: { label: string; icon?: LucideIcon; children: ReactNode; className?: string; optional?: boolean }) {
  return <label className={`application-field ${className}`}>
    <span className="application-field-label">{label}{optional && <small>Optional</small>}</span>
    <span className={`application-input-control${Icon ? '' : ' application-input-control-no-icon'}`}>{Icon && <span className="application-input-icon"><Icon size={15} aria-hidden="true" /></span>}{children}</span>
  </label>
}

function ApplicationCreateDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (details: Pick<Application, 'firstName' | 'middleName' | 'lastName' | 'email' | 'phone' | 'programme' | 'intake'>) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSubmit({
      firstName: String(data.get('firstName')).trim(),
      middleName: String(data.get('middleName')).trim(),
      lastName: String(data.get('lastName')).trim(),
      email: String(data.get('email')).trim(),
      phone: String(data.get('phone')).trim(),
      programme: String(data.get('programme')).trim(),
      intake: String(data.get('intake')),
    })
  }
  return <ModalShell title="Create application" description="Record an application received by the admissions office." onClose={onClose} footer={<><Button type="button" variant="ghost" onClick={onClose}><X size={14} />Cancel</Button><Button type="submit" form="admissions-create-form"><Plus size={14} />Create application</Button></>}>
    <form id="admissions-create-form" className="modal-form-grid" onSubmit={submit}><label>First name<input name="firstName" required /></label><label>Middle name<input name="middleName" /></label><label>Last name<input name="lastName" required /></label><label>Email<input name="email" type="email" required /></label><label>Phone<input name="phone" type="tel" required /></label><label>Programme<input name="programme" required /></label><label className="modal-form-wide">Intake<select name="intake"><option>August 2026</option><option>January 2027</option><option>August 2027</option></select></label></form>
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
  const previousEducation = application.previousEducation ?? []
  const academicResults = application.academicResults ?? []
  const documentsVerified = application.documents.filter((document) => document.required && document.status === 'Verified').length
  const documentsRequired = application.documents.filter((document) => document.required).length
  const initials = application.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  return <ModalShell className="application-details-modal" title={isMatriculation ? 'Matriculation clearance' : isReview ? 'Applicant review' : isOffer ? 'Offer decision' : 'Application details'} description={`${application.id} · Submitted application record`} onClose={onClose} footer={<><Button type="button" variant="ghost" onClick={onClose}><X size={14} />Close</Button>{decisionActions}{isMatriculation && application.stage !== 'Enrolled' && <Button type="button" onClick={onMatriculate}><GraduationCap size={14} />Enroll student</Button>}</>}>
    <div className="application-details">
      <section className="application-details-hero">
        <span className="application-details-avatar">{initials || <UserRound size={20} />}</span>
        <div className="application-details-hero-copy"><h3>{application.name}</h3><span>{application.email}{application.phone ? ` · ${application.phone}` : ''}</span><div><Badge tone={stageTone(application.stage)}>{application.stage}</Badge><span className="application-details-reference">{application.id}</span></div></div>
        <div className="application-details-doc-summary"><strong>{documentsVerified}/{documentsRequired}</strong><span>required documents verified</span></div>
      </section>
      <section className="application-details-section"><div className="student-section-heading"><UserRound size={15} /><h3>Personal details</h3></div><dl className="application-details-grid">
        <ApplicationDetailField label="First name">{application.firstName || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Middle name">{application.middleName || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Last name">{application.lastName || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Email">{application.email || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Phone">{application.phone || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Date of birth">{application.dateOfBirth || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Gender">{application.gender || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Nationality">{application.nationality || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="District">{application.district || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Location">{application.location || application.address || 'Not provided'}</ApplicationDetailField>
      </dl></section>
      <section className="application-details-section"><div className="student-section-heading"><GraduationCap size={15} /><h3>Programme choice</h3></div><dl className="application-details-grid">
        <ApplicationDetailField label="First choice">{application.programme}</ApplicationDetailField><ApplicationDetailField label="Second choice">{application.secondChoice || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Intake">{application.intake}</ApplicationDetailField><ApplicationDetailField label="Study mode">{application.studyMode || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Current stage"><Badge tone={stageTone(application.stage)}>{application.stage}</Badge></ApplicationDetailField>{application.studentId && <ApplicationDetailField label="Student ID">{application.studentId}</ApplicationDetailField>}
      </dl></section>
      <section className="application-details-section"><div className="student-section-heading"><UsersRound size={15} /><h3>Next of kin / emergency contact</h3></div><dl className="application-details-grid">
        <ApplicationDetailField label="Name">{[application.nextOfKin?.firstName, application.nextOfKin?.middleName, application.nextOfKin?.lastName].filter(Boolean).join(' ') || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Relationship">{application.nextOfKin?.relationship || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Phone">{application.nextOfKin?.phone || 'Not provided'}</ApplicationDetailField><ApplicationDetailField label="Email">{application.nextOfKin?.email || 'Not provided'}</ApplicationDetailField>
      </dl></section>
      <section className="application-details-section"><div className="student-section-heading"><BookOpen size={15} /><h3>Previous education & results</h3></div>
        {previousEducation.length > 0 ? <div className="application-education-list">{previousEducation.map((education, index) => <div className="application-education-item" key={`${education.institution}-${index}`}><strong>{education.qualification || 'Qualification not specified'}</strong><span>{education.institution || 'Institution not specified'}</span><small>Completed {education.completionYear || 'year not provided'}</small></div>)}</div> : <p className="application-details-empty">No previous education details were included.</p>}
        {academicResults.length > 0 && <div className="application-results-table-wrap"><table className="application-results-table"><thead><tr><th>Subject</th><th>Grade</th><th>Examination body</th></tr></thead><tbody>{academicResults.map((result, index) => <tr key={`${result.subject}-${index}`}><td>{result.subject}</td><td>{result.grade}</td><td>{result.examinationBody || 'Not provided'}</td></tr>)}</tbody></table></div>}
      </section>
      <section className="application-details-section"><div className="student-section-heading"><FileText size={15} /><h3>Supporting documents</h3><span className="application-details-section-count">{application.documents.length}</span></div><div className="application-details-document-list">
        {application.documents.length > 0 ? application.documents.map((document) => <div className="application-details-document" key={document.name}><span className="application-details-document-icon"><FileText size={15} /></span><span className="application-details-document-copy"><strong>{document.name}{document.required && <small>Required</small>}</strong><span>{document.fileName || 'No file attached'}</span></span><Badge tone={document.status === 'Verified' ? 'success' : document.status === 'Received' ? 'info' : 'warning'}>{document.status}</Badge></div>) : <p className="application-details-empty">No documents are recorded for this application.</p>}
      </div></section>
      {isMatriculation && <section className="student-profile-section"><div className="student-section-heading"><ShieldCheck size={15} /><h3>Pre-enrollment clearance</h3></div><div className="admissions-clearance-list"><label><input type="checkbox" checked={application.identityVerified} onChange={(event) => onClearanceChange({ identityVerified: event.target.checked })} /> Identity verified</label><label><input type="checkbox" checked={application.feesCleared} onChange={(event) => onClearanceChange({ feesCleared: event.target.checked })} /> Initial fees confirmed</label><span>{application.documents.filter((doc) => doc.status === 'Verified').length}/{application.documents.length} required documents verified</span></div><p className="modal-info"><GraduationCap size={14} />Enrollment is enabled only after identity, fees, and all required documents are cleared.</p></section>}
      <section className="application-details-section"><div className="student-section-heading"><CalendarDays size={15} /><h3>Application history</h3></div>{application.history.length > 0 ? <ol className="admissions-history">{application.history.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ol> : <p className="application-details-empty">No history entries are recorded.</p>}</section>
    </div>
  </ModalShell>
}

function ApplicationDetailField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="application-detail-field"><dt>{label}</dt><dd>{children}</dd></div>
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
