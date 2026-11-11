import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Library,
  ListTree,
  Network,
  BookOpenText,
  ArrowRightLeft,
  CirclePause,
  FileText,
  MapPin,
  Plus,
  Settings2,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react'

export type Permission =
  | 'dashboard.view'
  | 'admissions.view'
  | 'students.view'
  | 'academics.view'
  | 'registration.view'
  | 'timetabling.view'
  | 'attendance.view'
  | 'examinations.view'
  | 'finance.view'
  | 'scholarships.view'
  | 'learning.view'
  | 'library.view'
  | 'staff.view'
  | 'accommodation.view'
  | 'internship.view'
  | 'welfare.view'
  | 'graduation.view'
  | 'communications.view'
  | 'quality.view'
  | 'procurement.view'
  | 'administration.manage'
  | 'reports.view'
  | 'users.manage'
  | 'settings.manage'

export type RoleName =
  | 'Super Administrator'
  | 'ICT Administrator'
  | 'Institution Head'
  | 'Academic Director'
  | 'Academic Registrar'
  | 'Deputy Registrar'
  | 'Faculty Registrar'
  | 'Admissions Officer'
  | 'Dean / Faculty Head'
  | 'Head of Department'
  | 'Programme Coordinator'
  | 'Examination Officer'
  | 'Finance Officer'
  | 'Accounts Officer'
  | 'Scholarship Officer'
  | 'Human Resources Officer'
  | 'Librarian'
  | 'Accommodation Officer'
  | 'Internship Coordinator'
  | 'Quality Assurance Officer'
  | 'Welfare Officer'
  | 'Procurement Officer'
  | 'Auditor'
  | 'Lecturer'
  | 'Class Tutor'
  | 'Student'
  | 'Parent / Sponsor'

export interface NavigationItem {
  label: string
  href: string
  icon: LucideIcon
  permission: Permission
  badge?: string
}

export interface RoleTemplate {
  name: RoleName
  shortName: string
  description: string
  color: string
  permissions: Permission[]
}

export interface StudentRecord {
  id: string
  name: string
  programme: string
  year: string
  status: 'Active' | 'On hold' | 'Graduating'
  balance: string
  lastSeen: string
}

export interface StudentProfileData {
  campus: string
  faculty: string
  department: string
  semester: string
  intake: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality?: string
  address: string
  nextOfKin: { name: string; relationship: string; phone: string; email: string }
  statusHistory: Array<{ date: string; status: string; detail: string }>
  documents: Array<{ name: string; status: 'Verified' | 'Received' | 'Pending'; updated: string }>
  previousEducation?: Array<{ institution: string; qualification: string; completionYear: string }>
  academicResults?: Array<{ subject: string; grade: string; examinationBody?: string }>
  secondChoiceProgramme?: string
  studyMode?: string
}

export interface ActivityItem {
  title: string
  detail: string
  time: string
  tone: 'blue' | 'teal' | 'amber' | 'violet'
  icon: LucideIcon
}

export interface KpiMetric {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone: 'blue' | 'teal' | 'purple' | 'amber'
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'dashboard.view' },
  { label: 'Admissions', href: '/admissions', icon: ClipboardList, permission: 'admissions.view', badge: '24' },
  { label: 'Student management', href: '/students', icon: UsersRound, permission: 'students.view' },
  { label: 'Academic structure', href: '/academics', icon: BookOpen, permission: 'academics.view' },
  { label: 'Registration', href: '/registration', icon: GraduationCap, permission: 'registration.view', badge: '8' },
  { label: 'Timetabling', href: '/timetabling', icon: ClipboardList, permission: 'timetabling.view' },
  { label: 'Attendance', href: '/attendance', icon: UsersRound, permission: 'attendance.view' },
  { label: 'Examinations', href: '/examinations', icon: ClipboardList, permission: 'examinations.view' },
  { label: 'Finance', href: '/finance', icon: CreditCard, permission: 'finance.view' },
  { label: 'Scholarships', href: '/scholarships', icon: GraduationCap, permission: 'scholarships.view' },
  { label: 'Learning resources', href: '/learning', icon: BookOpen, permission: 'learning.view' },
  { label: 'Library', href: '/library', icon: Library, permission: 'library.view' },
  { label: 'Staff & HR', href: '/staff', icon: UserRound, permission: 'staff.view' },
  { label: 'Accommodation', href: '/accommodation', icon: Building2, permission: 'accommodation.view' },
  { label: 'Internship & research', href: '/internship', icon: GraduationCap, permission: 'internship.view' },
  { label: 'Student welfare', href: '/welfare', icon: UsersRound, permission: 'welfare.view' },
  { label: 'Graduation & alumni', href: '/graduation', icon: GraduationCap, permission: 'graduation.view' },
  { label: 'Communications', href: '/communications', icon: ClipboardList, permission: 'communications.view' },
  { label: 'Quality assurance', href: '/quality', icon: ChartNoAxesCombined, permission: 'quality.view' },
  { label: 'Procurement & inventory', href: '/procurement', icon: Building2, permission: 'procurement.view' },
  { label: 'Reports', href: '/reports', icon: ChartNoAxesCombined, permission: 'reports.view' },
]

export const studentManagementItems = [
  { label: 'Overview', href: '/students', icon: ChartNoAxesCombined, description: 'Student counts, status distribution, and records needing attention.' },
  { label: 'Student directory', href: '/students/directory', icon: UserRound, description: 'Search student records and open full profiles.' },
  { label: 'Placement & status', href: '/students/placement', icon: MapPin, description: 'Review programme, campus, cohort, and student status.' },
  { label: 'Lifecycle requests', href: '/students/lifecycle', icon: ArrowRightLeft, description: 'Review transfers, deferments, withdrawals, and reinstatements.' },
  { label: 'Documents & verification', href: '/students/documents', icon: FileText, description: 'Track student documents and verification progress.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const academicStructureItems = [
  { label: 'Overview', href: '/academics', icon: LayoutDashboard, description: 'See the complete academic setup and how its parts connect.' },
  { label: 'Institutions & campuses', href: '/academics/institutions', icon: Building2, description: 'Institution profile, locations, and campuses.' },
  { label: 'Faculties & schools', href: '/academics/faculties', icon: Landmark, description: 'Academic divisions and the departments they oversee.' },
  { label: 'Departments', href: '/academics/departments', icon: Network, description: 'Department ownership and academic organisation.' },
  { label: 'Programmes', href: '/academics/programmes', icon: GraduationCap, description: 'Awards, duration, and programme ownership.' },
  { label: 'Course units', href: '/academics/courses', icon: BookOpenText, description: 'Course codes, levels, and credit units.' },
  { label: 'Curriculum & credit units', href: '/academics/curricula', icon: ListTree, description: 'Programme course plans and progression requirements.' },
  { label: 'Academic years & semesters', href: '/academics/calendar', icon: CalendarDays, description: 'Academic periods and their key dates.' },
  { label: 'Grading systems', href: '/academics/grading', icon: ShieldCheck, description: 'Grading scales and result interpretation rules.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const admissionsItems = [
  { label: 'Overview', href: '/admissions', icon: LayoutDashboard, description: 'See the intake funnel, decision queue, and current admissions pressure points.' },
  { label: 'Online application portal', href: '/admissions/online-application', icon: Plus, description: 'Submit an applicant form or check progress using an application reference.' },
  { label: 'Application pipeline', href: '/admissions/application-pipeline', icon: ClipboardList, description: 'Track new applications, review stages, and applicant demand by intake.' },
  { label: 'Applicant review', href: '/admissions/applicant-review', icon: UserRound, description: 'Review applicant quality, faculty preferences, and shortlist decisions.' },
  { label: 'Document verification', href: '/admissions/document-verification', icon: FileText, description: 'Confirm missing, received, and verified applicant documents.' },
  { label: 'Offers & decisions', href: '/admissions/offers-decisions', icon: ShieldCheck, description: 'Issue offers, manage waitlists, acceptances, and release windows.' },
  { label: 'Enrollment & matriculation', href: '/admissions/matriculation', icon: GraduationCap, description: 'Convert accepted offers into verified, enrolled student records.' },
  { label: 'Intake planning', href: '/admissions/intake-planning', icon: CalendarDays, description: 'Align applicant volume, capacity, and enrolment planning by intake.' },
  { label: 'Reports & trends', href: '/admissions/reports', icon: ChartNoAxesCombined, description: 'Measure conversion and performance across the admissions intake cycle.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const registrationItems = [
  { label: 'Overview', href: '/registration', icon: LayoutDashboard, description: 'Monitor registration progress, outstanding actions, and credit compliance.' },
  { label: 'Course registration', href: '/registration/course-registration', icon: GraduationCap, description: 'Track student course selections and registration completion.' },
  { label: 'Approvals & exceptions', href: '/registration/approvals', icon: ShieldCheck, description: 'Review pending approvals and resolve registration exceptions.' },
  { label: 'Add/drop requests', href: '/registration/add-drop', icon: ArrowRightLeft, description: 'Process course changes within the approved registration window.' },
  { label: 'Credit-load compliance', href: '/registration/credit-load', icon: ListTree, description: 'Identify students outside programme credit-load rules.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const examinationItems = [
  { label: 'Overview', href: '/examinations', icon: LayoutDashboard, description: 'See assessment readiness, marks progress, moderation, and publication queues.' },
  { label: 'Assessment setup', href: '/examinations/assessment-setup', icon: ClipboardList, description: 'Coordinate assessment components, schedules, and course coverage.' },
  { label: 'Marks entry', href: '/examinations/marks-entry', icon: FileText, description: 'Monitor marks submission and resolve missing result records.' },
  { label: 'Moderation & approvals', href: '/examinations/moderation', icon: ShieldCheck, description: 'Review moderated results and approval readiness.' },
  { label: 'Results publication', href: '/examinations/publication', icon: CalendarDays, description: 'Control approved result release and publication status.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const financeItems = [
  { label: 'Overview', href: '/finance', icon: LayoutDashboard, description: 'Monitor billed fees, collections, reconciliation, and account exceptions.' },
  { label: 'Fees & billing', href: '/finance/billing', icon: CreditCard, description: 'Review fee schedules, invoices, and billing batches.' },
  { label: 'Payments & reconciliation', href: '/finance/reconciliation', icon: ArrowRightLeft, description: 'Match received payments and resolve unmatched transactions.' },
  { label: 'Student accounts', href: '/finance/accounts', icon: UsersRound, description: 'Review balances, statements, and account holds.' },
  { label: 'Refunds & adjustments', href: '/finance/refunds', icon: FileText, description: 'Process adjustment requests and controlled refund approvals.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const timetablingItems = [
  { label: 'Overview', href: '/timetabling', icon: LayoutDashboard, description: 'Review schedule readiness, venue use, lecturer allocation, and conflicts.' },
  { label: 'Weekly schedules', href: '/timetabling/schedules', icon: CalendarDays, description: 'Review teaching sessions by course, group, day, and time.' },
  { label: 'Rooms & venues', href: '/timetabling/venues', icon: Building2, description: 'Track venue capacity, utilization, and room availability.' },
  { label: 'Lecturer allocation', href: '/timetabling/lecturer-allocation', icon: UserRound, description: 'Balance teaching assignments and lecturer availability.' },
  { label: 'Conflict resolution', href: '/timetabling/conflicts', icon: ShieldCheck, description: 'Resolve room, lecturer, and cohort scheduling clashes.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const attendanceItems = [
  { label: 'Overview', href: '/attendance', icon: LayoutDashboard, description: 'Review attendance activity, thresholds, corrections, and participation trends.' },
  { label: 'Sessions & registers', href: '/attendance/sessions', icon: ClipboardList, description: 'Track class registers and lecturer submission status by scheduled session.' },
  { label: 'Attendance alerts', href: '/attendance/alerts', icon: CirclePause, description: 'Follow students and cohorts below the institution attendance threshold.' },
  { label: 'Correction requests', href: '/attendance/corrections', icon: ArrowRightLeft, description: 'Review authorized requests to correct submitted attendance records.' },
  { label: 'Reports & trends', href: '/attendance/reports', icon: ChartNoAxesCombined, description: 'Compare participation by course, programme, cohort, and teaching period.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const scholarshipItems = [
  { label: 'Overview', href: '/scholarships', icon: LayoutDashboard, description: 'Review awards, applications, sponsor balances, and renewal risks.' },
  { label: 'Awards & eligibility', href: '/scholarships/awards', icon: GraduationCap, description: 'Track active awards, eligibility rules, and student coverage.' },
  { label: 'Applications', href: '/scholarships/applications', icon: ClipboardList, description: 'Review new funding applications and committee decisions.' },
  { label: 'Sponsors & allocations', href: '/scholarships/sponsors', icon: Building2, description: 'Monitor sponsor commitments, disbursements, and remaining balances.' },
  { label: 'Renewals & exceptions', href: '/scholarships/renewals', icon: ShieldCheck, description: 'Manage award renewals, academic conditions, and funding exceptions.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const learningItems = [
  { label: 'Overview', href: '/learning', icon: LayoutDashboard, description: 'Review course spaces, learning materials, assignments, and submissions.' },
  { label: 'Course spaces', href: '/learning/courses', icon: BookOpen, description: 'Track active digital course spaces and learner participation.' },
  { label: 'Learning resources', href: '/learning/resources', icon: FileText, description: 'Organize course materials and resource publication status.' },
  { label: 'Assignments', href: '/learning/assignments', icon: ClipboardList, description: 'Monitor assignment schedules, due dates, and marking progress.' },
  { label: 'Submissions', href: '/learning/submissions', icon: ShieldCheck, description: 'Review learner submissions, feedback, and late work.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const libraryItems = [
  { label: 'Overview', href: '/library', icon: LayoutDashboard, description: 'Monitor catalogue activity, circulation, overdue items, and clearance.' },
  { label: 'Catalogue', href: '/library/catalogue', icon: Library, description: 'Maintain bibliographic records, copies, and collection locations.' },
  { label: 'Circulation', href: '/library/circulation', icon: ArrowRightLeft, description: 'Track loans, returns, renewals, and reservations.' },
  { label: 'Overdue & fines', href: '/library/overdue', icon: CirclePause, description: 'Follow overdue items, fine balances, and borrower reminders.' },
  { label: 'Clearances', href: '/library/clearances', icon: ShieldCheck, description: 'Process library clearance requests for graduating students.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const staffItems = [
  { label: 'Overview', href: '/staff', icon: LayoutDashboard, description: 'Review staff records, contracts, leave, and workload exceptions.' },
  { label: 'Staff directory', href: '/staff/directory', icon: UsersRound, description: 'Find staff profiles, departments, positions, and contact records.' },
  { label: 'Contracts & credentials', href: '/staff/contracts', icon: FileText, description: 'Track contract dates, qualifications, and credential verification.' },
  { label: 'Leave management', href: '/staff/leave', icon: CalendarDays, description: 'Review leave balances, requests, and approval queues.' },
  { label: 'Workload planning', href: '/staff/workload', icon: ListTree, description: 'Monitor teaching and service allocations across faculties.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const accommodationItems = [
  { label: 'Overview', href: '/accommodation', icon: LayoutDashboard, description: 'Review residence capacity, applications, allocations, and operations.' },
  { label: 'Residences & rooms', href: '/accommodation/residences', icon: Building2, description: 'Monitor beds, room inventory, occupancy, and maintenance status.' },
  { label: 'Applications', href: '/accommodation/applications', icon: ClipboardList, description: 'Review housing requests, eligibility, and applicant priorities.' },
  { label: 'Room allocations', href: '/accommodation/allocations', icon: MapPin, description: 'Assign residents to available rooms and track allocation changes.' },
  { label: 'Check-in & maintenance', href: '/accommodation/operations', icon: Settings2, description: 'Coordinate check-ins, check-outs, inspections, and repair tasks.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const internshipItems = [
  { label: 'Overview', href: '/internship', icon: LayoutDashboard, description: 'Track placements, supervisors, logbooks, and research activity.' },
  { label: 'Student placements', href: '/internship/placements', icon: MapPin, description: 'Monitor placement matching, host organizations, and student progress.' },
  { label: 'Supervisors', href: '/internship/supervisors', icon: UsersRound, description: 'Manage industry and faculty supervisors and their assigned students.' },
  { label: 'Logbooks & reviews', href: '/internship/logbooks', icon: FileText, description: 'Review submitted logbooks, supervisor feedback, and approval status.' },
  { label: 'Research projects', href: '/internship/research', icon: GraduationCap, description: 'Track research proposals, ethics review, and project milestones.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const welfareItems = [
  { label: 'Overview', href: '/welfare', icon: LayoutDashboard, description: 'Coordinate restricted support cases, appointments, and follow-up.' },
  { label: 'Support cases', href: '/welfare/cases', icon: ShieldCheck, description: 'Manage confidential cases with role-limited access and audit history.' },
  { label: 'Appointments', href: '/welfare/appointments', icon: CalendarDays, description: 'Coordinate counselling and student support appointments.' },
  { label: 'Referrals', href: '/welfare/referrals', icon: ArrowRightLeft, description: 'Track authorized referrals to internal and external services.' },
  { label: 'Follow-up tasks', href: '/welfare/follow-up', icon: ClipboardList, description: 'Monitor assigned follow-ups without exposing restricted case details.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const graduationItems = [
  { label: 'Overview', href: '/graduation', icon: LayoutDashboard, description: 'Review candidate eligibility, clearance, ceremony planning, and alumni.' },
  { label: 'Candidate eligibility', href: '/graduation/eligibility', icon: GraduationCap, description: 'Verify academic completion and identify graduation candidates.' },
  { label: 'Clearance', href: '/graduation/clearances', icon: ShieldCheck, description: 'Track academic, finance, and library clearance requirements.' },
  { label: 'Ceremony planning', href: '/graduation/ceremony', icon: CalendarDays, description: 'Coordinate ceremony schedules, awards, and candidate logistics.' },
  { label: 'Alumni records', href: '/graduation/alumni', icon: UsersRound, description: 'Maintain graduate profiles and alumni engagement records.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const communicationsItems = [
  { label: 'Overview', href: '/communications', icon: LayoutDashboard, description: 'Review announcements, templates, campaigns, and delivery status.' },
  { label: 'Announcements', href: '/communications/announcements', icon: ClipboardList, description: 'Draft and publish audience-targeted institutional announcements.' },
  { label: 'Message templates', href: '/communications/templates', icon: FileText, description: 'Maintain approved templates for email, SMS, and in-app notices.' },
  { label: 'Campaigns', href: '/communications/campaigns', icon: UsersRound, description: 'Schedule controlled communications for selected audiences.' },
  { label: 'Delivery logs', href: '/communications/delivery', icon: ChartNoAxesCombined, description: 'Monitor delivery, failures, retries, and recipient responses.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const qualityItems = [
  { label: 'Overview', href: '/quality', icon: LayoutDashboard, description: 'Track evaluations, programme reviews, actions, and surveys.' },
  { label: 'Course evaluations', href: '/quality/evaluations', icon: ClipboardList, description: 'Review course feedback response rates and evaluation results.' },
  { label: 'Programme reviews', href: '/quality/programme-reviews', icon: GraduationCap, description: 'Coordinate periodic programme reviews and evidence submissions.' },
  { label: 'Improvement actions', href: '/quality/improvement-actions', icon: ShieldCheck, description: 'Track assigned quality actions, owners, deadlines, and outcomes.' },
  { label: 'Surveys & tracer studies', href: '/quality/surveys', icon: ChartNoAxesCombined, description: 'Manage institutional surveys and graduate tracer studies.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const procurementItems = [
  { label: 'Overview', href: '/procurement', icon: LayoutDashboard, description: 'Review requisitions, suppliers, stock, and institutional assets.' },
  { label: 'Requisitions', href: '/procurement/requisitions', icon: ClipboardList, description: 'Track requests, approvals, sourcing, and purchase orders.' },
  { label: 'Suppliers', href: '/procurement/suppliers', icon: Building2, description: 'Maintain supplier records, compliance documents, and performance.' },
  { label: 'Inventory & stores', href: '/procurement/inventory', icon: Library, description: 'Monitor stock levels, receipts, issues, and reorder alerts.' },
  { label: 'Asset register', href: '/procurement/assets', icon: ListTree, description: 'Track institutional assets, assignments, locations, and lifecycle.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const reportsItems = [
  { label: 'Overview', href: '/reports', icon: LayoutDashboard, description: 'Browse institutional, academic, finance, and operations reporting.' },
  { label: 'Institutional performance', href: '/reports/institutional', icon: ChartNoAxesCombined, description: 'Review enrolment, retention, completion, and institutional KPIs.' },
  { label: 'Academic outcomes', href: '/reports/academic-performance', icon: GraduationCap, description: 'Compare results, progression, course outcomes, and attendance.' },
  { label: 'Finance analytics', href: '/reports/finance-analytics', icon: CreditCard, description: 'Analyze billing, collections, balances, and receivables ageing.' },
  { label: 'Operations reports', href: '/reports/operations', icon: Settings2, description: 'Review service queues, processing times, and operational exceptions.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const administrationItems = [
  { label: 'Overview', href: '/administration', icon: LayoutDashboard, description: 'Monitor audit events, jobs, integrations, and data operations.' },
  { label: 'System health', href: '/administration/system-health', icon: ShieldCheck, description: 'Review service availability, scheduled checks, and system warnings.' },
  { label: 'Audit log', href: '/administration/audit-log', icon: ClipboardList, description: 'Inspect privileged actions with actor, timestamp, and resource context.' },
  { label: 'Jobs & integrations', href: '/administration/jobs-integrations', icon: ArrowRightLeft, description: 'Monitor background jobs, connector health, retries, and failures.' },
  { label: 'Imports & data quality', href: '/administration/imports', icon: FileText, description: 'Validate import batches and resolve data quality exceptions.' },
] satisfies Array<{ label: string; href: string; icon: LucideIcon; description: string }>

export const genericOperationalGroups = [
  { basePath: '/scholarships', items: scholarshipItems },
  { basePath: '/learning', items: learningItems },
  { basePath: '/library', items: libraryItems },
  { basePath: '/staff', items: staffItems },
  { basePath: '/accommodation', items: accommodationItems },
  { basePath: '/internship', items: internshipItems },
  { basePath: '/welfare', items: welfareItems },
  { basePath: '/graduation', items: graduationItems },
  { basePath: '/communications', items: communicationsItems },
  { basePath: '/quality', items: qualityItems },
  { basePath: '/procurement', items: procurementItems },
  { basePath: '/reports', items: reportsItems },
  { basePath: '/administration', items: administrationItems },
]

export const adminNavigationItems: NavigationItem[] = [
  { label: 'Users & roles', href: '/users', icon: ShieldCheck, permission: 'users.manage' },
  { label: 'System administration', href: '/administration', icon: Settings2, permission: 'administration.manage' },
  { label: 'Settings', href: '/settings', icon: Settings2, permission: 'settings.manage' },
]

export const roles: RoleTemplate[] = [
  {
    name: 'Super Administrator',
    shortName: 'SA',
    description: 'Full configuration, access, security, and institutional oversight.',
    color: '#174A84',
    permissions: navigationItems.concat(adminNavigationItems).map((item) => item.permission),
  },
  {
    name: 'ICT Administrator',
    shortName: 'IA',
    description: 'Technical operations, account support, and platform configuration.',
    color: '#16856B',
    permissions: ['dashboard.view', 'students.view', 'reports.view', 'users.manage', 'settings.manage'],
  },
  {
    name: 'Institution Head',
    shortName: 'IH',
    description: 'Read-only institutional performance, quality, and finance summaries.',
    color: '#7C3AED',
    permissions: ['dashboard.view', 'students.view', 'academics.view', 'finance.view', 'reports.view'],
  },
  {
    name: 'Academic Registrar',
    shortName: 'AR',
    description: 'Student records, registration, curricula, results, and academic reports.',
    color: '#B45309',
    permissions: ['dashboard.view', 'admissions.view', 'students.view', 'academics.view', 'registration.view', 'examinations.view', 'reports.view'],
  },
  {
    name: 'Finance Officer',
    shortName: 'FO',
    description: 'Fee structures, student accounts, reconciliations, and finance reporting.',
    color: '#15803D',
    permissions: ['dashboard.view', 'students.view', 'finance.view', 'reports.view'],
  },
  {
    name: 'Lecturer',
    shortName: 'LC',
    description: 'Assigned course delivery, attendance, assessment, and results workflows.',
    color: '#0369A1',
    permissions: ['dashboard.view', 'students.view', 'academics.view', 'examinations.view'],
  },
  {
    name: 'Student',
    shortName: 'ST',
    description: 'Personal registration, learning, results, finance, and support access.',
    color: '#64748B',
    permissions: ['dashboard.view', 'registration.view', 'examinations.view', 'finance.view'],
  },
]

roles.push(
  { name: 'Academic Director', shortName: 'AD', description: 'Institution-wide academic operations and approval oversight.', color: '#5B21B6', permissions: ['dashboard.view', 'academics.view', 'registration.view', 'timetabling.view', 'attendance.view', 'examinations.view', 'graduation.view', 'reports.view'] },
  { name: 'Deputy Registrar', shortName: 'DR', description: 'Academic records, registration, and student progression support.', color: '#7C3AED', permissions: ['dashboard.view', 'admissions.view', 'students.view', 'academics.view', 'registration.view', 'examinations.view', 'graduation.view', 'reports.view'] },
  { name: 'Faculty Registrar', shortName: 'FR', description: 'Faculty-level records, applications, registrations, and reports.', color: '#8B5CF6', permissions: ['dashboard.view', 'admissions.view', 'students.view', 'registration.view', 'examinations.view', 'reports.view'] },
  { name: 'Admissions Officer', shortName: 'AO', description: 'Application review, missing documents, decisions, and offers.', color: '#0E7490', permissions: ['dashboard.view', 'admissions.view', 'students.view', 'reports.view'] },
  { name: 'Dean / Faculty Head', shortName: 'DE', description: 'Faculty enrolment, teaching quality, progression, and moderation.', color: '#0369A1', permissions: ['dashboard.view', 'students.view', 'academics.view', 'timetabling.view', 'attendance.view', 'examinations.view', 'quality.view', 'reports.view'] },
  { name: 'Head of Department', shortName: 'HD', description: 'Department course offerings, lecturers, results, and performance.', color: '#0284C7', permissions: ['dashboard.view', 'students.view', 'academics.view', 'timetabling.view', 'attendance.view', 'examinations.view', 'reports.view'] },
  { name: 'Programme Coordinator', shortName: 'PC', description: 'Programme curriculum, course delivery, and student progression.', color: '#0891B2', permissions: ['dashboard.view', 'students.view', 'academics.view', 'registration.view', 'timetabling.view', 'examinations.view', 'reports.view'] },
  { name: 'Examination Officer', shortName: 'EO', description: 'Assessment processing, moderation, approvals, and publication readiness.', color: '#155E75', permissions: ['dashboard.view', 'students.view', 'examinations.view', 'reports.view'] },
  { name: 'Accounts Officer', shortName: 'AC', description: 'Payment entry, receipts, reconciliations, and student accounts.', color: '#166534', permissions: ['dashboard.view', 'students.view', 'finance.view', 'scholarships.view', 'reports.view'] },
  { name: 'Scholarship Officer', shortName: 'SO', description: 'Scholarship applications, awards, sponsor balances, and allocations.', color: '#15803D', permissions: ['dashboard.view', 'students.view', 'finance.view', 'scholarships.view', 'reports.view'] },
  { name: 'Human Resources Officer', shortName: 'HR', description: 'Staff profiles, contracts, qualifications, leave, and HR reports.', color: '#A16207', permissions: ['dashboard.view', 'staff.view', 'reports.view'] },
  { name: 'Librarian', shortName: 'LB', description: 'Catalogue, circulation, overdue records, fines, and clearance.', color: '#92400E', permissions: ['dashboard.view', 'library.view', 'reports.view'] },
  { name: 'Accommodation Officer', shortName: 'HA', description: 'Hostels, rooms, bed allocations, check-in, and occupancy.', color: '#9A3412', permissions: ['dashboard.view', 'accommodation.view', 'finance.view', 'reports.view'] },
  { name: 'Internship Coordinator', shortName: 'IC', description: 'Placements, supervisors, logbooks, and completion records.', color: '#6D28D9', permissions: ['dashboard.view', 'students.view', 'internship.view', 'reports.view'] },
  { name: 'Quality Assurance Officer', shortName: 'QA', description: 'Evaluations, programme reviews, surveys, and improvement actions.', color: '#4338CA', permissions: ['dashboard.view', 'academics.view', 'quality.view', 'reports.view'] },
  { name: 'Welfare Officer', shortName: 'WO', description: 'Restricted student support appointments, referrals, and follow-up.', color: '#BE185D', permissions: ['dashboard.view', 'students.view', 'welfare.view', 'reports.view'] },
  { name: 'Procurement Officer', shortName: 'PO', description: 'Suppliers, requisitions, stock movements, and asset registers.', color: '#475569', permissions: ['dashboard.view', 'procurement.view', 'reports.view'] },
  { name: 'Auditor', shortName: 'AU', description: 'Read-only review of authorised audit, academic, and financial records.', color: '#334155', permissions: ['dashboard.view', 'finance.view', 'examinations.view', 'reports.view', 'administration.manage'] },
  { name: 'Class Tutor', shortName: 'CT', description: 'Assigned students, attendance, advising, and support referrals.', color: '#0F766E', permissions: ['dashboard.view', 'students.view', 'attendance.view', 'welfare.view'] },
  { name: 'Parent / Sponsor', shortName: 'PS', description: 'Limited, explicitly linked student and fee visibility.', color: '#64748B', permissions: ['dashboard.view', 'finance.view'] },
)

export const students: StudentRecord[] = [
  { id: '24/BCS/0142', name: 'Aisha Namukasa', programme: 'BSc Computer Science', year: 'Year 2', status: 'Active', balance: 'UGX 680,000', lastSeen: 'Today, 09:42' },
  { id: '23/BBA/0871', name: 'Daniel Okello', programme: 'Bachelor of Business Admin', year: 'Year 3', status: 'Graduating', balance: 'UGX 0', lastSeen: 'Today, 08:18' },
  { id: '24/DCS/0256', name: 'Mariam Atim', programme: 'Diploma in Computing', year: 'Year 1', status: 'Active', balance: 'UGX 420,000', lastSeen: 'Yesterday, 17:04' },
  { id: '22/BED/0319', name: 'Peter Ssekabira', programme: 'Bachelor of Education', year: 'Year 4', status: 'On hold', balance: 'UGX 1,240,000', lastSeen: 'Yesterday, 15:27' },
  { id: '24/BIT/0053', name: 'Sarah Achieng', programme: 'BSc Information Technology', year: 'Year 1', status: 'Active', balance: 'UGX 0', lastSeen: '12 Nov, 10:56' },
]

export const studentProfiles: Record<string, StudentProfileData> = {
  '24/BCS/0142': {
    campus: 'Main campus', faculty: 'Faculty of Computing', department: 'Computer Science', semester: 'Semester II · 2025', intake: 'August 2024',
    email: 'aisha.namukasa@students.mmi.ac.ug', phone: '+256 772 410 284', dateOfBirth: '18 Mar 2005', gender: 'Female', address: 'Ntinda, Kampala',
    nextOfKin: { name: 'Margaret Namukasa', relationship: 'Mother', phone: '+256 701 338 290', email: 'margaret.namukasa@example.com' },
    statusHistory: [
      { date: '03 Feb 2025', status: 'Active', detail: 'Registered for Semester II · 2025' },
      { date: '12 Aug 2024', status: 'Active', detail: 'Student record activated after admission' },
      { date: '05 Aug 2024', status: 'Admitted', detail: 'Offer accepted for BSc Computer Science' },
    ],
    documents: [
      { name: 'National identity document', status: 'Verified', updated: '12 Aug 2024' },
      { name: 'UACE certificate', status: 'Verified', updated: '12 Aug 2024' },
      { name: 'Passport photograph', status: 'Received', updated: '10 Aug 2024' },
    ],
  },
  '23/BBA/0871': {
    campus: 'Main campus', faculty: 'Faculty of Business', department: 'Business Management', semester: 'Semester II · 2025', intake: 'August 2023',
    email: 'daniel.okello@students.mmi.ac.ug', phone: '+256 783 215 904', dateOfBirth: '02 Jul 2002', gender: 'Male', address: 'Kawempe, Kampala',
    nextOfKin: { name: 'Peter Okello', relationship: 'Father', phone: '+256 772 112 608', email: 'peter.okello@example.com' },
    statusHistory: [
      { date: '10 Jun 2025', status: 'Graduating', detail: 'Added to November graduation readiness review' },
      { date: '03 Feb 2025', status: 'Active', detail: 'Registered for Semester II · 2025' },
      { date: '14 Aug 2023', status: 'Active', detail: 'Student record activated after admission' },
    ],
    documents: [
      { name: 'National identity document', status: 'Verified', updated: '14 Aug 2023' },
      { name: 'UACE certificate', status: 'Verified', updated: '14 Aug 2023' },
      { name: 'Graduation clearance form', status: 'Pending', updated: '10 Jun 2025' },
    ],
  },
  '24/DCS/0256': {
    campus: 'Main campus', faculty: 'Faculty of Computing', department: 'Computer Science', semester: 'Semester II · 2025', intake: 'August 2024',
    email: 'mariam.atim@students.mmi.ac.ug', phone: '+256 758 204 117', dateOfBirth: '29 Nov 2006', gender: 'Female', address: 'Kira, Wakiso',
    nextOfKin: { name: 'Josephine Atim', relationship: 'Guardian', phone: '+256 704 603 421', email: 'josephine.atim@example.com' },
    statusHistory: [
      { date: '03 Feb 2025', status: 'Active', detail: 'Registered for Semester II · 2025' },
      { date: '15 Aug 2024', status: 'Active', detail: 'Student record activated after admission' },
      { date: '08 Aug 2024', status: 'Admitted', detail: 'Offer accepted for Diploma in Computing' },
    ],
    documents: [
      { name: 'National identity document', status: 'Received', updated: '15 Aug 2024' },
      { name: 'UCE certificate', status: 'Verified', updated: '15 Aug 2024' },
      { name: 'Passport photograph', status: 'Received', updated: '12 Aug 2024' },
    ],
  },
  '22/BED/0319': {
    campus: 'East campus', faculty: 'Faculty of Education', department: 'Teacher Education', semester: 'Semester II · 2025', intake: 'August 2022',
    email: 'peter.ssekabira@students.mmi.ac.ug', phone: '+256 772 551 806', dateOfBirth: '07 Jan 2001', gender: 'Male', address: 'Njeru, Buikwe',
    nextOfKin: { name: 'Ruth Ssekabira', relationship: 'Mother', phone: '+256 703 882 514', email: 'ruth.ssekabira@example.com' },
    statusHistory: [
      { date: '19 May 2025', status: 'On hold', detail: 'Registration paused pending finance review' },
      { date: '03 Feb 2025', status: 'Active', detail: 'Registered for Semester II · 2025' },
      { date: '16 Aug 2022', status: 'Active', detail: 'Student record activated after admission' },
    ],
    documents: [
      { name: 'National identity document', status: 'Verified', updated: '16 Aug 2022' },
      { name: 'UACE certificate', status: 'Verified', updated: '16 Aug 2022' },
      { name: 'Finance clearance', status: 'Pending', updated: '19 May 2025' },
    ],
  },
  '24/BIT/0053': {
    campus: 'Main campus', faculty: 'Faculty of Computing', department: 'Information Systems', semester: 'Semester II · 2025', intake: 'August 2024',
    email: 'sarah.achieng@students.mmi.ac.ug', phone: '+256 759 421 377', dateOfBirth: '11 Sep 2005', gender: 'Female', address: 'Kansanga, Kampala',
    nextOfKin: { name: 'Alice Achieng', relationship: 'Mother', phone: '+256 772 291 834', email: 'alice.achieng@example.com' },
    statusHistory: [
      { date: '03 Feb 2025', status: 'Active', detail: 'Registered for Semester II · 2025' },
      { date: '18 Aug 2024', status: 'Active', detail: 'Student record activated after admission' },
      { date: '09 Aug 2024', status: 'Admitted', detail: 'Offer accepted for BSc Information Technology' },
    ],
    documents: [
      { name: 'National identity document', status: 'Verified', updated: '18 Aug 2024' },
      { name: 'UACE certificate', status: 'Verified', updated: '18 Aug 2024' },
      { name: 'Passport photograph', status: 'Received', updated: '16 Aug 2024' },
    ],
  },
}

export const activities: ActivityItem[] = [
  { title: 'New application received', detail: 'Grace Nabbosa applied for BSc Computer Science', time: '12 min ago', tone: 'blue', icon: ClipboardList },
  { title: 'Payment reconciled', detail: '48 student payments matched to bank statement', time: '34 min ago', tone: 'teal', icon: CreditCard },
  { title: 'Results awaiting review', detail: 'CSC 204 has 6 missing marks to resolve', time: '1 hr ago', tone: 'amber', icon: BookOpen },
  { title: 'Graduation list exported', detail: 'November 2025 list is ready for approval', time: '2 hrs ago', tone: 'violet', icon: GraduationCap },
]

export const enrolmentData = [
  { month: 'Jan', students: 1840, applications: 420 },
  { month: 'Feb', students: 1970, applications: 510 },
  { month: 'Mar', students: 2050, applications: 498 },
  { month: 'Apr', students: 2140, applications: 625 },
  { month: 'May', students: 2260, applications: 710 },
  { month: 'Jun', students: 2320, applications: 694 },
  { month: 'Jul', students: 2380, applications: 755 },
  { month: 'Aug', students: 2470, applications: 840 },
  { month: 'Sep', students: 2560, applications: 912 },
  { month: 'Oct', students: 2640, applications: 876 },
  { month: 'Nov', students: 2710, applications: 942 },
  { month: 'Dec', students: 2846, applications: 968 },
]

export const facultyData = [
  { name: 'Computing', value: 32, color: '#174A84' },
  { name: 'Business', value: 24, color: '#16856B' },
  { name: 'Education', value: 18, color: '#7C3AED' },
  { name: 'Health sciences', value: 14, color: '#B45309' },
  { name: 'Other', value: 12, color: '#CBD5E1' },
]

export const pageMeta: Record<string, { eyebrow: string; title: string; description: string }> = {
  '/admissions': { eyebrow: 'Admissions office', title: 'Keep every application moving', description: 'Review intake activity, missing documents, and decision queues from one place.' },
  '/admissions/online-application': { eyebrow: 'Applicant portal', title: 'Apply to Peculiar Metropolitan Institute', description: 'Submit an application or track progress using your application reference.' },
  '/admissions/application-pipeline': { eyebrow: 'Admissions office', title: 'Application pipeline', description: 'Follow applicants from submission through review and decision stages.' },
  '/admissions/applicant-review': { eyebrow: 'Admissions office', title: 'Applicant review', description: 'Review shortlist quality, programme fit, and faculty-level decision readiness.' },
  '/admissions/document-verification': { eyebrow: 'Admissions office', title: 'Document verification', description: 'Monitor required documents, missing files, and verification completion.' },
  '/admissions/offers-decisions': { eyebrow: 'Admissions office', title: 'Offers & decisions', description: 'Manage offers, acceptances, waitlists, and programme allocation decisions.' },
  '/admissions/matriculation': { eyebrow: 'Enrollment services', title: 'Enrollment & matriculation', description: 'Move accepted applicants through confirmation, document clearance, student ID creation, and first registration.' },
  '/admissions/intake-planning': { eyebrow: 'Admissions office', title: 'Intake planning', description: 'Plan capacity, intakes, and applicant volume for each programme and campus.' },
  '/admissions/reports': { eyebrow: 'Admissions office', title: 'Reports & trends', description: 'Measure conversion rates and track admissions performance over time.' },
  '/students': { eyebrow: 'Student management', title: 'Student overview', description: 'Monitor student records, status distribution, and pending lifecycle work.' },
  '/students/directory': { eyebrow: 'Student management', title: 'Student directory', description: 'Search student records and review academic, contact, and document details.' },
  '/students/placement': { eyebrow: 'Student management', title: 'Placement & status', description: 'Review each student’s programme, campus, year, and current status.' },
  '/students/lifecycle': { eyebrow: 'Student management', title: 'Lifecycle requests', description: 'Coordinate student transfers, deferments, withdrawals, and reinstatements.' },
  '/students/documents': { eyebrow: 'Student management', title: 'Documents & verification', description: 'Monitor student document completeness and verification state.' },
  '/academics': { eyebrow: 'Academic structure', title: 'Academic structure overview', description: 'Explore how your institution, academic organisation, programmes, and policies fit together.' },
  '/academics/institutions': { eyebrow: 'Academic structure', title: 'Institutions & campuses', description: 'Manage institutional identity and the campuses where academic activity takes place.' },
  '/academics/faculties': { eyebrow: 'Academic structure', title: 'Faculties & schools', description: 'Organise academic departments under faculties, schools, and colleges.' },
  '/academics/departments': { eyebrow: 'Academic structure', title: 'Departments', description: 'Maintain departments and their parent academic units.' },
  '/academics/programmes': { eyebrow: 'Academic structure', title: 'Programmes', description: 'Define awards, study duration, and the academic units responsible for delivery.' },
  '/academics/courses': { eyebrow: 'Academic structure', title: 'Course units', description: 'Maintain course units, codes, credit units, and academic levels.' },
  '/academics/curricula': { eyebrow: 'Academic structure', title: 'Curriculum & credit units', description: 'Arrange course units into programme structures and progression requirements.' },
  '/academics/calendar': { eyebrow: 'Academic structure', title: 'Academic years & semesters', description: 'Configure academic years, semesters, and their key dates.' },
  '/academics/grading': { eyebrow: 'Academic structure', title: 'Grading systems', description: 'Configure grading scales and the rules used to interpret academic results.' },
  '/registration': { eyebrow: 'Semester operations', title: 'Registration control room', description: 'Track registration progress, exceptions, and credit-load compliance.' },
  '/registration/course-registration': { eyebrow: 'Semester operations', title: 'Course registration', description: 'Track student course selections and registration completion.' },
  '/registration/approvals': { eyebrow: 'Semester operations', title: 'Approvals & exceptions', description: 'Review pending approvals and resolve registration exceptions.' },
  '/registration/add-drop': { eyebrow: 'Semester operations', title: 'Add/drop requests', description: 'Process course changes within the approved registration window.' },
  '/registration/credit-load': { eyebrow: 'Semester operations', title: 'Credit-load compliance', description: 'Identify students outside programme credit-load rules.' },
  '/timetabling': { eyebrow: 'Teaching operations', title: 'Timetabling', description: 'Coordinate rooms, lecturers, exam slots, and conflict-free academic schedules.' },
  '/timetabling/schedules': { eyebrow: 'Teaching operations', title: 'Weekly schedules', description: 'Review teaching sessions by course, group, day, and time.' },
  '/timetabling/venues': { eyebrow: 'Teaching operations', title: 'Rooms & venues', description: 'Track venue capacity, utilization, and room availability.' },
  '/timetabling/lecturer-allocation': { eyebrow: 'Teaching operations', title: 'Lecturer allocation', description: 'Balance teaching assignments and lecturer availability.' },
  '/timetabling/conflicts': { eyebrow: 'Teaching operations', title: 'Conflict resolution', description: 'Resolve room, lecturer, and cohort scheduling clashes.' },
  '/attendance': { eyebrow: 'Teaching operations', title: 'Attendance', description: 'Monitor attendance sessions, corrections, and student participation signals.' },
  '/attendance/sessions': { eyebrow: 'Teaching operations', title: 'Sessions & registers', description: 'Track class registers and lecturer submission status by scheduled session.' },
  '/attendance/alerts': { eyebrow: 'Teaching operations', title: 'Attendance alerts', description: 'Follow students and cohorts below the institution attendance threshold.' },
  '/attendance/corrections': { eyebrow: 'Teaching operations', title: 'Correction requests', description: 'Review authorized requests to correct submitted attendance records.' },
  '/attendance/reports': { eyebrow: 'Teaching operations', title: 'Attendance reports & trends', description: 'Compare participation by course, programme, cohort, and teaching period.' },
  '/examinations': { eyebrow: 'Assessment & results', title: 'Examinations', description: 'Monitor marks entry, moderation, approvals, and publication readiness.' },
  '/examinations/assessment-setup': { eyebrow: 'Assessment & results', title: 'Assessment setup', description: 'Coordinate assessment components, schedules, and course coverage.' },
  '/examinations/marks-entry': { eyebrow: 'Assessment & results', title: 'Marks entry', description: 'Monitor marks submission and resolve missing result records.' },
  '/examinations/moderation': { eyebrow: 'Assessment & results', title: 'Moderation & approvals', description: 'Review moderated results and approval readiness.' },
  '/examinations/publication': { eyebrow: 'Assessment & results', title: 'Results publication', description: 'Control approved result release and publication status.' },
  '/finance': { eyebrow: 'Student finance', title: 'Finance overview', description: 'See fees, reconciliations, collections, and student account exceptions.' },
  '/finance/billing': { eyebrow: 'Student finance', title: 'Fees & billing', description: 'Review fee schedules, invoices, and billing batches.' },
  '/finance/reconciliation': { eyebrow: 'Student finance', title: 'Payments & reconciliation', description: 'Match received payments and resolve unmatched transactions.' },
  '/finance/accounts': { eyebrow: 'Student finance', title: 'Student accounts', description: 'Review balances, statements, and account holds.' },
  '/finance/refunds': { eyebrow: 'Student finance', title: 'Refunds & adjustments', description: 'Process adjustment requests and controlled refund approvals.' },
  '/scholarships': { eyebrow: 'Student finance', title: 'Scholarships & sponsorships', description: 'Manage approved awards, sponsor allocations, limits, and student funding.' },
  '/learning': { eyebrow: 'Learning resources', title: 'Learning resources', description: 'Organize course materials, assignments, submissions, and learner access.' },
  '/library': { eyebrow: 'Library services', title: 'Library management', description: 'Keep catalogues, circulation, overdue items, and clearance visible.' },
  '/staff': { eyebrow: 'People operations', title: 'Staff & HR', description: 'Maintain staff profiles, contracts, qualifications, leave, and workload.' },
  '/accommodation': { eyebrow: 'Campus life', title: 'Accommodation', description: 'Manage residences, rooms, allocations, check-ins, and occupancy.' },
  '/internship': { eyebrow: 'Experiential learning', title: 'Internship & research', description: 'Track placements, supervisors, logbooks, research projects, and approvals.' },
  '/welfare': { eyebrow: 'Student support', title: 'Student welfare', description: 'Coordinate restricted support cases, appointments, and follow-up tasks.' },
  '/graduation': { eyebrow: 'Completion & alumni', title: 'Graduation & alumni', description: 'Review academic, financial, and library clearance before graduation.' },
  '/communications': { eyebrow: 'Institution communications', title: 'Communications', description: 'Create announcements, templates, and controlled notification campaigns.' },
  '/quality': { eyebrow: 'Quality assurance', title: 'Quality assurance', description: 'Track evaluations, programme performance, surveys, and improvement actions.' },
  '/procurement': { eyebrow: 'Operations', title: 'Procurement & inventory', description: 'Coordinate suppliers, requisitions, stock movements, and institutional assets.' },
  '/administration': { eyebrow: 'Platform governance', title: 'System administration & audit', description: 'Monitor health, audit events, jobs, integrations, imports, and operational controls.' },
  '/reports': { eyebrow: 'Institutional intelligence', title: 'Reports & analytics', description: 'Build a clear view of institutional performance and operational health.' },
  '/users': { eyebrow: 'Access governance', title: 'Users & roles', description: 'Configure permission-led access for staff and institutional users.' },
  '/settings': { eyebrow: 'Institution configuration', title: 'Settings', description: 'Shape the institution identity, visual system, and operational preferences.' },
  '/settings/identity': { eyebrow: 'Institution configuration', title: 'Institution identity', description: 'Maintain the institution name, logo, location, and official contact details.' },
  '/settings/appearance': { eyebrow: 'Institution configuration', title: 'Theme & appearance', description: 'Configure the visual system and display mode for the workspace.' },
  '/settings/calendar': { eyebrow: 'Institution configuration', title: 'Academic calendar', description: 'Set the active academic year, semester, and teaching period dates.' },
  '/settings/notifications': { eyebrow: 'Institution configuration', title: 'Notifications', description: 'Choose which operational updates reach this workspace.' },
  '/settings/roles': { eyebrow: 'Institution configuration', title: 'Roles & permissions', description: 'Review access templates and permission governance.' },
  '/settings/security': { eyebrow: 'Institution configuration', title: 'Security policy', description: 'Configure session policy, password guidance, and privileged action review.' },
  '/settings/defaults': { eyebrow: 'Institution configuration', title: 'System defaults', description: 'Set record formats, academic defaults, and retention periods.' },
  '/settings/integrations': { eyebrow: 'Institution configuration', title: 'Integrations', description: 'Review connector endpoints, environment settings, and preview checks.' },
  '/settings/backups': { eyebrow: 'Institution configuration', title: 'Backups & restore', description: 'Export local settings, configure retention, and restore an approved settings backup.' },
}

export const moduleRows: Record<string, Array<Record<string, string>>> = {
  '/admissions': [
    { reference: 'APP-2025-0942', applicant: 'Grace Nabbosa', programme: 'BSc Computer Science', intake: 'August 2025', status: 'Under review' },
    { reference: 'APP-2025-0938', applicant: 'Isaac Kato', programme: 'Diploma in Business', intake: 'August 2025', status: 'Missing documents' },
    { reference: 'APP-2025-0926', applicant: 'Lydia Auma', programme: 'Bachelor of Education', intake: 'August 2025', status: 'Offer ready' },
    { reference: 'APP-2025-0890', applicant: 'Moses Tumusiime', programme: 'BSc Information Technology', intake: 'August 2025', status: 'Accepted' },
  ],
  '/admissions/matriculation': [
    { reference: 'ENR-2026-0142', applicant: 'Grace Nabbosa', programme: 'BSc Computer Science · August 2026', intake: 'Identity verified · student ID pending', status: 'Needs attention' },
    { reference: 'ENR-2026-0138', applicant: 'Isaac Kato', programme: 'Diploma in Business · August 2026', intake: 'Documents cleared · fees confirmed', status: 'Ready to enroll' },
    { reference: 'ENR-2026-0126', applicant: 'Lydia Auma', programme: 'Bachelor of Education · August 2026', intake: 'Offer accepted · clearance in review', status: 'Under review' },
    { reference: 'ENR-2026-0090', applicant: 'Moses Tumusiime', programme: 'BSc Information Technology · August 2026', intake: 'Student ID issued · registration started', status: 'Enrolled' },
  ],
  '/admissions/application-pipeline': [
    { reference: 'APP-2025-1102', applicant: 'Annette Muwonge', programme: 'BSc Computer Science', intake: 'August 2025', status: 'Fresh application' },
    { reference: 'APP-2025-1098', applicant: 'Benard Sserunjogi', programme: 'BBA', intake: 'August 2025', status: 'Screening' },
    { reference: 'APP-2025-1087', applicant: 'Patricia Kintu', programme: 'Bachelor of Education', intake: 'August 2025', status: 'Faculty review' },
    { reference: 'APP-2025-1074', applicant: 'Joseph Kasozi', programme: 'BSc Information Technology', intake: 'August 2025', status: 'Under review' },
  ],
  '/admissions/applicant-review': [
    { reference: 'REV-2025-204', applicant: 'Sharon Nalubega', programme: 'BSC-Computer Science', intake: 'Top candidate', status: 'Shortlisted' },
    { reference: 'REV-2025-198', applicant: 'Allan Lwanga', programme: 'Diploma in Business', intake: 'Needs interview', status: 'Pending' },
    { reference: 'REV-2025-189', applicant: 'Florence Nakato', programme: 'Bachelor of Education', intake: 'Strong academic fit', status: 'Approved' },
    { reference: 'REV-2025-176', applicant: 'Martin Kafuko', programme: 'BSc Information Technology', intake: 'Faculty follow-up', status: 'Needs attention' },
  ],
  '/admissions/document-verification': [
    { reference: 'DOC-ADM-522', applicant: 'Diana Nakyanzi', programme: 'BSC-Computer Science', intake: 'Identity + certificate', status: 'Missing documents' },
    { reference: 'DOC-ADM-519', applicant: 'Ronald Mwesigwa', programme: 'Bachelor of Education', intake: 'Transcript review', status: 'Under review' },
    { reference: 'DOC-ADM-501', applicant: 'Mildred Nalubwama', programme: 'BBA', intake: 'Verified', status: 'Completed' },
    { reference: 'DOC-ADM-487', applicant: 'Emmanuel Tusiime', programme: 'BSc Information Technology', intake: 'Passport photo', status: 'Pending' },
  ],
  '/admissions/offers-decisions': [
    { reference: 'OFR-2025-011', applicant: 'Ruth Atim', programme: 'BSc Computer Science', intake: 'Offer issued', status: 'Offer ready' },
    { reference: 'OFR-2025-009', applicant: 'Michael Opio', programme: 'Diploma in Business', intake: 'Awaiting acceptance', status: 'Pending' },
    { reference: 'OFR-2025-003', applicant: 'Benedict Kibirige', programme: 'BBA', intake: 'Waitlist', status: 'Waitlist' },
    { reference: 'OFR-2025-001', applicant: 'Faith Nakitto', programme: 'Bachelor of Education', intake: 'Accepted', status: 'Accepted' },
  ],
  '/admissions/intake-planning': [
    { reference: 'INT-2025-A', applicant: 'August 2025 intake', programme: 'Capacity tracking', intake: 'Main campus', status: 'On track' },
    { reference: 'INT-2025-B', applicant: 'East campus', programme: 'Education programmes', intake: 'Quota review', status: 'Needs attention' },
    { reference: 'INT-2025-C', applicant: 'Computer science', programme: 'High demand cohort', intake: 'Capacity warning', status: 'At risk' },
    { reference: 'INT-2025-D', applicant: 'Business faculty', programme: 'Seats still open', intake: 'Healthy demand', status: 'Open' },
  ],
  '/admissions/reports': [
    { reference: 'RPT-ADM-01', applicant: 'Application conversion', programme: 'Aug 2025 intake', intake: '67% conversion', status: 'Ready' },
    { reference: 'RPT-ADM-02', applicant: 'Decision turnaround', programme: 'Average 9 days', intake: 'Review cycle', status: 'Ready' },
    { reference: 'RPT-ADM-03', applicant: 'Campus split', programme: 'Main 68% · East 32%', intake: 'Applicant mix', status: 'Ready' },
    { reference: 'RPT-ADM-04', applicant: 'Document completion', programme: '89% complete', intake: 'Current cycle', status: 'Needs attention' },
  ],
  '/students': [
    { reference: 'INT-2025-001', applicant: 'Student lifecycle overview', programme: '2,846 active students', intake: 'Semester II · 2025', status: 'Active' },
    { reference: 'INT-2025-002', applicant: 'Placement review', programme: '184 students awaiting final placement', intake: 'Faculty review', status: 'Under review' },
    { reference: 'INT-2025-003', applicant: 'Document verification', programme: '37 records pending', intake: 'Registry queue', status: 'Needs attention' },
    { reference: 'INT-2025-004', applicant: 'Lifecycle actions', programme: '12 transfer requests', intake: 'Academic registrar', status: 'Active' },
  ],
  '/students/directory': [
    { reference: '24/BCS/0142', applicant: 'Aisha Namukasa', programme: 'BSc Computer Science', intake: 'Year 2', status: 'Active' },
    { reference: '23/BBA/0871', applicant: 'Daniel Okello', programme: 'Bachelor of Business Admin', intake: 'Year 3', status: 'Graduating' },
    { reference: '24/DCS/0256', applicant: 'Mariam Atim', programme: 'Diploma in Computing', intake: 'Year 1', status: 'Active' },
    { reference: '22/BED/0319', applicant: 'Peter Ssekabira', programme: 'Bachelor of Education', intake: 'Year 4', status: 'On hold' },
  ],
  '/students/placement': [
    { reference: 'PL-2025-204', applicant: 'Faculty placement review', programme: 'Computing · 920 students', intake: 'Main campus', status: 'Active' },
    { reference: 'PL-2025-118', applicant: 'Programme allocation', programme: 'Business · 714 students', intake: 'Main campus', status: 'Under review' },
    { reference: 'PL-2025-092', applicant: 'Year-level status', programme: 'Year 3 learners', intake: 'Faculty review', status: 'Needs attention' },
    { reference: 'PL-2025-047', applicant: 'Campus distribution', programme: '2,846 records', intake: 'All campuses', status: 'Active' },
  ],
  '/students/lifecycle': [
    { reference: 'LIF-2025-014', applicant: 'Transfer requests', programme: '6 pending approvals', intake: 'Registrar office', status: 'Under review' },
    { reference: 'LIF-2025-021', applicant: 'Deferment cases', programme: '12 students', intake: 'Academic board', status: 'Needs attention' },
    { reference: 'LIF-2025-033', applicant: 'Withdrawal review', programme: '4 students', intake: 'Welfare committee', status: 'Active' },
    { reference: 'LIF-2025-041', applicant: 'Reinstatement requests', programme: '3 cases', intake: 'Academic registrar', status: 'Active' },
  ],
  '/students/documents': [
    { reference: 'DOC-2025-221', applicant: 'Identity document verification', programme: '18 pending', intake: 'Admissions office', status: 'Needs attention' },
    { reference: 'DOC-2025-333', applicant: 'Academic transcripts', programme: '96 received', intake: 'Registry', status: 'Active' },
    { reference: 'DOC-2025-412', applicant: 'Finance clearance', programme: '42 pending', intake: 'Accounts office', status: 'Under review' },
    { reference: 'DOC-2025-508', applicant: 'Graduation packs', programme: '184 ready for check', intake: 'Final clearance', status: 'Active' },
  ],
  '/academics': [
    { reference: 'BSC-CS', applicant: 'BSc Computer Science', programme: 'Faculty of Computing', intake: '4 years · 128 credits', status: 'Active' },
    { reference: 'BBA', applicant: 'Bachelor of Business Admin', programme: 'Faculty of Business', intake: '3 years · 108 credits', status: 'Active' },
    { reference: 'DCS', applicant: 'Diploma in Computing', programme: 'Faculty of Computing', intake: '2 years · 80 credits', status: 'Draft' },
    { reference: 'BED', applicant: 'Bachelor of Education', programme: 'Faculty of Education', intake: '4 years · 132 credits', status: 'Active' },
  ],
  '/academics/institutions': [
    { reference: 'MMI', applicant: 'Peculiar Metropolitan Institute', programme: 'Kampala, Uganda', intake: 'University', status: 'Active' },
    { reference: 'CAMP-MAIN', applicant: 'Main campus', programme: 'Kampala', intake: 'Institution campus', status: 'Active' },
    { reference: 'CAMP-EAST', applicant: 'East campus', programme: 'Jinja', intake: 'Institution campus', status: 'Active' },
  ],
  '/academics/faculties': [
    { reference: 'FOC', applicant: 'Faculty of Computing', programme: '3 departments', intake: 'Main campus', status: 'Active' },
    { reference: 'FOB', applicant: 'Faculty of Business', programme: '4 departments', intake: 'Main campus', status: 'Active' },
    { reference: 'FOE', applicant: 'Faculty of Education', programme: '3 departments', intake: 'East campus', status: 'Active' },
  ],
  '/academics/departments': [
    { reference: 'CS', applicant: 'Computer Science', programme: 'Faculty of Computing', intake: '8 course units', status: 'Active' },
    { reference: 'IS', applicant: 'Information Systems', programme: 'Faculty of Computing', intake: '6 course units', status: 'Active' },
    { reference: 'BM', applicant: 'Business Management', programme: 'Faculty of Business', intake: '7 course units', status: 'Active' },
  ],
  '/academics/programmes': [
    { reference: 'BSC-CS', applicant: 'BSc Computer Science', programme: 'Faculty of Computing', intake: '4 years · 128 credits', status: 'Active' },
    { reference: 'BBA', applicant: 'Bachelor of Business Admin', programme: 'Faculty of Business', intake: '3 years · 108 credits', status: 'Active' },
    { reference: 'DCS', applicant: 'Diploma in Computing', programme: 'Faculty of Computing', intake: '2 years · 80 credits', status: 'Draft' },
  ],
  '/academics/courses': [
    { reference: 'CSC 101', applicant: 'Introduction to Computing', programme: '4 credit units', intake: 'Year 1 · Semester I', status: 'Active' },
    { reference: 'CSC 204', applicant: 'Data Structures', programme: '4 credit units', intake: 'Year 2 · Semester II', status: 'Active' },
    { reference: 'BBA 310', applicant: 'Strategic Management', programme: '3 credit units', intake: 'Year 3 · Semester I', status: 'Active' },
  ],
  '/academics/curricula': [
    { reference: 'CUR-BSC-CS-25', applicant: 'BSc Computer Science · 2025', programme: '32 course units', intake: '128 credit units', status: 'Active' },
    { reference: 'CUR-BBA-25', applicant: 'Bachelor of Business Admin · 2025', programme: '30 course units', intake: '108 credit units', status: 'Active' },
    { reference: 'CUR-DCS-DRAFT', applicant: 'Diploma in Computing · 2025', programme: '20 course units', intake: '80 credit units', status: 'Draft' },
  ],
  '/academics/calendar': [
    { reference: 'AY-2025', applicant: 'Academic year 2025', programme: '1 Aug 2025 – 31 Jul 2026', intake: '2 semesters', status: 'Active' },
    { reference: 'SEM-II-2025', applicant: 'Semester II · 2025', programme: '1 Feb – 30 Jun 2026', intake: 'Registration open', status: 'Active' },
    { reference: 'SEM-I-2026', applicant: 'Semester I · 2026', programme: '1 Aug – 31 Dec 2026', intake: 'Planning', status: 'Draft' },
  ],
  '/academics/grading': [
    { reference: 'UG-CLASSIC', applicant: 'Undergraduate 0–100', programme: 'A – F · 7 bands', intake: 'Undergraduate awards', status: 'Active' },
    { reference: 'DIP-CLASSIC', applicant: 'Diploma 0–100', programme: 'A – F · 6 bands', intake: 'Diploma awards', status: 'Active' },
    { reference: 'PG-4PT', applicant: 'Postgraduate 4-point GPA', programme: 'A – F · 5 bands', intake: 'Postgraduate awards', status: 'Draft' },
  ],
  '/registration': [
    { reference: 'REG-0821', applicant: 'Semester registration', programme: '2,184 students started', intake: 'Deadline · 22 Aug', status: 'On track' },
    { reference: 'REG-0798', applicant: 'Outstanding approvals', programme: '146 student records', intake: 'Registrar queue', status: 'Needs attention' },
    { reference: 'REG-0780', applicant: 'Credit-load exceptions', programme: '38 students', intake: 'Faculty review', status: 'Under review' },
    { reference: 'REG-0744', applicant: 'Add/drop requests', programme: '212 submissions', intake: 'Window closes · 29 Aug', status: 'Open' },
  ],
  '/examinations': [
    { reference: 'CSC 204', applicant: 'Data Structures', programme: 'Dr. Sarah Nansubuga', intake: '86% entered', status: 'Under review' },
    { reference: 'BBA 310', applicant: 'Strategic Management', programme: 'Mr. Brian Ouma', intake: '100% entered', status: 'Ready to approve' },
    { reference: 'BED 402', applicant: 'Education Policy', programme: 'Ms. Irene Akello', intake: '94% entered', status: 'Missing marks' },
    { reference: 'HSC 202', applicant: 'Community Health', programme: 'Dr. Joseph Mugisha', intake: '100% entered', status: 'Published' },
  ],
  '/finance': [
    { reference: 'INV-2025-00821', applicant: 'Semester billing', programme: 'UGX 4.82B invoiced', intake: 'August 2025 intake', status: 'Posted' },
    { reference: 'PAY-2025-07104', applicant: 'Bank reconciliation', programme: 'UGX 186.4M unmatched', intake: '17 Aug 2025', status: 'Needs attention' },
    { reference: 'SCH-2025-00198', applicant: 'Scholarship allocation', programme: '82 sponsored students', intake: 'Education fund', status: 'Approved' },
    { reference: 'REF-2025-00047', applicant: 'Refund requests', programme: '6 pending approvals', intake: 'Finance committee', status: 'Under review' },
  ],
  '/reports': [
    { reference: 'RPT-001', applicant: 'Enrolment & retention', programme: 'Institution-wide', intake: 'Updated today', status: 'Ready' },
    { reference: 'RPT-002', applicant: 'Course performance', programme: 'Academic year 2025', intake: 'Updated yesterday', status: 'Ready' },
    { reference: 'RPT-003', applicant: 'Receivables ageing', programme: 'Student accounts', intake: 'Updated today', status: 'Ready' },
    { reference: 'RPT-004', applicant: 'Graduation readiness', programme: 'November 2025 cohort', intake: 'Updated 2 hrs ago', status: 'Draft' },
  ],
  '/learning': [
    { reference: 'LMS-204', applicant: 'Data Structures · Course materials', programme: 'CSC 204', intake: '12 resources · 86 learners', status: 'Published' },
    { reference: 'ASM-118', applicant: 'Strategic Management · Assignment 2', programme: 'BBA 310', intake: 'Due 22 Aug 2025', status: 'Open' },
    { reference: 'SUB-309', applicant: 'Community Health · Submissions', programme: 'HSC 202', intake: '74 of 86 submitted', status: 'Under review' },
    { reference: 'ANN-082', applicant: 'Semester opening announcement', programme: 'Institution-wide', intake: 'Published 17 Aug', status: 'Published' },
  ],
  '/library': [
    { reference: 'LIB-001', applicant: 'Library catalogue', programme: '12,840 records', intake: '3 campuses', status: 'Active' },
    { reference: 'CIR-2025-82', applicant: 'Circulation today', programme: '186 loans · 94 returns', intake: '17 Aug 2025', status: 'Posted' },
    { reference: 'OVD-114', applicant: 'Overdue items', programme: '114 items · UGX 2.8M fines', intake: 'Needs follow-up', status: 'Needs attention' },
    { reference: 'CLR-092', applicant: 'Clearance requests', programme: '82 graduating students', intake: 'November 2025 cohort', status: 'Under review' },
  ],
  '/staff': [
    { reference: 'STF-0018', applicant: 'Dr. Sarah Nansubuga', programme: 'Faculty of Computing', intake: 'Lecturer · Full time', status: 'Active' },
    { reference: 'STF-0024', applicant: 'Mr. Brian Ouma', programme: 'Faculty of Business', intake: 'Senior lecturer · Full time', status: 'Active' },
    { reference: 'LV-2025-118', applicant: 'Leave approvals', programme: '12 pending requests', intake: 'HR queue', status: 'Under review' },
    { reference: 'CTR-2025-42', applicant: 'Contract renewals', programme: '8 contracts this month', intake: 'Due 31 Aug', status: 'Needs attention' },
  ],
  '/accommodation': [
    { reference: 'RES-01', applicant: 'North Residence', programme: '240 beds · 92% occupied', intake: 'Main campus', status: 'Active' },
    { reference: 'RES-02', applicant: 'East Residence', programme: '180 beds · 78% occupied', intake: 'Main campus', status: 'Active' },
    { reference: 'ACC-2025-214', applicant: 'Allocation requests', programme: '214 submissions', intake: 'August intake', status: 'Under review' },
    { reference: 'CLR-2025-31', applicant: 'Check-out exceptions', programme: '31 open tasks', intake: 'Residence office', status: 'Needs attention' },
  ],
  '/internship': [
    { reference: 'INT-2025-045', applicant: 'Industry placements', programme: '156 students placed', intake: 'Semester II · 2025', status: 'Active' },
    { reference: 'LOG-2025-88', applicant: 'Logbook reviews', programme: '88 awaiting supervisor review', intake: 'Placement office', status: 'Under review' },
    { reference: 'RES-0012', applicant: 'Research proposals', programme: '12 active proposals', intake: 'Graduate school', status: 'Active' },
    { reference: 'SUP-0048', applicant: 'Supervisor assignments', programme: '48 pending matches', intake: 'This week', status: 'Needs attention' },
  ],
  '/welfare': [
    { reference: 'WEL-2025-011', applicant: 'Support appointments', programme: '32 this week', intake: 'Counselling centre', status: 'Active' },
    { reference: 'REF-2025-008', applicant: 'Restricted referrals', programme: '8 authorised referrals', intake: 'Access audited', status: 'Under review' },
    { reference: 'FUP-2025-041', applicant: 'Follow-up tasks', programme: '41 open tasks', intake: 'Welfare office', status: 'Needs attention' },
    { reference: 'WEL-2025-002', applicant: 'Closed support cases', programme: '126 this year', intake: 'Confidential', status: 'Published' },
  ],
  '/graduation': [
    { reference: 'GRAD-2025-11', applicant: 'November graduation list', programme: '184 candidates', intake: 'Final clearance', status: 'Under review' },
    { reference: 'CLR-ACA-204', applicant: 'Academic clearance', programme: '184 candidates', intake: '172 complete', status: 'Needs attention' },
    { reference: 'CLR-FIN-198', applicant: 'Financial clearance', programme: '184 candidates', intake: '168 complete', status: 'Under review' },
    { reference: 'ALUM-2025-04', applicant: 'Alumni registrations', programme: 'April cohort · 142', intake: 'Updated today', status: 'Ready' },
  ],
  '/communications': [
    { reference: 'ANN-2025-081', applicant: 'Semester registration reminder', programme: 'Students · SMS + email', intake: 'Sent 17 Aug', status: 'Published' },
    { reference: 'NTF-2025-114', applicant: 'Results publication notice', programme: 'CSC 204 cohort', intake: 'Scheduled 22 Aug', status: 'Draft' },
    { reference: 'TMP-2025-014', applicant: 'Admissions offer template', programme: 'Applicants', intake: 'Email template', status: 'Active' },
    { reference: 'CMP-2025-002', applicant: 'Graduation campaign', programme: 'November cohort', intake: '4 messages planned', status: 'Under review' },
  ],
}

Object.assign(moduleRows, {
  '/timetabling': [
    { reference: 'TT-2026-08', applicant: 'Semester II teaching schedule', programme: '412 sessions · 186 course units', intake: '18 venues · 3 campuses', status: 'Published' },
    { reference: 'TT-ROOM-12', applicant: 'Room and venue clashes', programme: '12 conflicts detected', intake: 'Scheduling office', status: 'Needs attention' },
    { reference: 'TT-LECT-19', applicant: 'Lecturer allocation exceptions', programme: '19 assignments to review', intake: 'Faculty review', status: 'Under review' },
    { reference: 'TT-CAP-03', applicant: 'Venue capacity check', programme: '84% average utilization', intake: 'All campuses', status: 'On track' },
  ],
  '/timetabling/schedules': [
    { reference: 'SCH-2026-0412', applicant: 'CSC 204 · Data Structures', programme: 'Year 2 · Dr. Sarah Nansubuga', intake: 'Mon · 09:00–11:00 · Lab 2', status: 'Published' },
    { reference: 'SCH-2026-0398', applicant: 'BBA 310 · Strategic Management', programme: 'Year 3 · Mr. Brian Ouma', intake: 'Tue · 11:00–13:00 · Hall A', status: 'Published' },
    { reference: 'SCH-2026-0376', applicant: 'BED 402 · Education Policy', programme: 'Year 4 · Ms. Irene Akello', intake: 'Wed · 14:00–16:00 · Room E12', status: 'Needs attention' },
    { reference: 'SCH-2026-0354', applicant: 'HSC 202 · Community Health', programme: 'Year 2 · Dr. Joseph Mugisha', intake: 'Thu · 08:00–10:00 · Hall B', status: 'Under review' },
  ],
  '/timetabling/venues': [
    { reference: 'VEN-MAIN-02', applicant: 'Lecture Hall A', programme: 'Capacity 240 · Main campus', intake: 'Weekly utilization · 91%', status: 'Active' },
    { reference: 'VEN-MAIN-14', applicant: 'Computing Lab 2', programme: 'Capacity 48 · Main campus', intake: 'Weekly utilization · 86%', status: 'Active' },
    { reference: 'VEN-EAST-08', applicant: 'East Campus Room E12', programme: 'Capacity 80 · East campus', intake: 'Weekly utilization · 72%', status: 'Active' },
    { reference: 'VEN-MAIN-21', applicant: 'Science Lab 1', programme: 'Capacity 36 · Main campus', intake: 'Maintenance hold · 2 days', status: 'Needs attention' },
  ],
  '/timetabling/lecturer-allocation': [
    { reference: 'LOAD-2026-018', applicant: 'Dr. Sarah Nansubuga', programme: '18 contact hours · 6 sessions', intake: 'Faculty of Computing', status: 'On track' },
    { reference: 'LOAD-2026-014', applicant: 'Mr. Brian Ouma', programme: '22 contact hours · 8 sessions', intake: 'Faculty of Business', status: 'Needs attention' },
    { reference: 'LOAD-2026-011', applicant: 'Ms. Irene Akello', programme: '16 contact hours · 5 sessions', intake: 'Faculty of Education', status: 'On track' },
    { reference: 'LOAD-2026-006', applicant: 'Dr. Joseph Mugisha', programme: 'Availability not confirmed', intake: 'Health Sciences', status: 'Pending' },
  ],
  '/timetabling/conflicts': [
    { reference: 'CON-2026-012', applicant: 'Lab 2 · CSC 204 / CSC 210', programme: 'Room overlap · Monday 09:00', intake: 'Faculty of Computing', status: 'Needs attention' },
    { reference: 'CON-2026-009', applicant: 'Dr. Brian Ouma · BBA 310 / BBA 312', programme: 'Lecturer overlap · Tuesday 11:00', intake: 'Faculty of Business', status: 'Under review' },
    { reference: 'CON-2026-006', applicant: 'Year 1 Computing cohort', programme: 'Cohort overlap · Wednesday 14:00', intake: 'Main campus', status: 'Pending' },
    { reference: 'CON-2026-003', applicant: 'Hall B capacity check', programme: 'Enrollment exceeds room limit', intake: 'Health Sciences', status: 'Resolved' },
  ],
  '/attendance': [
    { reference: 'ATT-2026-081', applicant: 'Scheduled class registers', programme: '186 sessions this week', intake: 'Semester II · 2026', status: 'Active' },
    { reference: 'ATT-LOW-22', applicant: 'Low attendance alerts', programme: '22 students below 75%', intake: 'Academic adviser queue', status: 'Needs attention' },
    { reference: 'ATT-COR-08', applicant: 'Correction requests', programme: '8 authorized requests', intake: 'Registrar review', status: 'Under review' },
    { reference: 'ATT-RPT-02', applicant: 'Participation summary', programme: 'All faculties', intake: 'Updated today', status: 'Ready' },
  ],
  '/attendance/sessions': [
    { reference: 'SES-2026-412', applicant: 'CSC 204 · Data Structures', programme: 'Year 2 · Dr. Sarah Nansubuga', intake: 'Mon · 09:00 · Lab 2', status: 'Submitted' },
    { reference: 'SES-2026-398', applicant: 'BBA 310 · Strategic Management', programme: 'Year 3 · Mr. Brian Ouma', intake: 'Tue · 11:00 · Hall A', status: 'In progress' },
    { reference: 'SES-2026-376', applicant: 'BED 402 · Education Policy', programme: 'Year 4 · Ms. Irene Akello', intake: 'Wed · 14:00 · Room E12', status: 'Not submitted' },
    { reference: 'SES-2026-354', applicant: 'HSC 202 · Community Health', programme: 'Year 2 · Dr. Joseph Mugisha', intake: 'Thu · 08:00 · Hall B', status: 'Submitted' },
  ],
  '/attendance/alerts': [
    { reference: 'ALR-2026-022', applicant: 'Mariam Atim · DCS Year 1', programme: 'Attendance 62% · CSC 101', intake: 'Advisor follow-up', status: 'Needs attention' },
    { reference: 'ALR-2026-018', applicant: 'Peter Ssekabira · BED Year 4', programme: 'Attendance 68% · EDU 402', intake: '3 consecutive absences', status: 'Under review' },
    { reference: 'ALR-2026-014', applicant: 'Computing Year 2 cohort', programme: 'Course attendance 71% · CSC 204', intake: 'Lecturer follow-up', status: 'Open' },
    { reference: 'ALR-2026-009', applicant: 'Sarah Achieng · BIT Year 1', programme: 'Attendance 73% · BIT 105', intake: 'Advisor notified', status: 'Resolved' },
  ],
  '/attendance/corrections': [
    { reference: 'COR-2026-008', applicant: 'Aisha Namukasa', programme: 'CSC 204 · 12 Nov · Marked absent', intake: 'Lecturer evidence attached', status: 'Under review' },
    { reference: 'COR-2026-007', applicant: 'Daniel Okello', programme: 'BBA 310 · 10 Nov · Late arrival', intake: 'Faculty registrar', status: 'Pending' },
    { reference: 'COR-2026-005', applicant: 'Mariam Atim', programme: 'DCS 102 · 08 Nov · Marked absent', intake: 'Class tutor confirmation', status: 'Needs attention' },
    { reference: 'COR-2026-003', applicant: 'Peter Ssekabira', programme: 'EDU 402 · 06 Nov · Present', intake: 'Approved by registrar', status: 'Approved' },
  ],
  '/attendance/reports': [
    { reference: 'RPT-ATT-01', applicant: 'Institutional participation', programme: 'All campuses · 82% average', intake: 'Semester II · 2026', status: 'Ready' },
    { reference: 'RPT-ATT-02', applicant: 'Low-attendance students', programme: '22 students below 75%', intake: 'Advisor action list', status: 'Needs attention' },
    { reference: 'RPT-ATT-03', applicant: 'Session submission rate', programme: '94% lecturer register completion', intake: 'This week', status: 'Ready' },
    { reference: 'RPT-ATT-04', applicant: 'Attendance by faculty', programme: '5 faculties compared', intake: 'Updated today', status: 'Ready' },
  ],
  '/scholarships': [
    { reference: 'SCH-2025-0198', applicant: 'Education fund awards', programme: '82 sponsored students', intake: 'Semester II · 2025', status: 'Approved' },
    { reference: 'SCH-APP-042', applicant: 'New scholarship applications', programme: '42 submissions', intake: 'Committee review', status: 'Under review' },
    { reference: 'SPN-UG-12', applicant: 'Sponsor allocation', programme: 'UGX 420M committed', intake: 'Sponsor balance', status: 'Active' },
    { reference: 'SCH-LIMIT-07', applicant: 'Award limit exceptions', programme: '7 records', intake: 'Finance approval', status: 'Needs attention' },
  ],
  '/quality': [
    { reference: 'QA-2025-081', applicant: 'Course evaluations', programme: '1,842 responses', intake: 'Semester II · 2025', status: 'Active' },
    { reference: 'QA-ACT-14', applicant: 'Improvement actions', programme: '14 open actions', intake: 'Quality committee', status: 'Under review' },
    { reference: 'QA-PROG-06', applicant: 'Programme review', programme: '6 programmes due', intake: 'Academic year 2025', status: 'Needs attention' },
    { reference: 'QA-SUR-02', applicant: 'Graduate tracer survey', programme: 'April cohort', intake: 'Published today', status: 'Ready' },
  ],
  '/procurement': [
    { reference: 'REQ-2025-231', applicant: 'ICT equipment requisition', programme: 'UGX 84M · 3 suppliers', intake: 'Procurement committee', status: 'Under review' },
    { reference: 'INV-STORE-14', applicant: 'Central stores', programme: '1,428 stock items', intake: 'Main campus', status: 'Active' },
    { reference: 'AST-2025-042', applicant: 'Asset register update', programme: '42 new assets', intake: 'Updated today', status: 'Ready' },
    { reference: 'STK-LOW-09', applicant: 'Low stock alerts', programme: '9 items below reorder level', intake: 'Stores office', status: 'Needs attention' },
  ],
  '/administration': [
    { reference: 'AUD-2025-1142', applicant: 'Audit events today', programme: '1,142 logged actions', intake: 'All privileged events', status: 'Active' },
    { reference: 'JOB-2025-088', applicant: 'Background jobs', programme: '12 running · 0 failed', intake: 'Queue monitor', status: 'Ready' },
    { reference: 'INT-HEALTH-04', applicant: 'Integration health', programme: '4 configured connectors', intake: 'Last checked 2 min ago', status: 'Active' },
    { reference: 'IMP-2025-017', applicant: 'Data import batch', programme: 'Students · 2,846 rows', intake: 'Validation complete', status: 'Under review' },
  ],
})

Object.assign(moduleRows, {
  '/registration/course-registration': [
    { reference: 'REG-2026-1824', applicant: 'Aisha Namukasa', programme: 'BSc Computer Science · 6 courses', intake: 'Year 2 · Semester II', status: 'Registered' },
    { reference: 'REG-2026-1816', applicant: 'Daniel Okello', programme: 'BBA · 5 courses', intake: 'Year 3 · Semester II', status: 'Pending approval' },
    { reference: 'REG-2026-1789', applicant: 'Mariam Atim', programme: 'Diploma in Computing · 7 courses', intake: 'Year 1 · Semester II', status: 'Needs attention' },
    { reference: 'REG-2026-1762', applicant: 'Sarah Achieng', programme: 'BSc Information Technology · 6 courses', intake: 'Year 1 · Semester II', status: 'Registered' },
  ],
  '/registration/approvals': [
    { reference: 'APR-2026-088', applicant: 'Peter Ssekabira', programme: 'Credit-load exception', intake: 'Faculty of Education', status: 'Under review' },
    { reference: 'APR-2026-081', applicant: 'Mariam Atim', programme: 'Late registration request', intake: 'Registry queue', status: 'Pending' },
    { reference: 'APR-2026-076', applicant: 'Daniel Okello', programme: 'Prerequisite override', intake: 'Faculty of Business', status: 'Needs attention' },
    { reference: 'APR-2026-069', applicant: 'Aisha Namukasa', programme: 'Programme coordinator sign-off', intake: 'Computing', status: 'Approved' },
  ],
  '/registration/add-drop': [
    { reference: 'ADD-2026-042', applicant: 'Sarah Achieng', programme: 'Add CSC 204', intake: 'Closes 18 Nov 2026', status: 'Under review' },
    { reference: 'ADD-2026-039', applicant: 'Aisha Namukasa', programme: 'Drop MAT 210', intake: 'Computing', status: 'Approved' },
    { reference: 'ADD-2026-031', applicant: 'Peter Ssekabira', programme: 'Add EDU 311', intake: 'Education', status: 'Pending' },
    { reference: 'ADD-2026-024', applicant: 'Daniel Okello', programme: 'Course swap request', intake: 'Business', status: 'Needs attention' },
  ],
  '/registration/credit-load': [
    { reference: 'CRL-2026-018', applicant: 'Mariam Atim', programme: '28 credits · maximum 24', intake: 'Diploma in Computing', status: 'Needs attention' },
    { reference: 'CRL-2026-012', applicant: 'Peter Ssekabira', programme: '10 credits · minimum 12', intake: 'Bachelor of Education', status: 'Under review' },
    { reference: 'CRL-2026-009', applicant: 'Daniel Okello', programme: '24 credits · within range', intake: 'Business', status: 'Approved' },
    { reference: 'CRL-2026-004', applicant: 'Sarah Achieng', programme: '21 credits · within range', intake: 'Information Technology', status: 'Compliant' },
  ],
  '/examinations/assessment-setup': [
    { reference: 'ASM-2026-104', applicant: 'CSC 204 · Data Structures', programme: 'Coursework 40% · Exam 60%', intake: 'Semester II · 2026', status: 'Approved' },
    { reference: 'ASM-2026-098', applicant: 'BBA 310 · Strategic Management', programme: 'Coursework 30% · Exam 70%', intake: 'Semester II · 2026', status: 'Under review' },
    { reference: 'ASM-2026-087', applicant: 'BED 402 · Education Policy', programme: 'Coursework 40% · Exam 60%', intake: 'Semester II · 2026', status: 'Draft' },
    { reference: 'ASM-2026-074', applicant: 'HSC 202 · Community Health', programme: 'Coursework 50% · Exam 50%', intake: 'Semester II · 2026', status: 'Approved' },
  ],
  '/examinations/marks-entry': [
    { reference: 'MRK-2026-204', applicant: 'CSC 204 · Dr. Sarah Nansubuga', programme: '86 of 92 marks entered', intake: 'Faculty of Computing', status: 'Under review' },
    { reference: 'MRK-2026-198', applicant: 'BBA 310 · Mr. Brian Ouma', programme: '124 of 124 marks entered', intake: 'Faculty of Business', status: 'Ready to approve' },
    { reference: 'MRK-2026-189', applicant: 'BED 402 · Ms. Irene Akello', programme: '78 of 84 marks entered', intake: 'Faculty of Education', status: 'Missing marks' },
    { reference: 'MRK-2026-176', applicant: 'HSC 202 · Dr. Joseph Mugisha', programme: '96 of 96 marks entered', intake: 'Health Sciences', status: 'Complete' },
  ],
  '/examinations/moderation': [
    { reference: 'MOD-2026-046', applicant: 'CSC 204 · Data Structures', programme: 'Variance review · 4 scripts', intake: 'External moderator', status: 'Under review' },
    { reference: 'MOD-2026-039', applicant: 'BBA 310 · Strategic Management', programme: 'Sample approved', intake: 'Faculty board', status: 'Approved' },
    { reference: 'MOD-2026-031', applicant: 'BED 402 · Education Policy', programme: 'Grade distribution check', intake: 'Department review', status: 'Needs attention' },
    { reference: 'MOD-2026-024', applicant: 'HSC 202 · Community Health', programme: 'Awaiting moderator', intake: 'Health Sciences', status: 'Pending' },
  ],
  '/examinations/publication': [
    { reference: 'PUB-2026-021', applicant: 'Computing · Year 2', programme: '6 of 8 course results approved', intake: 'Registrar sign-off', status: 'Under review' },
    { reference: 'PUB-2026-018', applicant: 'Business · Year 3', programme: 'All results approved', intake: 'Release window 20 Nov', status: 'Ready to publish' },
    { reference: 'PUB-2026-014', applicant: 'Education · Year 4', programme: '2 courses awaiting moderation', intake: 'Faculty board', status: 'Needs attention' },
    { reference: 'PUB-2026-009', applicant: 'Health Sciences · Year 2', programme: 'Results released 10 Nov', intake: 'Student portal', status: 'Published' },
  ],
  '/finance/billing': [
    { reference: 'INV-2026-0921', applicant: 'Semester II tuition batch', programme: 'UGX 5.14B · 2,184 invoices', intake: 'Posted 02 Nov 2026', status: 'Posted' },
    { reference: 'INV-2026-0916', applicant: 'Accommodation charges', programme: 'UGX 428M · 312 accounts', intake: 'Main campus', status: 'Under review' },
    { reference: 'INV-2026-0908', applicant: 'Late registration fees', programme: 'UGX 18.6M · 94 accounts', intake: 'Approval required', status: 'Pending' },
    { reference: 'FEE-2026-0042', applicant: '2026/27 fee schedule', programme: 'Undergraduate programmes', intake: 'Next academic year', status: 'Draft' },
  ],
  '/finance/reconciliation': [
    { reference: 'REC-2026-1107', applicant: 'Bank statement · Stanbic', programme: 'UGX 186.4M unmatched', intake: '07 Nov 2026', status: 'Needs attention' },
    { reference: 'REC-2026-1106', applicant: 'Mobile money · Airtel', programme: '428 of 436 matched', intake: '06 Nov 2026', status: 'Under review' },
    { reference: 'REC-2026-1105', applicant: 'Bank statement · Centenary', programme: 'UGX 92.1M matched', intake: '05 Nov 2026', status: 'Complete' },
    { reference: 'PAY-2026-8821', applicant: 'Unidentified deposit', programme: 'UGX 640,000 · 1 transaction', intake: 'Student account lookup', status: 'Pending' },
  ],
  '/finance/accounts': [
    { reference: 'ACC-2026-0142', applicant: 'Aisha Namukasa', programme: 'UGX 680,000 due', intake: 'BSc Computer Science · Year 2', status: 'Active' },
    { reference: 'ACC-2026-0871', applicant: 'Daniel Okello', programme: 'UGX 0 due', intake: 'Bachelor of Business · Year 3', status: 'Clear' },
    { reference: 'ACC-2026-0256', applicant: 'Mariam Atim', programme: 'UGX 420,000 due', intake: 'Diploma in Computing · Year 1', status: 'Needs attention' },
    { reference: 'ACC-2026-0319', applicant: 'Peter Ssekabira', programme: 'UGX 1,240,000 due', intake: 'Bachelor of Education · Year 4', status: 'On hold' },
  ],
  '/finance/refunds': [
    { reference: 'REF-2026-047', applicant: 'Tuition overpayment', programme: 'UGX 1,240,000', intake: 'Finance officer review', status: 'Under review' },
    { reference: 'REF-2026-043', applicant: 'Accommodation deposit', programme: 'UGX 350,000', intake: 'Residence clearance attached', status: 'Approved' },
    { reference: 'ADJ-2026-028', applicant: 'Duplicate mobile payment', programme: 'UGX 180,000', intake: 'Payment trace required', status: 'Needs attention' },
    { reference: 'REF-2026-019', applicant: 'Cancelled course adjustment', programme: 'UGX 96,000', intake: 'Accounts office', status: 'Pending' },
  ],
})

export const moduleIcons: Record<string, LucideIcon> = {
  '/admissions': ClipboardList,
  '/admissions/application-pipeline': ClipboardList,
  '/admissions/applicant-review': UserRound,
  '/admissions/document-verification': FileText,
  '/admissions/offers-decisions': ShieldCheck,
  '/admissions/matriculation': GraduationCap,
  '/admissions/intake-planning': CalendarDays,
  '/admissions/reports': ChartNoAxesCombined,
  '/students': UserRound,
  '/students/directory': UserRound,
  '/students/placement': MapPin,
  '/students/lifecycle': ArrowRightLeft,
  '/students/documents': FileText,
  '/academics': LayoutDashboard,
  '/academics/institutions': Building2,
  '/academics/faculties': Landmark,
  '/academics/departments': Network,
  '/academics/programmes': GraduationCap,
  '/academics/courses': BookOpenText,
  '/academics/curricula': ListTree,
  '/academics/calendar': CalendarDays,
  '/academics/grading': ShieldCheck,
  '/registration': GraduationCap,
  '/registration/course-registration': GraduationCap,
  '/registration/approvals': ShieldCheck,
  '/registration/add-drop': ArrowRightLeft,
  '/registration/credit-load': ListTree,
  '/timetabling': ClipboardList,
  '/timetabling/schedules': CalendarDays,
  '/timetabling/venues': Building2,
  '/timetabling/lecturer-allocation': UsersRound,
  '/timetabling/conflicts': ShieldCheck,
  '/attendance': UsersRound,
  '/attendance/sessions': ClipboardList,
  '/attendance/alerts': CirclePause,
  '/attendance/corrections': ArrowRightLeft,
  '/attendance/reports': ChartNoAxesCombined,
  '/examinations': ClipboardList,
  '/examinations/assessment-setup': ClipboardList,
  '/examinations/marks-entry': FileText,
  '/examinations/moderation': ShieldCheck,
  '/examinations/publication': CalendarDays,
  '/finance': CreditCard,
  '/finance/billing': CreditCard,
  '/finance/reconciliation': ArrowRightLeft,
  '/finance/accounts': UsersRound,
  '/finance/refunds': FileText,
  '/scholarships': GraduationCap,
  '/reports': ChartNoAxesCombined,
  '/learning': BookOpen,
  '/library': Library,
  '/staff': UserRound,
  '/accommodation': Building2,
  '/internship': GraduationCap,
  '/welfare': UsersRound,
  '/graduation': GraduationCap,
  '/communications': ClipboardList,
  '/quality': ChartNoAxesCombined,
  '/procurement': Building2,
  '/administration': Settings2,
}

export const moduleKpis: Record<string, KpiMetric[]> = {
  '/academics': [
    { label: 'Institutions', value: '1', detail: 'Institution profile configured', icon: Building2, tone: 'blue' },
    { label: 'Faculties & schools', value: '3', detail: 'Academic divisions', icon: Landmark, tone: 'teal' },
    { label: 'Departments', value: '10', detail: 'Across active faculties', icon: Network, tone: 'purple' },
    { label: 'Programmes', value: '3', detail: 'Available for delivery', icon: GraduationCap, tone: 'amber' },
  ],
  '/attendance': [
    { label: 'Sessions this week', value: '186', detail: 'Linked to published timetable', icon: CalendarDays, tone: 'blue' },
    { label: 'Registers submitted', value: '94%', detail: 'Lecturer submission rate', icon: ShieldCheck, tone: 'teal' },
    { label: 'Below threshold', value: '22', detail: 'Students under 75% attendance', icon: CirclePause, tone: 'amber' },
    { label: 'Open corrections', value: '8', detail: 'Awaiting authorized review', icon: ArrowRightLeft, tone: 'purple' },
  ],
  '/attendance/sessions': [
    { label: 'Scheduled sessions', value: '186', detail: 'This teaching week', icon: CalendarDays, tone: 'blue' },
    { label: 'Registers submitted', value: '175', detail: '94% completion', icon: ShieldCheck, tone: 'teal' },
    { label: 'In progress', value: '7', detail: 'Lecturer taking attendance', icon: ClipboardList, tone: 'purple' },
    { label: 'Not submitted', value: '4', detail: 'Follow-up required', icon: CirclePause, tone: 'amber' },
  ],
  '/attendance/alerts': [
    { label: 'Students flagged', value: '22', detail: 'Below 75% threshold', icon: CirclePause, tone: 'amber' },
    { label: 'Urgent follow-up', value: '8', detail: 'Multiple consecutive absences', icon: UsersRound, tone: 'purple' },
    { label: 'Advisors notified', value: '16', detail: 'Cases assigned for follow-up', icon: ShieldCheck, tone: 'teal' },
    { label: 'Resolved this week', value: '11', detail: 'Returned above the threshold', icon: ClipboardList, tone: 'blue' },
  ],
  '/attendance/corrections': [
    { label: 'Open requests', value: '8', detail: 'Awaiting decision', icon: ArrowRightLeft, tone: 'blue' },
    { label: 'Evidence attached', value: '6', detail: 'Ready for review', icon: FileText, tone: 'teal' },
    { label: 'Urgent', value: '2', detail: 'Near reporting deadline', icon: CirclePause, tone: 'amber' },
    { label: 'Approved this week', value: '14', detail: 'Authorized record changes', icon: ShieldCheck, tone: 'purple' },
  ],
  '/attendance/reports': [
    { label: 'Average attendance', value: '82%', detail: 'Across active sessions', icon: ChartNoAxesCombined, tone: 'blue' },
    { label: 'Register completion', value: '94%', detail: 'Lecturer submissions', icon: ClipboardList, tone: 'teal' },
    { label: 'Below threshold', value: '22', detail: 'Students requiring support', icon: CirclePause, tone: 'amber' },
    { label: 'Faculties tracked', value: '5', detail: 'Current reporting period', icon: Building2, tone: 'purple' },
  ],
  '/timetabling': [
    { label: 'Scheduled sessions', value: '412', detail: 'Teaching sessions this semester', icon: CalendarDays, tone: 'blue' },
    { label: 'Open conflicts', value: '12', detail: 'Room, lecturer, or cohort clashes', icon: CirclePause, tone: 'amber' },
    { label: 'Venue utilization', value: '84%', detail: 'Across active teaching rooms', icon: Building2, tone: 'teal' },
    { label: 'Lecturer exceptions', value: '19', detail: 'Availability or workload review', icon: UsersRound, tone: 'purple' },
  ],
  '/timetabling/schedules': [
    { label: 'Sessions scheduled', value: '412', detail: 'Across all campuses', icon: CalendarDays, tone: 'blue' },
    { label: 'Published', value: '386', detail: 'Visible to teaching teams', icon: ShieldCheck, tone: 'teal' },
    { label: 'Draft sessions', value: '14', detail: 'Awaiting schedule review', icon: ClipboardList, tone: 'purple' },
    { label: 'Conflicts', value: '12', detail: 'Need resolution before release', icon: CirclePause, tone: 'amber' },
  ],
  '/timetabling/venues': [
    { label: 'Active venues', value: '54', detail: 'Across 3 campuses', icon: Building2, tone: 'blue' },
    { label: 'Average utilization', value: '84%', detail: 'Scheduled teaching hours', icon: CalendarDays, tone: 'teal' },
    { label: 'Capacity flags', value: '6', detail: 'Enrollment exceeds venue size', icon: CirclePause, tone: 'amber' },
    { label: 'Maintenance holds', value: '3', detail: 'Temporarily unavailable', icon: ShieldCheck, tone: 'purple' },
  ],
  '/timetabling/lecturer-allocation': [
    { label: 'Teaching staff', value: '128', detail: 'Assigned this semester', icon: UsersRound, tone: 'blue' },
    { label: 'Within workload', value: '109', detail: 'Teaching hours in range', icon: ShieldCheck, tone: 'teal' },
    { label: 'Overloaded', value: '7', detail: 'Above contact-hour limit', icon: CirclePause, tone: 'amber' },
    { label: 'Availability pending', value: '12', detail: 'Need faculty confirmation', icon: CalendarDays, tone: 'purple' },
  ],
  '/timetabling/conflicts': [
    { label: 'Open conflicts', value: '12', detail: 'Across current schedules', icon: CirclePause, tone: 'amber' },
    { label: 'Room clashes', value: '5', detail: 'Venue booked more than once', icon: Building2, tone: 'blue' },
    { label: 'Lecturer clashes', value: '4', detail: 'Overlapping teaching assignments', icon: UsersRound, tone: 'purple' },
    { label: 'Resolved today', value: '8', detail: 'Scheduling office actions', icon: ShieldCheck, tone: 'teal' },
  ],
  '/registration': [
    { label: 'Registration started', value: '2,184', detail: 'Current semester', icon: UsersRound, tone: 'blue' },
    { label: 'Completed', value: '1,862', detail: '85% of started records', icon: ShieldCheck, tone: 'teal' },
    { label: 'Awaiting approval', value: '146', detail: 'Registrar and faculty queues', icon: ClipboardList, tone: 'amber' },
    { label: 'Credit exceptions', value: '38', detail: 'Require academic review', icon: ListTree, tone: 'purple' },
  ],
  '/registration/course-registration': [
    { label: 'Started', value: '2,184', detail: 'Student registration records', icon: UsersRound, tone: 'blue' },
    { label: 'Registered', value: '1,862', detail: 'Course selection complete', icon: ShieldCheck, tone: 'teal' },
    { label: 'In progress', value: '176', detail: 'Student action required', icon: ClipboardList, tone: 'amber' },
    { label: 'Not started', value: '146', detail: 'Current semester cohort', icon: CalendarDays, tone: 'purple' },
  ],
  '/registration/approvals': [
    { label: 'Pending', value: '146', detail: 'Awaiting decision', icon: ClipboardList, tone: 'blue' },
    { label: 'Urgent', value: '24', detail: 'Near registration deadline', icon: CalendarDays, tone: 'amber' },
    { label: 'Approved today', value: '58', detail: 'Across faculty queues', icon: ShieldCheck, tone: 'teal' },
    { label: 'Average age', value: '2.4 days', detail: 'Open approval requests', icon: ArrowRightLeft, tone: 'purple' },
  ],
  '/registration/add-drop': [
    { label: 'Open requests', value: '212', detail: 'Current change window', icon: ArrowRightLeft, tone: 'blue' },
    { label: 'Awaiting review', value: '68', detail: 'Faculty decision required', icon: ClipboardList, tone: 'amber' },
    { label: 'Approved', value: '124', detail: 'Processed this cycle', icon: ShieldCheck, tone: 'teal' },
    { label: 'Window closes', value: '18 Nov', detail: 'Current academic period', icon: CalendarDays, tone: 'purple' },
  ],
  '/registration/credit-load': [
    { label: 'Exceptions', value: '38', detail: 'Outside credit rules', icon: ListTree, tone: 'blue' },
    { label: 'Over limit', value: '16', detail: 'Excess credit units', icon: CirclePause, tone: 'amber' },
    { label: 'Below minimum', value: '22', detail: 'Need programme review', icon: GraduationCap, tone: 'purple' },
    { label: 'Resolved', value: '74%', detail: 'This registration cycle', icon: ShieldCheck, tone: 'teal' },
  ],
  '/examinations': [
    { label: 'Assessments', value: '184', detail: 'Current semester', icon: ClipboardList, tone: 'blue' },
    { label: 'Marks complete', value: '82%', detail: 'Across all course units', icon: FileText, tone: 'teal' },
    { label: 'Awaiting moderation', value: '26', detail: 'Faculty review queue', icon: ShieldCheck, tone: 'amber' },
    { label: 'Ready to publish', value: '18', detail: 'Approved result sets', icon: CalendarDays, tone: 'purple' },
  ],
  '/examinations/assessment-setup': [
    { label: 'Assessment plans', value: '184', detail: 'Current semester courses', icon: ClipboardList, tone: 'blue' },
    { label: 'Approved', value: '142', detail: 'Ready for delivery', icon: ShieldCheck, tone: 'teal' },
    { label: 'In review', value: '26', detail: 'Faculty approval required', icon: FileText, tone: 'amber' },
    { label: 'Draft', value: '16', detail: 'Not yet submitted', icon: CalendarDays, tone: 'purple' },
  ],
  '/examinations/marks-entry': [
    { label: 'Course units', value: '184', detail: 'Marks entry in scope', icon: ClipboardList, tone: 'blue' },
    { label: 'Complete', value: '151', detail: 'All marks submitted', icon: ShieldCheck, tone: 'teal' },
    { label: 'Missing marks', value: '12', detail: 'Require lecturer follow-up', icon: CirclePause, tone: 'amber' },
    { label: 'Submission rate', value: '82%', detail: 'Current semester', icon: FileText, tone: 'purple' },
  ],
  '/examinations/moderation': [
    { label: 'In moderation', value: '26', detail: 'Current faculty queue', icon: ShieldCheck, tone: 'blue' },
    { label: 'Variance flags', value: '7', detail: 'Require additional review', icon: CirclePause, tone: 'amber' },
    { label: 'Approved today', value: '18', detail: 'Ready for release checks', icon: ClipboardList, tone: 'teal' },
    { label: 'Moderated', value: '74%', detail: 'Semester results', icon: FileText, tone: 'purple' },
  ],
  '/examinations/publication': [
    { label: 'Ready to publish', value: '18', detail: 'Approved result sets', icon: ShieldCheck, tone: 'blue' },
    { label: 'Awaiting approval', value: '9', detail: 'Registrar sign-off', icon: ClipboardList, tone: 'amber' },
    { label: 'Published', value: '42', detail: 'Current semester to date', icon: CalendarDays, tone: 'teal' },
    { label: 'Release window', value: '20 Nov', detail: 'Next planned release', icon: FileText, tone: 'purple' },
  ],
  '/finance': [
    { label: 'Fees billed', value: 'UGX 5.14B', detail: 'Semester II · 2026', icon: CreditCard, tone: 'blue' },
    { label: 'Collected', value: 'UGX 3.86B', detail: '75% of billed fees', icon: ShieldCheck, tone: 'teal' },
    { label: 'Unmatched payments', value: 'UGX 186.4M', detail: 'Reconciliation queue', icon: ArrowRightLeft, tone: 'amber' },
    { label: 'Refund requests', value: '6', detail: 'Awaiting approval', icon: FileText, tone: 'purple' },
  ],
  '/finance/billing': [
    { label: 'Invoices posted', value: '2,184', detail: 'Current semester batch', icon: CreditCard, tone: 'blue' },
    { label: 'Total billed', value: 'UGX 5.14B', detail: 'Across active students', icon: FileText, tone: 'teal' },
    { label: 'Billing exceptions', value: '28', detail: 'Need account review', icon: CirclePause, tone: 'amber' },
    { label: 'Draft schedules', value: '2', detail: 'Next academic year', icon: CalendarDays, tone: 'purple' },
  ],
  '/finance/reconciliation': [
    { label: 'Matched today', value: '428', detail: 'Across payment channels', icon: ShieldCheck, tone: 'blue' },
    { label: 'Unmatched', value: 'UGX 186.4M', detail: 'Needs account allocation', icon: ArrowRightLeft, tone: 'amber' },
    { label: 'Statements', value: '4', detail: 'Awaiting import', icon: FileText, tone: 'purple' },
    { label: 'Match rate', value: '96.8%', detail: 'Current reconciliation', icon: CreditCard, tone: 'teal' },
  ],
  '/finance/accounts': [
    { label: 'Student accounts', value: '2,846', detail: 'Current register', icon: UsersRound, tone: 'blue' },
    { label: 'Accounts clear', value: '1,942', detail: 'No outstanding balance', icon: ShieldCheck, tone: 'teal' },
    { label: 'Payment plans', value: '184', detail: 'Active arrangements', icon: CalendarDays, tone: 'purple' },
    { label: 'Account holds', value: '82', detail: 'Need follow-up', icon: CirclePause, tone: 'amber' },
  ],
  '/finance/refunds': [
    { label: 'Open requests', value: '6', detail: 'Pending review', icon: FileText, tone: 'blue' },
    { label: 'Value requested', value: 'UGX 4.8M', detail: 'All open requests', icon: CreditCard, tone: 'purple' },
    { label: 'Awaiting approval', value: '3', detail: 'Finance officer queue', icon: ShieldCheck, tone: 'amber' },
    { label: 'Processed this month', value: '14', detail: 'Completed adjustments', icon: ArrowRightLeft, tone: 'teal' },
  ],
  '/admissions': [
    { label: 'Applications', value: '968', detail: 'Current intake pipeline', icon: ClipboardList, tone: 'blue' },
    { label: 'Under review', value: '342', detail: 'Awaiting faculty decision', icon: UserRound, tone: 'amber' },
    { label: 'Offer ready', value: '186', detail: 'Ready to issue or release', icon: ShieldCheck, tone: 'teal' },
    { label: 'Yield forecast', value: '61%', detail: 'Expected conversion rate', icon: ChartNoAxesCombined, tone: 'purple' },
  ],
  '/admissions/matriculation': [
    { label: 'Offers accepted', value: '122', detail: 'Ready for enrollment processing', icon: GraduationCap, tone: 'blue' },
    { label: 'Clearance in progress', value: '34', detail: 'Documents or finance checks', icon: FileText, tone: 'amber' },
    { label: 'Ready to enroll', value: '68', detail: 'Pre-enrollment requirements met', icon: ShieldCheck, tone: 'teal' },
    { label: 'Student records created', value: '20', detail: 'Matriculated this intake', icon: UsersRound, tone: 'purple' },
  ],
  '/admissions/application-pipeline': [
    { label: 'Fresh applications', value: '412', detail: 'Submitted in current cycle', icon: ClipboardList, tone: 'blue' },
    { label: 'Screening', value: '186', detail: 'Needs first-pass review', icon: UserRound, tone: 'amber' },
    { label: 'Faculty review', value: '98', detail: 'Awaiting staff decisions', icon: ShieldCheck, tone: 'teal' },
    { label: 'Decision window', value: '9 days', detail: 'Average time to outcome', icon: CalendarDays, tone: 'purple' },
  ],
  '/admissions/applicant-review': [
    { label: 'Shortlisted', value: '214', detail: 'Ready for final decision', icon: UserRound, tone: 'blue' },
    { label: 'Flagged', value: '48', detail: 'Need follow-up review', icon: CirclePause, tone: 'amber' },
    { label: 'Approved', value: '132', detail: 'Offer or acceptance ready', icon: ShieldCheck, tone: 'teal' },
    { label: 'Top programmes', value: '5', detail: 'Highest demand faculties', icon: GraduationCap, tone: 'purple' },
  ],
  '/admissions/document-verification': [
    { label: 'Verified', value: '89%', detail: 'Documents completed', icon: FileText, tone: 'blue' },
    { label: 'Missing', value: '42', detail: 'Require action', icon: CirclePause, tone: 'amber' },
    { label: 'Urgent queue', value: '18', detail: 'Priority follow-up', icon: ClipboardList, tone: 'teal' },
    { label: 'Last check', value: 'Today', detail: 'Updated in current cycle', icon: CalendarDays, tone: 'purple' },
  ],
  '/admissions/offers-decisions': [
    { label: 'Offers issued', value: '186', detail: 'Current offer cycle', icon: ShieldCheck, tone: 'blue' },
    { label: 'Accepted', value: '122', detail: 'Confirmed students', icon: GraduationCap, tone: 'teal' },
    { label: 'Waitlisted', value: '31', detail: 'Waiting for seat release', icon: CirclePause, tone: 'amber' },
    { label: 'Pending', value: '41', detail: 'Awaiting response', icon: ClipboardList, tone: 'purple' },
  ],
  '/admissions/intake-planning': [
    { label: 'Capacity target', value: '420', detail: 'Planned student seats', icon: CalendarDays, tone: 'blue' },
    { label: 'Confirmed', value: '288', detail: 'Seats already committed', icon: ShieldCheck, tone: 'teal' },
    { label: 'At risk', value: '18', detail: 'Programs under pressure', icon: CirclePause, tone: 'amber' },
    { label: 'Open seats', value: '132', detail: 'Still available', icon: ChartNoAxesCombined, tone: 'purple' },
  ],
  '/admissions/reports': [
    { label: 'Conversion', value: '61%', detail: 'Application to admission', icon: ChartNoAxesCombined, tone: 'blue' },
    { label: 'Average decision', value: '9 days', detail: 'From submission to verdict', icon: CalendarDays, tone: 'teal' },
    { label: 'Main campus', value: '68%', detail: 'Current applicant share', icon: Building2, tone: 'purple' },
    { label: 'Completion', value: '89%', detail: 'Document readiness', icon: FileText, tone: 'amber' },
  ],
  '/students': [
    { label: 'Student records', value: '2,846', detail: 'Active student register', icon: UsersRound, tone: 'blue' },
    { label: 'On hold', value: '82', detail: 'Need follow-up', icon: CirclePause, tone: 'amber' },
    { label: 'Graduating', value: '184', detail: 'Completion review', icon: GraduationCap, tone: 'purple' },
    { label: 'Verified documents', value: '94%', detail: 'Current document completion', icon: FileText, tone: 'teal' },
  ],
  '/students/directory': [
    { label: 'Student records', value: '2,846', detail: 'Visible in preview directory', icon: UsersRound, tone: 'blue' },
    { label: 'Active', value: '2,138', detail: 'Currently enrolled', icon: ShieldCheck, tone: 'teal' },
    { label: 'On hold', value: '82', detail: 'Require follow-up', icon: CirclePause, tone: 'amber' },
    { label: 'Graduating', value: '184', detail: 'Completion review', icon: GraduationCap, tone: 'purple' },
  ],
  '/students/placement': [
    { label: 'Placed students', value: '2,642', detail: 'Allocated to current cohort', icon: MapPin, tone: 'blue' },
    { label: 'Pending placement', value: '184', detail: 'Need faculty review', icon: ClipboardList, tone: 'amber' },
    { label: 'Campuses', value: '3', detail: 'Across all campuses', icon: Building2, tone: 'teal' },
    { label: 'Cohorts active', value: '6', detail: 'Current programme intakes', icon: GraduationCap, tone: 'purple' },
  ],
  '/students/lifecycle': [
    { label: 'Transfer requests', value: '6', detail: 'Awaiting approvals', icon: ArrowRightLeft, tone: 'blue' },
    { label: 'Deferments', value: '12', detail: 'Academic consideration', icon: CalendarDays, tone: 'amber' },
    { label: 'Withdrawals', value: '4', detail: 'Current processing queue', icon: CirclePause, tone: 'purple' },
    { label: 'Reinstatements', value: '3', detail: 'Ready for board review', icon: ShieldCheck, tone: 'teal' },
  ],
  '/students/documents': [
    { label: 'Verified docs', value: '94%', detail: 'Across active student register', icon: FileText, tone: 'blue' },
    { label: 'Pending', value: '37', detail: 'Awaiting verification', icon: CirclePause, tone: 'amber' },
    { label: 'Received today', value: '118', detail: 'Submitted in current cycle', icon: ClipboardList, tone: 'teal' },
    { label: 'Clearance ready', value: '184', detail: 'Graduation pack checks', icon: GraduationCap, tone: 'purple' },
  ],
  '/academics/institutions': [
    { label: 'Institutions', value: '1', detail: 'Institution profile configured', icon: Building2, tone: 'blue' },
    { label: 'Campuses', value: '2', detail: 'Main and East campus', icon: Landmark, tone: 'teal' },
    { label: 'Faculties & schools', value: '3', detail: 'Academic divisions', icon: Network, tone: 'purple' },
    { label: 'Institution status', value: 'Active', detail: 'Current institution', icon: ShieldCheck, tone: 'amber' },
  ],
  '/academics/faculties': [
    { label: 'Faculties & schools', value: '3', detail: 'Academic divisions listed', icon: Landmark, tone: 'blue' },
    { label: 'Departments', value: '10', detail: 'Across listed faculties', icon: Network, tone: 'teal' },
    { label: 'Programmes', value: '3', detail: 'Sample programme records', icon: GraduationCap, tone: 'purple' },
    { label: 'Campuses represented', value: '2', detail: 'Main and East campus', icon: Building2, tone: 'amber' },
  ],
  '/academics/departments': [
    { label: 'Departments', value: '3', detail: 'Department records shown', icon: Network, tone: 'blue' },
    { label: 'Active departments', value: '3', detail: 'All shown departments active', icon: ShieldCheck, tone: 'teal' },
    { label: 'Parent faculties', value: '2', detail: 'Computing and Business', icon: Landmark, tone: 'purple' },
    { label: 'Linked course units', value: '21', detail: 'Across shown departments', icon: BookOpenText, tone: 'amber' },
  ],
  '/academics/programmes': [
    { label: 'Programmes', value: '3', detail: 'Programme records shown', icon: GraduationCap, tone: 'blue' },
    { label: 'Active programmes', value: '2', detail: 'Available for delivery', icon: ShieldCheck, tone: 'teal' },
    { label: 'Draft programmes', value: '1', detail: 'Awaiting approval', icon: ClipboardList, tone: 'purple' },
    { label: 'Defined credit units', value: '316', detail: 'Across shown programmes', icon: ListTree, tone: 'amber' },
  ],
  '/academics/courses': [
    { label: 'Course units', value: '3', detail: 'Course records shown', icon: BookOpenText, tone: 'blue' },
    { label: 'Active course units', value: '3', detail: 'Available in curricula', icon: ShieldCheck, tone: 'teal' },
    { label: 'Credit units', value: '11', detail: 'Across shown courses', icon: ListTree, tone: 'purple' },
    { label: 'Academic periods', value: '3', detail: 'Year and semester placements', icon: CalendarDays, tone: 'amber' },
  ],
  '/academics/curricula': [
    { label: 'Curricula', value: '3', detail: 'Curriculum records shown', icon: ListTree, tone: 'blue' },
    { label: 'Active curricula', value: '2', detail: 'Approved programme plans', icon: ShieldCheck, tone: 'teal' },
    { label: 'Draft curricula', value: '1', detail: 'Still being prepared', icon: ClipboardList, tone: 'purple' },
    { label: 'Mapped credit units', value: '316', detail: 'Across shown curricula', icon: BookOpenText, tone: 'amber' },
  ],
  '/academics/calendar': [
    { label: 'Academic years', value: '1', detail: '2025/26 currently active', icon: CalendarDays, tone: 'blue' },
    { label: 'Semester periods', value: '2', detail: 'Semester II active, Semester I planning', icon: BookOpenText, tone: 'teal' },
    { label: 'Active periods', value: '2', detail: 'Current year and semester', icon: ShieldCheck, tone: 'purple' },
    { label: 'Periods in planning', value: '1', detail: 'Semester I · 2026', icon: ClipboardList, tone: 'amber' },
  ],
  '/academics/grading': [
    { label: 'Grading systems', value: '3', detail: 'Undergraduate, diploma, postgraduate', icon: ShieldCheck, tone: 'blue' },
    { label: 'Active systems', value: '2', detail: 'Available for results processing', icon: GraduationCap, tone: 'teal' },
    { label: 'Grade bands', value: '18', detail: 'Across shown grading systems', icon: ListTree, tone: 'purple' },
    { label: 'Draft systems', value: '1', detail: 'Postgraduate 4-point GPA', icon: ClipboardList, tone: 'amber' },
  ],
}

Object.assign(moduleKpis, {
  '/scholarships': [
    { label: 'Active awards', value: '82', detail: 'Students currently sponsored', icon: GraduationCap, tone: 'blue' },
    { label: 'Applications', value: '42', detail: 'Awaiting committee review', icon: ClipboardList, tone: 'amber' },
    { label: 'Sponsor commitment', value: 'UGX 420M', detail: 'Across active agreements', icon: Building2, tone: 'teal' },
    { label: 'Award exceptions', value: '7', detail: 'Need finance approval', icon: CirclePause, tone: 'purple' },
  ],
  '/learning': [
    { label: 'Course spaces', value: '86', detail: 'Active this semester', icon: BookOpen, tone: 'blue' },
    { label: 'Published resources', value: '1,248', detail: 'Available to learners', icon: FileText, tone: 'teal' },
    { label: 'Pending submissions', value: '124', detail: 'Awaiting marking', icon: ClipboardList, tone: 'amber' },
    { label: 'Active learners', value: '2,184', detail: 'Across current courses', icon: UsersRound, tone: 'purple' },
  ],
  '/library': [
    { label: 'Catalogue records', value: '12,840', detail: 'Across all campuses', icon: Library, tone: 'blue' },
    { label: 'Loans today', value: '186', detail: '94 items returned', icon: ArrowRightLeft, tone: 'teal' },
    { label: 'Overdue items', value: '114', detail: 'Need borrower follow-up', icon: CirclePause, tone: 'amber' },
    { label: 'Clearance queue', value: '82', detail: 'Graduating students', icon: ShieldCheck, tone: 'purple' },
  ],
  '/staff': [
    { label: 'Staff records', value: '246', detail: 'Across faculties and units', icon: UsersRound, tone: 'blue' },
    { label: 'Leave requests', value: '12', detail: 'Awaiting approval', icon: CalendarDays, tone: 'amber' },
    { label: 'Contracts due', value: '8', detail: 'Renewal this month', icon: FileText, tone: 'purple' },
    { label: 'Workload exceptions', value: '14', detail: 'Require department review', icon: ListTree, tone: 'teal' },
  ],
  '/accommodation': [
    { label: 'Available beds', value: '420', detail: 'Across active residences', icon: Building2, tone: 'blue' },
    { label: 'Occupancy', value: '86%', detail: 'Current residence capacity', icon: UsersRound, tone: 'teal' },
    { label: 'Allocation queue', value: '214', detail: 'Applications under review', icon: ClipboardList, tone: 'amber' },
    { label: 'Open maintenance', value: '31', detail: 'Residence operations tasks', icon: Settings2, tone: 'purple' },
  ],
  '/internship': [
    { label: 'Students placed', value: '156', detail: 'Current placement cycle', icon: MapPin, tone: 'blue' },
    { label: 'Logbooks pending', value: '88', detail: 'Supervisor review required', icon: FileText, tone: 'amber' },
    { label: 'Supervisor matches', value: '48', detail: 'Awaiting confirmation', icon: UsersRound, tone: 'teal' },
    { label: 'Research projects', value: '12', detail: 'Active proposals', icon: GraduationCap, tone: 'purple' },
  ],
  '/welfare': [
    { label: 'Active support cases', value: '32', detail: 'Restricted staff access', icon: ShieldCheck, tone: 'blue' },
    { label: 'Appointments', value: '32', detail: 'Scheduled this week', icon: CalendarDays, tone: 'teal' },
    { label: 'Open follow-ups', value: '41', detail: 'Assigned support tasks', icon: ClipboardList, tone: 'amber' },
    { label: 'Authorized referrals', value: '8', detail: 'Access-audited referrals', icon: ArrowRightLeft, tone: 'purple' },
  ],
  '/graduation': [
    { label: 'Candidates', value: '184', detail: 'Current graduation cohort', icon: GraduationCap, tone: 'blue' },
    { label: 'Academic clearance', value: '172', detail: 'Requirements completed', icon: ShieldCheck, tone: 'teal' },
    { label: 'Finance clearance', value: '168', detail: 'Accounts confirmed', icon: CreditCard, tone: 'amber' },
    { label: 'Alumni registered', value: '142', detail: 'Recent graduating cohort', icon: UsersRound, tone: 'purple' },
  ],
  '/communications': [
    { label: 'Active campaigns', value: '4', detail: 'Audience-targeted messages', icon: UsersRound, tone: 'blue' },
    { label: 'Announcements', value: '12', detail: 'Published this period', icon: ClipboardList, tone: 'teal' },
    { label: 'Delivery rate', value: '98%', detail: 'Across recent sends', icon: ChartNoAxesCombined, tone: 'purple' },
    { label: 'Draft messages', value: '6', detail: 'Awaiting approval', icon: FileText, tone: 'amber' },
  ],
  '/quality': [
    { label: 'Evaluation responses', value: '1,842', detail: 'Current semester', icon: ClipboardList, tone: 'blue' },
    { label: 'Open actions', value: '14', detail: 'Assigned for improvement', icon: ShieldCheck, tone: 'amber' },
    { label: 'Programme reviews', value: '6', detail: 'Due this academic year', icon: GraduationCap, tone: 'purple' },
    { label: 'Active surveys', value: '2', detail: 'Collecting responses', icon: ChartNoAxesCombined, tone: 'teal' },
  ],
  '/procurement': [
    { label: 'Open requisitions', value: '18', detail: 'Across procurement stages', icon: ClipboardList, tone: 'blue' },
    { label: 'Committed value', value: 'UGX 420M', detail: 'Current purchasing cycle', icon: CreditCard, tone: 'purple' },
    { label: 'Low-stock alerts', value: '9', detail: 'Below reorder thresholds', icon: CirclePause, tone: 'amber' },
    { label: 'Tracked assets', value: '1,428', detail: 'Institutional register', icon: Building2, tone: 'teal' },
  ],
  '/reports': [
    { label: 'Saved reports', value: '24', detail: 'Available to your role', icon: ChartNoAxesCombined, tone: 'blue' },
    { label: 'Updated today', value: '18', detail: 'Current reporting cycle', icon: CalendarDays, tone: 'teal' },
    { label: 'Scheduled exports', value: '6', detail: 'Automated report delivery', icon: FileText, tone: 'purple' },
    { label: 'Data exceptions', value: '3', detail: 'Need source review', icon: CirclePause, tone: 'amber' },
  ],
  '/administration': [
    { label: 'Audit events today', value: '1,142', detail: 'Privileged actions recorded', icon: ClipboardList, tone: 'blue' },
    { label: 'Running jobs', value: '12', detail: 'No failed jobs reported', icon: ArrowRightLeft, tone: 'teal' },
    { label: 'Integrations', value: '4', detail: 'Configured connectors', icon: Settings2, tone: 'purple' },
    { label: 'Import batches', value: '2', detail: 'Awaiting final review', icon: FileText, tone: 'amber' },
  ],
})

for (const group of genericOperationalGroups) {
  const parentMeta = pageMeta[group.basePath]
  const parentRows = moduleRows[group.basePath] ?? []
  const parentMetrics = moduleKpis[group.basePath] ?? []

  for (const [index, area] of group.items.entries()) {
    if (area.href === group.basePath) continue

    pageMeta[area.href] = { eyebrow: parentMeta.eyebrow, title: area.label, description: area.description }
    moduleIcons[area.href] = area.icon

    const areaReference = area.href.split('/').filter(Boolean).pop()?.split('-').map((part) => part.slice(0, 3).toUpperCase()).join('') ?? 'AREA'
    const rows: Array<Record<string, string>> = parentRows.map((row, rowIndex) => ({
      ...row,
      reference: `${areaReference}-${String(rowIndex + 1).padStart(3, '0')}`,
      applicant: `${area.label} · ${row.applicant}`,
    }))
    moduleRows[area.href] = rows

    const needsAttention = rows.filter((row) => /attention|pending|missing|hold/i.test(row.status)).length
    const underReview = rows.filter((row) => /review|draft/i.test(row.status)).length
    const focusMetric = parentMetrics[(index - 1) % Math.max(parentMetrics.length, 1)]
    moduleKpis[area.href] = [
      { label: area.label, value: focusMetric?.value ?? `${rows.length}`, detail: area.description, icon: area.icon, tone: 'blue' },
      { label: 'Needs attention', value: `${needsAttention}`, detail: 'Items requiring follow-up', icon: CirclePause, tone: 'amber' },
      { label: 'Under review', value: `${underReview}`, detail: 'Items in an approval queue', icon: ShieldCheck, tone: 'teal' },
      { label: 'Records in view', value: `${rows.length * 126 + 238}`, detail: 'Current operating cycle', icon: CalendarDays, tone: 'purple' },
    ]
  }
}

export const institutionDefaults = {
  name: 'Peculiar Metropolitan Institute',
  shortName: 'MMI',
  location: 'Kampala, Uganda',
  type: 'University',
  activeTerm: 'Semester II · 2025',
  phone: '+256 312 880 000',
  email: 'registry@mmi.ac.ug',
  address: 'Plot 24, University Avenue, Kampala',
  campusCount: '3 campuses',
  accreditation: 'NCHE-ready configuration',
  library: Library,
  institution: Building2,
}
