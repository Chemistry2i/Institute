import type { SimulationState } from './types'

export const simulationSeed: SimulationState = {
  schemaVersion: 1,
  academicPeriods: [
    { id: 'period-2026-s1', name: '2026 Semester 1', startsOn: '2026-02-02', endsOn: '2026-06-26', status: 'open' },
    { id: 'period-2026-s2', name: '2026 Semester 2', startsOn: '2026-08-03', endsOn: '2026-12-11', status: 'open' },
  ],
  programmes: [
    { id: 'programme-bis', code: 'BIS', title: 'Bachelor of Information Systems', award: 'Bachelor', duration: 3, durationUnit: 'years', studyMode: 'Day', version: 1, status: 'active' },
    { id: 'programme-dba', code: 'DBA', title: 'Diploma in Business Administration', award: 'Diploma', duration: 2, durationUnit: 'years', studyMode: 'Day', version: 1, status: 'active' },
  ],
  courseUnits: [
    { id: 'course-is101', code: 'IS101', title: 'Information Systems Fundamentals', programmeId: 'programme-bis', creditUnits: 4, yearLevel: 1, period: 'Semester 1', compulsory: true, prerequisiteIds: [] },
    { id: 'course-cs105', code: 'CS105', title: 'Programming Principles', programmeId: 'programme-bis', creditUnits: 4, yearLevel: 1, period: 'Semester 1', compulsory: true, prerequisiteIds: [] },
    { id: 'course-bus110', code: 'BUS110', title: 'Business Communication', programmeId: 'programme-bis', creditUnits: 3, yearLevel: 1, period: 'Semester 1', compulsory: true, prerequisiteIds: [] },
    { id: 'course-db202', code: 'DB202', title: 'Database Design', programmeId: 'programme-bis', creditUnits: 4, yearLevel: 2, period: 'Semester 1', compulsory: true, prerequisiteIds: ['course-is101'] },
    { id: 'course-bm101', code: 'BM101', title: 'Principles of Management', programmeId: 'programme-dba', creditUnits: 3, yearLevel: 1, period: 'Semester 1', compulsory: true, prerequisiteIds: [] },
  ],
  applications: [
    { id: 'APP-2026-001', applicantName: 'Amina Noor', email: 'amina.noor@example.test', programmeId: 'programme-bis', intake: 'August 2026', submittedAt: '2026-05-12T09:30:00.000Z', documentsComplete: true, status: 'submitted' },
    { id: 'APP-2026-002', applicantName: 'Daniel Okello', email: 'daniel.okello@example.test', programmeId: 'programme-dba', intake: 'August 2026', submittedAt: '2026-05-16T11:00:00.000Z', documentsComplete: false, status: 'missing_documents' },
    { id: 'APP-2026-003', applicantName: 'Leah Namusoke', email: 'leah.namusoke@example.test', programmeId: 'programme-bis', intake: 'August 2026', submittedAt: '2026-05-20T08:15:00.000Z', documentsComplete: true, status: 'offered' },
  ],
  students: [
    { id: 'student-2025-014', studentNumber: 'SIM-2025-014', fullName: 'Peter Nsubuga', email: 'peter.nsubuga@example.test', programmeId: 'programme-bis', admissionApplicationId: 'APP-2025-014', academicStatus: 'active', admittedAt: '2025-08-18T08:00:00.000Z' },
  ],
  registrations: [
    { id: 'REG-2026-014-S1', studentId: 'student-2025-014', academicPeriodId: 'period-2026-s1', courseUnitIds: ['course-is101', 'course-cs105', 'course-bus110'], status: 'submitted', submittedAt: '2026-01-19T10:15:00.000Z' },
  ],
  teachingSessions: [
    { id: 'SESSION-IS101-01', courseUnitId: 'course-is101', academicPeriodId: 'period-2026-s1', day: 'Monday', startsAt: '09:00', endsAt: '11:00', venue: 'Demo Lecture Room 1', lecturerName: 'Demo Lecturer', status: 'published' },
    { id: 'SESSION-CS105-01', courseUnitId: 'course-cs105', academicPeriodId: 'period-2026-s1', day: 'Wednesday', startsAt: '13:00', endsAt: '15:00', venue: 'Demo Lab 2', lecturerName: 'Demo Lecturer', status: 'published' },
  ],
  attendanceSessions: [
    { id: 'ATT-IS101-01', teachingSessionId: 'SESSION-IS101-01', date: '2026-03-02', present: 21, absent: 3, status: 'recorded' },
    { id: 'ATT-CS105-01', teachingSessionId: 'SESSION-CS105-01', date: '2026-03-04', present: 18, absent: 6, status: 'incomplete' },
  ],
  results: [
    { id: 'RES-IS101-2026-S1', courseUnitId: 'course-is101', academicPeriodId: 'period-2026-s1', lecturerName: 'Demo Lecturer', studentCount: 24, averageMark: 67.4, status: 'submitted', submittedAt: '2026-06-28T14:00:00.000Z' },
  ],
  graduationChecks: [
    { id: 'GRAD-2026-014', studentId: 'student-2025-014', academicRequirements: 'incomplete', financialClearance: 'cleared', libraryClearance: 'pending', status: 'ineligible' },
  ],
}
