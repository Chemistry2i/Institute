import { z } from 'zod'

export const applicationStatuses = [
  'submitted',
  'reviewing',
  'missing_documents',
  'offered',
  'accepted',
  'rejected',
] as const

export const registrationStatuses = ['submitted', 'approved', 'confirmed', 'rejected'] as const
export const resultStatuses = ['submitted', 'under_review', 'approved', 'published'] as const
export const graduationStatuses = ['review', 'eligible', 'awarded', 'ineligible'] as const

const academicPeriodSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  startsOn: z.string(),
  endsOn: z.string(),
  status: z.enum(['open', 'closed']),
})

const programmeSchema = z.object({
  id: z.string(),
  code: z.string().min(2),
  title: z.string().min(2),
  award: z.enum(['Certificate', 'Diploma', 'Bachelor', 'Postgraduate']),
  duration: z.number().int().positive(),
  durationUnit: z.enum(['years', 'semesters']),
  studyMode: z.enum(['Day', 'Evening', 'Weekend', 'Part-time']),
  version: z.number().int().positive(),
  status: z.enum(['draft', 'active', 'archived']),
})

const courseUnitSchema = z.object({
  id: z.string(),
  code: z.string().min(2),
  title: z.string().min(2),
  programmeId: z.string(),
  creditUnits: z.number().positive(),
  yearLevel: z.number().int().positive(),
  period: z.string(),
  compulsory: z.boolean(),
  prerequisiteIds: z.array(z.string()),
})

const applicationSchema = z.object({
  id: z.string(),
  applicantName: z.string().min(2),
  email: z.string().email(),
  programmeId: z.string(),
  intake: z.string(),
  submittedAt: z.string(),
  documentsComplete: z.boolean(),
  status: z.enum(applicationStatuses),
  decisionNote: z.string().optional(),
  studentId: z.string().optional(),
})

const studentSchema = z.object({
  id: z.string(),
  studentNumber: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  programmeId: z.string(),
  admissionApplicationId: z.string(),
  academicStatus: z.enum(['active', 'deferred', 'withdrawn', 'graduated']),
  admittedAt: z.string(),
})

const registrationSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  academicPeriodId: z.string(),
  courseUnitIds: z.array(z.string()),
  status: z.enum(registrationStatuses),
  submittedAt: z.string(),
})

const resultSchema = z.object({
  id: z.string(),
  courseUnitId: z.string(),
  academicPeriodId: z.string(),
  lecturerName: z.string(),
  studentCount: z.number().int().nonnegative(),
  averageMark: z.number().min(0).max(100),
  status: z.enum(resultStatuses),
  submittedAt: z.string(),
})

const teachingSessionSchema = z.object({
  id: z.string(),
  courseUnitId: z.string(),
  academicPeriodId: z.string(),
  day: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  venue: z.string(),
  lecturerName: z.string(),
  status: z.enum(['scheduled', 'published', 'cancelled']),
})

const attendanceSessionSchema = z.object({
  id: z.string(),
  teachingSessionId: z.string(),
  date: z.string(),
  present: z.number().int().nonnegative(),
  absent: z.number().int().nonnegative(),
  status: z.enum(['incomplete', 'recorded', 'reviewed']),
})

const graduationCheckSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  academicRequirements: z.enum(['pending', 'complete', 'incomplete']),
  financialClearance: z.enum(['pending', 'cleared']),
  libraryClearance: z.enum(['pending', 'cleared']),
  status: z.enum(graduationStatuses),
})

export const simulationSchema = z.object({
  schemaVersion: z.literal(1),
  academicPeriods: z.array(academicPeriodSchema),
  programmes: z.array(programmeSchema),
  courseUnits: z.array(courseUnitSchema),
  applications: z.array(applicationSchema),
  students: z.array(studentSchema),
  registrations: z.array(registrationSchema),
  teachingSessions: z.array(teachingSessionSchema),
  attendanceSessions: z.array(attendanceSessionSchema),
  results: z.array(resultSchema),
  graduationChecks: z.array(graduationCheckSchema),
})

export type ApplicationStatus = (typeof applicationStatuses)[number]
export type RegistrationStatus = (typeof registrationStatuses)[number]
export type ResultStatus = (typeof resultStatuses)[number]
export type GraduationStatus = (typeof graduationStatuses)[number]
export type SimulationState = z.infer<typeof simulationSchema>
export type Programme = SimulationState['programmes'][number]
export type CourseUnit = SimulationState['courseUnits'][number]
