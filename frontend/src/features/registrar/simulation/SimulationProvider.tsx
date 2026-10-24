import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { simulationSchema, type ApplicationStatus, type GraduationStatus, type Programme, type RegistrationStatus, type ResultStatus, type SimulationState } from './types'
import { simulationSeed } from './seed'

const STORAGE_KEY = 'acmis:registrar-simulation:v1'

interface NewProgrammeInput {
  code: string
  title: string
  award: Programme['award']
  duration: number
  durationUnit: Programme['durationUnit']
  studyMode: Programme['studyMode']
}

interface NewCourseInput {
  code: string
  title: string
  programmeId: string
  creditUnits: number
  yearLevel: number
  period: string
  compulsory: boolean
}

interface NewApplicationInput {
  applicantName: string
  email: string
  programmeId: string
  intake: string
}

interface SimulationContextValue {
  state: SimulationState
  resetDemo: () => void
  transitionApplication: (id: string, next: ApplicationStatus) => void
  createApplication: (input: NewApplicationInput) => void
  setApplicationDocumentsComplete: (id: string, complete: boolean) => void
  updateStudentStatus: (id: string, status: 'active' | 'deferred' | 'withdrawn' | 'graduated') => void
  transitionRegistration: (id: string, next: RegistrationStatus) => void
  transitionTeachingSession: (id: string, next: 'published' | 'cancelled') => void
  transitionAttendance: (id: string, next: 'recorded' | 'reviewed') => void
  transitionResult: (id: string, next: ResultStatus) => void
  updateGraduationClearance: (id: string, clearance: 'financialClearance' | 'libraryClearance', status: 'pending' | 'cleared') => void
  updateAcademicRequirements: (id: string, status: 'pending' | 'complete' | 'incomplete') => void
  evaluateGraduation: (id: string) => GraduationStatus
  awardGraduation: (id: string) => void
  addProgramme: (input: NewProgrammeInput) => void
  updateProgrammeStatus: (id: string, status: 'active' | 'archived') => void
  addCourseUnit: (input: NewCourseInput) => void
  createRegistration: (studentId: string, academicPeriodId: string, courseUnitIds: string[]) => void
}

const SimulationContext = createContext<SimulationContextValue | null>(null)

function readStoredState(): SimulationState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = simulationSchema.safeParse(JSON.parse(stored) as unknown)
      if (parsed.success) return parsed.data
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return simulationSchema.parse(simulationSeed)
}

const applicationTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  submitted: ['reviewing', 'missing_documents'],
  reviewing: ['missing_documents', 'offered', 'rejected'],
  missing_documents: ['reviewing'],
  offered: ['accepted', 'rejected'],
  accepted: [],
  rejected: [],
}

const registrationTransitions: Record<RegistrationStatus, RegistrationStatus[]> = {
  submitted: ['approved', 'rejected'],
  approved: ['confirmed', 'rejected'],
  confirmed: [],
  rejected: [],
}

const resultTransitions: Record<ResultStatus, ResultStatus[]> = {
  submitted: ['under_review'],
  under_review: ['approved'],
  approved: ['published'],
  published: [],
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState>(readStoredState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = useMemo<SimulationContextValue>(() => ({
    state,
    resetDemo: () => setState(simulationSchema.parse(simulationSeed)),
    transitionApplication: (id, next) => {
      const application = state.applications.find((entry) => entry.id === id)
      if (!application) throw new Error('Application not found in simulation data.')
      if (!applicationTransitions[application.status].includes(next)) throw new Error(`Cannot move application from ${application.status} to ${next}.`)
      if (next === 'offered' && !application.documentsComplete) throw new Error('Complete document verification before issuing an offer.')

      setState((current) => {
        const currentApplication = current.applications.find((entry) => entry.id === id)
        if (!currentApplication || !applicationTransitions[currentApplication.status].includes(next)) return current

        let students = current.students
        let graduationChecks = current.graduationChecks
        let studentId = currentApplication.studentId
        if (next === 'accepted' && !studentId) {
          const sequence = students.length + 1
          studentId = `student-demo-${String(sequence).padStart(3, '0')}`
          students = [...students, {
            id: studentId,
            studentNumber: `SIM-2026-${String(100 + sequence).padStart(3, '0')}`,
            fullName: currentApplication.applicantName,
            email: currentApplication.email,
            programmeId: currentApplication.programmeId,
            admissionApplicationId: currentApplication.id,
            academicStatus: 'active',
            admittedAt: new Date().toISOString(),
          }]
          graduationChecks = [...graduationChecks, {
            id: `GRAD-DEMO-${sequence}`,
            studentId,
            academicRequirements: 'incomplete',
            financialClearance: 'pending',
            libraryClearance: 'pending',
            status: 'ineligible',
          }]
        }

        return {
          ...current,
          students,
          graduationChecks,
          applications: current.applications.map((entry) => entry.id === id
            ? { ...entry, status: next, studentId, decisionNote: next === 'offered' ? 'Offer issued in local simulation' : entry.decisionNote }
            : entry),
        }
      })
    },
    createApplication: (input) => {
      if (!state.programmes.some((programme) => programme.id === input.programmeId && programme.status === 'active')) {
        throw new Error('Select an active programme from the academic structure.')
      }
      const application = simulationSchema.shape.applications.element.parse({
        id: `APP-DEMO-${String(state.applications.length + 1).padStart(3, '0')}`,
        applicantName: input.applicantName.trim(),
        email: input.email.trim(),
        programmeId: input.programmeId,
        intake: input.intake.trim(),
        submittedAt: new Date().toISOString(),
        documentsComplete: false,
        status: 'submitted',
      })
      setState((current) => {
        if (current.applications.some((entry) => entry.email.toLowerCase() === application.email.toLowerCase() && entry.intake === application.intake)) return current
        return { ...current, applications: [...current.applications, application] }
      })
    },
    setApplicationDocumentsComplete: (id, complete) => {
      setState((current) => ({
        ...current,
        applications: current.applications.map((entry) => entry.id === id
          ? { ...entry, documentsComplete: complete, status: complete && entry.status === 'missing_documents' ? 'submitted' : entry.status }
          : entry),
      }))
    },
    updateStudentStatus: (id, academicStatus) => {
      setState((current) => ({
        ...current,
        students: current.students.map((entry) => entry.id === id ? { ...entry, academicStatus } : entry),
      }))
    },
    transitionRegistration: (id, next) => {
      const registration = state.registrations.find((entry) => entry.id === id)
      if (!registration) throw new Error('Registration not found in simulation data.')
      if (!registrationTransitions[registration.status].includes(next)) throw new Error(`Cannot move registration from ${registration.status} to ${next}.`)
      setState((current) => {
        const currentRegistration = current.registrations.find((entry) => entry.id === id)
        if (!currentRegistration || !registrationTransitions[currentRegistration.status].includes(next)) return current
        return { ...current, registrations: current.registrations.map((entry) => entry.id === id ? { ...entry, status: next } : entry) }
      })
    },
    transitionTeachingSession: (id, next) => {
      setState((current) => ({
        ...current,
        teachingSessions: current.teachingSessions.map((entry) => entry.id === id
          ? { ...entry, status: entry.status === 'cancelled' ? 'cancelled' : next }
          : entry),
      }))
    },
    transitionAttendance: (id, next) => {
      setState((current) => ({
        ...current,
        attendanceSessions: current.attendanceSessions.map((entry) => entry.id === id
          ? { ...entry, status: entry.status === 'reviewed' ? 'reviewed' : next }
          : entry),
      }))
    },
    transitionResult: (id, next) => {
      const result = state.results.find((entry) => entry.id === id)
      if (!result) throw new Error('Result submission not found in simulation data.')
      if (!resultTransitions[result.status].includes(next)) throw new Error(`Cannot move results from ${result.status} to ${next}.`)
      setState((current) => {
        const currentResult = current.results.find((entry) => entry.id === id)
        if (!currentResult || !resultTransitions[currentResult.status].includes(next)) return current
        return { ...current, results: current.results.map((entry) => entry.id === id ? { ...entry, status: next } : entry) }
      })
    },
    updateGraduationClearance: (id, clearance, status) => {
      setState((current) => ({
        ...current,
        graduationChecks: current.graduationChecks.map((entry) => entry.id === id
          ? { ...entry, [clearance]: status, status: entry.status === 'awarded' ? 'awarded' : 'review' }
          : entry),
      }))
    },
    updateAcademicRequirements: (id, status) => {
      setState((current) => ({
        ...current,
        graduationChecks: current.graduationChecks.map((entry) => entry.id === id
          ? { ...entry, academicRequirements: status, status: entry.status === 'awarded' ? 'awarded' : 'review' }
          : entry),
      }))
    },
    evaluateGraduation: (id) => {
      const check = state.graduationChecks.find((entry) => entry.id === id)
      if (!check) throw new Error('Graduation check not found in simulation data.')
      if (check.status === 'awarded') return 'awarded'
      const eligible = check.academicRequirements === 'complete'
        && check.financialClearance === 'cleared'
        && check.libraryClearance === 'cleared'
      const next: GraduationStatus = eligible ? 'eligible' : 'ineligible'
      setState((current) => ({
        ...current,
        graduationChecks: current.graduationChecks.map((entry) => entry.id === id ? { ...entry, status: next } : entry),
      }))
      return next
    },
    awardGraduation: (id) => {
      const check = state.graduationChecks.find((entry) => entry.id === id)
      if (!check || check.status !== 'eligible') throw new Error('Only an eligible graduation check can be awarded.')
      setState((current) => {
        const currentCheck = current.graduationChecks.find((entry) => entry.id === id)
        if (!currentCheck || currentCheck.status !== 'eligible') return current
        return { ...current, graduationChecks: current.graduationChecks.map((entry) => entry.id === id ? { ...entry, status: 'awarded' } : entry) }
      })
    },
    addProgramme: (input) => {
      if (state.programmes.some((programme) => programme.code.toLowerCase() === input.code.trim().toLowerCase())) {
        throw new Error('Programme code must be unique.')
      }
      const programme = simulationSchema.shape.programmes.element.parse({
        id: `programme-demo-${state.programmes.length + 1}`,
        ...input,
        code: input.code.trim().toUpperCase(),
        title: input.title.trim(),
        version: 1,
        status: 'draft',
      })
      setState((current) => {
        if (current.programmes.some((entry) => entry.code.toLowerCase() === programme.code.toLowerCase())) return current
        return { ...current, programmes: [...current.programmes, programme] }
      })
    },
    updateProgrammeStatus: (id, status) => {
      const programme = state.programmes.find((entry) => entry.id === id)
      if (!programme) throw new Error('Programme not found in simulation data.')
      if (programme.status === 'archived') throw new Error('Archived programme versions cannot be reactivated.')
      if (status === 'archived' && state.students.some((student) => student.programmeId === id && student.academicStatus === 'active')) {
        throw new Error('This programme has active students. Preserve its version rather than archiving it.')
      }
      setState((current) => {
        if (!current.programmes.some((entry) => entry.id === id)) return current
        return { ...current, programmes: current.programmes.map((entry) => entry.id === id ? { ...entry, status } : entry) }
      })
    },
    addCourseUnit: (input) => {
      if (!state.programmes.some((programme) => programme.id === input.programmeId)) throw new Error('Select a programme in the simulation catalogue.')
      if (state.courseUnits.some((course) => course.code.toLowerCase() === input.code.trim().toLowerCase())) throw new Error('Course code must be unique.')
      const courseUnit = simulationSchema.shape.courseUnits.element.parse({
        id: `course-demo-${state.courseUnits.length + 1}`,
        ...input,
        code: input.code.trim().toUpperCase(),
        title: input.title.trim(),
        prerequisiteIds: [],
      })
      setState((current) => {
        if (current.courseUnits.some((entry) => entry.code.toLowerCase() === courseUnit.code.toLowerCase())) return current
        return { ...current, courseUnits: [...current.courseUnits, courseUnit] }
      })
    },
    createRegistration: (studentId, academicPeriodId, courseUnitIds) => {
      const student = state.students.find((entry) => entry.id === studentId)
      const period = state.academicPeriods.find((entry) => entry.id === academicPeriodId)
      if (!student || !period || period.status !== 'open') throw new Error('Choose an active student and an open academic period.')
      const courses = courseUnitIds.map((id) => state.courseUnits.find((course) => course.id === id))
      if (courses.length === 0 || courses.some((course) => !course || course.programmeId !== student.programmeId)) throw new Error('Choose at least one course from the student’s programme.')
      if (state.registrations.some((entry) => entry.studentId === studentId && entry.academicPeriodId === academicPeriodId && entry.status !== 'rejected')) throw new Error('This student already has a registration for that period.')
      const registration = simulationSchema.shape.registrations.element.parse({
        id: `REG-DEMO-${state.registrations.length + 1}`,
        studentId,
        academicPeriodId,
        courseUnitIds,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      })
      setState((current) => {
        if (current.registrations.some((entry) => entry.studentId === studentId && entry.academicPeriodId === academicPeriodId && entry.status !== 'rejected')) return current
        return { ...current, registrations: [...current.registrations, registration] }
      })
    },
  }), [state])

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export function useSimulation(): SimulationContextValue {
  const context = useContext(SimulationContext)
  if (!context) throw new Error('useSimulation must be used inside SimulationProvider.')
  return context
}
