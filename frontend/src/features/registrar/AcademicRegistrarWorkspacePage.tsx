
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
import { hasAnyPermission, hasPermission } from '../../config/access'
import type { Permission } from '../../config/roles'
import type { AppShellContext } from '../../components/layout/AppShell'
import { MetricCard } from '../dashboard/MetricCard'
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

interface AcademicRegistrarWorkspacePageProps {
	item: NavigationItem
}

export function AcademicRegistrarWorkspacePage({ item }: AcademicRegistrarWorkspacePageProps) {
	const { roleId } = useOutletContext<AppShellContext>()
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
	const canOpenRelated = definition.relatedPath !== undefined && navigationItems.some((navigationItem) =>
		navigationItem.path === definition.relatedPath
			&& hasAnyPermission(roleId, navigationItem.permissions),
	)

	if (!definition) {
		return null
	}

	return (
		<section className="registrar-workspace-page" aria-labelledby="registrar-workspace-title">
			<div className="page-heading">
				<div>
					<p className="eyebrow">{definition.eyebrow}</p>
					<h1 className="page-title" id="registrar-workspace-title">{definition.title}</h1>
					<p className="page-description">{definition.description}</p>
				</div>
				<span className="system-status"><span className="status-dot" />API not connected</span>
			</div>

			<div className="overview-grid registrar-workspace-metrics" aria-label={`${definition.title} metrics unavailable`}>
				{definition.metrics.map((label, index) => (
					<MetricCard
						key={label}
						label={label}
						note="Live value unavailable"
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
						<p className="panel-subtitle">Records are scoped by authenticated permissions and institutional assignment.</p>
					</div>
					<div className="registrar-record-tools">
						{definition.primaryAction && hasPermission(roleId, definition.primaryAction.permission) && (
							<Button
								size="sm"
								disabled
								title="A selected authorized record and backend workflow are required"
							>
								{definition.primaryAction.label}
							</Button>
						)}
					{definition.exportFormats && (
						<div className="registrar-export-controls">
							<Select value={exportFormat} onValueChange={setExportFormat}>
								<SelectTrigger aria-label="Export format"><SelectValue /></SelectTrigger>
								<SelectContent>{definition.exportFormats.map((format) => <SelectItem key={format} value={format}>{format}</SelectItem>)}</SelectContent>
							</Select>
							<Button size="sm" disabled title="Export becomes available when approved report data is connected"><Download size={13} aria-hidden="true" />Export</Button>
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
							onChange={(event) => setSearchTerm(event.target.value)}
						/>
						{searchTerm && <button className="registrar-clear-search" type="button" aria-label="Clear search" onClick={() => setSearchTerm('')}><X size={13} /></button>}
					</label>
					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger aria-label={`Filter ${definition.title} by status`}><SelectValue placeholder="All statuses" /></SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All statuses</SelectItem>
							{definition.statusOptions?.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
						</SelectContent>
					</Select>
					<label className="registrar-date-filter">From<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} aria-label="Start date" /></label>
					<label className="registrar-date-filter">To<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} aria-label="End date" /></label>
					{(selectedStatus !== 'all' || startDate || endDate) && (
						<Button variant="ghost" size="sm" onClick={() => { setSelectedStatus('all'); setStartDate(''); setEndDate('') }}>Clear filters</Button>
					)}
				</div>

				<div className="table-responsive registrar-table-wrap">
					<table className="table registrar-table">
						<thead>
							<tr>{definition.columns.map((column) => (
								<th scope="col" key={column} aria-sort={sortColumn === column ? sortDirection : 'none'}>
									<button
										className="registrar-sort-button"
										type="button"
										aria-label={`Sort by ${column}`}
										onClick={() => {
											setSortDirection(sortColumn === column && sortDirection === 'ascending' ? 'descending' : 'ascending')
											setSortColumn(column)
										}}
									>
										{column}<ArrowDownUp size={11} aria-hidden="true" />
									</button>
								</th>
							))}</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={definition.columns.length}>
									<div className="registrar-empty-state" role="status">
										<definition.icon size={23} aria-hidden="true" />
										<strong>{searchTerm || selectedStatus !== 'all' || startDate || endDate ? 'No matching records' : definition.emptyTitle}</strong>
										<span>{definition.emptyDescription}</span>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="registrar-pagination">
					<span>{searchTerm || selectedStatus !== 'all' || startDate || endDate ? 'No matching records' : 'No records loaded'}</span>
					<div className="registrar-pagination-controls">
						<label>Rows
							<Select value={pageSize} onValueChange={setPageSize}>
								<SelectTrigger aria-label="Rows per page"><SelectValue /></SelectTrigger>
								<SelectContent>{['10', '25', '50'].map((size) => <SelectItem key={size} value={size}>{size}</SelectItem>)}</SelectContent>
							</Select>
						</label>
						<span>Page 1 of 1</span>
						<Button variant="outline" size="sm" disabled aria-label="Previous page">Previous</Button>
						<Button variant="outline" size="sm" disabled aria-label="Next page">Next</Button>
					</div>
				</div>
			</section>

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
