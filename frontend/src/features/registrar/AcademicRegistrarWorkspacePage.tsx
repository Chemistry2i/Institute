
import { useState } from 'react'
import {
	ArrowRight,
	ArrowDownUp,
	Award,
	BookOpenCheck,
	CalendarCheck2,
	CalendarDays,
	ClipboardCheck,
	ClipboardList,
	Download,
	Eye,
	FileCheck2,
	GraduationCap,
	Search,
	X,
	UsersRound,
} from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { navigationItems, type NavigationItem } from '../../config/navigation'
import { hasAnyPermission } from '../../config/access'
import type { Permission } from '../../config/roles'
import type { AppShellContext } from '../../components/layout/AppShell'
import { MetricCard } from '../dashboard/MetricCard'
import { useSimulation } from './simulation/SimulationProvider'
import { buildWorkspaceRows, type DemoWorkspaceRow } from './simulation/workspaceRows'
import { SimulationRecordDialog, type SimulationAction } from './simulation/SimulationRecordDialog'
import type { SimulationState } from './simulation/types'
import { SimulationCreateActions } from './simulation/SimulationCreateActions'
import { Button } from '../../components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import './AcademicRegistrarWorkspacePage.css'

interface WorkspaceDefinition {
	eyebrow: string
	title: string
	description: string
	icon: LucideIcon
	metrics: [string, string, string, string]
	tableTitle: string
	columns: string[]
	emptyTitle: string
	emptyDescription: string
	workflow?: string[]
	statusOptions?: string[]
	exportFormats?: string[]
	primaryAction?: { label: string; permission: Permission }
	relatedPath?: string
	relatedAction?: string
}

const workspaces: Record<string, WorkspaceDefinition> = {
	'/admissions': {
		eyebrow: 'Applicant lifecycle',
		title: 'Admissions review',
		description: 'Review applications, verify supporting documents, and follow configured decision approvals.',
		icon: ClipboardList,
		metrics: ['Applications received', 'Awaiting review', 'Missing documents', 'Offers awaiting response'],
		tableTitle: 'Application queue',
		columns: ['Application', 'Applicant', 'Programme', 'Intake', 'Status', 'Updated'],
		emptyTitle: 'No applications loaded',
		emptyDescription: 'Applications will appear here when the admissions service is connected.',
		workflow: ['Submitted', 'Verification', 'Decision review', 'Offer', 'Acceptance'],
		statusOptions: ['Submitted', 'Verification', 'Decision review', 'Offer issued', 'Accepted', 'Declined'],
		primaryAction: { label: 'Record decision', permission: 'admissions.decide' },
		relatedPath: '/students',
		relatedAction: 'Student records',
	},
	'/students': {
		eyebrow: 'Academic records',
		title: 'Student records',
		description: 'Review student identity, programme enrolment, status history, and assigned academic scope.',
		icon: UsersRound,
		metrics: ['Active student records', 'Records to verify', 'Status changes pending', 'Readmission requests'],
		tableTitle: 'Student register',
		columns: ['Student number', 'Student name', 'Programme', 'Campus', 'Academic status', 'Updated'],
		emptyTitle: 'No student records loaded',
		emptyDescription: 'Student records will be loaded from the authenticated student service.',
		workflow: ['Identity verification', 'Programme enrolment', 'Academic status', 'History review'],
		statusOptions: ['Active', 'Deferred', 'Transferred', 'Withdrawn', 'Graduated'],
		primaryAction: { label: 'Update status', permission: 'students.manage' },
		relatedPath: '/registration',
		relatedAction: 'Semester registration',
	},
	'/academics': {
		eyebrow: 'Institution configuration',
		title: 'Academic structure',
		description: 'Maintain academic periods, faculties, departments, programmes, curriculum versions, and course offerings.',
		icon: BookOpenCheck,
		metrics: ['Academic periods', 'Programmes', 'Curriculum versions', 'Course offerings'],
		tableTitle: 'Academic structure',
		columns: ['Record', 'Campus', 'Faculty / department', 'Academic period', 'Status', 'Updated'],
		emptyTitle: 'Academic structure not configured',
		emptyDescription: 'Create structure only after the institution confirms its periods, programme versions, and academic policies.',
		workflow: ['Academic periods', 'Faculties and departments', 'Programmes', 'Curriculum versions', 'Course offerings'],
		statusOptions: ['Draft', 'Under review', 'Approved', 'Archived'],
		primaryAction: { label: 'Manage structure', permission: 'academics.manage' },
		relatedPath: '/settings',
		relatedAction: 'Academic policy settings',
	},
	'/registration': {
		eyebrow: 'Student progression',
		title: 'Registration management',
		description: 'Monitor period registration, course eligibility, add/drop requests, approvals, and class-list readiness.',
		icon: CalendarCheck2,
		metrics: ['Registrations submitted', 'Awaiting approval', 'Course selections to review', 'Unconfirmed registrations'],
		tableTitle: 'Registration queue',
		columns: ['Student', 'Programme', 'Academic period', 'Credits', 'Registration status', 'Submitted'],
		emptyTitle: 'No registration requests loaded',
		emptyDescription: 'Registration requests will appear here when the registration service is connected.',
		workflow: ['Draft', 'Submitted', 'Eligibility review', 'Approved', 'Confirmed'],
		statusOptions: ['Draft', 'Submitted', 'Under review', 'Approved', 'Confirmed', 'Rejected'],
		primaryAction: { label: 'Review registrations', permission: 'registration.review' },
		relatedPath: '/academics',
		relatedAction: 'Academic structure',
	},
	'/timetabling': {
		eyebrow: 'Academic delivery',
		title: 'Timetabling',
		description: 'Review teaching-period schedules, venue allocations, and timetable conflicts within your scope.',
		icon: CalendarDays,
		metrics: ['Teaching sessions', 'Venue conflicts', 'Schedule changes', 'Unassigned sessions'],
		tableTitle: 'Teaching schedule',
		columns: ['Course unit', 'Programme', 'Venue', 'Teaching period', 'Assigned lecturer', 'Status'],
		emptyTitle: 'No timetable loaded',
		emptyDescription: 'Timetable entries will appear after academic periods and course offerings are configured.',
		workflow: ['Course offering', 'Lecturer assignment', 'Venue allocation', 'Conflict review'],
		statusOptions: ['Draft', 'Scheduled', 'Conflict review', 'Published', 'Cancelled'],
		relatedPath: '/attendance',
		relatedAction: 'Attendance records',
	},
	'/attendance': {
		eyebrow: 'Academic delivery',
		title: 'Attendance oversight',
		description: 'Review attendance sessions, authorised corrections, and course-level attendance summaries.',
		icon: ClipboardCheck,
		metrics: ['Sessions held', 'Registers incomplete', 'Corrections awaiting review', 'Attendance summaries'],
		tableTitle: 'Attendance review',
		columns: ['Course unit', 'Academic period', 'Session date', 'Lecturer', 'Register status', 'Updated'],
		emptyTitle: 'No attendance records loaded',
		emptyDescription: 'Attendance data will appear here from the teaching and attendance services.',
		workflow: ['Scheduled session', 'Attendance recorded', 'Correction requested', 'Authorised review'],
		statusOptions: ['Scheduled', 'Register incomplete', 'Recorded', 'Correction requested', 'Reviewed'],
		relatedPath: '/reports',
		relatedAction: 'Academic reports',
	},
	'/examinations': {
		eyebrow: 'Assessment administration',
		title: 'Examination processing',
		description: 'Coordinate examination sessions, mark submission windows, missing marks, and moderation readiness.',
		icon: GraduationCap,
		metrics: ['Examination sessions', 'Missing mark lists', 'Submissions in review', 'Publication readiness'],
		tableTitle: 'Examination sessions',
		columns: ['Course unit', 'Programme', 'Academic period', 'Session', 'Venue', 'Status'],
		emptyTitle: 'No examination sessions loaded',
		emptyDescription: 'Examination schedules and mark submissions will appear when connected to examination services.',
		workflow: ['Assessment configured', 'Marks submitted', 'Moderation', 'Approval', 'Publication'],
		statusOptions: ['Scheduled', 'Marks pending', 'Under moderation', 'Approved', 'Published'],
		relatedPath: '/results',
		relatedAction: 'Results approval',
	},
	'/results': {
		eyebrow: 'Assessment administration',
		title: 'Results approval',
		description: 'Monitor submitted marks, moderation, approval, publication, and authorised correction requests.',
		icon: FileCheck2,
		metrics: ['Submissions received', 'Under review', 'Awaiting approval', 'Correction requests'],
		tableTitle: 'Results workflow',
		columns: ['Course unit', 'Programme', 'Academic period', 'Submitted by', 'Workflow status', 'Submitted'],
		emptyTitle: 'No result submissions loaded',
		emptyDescription: 'Result submissions are not available until the assessment service is connected.',
		workflow: ['Draft', 'Submitted', 'Under review', 'Approved', 'Published'],
		statusOptions: ['Draft', 'Submitted', 'Under review', 'Approved', 'Published', 'Correction requested'],
		primaryAction: { label: 'Approve selected results', permission: 'results.approve' },
		relatedPath: '/graduation',
		relatedAction: 'Graduation checks',
	},
	'/graduation': {
		eyebrow: 'Completion and awards',
		title: 'Graduation checks',
		description: 'Coordinate configured academic completion checks, clearance evidence, approvals, and award records.',
		icon: Award,
		metrics: ['Completion reviews', 'Academic requirements outstanding', 'Clearances to verify', 'Awards awaiting approval'],
		tableTitle: 'Completion review queue',
		columns: ['Student', 'Programme', 'Curriculum version', 'Academic review', 'Clearance status', 'Decision'],
		emptyTitle: 'No completion reviews loaded',
		emptyDescription: 'Eligibility must be calculated against the approved curriculum and configured clearances.',
		workflow: ['Academic requirements', 'Academic record verification', 'Required clearances', 'Authorised approval', 'Award record'],
		statusOptions: ['Academic review', 'Clearance review', 'Awaiting approval', 'Approved', 'Not eligible'],
		primaryAction: { label: 'Review award decision', permission: 'graduation.manage' },
		relatedPath: '/reports',
		relatedAction: 'Completion reports',
	},
	'/reports': {
		eyebrow: 'Academic oversight',
		title: 'Registrar reports',
		description: 'Review authorised admissions, enrolment, registration, progression, examination, and completion reports.',
		icon: ClipboardList,
		metrics: ['Admissions reports', 'Enrolment reports', 'Progression reports', 'Completion reports'],
		tableTitle: 'Available report categories',
		columns: ['Report category', 'Scope', 'Reporting period', 'Data status', 'Last generated'],
		emptyTitle: 'Reports require connected records',
		emptyDescription: 'Report availability and scope will be determined by the authenticated reporting service.',
		workflow: ['Choose authorised report', 'Set scope and period', 'Review results', 'Export approved data'],
		statusOptions: ['Available', 'Queued', 'Ready to export'],
		exportFormats: ['CSV', 'PDF'],
		relatedPath: '/settings',
		relatedAction: 'Academic policy settings',
	},
}

const tones = ['blue', 'teal', 'amber', 'green'] as const
const icons: LucideIcon[] = [ClipboardList, CalendarCheck2, FileCheck2, Award]

function workspaceMetrics(path: string, state: SimulationState): number[] {
	const countStatus = (items: Array<{ status: string }>, status: string) => items.filter((item) => item.status === status).length
	switch (path) {
		case '/admissions': return [state.applications.length, countStatus(state.applications, 'submitted') + countStatus(state.applications, 'reviewing'), countStatus(state.applications, 'missing_documents'), countStatus(state.applications, 'offered')]
		case '/students': return [state.students.filter((student) => student.academicStatus === 'active').length, state.students.length, state.students.filter((student) => student.academicStatus === 'deferred').length, countStatus(state.applications, 'accepted')]
		case '/academics': return [state.academicPeriods.length, state.programmes.length, new Set(state.programmes.map((programme) => programme.version)).size, state.courseUnits.length]
		case '/registration': return [state.registrations.length, countStatus(state.registrations, 'submitted'), state.registrations.filter((registration) => registration.status === 'submitted').length, countStatus(state.registrations, 'confirmed')]
		case '/timetabling': return [state.teachingSessions.length, 0, 0, state.teachingSessions.filter((session) => session.status === 'scheduled').length]
		case '/attendance': return [state.attendanceSessions.length, countStatus(state.attendanceSessions, 'incomplete'), 0, countStatus(state.attendanceSessions, 'reviewed')]
		case '/examinations': return [state.results.length, state.results.filter((result) => result.status === 'submitted').length, state.results.filter((result) => result.status === 'under_review').length, state.results.filter((result) => result.status === 'approved').length]
		case '/results': return [state.results.length, countStatus(state.results, 'under_review'), countStatus(state.results, 'approved'), 0]
		case '/graduation': return [state.graduationChecks.length, countStatus(state.graduationChecks, 'ineligible'), state.graduationChecks.filter((check) => check.financialClearance !== 'cleared' || check.libraryClearance !== 'cleared').length, countStatus(state.graduationChecks, 'eligible')]
		case '/reports': return [5, state.students.length, state.registrations.length, state.graduationChecks.length]
		default: return [0, 0, 0, 0]
	}
}

function csvCell(value: string): string {
	return `"${value.replaceAll('"', '""')}"`
}

interface AcademicRegistrarWorkspacePageProps {
	item: NavigationItem
}

export function AcademicRegistrarWorkspacePage({ item }: AcademicRegistrarWorkspacePageProps) {
	const { roleId } = useOutletContext<AppShellContext>()
	const simulation = useSimulation()
	const definition = workspaces[item.path]
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedStatus, setSelectedStatus] = useState('all')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [pageSize, setPageSize] = useState('25')
	const [sortColumn, setSortColumn] = useState<string | null>(null)
	const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending')
	const [workflowOpen, setWorkflowOpen] = useState(false)
	const [exportFormat, setExportFormat] = useState('CSV')
	const [page, setPage] = useState(1)
	const [feedback, setFeedback] = useState('')
	const rows = buildWorkspaceRows(item.path, simulation.state)
	const metricValues = workspaceMetrics(item.path, simulation.state)
	const filteredRows = rows.filter((record) => {
		const matchesSearch = !searchTerm || record.searchableText.includes(searchTerm.toLowerCase())
		const normalizedStatus = record.status.toLowerCase().replaceAll(' ', '_')
		const matchesStatus = selectedStatus === 'all' || normalizedStatus === selectedStatus.toLowerCase()
		const matchesStart = !startDate || (record.date !== '' && record.date >= startDate)
		const matchesEnd = !endDate || (record.date !== '' && record.date <= endDate)
		return matchesSearch && matchesStatus && matchesStart && matchesEnd
	})
	const sortedRows = [...filteredRows].sort((left, right) => {
		if (!sortColumn) return 0
		const index = definition.columns.indexOf(sortColumn)
		const comparison = (left.cells[index] ?? '').localeCompare(right.cells[index] ?? '', undefined, { numeric: true })
		return sortDirection === 'ascending' ? comparison : -comparison
	})
	const pageCount = Math.max(1, Math.ceil(sortedRows.length / Number(pageSize)))
	const visibleRows = sortedRows.slice((page - 1) * Number(pageSize), page * Number(pageSize))
	const displayColumns = [...definition.columns, 'Actions']
	const canOpenRelated = definition.relatedPath !== undefined && navigationItems.some((navigationItem) =>
		navigationItem.path === definition.relatedPath
			&& hasAnyPermission(roleId, navigationItem.permissions),
	)

	if (!definition) {
		return null
	}

	function availableActions(record: DemoWorkspaceRow): SimulationAction[] {
		switch (item.path) {
			case '/admissions': {
				const application = simulation.state.applications.find((entry) => entry.id === record.id)
				if (!application) return []
				if (application.status === 'submitted') return [{ label: 'Begin review' }]
				if (application.status === 'missing_documents') return [{ label: 'Mark documents complete' }]
				if (application.status === 'reviewing') return application.documentsComplete
					? [{ label: 'Issue offer' }, { label: 'Request documents' }, { label: 'Reject application', intent: 'destructive' }]
					: [{ label: 'Request documents' }, { label: 'Reject application', intent: 'destructive' }]
				if (application.status === 'offered') return [{ label: 'Accept offer and create student' }, { label: 'Decline offer', intent: 'destructive' }]
				return []
			}
			case '/students': {
				const student = simulation.state.students.find((entry) => entry.id === record.id)
				if (student?.academicStatus === 'active') return [{ label: 'Defer student' }, { label: 'Withdraw student', intent: 'destructive' }]
				if (student?.academicStatus === 'deferred') return [{ label: 'Reactivate student' }]
				return []
			}
			case '/academics': {
				const programme = simulation.state.programmes.find((entry) => entry.id === record.id)
				if (programme?.status === 'draft') return [{ label: 'Activate programme' }]
				if (programme?.status === 'active') return [{ label: 'Archive programme', intent: 'destructive' }]
				return []
			}
			case '/registration': {
				const registration = simulation.state.registrations.find((entry) => entry.id === record.id)
				if (registration?.status === 'submitted') return [{ label: 'Approve registration' }, { label: 'Reject registration', intent: 'destructive' }]
				if (registration?.status === 'approved') return [{ label: 'Confirm registration' }]
				return []
			}
			case '/timetabling': {
				const session = simulation.state.teachingSessions.find((entry) => entry.id === record.id)
				return session?.status === 'published' ? [{ label: 'Cancel session', intent: 'destructive' }] : []
			}
			case '/attendance': {
				const session = simulation.state.attendanceSessions.find((entry) => entry.id === record.id)
				if (session?.status === 'incomplete') return [{ label: 'Complete register' }]
				if (session?.status === 'recorded') return [{ label: 'Review register' }]
				return []
			}
			case '/examinations':
			case '/results': {
				const result = simulation.state.results.find((entry) => entry.id === record.id)
				if (result?.status === 'submitted') return [{ label: 'Begin moderation' }]
				if (result?.status === 'under_review') return [{ label: 'Approve results' }]
				if (result?.status === 'approved') return [{ label: 'Publish results' }]
				return []
			}
			case '/graduation': {
				const check = simulation.state.graduationChecks.find((entry) => entry.id === record.id)
				if (!check || check.status === 'awarded') return []
				const actions: SimulationAction[] = []
				if (check.academicRequirements !== 'complete') actions.push({ label: 'Complete academic requirements' })
				if (check.financialClearance !== 'cleared') actions.push({ label: 'Clear finances' })
				if (check.libraryClearance !== 'cleared') actions.push({ label: 'Clear library' })
				actions.push({ label: 'Evaluate eligibility' })
				if (check.status === 'eligible') actions.push({ label: 'Award graduation' })
				return actions
			}
			default:
				return []
		}
	}

	function runSimulationAction(action: string, record: DemoWorkspaceRow) {
		try {
			if (item.path === '/admissions') {
				if (action === 'Begin review') simulation.transitionApplication(record.id, 'reviewing')
				if (action === 'Mark documents complete') simulation.setApplicationDocumentsComplete(record.id, true)
				if (action === 'Issue offer') simulation.transitionApplication(record.id, 'offered')
				if (action === 'Request documents') simulation.transitionApplication(record.id, 'missing_documents')
				if (action === 'Reject application' || action === 'Decline offer') simulation.transitionApplication(record.id, 'rejected')
				if (action === 'Accept offer and create student') simulation.transitionApplication(record.id, 'accepted')
			}
			if (item.path === '/students') {
				const status = action === 'Defer student' ? 'deferred' : action === 'Withdraw student' ? 'withdrawn' : action === 'Reactivate student' ? 'active' : null
				if (status) simulation.updateStudentStatus(record.id, status)
			}
			if (item.path === '/academics') {
				const status = action === 'Activate programme' ? 'active' : action === 'Archive programme' ? 'archived' : null
				if (status) simulation.updateProgrammeStatus(record.id, status)
			}
			if (item.path === '/registration') {
				if (action === 'Approve registration') simulation.transitionRegistration(record.id, 'approved')
				if (action === 'Reject registration') simulation.transitionRegistration(record.id, 'rejected')
				if (action === 'Confirm registration') simulation.transitionRegistration(record.id, 'confirmed')
			}
			if (item.path === '/timetabling' && (action === 'Cancel session' || action === 'Publish session')) {
				simulation.transitionTeachingSession(record.id, action === 'Cancel session' ? 'cancelled' : 'published')
			}
			if (item.path === '/attendance') {
				if (action === 'Complete register') simulation.transitionAttendance(record.id, 'recorded')
				if (action === 'Review register') simulation.transitionAttendance(record.id, 'reviewed')
			}
			if ((item.path === '/results' || item.path === '/examinations') && action === 'Begin moderation') simulation.transitionResult(record.id, 'under_review')
			if ((item.path === '/results' || item.path === '/examinations') && action === 'Approve results') simulation.transitionResult(record.id, 'approved')
			if ((item.path === '/results' || item.path === '/examinations') && action === 'Publish results') simulation.transitionResult(record.id, 'published')
			if (item.path === '/graduation') {
				if (action === 'Complete academic requirements') simulation.updateAcademicRequirements(record.id, 'complete')
				if (action === 'Clear finances') simulation.updateGraduationClearance(record.id, 'financialClearance', 'cleared')
				if (action === 'Clear library') simulation.updateGraduationClearance(record.id, 'libraryClearance', 'cleared')
				if (action === 'Evaluate eligibility') {
					const status = simulation.evaluateGraduation(record.id)
					setFeedback(status === 'eligible' ? 'Student meets configured demo graduation checks.' : 'Student is not yet eligible; complete each configured demo requirement.')
					return
				}
				if (action === 'Award graduation') simulation.awardGraduation(record.id)
			}
			setFeedback(`${action} completed in the local simulation.`)
		} catch (error) {
			setFeedback(error instanceof Error ? error.message : 'This simulation action could not be completed.')
		}
	}

	function exportSimulationReport() {
		if (exportFormat === 'PDF') {
			window.print()
			return
		}
		const content = [
			definition.columns.map(csvCell).join(','),
			...sortedRows.map((record) => record.cells.map(csvCell).join(',')),
		].join('\n')
		const file = new Blob([content], { type: 'text/csv;charset=utf-8' })
		const url = URL.createObjectURL(file)
		const anchor = document.createElement('a')
		anchor.href = url
		anchor.download = `${item.path.slice(1)}-simulation.csv`
		anchor.click()
		URL.revokeObjectURL(url)
		setFeedback('Filtered synthetic simulation report exported as CSV.')
	}

	return (
		<section className="registrar-workspace-page" aria-labelledby="registrar-workspace-title">
			<div className="page-heading">
				<div>
					<p className="eyebrow">{definition.eyebrow}</p>
					<h1 className="page-title" id="registrar-workspace-title">{definition.title}</h1>
					<p className="page-description">{definition.description}</p>
				</div>
				<span className="system-status simulation-data-status"><span className="status-dot" />Synthetic simulation data</span>
			</div>
			<div className="registrar-page-actions">
				<SimulationCreateActions path={item.path} onMessage={setFeedback} />
			</div>

			<div className="overview-grid registrar-workspace-metrics" aria-label={`${definition.title} synthetic metrics`}>
				{definition.metrics.map((label, index) => (
					<MetricCard
						key={label}
						label={label}
						note="Synthetic demo data"
						value={metricValues[index]}
						icon={icons[index]}
						tone={tones[index]}
					/>
				))}
			</div>

			{definition.workflow && (
				<section className="surface-panel registrar-process-panel" aria-labelledby="registrar-process-title">
					<div className="panel-heading">
						<div>
							<h2 className="panel-title" id="registrar-process-title">Workflow outline</h2>
							<p className="panel-subtitle">Stages are subject to the institution’s configured policy</p>
						</div>
						<div className="registrar-workflow-actions">
							<definition.icon className="panel-heading-icon" size={17} aria-hidden="true" />
							<Dialog open={workflowOpen} onOpenChange={setWorkflowOpen}>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm"><Eye size={13} aria-hidden="true" />View workflow</Button>
								</DialogTrigger>
								<DialogContent aria-describedby="workflow-dialog-description">
									<DialogHeader>
										<DialogTitle>{definition.title} workflow</DialogTitle>
										<DialogDescription id="workflow-dialog-description">Workflow stages are informational. Institution policy and the authorized backend control actual transitions.</DialogDescription>
									</DialogHeader>
									<ol className="registrar-dialog-workflow">
										{definition.workflow.map((stage, index) => (
											<li key={stage}><span>{index + 1}</span>{stage}</li>
										))}
									</ol>
									<DialogFooter>
										<Button variant="outline" onClick={() => setWorkflowOpen(false)}>Close</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</div>
					<ol className="registrar-workflow-steps">
						{definition.workflow.map((stage, index) => (
							<li key={stage}>
								<span className="workflow-step-number">{index + 1}</span>
								<span>{stage}</span>
								{index < definition.workflow!.length - 1 && <ArrowRight className="workflow-step-arrow" size={13} aria-hidden="true" />}
							</li>
						))}
					</ol>
				</section>
			)}

			<section className="surface-panel registrar-record-panel" aria-labelledby="registrar-record-title">
				<div className="registrar-record-heading">
					<div>
						<h2 className="panel-title" id="registrar-record-title">{definition.tableTitle}</h2>
						<p className="panel-subtitle">Fictional records from this browser’s local demo dataset.</p>
					</div>
					<div className="registrar-record-tools">
						<SimulationCreateActions path={item.path} onMessage={setFeedback} />
						{definition.exportFormats && (
							<div className="registrar-export-controls">
								<Select value={exportFormat} onValueChange={setExportFormat}>
									<SelectTrigger aria-label="Export format"><SelectValue /></SelectTrigger>
									<SelectContent>{definition.exportFormats.map((format) => <SelectItem key={format} value={format}>{format}</SelectItem>)}</SelectContent>
								</Select>
								<Button size="sm" onClick={exportSimulationReport}><Download size={13} aria-hidden="true" />Export demo</Button>
							</div>
						)}
					</div>
				</div>

				<div className="registrar-filter-bar" aria-label="Record filters">
					<label className="registrar-search">
						<Search size={14} aria-hidden="true" />
						<input
							type="search"
							placeholder={`Search ${definition.tableTitle.toLowerCase()}`}
							aria-label={`Search ${definition.tableTitle}`}
							value={searchTerm}
							onChange={(event) => { setSearchTerm(event.target.value); setPage(1) }}
						/>
						{searchTerm && <button className="registrar-clear-search" type="button" aria-label="Clear search" onClick={() => setSearchTerm('')}><X size={13} /></button>}
					</label>
					<Select value={selectedStatus} onValueChange={(value) => { setSelectedStatus(value); setPage(1) }}>
						<SelectTrigger aria-label={`Filter ${definition.title} by status`}><SelectValue placeholder="All statuses" /></SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All statuses</SelectItem>
							{definition.statusOptions?.map((status) => <SelectItem key={status} value={status.toLowerCase().replaceAll(' ', '_')}>{status}</SelectItem>)}
						</SelectContent>
					</Select>
					<label className="registrar-date-filter">From<input type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); setPage(1) }} aria-label="Start date" /></label>
					<label className="registrar-date-filter">To<input type="date" value={endDate} onChange={(event) => { setEndDate(event.target.value); setPage(1) }} aria-label="End date" /></label>
					{(selectedStatus !== 'all' || startDate || endDate) && (
						<Button variant="ghost" size="sm" onClick={() => { setSelectedStatus('all'); setStartDate(''); setEndDate(''); setSearchTerm(''); setPage(1) }}>Clear filters</Button>
					)}
				</div>

				<div className="table-responsive registrar-table-wrap">
					<table className="table registrar-table">
						<thead>
							<tr>{displayColumns.map((column) => (
								<th scope="col" key={column} aria-sort={sortColumn === column ? sortDirection : 'none'}>
									{column === 'Actions' ? column : (
										<button
											className="registrar-sort-button"
											type="button"
											aria-label={`Sort by ${column}`}
											onClick={() => {
												setSortDirection(sortColumn === column && sortDirection === 'ascending' ? 'descending' : 'ascending')
												setSortColumn(column)
												setPage(1)
											}}
										>
											{column}<ArrowDownUp size={11} aria-hidden="true" />
										</button>
									)}
								</th>
							))}</tr>
						</thead>
						<tbody>
							{visibleRows.map((record) => (
								<tr key={record.id}>
									{definition.columns.map((column, index) => {
										const cell = record.cells[index] ?? ''
										const isStatus = /status|decision/i.test(column)
										return <td key={column}>{isStatus
											? <span className={`simulation-status-badge status-${record.status.toLowerCase().replaceAll(' ', '-')}`}>{cell}</span>
											: cell}</td>
									})}
									<td><SimulationRecordDialog title={definition.title} record={record} actions={availableActions(record)} onAction={runSimulationAction} /></td>
								</tr>
							))}
							{visibleRows.length === 0 && (
								<tr>
									<td colSpan={displayColumns.length}>
										<div className="registrar-empty-state" role="status">
											<definition.icon size={23} aria-hidden="true" />
											<strong>{rows.length === 0 ? definition.emptyTitle : 'No records match these filters'}</strong>
											<span>{rows.length === 0 ? definition.emptyDescription : 'Change or clear the current search and filters.'}</span>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className="registrar-pagination">
					<span>{sortedRows.length === 0 ? 'No matching records' : `${(page - 1) * Number(pageSize) + 1}–${Math.min(page * Number(pageSize), sortedRows.length)} of ${sortedRows.length} records`}</span>
					<div className="registrar-pagination-controls">
						<label>Rows
							<Select value={pageSize} onValueChange={(value) => { setPageSize(value); setPage(1) }}>
								<SelectTrigger aria-label="Rows per page"><SelectValue /></SelectTrigger>
								<SelectContent>{['10', '25', '50'].map((size) => <SelectItem key={size} value={size}>{size}</SelectItem>)}</SelectContent>
							</Select>
						</label>
						<span>Page {page} of {pageCount}</span>
						<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} aria-label="Previous page">Previous</Button>
						<Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} aria-label="Next page">Next</Button>
					</div>
				</div>
			</section>
			{feedback && <div className="simulation-feedback" role="status">{feedback}<button type="button" aria-label="Dismiss message" onClick={() => setFeedback('')}>×</button></div>}

			<div className="registrar-workspace-footer">
				<span>No institutional records are being simulated.</span>
				{canOpenRelated && definition.relatedPath && definition.relatedAction && (
					<Link className="registrar-related-link" to={definition.relatedPath}>
						{definition.relatedAction}<ArrowRight size={14} aria-hidden="true" />
					</Link>
				)}
			</div>
		</section>
	)
}
