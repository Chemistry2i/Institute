export const permissionCatalog = [
  'dashboard.open',
  'dashboard.institution.read',
  'dashboard.academic.read',
  'dashboard.finance.read',
  'system.configure',
  'system.health.read',
  'institution.settings.read',
  'institution.profile.manage',
  'institution.structure.manage',
  'academics.settings.manage',
  'finance.settings.manage',
  'staff.settings.manage',
  'security.settings.manage',
  'communications.settings.manage',
  'library.settings.manage',
  'accommodation.settings.manage',
  'internships.settings.manage',
  'welfare.settings.manage',
  'procurement.settings.manage',
  'quality.settings.manage',
  'users.manage',
  'audit.read',
  'admissions.read',
  'admissions.review',
  'admissions.decide',
  'students.read',
  'students.manage',
  'students.self.read',
  'academics.read',
  'academics.manage',
  'registration.read',
  'registration.manage',
  'registration.review',
  'timetable.read',
  'timetable.manage',
  'attendance.read',
  'attendance.manage',
  'exams.read',
  'exams.manage',
  'results.read',
  'results.enter',
  'results.moderate',
  'results.approve',
  'results.publish',
  'results.correct',
  'results.published.read',
  'finance.read',
  'finance.manage',
  'payments.record',
  'payments.verify',
  'finance.approve',
  'finance.self.read',
  'reports.scope.read',
  'reports.institution.read',
  'reports.finance.read',
  'learning.read',
  'assignments.manage',
  'library.manage',
  'staff.manage',
  'accommodation.manage',
  'internships.manage',
  'research.manage',
  'quality.manage',
  'welfare.manage',
  'procurement.manage',
  'graduation.manage',
  'notifications.read',
] as const

export type Permission = (typeof permissionCatalog)[number]

export interface RoleProfile {
  label: string
  description: string
  scope: string
  permissions: Permission[]
  metrics: [string, string, string, string]
  responsibilities: [string, string, string]
}

const role = (
  label: string,
  description: string,
  scope: string,
  permissions: Permission[],
  metrics: RoleProfile['metrics'],
  responsibilities: RoleProfile['responsibilities'],
): RoleProfile => ({ label, description, scope, permissions, metrics, responsibilities })

const institutionRead: Permission[] = [
  'dashboard.open', 'dashboard.institution.read', 'reports.institution.read', 'notifications.read',
]
const academicRead: Permission[] = [
  'dashboard.open', 'dashboard.academic.read', 'students.read', 'academics.read', 'registration.read',
  'timetable.read', 'attendance.read', 'exams.read', 'results.read', 'reports.scope.read', 'notifications.read',
]
const studentAccess: Permission[] = [
  'dashboard.open', 'students.self.read', 'registration.read', 'timetable.read', 'attendance.read',
  'results.published.read', 'finance.self.read', 'learning.read', 'notifications.read',
]

export const roleProfiles = {
  superAdministrator: role('Super Administrator', 'Institution-wide system configuration and privileged operations.', 'Institution-wide', [
    'dashboard.open', 'dashboard.institution.read', 'system.configure', 'system.health.read', 'users.manage', 'audit.read',
    'institution.settings.read', 'institution.profile.manage', 'institution.structure.manage', 'academics.settings.manage',
    'finance.settings.manage', 'staff.settings.manage', 'security.settings.manage', 'communications.settings.manage',
    'library.settings.manage', 'accommodation.settings.manage', 'internships.settings.manage', 'welfare.settings.manage',
    'procurement.settings.manage', 'quality.settings.manage', 'reports.institution.read', 'notifications.read',
  ], ['Active accounts', 'Configuration tasks', 'Security events', 'Service health'], [
    'Configure institutional rules, roles and integrations.', 'Review privileged actions and security events.', 'Monitor service health and operational readiness.',
  ]),
  ictAdministrator: role('ICT Administrator', 'Technical account support, access administration and system operations.', 'Assigned technical scope', [
    'dashboard.open', 'system.health.read', 'users.manage', 'security.settings.manage', 'communications.settings.manage', 'audit.read', 'notifications.read',
  ], ['Accounts needing support', 'Access requests', 'System alerts', 'Integration health'], [
    'Manage accounts and access within assigned permissions.', 'Monitor operational errors and integrations.', 'Support recovery and technical service requests.',
  ]),
  institutionHead: role('Institution Head', 'Institution-wide oversight with high-level institution profile and structure configuration.', 'Institution-wide; school identity and structure settings', [
    ...institutionRead, 'dashboard.academic.read', 'dashboard.finance.read', 'reports.finance.read',
    'students.read', 'academics.read', 'results.read', 'institution.settings.read', 'institution.profile.manage', 'institution.structure.manage',
  ], ['Enrolled students', 'New admissions', 'Academic performance', 'Approved financial summary'], [
    'Configure institution identity and approved campus or structure details.', 'Review institutional enrolment and academic trends.', 'Review approved financial summaries and faculty performance.',
  ]),
  academicDirector: role('Deputy Head / Academic Director', 'Academic operations oversight and configured review workflows.', 'Institution or assigned academic scope', [
    ...academicRead, 'academics.settings.manage', 'admissions.read', 'registration.review', 'results.moderate', 'results.approve', 'graduation.manage',
  ], ['Applications to review', 'Registration progress', 'Results in review', 'Completion checks'], [
    'Monitor academic operations and programme progress.', 'Review examination processing and results.', 'Participate in configured academic approvals.',
  ]),
  academicRegistrar: role('Academic Registrar', 'Academic records, registration and authorised result administration.', 'Institution-wide academic scope', [
    ...academicRead, 'admissions.read', 'admissions.review', 'admissions.decide', 'students.manage', 'academics.manage',
    'registration.manage', 'registration.review', 'academics.settings.manage', 'results.approve', 'results.publish', 'results.correct', 'graduation.manage',
  ], ['Applications pending', 'Registrations pending', 'Results to approve', 'Graduation checks'], [
    'Maintain student records and academic calendars.', 'Supervise registration and result processing.', 'Coordinate progression and graduation checks.',
  ]),
  facultyRegistrar: role('Deputy / Faculty Registrar', 'Faculty-scoped student record and registration administration.', 'Assigned campus, faculty or department', [
    ...academicRead, 'admissions.review', 'students.manage', 'registration.manage', 'registration.review', 'academics.settings.manage',
  ], ['Applications assigned', 'Records to verify', 'Registrations to review', 'Faculty progression'], [
    'Verify records and applications within assigned scope.', 'Monitor registration compliance.', 'Prepare faculty-level academic reports.',
  ]),
  admissionsOfficer: role('Admissions Officer', 'Application document verification and admission processing.', 'Assigned intakes and programmes', [
    'dashboard.open', 'admissions.read', 'admissions.review', 'admissions.decide', 'students.read', 'reports.scope.read', 'notifications.read',
  ], ['Applications received', 'Awaiting review', 'Missing documents', 'Offers awaiting response'], [
    'Review applications and verify supporting documents.', 'Request missing information and record recommendations.', 'Process decisions through the configured approval workflow.',
  ]),
  dean: role('Dean / Head of Faculty', 'Faculty-level academic oversight and configured review.', 'Assigned faculty', [
    ...academicRead, 'admissions.read', 'academics.manage', 'academics.settings.manage', 'registration.review', 'results.moderate',
  ], ['Faculty enrolment', 'Course offerings', 'Results to moderate', 'Progression indicators'], [
    'Review faculty programmes and student cohorts.', 'Monitor course delivery and academic progress.', 'Participate in faculty approval workflows.',
  ]),
  headOfDepartment: role('Head of Department', 'Department academic coordination and result moderation.', 'Assigned department', [
    ...academicRead, 'academics.manage', 'academics.settings.manage', 'timetable.manage', 'results.moderate', 'assignments.manage',
  ], ['Department enrolment', 'Teaching allocations', 'Results to moderate', 'Missing marks'], [
    'Coordinate course offerings and lecturer assignments.', 'Review coursework and submitted marks.', 'Monitor department progression and workload.',
  ]),
  programmeCoordinator: role('Programme Coordinator', 'Programme curriculum, registration and completion monitoring.', 'Assigned programme', [
    ...academicRead, 'academics.manage', 'academics.settings.manage', 'registration.review', 'results.moderate',
  ], ['Programme cohort', 'Course registration', 'Curriculum coverage', 'Completion requirements'], [
    'Monitor curriculum delivery and course registration.', 'Track assigned student progress.', 'Coordinate programme teaching and assessment schedules.',
  ]),
  examinationOfficer: role('Examination Officer', 'Examination scheduling, submission tracking and authorised publication.', 'Assigned examination scope', [
    ...academicRead, 'timetable.manage', 'exams.manage', 'results.read', 'results.publish', 'reports.scope.read',
  ], ['Examination sessions', 'Missing mark lists', 'Results for approval', 'Publication status'], [
    'Coordinate examination timetables and attendance lists.', 'Track mark submissions and moderation.', 'Publish only results approved through policy.',
  ]),
  lecturer: role('Lecturer / Instructor', 'Assigned teaching, attendance, assessment and mark submission.', 'Assigned course units only', [
    'dashboard.open', 'academics.read', 'registration.read', 'timetable.read', 'attendance.read', 'attendance.manage',
    'results.enter', 'learning.read', 'assignments.manage', 'notifications.read',
  ], ['Assigned course units', 'Registered students', 'Upcoming assessments', 'Marks to submit'], [
    'View assigned courses, class lists and timetables.', 'Record attendance and assessment marks.', 'Submit results for moderation; cannot approve own submissions by default.',
  ]),
  academicAdviser: role('Class Tutor / Academic Adviser', 'Assigned-student support and permitted academic progress monitoring.', 'Assigned students only', [
    'dashboard.open', 'students.read', 'attendance.read', 'results.read', 'reports.scope.read', 'notifications.read',
  ], ['Assigned students', 'Attendance follow-ups', 'Progress alerts', 'Advising follow-ups'], [
    'Review permitted attendance and performance summaries.', 'Record authorised academic advising notes.', 'Refer students through approved support workflows.',
  ]),
  financeManager: role('Finance Manager / Bursar', 'Student accounts, reconciliations and authorised financial approvals.', 'Assigned finance scope', [
    'dashboard.open', 'dashboard.finance.read', 'finance.read', 'finance.manage', 'finance.settings.manage', 'payments.verify', 'finance.approve',
    'reports.finance.read', 'notifications.read',
  ], ['Total invoiced', 'Confirmed receipts', 'Outstanding balances', 'Reconciliation exceptions'], [
    'Manage approved fee structures and student accounts.', 'Review reconciliation and financial reports.', 'Approve adjustments and refunds within delegated authority.',
  ]),
  accountsOfficer: role('Accounts Officer / Cashier', 'Payment recording, verification and assigned account support.', 'Assigned accounts and tills', [
    'dashboard.open', 'finance.read', 'payments.record', 'payments.verify', 'reports.finance.read', 'notifications.read',
  ], ['Payments recorded', 'Awaiting verification', 'Daily confirmed receipts', 'Accounts assigned'], [
    'Record and verify payments using approved procedures.', 'Issue receipts for confirmed transactions.', 'Reconcile assigned transactions; refunds require separate permission.',
  ]),
  scholarshipOfficer: role('Scholarship / Sponsorship Officer', 'Scholarship applications, awards and funding allocation tracking.', 'Assigned awards and sponsors', [
    'dashboard.open', 'finance.read', 'reports.finance.read', 'notifications.read',
  ], ['Applications under review', 'Active awards', 'Funding allocations', 'Awards nearing expiry'], [
    'Review scholarship applications and approved awards.', 'Track award periods, limits and funding allocations.', 'Prepare authorised sponsor reports.',
  ]),
  humanResourcesOfficer: role('Human Resources Officer', 'Restricted staff profile, employment and leave administration.', 'Assigned HR scope', [
    'dashboard.open', 'staff.manage', 'staff.settings.manage', 'reports.scope.read', 'notifications.read',
  ], ['Staff records', 'Contracts to review', 'Leave requests', 'Qualifications to verify'], [
    'Maintain staff profiles and employment records.', 'Track qualifications, contracts and leave requests.', 'Access payroll only through separate permissions or integration.',
  ]),
  librarian: role('Librarian', 'Library catalogue, circulation and clearance operations.', 'Assigned library', [
    'dashboard.open', 'library.manage', 'library.settings.manage', 'reports.scope.read', 'notifications.read',
  ], ['Items on loan', 'Overdue items', 'Reservations', 'Clearance requests'], [
    'Maintain catalogues and circulation records.', 'Track returns, reservations and configured fines.', 'Process authorised library clearance.',
  ]),
  accommodationOfficer: role('Hostel / Accommodation Officer', 'Accommodation allocation, occupancy and check-in operations.', 'Assigned residences', [
    'dashboard.open', 'accommodation.manage', 'accommodation.settings.manage', 'reports.scope.read', 'notifications.read',
  ], ['Available beds', 'Allocation requests', 'Current occupancy', 'Check-outs due'], [
    'Manage rooms, capacity and allocation requests.', 'Record approved check-ins and check-outs.', 'Report occupancy and authorised accommodation charges.',
  ]),
  internshipCoordinator: role('Industrial Training / Internship Coordinator', 'Placement assignments, supervision and completion tracking.', 'Assigned programmes and placements', [
    'dashboard.open', 'internships.manage', 'internships.settings.manage', 'students.read', 'reports.scope.read', 'notifications.read',
  ], ['Active placements', 'Students awaiting placement', 'Logbooks to review', 'Completion reviews'], [
    'Manage placement organisations and supervisors.', 'Track logbooks, assessment submissions and placement dates.', 'Record placement completion and outstanding requirements.',
  ]),
  qualityAssuranceOfficer: role('Quality Assurance Officer', 'Programme evaluation, quality evidence and improvement actions.', 'Assigned quality scope', [
    'dashboard.open', 'quality.manage', 'quality.settings.manage', 'reports.scope.read', 'reports.institution.read', 'notifications.read',
  ], ['Evaluations open', 'Programmes under review', 'Improvement actions', 'Reports due'], [
    'Manage evaluations and quality-assurance records.', 'Review course and programme performance.', 'Track approved improvement actions and reporting.',
  ]),
  studentWelfareOfficer: role('Student Welfare / Counselling Officer', 'Strictly restricted support appointments, referrals and case follow-up.', 'Assigned welfare cases only', [
    'dashboard.open', 'welfare.manage', 'welfare.settings.manage', 'notifications.read',
  ], ['Appointments scheduled', 'Referrals to follow up', 'Open support cases', 'Follow-ups due'], [
    'Manage support appointments and approved referrals.', 'Maintain restricted welfare records with access auditing.', 'Do not disclose case details in general academic reports.',
  ]),
  procurementOfficer: role('Procurement / Inventory Officer', 'Inventory, requisitions, assets and approved procurement tracking.', 'Assigned procurement scope', [
    'dashboard.open', 'procurement.manage', 'procurement.settings.manage', 'reports.scope.read', 'notifications.read',
  ], ['Requisitions pending', 'Orders in progress', 'Low-stock alerts', 'Assets to verify'], [
    'Maintain supplier, inventory and asset records.', 'Track requisitions and approved stock movements.', 'Prepare procurement reports within assigned permissions.',
  ]),
  student: role('Student', 'Personal academic, registration, timetable and confirmed account information.', 'Own authenticated student record only', studentAccess, [
    'Current programme', 'Registration status', 'Published results', 'Outstanding balance',
  ], [
    'Review personal registration, timetable and published results.', 'Access approved learning materials and announcements.', 'View invoices and confirmed payments for own account only.',
  ]),
  parentSponsorGuardian: role('Parent / Sponsor / Guardian', 'Consent-based, student-linked information with explicitly limited visibility.', 'Linked student and active consent only', [
    'dashboard.open', 'finance.self.read', 'notifications.read',
  ], ['Linked students', 'Permitted fee statements', 'Payment notifications', 'Consent status'], [
    'View only information explicitly shared by the linked student.', 'Review permitted fee statements and payment notifications.', 'Academic details remain restricted by consent and institutional policy.',
  ]),
  auditor: role('Auditor', 'Read-only review of explicitly authorised audit, academic and financial records.', 'Approved audit scope, read-only', [
    'dashboard.open', 'audit.read', 'reports.scope.read', 'reports.finance.read', 'results.read', 'finance.read',
  ], ['Audit events to review', 'Financial records in scope', 'Academic records in scope', 'Export requests'], [
    'Review authorised audit, financial and academic records.', 'Export only reports within the approved scope.', 'Audit access is itself logged.',
  ]),
} satisfies Record<string, RoleProfile>

export type RoleId = keyof typeof roleProfiles
