import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Archive, Award, BookOpen, Building2, CalendarDays, Check, ChevronLeft, ChevronRight, CircleAlert, CircleHelp, Clock, CreditCard, Download, Eye, FileText, Filter, GraduationCap, Hash, Landmark, Layers, Link2, Mail, MapPin, MoreHorizontal, Pencil, Phone, Plus, RefreshCw, Search, ShieldCheck, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Badge, Button, Card, EmptyState, ErrorState, KpiCard, KpiSkeleton, Skeleton, TableSkeleton } from './ui'
import { adminNavigationItems, moduleIcons, moduleKpis, moduleRows, navigationItems, pageMeta } from '../data'
import { useAppContext } from '../app-context'
import { addMatriculatedStudent, readModuleRows, writeModuleRows, type DemoRow } from '../demo-store'

type ModuleRow = DemoRow
type ModalMode = 'create' | 'filters' | 'detail' | null
type AcademicFieldType = 'text' | 'number' | 'email' | 'tel' | 'url' | 'date' | 'select' | 'textarea'
type AcademicFieldConfig = {
  key: string
  label: string
  type: AcademicFieldType
  placeholder?: string
  required?: boolean
  options?: string[]
  optionsFrom?: string
  optionFilter?: { key: string; values: string[] }
  dependsOn?: { field: string; sourceField: string; parentField?: string }
  multiple?: boolean
  min?: number
  max?: number
  step?: number
  rows?: number
}
type AcademicWorkspaceConfig = {
  entity: string
  action: string
  fields: AcademicFieldConfig[]
}

const academicWorkspaceConfigs: Record<string, AcademicWorkspaceConfig> = {
  '/academics/institutions': {
    entity: 'institution or campus', action: 'Add institution / campus', fields: [
      { key: 'reference', label: 'Institution / campus code', type: 'text', placeholder: 'e.g. MMI or CAMP-NORTH', required: true },
      { key: 'applicant', label: 'Official name', type: 'text', placeholder: 'Registered institution or campus name', required: true },
      { key: 'institutionType', label: 'Record type', type: 'select', options: ['University', 'Institute', 'College', 'Campus'], required: true },
      { key: 'parentInstitution', label: 'Parent institution', type: 'select', optionsFrom: '/academics/institutions', optionFilter: { key: 'institutionType', values: ['University', 'Institute', 'College'] } },
      { key: 'country', label: 'Country', type: 'text', placeholder: 'e.g. Uganda', required: true },
      { key: 'district', label: 'District / region', type: 'text', placeholder: 'e.g. Kampala' },
      { key: 'location', label: 'City / town', type: 'text', placeholder: 'e.g. Kampala', required: true },
      { key: 'address', label: 'Physical address', type: 'textarea', placeholder: 'Street, building, postal address', rows: 2 },
      { key: 'contactEmail', label: 'Official email', type: 'email', placeholder: 'registrar@institution.ac.ug' },
      { key: 'contactPhone', label: 'Official phone', type: 'tel', placeholder: '+256 ...' },
      { key: 'website', label: 'Website', type: 'url', placeholder: 'https://...' },
      { key: 'registrationNumber', label: 'Accreditation / registration number', type: 'text', placeholder: 'National regulator reference' },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Active', 'Archived'], required: true },
    ],
  },
  '/academics/faculties': {
    entity: 'faculty or school', action: 'Add faculty / school', fields: [
      { key: 'reference', label: 'Faculty code', type: 'text', placeholder: 'e.g. FOC', required: true },
      { key: 'applicant', label: 'Faculty / school name', type: 'text', placeholder: 'Official academic unit name', required: true },
      { key: 'institution', label: 'Institution', type: 'select', optionsFrom: '/academics/institutions', required: true },
      { key: 'campus', label: 'Primary campus', type: 'select', optionsFrom: '/academics/institutions', optionFilter: { key: 'institutionType', values: ['Campus'] }, dependsOn: { field: 'institution', sourceField: 'parentInstitution' }, required: true },
      { key: 'dean', label: 'Dean / school head', type: 'text', placeholder: 'Academic lead name' },
      { key: 'contactEmail', label: 'Faculty email', type: 'email', placeholder: 'faculty@institution.ac.ug' },
      { key: 'office', label: 'Office location', type: 'text', placeholder: 'Building / room' },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Active', 'Archived'], required: true },
    ],
  },
  '/academics/departments': {
    entity: 'department', action: 'Add department', fields: [
      { key: 'reference', label: 'Department code', type: 'text', placeholder: 'e.g. CSC', required: true },
      { key: 'applicant', label: 'Department name', type: 'text', placeholder: 'Official department name', required: true },
      { key: 'faculty', label: 'Parent faculty / school', type: 'select', optionsFrom: '/academics/faculties', required: true },
      { key: 'campus', label: 'Campus', type: 'select', optionsFrom: '/academics/institutions', optionFilter: { key: 'institutionType', values: ['Campus'] }, dependsOn: { field: 'faculty', sourceField: 'parentInstitution', parentField: 'institution' }, required: true },
      { key: 'head', label: 'Head of department', type: 'text', placeholder: 'Academic lead name' },
      { key: 'contactEmail', label: 'Department email', type: 'email', placeholder: 'department@institution.ac.ug' },
      { key: 'office', label: 'Office location', type: 'text', placeholder: 'Building / room' },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Active', 'Archived'], required: true },
    ],
  },
  '/academics/programmes': {
    entity: 'programme', action: 'Create programme', fields: [
      { key: 'reference', label: 'Programme code', type: 'text', placeholder: 'e.g. BSC-CS', required: true },
      { key: 'applicant', label: 'Programme title', type: 'text', placeholder: 'Full award title', required: true },
      { key: 'awardLevel', label: 'Award level', type: 'select', options: ['Certificate', 'Diploma', 'Bachelor', 'Postgraduate Diploma', 'Master', 'Doctorate'], required: true },
      { key: 'faculty', label: 'Faculty / school', type: 'select', optionsFrom: '/academics/faculties', required: true },
      { key: 'department', label: 'Owning department', type: 'select', optionsFrom: '/academics/departments', dependsOn: { field: 'faculty', sourceField: 'faculty' }, required: true },
      { key: 'campus', label: 'Delivery campus', type: 'select', optionsFrom: '/academics/institutions', optionFilter: { key: 'institutionType', values: ['Campus'] }, dependsOn: { field: 'faculty', sourceField: 'parentInstitution', parentField: 'institution' }, required: true },
      { key: 'studyMode', label: 'Study mode', type: 'select', options: ['Day', 'Evening', 'Weekend', 'Distance', 'Blended'], required: true },
      { key: 'durationYears', label: 'Duration (years)', type: 'number', min: 1, max: 12, step: 1, required: true },
      { key: 'totalCredits', label: 'Total credit units', type: 'number', min: 1, step: 1, required: true },
      { key: 'accreditationReference', label: 'Accreditation reference', type: 'text', placeholder: 'Regulator approval / reference' },
      { key: 'description', label: 'Programme description', type: 'textarea', placeholder: 'Purpose, outcomes, or delivery notes', rows: 3 },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Active', 'Archived'], required: true },
    ],
  },
  '/academics/courses': {
    entity: 'course unit', action: 'Add course unit', fields: [
      { key: 'reference', label: 'Course code', type: 'text', placeholder: 'e.g. CSC 101', required: true },
      { key: 'applicant', label: 'Course unit title', type: 'text', placeholder: 'Official course title', required: true },
      { key: 'programme', label: 'Programme', type: 'select', optionsFrom: '/academics/programmes', required: true },
      { key: 'department', label: 'Owning department', type: 'select', optionsFrom: '/academics/departments', dependsOn: { field: 'programme', sourceField: 'faculty', parentField: 'faculty' }, required: true },
      { key: 'creditUnits', label: 'Credit units', type: 'number', min: 0.5, max: 30, step: 0.5, required: true },
      { key: 'yearLevel', label: 'Year / level', type: 'number', min: 1, max: 12, step: 1, required: true },
      { key: 'semester', label: 'Semester', type: 'select', options: ['Semester I', 'Semester II', 'Semester III'], required: true },
      { key: 'courseType', label: 'Course type', type: 'select', options: ['Core', 'Compulsory', 'Elective'], required: true },
      { key: 'prerequisites', label: 'Prerequisite course codes', type: 'textarea', placeholder: 'One course code per line', rows: 2 },
      { key: 'description', label: 'Course description', type: 'textarea', placeholder: 'Course synopsis or learning outcomes', rows: 3 },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Active', 'Archived'], required: true },
    ],
  },
  '/academics/curricula': {
    entity: 'curriculum', action: 'Create curriculum', fields: [
      { key: 'reference', label: 'Curriculum code', type: 'text', placeholder: 'e.g. CUR-BSC-CS-26', required: true },
      { key: 'applicant', label: 'Curriculum name / version', type: 'text', placeholder: 'e.g. BSc Computer Science · 2026', required: true },
      { key: 'programme', label: 'Programme', type: 'select', optionsFrom: '/academics/programmes', required: true },
      { key: 'effectiveYear', label: 'Effective academic year', type: 'select', optionsFrom: '/academics/calendar', required: true },
      { key: 'courseUnits', label: 'Included course units', type: 'select', optionsFrom: '/academics/courses', dependsOn: { field: 'programme', sourceField: 'programme' }, multiple: true, required: true },
      { key: 'totalCredits', label: 'Total credit units', type: 'number', min: 1, step: 1, required: true },
      { key: 'progression', label: 'Progression / graduation requirements', type: 'textarea', placeholder: 'Prerequisites, credit thresholds, or completion rules', rows: 3 },
      { key: 'approvedBy', label: 'Approved by', type: 'text', placeholder: 'Academic authority / board' },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Under review', 'Active', 'Archived'], required: true },
    ],
  },
  '/academics/calendar': {
    entity: 'academic period', action: 'Add academic period', fields: [
      { key: 'reference', label: 'Period code', type: 'text', placeholder: 'e.g. AY-2026 or SEM-I-2026', required: true },
      { key: 'applicant', label: 'Period name', type: 'text', placeholder: 'e.g. Academic year 2026/27', required: true },
      { key: 'periodType', label: 'Period type', type: 'select', options: ['Academic year', 'Semester', 'Trimester', 'Quarter', 'Session'], required: true },
      { key: 'parentPeriod', label: 'Parent academic year', type: 'select', optionsFrom: '/academics/calendar', optionFilter: { key: 'periodType', values: ['Academic year'] } },
      { key: 'startDate', label: 'Period start date', type: 'date', required: true },
      { key: 'endDate', label: 'Period end date', type: 'date', required: true },
      { key: 'registrationStart', label: 'Registration opens', type: 'date' },
      { key: 'registrationEnd', label: 'Registration closes', type: 'date' },
      { key: 'teachingStart', label: 'Teaching starts', type: 'date' },
      { key: 'teachingEnd', label: 'Teaching ends', type: 'date' },
      { key: 'examinationStart', label: 'Examinations start', type: 'date' },
      { key: 'examinationEnd', label: 'Examinations end', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Planning', 'Active', 'Closed', 'Archived'], required: true },
    ],
  },
  '/academics/grading': {
    entity: 'grading system', action: 'Create grading system', fields: [
      { key: 'reference', label: 'Scheme code', type: 'text', placeholder: 'e.g. UG-100', required: true },
      { key: 'applicant', label: 'Grading system name', type: 'text', placeholder: 'e.g. Undergraduate percentage scale', required: true },
      { key: 'awardLevel', label: 'Applicable award level', type: 'select', options: ['Certificate', 'Diploma', 'Bachelor', 'Postgraduate Diploma', 'Master', 'Doctorate'], required: true },
      { key: 'scaleType', label: 'Scale type', type: 'select', options: ['Percentage', 'Letter grade', 'Grade point average', 'Pass / fail'], required: true },
      { key: 'minimumScore', label: 'Minimum score', type: 'number', min: 0, step: 0.01, required: true },
      { key: 'maximumScore', label: 'Maximum score', type: 'number', min: 0, step: 0.01, required: true },
      { key: 'passMark', label: 'Pass mark / minimum GPA', type: 'number', min: 0, step: 0.01, required: true },
      { key: 'gradeBands', label: 'Grade bands', type: 'textarea', placeholder: 'One band per line: grade | min | max | points', rows: 6, required: true },
      { key: 'classificationRules', label: 'Award classification rules', type: 'textarea', placeholder: 'Distinction, merit, honours thresholds, etc.', rows: 3 },
      { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Under review', 'Active', 'Archived'], required: true },
    ],
  },
}

const academicTableFields: Record<string, string[]> = {
  '/academics/institutions': ['reference', 'applicant', 'institutionType', 'parentInstitution', 'location', 'status'],
  '/academics/programmes': ['reference', 'applicant', 'awardLevel', 'faculty', 'department', 'status'],
  '/academics/courses': ['reference', 'applicant', 'programme', 'creditUnits', 'yearLevel', 'status'],
  '/academics/curricula': ['reference', 'applicant', 'programme', 'effectiveYear', 'totalCredits', 'status'],
  '/academics/calendar': ['reference', 'applicant', 'periodType', 'startDate', 'endDate', 'status'],
  '/academics/grading': ['reference', 'applicant', 'awardLevel', 'scaleType', 'status'],
}

function loadAcademicRows(path: string, fallback: ModuleRow[]) {
  const rows = readModuleRows(path, fallback)
  const facultyRows = readModuleRows('/academics/faculties', moduleRows['/academics/faculties'] ?? [])
  const courseRows = readModuleRows('/academics/courses', moduleRows['/academics/courses'] ?? [])
  const facultyByName = new Map<string, string>(facultyRows.map((row): [string, string] => [row.applicant, row.reference]))
  const facultyByReference = new Map<string, ModuleRow>(facultyRows.map((row): [string, ModuleRow] => [row.reference, row]))
  const legacyCampus = (name: string) => name.toLowerCase().includes('east') ? 'CAMP-EAST' : 'CAMP-MAIN'
  const programmeForCourse = (reference: string) => reference.toUpperCase().startsWith('BBA') ? 'BBA' : reference.toUpperCase().startsWith('DCS') ? 'DCS' : 'BSC-CS'
  const departmentForCourse = (reference: string) => reference.toUpperCase().startsWith('BBA') ? 'BM' : 'CS'
  const oldDateRange = (value: string) => {
    const parts = value.split(/\s+[–-]\s+/)
    if (parts.length !== 2) return ['', '']
    const end = new Date(parts[1])
    if (Number.isNaN(end.getTime())) return ['', '']
    const startText = /\d{4}/.test(parts[0]) ? parts[0] : `${parts[0]} ${end.getFullYear()}`
    const start = new Date(startText)
    return Number.isNaN(start.getTime())
      ? ['', '']
      : [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)]
  }
  return rows.map((row) => {
    if (path === '/academics/institutions' && !row.institutionType) {
      const isCampus = row.intake === 'Institution campus'
      const [location = 'Kampala', country = 'Uganda'] = (row.programme ?? 'Kampala, Uganda').split(',').map((part) => part.trim())
      return { ...row, institutionType: isCampus ? 'Campus' : 'University', parentInstitution: isCampus ? 'MMI' : '', country, district: location, location, address: '', contactEmail: '', contactPhone: '', website: '', registrationNumber: '' }
    }
    if (path === '/academics/faculties' && !row.institution) {
      return { ...row, institution: 'MMI', campus: legacyCampus(row.intake ?? ''), dean: '', contactEmail: '', office: '' }
    }
    if (path === '/academics/departments' && !row.faculty) {
      const facultyReference = facultyByName.get(row.programme) ?? 'FOC'
      return { ...row, faculty: facultyReference, campus: legacyCampus(facultyByReference.get(facultyReference)?.intake ?? ''), head: '', contactEmail: '', office: '' }
    }
    if (path === '/academics/programmes' && !row.awardLevel) {
      const facultyReference = facultyByName.get(row.programme) ?? 'FOC'
      const [durationYears = '4', totalCredits = '120'] = (row.intake ?? '').match(/\d+/g) ?? []
      const department = row.reference === 'BBA' ? 'BM' : row.reference === 'BED' ? 'ED' : 'CS'
      return { ...row, awardLevel: row.applicant.toLowerCase().includes('diploma') ? 'Diploma' : 'Bachelor', faculty: facultyReference, department, campus: legacyCampus(facultyByReference.get(facultyReference)?.intake ?? ''), studyMode: 'Day', durationYears, totalCredits, accreditationReference: '', description: '' }
    }
    if (path === '/academics/courses' && !row.creditUnits) {
      const [creditUnits = '3'] = (row.programme ?? '').match(/\d+(?:\.\d+)?/) ?? []
      const yearLevel = (row.intake ?? '').match(/Year\s+(\d+)/i)?.[1] ?? '1'
      const semester = (row.intake ?? '').match(/Semester\s+(I{1,3})/i)?.[0] ?? 'Semester I'
      return { ...row, programme: programmeForCourse(row.reference), department: departmentForCourse(row.reference), creditUnits, yearLevel, semester, courseType: 'Core', prerequisites: '', description: '' }
    }
    if (path === '/academics/curricula' && !row.effectiveYear) {
      const name = row.applicant.toLowerCase()
      const programme = name.includes('business') || row.reference.includes('BBA') ? 'BBA' : name.includes('diploma') || row.reference.includes('DCS') ? 'DCS' : 'BSC-CS'
      const selectedCourses = courseRows.filter((course) => programmeForCourse(course.reference) === programme).map((course) => course.reference).join(',')
      const [totalCredits = '0'] = (row.intake ?? '').match(/\d+/g) ?? []
      return { ...row, programme, effectiveYear: 'AY-2025', courseUnits: selectedCourses, totalCredits, progression: '', approvedBy: '' }
    }
    if (path === '/academics/calendar' && !row.periodType) {
      const periodType = row.reference.startsWith('AY-') ? 'Academic year' : 'Semester'
      const [startDate, endDate] = oldDateRange(row.programme ?? '')
      return { ...row, periodType, parentPeriod: periodType === 'Academic year' ? '' : 'AY-2025', startDate, endDate, registrationStart: '', registrationEnd: '', teachingStart: '', teachingEnd: '', examinationStart: '', examinationEnd: '' }
    }
    if (path === '/academics/grading' && !row.scaleType) {
      const isGpa = row.applicant.toLowerCase().includes('gpa') || row.reference.includes('4PT')
      return { ...row, awardLevel: row.reference.startsWith('DIP') ? 'Diploma' : isGpa ? 'Master' : 'Bachelor', scaleType: isGpa ? 'Grade point average' : 'Percentage', minimumScore: '0', maximumScore: isGpa ? '4' : '100', passMark: isGpa ? '2' : '50', gradeBands: isGpa ? 'A | 3.6 | 4 | 4\nB | 3 | 3.59 | 3\nC | 2 | 2.99 | 2\nF | 0 | 1.99 | 0' : 'A | 80 | 100 | 5\nB | 70 | 79 | 4\nC | 60 | 69 | 3\nD | 50 | 59 | 2\nF | 0 | 49 | 0', classificationRules: '' }
    }
    return row
  })
}

export function ModuleWorkspace({ path, loading = false }: { path: string; loading?: boolean }) {
  const meta = pageMeta[path]
  const Icon = moduleIcons[path]
  const academicConfig = academicWorkspaceConfigs[path]
  const academicFields = academicConfig?.fields
  const academicLabels = academicFields ? Object.fromEntries(academicFields.map((field) => [field.key, field.label])) : undefined
  const referencePaths = [...new Set((academicFields ?? []).flatMap((field) => field.optionsFrom ? [field.optionsFrom] : []))]
  const referenceRows = Object.fromEntries(referencePaths.map((referencePath) => [
    referencePath,
    loadAcademicRows(referencePath, moduleRows[referencePath] ?? []),
  ]))
  const relationLabels = Object.fromEntries(referencePaths.map((referencePath) => [
    referencePath,
    new Map<string, string>((referenceRows[referencePath] as ModuleRow[]).map((row): [string, string] => [row.reference, row.applicant])),
  ]))
  const seededRows = moduleRows[path] ?? []
  const [recordState, setRecordState] = useState(() => ({ path, rows: academicConfig ? loadAcademicRows(path, seededRows) : readModuleRows(path, seededRows) }))
  const rows = recordState.path === path ? recordState.rows : academicConfig ? loadAcademicRows(path, seededRows) : readModuleRows(path, seededRows)
  const kpis = moduleKpis[path] ?? [
    { label: 'Total records', value: `${rows.length * 126 + 238}`, detail: 'Across current workspace', tone: 'blue' as const, icon: Layers },
    { label: 'Needs attention', value: `${Math.max(3, rows.length + 1)}`, detail: 'Requires a follow-up', tone: 'amber' as const, icon: CircleAlert },
    { label: 'Updated today', value: `${rows.length * 18 + 42}`, detail: 'Fresh activity', tone: 'teal' as const, icon: RefreshCw },
    { label: 'Active cycle', value: '2025', detail: 'Semester II', tone: 'purple' as const, icon: CalendarDays },
  ]
  const { can } = useAppContext()
  const permission = path.startsWith('/academics/')
    ? 'academics.view'
    : [...navigationItems, ...adminNavigationItems].find((item) => path === item.href || path.startsWith(`${item.href}/`))?.permission
  const [modal, setModal] = useState<ModalMode>(null)
  const [selectedRow, setSelectedRow] = useState<ModuleRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ModuleRow | null>(null)
  const [selectedReferences, setSelectedReferences] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [page, setPage] = useState(0)
  const [bulkStatus, setBulkStatus] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const selectAllRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
  const pageSize = 10
  const searchTerm = search.trim().toLowerCase()
  const filteredRows = rows.filter((row) => {
    const matchesSearch = Object.values(row).some((value) => value.toLowerCase().includes(searchTerm))
    return matchesSearch && (statusFilter === 'All statuses' || row.status === statusFilter)
  })
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const pageRows = filteredRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  const statusOptions = Array.from(new Set(rows.map((row) => row.status).filter(Boolean)))
  const tableFields = academicFields
    ? (academicTableFields[path] ?? academicFields.map((field) => field.key))
    : [...new Set(rows.flatMap((row) => Object.keys(row)))]
  const getFieldOptions = (field: AcademicFieldConfig, values: ModuleRow) => {
    if (field.options) return field.options.map((label) => ({ value: label, label }))
    if (!field.optionsFrom) return []
    let options = (referenceRows[field.optionsFrom] as ModuleRow[]).filter((row) => (row.status ?? '').toLowerCase() !== 'archived')
    if (field.key === 'parentInstitution' || field.key === 'parentPeriod') options = options.filter((row) => row.reference !== values.reference)
    if (field.optionFilter) options = options.filter((row) => field.optionFilter?.values.includes(row[field.optionFilter.key] ?? ''))
    if (field.dependsOn) {
      const selectedParent = values[field.dependsOn.field]
      const parentField = academicFields?.find((item) => item.key === field.dependsOn?.field)
      const parentRecord = parentField?.optionsFrom
        ? (referenceRows[parentField.optionsFrom] as ModuleRow[]).find((row) => row.reference === selectedParent)
        : undefined
      const relationValue = field.dependsOn.parentField ? parentRecord?.[field.dependsOn.parentField] : selectedParent
      options = relationValue ? options.filter((row) => row[field.dependsOn?.sourceField ?? ''] === relationValue) : []
    }
    return options.map((row) => ({ value: row.reference, label: `${row.applicant} (${row.reference})` }))
  }
  const formatFieldValue = (key: string, value: string) => {
    const field = academicFields?.find((item) => item.key === key)
    if (!field?.optionsFrom || !value) return value || '—'
    const labelMap = relationLabels[field.optionsFrom] as Map<string, string>
    return value.split(',').map((reference) => labelMap.get(reference.trim()) ?? reference.trim()).join(', ')
  }
  const selectedCount = rows.filter((row) => selectedReferences.includes(row.reference)).length
  const allRowsSelected = pageRows.length > 0 && pageRows.every((row) => selectedReferences.includes(row.reference))

  useEffect(() => {
    setRecordState({ path, rows: academicWorkspaceConfigs[path] ? loadAcademicRows(path, moduleRows[path] ?? []) : readModuleRows(path, moduleRows[path] ?? []) })
    setSelectedReferences([])
    setSearch('')
    setStatusFilter('All statuses')
    setPage(0)
  }, [path])
  useEffect(() => setPage(0), [search, statusFilter])
  useEffect(() => {
    const selectedOnPage = pageRows.filter((row) => selectedReferences.includes(row.reference)).length
    if (selectAllRef.current) selectAllRef.current.indeterminate = selectedOnPage > 0 && !allRowsSelected
  }, [pageRows, selectedReferences, allRowsSelected])

  const toggleRowSelection = (reference: string) => setSelectedReferences((current) => current.includes(reference)
    ? current.filter((selectedReference) => selectedReference !== reference)
    : [...current, reference])
  const toggleAllRows = () => {
    const pageReferences = pageRows.map((row) => row.reference)
    setSelectedReferences((current) => allRowsSelected
      ? current.filter((reference) => !pageReferences.includes(reference))
      : [...new Set([...current, ...pageReferences])])
  }

  const persistRows = (nextRows: ModuleRow[]) => {
    try {
      writeModuleRows(path, nextRows)
      setRecordState({ path, rows: nextRows })
      setError(null)
      return true
    } catch {
      setError('Changes could not be saved in this browser. Check available storage and retry.')
      return false
    }
  }

  const createRecord = (record: ModuleRow) => {
    if (rows.some((row) => row.reference === record.reference)) {
      toast.error('That reference is already in use.')
      return
    }
    if (persistRows([record, ...rows])) {
      setModal(null)
      toast.success(`${meta.title} record added to this preview.`)
    }
  }

  const updateRecord = (updated: ModuleRow) => {
    if (!persistRows(rows.map((row) => row.reference === updated.reference ? updated : row))) return
    if (path === '/admissions/matriculation' && updated.status === 'Enrolled') {
      toast.success(addMatriculatedStudent(updated) ? 'Matriculation complete. A student record was created.' : 'This applicant already has a student record.')
    } else {
      toast.success(`${meta.title} record updated.`)
    }
    setModal(null)
  }

  const deleteRecord = (reference: string) => {
    if (academicConfig) {
      setDeleteTarget(rows.find((row) => row.reference === reference) ?? null)
      setModal(null)
      return
    }
    if (!window.confirm(`Delete record ${reference} from this preview?`)) return
    if (persistRows(rows.filter((row) => row.reference !== reference))) {
      setModal(null)
      toast.success('Record removed from this preview.')
    }
  }

  const exportRows = (records: ModuleRow[]) => {
    const content = JSON.stringify({ module: path, exportedAt: new Date().toISOString(), records }, null, 2)
    downloadJson(`${path.split('/').filter(Boolean).join('-') || 'module'}-records.json`, content)
    toast.success(`${records.length} records exported.`)
  }
  const confirmDeleteRecord = () => {
    if (!deleteTarget) return
    if (persistRows(rows.filter((row) => row.reference !== deleteTarget.reference))) {
      toast.success(`${academicConfig?.entity ?? meta.title.toLowerCase()} removed from this preview.`)
      setDeleteTarget(null)
      setSelectedRow(null)
      setModal(null)
    }
  }
  const toggleAcademicStatus = (row: ModuleRow) => {
    const status = (row.status ?? '').toLowerCase() === 'active' ? 'Archived' : 'Active'
    updateRecord({ ...row, status })
  }

  const importRows = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      if (file.size > 2_000_000) throw new Error('Import files must be smaller than 2 MB.')
      const parsed = JSON.parse(await file.text()) as { records?: unknown } | unknown[]
      const incoming = Array.isArray(parsed) ? parsed : (parsed as { records?: unknown }).records
      if (!Array.isArray(incoming) || !incoming.every((row) => row && typeof row === 'object' && typeof (row as ModuleRow).reference === 'string')) {
        throw new Error('Choose a JSON array of records or a TIMS export file.')
      }
      if (!incoming.every((row) => Object.values(row as ModuleRow).every((value) => typeof value === 'string'))) throw new Error('Every imported record field must be text.')
      const existing = new Set(rows.map((row) => row.reference))
      const uniqueRows = (incoming as ModuleRow[]).filter((row) => !existing.has(row.reference))
      if (persistRows([...uniqueRows, ...rows])) toast.success(`${uniqueRows.length} records imported; duplicate references were skipped.`)
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : 'The import file could not be read.')
    } finally {
      event.target.value = ''
    }
  }

  const updateSelectedStatus = () => {
    if (!bulkStatus) return
    const selected = new Set(selectedReferences)
    const updatedRows = rows.map((row) => selected.has(row.reference) ? { ...row, status: bulkStatus } : row)
    if (persistRows(updatedRows)) {
      if (path === '/admissions/matriculation' && bulkStatus === 'Enrolled') {
        const enrolledRows = updatedRows.filter((row) => selected.has(row.reference))
        const createdCount = enrolledRows.filter((row) => addMatriculatedStudent(row)).length
        toast.success(`${createdCount} matriculated applicants added to the Student directory.`)
      }
      toast.success(`${selectedCount} records updated.`)
      setSelectedReferences([])
      setBulkStatus('')
    }
  }

  const refreshData = () => {
    setError(null)
    setRefreshing(true)
    window.setTimeout(() => setRefreshing(false), 500)
  }

  if (permission && !can(permission)) return <PermissionEmpty />
  if (loading || refreshing) return <>
    <div className="stats-grid module-kpi-strip" aria-label={`Loading ${meta.title} metrics`}>{Array.from({ length: 4 }, (_, index) => <KpiSkeleton key={index} />)}</div>
    <div className="module-toolbar" aria-hidden="true"><Skeleton className="skeleton-search" /><div className="toolbar-actions"><Skeleton className="skeleton-toolbar-button" /><Skeleton className="skeleton-toolbar-button" /></div></div>
    <TableSkeleton label={`Loading ${meta.title.toLowerCase()}`} />
  </>
  if (error) return <ErrorState title={`${meta.title} unavailable`} description={error} onRetry={refreshData} />
  const openDetails = (row: ModuleRow) => {
    setSelectedRow(row)
    setModal('detail')
  }

  return <>
    <div className="stats-grid module-kpi-strip">
      {kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
    </div>
    <div className="module-toolbar">
      <label className="toolbar-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${meta.title.toLowerCase()}`} aria-label={`Search ${meta.title}`} /></label>
      <div className="toolbar-actions">
        <Button variant="outline" size="sm" onClick={() => setModal('filters')}><Filter size={15} /> Filters</Button>
        <Button variant="outline" size="sm" onClick={() => importInputRef.current?.click()}><Plus size={15} /> Import</Button>
        <input ref={importInputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => void importRows(event)} aria-label={`Import ${meta.title} JSON file`} />
        <Button size="sm" onClick={() => exportRows(filteredRows)}><Download size={15} /> Export</Button>
        <Button size="sm" onClick={() => setModal('create')}><Plus size={15} /> {academicConfig?.action ?? 'New record'}</Button>
      </div>
    </div>
    {selectedCount > 0 && <div className="bulk-selection-toolbar" aria-live="polite"><span>{selectedCount} selected</span><label className="bulk-status-action"><span>Set status</span><select value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value)}><option value="">Choose status</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label><Button variant="outline" size="sm" disabled={!bulkStatus} onClick={updateSelectedStatus}>Apply</Button><Button variant="outline" size="sm" onClick={() => exportRows(rows.filter((row) => selectedReferences.includes(row.reference)))}><Download size={14} /> Export selected</Button><Button variant="ghost" size="sm" onClick={() => setSelectedReferences([])}>Clear selection</Button></div>}
    <Card className="module-table-card">
      <div className="table-card-head"><div className="module-title"><div className="module-title-icon"><Icon size={19} /></div><div><h2>{meta.title}</h2><p>{rows.length} records · {filteredRows.length} matching filters</p></div></div><button className="card-menu" aria-label="More options" onClick={() => setModal('filters')}><MoreHorizontal size={18} /></button></div>
      {filteredRows.length ? <><div className="table-responsive"><table className="data-table"><thead><tr><th className="bulk-select-cell"><input ref={selectAllRef} type="checkbox" checked={allRowsSelected} onChange={toggleAllRows} aria-label={`Select all records on page ${currentPage + 1}`} /></th>{tableFields.map((header) => <th key={header}>{academicLabels?.[header] ?? (header === 'reference' ? 'Reference' : header[0].toUpperCase() + header.slice(1))}</th>)}<th>Actions</th></tr></thead><tbody>{pageRows.map((row) => <tr key={row.reference}><td className="bulk-select-cell"><input type="checkbox" checked={selectedReferences.includes(row.reference)} onChange={() => toggleRowSelection(row.reference)} aria-label={`Select ${row.reference}`} /></td>{tableFields.map((key) => { const value = row[key] ?? ''; return <td key={key}>{key === 'status' ? <StatusBadge status={value} /> : key === 'applicant' ? <div className="table-person"><span className="table-avatar">{value.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><strong>{value}</strong></div> : <span className={key === 'reference' ? 'reference-code' : ''}>{formatFieldValue(key, value)}</span>}</td> })}<td><div className="student-row-actions"><button type="button" className="student-action-button" onClick={() => openDetails(row)}><Eye size={12} />View / edit</button>{academicConfig && <button type="button" className="student-action-button" onClick={() => toggleAcademicStatus(row)}>{(row.status ?? '').toLowerCase() === 'active' ? <><Archive size={12} />Archive</> : <><Check size={12} />Activate</>}</button>}</div></td></tr>)}</tbody></table></div>
      <div className="table-footer"><span>Showing {filteredRows.length ? currentPage * pageSize + 1 : 0}–{Math.min((currentPage + 1) * pageSize, filteredRows.length)} of {filteredRows.length} matching records</span><div className="pagination"><button aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={15} /></button>{Array.from({ length: pageCount }, (_, index) => <button key={index} className={index === currentPage ? 'page-active' : ''} aria-current={index === currentPage ? 'page' : undefined} onClick={() => setPage(index)}>{index + 1}</button>)}<button aria-label="Next page" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)}><ChevronRight size={15} /></button></div></div></> : <EmptyState title="No matching records" description="Try another search or clear the selected status filter." actionLabel="Clear filters" onAction={() => { setSearch(''); setStatusFilter('All statuses') }} />}
    </Card>
    {modal === 'create' && <FormModal meta={meta} academicConfig={academicConfig} getFieldOptions={getFieldOptions} onClose={() => setModal(null)} onCreate={createRecord} />}
    {modal === 'filters' && <FilterModal statuses={statusOptions} status={statusFilter} onApply={setStatusFilter} onClose={() => setModal(null)} />}
    {modal === 'detail' && selectedRow && <DetailModal row={selectedRow} fields={academicFields} requiredFields={academicFields?.filter((field) => field.required).map((field) => field.key)} getFieldOptions={getFieldOptions} formatFieldValue={formatFieldValue} entity={academicConfig?.entity} onClose={() => setModal(null)} onSave={updateRecord} onDelete={deleteRecord} />}
    {deleteTarget && <ModalShell title={`Delete ${academicConfig?.entity ?? 'record'}?`} description={`This will remove ${deleteTarget.applicant} (${deleteTarget.reference}) from this browser’s preview.`} onClose={() => { setDeleteTarget(null); if (selectedRow) setModal('detail') }} footer={<><Button variant="ghost" onClick={() => { setDeleteTarget(null); if (selectedRow) setModal('detail') }}>Cancel</Button><Button variant="danger" onClick={confirmDeleteRecord}><Archive size={14} />Delete permanently</Button></>}><div className="modal-info"><CircleAlert size={15} /><span>This action only affects the local demo record and cannot be undone.</span></div></ModalShell>}
  </>
}

function StatusBadge({ status }: { status: string }) {
  const tone = status.toLowerCase().includes('missing') || status.toLowerCase().includes('attention') || status.toLowerCase().includes('hold') ? 'warning' : status.toLowerCase().includes('review') || status.toLowerCase().includes('draft') ? 'info' : status.toLowerCase().includes('published') || status.toLowerCase().includes('accepted') || status.toLowerCase().includes('active') || status.toLowerCase().includes('approved') || status.toLowerCase().includes('ready') || status.toLowerCase().includes('clear') || status.toLowerCase().includes('track') || status.toLowerCase().includes('posted') || status.toLowerCase().includes('open') ? 'success' : 'neutral'
  return <Badge tone={tone}>{status}</Badge>
}

export function ModalShell({ title, description, children, onClose, footer, className = '' }: { title: string; description: string; children: ReactNode; onClose: () => void; footer: ReactNode; className?: string }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div className={`workflow-modal ${className}`.trim()} role="dialog" aria-modal="true" aria-labelledby="workflow-modal-title"><div className="workflow-modal-head"><div><div className="eyebrow">Frontend workflow</div><h2 id="workflow-modal-title">{title}</h2><p>{description}</p></div><button className="modal-close" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div><div className="workflow-modal-body">{children}</div><div className="workflow-modal-foot">{footer}</div></div></div>
}

type FieldOption = { value: string; label: string }

function AcademicFieldControl({ field, value, options, onChange, autoFocus = false, disabled = false, showLabel = true }: {
  field: AcademicFieldConfig
  value: string
  options: FieldOption[]
  onChange: (value: string) => void
  autoFocus?: boolean
  disabled?: boolean
  showLabel?: boolean
}) {
  const noOptionsLabel = field.dependsOn
    ? 'Select the parent record first'
    : 'No records available — create a parent record first'
  const control = field.type === 'textarea'
    ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} rows={field.rows ?? 3} required={field.required} disabled={disabled} />
    : field.type === 'select'
      ? <select value={field.multiple ? value.split(',').filter(Boolean) : value} onChange={(event) => onChange(field.multiple ? Array.from(event.target.selectedOptions, (option) => option.value).join(',') : event.target.value)} required={field.required} disabled={disabled} multiple={field.multiple}>
        {!field.multiple && <option value="">{field.optionsFrom ? noOptionsLabel : 'Select an option'}</option>}
        {field.multiple && options.length === 0 && <option disabled>{noOptionsLabel}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      : <input type={field.type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} min={field.min} max={field.max} step={field.step} autoFocus={autoFocus} required={field.required} disabled={disabled} />
  return showLabel
    ? <label className={field.key === 'applicant' || field.type === 'textarea' || field.multiple ? 'modal-form-wide' : ''}>{field.label}{control}</label>
    : control
}

export function FormModal({ meta, academicConfig, getFieldOptions, onClose, onCreate }: { meta: { title: string }; academicConfig?: AcademicWorkspaceConfig; getFieldOptions: (field: AcademicFieldConfig, values: ModuleRow) => FieldOption[]; onClose: () => void; onCreate: (record: ModuleRow) => void }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fields = academicConfig?.fields ?? [
    { key: 'reference', label: 'Reference ID', type: 'text', placeholder: 'Generated if left blank' },
    { key: 'applicant', label: 'Record name', type: 'text', placeholder: 'Enter a name or title', required: true },
    { key: 'programme', label: 'Programme or category', type: 'text', placeholder: 'Programme, department, or category' },
    { key: 'intake', label: 'Period or context', type: 'text', placeholder: 'Intake, term, or effective date' },
    { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Active', 'Archived'], required: true },
  ] satisfies AcademicFieldConfig[]
  const [record, setRecord] = useState<ModuleRow>(() => Object.fromEntries(fields.map((field) => [field.key, field.key === 'status' ? 'Draft' : ''])))
  const update = (key: string, value: string) => setRecord((current) => {
    const next = { ...current, [key]: value }
    fields.filter((field) => field.dependsOn?.field === key).forEach((field) => { next[field.key] = '' })
    return next
  })
  const requiredFields = fields.filter((field) => field.required).map((field) => field.key)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (requiredFields.some((field) => !record[field]?.trim())) {
      setError(academicConfig ? 'Complete the name and required academic details before saving.' : 'Enter a record name before saving.')
      return
    }
    setError('')
    setSaving(true)
    window.setTimeout(() => {
      const cleanRecord: Record<string, string> = Object.fromEntries(Object.entries(record).map(([key, value]) => [key, value.trim()]))
      const reference = cleanRecord.reference || `DEMO-${Date.now()}`
      onCreate({ ...cleanRecord, reference })
      setSaving(false)
    }, 320)
  }
  return <ModalShell title={academicConfig ? `Create ${academicConfig.entity}` : `Create ${meta.title.toLowerCase()} record`} description={academicConfig ? `Add a ${academicConfig.entity} to the academic structure. This preview record is saved in this browser.` : 'Create a preview record. It is stored locally in this browser until API persistence is wired.'} onClose={onClose} footer={<><Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button><Button type="submit" form="module-create-form" loading={saving}><Plus size={14} />{academicConfig ? `Create ${academicConfig.entity}` : 'Create record'}</Button></>}>
    <form id="module-create-form" onSubmit={submit} className="modal-form-grid">{fields.map((field) => <AcademicFieldControl key={field.key} field={field} value={record[field.key] ?? ''} options={getFieldOptions(field, record)} onChange={(value) => update(field.key, value)} autoFocus={field.key === 'applicant'} />)}</form>
    {error && <div className="settings-form-message settings-form-error" role="alert">{error}</div>}
    <div className="modal-info"><CircleHelp size={15} /><span>New records are saved to this browser’s demo workspace and can be exported as JSON. Production use requires permission checks and server persistence.</span></div>
  </ModalShell>
}

export function FilterModal({ onClose, statuses, status, onApply }: { onClose: () => void; statuses: string[]; status: string; onApply: (status: string) => void }) {
  const [selectedStatus, setSelectedStatus] = useState(status)
  return <ModalShell title="Filter workspace" description="Filter the current local record set by status. Use search for other fields." onClose={onClose} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={() => { onApply(selectedStatus); onClose() }}>Apply filters</Button></>}><div className="modal-form-grid"><label>Status<select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}><option>All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label></div></ModalShell>
}

function DetailModal({ row, fields, requiredFields, getFieldOptions, formatFieldValue, entity, onClose, onSave, onDelete }: { row: ModuleRow; fields?: AcademicFieldConfig[]; requiredFields?: string[]; getFieldOptions: (field: AcademicFieldConfig, values: ModuleRow) => FieldOption[]; formatFieldValue: (key: string, value: string) => string; entity?: string; onClose: () => void; onSave: (row: ModuleRow) => void; onDelete: (reference: string) => void }) {
  const [draft, setDraft] = useState<ModuleRow>(() => fields ? Object.fromEntries(fields.map((field) => [field.key, row[field.key] ?? ''])) : row)
  const [editing, setEditing] = useState(false)
  const update = (key: string, value: string) => setDraft((current) => {
    const next = { ...current, [key]: value }
    fields?.filter((field) => field.dependsOn?.field === key).forEach((field) => { next[field.key] = '' })
    return next
  })
  const save = () => {
    if (fields && (requiredFields ?? []).some((field) => !draft[field]?.trim())) {
      toast.error('Complete the name and required academic details before saving.')
      return
    }
    onSave({ ...row, ...draft })
  }
  const footer = <><Button variant="danger" onClick={() => onDelete(row.reference)}><Archive size={14} />Delete</Button><Button variant="ghost" onClick={onClose}>Close</Button>{editing ? <Button onClick={save}><Check size={14} />Save changes</Button> : <Button variant="outline" onClick={() => setEditing(true)}><Pencil size={14} />Edit record</Button>}</>
  if (fields && entity) {
    return <ModalShell title={draft.applicant ?? draft.reference} description={`Review the ${entity} record. Changes are saved to this browser’s preview.`} onClose={onClose} footer={footer} className="academic-structure-detail-modal">
      <div className="academic-detail-summary">
        <div className="academic-detail-entity-icon">{getAcademicEntityIcon(entity)}</div>
        <div className="academic-detail-summary-copy"><span>{entity}</span><strong>{draft.applicant || 'Untitled record'}</strong><small>Record code: {draft.reference || 'Not assigned'}</small></div>
        <div className="academic-detail-summary-status"><StatusBadge status={draft.status ?? 'Draft'} /></div>
      </div>
      <div className="academic-detail-grid">{fields.filter((field) => field.key !== 'reference').map((field) => <div className={`academic-detail-card${field.type === 'textarea' || field.multiple ? ' academic-detail-card-wide' : ''}`} key={field.key}>
        <div className="academic-detail-card-label"><span className="academic-detail-field-icon">{getAcademicFieldIcon(field.key)}</span>{field.label}</div>
        <div className="academic-detail-card-value">{editing
          ? <AcademicFieldControl field={field} value={draft[field.key] ?? ''} options={getFieldOptions(field, draft)} onChange={(value) => update(field.key, value)} disabled={field.key === 'reference'} showLabel={false} />
          : field.key === 'status' ? <StatusBadge status={draft[field.key] ?? ''} /> : formatFieldValue(field.key, draft[field.key] ?? '')}</div>
      </div>)}</div>
    </ModalShell>
  }
  return <ModalShell title={draft.applicant ?? draft.reference} description={`Review and edit the local preview record ${draft.reference}.`} onClose={onClose} footer={footer}>
    <div className="detail-list">{Object.keys(draft).map((key) => {
      return <div className="detail-row" key={key}><span>{key[0].toUpperCase() + key.slice(1)}</span><strong>{editing
        ? <input value={draft[key] ?? ''} onChange={(event) => update(key, event.target.value)} disabled={key === 'reference'} required={key === 'applicant'} />
        : key === 'status' ? <StatusBadge status={draft[key] ?? ''} /> : draft[key]}</strong></div>
    })}</div>
  </ModalShell>
}

function getAcademicEntityIcon(entity: string) {
  if (entity.includes('programme')) return <GraduationCap size={21} />
  if (entity.includes('course')) return <BookOpen size={21} />
  if (entity.includes('curriculum')) return <Layers size={21} />
  if (entity.includes('period')) return <CalendarDays size={21} />
  if (entity.includes('grading')) return <ShieldCheck size={21} />
  if (entity.includes('faculty')) return <Landmark size={21} />
  return <Building2 size={21} />
}

function getAcademicFieldIcon(key: string) {
  if (key === 'reference') return <Hash size={14} />
  if (key === 'applicant' || key === 'description' || key === 'gradeBands' || key === 'progression') return <FileText size={14} />
  if (key.includes('programme') || key === 'awardLevel') return <GraduationCap size={14} />
  if (key.includes('course') || key === 'creditUnits' || key === 'totalCredits') return <CreditCard size={14} />
  if (key.includes('faculty') || key.includes('department') || key === 'dean' || key === 'head') return <Landmark size={14} />
  if (key.toLowerCase().includes('period') || key.toLowerCase().includes('duration')) return <Clock size={14} />
  if (key.toLowerCase().includes('date') || key.toLowerCase().includes('year') || key.toLowerCase().includes('semester')) return <CalendarDays size={14} />
  if (key.toLowerCase().includes('email')) return <Mail size={14} />
  if (key.toLowerCase().includes('phone')) return <Phone size={14} />
  if (key.toLowerCase().includes('website')) return <Link2 size={14} />
  if (key.toLowerCase().includes('location') || key === 'district' || key === 'address') return <MapPin size={14} />
  if (key === 'status') return <ShieldCheck size={14} />
  if (key === 'institution' || key === 'campus' || key === 'parentInstitution') return <Building2 size={14} />
  if (key === 'scaleType' || key === 'minimumScore' || key === 'maximumScore' || key === 'passMark') return <Award size={14} />
  return <FileText size={14} />
}

function PermissionEmpty() {
  return <Card className="permission-empty"><div className="permission-empty-icon"><CircleHelp size={28} /></div><h2>Permission required</h2><p>Your current role does not have access to this workspace. Switch the RBAC preview role or ask an administrator to grant the required permission.</p></Card>
}

function downloadJson(filename: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
