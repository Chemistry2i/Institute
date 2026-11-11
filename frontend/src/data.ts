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

export interface ActivityItem {
  title: string
  detail: string
  time: string
  tone: 'blue' | 'teal' | 'amber' | 'violet'
  icon: LucideIcon
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'dashboard.view' },
  { label: 'Admissions', href: '/admissions', icon: ClipboardList, permission: 'admissions.view', badge: '24' },
  { label: 'Students', href: '/students', icon: UsersRound, permission: 'students.view' },
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
  '/students': { eyebrow: 'Student information', title: 'Student records', description: 'A governed view of active, graduating, and at-risk student records.' },
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
  '/timetabling': { eyebrow: 'Teaching operations', title: 'Timetabling', description: 'Coordinate rooms, lecturers, exam slots, and conflict-free academic schedules.' },
  '/attendance': { eyebrow: 'Teaching operations', title: 'Attendance', description: 'Monitor attendance sessions, corrections, and student participation signals.' },
  '/examinations': { eyebrow: 'Assessment & results', title: 'Examinations', description: 'Monitor marks entry, moderation, approvals, and publication readiness.' },
  '/finance': { eyebrow: 'Student finance', title: 'Finance overview', description: 'See fees, reconciliations, collections, and student account exceptions.' },
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
}

export const moduleRows: Record<string, Array<Record<string, string>>> = {
  '/admissions': [
    { reference: 'APP-2025-0942', applicant: 'Grace Nabbosa', programme: 'BSc Computer Science', intake: 'August 2025', status: 'Under review' },
    { reference: 'APP-2025-0938', applicant: 'Isaac Kato', programme: 'Diploma in Business', intake: 'August 2025', status: 'Missing documents' },
    { reference: 'APP-2025-0926', applicant: 'Lydia Auma', programme: 'Bachelor of Education', intake: 'August 2025', status: 'Offer ready' },
    { reference: 'APP-2025-0890', applicant: 'Moses Tumusiime', programme: 'BSc Information Technology', intake: 'August 2025', status: 'Accepted' },
  ],
  '/academics': [
    { reference: 'BSC-CS', applicant: 'BSc Computer Science', programme: 'Faculty of Computing', intake: '4 years · 128 credits', status: 'Active' },
    { reference: 'BBA', applicant: 'Bachelor of Business Admin', programme: 'Faculty of Business', intake: '3 years · 108 credits', status: 'Active' },
    { reference: 'DCS', applicant: 'Diploma in Computing', programme: 'Faculty of Computing', intake: '2 years · 80 credits', status: 'Draft' },
    { reference: 'BED', applicant: 'Bachelor of Education', programme: 'Faculty of Education', intake: '4 years · 132 credits', status: 'Active' },
  ],
  '/academics/institutions': [
    { reference: 'MMI', applicant: 'Makerere Metropolitan Institute', programme: 'Kampala, Uganda', intake: 'University', status: 'Active' },
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
    { reference: 'TT-2025-08', applicant: 'Semester II timetable', programme: '412 teaching sessions', intake: '18 venues · 3 campuses', status: 'Published' },
    { reference: 'TT-ROOM-12', applicant: 'Room conflicts', programme: '12 clashes detected', intake: 'Registrar review', status: 'Needs attention' },
    { reference: 'TT-EXAM-04', applicant: 'Examination schedule', programme: '86 exam slots', intake: 'November 2025', status: 'Under review' },
    { reference: 'TT-LECT-19', applicant: 'Lecturer availability', programme: '19 exceptions', intake: 'Faculty review', status: 'Draft' },
  ],
  '/attendance': [
    { reference: 'ATT-2025-081', applicant: 'Attendance sessions', programme: '186 sessions this week', intake: 'Semester II · 2025', status: 'Active' },
    { reference: 'ATT-LOW-22', applicant: 'Low attendance alerts', programme: '22 students below threshold', intake: 'Academic adviser queue', status: 'Needs attention' },
    { reference: 'ATT-COR-08', applicant: 'Correction requests', programme: '8 authorised requests', intake: 'Registrar review', status: 'Under review' },
    { reference: 'ATT-RPT-02', applicant: 'Attendance summary', programme: 'All faculties', intake: 'Updated today', status: 'Ready' },
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

export const moduleIcons: Record<string, LucideIcon> = {
  '/admissions': ClipboardList,
  '/students': UserRound,
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
  '/timetabling': ClipboardList,
  '/attendance': UsersRound,
  '/examinations': ClipboardList,
  '/finance': CreditCard,
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

export const institutionDefaults = {
  name: 'Makerere Metropolitan Institute',
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
