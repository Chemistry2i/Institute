import { useState, type FormEvent, type ReactNode } from 'react'
import { BadgeCheck, Building2, CalendarDays, Check, CircleAlert, CircleCheck, CirclePause, Eye, FileText, Filter, GraduationCap, Mail, MapPin, Phone, Plus, Search, ShieldCheck, UserRound, UsersRound, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../app-context'
import { studentProfiles, students as initialStudents, type StudentProfileData, type StudentRecord } from '../data'
import { Badge, Button, Card, EmptyState, KpiCard } from './ui'
import { ModalShell } from './ModuleWorkspace'

type ProfileTab = 'overview' | 'documents'

export function StudentInformation() {
  const { can } = useAppContext()
  const [records, setRecords] = useState(initialStudents)
  const [profiles, setProfiles] = useState(studentProfiles)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  if (!can('students.view')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to student records. Switch the RBAC preview role or ask an administrator to grant access.</p></Card>

  const normalizedSearch = search.trim().toLowerCase()
  const visibleRecords = records.filter((student) => {
    const matchesSearch = `${student.id} ${student.name} ${student.programme}`.toLowerCase().includes(normalizedSearch)
    return matchesSearch && (statusFilter === 'All statuses' || student.status === statusFilter)
  })
  const countForStatus = (status: StudentRecord['status']) => records.filter((student) => student.status === status).length
  const clearFilters = () => {
    setSearch('')
    setStatusFilter('All statuses')
  }

  const addStudent = (student: StudentRecord, profile: StudentProfileData) => {
    if (records.some((record) => record.id.toLowerCase() === student.id.toLowerCase())) {
      toast.error('That student ID is already in use.')
      return false
    }
    setRecords((current) => [student, ...current])
    setProfiles((current) => ({ ...current, [student.id]: profile }))
    toast.success('Student record added to this preview.')
    setCreateOpen(false)
    return true
  }

  return <>
    <section className="stats-grid student-kpi-grid" aria-label="Student record summary">
      <KpiCard label="Student records" value={`${records.length}`} detail="In this preview directory" tone="blue" icon={UsersRound} />
      <KpiCard label="Active" value={`${countForStatus('Active')}`} detail="Currently enrolled" tone="teal" icon={CircleCheck} />
      <KpiCard label="On hold" value={`${countForStatus('On hold')}`} detail="Require follow-up" tone="amber" icon={CirclePause} />
      <KpiCard label="Graduating" value={`${countForStatus('Graduating')}`} detail="In completion review" tone="purple" icon={GraduationCap} />
    </section>

    <div className="module-toolbar student-toolbar">
      <label className="toolbar-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, student ID, or programme" aria-label="Search student records" /></label>
      <div className="toolbar-actions">
        <label className="student-status-filter"><Filter size={15} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by student status"><option>All statuses</option><option>Active</option><option>On hold</option><option>Graduating</option></select></label>
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={15} /> Add student</Button>
      </div>
    </div>

    {visibleRecords.length === 0 ? <EmptyState title="No student records found" description="The current filters do not match any students. Clear the search or adjust the status filter to continue." actionLabel="Clear filters" onAction={clearFilters} /> : <Card className="module-table-card student-directory-card">
      <div className="table-card-head">
        <div className="module-title"><div className="module-title-icon module-icon-teal"><UsersRound size={19} /></div><div><h2>Student directory</h2><p>{visibleRecords.length} of {records.length} student records</p></div></div>
        <Button variant="ghost" size="sm" onClick={() => toast.success('Student import workflow is ready for backend integration.')}><FileText size={14} /> Import records</Button>
      </div>
      <div className="table-responsive"><table className="data-table student-table">
        <thead><tr><th>Student</th><th>Programme</th><th>Year</th><th>Status</th><th>Account balance</th><th>Last activity</th><th aria-label="Actions" /></tr></thead>
        <tbody>{visibleRecords.map((student) => <tr key={student.id}>
          <td><div className="table-person"><span className="table-avatar table-avatar-photo">{student.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><div><button className="student-name-link" onClick={() => setSelectedStudent(student)}>{student.name}</button><small>{student.id}</small></div></div></td>
          <td>{student.programme}</td><td>{student.year}</td><td><StudentStatusBadge status={student.status} /></td>
          <td className={student.balance === 'UGX 0' ? 'balance-clear' : ''}>{student.balance}</td><td>{student.lastSeen}</td>
          <td><button className="row-more" aria-label={`View ${student.name} profile`} onClick={() => setSelectedStudent(student)}><Eye size={17} /></button></td>
        </tr>)}</tbody>
      </table></div>
      <div className="table-footer"><span>Showing {visibleRecords.length} of {records.length} preview records</span></div>
    </Card>}

    {selectedStudent && <StudentProfileDialog student={selectedStudent} profile={profiles[selectedStudent.id]} onClose={() => setSelectedStudent(null)} />}
    {createOpen && <StudentCreateModal onClose={() => setCreateOpen(false)} onCreate={addStudent} />}
  </>
}

function StudentProfileDialog({ student, profile, onClose }: { student: StudentRecord; profile: StudentProfileData | undefined; onClose: () => void }) {
  const [tab, setTab] = useState<ProfileTab>('overview')
  if (!profile) return null

  return <div className="modal-backdrop student-profile-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="student-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="student-profile-title">
      <header className="student-profile-header">
        <div className="student-profile-heading"><div className="student-profile-avatar">{student.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div><div><div className="eyebrow">Student profile</div><h2 id="student-profile-title">{student.name}</h2><p>{student.id} <span>·</span> {student.programme}</p></div></div>
        <button className="modal-close" onClick={onClose} aria-label="Close student profile"><X size={18} /></button>
      </header>
      <div className="student-profile-summary"><StudentStatusBadge status={student.status} /><span><GraduationCap size={14} /> {student.year}</span><span><Building2 size={14} /> {profile.campus}</span><span className={student.balance === 'UGX 0' ? 'balance-clear' : ''}>Balance: {student.balance}</span></div>
      <div className="student-profile-tabs" role="tablist" aria-label="Student profile sections">
        <button type="button" role="tab" aria-selected={tab === 'overview'} className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Profile overview</button>
        <button type="button" role="tab" aria-selected={tab === 'documents'} className={tab === 'documents' ? 'active' : ''} onClick={() => setTab('documents')}>Documents <span>{profile.documents.length}</span></button>
      </div>
      {tab === 'overview' ? <div className="student-profile-content">
        <section className="student-profile-section"><div className="student-section-heading"><GraduationCap size={16} /><h3>Academic placement</h3></div><dl className="student-detail-grid">
          <ProfileField label="Programme">{student.programme}</ProfileField><ProfileField label="Faculty">{profile.faculty}</ProfileField><ProfileField label="Department">{profile.department}</ProfileField><ProfileField label="Campus">{profile.campus}</ProfileField><ProfileField label="Current year">{student.year}</ProfileField><ProfileField label="Academic period">{profile.semester}</ProfileField><ProfileField label="Intake">{profile.intake}</ProfileField><ProfileField label="Student status"><StudentStatusBadge status={student.status} /></ProfileField>
        </dl></section>
        <section className="student-profile-section"><div className="student-section-heading"><UserRound size={16} /><h3>Personal & contact details</h3></div><dl className="student-detail-grid">
          <ProfileField label="Email"><a href={`mailto:${profile.email}`}><Mail size={13} />{profile.email}</a></ProfileField><ProfileField label="Phone"><a href={`tel:${profile.phone}`}><Phone size={13} />{profile.phone}</a></ProfileField><ProfileField label="Date of birth">{profile.dateOfBirth}</ProfileField><ProfileField label="Gender">{profile.gender}</ProfileField><ProfileField label="Residential address"><span><MapPin size={13} />{profile.address}</span></ProfileField>
        </dl></section>
        <section className="student-profile-section"><div className="student-section-heading"><UsersRound size={16} /><h3>Next of kin & emergency contact</h3></div><dl className="student-detail-grid">
          <ProfileField label="Name">{profile.nextOfKin.name}</ProfileField><ProfileField label="Relationship">{profile.nextOfKin.relationship}</ProfileField><ProfileField label="Phone"><a href={`tel:${profile.nextOfKin.phone}`}><Phone size={13} />{profile.nextOfKin.phone}</a></ProfileField><ProfileField label="Email"><a href={`mailto:${profile.nextOfKin.email}`}><Mail size={13} />{profile.nextOfKin.email}</a></ProfileField>
        </dl></section>
        <section className="student-profile-section"><div className="student-section-heading"><CalendarDays size={16} /><h3>Status history</h3></div><ol className="student-status-timeline">{profile.statusHistory.map((entry) => <li key={`${entry.date}-${entry.detail}`}><span className="student-timeline-marker" /><div><div className="student-timeline-meta"><StudentStatusBadge status={entry.status} /><time>{entry.date}</time></div><p>{entry.detail}</p></div></li>)}</ol></section>
      </div> : <div className="student-profile-content"><section className="student-profile-section student-documents-section"><div className="student-section-heading"><FileText size={16} /><h3>Student documents</h3><span>{profile.documents.length} records</span></div><div className="student-document-list">{profile.documents.map((document) => <div className="student-document-row" key={document.name}><span className="student-document-icon"><FileText size={16} /></span><span className="student-document-copy"><strong>{document.name}</strong><small>Updated {document.updated}</small></span><DocumentStatus status={document.status} /></div>)}</div></section></div>}
      <footer className="student-profile-footer"><span>Last activity: {student.lastSeen}</span><Button variant="outline" size="sm" onClick={onClose}>Close profile</Button></footer>
    </section>
  </div>
}

function ProfileField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="student-detail-field"><dt>{label}</dt><dd>{children}</dd></div>
}

function StudentCreateModal({ onClose, onCreate }: { onClose: () => void; onCreate: (student: StudentRecord, profile: StudentProfileData) => boolean }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const student: StudentRecord = {
      id: String(formData.get('studentId')).trim(),
      name: String(formData.get('fullName')).trim(),
      programme: String(formData.get('programme')).trim(),
      year: String(formData.get('year')),
      status: String(formData.get('status')) as StudentRecord['status'],
      balance: 'UGX 0',
      lastSeen: 'Not yet active',
    }
    const profile: StudentProfileData = {
      campus: String(formData.get('campus')),
      faculty: 'To be assigned',
      department: 'To be assigned',
      semester: 'Not assigned',
      intake: 'New record',
      email: String(formData.get('email')).trim(),
      phone: String(formData.get('phone')).trim(),
      dateOfBirth: 'Not provided',
      gender: 'Not provided',
      address: 'Not provided',
      nextOfKin: { name: String(formData.get('kinName')).trim(), relationship: String(formData.get('kinRelationship')).trim(), phone: String(formData.get('kinPhone')).trim(), email: 'Not provided' },
      statusHistory: [{ date: new Date().toLocaleDateString('en-GB'), status: student.status, detail: 'Student record created in this preview' }],
      documents: [
        { name: 'Identity document', status: 'Pending', updated: 'Awaiting upload' },
        { name: 'Academic transcript', status: 'Pending', updated: 'Awaiting upload' },
      ],
    }

    const created = onCreate(student, profile)
    if (!created) {
      setIsSubmitting(false)
      return
    }

    window.setTimeout(() => {
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  return <ModalShell title="Add student record" description="Create a student profile with academic placement and emergency contact details." onClose={onClose} footer={<><Button variant="ghost" type="button" onClick={onClose}>Cancel</Button><Button type="submit" form="student-create-form" loading={isSubmitting}><Plus size={14} /> Create student</Button></>}>
    <form className="modal-form-grid student-create-form" id="student-create-form" onSubmit={submit}>
      <label>Student ID<input name="studentId" placeholder="e.g. 25/BCS/0142" required /></label>
      <label>Full name<input name="fullName" placeholder="Student full name" required /></label>
      <label>Programme<input name="programme" placeholder="Select or enter a programme" required /></label>
      <label>Year of study<select name="year" defaultValue="Year 1"><option>Year 1</option><option>Year 2</option><option>Year 3</option><option>Year 4</option><option>Year 5</option></select></label>
      <label>Campus<select name="campus" defaultValue="Main campus"><option>Main campus</option><option>East campus</option><option>North campus</option></select></label>
      <label>Student status<select name="status" defaultValue="Active"><option>Active</option><option>On hold</option><option>Graduating</option></select></label>
      <label>Email address<input name="email" type="email" placeholder="student@institution.ac.ug" required /></label>
      <label>Phone number<input name="phone" type="tel" placeholder="+256 7XX XXX XXX" required /></label>
      <label>Emergency contact name<input name="kinName" placeholder="Next of kin full name" required /></label>
      <label>Relationship<input name="kinRelationship" placeholder="e.g. Parent, guardian" required /></label>
      <label className="modal-form-wide">Emergency contact phone<input name="kinPhone" type="tel" placeholder="+256 7XX XXX XXX" required /></label>
      <div className="modal-info modal-form-wide"><CircleAlert size={15} /><span>New records and documents are stored in frontend preview state only.</span></div>
    </form>
  </ModalShell>
}

function StudentStatusBadge({ status }: { status: StudentRecord['status'] | string }) {
  const tone = status === 'Active' ? 'success' : status === 'Graduating' ? 'info' : 'warning'
  return <Badge tone={tone}>{status}</Badge>
}

function DocumentStatus({ status }: { status: StudentProfileData['documents'][number]['status'] }) {
  const tone = status === 'Verified' ? 'success' : status === 'Received' ? 'info' : 'warning'
  const Icon = status === 'Verified' ? BadgeCheck : status === 'Received' ? Check : CircleAlert
  return <span className={`student-document-status student-document-status-${status.toLowerCase()}`}><Icon size={13} />{status}</span>
}