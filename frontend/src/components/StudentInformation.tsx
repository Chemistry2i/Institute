import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { ArrowRightLeft, BadgeCheck, Building2, CalendarDays, Check, CircleAlert, CircleCheck, CirclePause, ClipboardCheck, Download, Eye, FileText, Filter, GraduationCap, Mail, MapPin, Phone, Plus, Search, ShieldCheck, Upload, UserRound, UsersRound, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppContext } from '../app-context'
import { type StudentProfileData, type StudentRecord } from '../data'
import { readStudentProfiles, readStudentRecords, writeStudentRecords } from '../demo-store'
import { Badge, Button, Card, EmptyState, KpiCard } from './ui'
import { ModalShell } from './ModuleWorkspace'

type ProfileTab = 'overview' | 'documents'

function isStudentRecord(value: unknown): value is StudentRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<StudentRecord>
  return typeof record.id === 'string'
    && typeof record.name === 'string'
    && typeof record.programme === 'string'
    && typeof record.year === 'string'
    && (record.status === 'Active' || record.status === 'On hold' || record.status === 'Graduating')
    && typeof record.balance === 'string'
    && typeof record.lastSeen === 'string'
}

function createPreviewProfile(student: StudentRecord): StudentProfileData {
  return {
    campus: 'Main campus',
    faculty: 'Pending faculty assignment',
    department: 'Pending department assignment',
    semester: 'Current academic period',
    intake: 'Imported record',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Not specified',
    address: '',
    nextOfKin: { name: 'Not provided', relationship: 'Not provided', phone: '', email: '' },
    statusHistory: [{ date: new Date().toLocaleDateString(), status: student.status, detail: 'Student record imported into the frontend preview.' }],
    documents: [],
  }
}

function downloadStudentJson(filename: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function StudentInformation() {
  const { can } = useAppContext()
  const [records, setRecords] = useState(readStudentRecords)
  const [profiles, setProfiles] = useState(readStudentProfiles)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)
  const [statusActionStudent, setStatusActionStudent] = useState<StudentRecord | null>(null)
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [bulkStatus, setBulkStatus] = useState<StudentRecord['status'] | ''>('')
  const [createOpen, setCreateOpen] = useState(false)
  const selectAllRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

  if (!can('students.view')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to student records. Switch the RBAC preview role or ask an administrator to grant access.</p></Card>

  const normalizedSearch = search.trim().toLowerCase()
  const visibleRecords = records.filter((student) => {
    const matchesSearch = `${student.id} ${student.name} ${student.programme}`.toLowerCase().includes(normalizedSearch)
    return matchesSearch && (statusFilter === 'All statuses' || student.status === statusFilter)
  })
  const countForStatus = (status: StudentRecord['status']) => records.filter((student) => student.status === status).length
  const selectedVisibleStudents = visibleRecords.filter((student) => selectedStudentIds.includes(student.id))
  const allVisibleStudentsSelected = visibleRecords.length > 0 && selectedVisibleStudents.length === visibleRecords.length
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = selectedVisibleStudents.length > 0 && !allVisibleStudentsSelected
  }, [selectedVisibleStudents.length, allVisibleStudentsSelected])
  const toggleStudentSelection = (studentId: string) => setSelectedStudentIds((current) => current.includes(studentId)
    ? current.filter((selectedId) => selectedId !== studentId)
    : [...current, studentId])
  const toggleAllVisibleStudents = () => {
    const visibleIds = new Set(visibleRecords.map((student) => student.id))
    setSelectedStudentIds((current) => allVisibleStudentsSelected
      ? current.filter((studentId) => !visibleIds.has(studentId))
      : [...new Set([...current, ...visibleIds])])
  }
  const exportStudents = (selectedOnly: boolean) => {
    const recordsToExport = selectedOnly ? selectedVisibleStudents : visibleRecords
    downloadStudentJson('student-directory.json', { exportedAt: new Date().toISOString(), students: recordsToExport })
    toast.success(`${recordsToExport.length} student records exported.`)
  }
  const applyBulkStatus = () => {
    if (!bulkStatus || selectedVisibleStudents.length === 0) return
    const ids = new Set(selectedVisibleStudents.map((student) => student.id))
    const nextRecords = records.map((student) => ids.has(student.id) ? { ...student, status: bulkStatus } : student)
    setRecords(nextRecords)
    writeStudentRecords(nextRecords, profiles)
    setSelectedStudentIds([])
    setBulkStatus('')
    toast.success(`${ids.size} student records updated in this preview.`)
  }
  const importStudents = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      if (file.size > 2_000_000) throw new Error('Import files must be smaller than 2 MB.')
      const parsed = JSON.parse(await file.text()) as { students?: unknown } | unknown[]
      const incoming = Array.isArray(parsed) ? parsed : (parsed as { students?: unknown }).students
      if (!Array.isArray(incoming) || !incoming.every(isStudentRecord)) throw new Error('Choose a JSON array of valid student records.')
      const existing = new Set(records.map((student) => student.id.toLowerCase()))
      const newRecords = (incoming as StudentRecord[]).filter((student) => !existing.has(student.id.toLowerCase()))
      const nextRecords = [...newRecords, ...records]
      const nextProfiles = { ...profiles }
      for (const student of newRecords) nextProfiles[student.id] ??= createPreviewProfile(student)
      writeStudentRecords(nextRecords, nextProfiles)
      setRecords(nextRecords)
      setProfiles(nextProfiles)
      toast.success(`${newRecords.length} student records imported; duplicate IDs were skipped.`)
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'The student import file could not be read.')
    } finally {
      event.target.value = ''
    }
  }
  const clearFilters = () => {
    setSearch('')
    setStatusFilter('All statuses')
  }

  const addStudent = (student: StudentRecord, profile: StudentProfileData) => {
    if (records.some((record) => record.id.toLowerCase() === student.id.toLowerCase())) {
      toast.error('That student ID is already in use.')
      return false
    }
    const nextRecords = [student, ...records]
    const nextProfiles = { ...profiles, [student.id]: profile }
    writeStudentRecords(nextRecords, nextProfiles)
    setRecords(nextRecords)
    setProfiles(nextProfiles)
    toast.success('Student record added to this preview.')
    setCreateOpen(false)
    return true
  }

  const exportSingleStudent = (student: StudentRecord) => {
    const profile = profiles[student.id] ?? createPreviewProfile(student)
    downloadStudentJson(`${student.id.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'student'}-profile.json`, {
      exportedAt: new Date().toISOString(),
      student,
      profile,
    })
    toast.success(`${student.name}'s record exported.`)
  }

  const updateStudentStatus = (student: StudentRecord, status: StudentRecord['status']) => {
    const nextRecords = records.map((record) => record.id === student.id ? { ...record, status } : record)
    writeStudentRecords(nextRecords, profiles)
    setRecords(nextRecords)
    toast.success(`${student.name} moved to ${status}.`)
    setStatusActionStudent(null)
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
        <input ref={importInputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => void importStudents(event)} aria-label="Import student records JSON file" />
        <Button type="button" variant="outline" size="sm" onClick={() => importInputRef.current?.click()}><Upload size={14} /> Import records</Button>
        <Button variant="outline" size="sm" onClick={() => exportStudents(false)}><Download size={14} /> Export</Button>
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={15} /> Add student</Button>
      </div>
    </div>
    {selectedVisibleStudents.length > 0 && <div className="bulk-selection-toolbar" aria-live="polite"><span>{selectedVisibleStudents.length} students selected</span><label className="bulk-status-action"><span>Set status</span><select value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value as StudentRecord['status'] | '')}><option value="">Choose status</option><option>Active</option><option>On hold</option><option>Graduating</option></select></label><Button type="button" variant="outline" size="sm" disabled={!bulkStatus} onClick={applyBulkStatus}><Check size={14} /> Apply</Button><Button type="button" variant="outline" size="sm" onClick={() => exportStudents(true)}><Download size={14} /> Export selected</Button><Button type="button" variant="ghost" size="sm" onClick={() => setSelectedStudentIds([])}><X size={14} /> Clear selection</Button></div>}

    {visibleRecords.length === 0 ? <EmptyState title="No student records found" description="The current filters do not match any students. Clear the search or adjust the status filter to continue." actionLabel="Clear filters" onAction={clearFilters} /> : <Card className="module-table-card student-directory-card">
      <div className="table-card-head">
        <div className="module-title"><div className="module-title-icon module-icon-teal"><UsersRound size={19} /></div><div><h2>Student directory</h2><p>{visibleRecords.length} of {records.length} student records</p></div></div>
        <span className="student-directory-hint">Select rows for bulk actions</span>
      </div>
      <div className="table-responsive"><table className="data-table student-table">
        <thead><tr><th className="bulk-select-cell"><input ref={selectAllRef} type="checkbox" checked={allVisibleStudentsSelected} onChange={toggleAllVisibleStudents} aria-label="Select all visible students" /></th><th>Student</th><th>Programme</th><th>Year</th><th>Status</th><th>Account balance</th><th>Last activity</th><th aria-label="Actions" /></tr></thead>
        <tbody>{visibleRecords.map((student) => <tr key={student.id}>
          <td className="bulk-select-cell"><input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={() => toggleStudentSelection(student.id)} aria-label={`Select ${student.name}`} /></td>
          <td><div className="table-person"><span className="table-avatar table-avatar-photo">{student.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><div><button type="button" className="student-name-link" onClick={() => setSelectedStudent(student)}>{student.name}</button><small>{student.id}</small></div></div></td>
          <td>{student.programme}</td><td>{student.year}</td><td><StudentStatusBadge status={student.status} /></td>
          <td className={student.balance === 'UGX 0' ? 'balance-clear' : ''}>{student.balance}</td><td>{student.lastSeen}</td>
          <td><div className="student-row-actions"><button type="button" className="student-action-button" onClick={() => setSelectedStudent(student)}><Eye size={12} />View</button><button type="button" className="student-action-button" onClick={() => setStatusActionStudent(student)}><ShieldCheck size={12} />Status</button><button type="button" className="student-action-button" onClick={() => exportSingleStudent(student)}><Download size={12} />Export</button></div></td>
        </tr>)}</tbody>
      </table></div>
      <div className="table-footer"><span>Showing {visibleRecords.length} of {records.length} preview records</span></div>
    </Card>}

    {selectedStudent && <StudentProfileDialog student={selectedStudent} profile={profiles[selectedStudent.id]} onClose={() => setSelectedStudent(null)} />}
    {statusActionStudent && <StudentStatusModal student={statusActionStudent} currentStatus={statusActionStudent.status} onClose={() => setStatusActionStudent(null)} onSave={(status) => updateStudentStatus(statusActionStudent, status)} />}
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

function StudentStatusModal({ student, currentStatus, onClose, onSave }: { student: StudentRecord; currentStatus: StudentRecord['status']; onClose: () => void; onSave: (status: StudentRecord['status']) => void }) {
  const [status, setStatus] = useState<StudentRecord['status']>(currentStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    window.setTimeout(() => {
      onSave(status)
      setIsSubmitting(false)
    }, 240)
  }

  return <ModalShell title="Update student status" description={`Adjust ${student.name}'s current academic or support status in this preview.`} onClose={onClose} footer={<><Button variant="ghost" type="button" onClick={onClose}>Cancel</Button><Button type="submit" form="student-status-form" loading={isSubmitting}>Save status</Button></>}>
    <form id="student-status-form" className="modal-form-grid" onSubmit={submit}>
      <label className="modal-form-wide">Student<select value={status} onChange={(event) => setStatus(event.target.value as StudentRecord['status'])}><option>Active</option><option>On hold</option><option>Graduating</option></select></label>
      <div className="modal-info modal-form-wide"><CircleAlert size={15} /><span>This update applies to the preview record only until the API layer is connected.</span></div>
    </form>
  </ModalShell>
}

export function StudentPlacementPage() {
  const { can } = useAppContext()
  const [rows, setRows] = useState(() => readStudentRecords().slice(0, 8).map((student, index) => ({
    id: student.id,
    name: student.name,
    programme: student.programme,
    campus: ['Main campus', 'East campus', 'North campus'][index % 3],
    faculty: ['Computing', 'Business', 'Education'][index % 3],
    year: student.year,
    status: student.status,
  })))
  const [selected, setSelected] = useState<null | (typeof rows)[number]>(null)

  if (!can('students.view')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to student placement and status workflows.</p></Card>

  const assignPlacement = (student: (typeof rows)[number], campus: string, faculty: string) => {
    setRows((current) => current.map((row) => row.id === student.id ? { ...row, campus, faculty } : row))
    toast.success(`${student.name} assigned to ${faculty} at ${campus}.`)
    setSelected(null)
  }

  return <>
    <section className="stats-grid student-kpi-grid" aria-label="Student placement summary">
      <KpiCard label="Placed students" value={`${rows.length}`} detail="Assigned across active campuses" tone="blue" icon={Building2} />
      <KpiCard label="Main campus" value={`${rows.filter((row) => row.campus === 'Main campus').length}`} detail="Current enrolment load" tone="teal" icon={MapPin} />
      <KpiCard label="Faculty coverage" value={`${new Set(rows.map((row) => row.faculty)).size}`} detail="Faculties represented" tone="purple" icon={GraduationCap} />
      <KpiCard label="At risk" value={`${rows.filter((row) => row.status === 'On hold').length}`} detail="Status requires follow-up" tone="amber" icon={CirclePause} />
    </section>

    <div className="module-toolbar student-toolbar">
      <div className="toolbar-search"><Search size={16} /><input value="" readOnly placeholder="Search placement records" aria-label="Search placement records" /></div>
      <div className="toolbar-actions">
        <Button type="button" variant="outline" size="sm" onClick={() => toast.success('Placement export is ready for integration.')}><Download size={14} />Export</Button>
        <Button type="button" size="sm" onClick={() => toast.success('Placement review workflow activated.')}><ClipboardCheck size={14} />Review queue</Button>
      </div>
    </div>

    <Card className="module-table-card student-directory-card">
      <div className="table-card-head">
        <div className="module-title"><div className="module-title-icon module-icon-teal"><MapPin size={19} /></div><div><h2>Placement & status</h2><p>{rows.length} students in the placement pipeline</p></div></div>
        <span className="student-directory-hint">Faculty assignments</span>
      </div>
      <div className="table-responsive">
        <table className="data-table student-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Programme</th>
              <th>Campus</th>
              <th>Faculty</th>
              <th>Year</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => <tr key={row.id}>
              <td><div className="table-person"><span className="table-avatar table-avatar-photo">{row.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><div><strong>{row.name}</strong><small>{row.id}</small></div></div></td>
              <td>{row.programme}</td>
              <td>{row.campus}</td>
              <td>{row.faculty}</td>
              <td>{row.year}</td>
              <td><StudentStatusBadge status={row.status} /></td>
              <td><div className="student-row-actions"><button type="button" className="student-action-button" onClick={() => setSelected(row)}><MapPin size={12} />Assign</button></div></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>

    {selected && <PlacementAssignmentModal student={selected} onClose={() => setSelected(null)} onSave={assignPlacement} />}
  </>
}

export function StudentLifecyclePage() {
  const { can } = useAppContext()
  const [cases, setCases] = useState([
    { id: 'LIF-2041', student: 'Aisha Kato', type: 'Transfer', status: 'Pending', submitted: '14 Aug 2025', approver: 'Academic Registrar', note: 'Transfer from BSc Economics to BSc Computer Science.' },
    { id: 'LIF-2042', student: 'Daniel Muwonge', type: 'Leave of absence', status: 'In review', submitted: '11 Aug 2025', approver: 'Student Affairs', note: 'Medical leave request for Semester II 2025.' },
    { id: 'LIF-2043', student: 'Faith Namukasa', type: 'Withdrawal', status: 'Approved', submitted: '08 Aug 2025', approver: 'Institution Head', note: 'Formal withdrawal approved after finance clearance.' },
  ])
  const [selected, setSelected] = useState<null | (typeof cases)[number]>(null)

  if (!can('students.view')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to lifecycle management and approvals.</p></Card>

  const updateCase = (id: string, nextStatus: 'Pending' | 'In review' | 'Approved' | 'Rejected') => {
    setCases((current) => current.map((entry) => entry.id === id ? { ...entry, status: nextStatus } : entry))
    toast.success(`Case ${id} updated to ${nextStatus}.`)
    setSelected(null)
  }

  return <>
    <section className="stats-grid student-kpi-grid" aria-label="Lifecycle summary">
      <KpiCard label="Open cases" value={`${cases.filter((item) => item.status !== 'Approved').length}`} detail="Awaiting decision" tone="blue" icon={ArrowRightLeft} />
      <KpiCard label="Pending" value={`${cases.filter((item) => item.status === 'Pending').length}`} detail="Queued for review" tone="amber" icon={CalendarDays} />
      <KpiCard label="In review" value={`${cases.filter((item) => item.status === 'In review').length}`} detail="Under assessment" tone="teal" icon={CircleAlert} />
      <KpiCard label="Approved" value={`${cases.filter((item) => item.status === 'Approved').length}`} detail="Completed this cycle" tone="purple" icon={Check} />
    </section>

    <div className="module-toolbar student-toolbar">
      <div className="toolbar-search"><Search size={16} /><input value="" readOnly placeholder="Search lifecycle cases" aria-label="Search lifecycle cases" /></div>
      <div className="toolbar-actions">
        <Button type="button" variant="outline" size="sm" onClick={() => toast.success('Lifecycle export is ready for the approval queue.')}><Download size={14} />Export review</Button>
        <Button type="button" size="sm" onClick={() => toast.success('New case intake queue opened.')}><Plus size={14} />New request</Button>
      </div>
    </div>

    <Card className="module-table-card student-directory-card">
      <div className="table-card-head">
        <div className="module-title"><div className="module-title-icon module-icon-teal"><ArrowRightLeft size={19} /></div><div><h2>Lifecycle requests</h2><p>{cases.length} requests in the review pipeline</p></div></div>
        <span className="student-directory-hint">Approval actions</span>
      </div>
      <div className="table-responsive">
        <table className="data-table student-table">
          <thead>
            <tr><th>Case</th><th>Student</th><th>Type</th><th>Submitted</th><th>Status</th><th>Approver</th><th aria-label="Actions" /></tr>
          </thead>
          <tbody>{cases.map((entry) => <tr key={entry.id}><td className="reference-code">{entry.id}</td><td>{entry.student}</td><td>{entry.type}</td><td>{entry.submitted}</td><td><StudentStatusBadge status={entry.status === 'Approved' ? 'Active' : entry.status === 'Rejected' ? 'On hold' : entry.status} /></td><td>{entry.approver}</td><td><div className="student-row-actions"><button type="button" className="student-action-button" onClick={() => setSelected(entry)}><ClipboardCheck size={12} />Review</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </Card>

    {selected && <LifecycleReviewModal caseData={selected} onClose={() => setSelected(null)} onDecision={updateCase} />}
  </>
}

export function StudentDocumentsPage() {
  const { can } = useAppContext()
  const [documents, setDocuments] = useState([
    { id: 'DOC-101', student: 'Aisha Kato', name: 'Identity document', status: 'Verified', updated: '12 Aug 2025', owner: 'Admissions' },
    { id: 'DOC-102', student: 'Daniel Muwonge', name: 'Academic transcript', status: 'Pending', updated: '08 Aug 2025', owner: 'Registry' },
    { id: 'DOC-103', student: 'Faith Namukasa', name: 'Finance clearance', status: 'Received', updated: '05 Aug 2025', owner: 'Accounts' },
  ])
  const [selected, setSelected] = useState<null | (typeof documents)[number]>(null)

  if (!can('students.view')) return <Card className="permission-empty"><div className="permission-empty-icon"><ShieldCheck size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to document verification workflows.</p></Card>

  const updateDocument = (id: string, nextStatus: 'Pending' | 'Received' | 'Verified') => {
    setDocuments((current) => current.map((item) => item.id === id ? { ...item, status: nextStatus, updated: new Date().toLocaleDateString('en-GB') } : item))
    toast.success(`Document ${id} marked as ${nextStatus}.`)
    setSelected(null)
  }

  return <>
    <section className="stats-grid student-kpi-grid" aria-label="Document verification summary">
      <KpiCard label="Verified" value={`${documents.filter((item) => item.status === 'Verified').length}`} detail="Ready for processing" tone="teal" icon={BadgeCheck} />
      <KpiCard label="Received" value={`${documents.filter((item) => item.status === 'Received').length}`} detail="Awaiting review" tone="blue" icon={FileText} />
      <KpiCard label="Pending" value={`${documents.filter((item) => item.status === 'Pending').length}`} detail="Needs upload or review" tone="amber" icon={CircleAlert} />
      <KpiCard label="Review queue" value={`${documents.length}`} detail="Across all students" tone="purple" icon={UsersRound} />
    </section>

    <div className="module-toolbar student-toolbar">
      <div className="toolbar-search"><Search size={16} /><input value="" readOnly placeholder="Search documents" aria-label="Search documents" /></div>
      <div className="toolbar-actions">
        <Button type="button" variant="outline" size="sm" onClick={() => toast.success('Verification report exported.')}><Download size={14} />Export review</Button>
        <Button type="button" size="sm" onClick={() => toast.success('Upload workflow opened.')}><Upload size={14} />Upload file</Button>
      </div>
    </div>

    <Card className="module-table-card student-directory-card">
      <div className="table-card-head">
        <div className="module-title"><div className="module-title-icon module-icon-teal"><FileText size={19} /></div><div><h2>Documents & verification</h2><p>{documents.length} records across student workflow</p></div></div>
        <span className="student-directory-hint">Verification queue</span>
      </div>
      <div className="table-responsive">
        <table className="data-table student-table">
          <thead>
            <tr><th>Student</th><th>Document</th><th>Owner</th><th>Updated</th><th>Status</th><th aria-label="Actions" /></tr>
          </thead>
          <tbody>{documents.map((item) => <tr key={item.id}><td>{item.student}</td><td>{item.name}</td><td>{item.owner}</td><td>{item.updated}</td><td><DocumentStatus status={item.status as StudentProfileData['documents'][number]['status']} /></td><td><div className="student-row-actions"><button type="button" className="student-action-button" onClick={() => setSelected(item)}><Eye size={12} />Review</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </Card>

    {selected && <DocumentReviewModal document={selected} onClose={() => setSelected(null)} onStatusUpdate={updateDocument} />}
  </>
}

function PlacementAssignmentModal({ student, onClose, onSave }: { student: { id: string; name: string; campus: string; faculty: string; programme: string }; onClose: () => void; onSave: (student: { id: string; name: string; campus: string; faculty: string; programme: string }, campus: string, faculty: string) => void }) {
  const [campus, setCampus] = useState(student.campus)
  const [faculty, setFaculty] = useState(student.faculty)
  return <ModalShell title="Assign placement" description={`Update ${student.name}'s campus and faculty assignment.`} onClose={onClose} footer={<><Button variant="ghost" type="button" onClick={onClose}>Cancel</Button><Button type="button" onClick={() => onSave(student, campus, faculty)}>Save placement</Button></>}>
    <form className="modal-form-grid" onSubmit={(event) => { event.preventDefault(); onSave(student, campus, faculty) }}>
      <label>Campus<select value={campus} onChange={(event) => setCampus(event.target.value)}><option>Main campus</option><option>East campus</option><option>North campus</option></select></label>
      <label>Faculty<select value={faculty} onChange={(event) => setFaculty(event.target.value)}><option>Computing</option><option>Business</option><option>Education</option><option>Health sciences</option></select></label>
      <div className="modal-info modal-form-wide"><CircleAlert size={15} /><span>These are preview assignments for the student-management operations layer.</span></div>
    </form>
  </ModalShell>
}

function LifecycleReviewModal({ caseData, onClose, onDecision }: { caseData: { id: string; student: string; type: string; note: string; status: string; approver: string }; onClose: () => void; onDecision: (id: string, nextStatus: 'Pending' | 'In review' | 'Approved' | 'Rejected') => void }) {
  const [decision, setDecision] = useState<'Pending' | 'In review' | 'Approved' | 'Rejected'>('In review')
  return <ModalShell title="Review lifecycle case" description={`Action for ${caseData.student}`} onClose={onClose} footer={<><Button variant="ghost" type="button" onClick={onClose}>Cancel</Button><Button type="button" onClick={() => onDecision(caseData.id, decision)}>Apply decision</Button></>}>
    <div className="student-profile-content">
      <section className="student-profile-section">
        <div className="student-section-heading"><ArrowRightLeft size={16} /><h3>{caseData.type}</h3></div>
        <dl className="student-detail-grid">
          <ProfileField label="Student">{caseData.student}</ProfileField>
          <ProfileField label="Approver">{caseData.approver}</ProfileField>
          <ProfileField label="Status">{caseData.status}</ProfileField>
          <ProfileField label="Notes">{caseData.note}</ProfileField>
        </dl>
      </section>
      <div className="modal-form-grid">
        <label>Decision<select value={decision} onChange={(event) => setDecision(event.target.value as 'Pending' | 'In review' | 'Approved' | 'Rejected')}><option value="Pending">Pending</option><option value="In review">In review</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></label>
      </div>
    </div>
  </ModalShell>
}

function DocumentReviewModal({ document, onClose, onStatusUpdate }: { document: { id: string; student: string; name: string; status: string; updated: string; owner: string }; onClose: () => void; onStatusUpdate: (id: string, nextStatus: 'Pending' | 'Received' | 'Verified') => void }) {
  const [status, setStatus] = useState<'Pending' | 'Received' | 'Verified'>(document.status as 'Pending' | 'Received' | 'Verified')
  return <ModalShell title="Review document" description={`Status action for ${document.name}`} onClose={onClose} footer={<><Button variant="ghost" type="button" onClick={onClose}>Cancel</Button><Button type="button" onClick={() => onStatusUpdate(document.id, status)}>Update status</Button></>}>
    <div className="student-profile-content">
      <section className="student-profile-section">
        <div className="student-section-heading"><FileText size={16} /><h3>{document.name}</h3></div>
        <dl className="student-detail-grid">
          <ProfileField label="Student">{document.student}</ProfileField>
          <ProfileField label="Owner">{document.owner}</ProfileField>
          <ProfileField label="Updated">{document.updated}</ProfileField>
          <ProfileField label="Current status">{document.status}</ProfileField>
        </dl>
      </section>
      <div className="modal-form-grid">
        <label>New status<select value={status} onChange={(event) => setStatus(event.target.value as 'Pending' | 'Received' | 'Verified')}><option value="Pending">Pending</option><option value="Received">Received</option><option value="Verified">Verified</option></select></label>
      </div>
    </div>
  </ModalShell>
}

function StudentStatusBadge({ status }: { status: StudentRecord['status'] | string }) {
  const tone = status === 'Active' || status === 'Approved' ? 'success' : status === 'Graduating' || status === 'Verified' || status === 'In review' ? 'info' : status === 'On hold' || status === 'Rejected' ? 'warning' : 'neutral'
  return <Badge tone={tone}>{status}</Badge>
}

function DocumentStatus({ status }: { status: StudentProfileData['documents'][number]['status'] }) {
  const tone = status === 'Verified' ? 'success' : status === 'Received' ? 'info' : 'warning'
  const Icon = status === 'Verified' ? BadgeCheck : status === 'Received' ? Check : CircleAlert
  return <span className={`student-document-status student-document-status-${status.toLowerCase()}`}><Icon size={13} />{status}</span>
}