import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBook,
  faBookOpen,
  faBriefcase,
  faBuilding,
  faCalendarDays,
  faChartLine,
  faClipboardCheck,
  faClipboardList,
  faClock,
  faFileLines,
  faGear,
  faGraduationCap,
  faHeart,
  faHouse,
  faShieldHalved,
  faUsers,
  faWallet,
} from '@fortawesome/free-solid-svg-icons'
import type { Permission } from './roles'

export interface NavigationItem {
  label: string
  path: string
  group: string
  icon: IconDefinition
  permissions: Permission[]
}

const item = (
  label: string,
  path: string,
  group: string,
  icon: IconDefinition,
  ...permissions: Permission[]
): NavigationItem => ({ label, path, group, icon, permissions })

export const navigationItems: NavigationItem[] = [
  item('Overview', '/', 'Workspace', faChartLine, 'dashboard.open'),
  item('Admissions', '/admissions', 'Academic', faClipboardList, 'admissions.read'),
  item('Students', '/students', 'Academic', faUsers, 'students.read', 'students.self.read'),
  item('Academics', '/academics', 'Academic', faBookOpen, 'academics.read'),
  item('Registration', '/registration', 'Academic', faCalendarDays, 'registration.read'),
  item('Timetabling', '/timetabling', 'Academic', faClock, 'timetable.read'),
  item('Attendance', '/attendance', 'Academic', faClipboardCheck, 'attendance.read', 'attendance.manage'),
  item('Examinations', '/examinations', 'Academic', faGraduationCap, 'exams.read'),
  item('Results', '/results', 'Academic', faFileLines, 'results.read', 'results.published.read', 'results.enter', 'results.moderate', 'results.approve'),
  item('Finance', '/finance', 'Administration', faWallet, 'finance.read', 'finance.self.read'),
  item('Library', '/library', 'Student services', faBook, 'library.manage'),
  item('Human resources', '/hr', 'Administration', faBriefcase, 'staff.manage'),
  item('Accommodation', '/accommodation', 'Student services', faHouse, 'accommodation.manage'),
  item('Internships', '/internships', 'Student services', faBuilding, 'internships.manage'),
  item('Welfare', '/welfare', 'Student services', faHeart, 'welfare.manage'),
  item('Reports', '/reports', 'Administration', faChartLine, 'reports.scope.read', 'reports.institution.read', 'reports.finance.read'),
  item('Audit', '/audit', 'Administration', faShieldHalved, 'audit.read'),
  item('Settings', '/settings', 'Administration', faGear, 'system.configure', 'users.manage'),
]