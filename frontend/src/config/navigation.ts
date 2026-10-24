import {
  BarChart3,
  Book,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileText,
  GraduationCap,
  Heart,
  House,
  Settings2,
  ShieldCheck,
  UsersRound,
  WalletCards,
  type LucideIcon,
  Award,
} from 'lucide-react'
import type { Permission } from './roles'

export interface NavigationItem {
  label: string
  path: string
  group: string
  icon: LucideIcon
  permissions: Permission[]
}

const item = (
  label: string,
  path: string,
  group: string,
  icon: LucideIcon,
  ...permissions: Permission[]
): NavigationItem => ({ label, path, group, icon, permissions })

export const navigationItems: NavigationItem[] = [
  item('Overview', '/', 'Workspace', BarChart3, 'dashboard.open'),
  item('Admissions', '/admissions', 'Academic', ClipboardList, 'admissions.read'),
  item('Students', '/students', 'Academic', UsersRound, 'students.read', 'students.self.read'),
  item('Academics', '/academics', 'Academic', BookOpen, 'academics.read'),
  item('Registration', '/registration', 'Academic', CalendarDays, 'registration.read'),
  item('Timetabling', '/timetabling', 'Academic', Clock3, 'timetable.read'),
  item('Attendance', '/attendance', 'Academic', ClipboardCheck, 'attendance.read', 'attendance.manage'),
  item('Examinations', '/examinations', 'Academic', GraduationCap, 'exams.read'),
  item('Results', '/results', 'Academic', FileText, 'results.read', 'results.published.read', 'results.enter', 'results.moderate', 'results.approve'),
  item('Graduation', '/graduation', 'Academic', Award, 'graduation.manage'),
  item('Finance', '/finance', 'Administration', WalletCards, 'finance.read', 'finance.self.read'),
  item('Library', '/library', 'Student services', Book, 'library.manage'),
  item('Human resources', '/hr', 'Administration', BriefcaseBusiness, 'staff.manage'),
  item('Accommodation', '/accommodation', 'Student services', House, 'accommodation.manage'),
  item('Internships', '/internships', 'Student services', Building2, 'internships.manage'),
  item('Welfare', '/welfare', 'Student services', Heart, 'welfare.manage'),
  item('Reports', '/reports', 'Administration', BarChart3, 'reports.scope.read', 'reports.institution.read', 'reports.finance.read'),
  item('Audit', '/audit', 'Administration', ShieldCheck, 'audit.read'),
  item(
    'Settings',
    '/settings',
    'Administration',
    Settings2,
    'system.configure',
    'users.manage',
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
  ),
]