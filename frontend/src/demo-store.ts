import { studentProfiles, students, type StudentProfileData, type StudentRecord } from './data'

export type DemoRow = Record<string, string>
export type MatriculatedStudent = { student: StudentRecord; profile: StudentProfileData }

const moduleRowsKey = (path: string) => `tims-demo-rows:${path}`
const studentRecordsKey = 'tims-demo-student-records'
const studentProfilesKey = 'tims-demo-student-profiles'
const matriculatedStudentsKey = 'tims-demo-matriculated-students'
export const demoDataChangedEvent = 'tims-demo-data-changed'

function notifyDemoDataChanged(paths: string[]) {
  window.dispatchEvent(new CustomEvent(demoDataChangedEvent, { detail: { paths } }))
}

export function readModuleRows(path: string, fallback: DemoRow[]): DemoRow[] {
  try {
    const stored = localStorage.getItem(moduleRowsKey(path))
    if (!stored) return fallback
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed) || !parsed.every((row) => row && typeof row === 'object' && typeof row.reference === 'string' && Object.values(row).every((value) => typeof value === 'string'))) return fallback
    return parsed as DemoRow[]
  } catch {
    return fallback
  }
}

export function writeModuleRows(path: string, rows: DemoRow[]) {
  localStorage.setItem(moduleRowsKey(path), JSON.stringify(rows))
  notifyDemoDataChanged([path])
}

export function readMatriculatedStudents(): MatriculatedStudent[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(matriculatedStudentsKey) ?? '[]')
    return Array.isArray(parsed) ? parsed as MatriculatedStudent[] : []
  } catch {
    return []
  }
}

export function addMatriculatedStudent(record: DemoRow) {
  const matriculated = readMatriculatedStudents()
  const name = record.applicant?.trim() || 'New student'
  if (matriculated.some((entry) => entry.student.name.toLowerCase() === name.toLowerCase())) return false

  const studentId = `26/ENR/${String(matriculated.length + 1).padStart(4, '0')}`
  const programme = (record.programme ?? 'Programme pending assignment').split(' · ')[0]
  const student: StudentRecord = {
    id: studentId,
    name,
    programme,
    year: 'Year 1',
    status: 'Active',
    balance: 'UGX 0',
    lastSeen: 'Just enrolled',
  }
  const profile: StudentProfileData = {
    campus: 'Main campus',
    faculty: 'Pending faculty assignment',
    department: 'Pending department assignment',
    semester: 'Semester II · 2026',
    intake: record.programme?.split(' · ').slice(1).join(' · ') || 'Current intake',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Not specified',
    address: '',
    nextOfKin: { name: 'Not provided', relationship: 'Not provided', phone: '', email: '' },
    statusHistory: [{ date: new Date().toLocaleDateString(), status: 'Active', detail: 'Student record created through enrollment and matriculation.' }],
    documents: [],
  }

  const next = [...matriculated, { student, profile }]
  localStorage.setItem(matriculatedStudentsKey, JSON.stringify(next))
  notifyDemoDataChanged(['/students', '/students/directory'])
  return true
}

export function readStudentRecords(): StudentRecord[] {
  const linkedStudents = readMatriculatedStudents().map((entry) => entry.student)
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(studentRecordsKey) ?? 'null')
    if (Array.isArray(stored)) return mergeUniqueStudents([...stored as StudentRecord[], ...linkedStudents])
  } catch {
    // Fall back to the seeded preview register.
  }
  return mergeUniqueStudents([...students, ...linkedStudents])
}

export function readStudentProfiles(): Record<string, StudentProfileData> {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(studentProfilesKey) ?? 'null')
    if (stored && typeof stored === 'object') return { ...studentProfiles, ...stored as Record<string, StudentProfileData>, ...linkedProfiles() }
  } catch {
    // Fall back to the seeded preview profiles.
  }
  return { ...studentProfiles, ...linkedProfiles() }
}

export function writeStudentRecords(records: StudentRecord[], profiles: Record<string, StudentProfileData>) {
  localStorage.setItem(studentRecordsKey, JSON.stringify(records))
  localStorage.setItem(studentProfilesKey, JSON.stringify(profiles))
  notifyDemoDataChanged(['/students', '/students/directory'])
}

function linkedProfiles() {
  return Object.fromEntries(readMatriculatedStudents().map((entry) => [entry.student.id, entry.profile]))
}

function mergeUniqueStudents(records: StudentRecord[]) {
  const seen = new Set<string>()
  return records.filter((record) => {
    const key = record.id.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
