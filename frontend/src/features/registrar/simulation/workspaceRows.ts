import type { SimulationState } from './types'

export interface DemoWorkspaceRow {
  id: string
  cells: string[]
  status: string
  date: string
  searchableText: string
  details: Array<{ label: string; value: string }>
}

function displayStatus(value: string): string {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function dateOnly(value: string): string {
  return value.slice(0, 10)
}

function row(
  id: string,
  cells: string[],
  status: string,
  date: string,
  details: DemoWorkspaceRow['details'],
): DemoWorkspaceRow {
  return { id, cells, status, date: dateOnly(date), searchableText: [id, status, ...cells].join(' ').toLowerCase(), details }
}

export function buildWorkspaceRows(path: string, state: SimulationState): DemoWorkspaceRow[] {
  const programmeName = (id: string) => state.programmes.find((item) => item.id === id)?.title ?? 'Programme unavailable'
  const courseName = (id: string) => state.courseUnits.find((item) => item.id === id)?.title ?? 'Course unavailable'
  const periodName = (id: string) => state.academicPeriods.find((item) => item.id === id)?.name ?? 'Period unavailable'

  switch (path) {
    case '/admissions':
      return state.applications.map((application) => {
        const status = displayStatus(application.status)
        return row(application.id, [application.id, application.applicantName, programmeName(application.programmeId), application.intake, status, dateOnly(application.submittedAt)], status, application.submittedAt, [
          { label: 'Applicant', value: application.applicantName },
          { label: 'Email', value: application.email },
          { label: 'Programme', value: programmeName(application.programmeId) },
          { label: 'Intake', value: application.intake },
          { label: 'Documents', value: application.documentsComplete ? 'Complete' : 'Missing documents' },
          { label: 'Application status', value: status },
        ])
      })
    case '/students':
      return state.students.map((student) => {
        const status = displayStatus(student.academicStatus)
        return row(student.id, [student.studentNumber, student.fullName, programmeName(student.programmeId), 'Main campus (demo)', status, dateOnly(student.admittedAt)], status, student.admittedAt, [
          { label: 'Student number', value: student.studentNumber },
          { label: 'Student name', value: student.fullName },
          { label: 'Email', value: student.email },
          { label: 'Programme', value: programmeName(student.programmeId) },
          { label: 'Academic status', value: status },
        ])
      })
    case '/academics':
      return state.programmes.map((programme) => {
        const status = displayStatus(programme.status)
        const duration = `${programme.duration} ${programme.durationUnit}`
        return row(programme.id, [programme.code, programme.title, programme.award, duration, `Version ${programme.version}`, status], status, '', [
          { label: 'Programme code', value: programme.code },
          { label: 'Programme', value: programme.title },
          { label: 'Award', value: programme.award },
          { label: 'Duration', value: duration },
          { label: 'Study mode', value: programme.studyMode },
          { label: 'Curriculum version', value: String(programme.version) },
          { label: 'Status', value: status },
        ])
      })
    case '/registration':
      return state.registrations.map((registration) => {
        const student = state.students.find((item) => item.id === registration.studentId)
        const status = displayStatus(registration.status)
        const courses = registration.courseUnitIds.map(courseName)
        const creditLoad = registration.courseUnitIds.reduce((total, id) => total + (state.courseUnits.find((course) => course.id === id)?.creditUnits ?? 0), 0)
        return row(registration.id, [student?.fullName ?? 'Student unavailable', programmeName(student?.programmeId ?? ''), periodName(registration.academicPeriodId), String(creditLoad), status, dateOnly(registration.submittedAt)], status, registration.submittedAt, [
          { label: 'Student', value: student?.fullName ?? 'Student unavailable' },
          { label: 'Programme', value: programmeName(student?.programmeId ?? '') },
          { label: 'Academic period', value: periodName(registration.academicPeriodId) },
          { label: 'Course units', value: courses.join(', ') },
          { label: 'Credit load', value: String(creditLoad) },
          { label: 'Status', value: status },
        ])
      })
    case '/timetabling':
      return state.teachingSessions.map((session) => {
        const course = state.courseUnits.find((item) => item.id === session.courseUnitId)
        const status = displayStatus(session.status)
        const time = `${session.day}, ${session.startsAt}–${session.endsAt}`
        return row(session.id, [course?.title ?? 'Course unavailable', programmeName(course?.programmeId ?? ''), session.venue, periodName(session.academicPeriodId), session.lecturerName, status], status, time, [
          { label: 'Course unit', value: course?.title ?? 'Course unavailable' },
          { label: 'Programme', value: programmeName(course?.programmeId ?? '') },
          { label: 'Schedule', value: time },
          { label: 'Venue', value: session.venue },
          { label: 'Lecturer', value: session.lecturerName },
          { label: 'Status', value: status },
        ])
      })
    case '/attendance':
      return state.attendanceSessions.map((attendance) => {
        const session = state.teachingSessions.find((item) => item.id === attendance.teachingSessionId)
        const course = state.courseUnits.find((item) => item.id === session?.courseUnitId)
        const status = displayStatus(attendance.status)
        return row(attendance.id, [course?.title ?? 'Course unavailable', periodName(session?.academicPeriodId ?? ''), attendance.date, session?.lecturerName ?? 'Lecturer unavailable', status, attendance.date], status, attendance.date, [
          { label: 'Course unit', value: course?.title ?? 'Course unavailable' },
          { label: 'Date', value: attendance.date },
          { label: 'Present', value: String(attendance.present) },
          { label: 'Absent', value: String(attendance.absent) },
          { label: 'Register status', value: status },
        ])
      })
    case '/examinations':
      return state.results.map((result) => {
        const course = state.courseUnits.find((item) => item.id === result.courseUnitId)
        const status = displayStatus(result.status)
        return row(result.id, [course?.title ?? 'Course unavailable', programmeName(course?.programmeId ?? ''), periodName(result.academicPeriodId), 'Demo exam session', 'Demo venue', status], status, result.submittedAt, [
          { label: 'Course unit', value: course?.title ?? 'Course unavailable' },
          { label: 'Programme', value: programmeName(course?.programmeId ?? '') },
          { label: 'Academic period', value: periodName(result.academicPeriodId) },
          { label: 'Lecturer', value: result.lecturerName },
          { label: 'Result workflow', value: status },
        ])
      })
    case '/results':
      return state.results.map((result) => {
        const course = state.courseUnits.find((item) => item.id === result.courseUnitId)
        const status = displayStatus(result.status)
        return row(result.id, [course?.title ?? 'Course unavailable', programmeName(course?.programmeId ?? ''), periodName(result.academicPeriodId), result.lecturerName, status, dateOnly(result.submittedAt)], status, result.submittedAt, [
          { label: 'Course unit', value: course?.title ?? 'Course unavailable' },
          { label: 'Programme', value: programmeName(course?.programmeId ?? '') },
          { label: 'Academic period', value: periodName(result.academicPeriodId) },
          { label: 'Submitted by', value: result.lecturerName },
          { label: 'Students', value: String(result.studentCount) },
          { label: 'Average mark', value: String(result.averageMark) },
          { label: 'Status', value: status },
        ])
      })
    case '/graduation':
      return state.graduationChecks.map((check) => {
        const student = state.students.find((item) => item.id === check.studentId)
        const status = displayStatus(check.status)
        return row(check.id, [student?.fullName ?? 'Student unavailable', programmeName(student?.programmeId ?? ''), student ? `Programme version ${state.programmes.find((item) => item.id === student.programmeId)?.version ?? 1}` : 'Unavailable', displayStatus(check.academicRequirements), `${displayStatus(check.financialClearance)} / ${displayStatus(check.libraryClearance)}`, status], status, '', [
          { label: 'Student', value: student?.fullName ?? 'Student unavailable' },
          { label: 'Programme', value: programmeName(student?.programmeId ?? '') },
          { label: 'Academic requirements', value: displayStatus(check.academicRequirements) },
          { label: 'Financial clearance', value: displayStatus(check.financialClearance) },
          { label: 'Library clearance', value: displayStatus(check.libraryClearance) },
          { label: 'Graduation status', value: status },
        ])
      })
    case '/reports':
      return [
        { id: 'report-admissions', label: 'Admissions and offer conversion', count: state.applications.length },
        { id: 'report-enrolment', label: 'Student enrolment by programme', count: state.students.length },
        { id: 'report-registration', label: 'Registration status', count: state.registrations.length },
        { id: 'report-results', label: 'Results processing', count: state.results.length },
        { id: 'report-graduation', label: 'Graduation clearance', count: state.graduationChecks.length },
      ].map((report) => row(report.id, [report.label, 'Registrar scope', 'Current demo term', String(report.count), 'Ready in simulation'], 'available', '', [
        { label: 'Report', value: report.label },
        { label: 'Records included', value: String(report.count) },
        { label: 'Source', value: 'Local synthetic simulation dataset' },
      ]))
    default:
      return []
  }
}
