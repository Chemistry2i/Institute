import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { useSimulation } from './SimulationProvider'

const applicationFormSchema = z.object({
  applicantName: z.string().trim().min(2, 'Enter the applicant name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  programmeId: z.string().min(1, 'Select an active programme.'),
  intake: z.string().trim().min(2, 'Enter an intake label.'),
})

const programmeFormSchema = z.object({
  code: z.string().trim().min(2, 'Programme code must have at least 2 characters.'),
  title: z.string().trim().min(3, 'Programme title must have at least 3 characters.'),
  award: z.enum(['Certificate', 'Diploma', 'Bachelor', 'Postgraduate']),
  duration: z.coerce.number().int().positive('Duration must be a positive whole number.'),
  durationUnit: z.enum(['years', 'semesters']),
  studyMode: z.enum(['Day', 'Evening', 'Weekend', 'Part-time']),
})

const courseFormSchema = z.object({
  code: z.string().trim().min(2, 'Course code must have at least 2 characters.'),
  title: z.string().trim().min(3, 'Course title must have at least 3 characters.'),
  programmeId: z.string().min(1, 'Select a programme.'),
  creditUnits: z.coerce.number().positive('Credit units must be greater than zero.'),
  yearLevel: z.coerce.number().int().positive('Year level must be positive.'),
  period: z.string().trim().min(1, 'Enter the teaching period.'),
  compulsory: z.boolean(),
})

const registrationFormSchema = z.object({
  studentId: z.string().min(1, 'Select a student.'),
  academicPeriodId: z.string().min(1, 'Select an open academic period.'),
})

interface SimulationCreateActionsProps {
  path: string
  onMessage: (message: string) => void
}

export function SimulationCreateActions({ path, onMessage }: SimulationCreateActionsProps) {
  const simulation = useSimulation()
  const [applicationOpen, setApplicationOpen] = useState(false)
  const [programmeOpen, setProgrammeOpen] = useState(false)
  const [courseOpen, setCourseOpen] = useState(false)
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [courseIds, setCourseIds] = useState<string[]>([])

  const applicationForm = useForm<z.input<typeof applicationFormSchema>, unknown, z.output<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: { applicantName: '', email: '', programmeId: '', intake: 'August 2026' },
  })
  const programmeForm = useForm<z.input<typeof programmeFormSchema>, unknown, z.output<typeof programmeFormSchema>>({
    resolver: zodResolver(programmeFormSchema),
    defaultValues: { code: '', title: '', award: 'Bachelor', duration: 3, durationUnit: 'years', studyMode: 'Day' },
  })
  const courseForm = useForm<z.input<typeof courseFormSchema>, unknown, z.output<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: { code: '', title: '', programmeId: '', creditUnits: 3, yearLevel: 1, period: 'Semester 1', compulsory: true },
  })
  const registrationForm = useForm<z.input<typeof registrationFormSchema>, unknown, z.output<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: { studentId: '', academicPeriodId: '' },
  })

  const activeProgrammes = simulation.state.programmes.filter((programme) => programme.status === 'active')
  const students = simulation.state.students.filter((student) => student.academicStatus === 'active')
  const openPeriods = simulation.state.academicPeriods.filter((period) => period.status === 'open')
  const selectedProgrammeId = courseForm.watch('programmeId')
  const availableCourses = simulation.state.courseUnits.filter((course) => course.programmeId === selectedProgrammeId)

  if (path === '/admissions') {
    return (
      <Dialog open={applicationOpen} onOpenChange={setApplicationOpen}>
        <DialogTrigger asChild><Button size="sm"><Plus size={14} aria-hidden="true" />New application</Button></DialogTrigger>
        <DialogContent aria-describedby="application-demo-description">
          <DialogHeader><DialogTitle>New demo application</DialogTitle><DialogDescription id="application-demo-description">Adds a synthetic application to this browser’s local simulation.</DialogDescription></DialogHeader>
          <form className="simulation-form" onSubmit={applicationForm.handleSubmit((values) => {
            try {
              simulation.createApplication(values)
              onMessage('Application submitted to the local simulation queue.')
              applicationForm.reset({ applicantName: '', email: '', programmeId: '', intake: 'August 2026' })
              setApplicationOpen(false)
            } catch (error) {
              applicationForm.setError('root', { message: error instanceof Error ? error.message : 'Application could not be created.' })
            }
          })}>
            <label className="simulation-field">Applicant name<input {...applicationForm.register('applicantName')} /></label>
            {applicationForm.formState.errors.applicantName && <span className="simulation-field-error">{applicationForm.formState.errors.applicantName.message}</span>}
            <label className="simulation-field">Email<input type="email" {...applicationForm.register('email')} /></label>
            {applicationForm.formState.errors.email && <span className="simulation-field-error">{applicationForm.formState.errors.email.message}</span>}
            <label className="simulation-field">Programme
              <Controller control={applicationForm.control} name="programmeId" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="Application programme"><SelectValue placeholder="Select active programme" /></SelectTrigger>
                  <SelectContent>{activeProgrammes.map((programme) => <SelectItem key={programme.id} value={programme.id}>{programme.code} · {programme.title}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </label>
            {applicationForm.formState.errors.programmeId && <span className="simulation-field-error">{applicationForm.formState.errors.programmeId.message}</span>}
            <label className="simulation-field">Intake<input {...applicationForm.register('intake')} /></label>
            {applicationForm.formState.errors.intake && <span className="simulation-field-error">{applicationForm.formState.errors.intake.message}</span>}
            {applicationForm.formState.errors.root && <span className="simulation-field-error">{applicationForm.formState.errors.root.message}</span>}
            <DialogFooter><Button variant="outline" type="button" onClick={() => setApplicationOpen(false)}>Cancel</Button><Button type="submit">Submit demo application</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  if (path === '/academics') {
    return (
      <div className="simulation-create-actions">
        <Dialog open={programmeOpen} onOpenChange={setProgrammeOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus size={14} aria-hidden="true" />New programme</Button></DialogTrigger>
          <DialogContent aria-describedby="programme-demo-description">
            <DialogHeader><DialogTitle>Create demo programme</DialogTitle><DialogDescription id="programme-demo-description">Duration and study mode are editable simulation settings. A new programme begins as a draft.</DialogDescription></DialogHeader>
            <form className="simulation-form" onSubmit={programmeForm.handleSubmit((values) => {
              try {
                simulation.addProgramme(values)
                onMessage('Programme added as a draft in the local simulation.')
                programmeForm.reset()
                setProgrammeOpen(false)
              } catch (error) {
                programmeForm.setError('root', { message: error instanceof Error ? error.message : 'Programme could not be created.' })
              }
            })}>
              <div className="simulation-form-grid">
                <label className="simulation-field">Programme code<input {...programmeForm.register('code')} /></label>
                <label className="simulation-field">Programme title<input {...programmeForm.register('title')} /></label>
                <label className="simulation-field">Award
                  <Controller control={programmeForm.control} name="award" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}><SelectTrigger aria-label="Programme award"><SelectValue /></SelectTrigger><SelectContent>{['Certificate', 'Diploma', 'Bachelor', 'Postgraduate'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                  )} />
                </label>
                <label className="simulation-field">Duration<input type="number" min="1" {...programmeForm.register('duration')} /></label>
                <label className="simulation-field">Duration unit
                  <Controller control={programmeForm.control} name="durationUnit" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}><SelectTrigger aria-label="Duration unit"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="years">Years</SelectItem><SelectItem value="semesters">Semesters</SelectItem></SelectContent></Select>
                  )} />
                </label>
                <label className="simulation-field">Study mode
                  <Controller control={programmeForm.control} name="studyMode" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}><SelectTrigger aria-label="Programme study mode"><SelectValue /></SelectTrigger><SelectContent>{['Day', 'Evening', 'Weekend', 'Part-time'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
                  )} />
                </label>
              </div>
              {Object.values(programmeForm.formState.errors).map((error) => error?.message && <span className="simulation-field-error" key={error.message}>{error.message}</span>)}
              <DialogFooter><Button variant="outline" type="button" onClick={() => setProgrammeOpen(false)}>Cancel</Button><Button type="submit">Save draft programme</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={courseOpen} onOpenChange={setCourseOpen}>
          <DialogTrigger asChild><Button variant="outline" size="sm"><Plus size={14} aria-hidden="true" />New course unit</Button></DialogTrigger>
          <DialogContent aria-describedby="course-demo-description">
            <DialogHeader><DialogTitle>Create demo course unit</DialogTitle><DialogDescription id="course-demo-description">Course units are linked to a programme in the local simulation.</DialogDescription></DialogHeader>
            <form className="simulation-form" onSubmit={courseForm.handleSubmit((values) => {
              try {
                simulation.addCourseUnit(values)
                onMessage('Course unit added to the local simulation.')
                courseForm.reset()
                setCourseOpen(false)
              } catch (error) {
                courseForm.setError('root', { message: error instanceof Error ? error.message : 'Course unit could not be created.' })
              }
            })}>
              <div className="simulation-form-grid">
                <label className="simulation-field">Course code<input {...courseForm.register('code')} /></label>
                <label className="simulation-field">Course title<input {...courseForm.register('title')} /></label>
                <label className="simulation-field">Programme
                  <Controller control={courseForm.control} name="programmeId" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}><SelectTrigger aria-label="Course programme"><SelectValue placeholder="Select programme" /></SelectTrigger><SelectContent>{simulation.state.programmes.map((programme) => <SelectItem key={programme.id} value={programme.id}>{programme.code} · {programme.title}</SelectItem>)}</SelectContent></Select>
                  )} />
                </label>
                <label className="simulation-field">Credit units<input type="number" min="0.5" step="0.5" {...courseForm.register('creditUnits')} /></label>
                <label className="simulation-field">Year level<input type="number" min="1" {...courseForm.register('yearLevel')} /></label>
                <label className="simulation-field">Teaching period<input {...courseForm.register('period')} /></label>
              </div>
              <label className="simulation-checkbox"><input type="checkbox" {...courseForm.register('compulsory')} />Compulsory course unit</label>
              {Object.values(courseForm.formState.errors).map((error) => error?.message && <span className="simulation-field-error" key={error.message}>{error.message}</span>)}
              <DialogFooter><Button variant="outline" type="button" onClick={() => setCourseOpen(false)}>Cancel</Button><Button type="submit">Add course unit</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (path === '/registration') {
    return (
      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogTrigger asChild><Button size="sm"><Plus size={14} aria-hidden="true" />New registration</Button></DialogTrigger>
        <DialogContent aria-describedby="registration-demo-description">
          <DialogHeader><DialogTitle>Start demo registration</DialogTitle><DialogDescription id="registration-demo-description">Choose an active student, an open period, and course units from that student’s programme.</DialogDescription></DialogHeader>
          <form className="simulation-form" onSubmit={registrationForm.handleSubmit((values) => {
            try {
              simulation.createRegistration(values.studentId, values.academicPeriodId, courseIds)
              onMessage('Registration submitted in the local simulation.')
              registrationForm.reset()
              setCourseIds([])
              setRegistrationOpen(false)
            } catch (error) {
              registrationForm.setError('root', { message: error instanceof Error ? error.message : 'Registration could not be created.' })
            }
          })}>
            <label className="simulation-field">Student
              <Controller control={registrationForm.control} name="studentId" render={({ field }) => (
                <Select value={field.value} onValueChange={(value) => { field.onChange(value); setCourseIds([]) }}><SelectTrigger aria-label="Registration student"><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{students.map((student) => <SelectItem key={student.id} value={student.id}>{student.studentNumber} · {student.fullName}</SelectItem>)}</SelectContent></Select>
              )} />
            </label>
            <label className="simulation-field">Academic period
              <Controller control={registrationForm.control} name="academicPeriodId" render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}><SelectTrigger aria-label="Registration academic period"><SelectValue placeholder="Select open period" /></SelectTrigger><SelectContent>{openPeriods.map((period) => <SelectItem key={period.id} value={period.id}>{period.name}</SelectItem>)}</SelectContent></Select>
              )} />
            </label>
            <fieldset className="simulation-course-picker"><legend>Course units</legend>{availableCourses.map((course) => (
              <label key={course.id}><input type="checkbox" checked={courseIds.includes(course.id)} onChange={(event) => setCourseIds((current) => event.target.checked ? [...current, course.id] : current.filter((id) => id !== course.id))} />{course.code} · {course.title} ({course.creditUnits} CU)</label>
            ))}{availableCourses.length === 0 && <span>Select a student to list eligible programme courses.</span>}</fieldset>
            {Object.values(registrationForm.formState.errors).map((error) => error?.message && <span className="simulation-field-error" key={error.message}>{error.message}</span>)}
            {registrationForm.formState.errors.root && <span className="simulation-field-error">{registrationForm.formState.errors.root.message}</span>}
            <DialogFooter><Button variant="outline" type="button" onClick={() => setRegistrationOpen(false)}>Cancel</Button><Button type="submit">Submit registration</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}
